using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using MustGraduationPlatform.Application.Abstractions;
using MustGraduationPlatform.Application.Dtos;
using MustGraduationPlatform.Api.Models;

namespace MustGraduationPlatform.Api.Controllers.V1;

[ApiController]
[Route("api/v1/[controller]")]
[Authorize]
public class GraduationController : ControllerBase
{
    private readonly IGraduationService _graduation;

    public GraduationController(IGraduationService graduation)
    {
        _graduation = graduation;
    }

    [HttpGet("my-project")]
    [Authorize(Roles = "Student")]
    public async Task<ActionResult<GraduationProjectDto>> GetMyProject(CancellationToken ct)
    {
        var r = await _graduation.GetMyProjectAsync(User, ct);
        return r is null ? NotFound() : Ok(r);
    }

    [HttpGet("requirements/my")]
    [Authorize(Roles = "Student")]
    public async Task<ActionResult<IReadOnlyList<GraduationRequirementFileDto>>> GetMyRequirementFiles(CancellationToken ct)
        => Ok(await _graduation.GetMyRequirementFilesAsync(User, ct));

    [HttpPost("requirements/upload")]
    [Authorize(Roles = "Student")]
    [Consumes("multipart/form-data")]
    [RequestFormLimits(MultipartBodyLengthLimit = 26_214_400)]
    public async Task<ActionResult<GraduationRequirementFileDto>> UploadRequirement([FromForm] GraduationRequirementFormModel model, CancellationToken ct)
    {
        if (model.File is null || model.File.Length == 0)
            return BadRequest(new { message = "File is required." });

        await using var stream = model.File.OpenReadStream();
        return Ok(await _graduation.UploadRequirementAsync(User, model.RequirementKey, stream, model.File.Length, model.File.FileName, model.File.ContentType, ct));
    }
}
