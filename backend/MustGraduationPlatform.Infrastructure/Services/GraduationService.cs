using System.Security.Claims;
using System.Text.Json;
using System.Text.RegularExpressions;
using Microsoft.EntityFrameworkCore;
using MustGraduationPlatform.Application.Abstractions;
using MustGraduationPlatform.Application.Dtos;
using MustGraduationPlatform.Application.Exceptions;
using MustGraduationPlatform.Domain.Entities;
using MustGraduationPlatform.Domain.Enums;
using MustGraduationPlatform.Infrastructure.Persistence;
using MustGraduationPlatform.Infrastructure.Storage;

namespace MustGraduationPlatform.Infrastructure.Services;

public class GraduationService : IGraduationService
{
    private static readonly JsonSerializerOptions Json = new() { PropertyNamingPolicy = JsonNamingPolicy.CamelCase };

    private readonly AppDbContext _db;
    private readonly IFileStorage _files;
    private readonly IAuthService _auth;

    public GraduationService(AppDbContext db, IFileStorage files, IAuthService auth)
    {
        _db = db;
        _files = files;
        _auth = auth;
    }

    public async Task<GraduationProjectDto?> GetMyProjectAsync(ClaimsPrincipal principal, CancellationToken ct = default)
    {
        var user = await _auth.GetCurrentUserAsync(principal, ct);
        if (user is null)
            throw new AppException("AUTH_UNAUTHORIZED", "Not authenticated.");
        if (user.Role != UserRole.Student.ToString())
            return null;

        var email = user.Email.Trim();
        var proposals = await _db.Proposals.OrderByDescending(p => p.SubmissionDate).ToListAsync(ct);
        Proposal? match = null;
        foreach (var p in proposals)
        {
            var members = JsonSerializer.Deserialize<string[]>(p.MembersJson, Json) ?? Array.Empty<string>();
            if (members.Any(m => MemberContainsEmail(m, email)))
            {
                match = p;
                break;
            }
        }

        if (match is null)
        {
            var sub = await _db.ProjectSubmissions
                .Where(s => s.Email != null && s.Email.ToUpper() == email.ToUpperInvariant())
                .OrderByDescending(s => s.SubmissionDate)
                .FirstOrDefaultAsync(ct);
            if (sub is null || string.IsNullOrWhiteSpace(sub.ProjectTitle))
                return null;

            var students = new List<GraduationTeamMemberDto>();
            if (!string.IsNullOrWhiteSpace(sub.TeamLeaderName))
                students.Add(new GraduationTeamMemberDto("0001", sub.TeamLeaderName.Trim(), "—"));
            if (students.Count == 0 && !string.IsNullOrWhiteSpace(sub.StudentName))
                students.Add(new GraduationTeamMemberDto("0001", sub.StudentName.Trim(), "—"));

            return new GraduationProjectDto(
                sub.ProjectTitle!,
                "—",
                sub.SupervisorName ?? "",
                students);
        }

        var memberStrings = JsonSerializer.Deserialize<string[]>(match.MembersJson, Json) ?? Array.Empty<string>();
        var team = memberStrings.Select((m, i) => MemberToDto(m, match.Department, i)).ToList();
        if (team.Count == 0)
            team.Add(new GraduationTeamMemberDto("0001", email, match.Department));

        return new GraduationProjectDto(match.ProjectName, match.Department, match.ProposedSupervisor, team);
    }

    public async Task<IReadOnlyList<GraduationRequirementFileDto>> GetMyRequirementFilesAsync(ClaimsPrincipal principal, CancellationToken ct = default)
    {
        var user = await _auth.GetCurrentUserAsync(principal, ct);
        if (user is null)
            throw new AppException("AUTH_UNAUTHORIZED", "Not authenticated.");
        if (user.Role != UserRole.Student.ToString())
            return Array.Empty<GraduationRequirementFileDto>();

        var uid = user.Id;
        var list = await _db.GraduationRequirementFiles
            .Where(f => f.UserId == uid)
            .OrderByDescending(f => f.UploadedAt)
            .ToListAsync(ct);
        return list.Select(f => new GraduationRequirementFileDto(f.Id, f.RequirementKey, f.FileName, f.FileUrl, f.UploadedAt)).ToList();
    }

    public async Task<GraduationRequirementFileDto> UploadRequirementAsync(
        ClaimsPrincipal principal,
        string requirementKey,
        Stream fileStream,
        long fileLength,
        string fileName,
        string? contentType,
        CancellationToken ct = default)
    {
        var user = await _auth.GetCurrentUserAsync(principal, ct);
        if (user is null)
            throw new AppException("AUTH_UNAUTHORIZED", "Not authenticated.");
        if (user.Role != UserRole.Student.ToString())
            throw new AppException("AUTH_FORBIDDEN", "Only students can upload requirement files.");

        var key = (requirementKey ?? "").Trim();
        if (key.Length == 0 || key.Length > 32)
            throw new AppException("VALIDATION_REQUIREMENT", "Invalid requirement key.");

        SubmissionFileValidation.ValidateOrThrow(fileName, fileLength);
        var safe = SubmissionFileValidation.SanitizeFileName(fileName);
        var relativePath = $"graduation-requirements/{DateTime.UtcNow:yyyy/MM}/{user.Id:N}_{key}_{safe}";

        var existing = await _db.GraduationRequirementFiles
            .Where(x => x.UserId == user.Id && x.RequirementKey == key)
            .ToListAsync(ct);
        if (existing.Count > 0)
            _db.GraduationRequirementFiles.RemoveRange(existing);

        var url = await _files.SaveAsync(relativePath, fileStream, ct);
        var entity = new GraduationRequirementFile
        {
            UserId = user.Id,
            RequirementKey = key,
            FileName = safe,
            FileUrl = url,
            UploadedAt = DateTime.UtcNow
        };
        _db.GraduationRequirementFiles.Add(entity);
        await _db.SaveChangesAsync(ct);

        return new GraduationRequirementFileDto(entity.Id, entity.RequirementKey, entity.FileName, entity.FileUrl, entity.UploadedAt);
    }

    private static bool MemberContainsEmail(string member, string email)
    {
        if (string.IsNullOrWhiteSpace(member))
            return false;
        return member.Contains(email, StringComparison.OrdinalIgnoreCase);
    }

    private static GraduationTeamMemberDto MemberToDto(string member, string fallbackDepartment, int index)
    {
        var emailMatch = Regex.Match(member, @"[\w.+-]+@must\.edu\.eg", RegexOptions.IgnoreCase);
        var idMatch = Regex.Match(member, @"\b(\d{6,})\b");
        var name = member.Trim();
        if (emailMatch.Success)
        {
            var idx = member.IndexOf(emailMatch.Value, StringComparison.OrdinalIgnoreCase);
            if (idx > 0)
                name = member[..idx].Trim().Trim('(', '[', '-', ' ', '،');
        }

        if (string.IsNullOrWhiteSpace(name))
            name = member;

        return new GraduationTeamMemberDto(
            idMatch.Success ? idMatch.Groups[1].Value : (index + 1).ToString("D4"),
            name,
            fallbackDepartment);
    }
}
