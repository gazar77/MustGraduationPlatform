using Microsoft.EntityFrameworkCore;
using MustGraduationPlatform.Application.Abstractions;
using MustGraduationPlatform.Application.Dtos;
using MustGraduationPlatform.Domain.Enums;
using MustGraduationPlatform.Infrastructure.Identity;
using MustGraduationPlatform.Infrastructure.Persistence;

namespace MustGraduationPlatform.Infrastructure.Services;

public class DashboardService : IDashboardService
{
    private readonly AppDbContext _db;

    public DashboardService(AppDbContext db)
    {
        _db = db;
    }

    public async Task<DashboardStatsDto> GetStatsAsync(CancellationToken ct = default)
    {
        var ideas = await _db.Ideas.ToListAsync(ct);
        var totalIdeas = ideas.Count;
        var reserved = ideas.Count(i => i.Status == "Reserved");
        var approved = ideas.Count(i => i.Status == "Approved");

        var totalDoctors = await _db.Set<ApplicationUser>()
            .CountAsync(u => u.UserRole == UserRole.Admin, ct);

        var totalProposals = await _db.Proposals.CountAsync(ct);

        var visibleNews = await _db.NewsArticles.CountAsync(n => n.IsVisible, ct);
        var visibleEvents = await _db.CalendarEvents.CountAsync(e => e.IsVisible, ct);
        var visibleTemplates = await _db.DocumentTemplates.CountAsync(t => t.IsVisible, ct);
        var visibleContent = visibleNews + visibleEvents + visibleTemplates;

        return new DashboardStatsDto(
            totalIdeas,
            reserved,
            approved,
            totalDoctors,
            totalProposals,
            visibleContent);
    }

    public async Task<IReadOnlyList<ActivityDto>> GetRecentActivitiesAsync(CancellationToken ct = default)
    {
        var list = await _db.DashboardActivities
            .OrderByDescending(a => a.Timestamp)
            .Take(20)
            .ToListAsync(ct);
        return list.Select(EntityMappers.ToDto).ToList();
    }
}
