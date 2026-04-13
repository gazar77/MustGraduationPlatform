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
    private const int MaxProjectRegistrationFiles = 6;
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
    [RequestFormLimits(MultipartBodyLengthLimit = 160_000_000)]
    public async Task<ActionResult<ProjectSubmissionDto>> CreateWithFile([FromForm] ProjectSubmissionFormModel model, CancellationToken ct)
    {
        var multi = model.Files?.Where(f => f is { Length: > 0 }).ToList() ?? new List<Microsoft.AspNetCore.Http.IFormFile>();
        if (multi.Count == 0 && model.File is { Length: > 0 })
            multi.Add(model.File);

        if (multi.Count == 0)
            return BadRequest(new { message = "At least one file is required." });

        var isProjectReg = model.Type is "project1" or "project2";
        if (isProjectReg && multi.Count > MaxProjectRegistrationFiles)
            return BadRequest(new { message = $"Maximum {MaxProjectRegistrationFiles} files allowed." });
        if (!isProjectReg && multi.Count > 1)
            return BadRequest(new { message = "Only one file is allowed for this submission type." });

        var dto = new ProjectSubmissionCreateDto(
            model.Type,
            model.StudentName,
            model.Email,
            model.ProjectNumber,
            model.ProjectTitle,
            model.SupervisorName,
            model.TeamLeaderName,
            multi[0].FileName,
            model.Notes ?? string.Empty);

        if (multi.Count == 1)
        {
            await using var stream = multi[0].OpenReadStream();
            return Ok(await _submissions.CreateWithFileAsync(dto, stream, multi[0].FileName, multi[0].ContentType, ct));
        }

        var parts = new List<(Stream Stream, string OriginalName, string? ContentType)>();
        foreach (var f in multi)
            parts.Add((f.OpenReadStream(), f.FileName, f.ContentType));

        try
        {
            return Ok(await _submissions.CreateWithFilesAsync(dto, parts, ct));
        }
        finally
        {
            foreach (var (s, _, _) in parts)
                await s.DisposeAsync();
        }
    }

    [HttpGet("{id:int}/download-all")]
    [Authorize(Roles = "Admin,SuperAdmin")]
    public async Task<IActionResult> DownloadAll(int id, CancellationToken ct)
    {
        var stream = await _submissions.GetAttachmentsZipStreamAsync(id, ct);
        if (stream is null)
            return NotFound();
        return File(stream, "application/zip", $"project-submission-{id}.zip");
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
