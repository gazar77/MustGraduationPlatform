namespace MustGraduationPlatform.Application.Dtos;

public record EventDto(
    int Id,
    string Title,
    string Description,
    string Date,
    string? Time,
    string? Image,
    string Location,
    string? Organizer,
    string Category,
    bool IsVisible,
    int? Order);

public record EventCreateUpdateDto(
    string Title,
    string Description,
    DateOnly Date,
    string? Time,
    string? Image,
    string Location,
    string? Organizer,
    string Category,
    bool IsVisible,
    int DisplayOrder);
