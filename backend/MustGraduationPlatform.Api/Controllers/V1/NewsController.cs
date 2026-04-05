using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using MustGraduationPlatform.Application.Abstractions;
using MustGraduationPlatform.Application.Dtos;

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

    [HttpGet]
    [AllowAnonymous]
    public async Task<ActionResult<IReadOnlyList<NewsDto>>> GetVisible(CancellationToken ct)
        => Ok(await _news.GetVisibleAsync(ct));

    [HttpGet("manage")]
    [Authorize(Roles = "Admin")]
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
    [Authorize(Roles = "Admin")]
    public async Task<ActionResult<NewsDto>> Create([FromBody] NewsCreateUpdateDto dto, CancellationToken ct)
        => Ok(await _news.CreateAsync(dto, ct));

    [HttpPut("{id:int}")]
    [Authorize(Roles = "Admin")]
    public async Task<ActionResult<NewsDto>> Update(int id, [FromBody] NewsCreateUpdateDto dto, CancellationToken ct)
    {
        var r = await _news.UpdateAsync(id, dto, ct);
        return r is null ? NotFound() : Ok(r);
    }

    [HttpDelete("{id:int}")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> Delete(int id, CancellationToken ct)
        => await _news.DeleteAsync(id, ct) ? NoContent() : NotFound();

    [HttpPost("{id:int}/toggle-visibility")]
    [Authorize(Roles = "Admin")]
    public async Task<ActionResult<NewsDto>> Toggle(int id, CancellationToken ct)
    {
        var r = await _news.ToggleVisibilityAsync(id, ct);
        return r is null ? NotFound() : Ok(r);
    }
}
