using Microsoft.AspNetCore.Authorization;
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

    public TemplatesController(ITemplateService templates)
    {
        _templates = templates;
    }

    [HttpPost("with-file")]
    [Authorize(Roles = "Admin")]
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

    [HttpGet]
    [AllowAnonymous]
    public async Task<ActionResult<IReadOnlyList<TemplateDto>>> GetVisible(CancellationToken ct)
        => Ok(await _templates.GetVisibleAsync(ct));

    [HttpGet("manage")]
    [Authorize(Roles = "Admin")]
    public async Task<ActionResult<IReadOnlyList<TemplateDto>>> GetAll(CancellationToken ct)
        => Ok(await _templates.GetAllAsync(ct));

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

    [HttpPost]
    [Authorize(Roles = "Admin")]
    public async Task<ActionResult<TemplateDto>> Create([FromBody] TemplateCreateUpdateDto dto, CancellationToken ct)
        => Ok(await _templates.CreateAsync(dto, ct));

    [HttpPut("{id:int}")]
    [Authorize(Roles = "Admin")]
    public async Task<ActionResult<TemplateDto>> Update(int id, [FromBody] TemplateCreateUpdateDto dto, CancellationToken ct)
    {
        var r = await _templates.UpdateAsync(id, dto, ct);
        return r is null ? NotFound() : Ok(r);
    }

    [HttpDelete("{id:int}")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> Delete(int id, CancellationToken ct)
        => await _templates.DeleteAsync(id, ct) ? NoContent() : NotFound();

    [HttpPost("{id:int}/toggle-visibility")]
    [Authorize(Roles = "Admin")]
    public async Task<ActionResult<TemplateDto>> Toggle(int id, CancellationToken ct)
    {
        var r = await _templates.ToggleVisibilityAsync(id, ct);
        return r is null ? NotFound() : Ok(r);
    }
}
