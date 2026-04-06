using MustGraduationPlatform.Application.Dtos;

namespace MustGraduationPlatform.Application.Abstractions;

public interface ITemplateService
{
    Task<IReadOnlyList<TemplateDto>> GetVisibleAsync(CancellationToken ct = default);
    Task<IReadOnlyList<TemplateDto>> GetAllAsync(CancellationToken ct = default);
    Task<TemplateDto?> GetByIdAsync(int id, CancellationToken ct = default);
    Task<TemplateDto> CreateAsync(TemplateCreateUpdateDto dto, CancellationToken ct = default);
    Task<TemplateDto> CreateWithFileAsync(TemplateCreateUpdateDto dto, Stream fileStream, long fileLength, string fileName, string? contentType, CancellationToken ct = default);
    Task<TemplateDto?> UpdateAsync(int id, TemplateCreateUpdateDto dto, CancellationToken ct = default);
    Task<bool> DeleteAsync(int id, CancellationToken ct = default);
    Task<TemplateDto?> ToggleVisibilityAsync(int id, CancellationToken ct = default);
}
