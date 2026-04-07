using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using MustGraduationPlatform.Application.Abstractions;
using MustGraduationPlatform.Application.Dtos;
using MustGraduationPlatform.Application.Exceptions;

namespace MustGraduationPlatform.Api.Controllers.V1;

[ApiController]
[Route("api/v1/[controller]")]
public class IdeasController : ControllerBase
{
    private readonly IIdeaService _ideas;
    private readonly IAuthService _auth;

    public IdeasController(IIdeaService ideas, IAuthService auth)
    {
        _ideas = ideas;
        _auth = auth;
    }

    [HttpGet]
    [AllowAnonymous]
    public async Task<ActionResult<IReadOnlyList<IdeaDto>>> GetVisible(CancellationToken ct)
        => Ok(await _ideas.GetVisibleAsync(ct));

    [HttpGet("manage")]
    [Authorize(Roles = "Admin")]
    public async Task<ActionResult<IReadOnlyList<IdeaDto>>> GetAll(CancellationToken ct)
        => Ok(await _ideas.GetAllAsync(ct));

    /// <summary>Ideas where the current admin user's display name matches <see cref="Idea.SupervisorName"/> (faculty dashboard).</summary>
    [HttpGet("for-me")]
    [Authorize(Roles = "Admin")]
    public async Task<ActionResult<IReadOnlyList<IdeaDto>>> GetForMe(CancellationToken ct)
    {
        var me = await _auth.GetCurrentUserAsync(User, ct);
        if (me is null) return Unauthorized();
        return Ok(await _ideas.GetForSupervisorAsync(me.Name, ct));
    }

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

    [HttpPost("student-submit")]
    [Authorize(Roles = "Student,Admin")]
    public async Task<ActionResult<IdeaDto>> StudentSubmit([FromBody] IdeaStudentSubmitDto request, CancellationToken ct)
        => Ok(await _ideas.CreateStudentSubmissionAsync(request, ct));

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

    [HttpPost("{id:int}/reserve")]
    [Authorize(Roles = "Student,Admin")]
    public async Task<ActionResult<IdeaDto>> Reserve(int id, CancellationToken ct)
    {
        try
        {
            var r = await _ideas.ReserveAsync(id, ct);
            return r is null ? NotFound() : Ok(r);
        }
        catch (AppException ex)
        {
            return BadRequest(new { code = ex.Code, message = ex.Message });
        }
    }
}
