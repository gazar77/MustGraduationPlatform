using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using MustGraduationPlatform.Application.Abstractions;
using MustGraduationPlatform.Application.Dtos;

namespace MustGraduationPlatform.Api.Controllers.V1;

[ApiController]
[Route("api/v1/doctor")]
[Authorize(Roles = "Admin,SuperAdmin")]
public class DoctorController : ControllerBase
{
    private readonly IDoctorDashboardService _doctor;

    public DoctorController(IDoctorDashboardService doctor)
    {
        _doctor = doctor;
    }

    [HttpGet("dashboard")]
    public async Task<ActionResult<DoctorDashboardDto>> GetDashboard(CancellationToken ct)
        => Ok(await _doctor.GetDashboardAsync(User, ct));
}
