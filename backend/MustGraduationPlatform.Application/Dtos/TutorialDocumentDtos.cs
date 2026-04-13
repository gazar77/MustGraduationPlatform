namespace MustGraduationPlatform.Application.Dtos;

public record TutorialDocumentDto(
    int Id,
    string Title,
    string Description,
    string FileUrl,
    string FileSize,
    DateTime LastUpdate,
    bool IsVisible,
    int? Order);

public record TutorialDocumentCreateUpdateDto(
    string Title,
    string Description,
    string FileUrl,
    string FileSize,
    bool IsVisible,
    int DisplayOrder);
