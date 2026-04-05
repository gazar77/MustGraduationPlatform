using MustGraduationPlatform.Application.Dtos;

namespace MustGraduationPlatform.Application.Abstractions;

public interface ISiteSettingsService
{
    Task<IReadOnlyList<SiteSettingDto>> GetAllAsync(CancellationToken ct = default);
    Task<SiteSettingDto?> GetByKeyAsync(string key, CancellationToken ct = default);
    Task<SiteSettingDto> UpsertAsync(string key, SiteSettingUpdateDto dto, CancellationToken ct = default);
}
