using Microsoft.EntityFrameworkCore;
using MustGraduationPlatform.Application.Abstractions;
using MustGraduationPlatform.Application.Dtos;
using MustGraduationPlatform.Infrastructure.Persistence;

namespace MustGraduationPlatform.Infrastructure.Services;

public class DepartmentService : IDepartmentService
{
    private readonly AppDbContext _db;

    public DepartmentService(AppDbContext db)
    {
        _db = db;
    }

    public async Task<IReadOnlyList<DepartmentDto>> GetAllAsync(CancellationToken ct = default)
    {
        var list = await _db.Departments.OrderBy(d => d.DisplayOrder).ToListAsync(ct);
        return list.Select(d => new DepartmentDto(d.Id, d.Code, d.NameAr, d.NameEn, d.DisplayOrder)).ToList();
    }
}
