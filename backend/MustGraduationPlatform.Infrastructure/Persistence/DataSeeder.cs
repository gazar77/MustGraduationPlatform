using System.Linq;
using System.Text.Json;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using MustGraduationPlatform.Application.Common;
using MustGraduationPlatform.Domain.Entities;
using MustGraduationPlatform.Domain.Enums;
using MustGraduationPlatform.Infrastructure.Identity;

namespace MustGraduationPlatform.Infrastructure.Persistence;

public static class DataSeeder
{
    public const string DefaultAdminPassword = "MustAdminTest#2026";
    public const string DefaultStudentPassword = "MustStudentTest#2026";

    public static async Task SeedAsync(AppDbContext db, UserManager<ApplicationUser> users, CancellationToken ct = default)
    {
        await db.Database.MigrateAsync(ct);

        if (!await db.Departments.AnyAsync(ct))
        {
            db.Departments.AddRange(
                new Department { Code = "CS", NameAr = "علوم الحاسب", NameEn = "Computer Science", DisplayOrder = 1 },
                new Department { Code = "IS", NameAr = "نظم المعلومات", NameEn = "Information Systems", DisplayOrder = 2 },
                new Department { Code = "AI", NameAr = "الذكاء الاصطناعي", NameEn = "Artificial Intelligence", DisplayOrder = 3 });
            await db.SaveChangesAsync(ct);
        }

        var cs = await db.Departments.FirstAsync(d => d.Code == "CS", ct);

        if (await users.FindByEmailAsync("admin@must.edu.eg") is null)
        {
            var admin = new ApplicationUser
            {
                Id = Guid.NewGuid(),
                UserName = "admin@must.edu.eg",
                Email = "admin@must.edu.eg",
                NormalizedEmail = "ADMIN@MUST.EDU.EG",
                NormalizedUserName = "ADMIN@MUST.EDU.EG",
                EmailConfirmed = true,
                FullName = "مدير النظام",
                UserRole = UserRole.Admin,
                DepartmentId = null
            };
            var r = await users.CreateAsync(admin, DefaultAdminPassword);
            if (!r.Succeeded)
                throw new InvalidOperationException(string.Join("; ", r.Errors.Select(e => e.Description)));
        }

        if (await users.FindByEmailAsync("superadmin@must.edu.eg") is null)
        {
            var superAdmin = new ApplicationUser
            {
                Id = Guid.NewGuid(),
                UserName = "superadmin@must.edu.eg",
                Email = "superadmin@must.edu.eg",
                NormalizedEmail = "SUPERADMIN@MUST.EDU.EG",
                NormalizedUserName = "SUPERADMIN@MUST.EDU.EG",
                EmailConfirmed = true,
                FullName = "Super Admin",
                UserRole = UserRole.SuperAdmin,
                DepartmentId = null
            };
            var r = await users.CreateAsync(superAdmin, DefaultAdminPassword);
            if (!r.Succeeded)
                throw new InvalidOperationException(string.Join("; ", r.Errors.Select(e => e.Description)));
        }

        if (await users.FindByEmailAsync("student@must.edu.eg") is null)
        {
            var student = new ApplicationUser
            {
                Id = Guid.NewGuid(),
                UserName = "student@must.edu.eg",
                Email = "student@must.edu.eg",
                NormalizedEmail = "STUDENT@MUST.EDU.EG",
                NormalizedUserName = "STUDENT@MUST.EDU.EG",
                EmailConfirmed = true,
                FullName = "طالب تجريبي",
                UserRole = UserRole.Student,
                DepartmentId = cs.Id
            };
            var r = await users.CreateAsync(student, DefaultStudentPassword);
            if (!r.Succeeded)
                throw new InvalidOperationException(string.Join("; ", r.Errors.Select(e => e.Description)));
        }

        if (!await db.SiteSettings.AnyAsync(ct))
        {
            db.SiteSettings.AddRange(
                new SiteSetting { Key = "proposalDeadline", Value = "\"2026-04-30T23:59:59Z\"" },
                new SiteSetting { Key = "academicYearLabel", Value = "\"2025 / 2026\"" });
            await db.SaveChangesAsync(ct);
        }

        if (!await db.IdeaCategories.AnyAsync(ct))
        {
            var categoryNames = new[]
            {
                "تطوير مواقع ويب",
                "تطوير تطبيقات موبايل",
                "الذكاء الاصطناعي",
                "تعلم الآلة",
                "الرؤية الحاسوبية",
                "الأمن السيبراني",
                "الشبكات والحوسبة السحابية",
                "تحليل البيانات",
                "إنترنت الأشياء",
                "معالجة اللغة الطبيعية"
            };
            for (var i = 0; i < categoryNames.Length; i++)
            {
                db.IdeaCategories.Add(new IdeaCategory { Name = categoryNames[i], SortOrder = i });
            }

            await db.SaveChangesAsync(ct);
        }

        if (!await db.Ideas.AnyAsync(ct))
        {
            db.Ideas.Add(new Idea
            {
                Title = "نظام إدارة مشاريع التخرج الذكي",
                Description = "نظام متكامل لإدارة عملية اختيار وتتبع مشاريع التخرج باستخدام تقنيات الويب الحديثة.",
                Category = "تطوير مواقع ويب",
                Difficulty = "Medium",
                RequiredSkillsJson = "[\"Angular\",\".NET Core\",\"SQL Server\"]",
                MaxTeamSize = 4,
                SupervisorDoctorId = 101,
                SupervisorName = "د. محمد علي",
                CreatedAt = DateTime.UtcNow,
                Status = "Open",
                IsVisible = true,
                DisplayOrder = 1
            });
            await db.SaveChangesAsync(ct);
        }

        if (!await db.NewsArticles.AnyAsync(ct))
        {
            db.NewsArticles.Add(new NewsArticle
            {
                Title = "إعلان توزيع مشاريع التخرج",
                Content = "نحيطكم علماً بأنه قد تم توزيع لجان الإشراف على مشاريع التخرج للعام الجامعي الحالي.",
                Author = "إدارة الكلية",
                PublishDate = DateTime.UtcNow,
                Category = "Announcement",
                IsVisible = true,
                DisplayOrder = 1
            });
            await db.SaveChangesAsync(ct);
        }

        if (!await db.CalendarEvents.AnyAsync(ct))
        {
            db.CalendarEvents.Add(new CalendarEvent
            {
                Title = "مناقشات مشاريع التخرج",
                Description = "مناقشة الدفعة الأولى من مشاريع التخرج.",
                Date = new DateOnly(2026, 4, 15),
                Time = "09:00",
                ImagePath = "assets/must_discussion_1.png",
                Location = "قاعة المؤتمرات الرئيسية",
                Organizer = "قسم علوم الحاسب",
                Category = "academic",
                IsVisible = true,
                DisplayOrder = 1
            });
            await db.SaveChangesAsync(ct);
        }

        if (!await db.DocumentTemplates.AnyAsync(ct))
        {
            db.DocumentTemplates.Add(new DocumentTemplate
            {
                Title = "قالب المقترح (Proposal Template)",
                Description = "النموذج الرسمي لكتابة مقترح مشروع التخرج.",
                FileUrl = "/uploads/templates/graduation-proposal-readme.txt",
                FileSize = "1 KB",
                LastUpdate = DateTime.UtcNow,
                IsVisible = true,
                DisplayOrder = 1
            });
            await db.SaveChangesAsync(ct);
        }

        if (!await db.Proposals.AnyAsync(ct))
        {
            db.Proposals.Add(new Proposal
            {
                ProjectName = "نظام إدارة مشاريع التخرج الذكي",
                TeamName = "فريق ألفا",
                MembersJson = JsonSerializer.Serialize(new[] { "student@must.edu.eg", "طالب تجريبي", "2022001" }),
                Department = "CS",
                ProposedSupervisor = "د. محمد علي",
                Idea = "نظام متكامل لإدارة مشاريع التخرج.",
                Goals = "أتمتة التسجيل والمتابعة.",
                Description = "مشروع تجريبي لربط الطالب باستمارة التخرج.",
                ToolsJson = JsonSerializer.Serialize(new[] { "Angular", ".NET" }, new JsonSerializerOptions { PropertyNamingPolicy = JsonNamingPolicy.CamelCase }),
                Status = "New",
                SubmissionDate = DateTime.UtcNow
            });
            await db.SaveChangesAsync(ct);
        }

        if (!await db.SiteSettings.AnyAsync(s => s.Key == "IdeaReservationsOpen", ct))
        {
            db.SiteSettings.Add(new SiteSetting
            {
                Key = "IdeaReservationsOpen",
                Value = "true"
            });
            await db.SaveChangesAsync(ct);
        }

        if (!await db.SiteSettings.AnyAsync(s => s.Key == SiteSettingKeys.HeroBannerBgImages, ct))
        {
            var heroPaths = new[]
            {
                "/assets/h1.jpeg", "/assets/h2.jpeg", "/assets/h3.jpeg", "/assets/h4.jpeg",
                "/assets/h5.jpeg", "/assets/h6.jpeg", "/assets/h7.jpeg", "/assets/h8.jpeg"
            };
            db.SiteSettings.Add(new SiteSetting
            {
                Key = SiteSettingKeys.HeroBannerBgImages,
                Value = JsonSerializer.Serialize(heroPaths)
            });
            await db.SaveChangesAsync(ct);
        }

        if (!await db.DashboardActivities.AnyAsync(ct))
        {
            db.DashboardActivities.Add(new DashboardActivity
            {
                Type = "News",
                Description = "تم إضافة خبر جديد: توزيع مشاريع التخرج",
                UserDisplayName = "أدمن النظام",
                Timestamp = DateTime.UtcNow.AddHours(-1)
            });
            await db.SaveChangesAsync(ct);
        }
    }
}
