using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace MustGraduationPlatform.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class SuperAdminIdeaCategoryRegistrationPayload : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "RegistrationPayloadJson",
                table: "ProjectSubmissions",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.CreateTable(
                name: "IdeaCategories",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Name = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    SortOrder = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_IdeaCategories", x => x.Id);
                });

            migrationBuilder.Sql("UPDATE ContactMessages SET Status = N'Pending' WHERE Status = N'New'");
            migrationBuilder.Sql("UPDATE ProjectSubmissions SET Status = N'Pending' WHERE Status = N'New'");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "IdeaCategories");

            migrationBuilder.DropColumn(
                name: "RegistrationPayloadJson",
                table: "ProjectSubmissions");
        }
    }
}
