using System.Text.Json;
using Microsoft.EntityFrameworkCore;
using MustGraduationPlatform.Application.Abstractions;
using MustGraduationPlatform.Application.Common;
using MustGraduationPlatform.Application.Dtos;
using MustGraduationPlatform.Application.Exceptions;
using MustGraduationPlatform.Domain.Entities;
using MustGraduationPlatform.Infrastructure.Persistence;
using MustGraduationPlatform.Infrastructure.Storage;

namespace MustGraduationPlatform.Infrastructure.Services;

public class SiteSettingsService : ISiteSettingsService
{
    private readonly AppDbContext _db;
    private readonly IFileStorage _files;

    public SiteSettingsService(AppDbContext db, IFileStorage files)
    {
        _db = db;
        _files = files;
    }

    public async Task<IReadOnlyList<SiteSettingDto>> GetAllAsync(CancellationToken ct = default)
    {
        var list = await _db.SiteSettings.OrderBy(s => s.Key).ToListAsync(ct);
        return list.Select(s => new SiteSettingDto(s.Key, s.Value)).ToList();
    }

    public async Task<SiteSettingDto?> GetByKeyAsync(string key, CancellationToken ct = default)
    {
        var e = await _db.SiteSettings.FirstOrDefaultAsync(s => s.Key == key, ct);
        return e is null ? null : new SiteSettingDto(e.Key, e.Value);
    }

    public async Task<SiteSettingDto> UpsertAsync(string key, SiteSettingUpdateDto dto, CancellationToken ct = default)
    {
        if (string.Equals(key, SiteSettingKeys.HeroBannerBgImages, StringComparison.Ordinal))
            ValidateHeroBannerBgImagesJson(dto.Value);

        var e = await _db.SiteSettings.FirstOrDefaultAsync(s => s.Key == key, ct);
        if (e is null)
        {
            e = new SiteSetting { Key = key, Value = dto.Value };
            _db.SiteSettings.Add(e);
        }
        else
        {
            e.Value = dto.Value;
        }

        await _db.SaveChangesAsync(ct);
        return new SiteSettingDto(e.Key, e.Value);
    }

    public async Task<string> UploadHeroBannerImageAsync(Stream content, string fileName, long length, CancellationToken ct = default)
    {
        ImageUploadValidation.ValidateOrThrow(fileName, length);
        var safe = SubmissionFileValidation.SanitizeFileName(fileName);
        var relativePath = $"hero/{DateTime.UtcNow:yyyy/MM}/{Guid.NewGuid():N}_{safe}";
        return await _files.SaveAsync(relativePath, content, ct);
    }

    private static void ValidateHeroBannerBgImagesJson(string raw)
    {
        if (string.IsNullOrWhiteSpace(raw))
            throw new AppException("VALIDATION_HERO_SLIDER", "قيمة صور الهيرو يجب أن تكون مصفوفة JSON غير فارغة.");

        JsonDocument doc;
        try
        {
            doc = JsonDocument.Parse(raw);
        }
        catch (JsonException)
        {
            throw new AppException("VALIDATION_HERO_SLIDER", "JSON غير صالح لصور الهيرو.");
        }

        using (doc)
        {
            var root = doc.RootElement;
            if (root.ValueKind != JsonValueKind.Array)
                throw new AppException("VALIDATION_HERO_SLIDER", "يجب أن تكون الصور مصفوفة JSON.");

            var n = 0;
            foreach (var el in root.EnumerateArray())
            {
                if (el.ValueKind != JsonValueKind.String)
                    throw new AppException("VALIDATION_HERO_SLIDER", "كل عنصر يجب أن يكون نصاً (مسار الصورة).");
                var path = el.GetString();
                if (string.IsNullOrWhiteSpace(path))
                    throw new AppException("VALIDATION_HERO_SLIDER", "مسار الصورة لا يمكن أن يكون فارغاً.");
                ValidateAllowedHeroImagePath(path.Trim());
                n++;
            }

            if (n == 0)
                throw new AppException("VALIDATION_HERO_SLIDER", "يجب إضافة صورة واحدة على الأقل.");
            if (n > 20)
                throw new AppException("VALIDATION_HERO_SLIDER", "الحد الأقصى 20 صورة.");
        }
    }

    private static void ValidateAllowedHeroImagePath(string path)
    {
        if (path.Contains("..", StringComparison.Ordinal) || path.Contains('\\'))
            throw new AppException("VALIDATION_HERO_SLIDER", "مسار الصورة غير مسموح.");

        if (path.Contains(':', StringComparison.Ordinal))
            throw new AppException("VALIDATION_HERO_SLIDER", "مسار الصورة غير مسموح.");

        var lower = path.ToLowerInvariant();
        if (!lower.StartsWith("/uploads/", StringComparison.Ordinal))
            throw new AppException("VALIDATION_HERO_SLIDER", "مسار الصورة يجب أن يبدأ بـ /uploads/ (ملفات مرفوعة على الخادم).");
    }
}
