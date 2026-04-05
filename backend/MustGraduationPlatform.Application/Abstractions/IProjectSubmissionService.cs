using MustGraduationPlatform.Application.Dtos;

namespace MustGraduationPlatform.Application.Abstractions;

public interface IProjectSubmissionService
{
    Task<IReadOnlyList<ProjectSubmissionDto>> GetAsync(string? type, CancellationToken ct = default);
    Task<ProjectSubmissionDto> CreateAsync(ProjectSubmissionCreateDto dto, CancellationToken ct = default);
    Task<ProjectSubmissionDto?> UpdateStatusAsync(int id, ProjectSubmissionStatusUpdateDto dto, CancellationToken ct = default);
    Task<bool> DeleteAsync(int id, CancellationToken ct = default);
}
