using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace MustGraduationPlatform.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class RemoveAiDepartment : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            // Reassign students from legacy AI department to Computer Science, then remove AI row.
            migrationBuilder.Sql("""
                UPDATE [AspNetUsers]
                SET [DepartmentId] = (SELECT TOP (1) [Id] FROM [Departments] WHERE [Code] = N'CS')
                WHERE [DepartmentId] IN (SELECT [Id] FROM [Departments] WHERE [Code] = N'AI');

                DELETE FROM [Departments] WHERE [Code] = N'AI';
                """);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.InsertData(
                table: "Departments",
                columns: new[] { "Code", "NameAr", "NameEn", "DisplayOrder" },
                values: new object[] { "AI", "الذكاء الاصطناعي", "Artificial Intelligence", 3 });
        }
    }
}
