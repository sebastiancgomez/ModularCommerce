namespace ModularCommerce.Application.DTOs
{
    public class CreateSubCategoryDto
    {
        public string Name { get; set; } = string.Empty;
        public Guid CategoryId { get; set; }
    }
    public class SubCategoryResponseDto
    {
        public Guid Id { get; set; }

        public string Name { get; set; } = string.Empty;

        public Guid CategoryId { get; set; }

        public string CategoryName { get; set; } = string.Empty;
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }
}
