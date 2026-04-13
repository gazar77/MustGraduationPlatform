using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using MustGraduationPlatform.Application.Abstractions;
using MustGraduationPlatform.Application.Dtos;

namespace MustGraduationPlatform.Api.Controllers.V1;

[ApiController]
[Route("api/v1/site-settings")]
public class SiteSettingsController : ControllerBase
{
    private readonly ISiteSettingsService _settings;

    public SiteSettingsController(ISiteSettingsService settings)
    {
        _settings = settings;
    }

    [HttpGet]
    [Authorize(Roles = "Admin,SuperAdmin")]
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
    [Authorize(Roles = "Admin,SuperAdmin")]
    public async Task<ActionResult<SiteSettingDto>> Upsert(string key, [FromBody] SiteSettingUpdateDto dto, CancellationToken ct)
        => Ok(await _settings.UpsertAsync(key, dto, ct));

    /// <summary>Uploads a hero slider image to wwwroot/uploads and returns the public path (/uploads/...).</summary>
    [HttpPost("hero-banner/upload")]
    [Authorize(Roles = "Admin,SuperAdmin")]
    [RequestSizeLimit(6_000_000)]
    [RequestFormLimits(MultipartBodyLengthLimit = 6_000_000)]
    public async Task<ActionResult<object>> UploadHeroBanner(IFormFile? file, CancellationToken ct)
    {
        if (file == null || file.Length == 0)
            return BadRequest(new { message = "لم يتم اختيار ملف." });

        await using var stream = file.OpenReadStream();
        var url = await _settings.UploadHeroBannerImageAsync(stream, file.FileName, file.Length, ct);
        return Ok(new { url });
    }
}
