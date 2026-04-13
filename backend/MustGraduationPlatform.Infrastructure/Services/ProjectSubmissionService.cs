using System.Text.Json;
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

    public ProjectSubmissionService(AppDbContext db, IFileStorage files)
    {
        _db = db;
        _files = files;
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
        => SaveAsync(dto, dto.FileName, fileStorageUrl: null, ct);

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
        return await SaveAsync(dto, safeName, publicUrl, ct);
    }

    private async Task<ProjectSubmissionDto> SaveAsync(
        ProjectSubmissionCreateDto dto,
        string fileName,
        string? fileStorageUrl,
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
            Type = "proposal",
            StudentName = leaderName,
            Email = studentEmail,
            ProjectNumber = null,
            ProjectTitle = dto.TitleEn.Trim(),
            SupervisorName = dto.SupervisorName.Trim(),
            TeamLeaderName = firstToken,
            FileName = "-",
            FileStoragePath = null,
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
