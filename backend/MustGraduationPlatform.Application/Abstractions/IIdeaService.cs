using MustGraduationPlatform.Application.Dtos;

namespace MustGraduationPlatform.Application.Abstractions;

public interface IIdeaService
{
    Task<IReadOnlyList<IdeaDto>> GetVisibleAsync(CancellationToken ct = default);
        Task<IReadOnlyList<IdeaDto>> GetAllAsync(CancellationToken ct = default);
        Task<IReadOnlyList<IdeaDto>> GetForSupervisorAsync(string supervisorName, CancellationToken ct = default);
        Task<IdeaDto?> GetByIdAsync(int id, CancellationToken ct = default);
    Task<IdeaDto> CreateAsync(IdeaCreateUpdateDto dto, CancellationToken ct = default);
    Task<IdeaDto> CreateStudentSubmissionAsync(IdeaStudentSubmitDto dto, CancellationToken ct = default);
    Task<IdeaDto?> UpdateAsync(int id, IdeaCreateUpdateDto dto, CancellationToken ct = default);
    Task<bool> DeleteAsync(int id, CancellationToken ct = default);
    Task<IdeaDto?> ToggleVisibilityAsync(int id, CancellationToken ct = default);
    Task<IdeaDto?> ReserveAsync(int id, CancellationToken ct = default);
}
