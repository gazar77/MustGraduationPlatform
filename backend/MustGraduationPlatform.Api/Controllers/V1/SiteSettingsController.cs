using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using MustGraduationPlatform.Application.Abstractions;
using MustGraduationPlatform.Application.Dtos;

namespace MustGraduationPlatform.Api.Controllers.V1;

[ApiController]
[Route("api/v1/[controller]")]
public class SiteSettingsController : ControllerBase
{
    private readonly ISiteSettingsService _settings;

    public SiteSettingsController(ISiteSettingsService settings)
    {
        _settings = settings;
    }

    [HttpGet]
    [Authorize(Roles = "Admin")]
    public async Task<ActionResult<IReadOnlyList<SiteSettingDto>>> GetAll(CancellationToken ct)
        => Ok(await _settings.GetAllAsync(ct));

    [HttpGet("{key}")]
    [AllowAnonymous]
    public async Task<ActionResult<SiteSettingDto>> GetByKey(string key, CancellationToken ct)
    {
        var r = await _settings.GetByKeyAsync(key, ct);
        return r is null ? NotFound() : Ok(r);
    }

    [HttpPut("{key}")]
    [Authorize(Roles = "Admin")]
    public async Task<ActionResult<SiteSettingDto>> Upsert(string key, [FromBody] SiteSettingUpdateDto dto, CancellationToken ct)
        => Ok(await _settings.UpsertAsync(key, dto, ct));
}
