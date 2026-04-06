using MustGraduationPlatform.Application.Dtos;

namespace MustGraduationPlatform.Application.Abstractions;

public interface IDashboardService
{
    Task<DashboardStatsDto> GetStatsAsync(CancellationToken ct = default);
    Task<IReadOnlyList<ActivityDto>> GetRecentActivitiesAsync(CancellationToken ct = default);
    Task<ActivityDto> AddActivityAsync(ActivityCreateDto dto, CancellationToken ct = default);
}
