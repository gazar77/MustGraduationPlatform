using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using MustGraduationPlatform.Domain.Entities;
using MustGraduationPlatform.Infrastructure.Identity;

namespace MustGraduationPlatform.Infrastructure.Persistence;

public class AppDbContext : IdentityDbContext<ApplicationUser, IdentityRole<Guid>, Guid>
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options)
    {
    }

    public DbSet<Department> Departments => Set<Department>();
    public DbSet<Idea> Ideas => Set<Idea>();
    public DbSet<NewsArticle> NewsArticles => Set<NewsArticle>();
    public DbSet<CalendarEvent> CalendarEvents => Set<CalendarEvent>();
    public DbSet<DocumentTemplate> DocumentTemplates => Set<DocumentTemplate>();
    public DbSet<Proposal> Proposals => Set<Proposal>();
    public DbSet<ProjectSubmission> ProjectSubmissions => Set<ProjectSubmission>();
    public DbSet<ContactMessage> ContactMessages => Set<ContactMessage>();
    public DbSet<SiteSetting> SiteSettings => Set<SiteSetting>();
    public DbSet<DashboardActivity> DashboardActivities => Set<DashboardActivity>();
    public DbSet<StudentLoginOtp> StudentLoginOtps => Set<StudentLoginOtp>();
    public DbSet<RegistrationOtp> RegistrationOtps => Set<RegistrationOtp>();
    public DbSet<GraduationRequirementFile> GraduationRequirementFiles => Set<GraduationRequirementFile>();

    protected override void OnModelCreating(ModelBuilder builder)
    {
        base.OnModelCreating(builder);

        builder.Entity<ApplicationUser>(e =>
        {
            e.HasOne(x => x.Department)
                .WithMany()
                .HasForeignKey(x => x.DepartmentId)
                .OnDelete(DeleteBehavior.SetNull);
            e.HasIndex(x => x.NormalizedEmail).IsUnique();
        });

        builder.Entity<Department>(e =>
        {
            e.HasIndex(x => x.Code).IsUnique();
        });

        builder.Entity<SiteSetting>(e =>
        {
            e.HasIndex(x => x.Key).IsUnique();
        });

        builder.Entity<StudentLoginOtp>(e =>
        {
            e.HasOne<ApplicationUser>()
                .WithMany()
                .HasForeignKey(x => x.UserId)
                .OnDelete(DeleteBehavior.Cascade);
        });

        builder.Entity<RegistrationOtp>(e =>
        {
            e.HasIndex(x => x.NormalizedEmail);
        });

        builder.Entity<GraduationRequirementFile>(e =>
        {
            e.HasIndex(x => new { x.UserId, x.RequirementKey }).IsUnique();
        });
    }
}
