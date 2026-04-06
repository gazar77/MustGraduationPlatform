using System.Text.Json;
using Microsoft.EntityFrameworkCore;
using MustGraduationPlatform.Application.Abstractions;
using MustGraduationPlatform.Application.Dtos;
using MustGraduationPlatform.Domain.Entities;
using MustGraduationPlatform.Infrastructure.Persistence;

namespace MustGraduationPlatform.Infrastructure.Services;

public class IdeaService : IIdeaService
{
    private static readonly JsonSerializerOptions Json = new() { PropertyNamingPolicy = JsonNamingPolicy.CamelCase };

    private readonly AppDbContext _db;

    public IdeaService(AppDbContext db)
    {
        _db = db;
    }

    public async Task<IReadOnlyList<IdeaDto>> GetVisibleAsync(CancellationToken ct = default)
    {
        var list = await _db.Ideas
            .Where(i => i.IsVisible)
            .OrderBy(i => i.DisplayOrder)
            .ToListAsync(ct);
        return list.Select(EntityMappers.ToDto).ToList();
    }

    public async Task<IReadOnlyList<IdeaDto>> GetAllAsync(CancellationToken ct = default)
    {
        var list = await _db.Ideas.OrderBy(i => i.DisplayOrder).ToListAsync(ct);
        return list.Select(EntityMappers.ToDto).ToList();
    }

    public async Task<IReadOnlyList<IdeaDto>> GetForSupervisorAsync(string supervisorName, CancellationToken ct = default)
    {
        var name = supervisorName.Trim();
        var list = await _db.Ideas
            .Where(i => i.SupervisorName == name)
            .OrderBy(i => i.DisplayOrder)
            .ToListAsync(ct);
        return list.Select(EntityMappers.ToDto).ToList();
    }

    public async Task<IdeaDto?> GetByIdAsync(int id, CancellationToken ct = default)
    {
        var e = await _db.Ideas.FindAsync(new object[] { id }, ct);
        return e is null ? null : EntityMappers.ToDto(e);
    }

    public async Task<IdeaDto> CreateAsync(IdeaCreateUpdateDto dto, CancellationToken ct = default)
    {
        var e = new Idea
        {
            Title = dto.Title,
            Description = dto.Description,
            Category = dto.Category,
            Difficulty = dto.Difficulty,
            RequiredSkillsJson = JsonSerializer.Serialize(dto.RequiredSkills, Json),
            MaxTeamSize = dto.MaxTeamSize,
            SupervisorDoctorId = dto.SupervisorDoctorId,
            SupervisorName = dto.SupervisorName,
            CreatedAt = DateTime.UtcNow,
            Status = dto.Status,
            IsVisible = dto.IsVisible,
            DisplayOrder = dto.DisplayOrder
        };
        _db.Ideas.Add(e);
        await _db.SaveChangesAsync(ct);
        return EntityMappers.ToDto(e);
    }

    public async Task<IdeaDto> CreateStudentSubmissionAsync(IdeaStudentSubmitDto dto, CancellationToken ct = default)
    {
        var create = new IdeaCreateUpdateDto(
            Title: dto.Title,
            Description: dto.Description,
            Category: dto.Category,
            Difficulty: "Medium",
            RequiredSkills: Array.Empty<string>(),
            MaxTeamSize: dto.MaxTeamSize,
            SupervisorDoctorId: null,
            SupervisorName: dto.SupervisorName,
            Status: "Open",
            IsVisible: false,
            DisplayOrder: 0);
        return await CreateAsync(create, ct);
    }

    public async Task<IdeaDto?> UpdateAsync(int id, IdeaCreateUpdateDto dto, CancellationToken ct = default)
    {
        var e = await _db.Ideas.FindAsync(new object[] { id }, ct);
        if (e is null) return null;
        e.Title = dto.Title;
        e.Description = dto.Description;
        e.Category = dto.Category;
        e.Difficulty = dto.Difficulty;
        e.RequiredSkillsJson = JsonSerializer.Serialize(dto.RequiredSkills, Json);
        e.MaxTeamSize = dto.MaxTeamSize;
        e.SupervisorDoctorId = dto.SupervisorDoctorId;
        e.SupervisorName = dto.SupervisorName;
        e.Status = dto.Status;
        e.IsVisible = dto.IsVisible;
        e.DisplayOrder = dto.DisplayOrder;
        await _db.SaveChangesAsync(ct);
        return EntityMappers.ToDto(e);
    }

    public async Task<bool> DeleteAsync(int id, CancellationToken ct = default)
    {
        var e = await _db.Ideas.FindAsync(new object[] { id }, ct);
        if (e is null) return false;
        _db.Ideas.Remove(e);
        await _db.SaveChangesAsync(ct);
        return true;
    }

    public async Task<IdeaDto?> ToggleVisibilityAsync(int id, CancellationToken ct = default)
    {
        var e = await _db.Ideas.FindAsync(new object[] { id }, ct);
        if (e is null) return null;
        e.IsVisible = !e.IsVisible;
        await _db.SaveChangesAsync(ct);
        return EntityMappers.ToDto(e);
    }
}
