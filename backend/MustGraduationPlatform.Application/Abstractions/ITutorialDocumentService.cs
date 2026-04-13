using MustGraduationPlatform.Application.Dtos;

namespace MustGraduationPlatform.Application.Abstractions;

public interface ITutorialDocumentService
{
    Task<IReadOnlyList<TutorialDocumentDto>> GetVisibleAsync(CancellationToken ct = default);
    Task<IReadOnlyList<TutorialDocumentDto>> GetAllAsync(CancellationToken ct = default);
    Task<TutorialDocumentDto?> GetByIdAsync(int id, CancellationToken ct = default);
    Task<TutorialDocumentDto> CreateAsync(TutorialDocumentCreateUpdateDto dto, CancellationToken ct = default);
    Task<TutorialDocumentDto> CreateWithFileAsync(TutorialDocumentCreateUpdateDto dto, Stream fileStream, long fileLength, string fileName, string? contentType, CancellationToken ct = default);
    Task<TutorialDocumentDto?> UpdateAsync(int id, TutorialDocumentCreateUpdateDto dto, CancellationToken ct = default);
    Task<TutorialDocumentDto?> UpdateWithFileAsync(int id, TutorialDocumentCreateUpdateDto dto, Stream fileStream, long fileLength, string fileName, string? contentType, CancellationToken ct = default);
    Task<bool> DeleteAsync(int id, CancellationToken ct = default);
    Task<TutorialDocumentDto?> ToggleVisibilityAsync(int id, CancellationToken ct = default);
}
