namespace MustGraduationPlatform.Domain.Entities;

public class RegistrationOtp
{
    public int Id { get; set; }
    public string NormalizedEmail { get; set; } = string.Empty;
    public string CodeHash { get; set; } = string.Empty;
    public DateTime ExpiresAtUtc { get; set; }
    public bool Consumed { get; set; }
    public DateTime CreatedAtUtc { get; set; }
}
