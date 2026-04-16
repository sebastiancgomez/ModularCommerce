using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ModularCommerce.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class AddProductNameIntoOrderItem : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "ProductName",
                schema: "public",
                table: "OrderItems",
                type: "text",
                nullable: false,
                defaultValue: "");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "ProductName",
                schema: "public",
                table: "OrderItems");
        }
    }
}
