namespace MustGraduationPlatform.Domain.Entities;

public class Proposal
{
    public int Id { get; set; }
    public string ProjectName { get; set; } = string.Empty;
    public string TeamName { get; set; } = string.Empty;
    public string MembersJson { get; set; } = "[]";
    public string Department { get; set; } = string.Empty;
    public string ProposedSupervisor { get; set; } = string.Empty;
    public string Idea { get; set; } = string.Empty;
    public string Goals { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public string ToolsJson { get; set; } = "[]";
    public string? Notes { get; set; }
    public string? AttachmentUrl { get; set; }
    public string Status { get; set; } = "New";
    public DateTime SubmissionDate { get; set; }
}
