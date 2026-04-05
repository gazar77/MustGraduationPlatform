using Microsoft.EntityFrameworkCore;
using MustGraduationPlatform.Application.Abstractions;
using MustGraduationPlatform.Application.Dtos;
using MustGraduationPlatform.Domain.Entities;
using MustGraduationPlatform.Infrastructure.Persistence;

namespace MustGraduationPlatform.Infrastructure.Services;

public class SiteSettingsService : ISiteSettingsService
{
    private readonly AppDbContext _db;

    public SiteSettingsService(AppDbContext db)
    {
        _db = db;
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
}
