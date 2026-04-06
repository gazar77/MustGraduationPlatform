using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using MustGraduationPlatform.Application.Abstractions;
using MustGraduationPlatform.Application.Dtos;

namespace MustGraduationPlatform.Api.Controllers.V1;

[ApiController]
[Route("api/v1/[controller]")]
public class DashboardController : ControllerBase
{
    private readonly IDashboardService _dashboard;

    public DashboardController(IDashboardService dashboard)
    {
        _dashboard = dashboard;
    }

    [HttpGet("stats")]
    [AllowAnonymous]
    public async Task<ActionResult<DashboardStatsDto>> Stats(CancellationToken ct)
        => Ok(await _dashboard.GetStatsAsync(ct));

    [HttpGet("activities")]
    [AllowAnonymous]
    public async Task<ActionResult<IReadOnlyList<ActivityDto>>> Activities(CancellationToken ct)
        => Ok(await _dashboard.GetRecentActivitiesAsync(ct));

    [HttpPost("activities")]
    [Authorize(Roles = "Admin")]
    public async Task<ActionResult<ActivityDto>> AddActivity([FromBody] ActivityCreateDto dto, CancellationToken ct)
        => Ok(await _dashboard.AddActivityAsync(dto, ct));
}
