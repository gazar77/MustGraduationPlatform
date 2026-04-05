using MustGraduationPlatform.Application.Dtos;

namespace MustGraduationPlatform.Application.Abstractions;

public interface INewsService
{
    Task<IReadOnlyList<NewsDto>> GetVisibleAsync(CancellationToken ct = default);
    Task<IReadOnlyList<NewsDto>> GetAllAsync(CancellationToken ct = default);
    Task<NewsDto?> GetByIdAsync(int id, CancellationToken ct = default);
    Task<NewsDto> CreateAsync(NewsCreateUpdateDto dto, CancellationToken ct = default);
    Task<NewsDto?> UpdateAsync(int id, NewsCreateUpdateDto dto, CancellationToken ct = default);
    Task<bool> DeleteAsync(int id, CancellationToken ct = default);
    Task<NewsDto?> ToggleVisibilityAsync(int id, CancellationToken ct = default);
}
