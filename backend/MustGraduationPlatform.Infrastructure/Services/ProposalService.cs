using System.Text.Json;
using Microsoft.EntityFrameworkCore;
using MustGraduationPlatform.Application.Abstractions;
using MustGraduationPlatform.Application.Dtos;
using MustGraduationPlatform.Domain.Entities;
using MustGraduationPlatform.Infrastructure.Persistence;

namespace MustGraduationPlatform.Infrastructure.Services;

public class ProposalService : IProposalService
{
    private static readonly JsonSerializerOptions Json = new() { PropertyNamingPolicy = JsonNamingPolicy.CamelCase };

    private readonly AppDbContext _db;

    public ProposalService(AppDbContext db)
    {
        _db = db;
    }

    public async Task<IReadOnlyList<ProposalDto>> GetAllAsync(CancellationToken ct = default)
    {
        var list = await _db.Proposals.OrderByDescending(p => p.SubmissionDate).ToListAsync(ct);
        return list.Select(EntityMappers.ToDto).ToList();
    }

    public async Task<ProposalDto?> GetByIdAsync(int id, CancellationToken ct = default)
    {
        var e = await _db.Proposals.FindAsync(new object[] { id }, ct);
        return e is null ? null : EntityMappers.ToDto(e);
    }

    public async Task<ProposalDto> CreateAsync(ProposalCreateDto dto, CancellationToken ct = default)
    {
        var e = new Proposal
        {
            ProjectName = dto.ProjectName,
            TeamName = dto.TeamName,
            MembersJson = JsonSerializer.Serialize(dto.Members, Json),
            Department = dto.Department,
            ProposedSupervisor = dto.ProposedSupervisor,
            Idea = dto.Idea,
            Goals = dto.Goals,
            Description = dto.Description,
            ToolsJson = JsonSerializer.Serialize(dto.Tools, Json),
            Notes = dto.Notes,
            Status = "New",
            SubmissionDate = DateTime.UtcNow
        };
        _db.Proposals.Add(e);
        await _db.SaveChangesAsync(ct);
        return EntityMappers.ToDto(e);
    }

    public async Task<ProposalDto?> UpdateStatusAsync(int id, ProposalStatusUpdateDto dto, CancellationToken ct = default)
    {
        var e = await _db.Proposals.FindAsync(new object[] { id }, ct);
        if (e is null) return null;
        e.Status = dto.Status;
        await _db.SaveChangesAsync(ct);
        return EntityMappers.ToDto(e);
    }

    public async Task<bool> DeleteAsync(int id, CancellationToken ct = default)
    {
        var e = await _db.Proposals.FindAsync(new object[] { id }, ct);
        if (e is null) return false;
        _db.Proposals.Remove(e);
        await _db.SaveChangesAsync(ct);
        return true;
    }
}
