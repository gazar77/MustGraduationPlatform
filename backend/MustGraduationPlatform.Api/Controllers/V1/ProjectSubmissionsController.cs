using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using MustGraduationPlatform.Application.Abstractions;
using MustGraduationPlatform.Application.Dtos;
using MustGraduationPlatform.Api.Models;
using System.Security.Claims;

namespace MustGraduationPlatform.Api.Controllers.V1;

[ApiController]
[Route("api/v1/project-submissions")]
[Authorize]
public class ProjectSubmissionsController : ControllerBase
{
    private readonly IProjectSubmissionService _submissions;

    public ProjectSubmissionsController(IProjectSubmissionService submissions)
    {
        _submissions = submissions;
    }

    [HttpGet]
    [Authorize(Roles = "Admin,SuperAdmin")]
    public async Task<ActionResult<IReadOnlyList<ProjectSubmissionDto>>> Get([FromQuery] string? type, CancellationToken ct)
        => Ok(await _submissions.GetAsync(type, ct));

    [HttpPost("idea-registration")]
    [Authorize(Roles = "Student,Admin,SuperAdmin")]
    public async Task<ActionResult<ProjectSubmissionDto>> CreateIdeaRegistration([FromBody] IdeaRegistrationSubmitDto dto, CancellationToken ct)
    {
        var email = User.FindFirstValue(ClaimTypes.Email);
        return Ok(await _submissions.CreateIdeaRegistrationAsync(dto, email, ct));
    }

    [HttpPost]
    [Authorize(Roles = "Student,Admin,SuperAdmin")]
    public async Task<ActionResult<ProjectSubmissionDto>> Create([FromBody] ProjectSubmissionCreateDto dto, CancellationToken ct)
        => Ok(await _submissions.CreateAsync(dto, ct));

    [HttpPost("with-file")]
    [Consumes("multipart/form-data")]
    [Authorize(Roles = "Student,Admin,SuperAdmin")]
    [RequestFormLimits(MultipartBodyLengthLimit = 26_214_400)]
    public async Task<ActionResult<ProjectSubmissionDto>> CreateWithFile([FromForm] ProjectSubmissionFormModel model, CancellationToken ct)
    {
        if (model.File is null || model.File.Length == 0)
            return BadRequest(new { message = "File is required." });

        await using var stream = model.File.OpenReadStream();
        var dto = new ProjectSubmissionCreateDto(
            model.Type,
            model.StudentName,
            model.Email,
            model.ProjectNumber,
            model.ProjectTitle,
            model.SupervisorName,
            model.TeamLeaderName,
            model.File.FileName,
            model.Notes ?? string.Empty);
        return Ok(await _submissions.CreateWithFileAsync(dto, stream, model.File.FileName, model.File.ContentType, ct));
    }

    [HttpPatch("{id:int}/status")]
    [Authorize(Roles = "Admin,SuperAdmin")]
    public async Task<ActionResult<ProjectSubmissionDto>> UpdateStatus(int id, [FromBody] ProjectSubmissionStatusUpdateDto dto, CancellationToken ct)
    {
        var r = await _submissions.UpdateStatusAsync(id, dto, ct);
        return r is null ? NotFound() : Ok(r);
    }

    [HttpDelete("{id:int}")]
    [Authorize(Roles = "Admin,SuperAdmin")]
    public async Task<IActionResult> Delete(int id, CancellationToken ct)
        => await _submissions.DeleteAsync(id, ct) ? NoContent() : NotFound();
}
