using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace MustGraduationPlatform.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class StorePlainOtpCode : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "CodeHash",
                table: "StudentLoginOtps",
                newName: "Code");

            migrationBuilder.RenameColumn(
                name: "CodeHash",
                table: "RegistrationOtps",
                newName: "Code");

            // Old CodeHash values are 64-char hex; nvarchar(32) would truncate. OTP rows are disposable.
            migrationBuilder.Sql("DELETE FROM [StudentLoginOtps];");
            migrationBuilder.Sql("DELETE FROM [RegistrationOtps];");

            migrationBuilder.AlterColumn<string>(
                name: "Code",
                table: "StudentLoginOtps",
                type: "nvarchar(32)",
                maxLength: 32,
                nullable: false,
                oldClrType: typeof(string),
                oldType: "nvarchar(max)");

            migrationBuilder.AlterColumn<string>(
                name: "Code",
                table: "RegistrationOtps",
                type: "nvarchar(32)",
                maxLength: 32,
                nullable: false,
                oldClrType: typeof(string),
                oldType: "nvarchar(max)");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterColumn<string>(
                name: "Code",
                table: "StudentLoginOtps",
                type: "nvarchar(max)",
                nullable: false,
                oldClrType: typeof(string),
                oldType: "nvarchar(32)",
                oldMaxLength: 32);

            migrationBuilder.AlterColumn<string>(
                name: "Code",
                table: "RegistrationOtps",
                type: "nvarchar(max)",
                nullable: false,
                oldClrType: typeof(string),
                oldType: "nvarchar(32)",
                oldMaxLength: 32);

            migrationBuilder.RenameColumn(
                name: "Code",
                table: "StudentLoginOtps",
                newName: "CodeHash");

            migrationBuilder.RenameColumn(
                name: "Code",
                table: "RegistrationOtps",
                newName: "CodeHash");
        }
    }
}
