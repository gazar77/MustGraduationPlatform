using Microsoft.EntityFrameworkCore;
using MustGraduationPlatform.Application.Abstractions;
using MustGraduationPlatform.Application.Dtos;
using MustGraduationPlatform.Domain.Entities;
using MustGraduationPlatform.Infrastructure.Persistence;

namespace MustGraduationPlatform.Infrastructure.Services;

public class EventService : IEventService
{
    private readonly AppDbContext _db;

    public EventService(AppDbContext db)
    {
        _db = db;
    }

    public async Task<IReadOnlyList<EventDto>> GetVisibleAsync(CancellationToken ct = default)
    {
        var list = await _db.CalendarEvents.Where(e => e.IsVisible).OrderBy(e => e.DisplayOrder).ToListAsync(ct);
        return list.Select(EntityMappers.ToDto).ToList();
    }

    public async Task<IReadOnlyList<EventDto>> GetAllAsync(CancellationToken ct = default)
    {
        var list = await _db.CalendarEvents.OrderBy(e => e.Date).ToListAsync(ct);
        return list.Select(EntityMappers.ToDto).ToList();
    }

    public async Task<EventDto?> GetByIdAsync(int id, CancellationToken ct = default)
    {
        var e = await _db.CalendarEvents.FindAsync(new object[] { id }, ct);
        return e is null ? null : EntityMappers.ToDto(e);
    }

    public async Task<EventDto> CreateAsync(EventCreateUpdateDto dto, CancellationToken ct = default)
    {
        var e = new CalendarEvent
        {
            Title = dto.Title,
            Description = dto.Description,
            Date = dto.Date,
            Time = dto.Time,
            ImagePath = dto.Image,
            Location = dto.Location,
            Organizer = dto.Organizer,
            Category = dto.Category,
            IsVisible = dto.IsVisible,
            DisplayOrder = dto.DisplayOrder
        };
        _db.CalendarEvents.Add(e);
        await _db.SaveChangesAsync(ct);
        return EntityMappers.ToDto(e);
    }

    public async Task<EventDto?> UpdateAsync(int id, EventCreateUpdateDto dto, CancellationToken ct = default)
    {
        var e = await _db.CalendarEvents.FindAsync(new object[] { id }, ct);
        if (e is null) return null;
        e.Title = dto.Title;
        e.Description = dto.Description;
        e.Date = dto.Date;
        e.Time = dto.Time;
        e.ImagePath = dto.Image;
        e.Location = dto.Location;
        e.Organizer = dto.Organizer;
        e.Category = dto.Category;
        e.IsVisible = dto.IsVisible;
        e.DisplayOrder = dto.DisplayOrder;
        await _db.SaveChangesAsync(ct);
        return EntityMappers.ToDto(e);
    }

    public async Task<bool> DeleteAsync(int id, CancellationToken ct = default)
    {
        var e = await _db.CalendarEvents.FindAsync(new object[] { id }, ct);
        if (e is null) return false;
        _db.CalendarEvents.Remove(e);
        await _db.SaveChangesAsync(ct);
        return true;
    }

    public async Task<EventDto?> ToggleVisibilityAsync(int id, CancellationToken ct = default)
    {
        var e = await _db.CalendarEvents.FindAsync(new object[] { id }, ct);
        if (e is null) return null;
        e.IsVisible = !e.IsVisible;
        await _db.SaveChangesAsync(ct);
        return EntityMappers.ToDto(e);
    }
}
