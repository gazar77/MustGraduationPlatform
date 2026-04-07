using Microsoft.EntityFrameworkCore;
using MustGraduationPlatform.Application.Abstractions;
using MustGraduationPlatform.Application.Dtos;
using MustGraduationPlatform.Domain.Entities;
using MustGraduationPlatform.Infrastructure.Persistence;
using MustGraduationPlatform.Infrastructure.Storage;

namespace MustGraduationPlatform.Infrastructure.Services;

public class TemplateService : ITemplateService
{
    private readonly AppDbContext _db;
    private readonly IFileStorage _files;

    public TemplateService(AppDbContext db, IFileStorage files)
    {
        _db = db;
        _files = files;
    }

    private static string FormatFileSize(long bytes) =>
        bytes < 1024 ? $"{bytes} B" : bytes < 1024 * 1024 ? $"{bytes / 1024.0:0.##} KB" : $"{bytes / (1024.0 * 1024):0.##} MB";

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

    public async Task<TemplateDto> CreateWithFileAsync(TemplateCreateUpdateDto dto, Stream fileStream, long fileLength, string fileName, string? contentType, CancellationToken ct = default)
    {
        PdfUploadValidation.ValidateOrThrow(fileName, fileLength);
        var safe = SubmissionFileValidation.SanitizeFileName(fileName);
        var relativePath = $"templates/{DateTime.UtcNow:yyyy/MM}/{Guid.NewGuid():N}_{safe}";
        var url = await _files.SaveAsync(relativePath, fileStream, ct);
        var sizeLabel = FormatFileSize(fileLength);
        var e = new DocumentTemplate
        {
            Title = dto.Title,
            Description = dto.Description,
            FileUrl = url,
            FileSize = sizeLabel,
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

    public async Task<TemplateDto?> UpdateWithFileAsync(int id, TemplateCreateUpdateDto dto, Stream fileStream, long fileLength, string fileName, string? contentType, CancellationToken ct = default)
    {
        var e = await _db.DocumentTemplates.FindAsync(new object[] { id }, ct);
        if (e is null) return null;
        PdfUploadValidation.ValidateOrThrow(fileName, fileLength);
        var safe = SubmissionFileValidation.SanitizeFileName(fileName);
        var relativePath = $"templates/{DateTime.UtcNow:yyyy/MM}/{Guid.NewGuid():N}_{safe}";
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
