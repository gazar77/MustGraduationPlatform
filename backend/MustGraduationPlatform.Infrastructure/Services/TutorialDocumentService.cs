using Microsoft.EntityFrameworkCore;
using MustGraduationPlatform.Application.Abstractions;
using MustGraduationPlatform.Application.Dtos;
using MustGraduationPlatform.Domain.Entities;
using MustGraduationPlatform.Infrastructure.Persistence;
using MustGraduationPlatform.Infrastructure.Storage;

namespace MustGraduationPlatform.Infrastructure.Services;

public class TutorialDocumentService : ITutorialDocumentService
{
    private readonly AppDbContext _db;
    private readonly IFileStorage _files;

    public TutorialDocumentService(AppDbContext db, IFileStorage files)
    {
        _db = db;
        _files = files;
    }

    private static string FormatFileSize(long bytes) =>
        bytes < 1024 ? $"{bytes} B" : bytes < 1024 * 1024 ? $"{bytes / 1024.0:0.##} KB" : $"{bytes / (1024.0 * 1024):0.##} MB";

    public async Task<IReadOnlyList<TutorialDocumentDto>> GetVisibleAsync(CancellationToken ct = default)
    {
        var list = await _db.TutorialDocuments.Where(t => t.IsVisible).OrderBy(t => t.DisplayOrder).ToListAsync(ct);
        return list.Select(EntityMappers.ToTutorialDto).ToList();
    }

    public async Task<IReadOnlyList<TutorialDocumentDto>> GetAllAsync(CancellationToken ct = default)
    {
        var list = await _db.TutorialDocuments.OrderBy(t => t.DisplayOrder).ToListAsync(ct);
        return list.Select(EntityMappers.ToTutorialDto).ToList();
    }

    public async Task<TutorialDocumentDto?> GetByIdAsync(int id, CancellationToken ct = default)
    {
        var e = await _db.TutorialDocuments.FindAsync(new object[] { id }, ct);
        return e is null ? null : EntityMappers.ToTutorialDto(e);
    }

    public async Task<TutorialDocumentDto> CreateAsync(TutorialDocumentCreateUpdateDto dto, CancellationToken ct = default)
    {
        var e = new TutorialDocument
        {
            Title = dto.Title,
            Description = dto.Description,
            FileUrl = dto.FileUrl,
            FileSize = dto.FileSize,
            LastUpdate = DateTime.UtcNow,
            IsVisible = dto.IsVisible,
            DisplayOrder = dto.DisplayOrder
        };
        _db.TutorialDocuments.Add(e);
        await _db.SaveChangesAsync(ct);
        return EntityMappers.ToTutorialDto(e);
    }

    public async Task<TutorialDocumentDto> CreateWithFileAsync(TutorialDocumentCreateUpdateDto dto, Stream fileStream, long fileLength, string fileName, string? contentType, CancellationToken ct = default)
    {
        TutorialUploadValidation.ValidateOrThrow(fileName, fileLength);
        var safe = SubmissionFileValidation.SanitizeFileName(fileName);
        var relativePath = $"tutorials/{DateTime.UtcNow:yyyy/MM}/{Guid.NewGuid():N}_{safe}";
        var url = await _files.SaveAsync(relativePath, fileStream, ct);
        var sizeLabel = FormatFileSize(fileLength);
        var e = new TutorialDocument
        {
            Title = dto.Title,
            Description = dto.Description,
            FileUrl = url,
            FileSize = sizeLabel,
            LastUpdate = DateTime.UtcNow,
            IsVisible = dto.IsVisible,
            DisplayOrder = dto.DisplayOrder
        };
        _db.TutorialDocuments.Add(e);
        await _db.SaveChangesAsync(ct);
        return EntityMappers.ToTutorialDto(e);
    }

    public async Task<TutorialDocumentDto?> UpdateAsync(int id, TutorialDocumentCreateUpdateDto dto, CancellationToken ct = default)
    {
        var e = await _db.TutorialDocuments.FindAsync(new object[] { id }, ct);
        if (e is null) return null;
        e.Title = dto.Title;
        e.Description = dto.Description;
        e.FileUrl = dto.FileUrl;
        e.FileSize = dto.FileSize;
        e.LastUpdate = DateTime.UtcNow;
        e.IsVisible = dto.IsVisible;
        e.DisplayOrder = dto.DisplayOrder;
        await _db.SaveChangesAsync(ct);
        return EntityMappers.ToTutorialDto(e);
    }

    public async Task<TutorialDocumentDto?> UpdateWithFileAsync(int id, TutorialDocumentCreateUpdateDto dto, Stream fileStream, long fileLength, string fileName, string? contentType, CancellationToken ct = default)
    {
        var e = await _db.TutorialDocuments.FindAsync(new object[] { id }, ct);
        if (e is null) return null;
        TutorialUploadValidation.ValidateOrThrow(fileName, fileLength);
        var safe = SubmissionFileValidation.SanitizeFileName(fileName);
        var relativePath = $"tutorials/{DateTime.UtcNow:yyyy/MM}/{Guid.NewGuid():N}_{safe}";
        var url = await _files.SaveAsync(relativePath, fileStream, ct);
        var sizeLabel = FormatFileSize(fileLength);
        e.Title = dto.Title;
        e.Description = dto.Description;
        e.FileUrl = url;
        e.FileSize = sizeLabel;
        e.LastUpdate = DateTime.UtcNow;
        e.IsVisible = dto.IsVisible;
        e.DisplayOrder = dto.DisplayOrder;
        await _db.SaveChangesAsync(ct);
        return EntityMappers.ToTutorialDto(e);
    }

    public async Task<bool> DeleteAsync(int id, CancellationToken ct = default)
    {
        var e = await _db.TutorialDocuments.FindAsync(new object[] { id }, ct);
        if (e is null) return false;
        _db.TutorialDocuments.Remove(e);
        await _db.SaveChangesAsync(ct);
        return true;
    }

    public async Task<TutorialDocumentDto?> ToggleVisibilityAsync(int id, CancellationToken ct = default)
    {
        var e = await _db.TutorialDocuments.FindAsync(new object[] { id }, ct);
        if (e is null) return null;
        e.IsVisible = !e.IsVisible;
        await _db.SaveChangesAsync(ct);
        return EntityMappers.ToTutorialDto(e);
    }
}
