namespace MustGraduationPlatform.Domain.Entities;

public class CalendarEvent
{
    public int Id { get; set; }
    public string Title { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public DateOnly Date { get; set; }
    public string? Time { get; set; }
    public string? ImagePath { get; set; }
    public string Location { get; set; } = string.Empty;
    public string? Organizer { get; set; }
    public string Category { get; set; } = "academic";
    public bool IsVisible { get; set; } = true;
    public int DisplayOrder { get; set; }
}
