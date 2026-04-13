using System.IO.Compression;
using System.Text.Json;
using Microsoft.AspNetCore.Hosting;
using Microsoft.EntityFrameworkCore;
using MustGraduationPlatform.Application.Abstractions;
using MustGraduationPlatform.Application.Dtos;
using MustGraduationPlatform.Application.Exceptions;
using MustGraduationPlatform.Domain.Entities;
using MustGraduationPlatform.Infrastructure.Persistence;
using MustGraduationPlatform.Infrastructure.Storage;

namespace MustGraduationPlatform.Infrastructure.Services;

public class ProjectSubmissionService : IProjectSubmissionService
{
    private readonly AppDbContext _db;
    private readonly IFileStorage _files;
    private readonly IWebHostEnvironment _env;

    private static readonly JsonSerializerOptions AttachmentsJsonOptions = new()
    {
        PropertyNamingPolicy = JsonNamingPolicy.CamelCase
    };

    public ProjectSubmissionService(AppDbContext db, IFileStorage files, IWebHostEnvironment env)
    {
        _db = db;
        _files = files;
        _env = env;
    }

    public async Task<IReadOnlyList<ProjectSubmissionDto>> GetAsync(string? type, CancellationToken ct = default)
    {
        var q = _db.ProjectSubmissions.AsQueryable();
        if (!string.IsNullOrEmpty(type))
            q = q.Where(s => s.Type == type);
        var list = await q.OrderByDescending(s => s.SubmissionDate).ToListAsync(ct);
        return list.Select(EntityMappers.ToDto).ToList();
    }

    public Task<ProjectSubmissionDto> CreateAsync(ProjectSubmissionCreateDto dto, CancellationToken ct = default)
        => SaveAsync(dto, dto.FileName, fileStorageUrl: null, attachmentsJson: null, ct);

    public async Task<ProjectSubmissionDto> CreateWithFileAsync(
        ProjectSubmissionCreateDto dto,
        Stream fileStream,
        string originalFileName,
        string? contentType,
        CancellationToken ct = default)
    {
        SubmissionFileValidation.ValidateOrThrow(originalFileName, fileStream.Length);
        var safeName = SubmissionFileValidation.SanitizeFileName(originalFileName);
        var relativePath = $"{dto.Type}/{DateTime.UtcNow:yyyy/MM}/{Guid.NewGuid()}_{safeName}";

        var publicUrl = await _files.SaveAsync(relativePath, fileStream, ct);
        return await SaveAsync(dto, safeName, publicUrl, attachmentsJson: null, ct);
    }

    public async Task<ProjectSubmissionDto> CreateWithFilesAsync(
        ProjectSubmissionCreateDto dto,
        IReadOnlyList<(Stream Stream, string OriginalName, string? ContentType)> files,
        CancellationToken ct = default)
    {
        if (files.Count == 0)
            throw new AppException("FILES_REQUIRED", "At least one file is required.");

        var parts = new List<SubmissionAttachmentDto>();
        foreach (var (stream, originalName, _) in files)
        {
            SubmissionFileValidation.ValidateOrThrow(originalName, stream.Length);
            var safeName = SubmissionFileValidation.SanitizeFileName(originalName);
            var relativePath = $"{dto.Type}/{DateTime.UtcNow:yyyy/MM}/{Guid.NewGuid()}_{safeName}";
            if (stream.CanSeek)
                stream.Position = 0;
            var publicUrl = await _files.SaveAsync(relativePath, stream, ct);
            parts.Add(new SubmissionAttachmentDto(safeName, publicUrl));
        }

        var json = JsonSerializer.Serialize(parts, AttachmentsJsonOptions);
        var displayName = parts.Count == 1
            ? parts[0].FileName
            : $"{parts[0].FileName} (+{parts.Count - 1})";

        return await SaveAsync(dto, displayName, parts[0].FileUrl, json, ct);
    }

    public async Task<Stream?> GetAttachmentsZipStreamAsync(int id, CancellationToken ct = default)
    {
        var e = await _db.ProjectSubmissions.AsNoTracking().FirstOrDefaultAsync(s => s.Id == id, ct);
        if (e is null) return null;

        var attachments = EntityMappers.BuildSubmissionAttachmentsList(e);
        if (attachments is null || attachments.Count == 0) return null;

        var webRoot = _env.WebRootPath;
        if (string.IsNullOrEmpty(webRoot))
            webRoot = Path.Combine(_env.ContentRootPath, "wwwroot");

        var ms = new MemoryStream();
        using (var zip = new ZipArchive(ms, ZipArchiveMode.Create, leaveOpen: true))
        {
            var index = 1;
            foreach (var a in attachments)
            {
                var physical = ToPhysicalPath(webRoot, a.FileUrl);
                if (physical is null || !File.Exists(physical)) continue;
                var entryName = $"{index}_{SanitizeZipEntryName(a.FileName)}";
                var entry = zip.CreateEntry(entryName);
                await using (var es = entry.Open())
                await using (var fs = new FileStream(physical, FileMode.Open, FileAccess.Read, FileShare.Read))
                    await fs.CopyToAsync(es, ct);
                index++;
            }
        }

        ms.Position = 0;
        if (ms.Length == 0)
        {
            await ms.DisposeAsync();
            return null;
        }

        return ms;
    }

    private static string SanitizeZipEntryName(string name)
    {
        foreach (var c in Path.GetInvalidFileNameChars())
            name = name.Replace(c, '_');
        return string.IsNullOrWhiteSpace(name) ? "file" : name;
    }

    private static string? ToPhysicalPath(string webRoot, string publicUrl)
    {
        if (string.IsNullOrWhiteSpace(publicUrl)) return null;
        var trim = publicUrl.TrimStart('/').Replace('/', Path.DirectorySeparatorChar);
        return Path.Combine(webRoot, trim);
    }

    private async Task<ProjectSubmissionDto> SaveAsync(
        ProjectSubmissionCreateDto dto,
        string fileName,
        string? fileStorageUrl,
        string? attachmentsJson,
        CancellationToken ct)
    {
        var e = new ProjectSubmission
        {
            Type = dto.Type,
            StudentName = dto.StudentName,
            Email = dto.Email,
            ProjectNumber = dto.ProjectNumber,
            ProjectTitle = dto.ProjectTitle,
            SupervisorName = dto.SupervisorName,
            TeamLeaderName = dto.TeamLeaderName,
            FileName = fileName,
            FileStoragePath = fileStorageUrl,
            AttachmentsJson = attachmentsJson,
            Notes = dto.Notes,
            RegistrationPayloadJson = null,
            Status = "Pending",
            SubmissionDate = DateTime.UtcNow
        };
        _db.ProjectSubmissions.Add(e);
        await _db.SaveChangesAsync(ct);
        return EntityMappers.ToDto(e);
    }

    public async Task<ProjectSubmissionDto> CreateIdeaRegistrationAsync(
        IdeaRegistrationSubmitDto dto,
        string? studentEmail,
        CancellationToken ct = default)
    {
        var n = dto.Students.Count;
        if (n is < 5 or > 7)
            throw new AppException("VALIDATION_TEAM_SIZE", "Team must have between 5 and 7 students.");

        var json = JsonSerializer.Serialize(dto, new JsonSerializerOptions { PropertyNamingPolicy = JsonNamingPolicy.CamelCase });
        var leader = dto.Students[0];
        var leaderName = leader.StudentName.Trim();
        var firstToken = leaderName.Split(' ', StringSplitOptions.RemoveEmptyEntries).FirstOrDefault() ?? leaderName;

        var e = new ProjectSubmission
        {
            Type = "idea_registration",
            StudentName = leaderName,
            Email = studentEmail,
            ProjectNumber = null,
            ProjectTitle = dto.TitleEn.Trim(),
            SupervisorName = dto.SupervisorName.Trim(),
            TeamLeaderName = firstToken,
            FileName = "-",
            FileStoragePath = null,
            AttachmentsJson = null,
            Notes = string.Empty,
            RegistrationPayloadJson = json,
            Status = "Pending",
            SubmissionDate = DateTime.UtcNow
        };
        _db.ProjectSubmissions.Add(e);
        await _db.SaveChangesAsync(ct);
        return EntityMappers.ToDto(e);
    }

    public async Task<ProjectSubmissionDto?> UpdateStatusAsync(int id, ProjectSubmissionStatusUpdateDto dto, CancellationToken ct = default)
    {
        var e = await _db.ProjectSubmissions.FindAsync(new object[] { id }, ct);
        if (e is null) return null;
        e.Status = dto.Status;
        await _db.SaveChangesAsync(ct);
        return EntityMappers.ToDto(e);
    }

    public async Task<bool> DeleteAsync(int id, CancellationToken ct = default)
    {
        var e = await _db.ProjectSubmissions.FindAsync(new object[] { id }, ct);
        if (e is null) return false;
        _db.ProjectSubmissions.Remove(e);
        await _db.SaveChangesAsync(ct);
        return true;
    }
}
