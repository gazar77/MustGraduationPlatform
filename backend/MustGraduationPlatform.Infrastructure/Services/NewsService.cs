using Microsoft.EntityFrameworkCore;
using MustGraduationPlatform.Application.Abstractions;
using MustGraduationPlatform.Application.Dtos;
using MustGraduationPlatform.Domain.Entities;
using MustGraduationPlatform.Infrastructure.Persistence;

namespace MustGraduationPlatform.Infrastructure.Services;

public class NewsService : INewsService
{
    private readonly AppDbContext _db;

    public NewsService(AppDbContext db)
    {
        _db = db;
    }

    public async Task<IReadOnlyList<NewsDto>> GetVisibleAsync(CancellationToken ct = default)
    {
        var list = await _db.NewsArticles.Where(n => n.IsVisible).OrderBy(n => n.DisplayOrder).ToListAsync(ct);
        return list.Select(EntityMappers.ToDto).ToList();
    }

    public async Task<IReadOnlyList<NewsDto>> GetAllAsync(CancellationToken ct = default)
    {
        var list = await _db.NewsArticles.OrderByDescending(n => n.PublishDate).ToListAsync(ct);
        return list.Select(EntityMappers.ToDto).ToList();
    }

    public async Task<NewsDto?> GetByIdAsync(int id, CancellationToken ct = default)
    {
        var e = await _db.NewsArticles.FindAsync(new object[] { id }, ct);
        return e is null ? null : EntityMappers.ToDto(e);
    }

    public async Task<NewsDto> CreateAsync(NewsCreateUpdateDto dto, CancellationToken ct = default)
    {
        var e = new NewsArticle
        {
            Title = dto.Title,
            Content = dto.Content,
            Author = dto.Author,
            PublishDate = DateTime.UtcNow,
            Category = dto.Category,
            IsVisible = dto.IsVisible,
            DisplayOrder = dto.DisplayOrder
        };
        _db.NewsArticles.Add(e);
        await _db.SaveChangesAsync(ct);
        return EntityMappers.ToDto(e);
    }

    public async Task<NewsDto?> UpdateAsync(int id, NewsCreateUpdateDto dto, CancellationToken ct = default)
    {
        var e = await _db.NewsArticles.FindAsync(new object[] { id }, ct);
        if (e is null) return null;
        e.Title = dto.Title;
        e.Content = dto.Content;
        e.Author = dto.Author;
        e.Category = dto.Category;
        e.IsVisible = dto.IsVisible;
        e.DisplayOrder = dto.DisplayOrder;
        await _db.SaveChangesAsync(ct);
        return EntityMappers.ToDto(e);
    }

    public async Task<bool> DeleteAsync(int id, CancellationToken ct = default)
    {
        var e = await _db.NewsArticles.FindAsync(new object[] { id }, ct);
        if (e is null) return false;
        _db.NewsArticles.Remove(e);
        await _db.SaveChangesAsync(ct);
        return true;
    }

    public async Task<NewsDto?> ToggleVisibilityAsync(int id, CancellationToken ct = default)
    {
        var e = await _db.NewsArticles.FindAsync(new object[] { id }, ct);
        if (e is null) return null;
        e.IsVisible = !e.IsVisible;
        await _db.SaveChangesAsync(ct);
        return EntityMappers.ToDto(e);
    }
}
