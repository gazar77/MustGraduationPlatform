using System.Text.RegularExpressions;

namespace MustGraduationPlatform.Application.Common;

public static class MustEmailRules
{
    private static readonly Regex Pattern = new(
        @"^[A-Za-z0-9._%+-]+@must\.edu\.eg$",
        RegexOptions.Compiled | RegexOptions.CultureInvariant);

    public static bool IsValidMustEmail(string? email) =>
        !string.IsNullOrWhiteSpace(email) && Pattern.IsMatch(email.Trim());

    public static string Normalize(string email) => email.Trim().ToLowerInvariant();
}
