using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ModularCommerce.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class AddAttemptsToOrderOtp : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "Attempts",
                schema: "public",
                table: "OrderOtps",
                type: "integer",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<DateTime>(
                name: "CreatedAt",
                schema: "public",
                table: "OrderOtps",
                type: "timestamp with time zone",
                nullable: false,
                defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified));
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Attempts",
                schema: "public",
                table: "OrderOtps");

            migrationBuilder.DropColumn(
                name: "CreatedAt",
                schema: "public",
                table: "OrderOtps");
        }
    }
}
