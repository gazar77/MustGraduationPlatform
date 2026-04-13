using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using MustGraduationPlatform.Application.Abstractions;
using MustGraduationPlatform.Application.Dtos;

namespace MustGraduationPlatform.Api.Controllers.V1;

[ApiController]
[Route("api/v1/[controller]")]
[Authorize]
public class ProposalsController : ControllerBase
{
    private readonly IProposalService _proposals;

    public ProposalsController(IProposalService proposals)
    {
        _proposals = proposals;
    }

    [HttpGet]
    [Authorize(Roles = "Admin,SuperAdmin")]
    public async Task<ActionResult<IReadOnlyList<ProposalDto>>> GetAll(CancellationToken ct)
        => Ok(await _proposals.GetAllAsync(ct));

    [HttpGet("{id:int}")]
    [Authorize(Roles = "Admin,SuperAdmin")]
    public async Task<ActionResult<ProposalDto>> GetById(int id, CancellationToken ct)
    {
        var r = await _proposals.GetByIdAsync(id, ct);
        return r is null ? NotFound() : Ok(r);
    }

    [HttpPost]
    [Authorize(Roles = "Student,Admin,SuperAdmin")]
    public async Task<ActionResult<ProposalDto>> Create([FromBody] ProposalCreateDto dto, CancellationToken ct)
        => Ok(await _proposals.CreateAsync(dto, ct));

    [HttpPatch("{id:int}/status")]
    [Authorize(Roles = "Admin,SuperAdmin")]
    public async Task<ActionResult<ProposalDto>> UpdateStatus(int id, [FromBody] ProposalStatusUpdateDto dto, CancellationToken ct)
    {
        var r = await _proposals.UpdateStatusAsync(id, dto, ct);
        return r is null ? NotFound() : Ok(r);
    }

    [HttpDelete("{id:int}")]
    [Authorize(Roles = "Admin,SuperAdmin")]
    public async Task<IActionResult> Delete(int id, CancellationToken ct)
        => await _proposals.DeleteAsync(id, ct) ? NoContent() : NotFound();
}
