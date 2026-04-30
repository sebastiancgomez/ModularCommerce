using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ModularCommerce.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class RemoveOrderOtpAndAddUserOtp : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "OrderId",
                schema: "public",
                table: "OrderOtps");

            migrationBuilder.AddColumn<string>(
                name: "Email",
                schema: "public",
                table: "OrderOtps",
                type: "text",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "Purpose",
                schema: "public",
                table: "OrderOtps",
                type: "text",
                nullable: false,
                defaultValue: "");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Email",
                schema: "public",
                table: "OrderOtps");

            migrationBuilder.DropColumn(
                name: "Purpose",
                schema: "public",
                table: "OrderOtps");

            migrationBuilder.AddColumn<Guid>(
                name: "OrderId",
                schema: "public",
                table: "OrderOtps",
                type: "uuid",
                nullable: false,
                defaultValue: new Guid("00000000-0000-0000-0000-000000000000"));
        }
    }
}
