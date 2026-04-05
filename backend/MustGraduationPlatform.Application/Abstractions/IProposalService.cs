using MustGraduationPlatform.Application.Dtos;

namespace MustGraduationPlatform.Application.Abstractions;

public interface IProposalService
{
    Task<IReadOnlyList<ProposalDto>> GetAllAsync(CancellationToken ct = default);
    Task<ProposalDto?> GetByIdAsync(int id, CancellationToken ct = default);
    Task<ProposalDto> CreateAsync(ProposalCreateDto dto, CancellationToken ct = default);
    Task<ProposalDto?> UpdateStatusAsync(int id, ProposalStatusUpdateDto dto, CancellationToken ct = default);
    Task<bool> DeleteAsync(int id, CancellationToken ct = default);
}
