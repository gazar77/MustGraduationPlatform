using Microsoft.EntityFrameworkCore;
using MustGraduationPlatform.Application.Abstractions;
using MustGraduationPlatform.Application.Dtos;
using MustGraduationPlatform.Domain.Entities;
using MustGraduationPlatform.Infrastructure.Persistence;

namespace MustGraduationPlatform.Infrastructure.Services;

public class IdeaCategoryService : IIdeaCategoryService
{
    private readonly AppDbContext _db;

    public IdeaCategoryService(AppDbContext db)
    {
        _db = db;
    }

    public async Task<IReadOnlyList<IdeaCategoryDto>> GetVisibleAsync(CancellationToken ct = default)
    {
        var list = await _db.IdeaCategories.OrderBy(c => c.SortOrder).ThenBy(c => c.Name).ToListAsync(ct);
        return list.Select(EntityMappers.ToDto).ToList();
    }

    public async Task<IReadOnlyList<IdeaCategoryDto>> GetAllAsync(CancellationToken ct = default)
        => await GetVisibleAsync(ct);

    public async Task<IdeaCategoryDto> CreateAsync(IdeaCategoryCreateUpdateDto dto, CancellationToken ct = default)
    {
        var e = new IdeaCategory { Name = dto.Name.Trim(), SortOrder = dto.SortOrder };
        _db.IdeaCategories.Add(e);
        await _db.SaveChangesAsync(ct);
        return EntityMappers.ToDto(e);
    }

    public async Task<IdeaCategoryDto?> UpdateAsync(int id, IdeaCategoryCreateUpdateDto dto, CancellationToken ct = default)
    {
        var e = await _db.IdeaCategories.FindAsync(new object[] { id }, ct);
        if (e is null) return null;
        e.Name = dto.Name.Trim();
        e.SortOrder = dto.SortOrder;
        await _db.SaveChangesAsync(ct);
        return EntityMappers.ToDto(e);
    }

    public async Task<bool> DeleteAsync(int id, CancellationToken ct = default)
    {
        var e = await _db.IdeaCategories.FindAsync(new object[] { id }, ct);
        if (e is null) return false;
        _db.IdeaCategories.Remove(e);
        await _db.SaveChangesAsync(ct);
        return true;
    }
}
