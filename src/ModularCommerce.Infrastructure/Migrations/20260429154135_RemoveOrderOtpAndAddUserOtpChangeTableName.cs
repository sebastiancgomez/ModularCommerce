using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ModularCommerce.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class RemoveOrderOtpAndAddUserOtpChangeTableName : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropPrimaryKey(
                name: "PK_OrderOtps",
                schema: "public",
                table: "OrderOtps");

            migrationBuilder.RenameTable(
                name: "OrderOtps",
                schema: "public",
                newName: "UserOtps",
                newSchema: "public");

            migrationBuilder.AddPrimaryKey(
                name: "PK_UserOtps",
                schema: "public",
                table: "UserOtps",
                column: "Id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropPrimaryKey(
                name: "PK_UserOtps",
                schema: "public",
                table: "UserOtps");

            migrationBuilder.RenameTable(
                name: "UserOtps",
                schema: "public",
                newName: "OrderOtps",
                newSchema: "public");

            migrationBuilder.AddPrimaryKey(
                name: "PK_OrderOtps",
                schema: "public",
                table: "OrderOtps",
                column: "Id");
        }
    }
}
