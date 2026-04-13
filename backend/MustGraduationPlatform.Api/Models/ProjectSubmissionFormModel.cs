using Microsoft.AspNetCore.Http;

namespace MustGraduationPlatform.Api.Models;

public class ProjectSubmissionFormModel
{
    public string Type { get; set; } = "proposal";
    public string? StudentName { get; set; }
    public string? Email { get; set; }
    public string? ProjectNumber { get; set; }
    public string? ProjectTitle { get; set; }
    public string? SupervisorName { get; set; }
    public string? TeamLeaderName { get; set; }
    public string? Notes { get; set; }
    /// <summary>Single-file upload (proposal, legacy).</summary>
    public IFormFile? File { get; set; }
    /// <summary>Multi-file upload (project1/project2), max 6.</summary>
    public List<IFormFile>? Files { get; set; }
}
