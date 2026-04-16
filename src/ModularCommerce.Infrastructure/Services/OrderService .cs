using Microsoft.EntityFrameworkCore;
using ModularCommerce.Application.DTOs;
using ModularCommerce.Application.Services;
using ModularCommerce.Domain.Entities;
using ModularCommerce.Domain.Exceptions;
using ModularCommerce.Infrastructure.Persistence;

namespace ModularCommerce.Infrastructure.Services;

public class OrderService : IOrderService
{
    private readonly AppDbContext _context;
    private readonly IEmailService _emailService;
    private readonly IFileStorageService _fileStorageService;

    public OrderService(AppDbContext context, IEmailService emailService, IFileStorageService fileStorageService)
    {
        _context = context;
        _emailService = emailService;
        _fileStorageService = fileStorageService;
    }

    public async Task<Guid> Create(CreateOrderDto dto)
    {
        using var transaction = await _context.Database.BeginTransactionAsync();

        var products = new List<(Product product, int quantity)>();

        foreach (var item in dto.Items)
        {
            var product = await _context.Products
                .FirstOrDefaultAsync(p => p.Id == item.ProductId);

            if (product == null)
                throw new BusinessException("Product not found");

            products.Add((product, item.Quantity));
        }

        var order = Order.Create(
            dto.Email,
            dto.FullName,
            dto.Phone,
            dto.Address,
            products
        );

        _context.Orders.Add(order);

        await _context.SaveChangesAsync();
        await transaction.CommitAsync();

        // OTP sigue siendo aplicación/infraestructura
        var otpCode = GenerateOtp();

        var otp = new OrderOtp
        {
            OrderId = order.Id,
            Code = otpCode,
            Expiration = DateTime.UtcNow.AddMinutes(10)
        };

        _context.OrderOtps.Add(otp);
        await _context.SaveChangesAsync();

        _ = Task.Run(async () =>
        {
            try
            {
                await _emailService.SendOtp(order.Email, otpCode);
            }
            catch { }
        });

        return order.Id;
    }

    public async Task<OrderResponseDto?> GetById(Guid id)
    {
        return await _context.Orders
            .Where(o => o.Id == id)
            .Select(o => new OrderResponseDto
            {
                Id = o.Id,
                Email = o.Email,
                TotalAmount = o.TotalAmount,
                Status = o.Status.ToString(),
                CreatedAt = o.CreatedAt,
                Items = o.Items.Select(i => new OrderItemResponseDto
                {
                    ProductId = i.ProductId,
                    ProductName = i.ProductName,
                    Quantity = i.Quantity,
                    UnitPrice = i.UnitPrice
                }).ToList()
            })
            .FirstOrDefaultAsync();
    }

    public async Task<List<OrderResponseDto>> GetAll()
    {
        return await _context.Orders
            .Select(o => new OrderResponseDto
            {
                Id = o.Id,
                Email = o.Email,
                TotalAmount = o.TotalAmount,
                Status = o.Status.ToString(),
                CreatedAt = o.CreatedAt,
                Items = o.Items.Select(i => new OrderItemResponseDto
                {
                    ProductId = i.ProductId,
                    ProductName = i.ProductName,
                    Quantity = i.Quantity,
                    UnitPrice = i.UnitPrice
                }).ToList()
            })
            .ToListAsync();
    }

    public async Task UpdateStatus(Guid id, OrderStatus status)
    {
        var order = await _context.Orders.FindAsync(id);

        if (order == null)
            throw new BusinessException("Orden no encontrada");

        order.Status = status;

        await _context.SaveChangesAsync();
    }
    public async Task<(bool Success, string Message)> VerifyOtp(VerifyOtpDto dto)
    {
        var otp = await _context.OrderOtps
            .Where(o => o.OrderId == dto.OrderId)
            .OrderByDescending(o => o.CreatedAt)
            .FirstOrDefaultAsync();

        if (otp == null)
            throw new BusinessException("Código no encontrado");

        var order = await _context.Orders.FindAsync(dto.OrderId);

        if (order == null)
            throw new BusinessException("Orden no encontrada");

        try
        {
            otp.Verify(dto.Code);

            order.VerifyOtp();

            await _context.SaveChangesAsync();

            return (true, "Orden confirmada");
        }
        catch (BusinessException ex)
        {
            await _context.SaveChangesAsync(); // guarda intentos

            return (false, ex.Message);
        }
    }
    public async Task<string> ResendOtp(Guid orderId)
    {
        var order = await _context.Orders.FindAsync(orderId);

        if (order == null)
            throw new BusinessException("Orden no encontrada");

        // 👇 AQUÍ VA LA VALIDACIÓN ANTI ABUSO
        var lastOtp = await _context.OrderOtps
            .Where(o => o.OrderId == orderId)
            .OrderByDescending(o => o.CreatedAt)
            .FirstOrDefaultAsync();

        if (lastOtp != null && lastOtp.CreatedAt > DateTime.UtcNow.AddMinutes(-1))
            return "Debes esperar antes de solicitar otro código";

        // Generar nuevo OTP
        var newCode = GenerateOtp();

        var otp = new OrderOtp
        {
            OrderId = orderId,
            Code = newCode,
            Expiration = DateTime.UtcNow.AddMinutes(10)
        };

        _context.OrderOtps.Add(otp);
        await _context.SaveChangesAsync();

        try
        {
            await _emailService.SendOtp(order.Email, newCode);
        }
        catch (Exception ex)
        {
            // log
            Console.WriteLine($"Failed to resend OTP: {ex.Message}");
        }

        return "Nuevo código enviado";
    }

    public async Task<string> UploadReceipt(UploadReceiptDto request)
    {
        var order = await _context.Orders
            .FirstOrDefaultAsync(o => o.Id == request.OrderId);

        if (order == null)
            throw new BusinessException("Orden no encontrada");

        var fileUrl = await _fileStorageService.SaveFile(request.File);

        var receipt = new PaymentReceipt
        {
            OrderId = request.OrderId,
            FileUrl = fileUrl
        };

        _context.PaymentReceipts.Add(receipt);

       order.MarkAsUnderReview();

        await _context.SaveChangesAsync();

        return "Comprobante cargado";
    }
    public async Task<List<OrderAdminListDto>> GetAdminOrders()
    {
        return await _context.Orders
            .OrderByDescending(o => o.CreatedAt)
            .Select(o => new OrderAdminListDto
            {
                Id = o.Id,
                Email = o.Email,
                TotalAmount = o.TotalAmount,
                Status = o.Status.ToString(),
                CreatedAt = o.CreatedAt
            })
            .ToListAsync();
    }
    public async Task<OrderAdminDetailDto?> GetAdminOrderById(Guid id)
    {
        return await _context.Orders
            .Where(o => o.Id == id)
            .Select(o => new OrderAdminDetailDto
            {
                Id = o.Id,
                Email = o.Email,
                FullName = o.FullName,
                Phone = o.Phone,
                Address = o.Address,
                TotalAmount = o.TotalAmount,
                Status = o.Status.ToString(),

                Items = o.Items.Select(i => new OrderItemResponseDto
                {
                    ProductId = i.ProductId,
                    ProductName = i.Product.Name,
                    Quantity = i.Quantity,
                    UnitPrice = i.UnitPrice
                }).ToList(),

                Receipts = _context.PaymentReceipts
                    .Where(r => r.OrderId == o.Id)
                    .Select(r => r.FileUrl)
                    .ToList()
            })
            .FirstOrDefaultAsync();
    }
    public async Task ApproveOrder(Guid id)
    {
        var order = await _context.Orders.FindAsync(id);

        if (order == null)
            throw new BusinessException("Order not found");

        order.MarkAsPaid();

        await _context.SaveChangesAsync();
    }
    public async Task RejectOrder(Guid id)
    {
        var order = await _context.Orders.FindAsync(id);

        if (order == null)
            throw new BusinessException("Order not found");

        order.RejectPayment();

        await _context.SaveChangesAsync();
    }
    public async Task MarkAsUnderReview(Guid id)
    {
        var order = await _context.Orders.FindAsync(id);

        if (order == null)
            throw new BusinessException("Order not found");

        order.MarkAsUnderReview();

        await _context.SaveChangesAsync();
    }
    public async Task CancelOrder(Guid orderId)
    {
        var order = await _context.Orders.FindAsync(orderId);

        if (order == null)
            throw new BusinessException("Order not found");       

        order.Cancel();

        await _context.SaveChangesAsync();
    }
    public async Task MarkAsDelivered(Guid orderId)
    {
        var order = await _context.Orders.FindAsync(orderId);

        if (order == null)
            throw new BusinessException("Order not found");

        order.Deliver();

        await _context.SaveChangesAsync();
    }
    private string GenerateOtp()
    {
        var random = new Random();
        return random.Next(100000, 999999).ToString();
    }
}
