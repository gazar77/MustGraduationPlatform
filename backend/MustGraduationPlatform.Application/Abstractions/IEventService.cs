using MustGraduationPlatform.Application.Dtos;

namespace MustGraduationPlatform.Application.Abstractions;

public interface IEventService
{
    Task<IReadOnlyList<EventDto>> GetVisibleAsync(CancellationToken ct = default);
    Task<IReadOnlyList<EventDto>> GetAllAsync(CancellationToken ct = default);
    Task<EventDto?> GetByIdAsync(int id, CancellationToken ct = default);
    Task<EventDto> CreateAsync(EventCreateUpdateDto dto, CancellationToken ct = default);
    Task<EventDto?> UpdateAsync(int id, EventCreateUpdateDto dto, CancellationToken ct = default);
    Task<bool> DeleteAsync(int id, CancellationToken ct = default);
    Task<EventDto?> ToggleVisibilityAsync(int id, CancellationToken ct = default);
}
