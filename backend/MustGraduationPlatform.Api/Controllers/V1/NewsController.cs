using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using MustGraduationPlatform.Application.Abstractions;
using MustGraduationPlatform.Application.Dtos;
using MustGraduationPlatform.Api.Models;

namespace MustGraduationPlatform.Api.Controllers.V1;

[ApiController]
[Route("api/v1/[controller]")]
public class NewsController : ControllerBase
{
    private readonly INewsService _news;

    public NewsController(INewsService news)
    {
        _news = news;
    }

    [HttpPost("with-image")]
    [Authorize(Roles = "Admin,SuperAdmin")]
    [Consumes("multipart/form-data")]
    [RequestFormLimits(MultipartBodyLengthLimit = 6_291_456)]
    public async Task<ActionResult<NewsDto>> CreateWithImage([FromForm] NewsFormModel model, CancellationToken ct)
    {
        if (model.Image is null || model.Image.Length == 0)
            return BadRequest(new { message = "Image is required." });

        var dto = new NewsCreateUpdateDto(
            model.Title,
            model.Content ?? "",
            model.Author,
            model.Category,
            model.IsVisible,
            model.DisplayOrder);
        await using var stream = model.Image.OpenReadStream();
        return Ok(await _news.CreateWithImageAsync(dto, stream, model.Image.Length, model.Image.FileName, ct));
    }

    [HttpPut("{id:int}/with-image")]
    [Authorize(Roles = "Admin,SuperAdmin")]
    [Consumes("multipart/form-data")]
    [RequestFormLimits(MultipartBodyLengthLimit = 6_291_456)]
    public async Task<ActionResult<NewsDto>> UpdateWithImage(int id, [FromForm] NewsFormModel model, CancellationToken ct)
    {
        if (model.Image is null || model.Image.Length == 0)
            return BadRequest(new { message = "Image is required." });

        var dto = new NewsCreateUpdateDto(
            model.Title,
            model.Content ?? "",
            model.Author,
            model.Category,
            model.IsVisible,
            model.DisplayOrder);
        await using var stream = model.Image.OpenReadStream();
        var r = await _news.UpdateWithImageAsync(id, dto, stream, model.Image.Length, model.Image.FileName, ct);
        return r is null ? NotFound() : Ok(r);
    }

    [HttpGet]
    [AllowAnonymous]
    public async Task<ActionResult<IReadOnlyList<NewsDto>>> GetVisible(CancellationToken ct)
        => Ok(await _news.GetVisibleAsync(ct));

    [HttpGet("manage")]
    [Authorize(Roles = "Admin,SuperAdmin")]
    public async Task<ActionResult<IReadOnlyList<NewsDto>>> GetAll(CancellationToken ct)
        => Ok(await _news.GetAllAsync(ct));

    [HttpGet("{id:int}")]
    [AllowAnonymous]
    public async Task<ActionResult<NewsDto>> GetById(int id, CancellationToken ct)
    {
        var item = await _news.GetByIdAsync(id, ct);
        if (item is null) return NotFound();
        if (!item.IsVisible && !User.IsInRole("Admin"))
            return NotFound();
        return Ok(item);
    }

    [HttpPost]
    [Authorize(Roles = "Admin,SuperAdmin")]
    public async Task<ActionResult<NewsDto>> Create([FromBody] NewsCreateUpdateDto dto, CancellationToken ct)
        => Ok(await _news.CreateAsync(dto, ct));

    [HttpPut("{id:int}")]
    [Authorize(Roles = "Admin,SuperAdmin")]
    public async Task<ActionResult<NewsDto>> Update(int id, [FromBody] NewsCreateUpdateDto dto, CancellationToken ct)
    {
        var r = await _news.UpdateAsync(id, dto, ct);
        return r is null ? NotFound() : Ok(r);
    }

    [HttpDelete("{id:int}")]
    [Authorize(Roles = "Admin,SuperAdmin")]
    public async Task<IActionResult> Delete(int id, CancellationToken ct)
        => await _news.DeleteAsync(id, ct) ? NoContent() : NotFound();

    [HttpPost("{id:int}/toggle-visibility")]
    [Authorize(Roles = "Admin,SuperAdmin")]
    public async Task<ActionResult<NewsDto>> Toggle(int id, CancellationToken ct)
    {
        var r = await _news.ToggleVisibilityAsync(id, ct);
        return r is null ? NotFound() : Ok(r);
    }
}
