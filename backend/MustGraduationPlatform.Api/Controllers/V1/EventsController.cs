using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using MustGraduationPlatform.Application.Abstractions;
using MustGraduationPlatform.Application.Dtos;
using MustGraduationPlatform.Api.Models;

namespace MustGraduationPlatform.Api.Controllers.V1;

[ApiController]
[Route("api/v1/[controller]")]
public class EventsController : ControllerBase
{
    private readonly IEventService _events;

    public EventsController(IEventService events)
    {
        _events = events;
    }

    [HttpPost("with-image")]
    [Authorize(Roles = "Admin,SuperAdmin")]
    [Consumes("multipart/form-data")]
    [RequestFormLimits(MultipartBodyLengthLimit = 6_291_456)]
    public async Task<ActionResult<EventDto>> CreateWithImage([FromForm] EventFormModel model, CancellationToken ct)
    {
        if (model.Image is null || model.Image.Length == 0)
            return BadRequest(new { message = "Image is required." });

        var dto = new EventCreateUpdateDto(
            model.Title,
            model.Description ?? "",
            model.Date,
            model.Time,
            null,
            model.Location,
            model.Organizer,
            model.Category,
            model.IsVisible,
            model.DisplayOrder);
        await using var stream = model.Image.OpenReadStream();
        return Ok(await _events.CreateWithImageAsync(dto, stream, model.Image.Length, model.Image.FileName, ct));
    }

    [HttpPut("{id:int}/with-image")]
    [Authorize(Roles = "Admin,SuperAdmin")]
    [Consumes("multipart/form-data")]
    [RequestFormLimits(MultipartBodyLengthLimit = 6_291_456)]
    public async Task<ActionResult<EventDto>> UpdateWithImage(int id, [FromForm] EventFormModel model, CancellationToken ct)
    {
        if (model.Image is null || model.Image.Length == 0)
            return BadRequest(new { message = "Image is required." });

        var dto = new EventCreateUpdateDto(
            model.Title,
            model.Description ?? "",
            model.Date,
            model.Time,
            null,
            model.Location,
            model.Organizer,
            model.Category,
            model.IsVisible,
            model.DisplayOrder);
        await using var stream = model.Image.OpenReadStream();
        var r = await _events.UpdateWithImageAsync(id, dto, stream, model.Image.Length, model.Image.FileName, ct);
        return r is null ? NotFound() : Ok(r);
    }

    [HttpGet]
    [AllowAnonymous]
    public async Task<ActionResult<IReadOnlyList<EventDto>>> GetVisible(CancellationToken ct)
        => Ok(await _events.GetVisibleAsync(ct));

    [HttpGet("manage")]
    [Authorize(Roles = "Admin,SuperAdmin")]
    public async Task<ActionResult<IReadOnlyList<EventDto>>> GetAll(CancellationToken ct)
        => Ok(await _events.GetAllAsync(ct));

    [HttpGet("{id:int}")]
    [AllowAnonymous]
    public async Task<ActionResult<EventDto>> GetById(int id, CancellationToken ct)
    {
        var item = await _events.GetByIdAsync(id, ct);
        if (item is null) return NotFound();
        if (!item.IsVisible && !User.IsInRole("Admin"))
            return NotFound();
        return Ok(item);
    }

    [HttpPost]
    [Authorize(Roles = "Admin,SuperAdmin")]
    public async Task<ActionResult<EventDto>> Create([FromBody] EventCreateUpdateDto dto, CancellationToken ct)
        => Ok(await _events.CreateAsync(dto, ct));

    [HttpPut("{id:int}")]
    [Authorize(Roles = "Admin,SuperAdmin")]
    public async Task<ActionResult<EventDto>> Update(int id, [FromBody] EventCreateUpdateDto dto, CancellationToken ct)
    {
        var r = await _events.UpdateAsync(id, dto, ct);
        return r is null ? NotFound() : Ok(r);
    }

    [HttpDelete("{id:int}")]
    [Authorize(Roles = "Admin,SuperAdmin")]
    public async Task<IActionResult> Delete(int id, CancellationToken ct)
        => await _events.DeleteAsync(id, ct) ? NoContent() : NotFound();

    [HttpPost("{id:int}/toggle-visibility")]
    [Authorize(Roles = "Admin,SuperAdmin")]
    public async Task<ActionResult<EventDto>> Toggle(int id, CancellationToken ct)
    {
        var r = await _events.ToggleVisibilityAsync(id, ct);
        return r is null ? NotFound() : Ok(r);
    }
}
