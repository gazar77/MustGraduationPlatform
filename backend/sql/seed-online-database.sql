/*
  MUST Graduation Platform — seed data for online SQL Server (MonsterASP / Azure SQL / etc.)
  Run against your application database AFTER EF migrations have created the schema.

  What this script does (idempotent where possible):
  - Inserts departments CS / IS / AI if missing
  - Inserts AspNetUsers: admin@must.edu.eg (Admin) and student@must.edu.eg (Student) if missing
  - Inserts site settings, sample idea, news, event, template, dashboard activity if tables are empty

  Default passwords (same as DataSeeder.cs):
    Admin:   MustAdminTest#2026
    Student: MustStudentTest#2026

  Password hashes were generated with ASP.NET Core Identity PasswordHasher<ApplicationUser>.
  To regenerate hashes after changing passwords, run:
    dotnet run --project backend/scripts/GeneratePasswordHashes

  IMPORTANT: Change these passwords in production and do not commit real secrets to git.
*/

SET NOCOUNT ON;
SET XACT_ABORT ON;

BEGIN TRY
    BEGIN TRANSACTION;

    /* ---- Departments ---- */
    IF NOT EXISTS (SELECT 1 FROM [dbo].[Departments] WHERE [Code] = N'CS')
        INSERT INTO [dbo].[Departments] ([Code], [NameAr], [NameEn], [DisplayOrder])
        VALUES (N'CS', N'علوم الحاسب', N'Computer Science', 1);

    IF NOT EXISTS (SELECT 1 FROM [dbo].[Departments] WHERE [Code] = N'IS')
        INSERT INTO [dbo].[Departments] ([Code], [NameAr], [NameEn], [DisplayOrder])
        VALUES (N'IS', N'نظم المعلومات', N'Information Systems', 2);

    IF NOT EXISTS (SELECT 1 FROM [dbo].[Departments] WHERE [Code] = N'AI')
        INSERT INTO [dbo].[Departments] ([Code], [NameAr], [NameEn], [DisplayOrder])
        VALUES (N'AI', N'الذكاء الاصطناعي', N'Artificial Intelligence', 3);

    DECLARE @CsId INT = (SELECT TOP (1) [Id] FROM [dbo].[Departments] WHERE [Code] = N'CS');

    /* ---- Test users (AspNetUsers) ---- */
    DECLARE @AdminId UNIQUEIDENTIFIER = '11111111-1111-1111-1111-111111111101';
    DECLARE @StudentId UNIQUEIDENTIFIER = '11111111-1111-1111-1111-111111111102';

    /* Hashes for MustAdminTest#2026 / MustStudentTest#2026 (see script header) */
    DECLARE @AdminHash NVARCHAR(MAX) = N'AQAAAAIAAYagAAAAEB+rVGng4G5Hzbqt21uTG9lTPlY9j4Q2rkuh30ckmK1zv9xPhChVFXu8SYxc0vPYHg==';
    DECLARE @StudentHash NVARCHAR(MAX) = N'AQAAAAIAAYagAAAAEMnj6iWze0bxrjXVrcmW9gekQKQEOA+Mt3mNdyuCfrwMrARLbEImcsKPXZY9d45EmQ==';

    IF NOT EXISTS (SELECT 1 FROM [dbo].[AspNetUsers] WHERE [NormalizedEmail] = N'ADMIN@MUST.EDU.EG')
    BEGIN
        INSERT INTO [dbo].[AspNetUsers] (
            [Id], [UserName], [NormalizedUserName], [Email], [NormalizedEmail], [EmailConfirmed],
            [PasswordHash], [SecurityStamp], [ConcurrencyStamp], [PhoneNumberConfirmed], [TwoFactorEnabled],
            [LockoutEnabled], [AccessFailedCount], [FullName], [UserRole], [DepartmentId]
        )
        VALUES (
            @AdminId,
            N'admin@must.edu.eg', N'ADMIN@MUST.EDU.EG', N'admin@must.edu.eg', N'ADMIN@MUST.EDU.EG', 1,
            @AdminHash,
            N'ADMIN-SECURITY-STAMP-000000000001',
            N'ADMIN-CONCURRENCY-STAMP-000000000001',
            0, 0,
            1, 0,
            N'مدير النظام', 1 /* Admin */, NULL
        );
    END

    IF NOT EXISTS (SELECT 1 FROM [dbo].[AspNetUsers] WHERE [NormalizedEmail] = N'STUDENT@MUST.EDU.EG')
    BEGIN
        INSERT INTO [dbo].[AspNetUsers] (
            [Id], [UserName], [NormalizedUserName], [Email], [NormalizedEmail], [EmailConfirmed],
            [PasswordHash], [SecurityStamp], [ConcurrencyStamp], [PhoneNumberConfirmed], [TwoFactorEnabled],
            [LockoutEnabled], [AccessFailedCount], [FullName], [UserRole], [DepartmentId]
        )
        VALUES (
            @StudentId,
            N'student@must.edu.eg', N'STUDENT@MUST.EDU.EG', N'student@must.edu.eg', N'STUDENT@MUST.EDU.EG', 1,
            @StudentHash,
            N'STUDENT-SECURITY-STAMP-000000000002',
            N'STUDENT-CONCURRENCY-STAMP-000000000002',
            0, 0,
            1, 0,
            N'طالب تجريبي', 2 /* Student */, @CsId
        );
    END

    /* ---- Site settings (matches DataSeeder) ---- */
    IF NOT EXISTS (SELECT 1 FROM [dbo].[SiteSettings] WHERE [Key] = N'proposalDeadline')
        INSERT INTO [dbo].[SiteSettings] ([Key], [Value])
        VALUES (N'proposalDeadline', N'"2026-04-30T23:59:59Z"');

    IF NOT EXISTS (SELECT 1 FROM [dbo].[SiteSettings] WHERE [Key] = N'academicYearLabel')
        INSERT INTO [dbo].[SiteSettings] ([Key], [Value])
        VALUES (N'academicYearLabel', N'"2025 / 2026"');

    /* ---- Sample content (only if tables have no rows) ---- */
    IF NOT EXISTS (SELECT 1 FROM [dbo].[Ideas])
    BEGIN
        INSERT INTO [dbo].[Ideas] (
            [Title], [Description], [Category], [Difficulty], [RequiredSkillsJson], [MaxTeamSize],
            [SupervisorDoctorId], [SupervisorName], [CreatedAt], [Status], [IsVisible], [DisplayOrder]
        )
        VALUES (
            N'نظام إدارة مشاريع التخرج الذكي',
            N'نظام متكامل لإدارة عملية اختيار وتتبع مشاريع التخرج باستخدام تقنيات الويب الحديثة.',
            N'تطوير مواقع ويب', N'Medium', N'["Angular",".NET Core","SQL Server"]', 4,
            101, N'د. محمد علي', SYSUTCDATETIME(), N'Open', 1, 1
        );
    END

    IF NOT EXISTS (SELECT 1 FROM [dbo].[NewsArticles])
    BEGIN
        INSERT INTO [dbo].[NewsArticles] (
            [Title], [Content], [Author], [PublishDate], [Category], [IsVisible], [DisplayOrder]
        )
        VALUES (
            N'إعلان توزيع مشاريع التخرج',
            N'نحيطكم علماً بأنه قد تم توزيع لجان الإشراف على مشاريع التخرج للعام الجامعي الحالي.',
            N'إدارة الكلية', SYSUTCDATETIME(), N'Announcement', 1, 1
        );
    END

    IF NOT EXISTS (SELECT 1 FROM [dbo].[CalendarEvents])
    BEGIN
        INSERT INTO [dbo].[CalendarEvents] (
            [Title], [Description], [Date], [Time], [ImagePath], [Location], [Organizer], [Category], [IsVisible], [DisplayOrder]
        )
        VALUES (
            N'مناقشات مشاريع التخرج',
            N'مناقشة الدفعة الأولى من مشاريع التخرج.',
            '2026-04-15', N'09:00', N'assets/must_discussion_1.png',
            N'قاعة المؤتمرات الرئيسية', N'قسم علوم الحاسب', N'academic', 1, 1
        );
    END

    IF NOT EXISTS (SELECT 1 FROM [dbo].[DocumentTemplates])
    BEGIN
        INSERT INTO [dbo].[DocumentTemplates] (
            [Title], [Description], [FileUrl], [FileSize], [LastUpdate], [IsVisible], [DisplayOrder]
        )
        VALUES (
            N'قالب المقترح (Proposal Template)',
            N'النموذج الرسمي لكتابة مقترح مشروع التخرج.',
            N'/uploads/templates/graduation-proposal-readme.txt', N'1 KB', SYSUTCDATETIME(), 1, 1
        );
    END

    IF NOT EXISTS (SELECT 1 FROM [dbo].[DashboardActivities])
    BEGIN
        INSERT INTO [dbo].[DashboardActivities] ([Type], [Description], [UserDisplayName], [Timestamp])
        VALUES (
            N'News',
            N'تم إضافة خبر جديد: توزيع مشاريع التخرج',
            N'أدمن النظام',
            DATEADD(HOUR, -1, SYSUTCDATETIME())
        );
    END

    COMMIT TRANSACTION;
END TRY
BEGIN CATCH
    IF @@TRANCOUNT > 0 ROLLBACK TRANSACTION;
    THROW;
END CATCH;

GO

PRINT N'Seed completed. Logins: admin@must.edu.eg / MustAdminTest#2026 , student@must.edu.eg / MustStudentTest#2026';
