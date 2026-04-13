using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc;
using MustGraduationPlatform.Application.Abstractions;
using MustGraduationPlatform.Application.Dtos;
using MustGraduationPlatform.Api.Models;

namespace MustGraduationPlatform.Api.Controllers.V1;

[ApiController]
[Route("api/v1/[controller]")]
public class TemplatesController : ControllerBase
{
    private readonly ITemplateService _templates;
    private readonly IWebHostEnvironment _env;

    public TemplatesController(ITemplateService templates, IWebHostEnvironment env)
    {
        _templates = templates;
        _env = env;
    }

    [HttpPost("with-file")]
    [Authorize(Roles = "Admin,SuperAdmin")]
    [Consumes("multipart/form-data")]
    [RequestFormLimits(MultipartBodyLengthLimit = 26_214_400)]
    public async Task<ActionResult<TemplateDto>> CreateWithFile([FromForm] TemplateFormModel model, CancellationToken ct)
    {
        if (model.File is null || model.File.Length == 0)
            return BadRequest(new { message = "File is required." });

        var dto = new TemplateCreateUpdateDto(
            model.Title,
            model.Description ?? "",
            "",
            "",
            model.IsVisible,
            model.DisplayOrder);
        await using var stream = model.File.OpenReadStream();
        return Ok(await _templates.CreateWithFileAsync(dto, stream, model.File.Length, model.File.FileName, model.File.ContentType, ct));
    }

    [HttpPut("{id:int}/with-file")]
    [Authorize(Roles = "Admin,SuperAdmin")]
    [Consumes("multipart/form-data")]
    [RequestFormLimits(MultipartBodyLengthLimit = 26_214_400)]
    public async Task<ActionResult<TemplateDto>> UpdateWithFile(int id, [FromForm] TemplateFormModel model, CancellationToken ct)
    {
        if (model.File is null || model.File.Length == 0)
            return BadRequest(new { message = "File is required." });

        var dto = new TemplateCreateUpdateDto(
            model.Title,
            model.Description ?? "",
            "",
            "",
            model.IsVisible,
            model.DisplayOrder);
        await using var stream = model.File.OpenReadStream();
        var r = await _templates.UpdateWithFileAsync(id, dto, stream, model.File.Length, model.File.FileName, model.File.ContentType, ct);
        return r is null ? NotFound() : Ok(r);
    }

    [HttpGet]
    [AllowAnonymous]
    public async Task<ActionResult<IReadOnlyList<TemplateDto>>> GetVisible(CancellationToken ct)
        => Ok(await _templates.GetVisibleAsync(ct));

    [HttpGet("manage")]
    [Authorize(Roles = "Admin,SuperAdmin")]
    public async Task<ActionResult<IReadOnlyList<TemplateDto>>> GetAll(CancellationToken ct)
        => Ok(await _templates.GetAllAsync(ct));

    /// <summary>Streams the template file with Content-Disposition: attachment (works with SPA CORS + blob download).</summary>
    [HttpGet("{id:int}/download")]
    [AllowAnonymous]
    public async Task<IActionResult> Download(int id, CancellationToken ct)
    {
        var item = await _templates.GetByIdAsync(id, ct);
        if (item is null) return NotFound();
        if (!item.IsVisible && !User.IsInRole("Admin"))
            return NotFound();

        var rel = item.FileUrl?.Trim();
        if (string.IsNullOrEmpty(rel) || rel == "#")
            return NotFound();

        rel = rel.TrimStart('/');
        var webRoot = string.IsNullOrEmpty(_env.WebRootPath)
            ? Path.Combine(_env.ContentRootPath, "wwwroot")
            : _env.WebRootPath;

        var combined = Path.Combine(webRoot, rel.Replace('/', Path.DirectorySeparatorChar));
        var fullPath = Path.GetFullPath(combined);
        var rootFull = Path.GetFullPath(webRoot);
        if (!fullPath.StartsWith(rootFull, StringComparison.OrdinalIgnoreCase) || !System.IO.File.Exists(fullPath))
            return NotFound();

        var ext = Path.GetExtension(fullPath);
        if (string.IsNullOrEmpty(ext))
            ext = ".bin";
        var downloadName = SanitizeDownloadName(item.Title) + ext;
        var contentType = ext.ToLowerInvariant() switch
        {
            ".docx" => "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
            ".doc" => "application/msword",
            ".pdf" => "application/pdf",
            _ => "application/octet-stream"
        };
        return PhysicalFile(fullPath, contentType, fileDownloadName: downloadName);
    }

    [HttpGet("{id:int}")]
    [AllowAnonymous]
    public async Task<ActionResult<TemplateDto>> GetById(int id, CancellationToken ct)
    {
        var item = await _templates.GetByIdAsync(id, ct);
        if (item is null) return NotFound();
        if (!item.IsVisible && !User.IsInRole("Admin"))
            return NotFound();
        return Ok(item);
    }

    private static string SanitizeDownloadName(string title)
    {
        var s = string.IsNullOrWhiteSpace(title) ? "template" : title.Trim();
        foreach (var c in Path.GetInvalidFileNameChars())
            s = s.Replace(c, '_');
        return s.Length > 120 ? s[..120] : s;
    }

    [HttpPost]
    [Authorize(Roles = "Admin,SuperAdmin")]
    public async Task<ActionResult<TemplateDto>> Create([FromBody] TemplateCreateUpdateDto dto, CancellationToken ct)
        => Ok(await _templates.CreateAsync(dto, ct));

    [HttpPut("{id:int}")]
    [Authorize(Roles = "Admin,SuperAdmin")]
    public async Task<ActionResult<TemplateDto>> Update(int id, [FromBody] TemplateCreateUpdateDto dto, CancellationToken ct)
    {
        var r = await _templates.UpdateAsync(id, dto, ct);
        return r is null ? NotFound() : Ok(r);
    }

    [HttpDelete("{id:int}")]
    [Authorize(Roles = "Admin,SuperAdmin")]
    public async Task<IActionResult> Delete(int id, CancellationToken ct)
        => await _templates.DeleteAsync(id, ct) ? NoContent() : NotFound();

    [HttpPost("{id:int}/toggle-visibility")]
    [Authorize(Roles = "Admin,SuperAdmin")]
    public async Task<ActionResult<TemplateDto>> Toggle(int id, CancellationToken ct)
    {
        var r = await _templates.ToggleVisibilityAsync(id, ct);
        return r is null ? NotFound() : Ok(r);
    }
}
