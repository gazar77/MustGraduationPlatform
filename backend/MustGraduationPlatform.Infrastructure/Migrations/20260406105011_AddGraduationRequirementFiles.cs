using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace MustGraduationPlatform.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class AddGraduationRequirementFiles : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "GraduationRequirementFiles",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    UserId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    RequirementKey = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    FileName = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    FileUrl = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    UploadedAt = table.Column<DateTime>(type: "datetime2", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_GraduationRequirementFiles", x => x.Id);
                });

            migrationBuilder.CreateIndex(
                name: "IX_GraduationRequirementFiles_UserId_RequirementKey",
                table: "GraduationRequirementFiles",
                columns: new[] { "UserId", "RequirementKey" },
                unique: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "GraduationRequirementFiles");
        }
    }
}
