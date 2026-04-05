using MustGraduationPlatform.Application.Dtos;

namespace MustGraduationPlatform.Application.Abstractions;

public interface IContactService
{
    Task<IReadOnlyList<ContactMessageDto>> GetAllAsync(CancellationToken ct = default);
    Task<ContactMessageDto> CreateAsync(ContactMessageCreateDto dto, CancellationToken ct = default);
    Task<ContactMessageDto?> UpdateStatusAsync(int id, ContactMessageStatusUpdateDto dto, CancellationToken ct = default);
    Task<bool> DeleteAsync(int id, CancellationToken ct = default);
}
