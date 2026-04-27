using ModularCommerce.Domain.Exceptions;

namespace ModularCommerce.Domain.Entities;

public class Order
{
    public Guid Id { get; set; } = Guid.NewGuid();

    public string Email { get; set; } = string.Empty;
    public string FullName { get; set; } = string.Empty;
    public string Phone { get; set; } = string.Empty;
    public string Address { get; set; } = string.Empty;

    public decimal TotalAmount { get; set; }

    public OrderStatus Status { get; set; } = OrderStatus.Pending;

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    public ICollection<OrderItem> Items { get; set; } = new List<OrderItem>();

    public static Order Create(
        string email,
        string fullName,
        string phone,
        string address,
        List<(Product product, int quantity)> products)
    {
        var order = new Order
        {
            Email = email,
            FullName = fullName, 
            Phone = phone,
            Address = address,
            Status = OrderStatus.Pending
        };

        decimal total = 0;

        foreach (var (product, quantity) in products)
        {
            if (product.Stock < quantity)
                throw new BusinessException($"Insufficient stock for {product.Name}");

            product.DecreaseStock(quantity);

            var item = OrderItem.Create(product, quantity);

            order.Items.Add(item);

            total += item.UnitPrice * quantity;
        }

        order.TotalAmount = total;

        return order;
    }
    public void VerifyOtp()
    {
        if (Status != OrderStatus.Pending)
            throw new BusinessException("Orden no válida para pago pendiente");

        Status = OrderStatus.PaymentPending;
    }
    public void MarkAsUnderReview()
    {
        if (Status != OrderStatus.PaymentPending)
            throw new BusinessException("Orden no válida para revisión");

        Status = OrderStatus.UnderReview;
    }
    public void MarkAsPaid()
    {
        if (Status != OrderStatus.UnderReview)
            throw new BusinessException("Orden no válida para pago");

        Status = OrderStatus.Paid;
    }
    public void RejectPayment()
    {
        if (Status != OrderStatus.UnderReview)
            throw new BusinessException("Order not under review");

        Status = OrderStatus.Rejected;
    }
    public void Cancel()
    {
        if (Status != OrderStatus.Pending && Status != OrderStatus.PaymentPending)
            throw new BusinessException("Cannot cancel at this stage");

        Status = OrderStatus.Cancelled;
    }
    public void Prepare()
    {
        if (Status != OrderStatus.Paid)
            throw new BusinessException("Order not in paid");

        Status = OrderStatus.Preparing;
    }
    public void Deliver()
    {
        if (Status != OrderStatus.Preparing)
            throw new BusinessException("Order not in preparation");

        Status = OrderStatus.Delivering;
    }
    public void Delivered()
    {
        if (Status != OrderStatus.Delivering)
            throw new BusinessException("Order not in deliver");

        Status = OrderStatus.Delivered;
    }
}
public enum OrderStatus
{
    Pending = 1,
    PaymentPending = 2,
    UnderReview = 3,
    Paid = 4,    
    Rejected = 5,
    Preparing = 6,
    Delivering = 7,
    Delivered = 8,
    Cancelled = 9
}