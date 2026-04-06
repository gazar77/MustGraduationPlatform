namespace MustGraduationPlatform.Domain.Entities;

public class StudentLoginOtp
{
    public int Id { get; set; }
    public Guid UserId { get; set; }
    public string Code { get; set; } = string.Empty;
    public DateTime ExpiresAtUtc { get; set; }
    public bool Consumed { get; set; }
    public DateTime CreatedAtUtc { get; set; }
}
