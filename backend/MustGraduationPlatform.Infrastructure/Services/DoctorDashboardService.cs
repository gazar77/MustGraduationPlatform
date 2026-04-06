using System.Security.Claims;
using Microsoft.EntityFrameworkCore;
using MustGraduationPlatform.Application.Abstractions;
using MustGraduationPlatform.Application.Dtos;
using MustGraduationPlatform.Application.Exceptions;
using MustGraduationPlatform.Infrastructure.Persistence;

namespace MustGraduationPlatform.Infrastructure.Services;

public class DoctorDashboardService : IDoctorDashboardService
{
    private readonly AppDbContext _db;
    private readonly IAuthService _auth;

    public DoctorDashboardService(AppDbContext db, IAuthService auth)
    {
        _db = db;
        _auth = auth;
    }

    public async Task<DoctorDashboardDto> GetDashboardAsync(ClaimsPrincipal principal, CancellationToken ct = default)
    {
        var user = await _auth.GetCurrentUserAsync(principal, ct)
                   ?? throw new AppException("AUTH_UNAUTHORIZED", "Not authenticated.");

        var name = user.Name.Trim();
        var ideas = await _db.Ideas
            .AsNoTracking()
            .Where(i => i.SupervisorName == name)
            .OrderBy(i => i.DisplayOrder)
            .ToListAsync(ct);

        var pendingStatuses = new[] { "New", "Pending", "Reviewed" };
        var pendingProposals = await _db.Proposals
            .AsNoTracking()
            .CountAsync(p => pendingStatuses.Contains(p.Status) && p.ProposedSupervisor.Trim() == name, ct);

        var dtos = ideas.Select(EntityMappers.ToDto).ToList();
        return new DoctorDashboardDto(ideas.Count, pendingProposals, dtos);
    }
}
