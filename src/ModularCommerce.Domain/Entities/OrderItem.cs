namespace ModularCommerce.Domain.Entities;

public class OrderItem
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public Guid OrderId { get; set; }
    public Order Order { get; set; } = null!;
    public Guid ProductId { get; set; }
    public Product Product { get; set; } = null!;
    public string ProductName { get; set; } = string.Empty;
    public int Quantity { get; set; }
    public decimal UnitPrice { get; set; }

    public static OrderItem Create(Product product, int quantity)
    {
        return new OrderItem
        {
            ProductId = product.Id,
            ProductName = product.Name,
            Quantity = quantity,
            UnitPrice = product.Price
        };
    }
}