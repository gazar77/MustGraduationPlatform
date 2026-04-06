using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using MustGraduationPlatform.Application.Abstractions;
using MustGraduationPlatform.Infrastructure.Email;
using MustGraduationPlatform.Infrastructure.Identity;
using MustGraduationPlatform.Infrastructure.Options;
using MustGraduationPlatform.Infrastructure.Persistence;
using MustGraduationPlatform.Infrastructure.Security;
using MustGraduationPlatform.Infrastructure.Services;
using MustGraduationPlatform.Infrastructure.Storage;

namespace MustGraduationPlatform.Infrastructure;

public static class DependencyInjection
{
    public static IServiceCollection AddInfrastructure(this IServiceCollection services, IConfiguration configuration)
    {
        services.AddDbContext<AppDbContext>(options =>
            options.UseSqlServer(
                configuration.GetConnectionString("DefaultConnection"),
                SqlServerRetryConfiguration.ConfigureRetry));

        services
            .AddIdentity<ApplicationUser, IdentityRole<Guid>>(options =>
            {
                options.User.RequireUniqueEmail = true;
                options.Password.RequireDigit = true;
                options.Password.RequireLowercase = true;
                options.Password.RequireUppercase = true;
                options.Password.RequireNonAlphanumeric = true;
                options.Password.RequiredLength = 8;
                options.Lockout.MaxFailedAccessAttempts = 5;
            })
            .AddEntityFrameworkStores<AppDbContext>()
            .AddDefaultTokenProviders();

        // API uses JWT in cookies for SPA; do not redirect to /Account/Login (not implemented — caused 302 → 404).
        services.ConfigureApplicationCookie(options =>
        {
            options.Events.OnRedirectToLogin = context =>
            {
                context.Response.StatusCode = StatusCodes.Status401Unauthorized;
                return Task.CompletedTask;
            };
            options.Events.OnRedirectToAccessDenied = context =>
            {
                context.Response.StatusCode = StatusCodes.Status403Forbidden;
                return Task.CompletedTask;
            };
        });

        services.Configure<JwtOptions>(configuration.GetSection(JwtOptions.SectionName));
        services.Configure<SmtpOptions>(configuration.GetSection(SmtpOptions.SectionName));

        services.AddSingleton<IFileStorage, WwwRootFileStorageService>();

        services.AddSingleton<JwtTokenService>();
        services.AddHttpContextAccessor();

        services.AddScoped<IAuthService, AuthService>();
        services.AddScoped<IIdeaService, IdeaService>();
        services.AddScoped<INewsService, NewsService>();
        services.AddScoped<IEventService, EventService>();
        services.AddScoped<ITemplateService, TemplateService>();
        services.AddScoped<IProposalService, ProposalService>();
        services.AddScoped<IProjectSubmissionService, ProjectSubmissionService>();
        services.AddScoped<IContactService, ContactService>();
        services.AddScoped<IDashboardService, DashboardService>();
        services.AddScoped<IDepartmentService, DepartmentService>();
        services.AddScoped<ISiteSettingsService, SiteSettingsService>();
        services.AddScoped<IGraduationService, GraduationService>();
        services.AddScoped<IDoctorDashboardService, DoctorDashboardService>();

        if (!string.IsNullOrWhiteSpace(configuration["Smtp:Host"]))
            services.AddScoped<IEmailSender, SmtpEmailSender>();
        else
            services.AddScoped<IEmailSender, LoggingEmailSender>();

        return services;
    }
}
