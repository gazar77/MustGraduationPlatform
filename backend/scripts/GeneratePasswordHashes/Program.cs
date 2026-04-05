using Microsoft.AspNetCore.Identity;
using MustGraduationPlatform.Domain.Enums;
using MustGraduationPlatform.Infrastructure.Identity;

var hasher = new PasswordHasher<ApplicationUser>();

var admin = new ApplicationUser
{
    UserName = "admin@must.edu.eg",
    Email = "admin@must.edu.eg",
    NormalizedEmail = "ADMIN@MUST.EDU.EG",
    NormalizedUserName = "ADMIN@MUST.EDU.EG",
    FullName = "مدير النظام",
    UserRole = UserRole.Admin
};

var student = new ApplicationUser
{
    UserName = "student@must.edu.eg",
    Email = "student@must.edu.eg",
    NormalizedEmail = "STUDENT@MUST.EDU.EG",
    NormalizedUserName = "STUDENT@MUST.EDU.EG",
    FullName = "طالب تجريبي",
    UserRole = UserRole.Student
};

const string adminPw = "MustAdminTest#2026";
const string studentPw = "MustStudentTest#2026";

Console.WriteLine("ADMIN_HASH=" + hasher.HashPassword(admin, adminPw));
Console.WriteLine("STUDENT_HASH=" + hasher.HashPassword(student, studentPw));
