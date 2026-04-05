namespace MustGraduationPlatform.Domain.Entities;

public class ProjectSubmission
{
    public int Id { get; set; }
    public string Type { get; set; } = "proposal";
    public string? StudentName { get; set; }
    public string? Email { get; set; }
    public string? ProjectNumber { get; set; }
    public string? ProjectTitle { get; set; }
    public string? SupervisorName { get; set; }
    public string? TeamLeaderName { get; set; }
    public string FileName { get; set; } = string.Empty;
    public string? FileStoragePath { get; set; }
    public string Notes { get; set; } = string.Empty;
    public string Status { get; set; } = "Pending";
    public DateTime SubmissionDate { get; set; }
}
