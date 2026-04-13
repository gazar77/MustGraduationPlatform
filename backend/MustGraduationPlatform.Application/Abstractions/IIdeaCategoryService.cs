using MustGraduationPlatform.Application.Dtos;

namespace MustGraduationPlatform.Application.Abstractions;

public interface IIdeaCategoryService
{
    Task<IReadOnlyList<IdeaCategoryDto>> GetVisibleAsync(CancellationToken ct = default);
    Task<IReadOnlyList<IdeaCategoryDto>> GetAllAsync(CancellationToken ct = default);
    Task<IdeaCategoryDto> CreateAsync(IdeaCategoryCreateUpdateDto dto, CancellationToken ct = default);
    Task<IdeaCategoryDto?> UpdateAsync(int id, IdeaCategoryCreateUpdateDto dto, CancellationToken ct = default);
    Task<bool> DeleteAsync(int id, CancellationToken ct = default);
}
