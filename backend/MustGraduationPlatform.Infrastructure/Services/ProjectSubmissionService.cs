using Microsoft.EntityFrameworkCore;
using MustGraduationPlatform.Application.Abstractions;
using MustGraduationPlatform.Application.Dtos;
using MustGraduationPlatform.Domain.Entities;
using MustGraduationPlatform.Infrastructure.Persistence;

namespace MustGraduationPlatform.Infrastructure.Services;

public class ProjectSubmissionService : IProjectSubmissionService
{
    private readonly AppDbContext _db;

    public ProjectSubmissionService(AppDbContext db)
    {
        _db = db;
    }

    public async Task<IReadOnlyList<ProjectSubmissionDto>> GetAsync(string? type, CancellationToken ct = default)
    {
        var q = _db.ProjectSubmissions.AsQueryable();
        if (!string.IsNullOrEmpty(type))
            q = q.Where(s => s.Type == type);
        var list = await q.OrderByDescending(s => s.SubmissionDate).ToListAsync(ct);
        return list.Select(EntityMappers.ToDto).ToList();
    }

    public async Task<ProjectSubmissionDto> CreateAsync(ProjectSubmissionCreateDto dto, CancellationToken ct = default)
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
            FileName = dto.FileName,
            Notes = dto.Notes,
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
