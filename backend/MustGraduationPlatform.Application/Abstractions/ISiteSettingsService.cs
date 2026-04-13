using MustGraduationPlatform.Application.Dtos;

namespace MustGraduationPlatform.Application.Abstractions;

public interface ISiteSettingsService
{
    Task<IReadOnlyList<SiteSettingDto>> GetAllAsync(CancellationToken ct = default);
    Task<SiteSettingDto?> GetByKeyAsync(string key, CancellationToken ct = default);
    Task<SiteSettingDto> UpsertAsync(string key, SiteSettingUpdateDto dto, CancellationToken ct = default);

    /// <summary>Saves a hero background image under wwwroot/uploads and returns the public URL path (/uploads/...).</summary>
    Task<string> UploadHeroBannerImageAsync(Stream content, string fileName, long length, CancellationToken ct = default);
}
