namespace MustGraduationPlatform.Application.Dtos;

public record NewsDto(
    int Id,
    string Title,
    string Content,
    string Author,
    DateTime PublishDate,
    string Category,
    bool IsVisible,
    int? Order);

public record NewsCreateUpdateDto(
    string Title,
    string Content,
    string Author,
    string Category,
    bool IsVisible,
    int DisplayOrder);
