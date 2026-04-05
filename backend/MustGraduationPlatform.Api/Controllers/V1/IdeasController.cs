using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using MustGraduationPlatform.Application.Abstractions;
using MustGraduationPlatform.Application.Dtos;

namespace MustGraduationPlatform.Api.Controllers.V1;

[ApiController]
[Route("api/v1/[controller]")]
public class IdeasController : ControllerBase
{
    private readonly IIdeaService _ideas;

    public IdeasController(IIdeaService ideas)
    {
        _ideas = ideas;
    }

    [HttpGet]
    [AllowAnonymous]
    public async Task<ActionResult<IReadOnlyList<IdeaDto>>> GetVisible(CancellationToken ct)
        => Ok(await _ideas.GetVisibleAsync(ct));

    [HttpGet("manage")]
    [Authorize(Roles = "Admin")]
    public async Task<ActionResult<IReadOnlyList<IdeaDto>>> GetAll(CancellationToken ct)
        => Ok(await _ideas.GetAllAsync(ct));

    [HttpGet("{id:int}")]
    [AllowAnonymous]
    public async Task<ActionResult<IdeaDto>> GetById(int id, CancellationToken ct)
    {
        var idea = await _ideas.GetByIdAsync(id, ct);
        if (idea is null) return NotFound();
        if (!idea.IsVisible && !User.IsInRole("Admin"))
            return NotFound();
        return Ok(idea);
    }

    [HttpPost]
    [Authorize(Roles = "Admin")]
    public async Task<ActionResult<IdeaDto>> Create([FromBody] IdeaCreateUpdateDto dto, CancellationToken ct)
        => Ok(await _ideas.CreateAsync(dto, ct));

    [HttpPut("{id:int}")]
    [Authorize(Roles = "Admin")]
    public async Task<ActionResult<IdeaDto>> Update(int id, [FromBody] IdeaCreateUpdateDto dto, CancellationToken ct)
    {
        var r = await _ideas.UpdateAsync(id, dto, ct);
        return r is null ? NotFound() : Ok(r);
    }

    [HttpDelete("{id:int}")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> Delete(int id, CancellationToken ct)
        => await _ideas.DeleteAsync(id, ct) ? NoContent() : NotFound();

    [HttpPost("{id:int}/toggle-visibility")]
    [Authorize(Roles = "Admin")]
    public async Task<ActionResult<IdeaDto>> ToggleVisibility(int id, CancellationToken ct)
    {
        var r = await _ideas.ToggleVisibilityAsync(id, ct);
        return r is null ? NotFound() : Ok(r);
    }
}
