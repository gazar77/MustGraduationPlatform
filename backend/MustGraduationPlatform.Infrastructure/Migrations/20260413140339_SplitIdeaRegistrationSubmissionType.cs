using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace MustGraduationPlatform.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class SplitIdeaRegistrationSubmissionType : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.Sql("""
                UPDATE ProjectSubmissions
                SET Type = N'idea_registration'
                WHERE RegistrationPayloadJson IS NOT NULL
                  AND (Type = N'proposal' OR Type IS NULL);
                """);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.Sql("""
                UPDATE ProjectSubmissions
                SET Type = N'proposal'
                WHERE Type = N'idea_registration'
                  AND RegistrationPayloadJson IS NOT NULL;
                """);
        }
    }
}
