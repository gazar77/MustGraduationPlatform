using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using MustGraduationPlatform.Application.Abstractions;
using MustGraduationPlatform.Application.Dtos;

namespace MustGraduationPlatform.Api.Controllers.V1;

[ApiController]
[Route("api/v1/[controller]")]
public class ContactController : ControllerBase
{
    private readonly IContactService _contact;

    public ContactController(IContactService contact)
    {
        _contact = contact;
    }

    [HttpPost]
    [AllowAnonymous]
    public async Task<ActionResult<ContactMessageDto>> Create([FromBody] ContactMessageCreateDto dto, CancellationToken ct)
        => Ok(await _contact.CreateAsync(dto, ct));

    [HttpGet]
    [Authorize(Roles = "Admin")]
    public async Task<ActionResult<IReadOnlyList<ContactMessageDto>>> GetAll(CancellationToken ct)
        => Ok(await _contact.GetAllAsync(ct));

    [HttpPatch("{id:int}/status")]
    [Authorize(Roles = "Admin")]
    public async Task<ActionResult<ContactMessageDto>> UpdateStatus(int id, [FromBody] ContactMessageStatusUpdateDto dto, CancellationToken ct)
    {
        var r = await _contact.UpdateStatusAsync(id, dto, ct);
        return r is null ? NotFound() : Ok(r);
    }

    [HttpDelete("{id:int}")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> Delete(int id, CancellationToken ct)
        => await _contact.DeleteAsync(id, ct) ? NoContent() : NotFound();
}
