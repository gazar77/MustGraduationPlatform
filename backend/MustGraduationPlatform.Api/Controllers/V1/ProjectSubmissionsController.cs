using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using MustGraduationPlatform.Application.Abstractions;
using MustGraduationPlatform.Application.Dtos;

namespace MustGraduationPlatform.Api.Controllers.V1;

[ApiController]
[Route("api/v1/[controller]")]
[Authorize]
public class ProjectSubmissionsController : ControllerBase
{
    private readonly IProjectSubmissionService _submissions;

    public ProjectSubmissionsController(IProjectSubmissionService submissions)
    {
        _submissions = submissions;
    }

    [HttpGet]
    [Authorize(Roles = "Admin")]
    public async Task<ActionResult<IReadOnlyList<ProjectSubmissionDto>>> Get([FromQuery] string? type, CancellationToken ct)
        => Ok(await _submissions.GetAsync(type, ct));

    [HttpPost]
    [Authorize(Roles = "Student,Admin")]
    public async Task<ActionResult<ProjectSubmissionDto>> Create([FromBody] ProjectSubmissionCreateDto dto, CancellationToken ct)
        => Ok(await _submissions.CreateAsync(dto, ct));

    [HttpPatch("{id:int}/status")]
    [Authorize(Roles = "Admin")]
    public async Task<ActionResult<ProjectSubmissionDto>> UpdateStatus(int id, [FromBody] ProjectSubmissionStatusUpdateDto dto, CancellationToken ct)
    {
        var r = await _submissions.UpdateStatusAsync(id, dto, ct);
        return r is null ? NotFound() : Ok(r);
    }

    [HttpDelete("{id:int}")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> Delete(int id, CancellationToken ct)
        => await _submissions.DeleteAsync(id, ct) ? NoContent() : NotFound();
}
