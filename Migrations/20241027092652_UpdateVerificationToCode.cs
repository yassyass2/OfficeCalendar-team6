using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace OfficeCalendar.Migrations
{
    /// <inheritdoc />
    public partial class UpdateVerificationToCode : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "VerificationToken",
                table: "Users",
                newName: "VerificationCodeHash");

            migrationBuilder.RenameColumn(
                name: "ResetTokenExpires",
                table: "Users",
                newName: "VerificationCodeExpires");

            migrationBuilder.RenameColumn(
                name: "PasswordResetToken",
                table: "Users",
                newName: "ResetCodeExpires");

            migrationBuilder.AddColumn<string>(
                name: "PasswordResetCodeHash",
                table: "Users",
                type: "TEXT",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_Attendances_EventId",
                table: "Attendances",
                column: "EventId");

            migrationBuilder.AddForeignKey(
                name: "FK_Attendances_Events_EventId",
                table: "Attendances",
                column: "EventId",
                principalTable: "Events",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_Attendances_Users_UserId",
                table: "Attendances",
                column: "UserId",
                principalTable: "Users",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Attendances_Events_EventId",
                table: "Attendances");

            migrationBuilder.DropForeignKey(
                name: "FK_Attendances_Users_UserId",
                table: "Attendances");

            migrationBuilder.DropIndex(
                name: "IX_Attendances_EventId",
                table: "Attendances");

            migrationBuilder.DropColumn(
                name: "PasswordResetCodeHash",
                table: "Users");

            migrationBuilder.RenameColumn(
                name: "VerificationCodeHash",
                table: "Users",
                newName: "VerificationToken");

            migrationBuilder.RenameColumn(
                name: "VerificationCodeExpires",
                table: "Users",
                newName: "ResetTokenExpires");

            migrationBuilder.RenameColumn(
                name: "ResetCodeExpires",
                table: "Users",
                newName: "PasswordResetToken");
        }
    }
}
