using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc;
using MustGraduationPlatform.Application.Abstractions;
using MustGraduationPlatform.Application.Dtos;
using MustGraduationPlatform.Api.Models;

namespace MustGraduationPlatform.Api.Controllers.V1;

[ApiController]
[Route("api/v1/[controller]")]
public class TutorialsController : ControllerBase
{
    private readonly ITutorialDocumentService _tutorials;
    private readonly IWebHostEnvironment _env;

    public TutorialsController(ITutorialDocumentService tutorials, IWebHostEnvironment env)
    {
        _tutorials = tutorials;
        _env = env;
    }

    private static bool IsStaff(System.Security.Claims.ClaimsPrincipal user) =>
        user.IsInRole("Admin") || user.IsInRole("SuperAdmin");

    [HttpPost("with-file")]
    [Authorize(Roles = "Admin,SuperAdmin")]
    [Consumes("multipart/form-data")]
    [RequestFormLimits(MultipartBodyLengthLimit = 26_214_400)]
    public async Task<ActionResult<TutorialDocumentDto>> CreateWithFile([FromForm] TutorialDocumentFormModel model, CancellationToken ct)
    {
        if (model.File is null || model.File.Length == 0)
            return BadRequest(new { message = "File is required." });

        var dto = new TutorialDocumentCreateUpdateDto(
            model.Title,
            model.Description ?? "",
            "",
            "",
            model.IsVisible,
            model.DisplayOrder);
        await using var stream = model.File.OpenReadStream();
        return Ok(await _tutorials.CreateWithFileAsync(dto, stream, model.File.Length, model.File.FileName, model.File.ContentType, ct));
    }

    [HttpPut("{id:int}/with-file")]
    [Authorize(Roles = "Admin,SuperAdmin")]
    [Consumes("multipart/form-data")]
    [RequestFormLimits(MultipartBodyLengthLimit = 26_214_400)]
    public async Task<ActionResult<TutorialDocumentDto>> UpdateWithFile(int id, [FromForm] TutorialDocumentFormModel model, CancellationToken ct)
    {
        if (model.File is null || model.File.Length == 0)
            return BadRequest(new { message = "File is required." });

        var dto = new TutorialDocumentCreateUpdateDto(
            model.Title,
            model.Description ?? "",
            "",
            "",
            model.IsVisible,
            model.DisplayOrder);
        await using var stream = model.File.OpenReadStream();
        var r = await _tutorials.UpdateWithFileAsync(id, dto, stream, model.File.Length, model.File.FileName, model.File.ContentType, ct);
        return r is null ? NotFound() : Ok(r);
    }

    [HttpGet]
    [AllowAnonymous]
    public async Task<ActionResult<IReadOnlyList<TutorialDocumentDto>>> GetVisible(CancellationToken ct)
        => Ok(await _tutorials.GetVisibleAsync(ct));

    [HttpGet("manage")]
    [Authorize(Roles = "Admin,SuperAdmin")]
    public async Task<ActionResult<IReadOnlyList<TutorialDocumentDto>>> GetAll(CancellationToken ct)
        => Ok(await _tutorials.GetAllAsync(ct));

    [HttpGet("{id:int}/download")]
    [AllowAnonymous]
    public async Task<IActionResult> Download(int id, CancellationToken ct)
    {
        var item = await _tutorials.GetByIdAsync(id, ct);
        if (item is null) return NotFound();
        if (!item.IsVisible && !IsStaff(User))
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
            ".ppt" => "application/vnd.ms-powerpoint",
            ".pptx" => "application/vnd.openxmlformats-officedocument.presentationml.presentation",
            _ => "application/octet-stream"
        };
        return PhysicalFile(fullPath, contentType, fileDownloadName: downloadName);
    }

    [HttpGet("{id:int}")]
    [AllowAnonymous]
    public async Task<ActionResult<TutorialDocumentDto>> GetById(int id, CancellationToken ct)
    {
        var item = await _tutorials.GetByIdAsync(id, ct);
        if (item is null) return NotFound();
        if (!item.IsVisible && !IsStaff(User))
            return NotFound();
        return Ok(item);
    }

    private static string SanitizeDownloadName(string title)
    {
        var s = string.IsNullOrWhiteSpace(title) ? "tutorial" : title.Trim();
        foreach (var c in Path.GetInvalidFileNameChars())
            s = s.Replace(c, '_');
        return s.Length > 120 ? s[..120] : s;
    }

    [HttpPost]
    [Authorize(Roles = "Admin,SuperAdmin")]
    public async Task<ActionResult<TutorialDocumentDto>> Create([FromBody] TutorialDocumentCreateUpdateDto dto, CancellationToken ct)
        => Ok(await _tutorials.CreateAsync(dto, ct));

    [HttpPut("{id:int}")]
    [Authorize(Roles = "Admin,SuperAdmin")]
    public async Task<ActionResult<TutorialDocumentDto>> Update(int id, [FromBody] TutorialDocumentCreateUpdateDto dto, CancellationToken ct)
    {
        var r = await _tutorials.UpdateAsync(id, dto, ct);
        return r is null ? NotFound() : Ok(r);
    }

    [HttpDelete("{id:int}")]
    [Authorize(Roles = "Admin,SuperAdmin")]
    public async Task<IActionResult> Delete(int id, CancellationToken ct)
        => await _tutorials.DeleteAsync(id, ct) ? NoContent() : NotFound();

    [HttpPost("{id:int}/toggle-visibility")]
    [Authorize(Roles = "Admin,SuperAdmin")]
    public async Task<ActionResult<TutorialDocumentDto>> Toggle(int id, CancellationToken ct)
    {
        var r = await _tutorials.ToggleVisibilityAsync(id, ct);
        return r is null ? NotFound() : Ok(r);
    }
}
