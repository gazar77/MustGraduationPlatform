namespace MustGraduationPlatform.Application.Dtos;

public record TemplateDto(
    int Id,
    string Title,
    string Description,
    string FileUrl,
    string FileSize,
    DateTime LastUpdate,
    bool IsVisible,
    int? Order);

public record TemplateCreateUpdateDto(
    string Title,
    string Description,
    string FileUrl,
    string FileSize,
    bool IsVisible,
    int DisplayOrder);
