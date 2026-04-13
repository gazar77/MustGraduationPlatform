using System.Text.RegularExpressions;

namespace MustGraduationPlatform.Application.Common;

public static class MustEmailRules
{
    private const int MaxLocalPartLength = 128;

    private static readonly Regex Pattern = new(
        @"^[A-Za-z0-9._%+-]+@must\.edu\.eg$",
        RegexOptions.Compiled | RegexOptions.CultureInvariant);

    /// <summary>Local part only (before @), same character class as <see cref="Pattern"/>.</summary>
    private static readonly Regex LocalPartOnly = new(
        @"^[A-Za-z0-9._%+-]+$",
        RegexOptions.Compiled | RegexOptions.CultureInvariant);

    public static bool IsValidMustEmail(string? email) =>
        !string.IsNullOrWhiteSpace(email) && Pattern.IsMatch(email.Trim());

    /// <summary>Full MUST email, or local part only (e.g. student id or short id without domain).</summary>
    public static bool IsValidLoginIdentifier(string? input)
    {
        if (string.IsNullOrWhiteSpace(input)) return false;
        var t = input.Trim();
        if (t.Contains('@', StringComparison.Ordinal))
            return IsValidMustEmail(t);
        return t.Length <= MaxLocalPartLength && LocalPartOnly.IsMatch(t);
    }

    /// <summary>Resolves a login identifier to normalized full MUST email.</summary>
    public static string ResolveToMustEmail(string input)
    {
        var t = input.Trim();
        if (t.Contains('@', StringComparison.Ordinal))
            return Normalize(t);
        return Normalize(t + "@must.edu.eg");
    }

    public static string Normalize(string email) => email.Trim().ToLowerInvariant();
}
