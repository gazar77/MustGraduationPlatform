using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace MustGraduationPlatform.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class MapLegacyDoctorRoleToAdmin : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            // Legacy enum value Doctor = 3 removed; map any existing rows to Admin = 1.
            migrationBuilder.Sql(
                """
                UPDATE [dbo].[AspNetUsers]
                SET [UserRole] = 1
                WHERE [UserRole] = 3;
                """);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {

        }
    }
}
