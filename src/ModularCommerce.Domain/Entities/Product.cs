using ModularCommerce.Domain.Exceptions;

namespace ModularCommerce.Domain.Entities;

public class Product
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public string SKU { get; set; } = string.Empty;

    public string Name { get; set; } = string.Empty;

    public string Description { get; set; } = string.Empty;

    public decimal Price { get; set; }

    public int Stock { get; set; }

    public Guid CategoryId { get; set; }
    public Category Category { get; set; } = null!;

    public Guid SubCategoryId { get; set; }
    public SubCategory SubCategory { get; set; } = null!;

    public string? Brand { get; set; }

    public string ImageUrl { get; set; } = string.Empty;
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime? UpdatedAt { get; set; }

    public void DecreaseStock(int quantity)
    {
        if (Stock < quantity)
            throw new BusinessException($"Insufficient stock for {Name}");

        Stock -= quantity;
    }
}