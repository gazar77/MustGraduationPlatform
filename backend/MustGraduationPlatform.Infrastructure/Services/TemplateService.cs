using Microsoft.EntityFrameworkCore;
using MustGraduationPlatform.Application.Abstractions;
using MustGraduationPlatform.Application.Dtos;
using MustGraduationPlatform.Domain.Entities;
using MustGraduationPlatform.Infrastructure.Persistence;

namespace MustGraduationPlatform.Infrastructure.Services;

public class TemplateService : ITemplateService
{
    private readonly AppDbContext _db;

    public TemplateService(AppDbContext db)
    {
        _db = db;
    }

    public async Task<IReadOnlyList<TemplateDto>> GetVisibleAsync(CancellationToken ct = default)
    {
        var list = await _db.DocumentTemplates.Where(t => t.IsVisible).OrderBy(t => t.DisplayOrder).ToListAsync(ct);
        return list.Select(EntityMappers.ToDto).ToList();
    }

    public async Task<IReadOnlyList<TemplateDto>> GetAllAsync(CancellationToken ct = default)
    {
        var list = await _db.DocumentTemplates.OrderBy(t => t.DisplayOrder).ToListAsync(ct);
        return list.Select(EntityMappers.ToDto).ToList();
    }

    public async Task<TemplateDto?> GetByIdAsync(int id, CancellationToken ct = default)
    {
        var e = await _db.DocumentTemplates.FindAsync(new object[] { id }, ct);
        return e is null ? null : EntityMappers.ToDto(e);
    }

    public async Task<TemplateDto> CreateAsync(TemplateCreateUpdateDto dto, CancellationToken ct = default)
    {
        var e = new DocumentTemplate
        {
            Title = dto.Title,
            Description = dto.Description,
            FileUrl = dto.FileUrl,
            FileSize = dto.FileSize,
            LastUpdate = DateTime.UtcNow,
            IsVisible = dto.IsVisible,
            DisplayOrder = dto.DisplayOrder
        };
        _db.DocumentTemplates.Add(e);
        await _db.SaveChangesAsync(ct);
        return EntityMappers.ToDto(e);
    }

    public async Task<TemplateDto?> UpdateAsync(int id, TemplateCreateUpdateDto dto, CancellationToken ct = default)
    {
        var e = await _db.DocumentTemplates.FindAsync(new object[] { id }, ct);
        if (e is null) return null;
        e.Title = dto.Title;
        e.Description = dto.Description;
        e.FileUrl = dto.FileUrl;
        e.FileSize = dto.FileSize;
        e.LastUpdate = DateTime.UtcNow;
        e.IsVisible = dto.IsVisible;
        e.DisplayOrder = dto.DisplayOrder;
        await _db.SaveChangesAsync(ct);
        return EntityMappers.ToDto(e);
    }

    public async Task<bool> DeleteAsync(int id, CancellationToken ct = default)
    {
        var e = await _db.DocumentTemplates.FindAsync(new object[] { id }, ct);
        if (e is null) return false;
        _db.DocumentTemplates.Remove(e);
        await _db.SaveChangesAsync(ct);
        return true;
    }

    public async Task<TemplateDto?> ToggleVisibilityAsync(int id, CancellationToken ct = default)
    {
        var e = await _db.DocumentTemplates.FindAsync(new object[] { id }, ct);
        if (e is null) return null;
        e.IsVisible = !e.IsVisible;
        await _db.SaveChangesAsync(ct);
        return EntityMappers.ToDto(e);
    }
}
