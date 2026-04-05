namespace MustGraduationPlatform.Domain.Entities;

public class DashboardActivity
{
    public int Id { get; set; }
    public string Type { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public string UserDisplayName { get; set; } = string.Empty;
    public DateTime Timestamp { get; set; }
}
