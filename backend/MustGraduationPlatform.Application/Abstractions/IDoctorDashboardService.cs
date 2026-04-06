using System.Security.Claims;
using MustGraduationPlatform.Application.Dtos;

namespace MustGraduationPlatform.Application.Abstractions;

public interface IDoctorDashboardService
{
    Task<DoctorDashboardDto> GetDashboardAsync(ClaimsPrincipal principal, CancellationToken ct = default);
}
