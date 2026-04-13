namespace MustGraduationPlatform.Domain.Entities;

public class ProjectSubmission
{
    public int Id { get; set; }
    /// <summary>Discriminator: proposal, idea_registration, project1, project2.</summary>
    public string Type { get; set; } = "proposal";
    public string? StudentName { get; set; }
    public string? Email { get; set; }
    public string? ProjectNumber { get; set; }
    public string? ProjectTitle { get; set; }
    public string? SupervisorName { get; set; }
    public string? TeamLeaderName { get; set; }
    public string FileName { get; set; } = string.Empty;
    public string? FileStoragePath { get; set; }
    /// <summary>JSON array of { "fileName", "fileUrl" } for multi-file submissions (project1/project2).</summary>
    public string? AttachmentsJson { get; set; }
    public string Notes { get; set; } = string.Empty;
    /// <summary>JSON payload for idea registration form (team, titles, etc.).</summary>
    public string? RegistrationPayloadJson { get; set; }
    public string Status { get; set; } = "Pending";
    public DateTime SubmissionDate { get; set; }
}
