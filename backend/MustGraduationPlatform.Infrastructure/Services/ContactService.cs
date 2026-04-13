using Microsoft.EntityFrameworkCore;
using MustGraduationPlatform.Application.Abstractions;
using MustGraduationPlatform.Application.Dtos;
using MustGraduationPlatform.Domain.Entities;
using MustGraduationPlatform.Infrastructure.Persistence;

namespace MustGraduationPlatform.Infrastructure.Services;

public class ContactService : IContactService
{
    private readonly AppDbContext _db;

    public ContactService(AppDbContext db)
    {
        _db = db;
    }

    public async Task<IReadOnlyList<ContactMessageDto>> GetAllAsync(CancellationToken ct = default)
    {
        var list = await _db.ContactMessages.OrderByDescending(m => m.SubmissionDate).ToListAsync(ct);
        return list.Select(EntityMappers.ToDto).ToList();
    }

    public async Task<ContactMessageDto> CreateAsync(ContactMessageCreateDto dto, CancellationToken ct = default)
    {
        var e = new ContactMessage
        {
            Name = dto.Name,
            Email = dto.Email,
            Subject = dto.Subject,
            Message = dto.Message,
            Status = "Pending",
            SubmissionDate = DateTime.UtcNow
        };
        _db.ContactMessages.Add(e);
        await _db.SaveChangesAsync(ct);
        return EntityMappers.ToDto(e);
    }

    public async Task<ContactMessageDto?> UpdateStatusAsync(int id, ContactMessageStatusUpdateDto dto, CancellationToken ct = default)
    {
        var e = await _db.ContactMessages.FindAsync(new object[] { id }, ct);
        if (e is null) return null;
        e.Status = dto.Status;
        await _db.SaveChangesAsync(ct);
        return EntityMappers.ToDto(e);
    }

    public async Task<bool> DeleteAsync(int id, CancellationToken ct = default)
    {
        var e = await _db.ContactMessages.FindAsync(new object[] { id }, ct);
        if (e is null) return false;
        _db.ContactMessages.Remove(e);
        await _db.SaveChangesAsync(ct);
        return true;
    }
}
