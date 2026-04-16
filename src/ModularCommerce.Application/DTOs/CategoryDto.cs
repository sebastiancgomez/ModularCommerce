namespace ModularCommerce.Application.DTOs
{

    public class CategoryResponseDto
    {
        public Guid Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public ICollection<SubCategoryResponseDto> SubCategories { get; set; } = new List<SubCategoryResponseDto>();
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }

    public class CreateCategoryDto
    {
        public string Name { get; set; } = string.Empty;
    }
}