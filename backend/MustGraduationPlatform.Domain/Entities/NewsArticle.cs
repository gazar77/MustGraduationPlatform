namespace MustGraduationPlatform.Domain.Entities;

public class NewsArticle
{
    public int Id { get; set; }
    public string Title { get; set; } = string.Empty;
    public string Content { get; set; } = string.Empty;
    public string Author { get; set; } = string.Empty;
    public DateTime PublishDate { get; set; }
    public string Category { get; set; } = "Announcement";
    public bool IsVisible { get; set; } = true;
    public int DisplayOrder { get; set; }
}
