using Microsoft.EntityFrameworkCore;
using ModularCommerce.Application.DTOs;
using ModularCommerce.Application.Services;
using ModularCommerce.Domain.Entities;
using ModularCommerce.Domain.Exceptions;
using ModularCommerce.Infrastructure.Persistence;
using System.Security.Claims;

namespace ModularCommerce.Infrastructure.Services;

public class OrderService : IOrderService
{
    private readonly AppDbContext _context;
    private readonly IEmailService _emailService;
    private readonly IFileStorageService _fileStorageService;
    private readonly ITokenService _tokenService;

    public OrderService(AppDbContext context, IEmailService emailService, IFileStorageService fileStorageService, ITokenService tokenService)
    {
        _context = context;
        _emailService = emailService;
        _fileStorageService = fileStorageService;
        _tokenService = tokenService;
    }

    public async Task<Guid> Create(CreateOrderDto dto)
    {
        using var transaction = await _context.Database.BeginTransactionAsync();

        var products = new List<(Product product, int quantity)>();
        Console.WriteLine(dto);

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

        var otp = new UserOtp
        {
            Email = order.Email,
            Code = otpCode,
            Expiration = DateTime.UtcNow.AddMinutes(10)
        };

        _context.UserOtps.Add(otp);
        await _context.SaveChangesAsync();

        _ = Task.Run(async () =>
        {
            try
            {
                await _emailService.SendOtp(order.Email, otp.Code, otp.Purpose);
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
                FullName = o.FullName,
                Phone = o.Phone,
                Address = o.Address,
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
    public async Task<List<OrderResponseDto>> GetByEmail(string email)
    {
        return await _context.Orders
            .Where(o => o.Email.ToLower() == email.Trim().ToLower())
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
    public async Task<(bool Success, string Message, string Token)> VerifyOtp(VerifyOtpDto dto)
    {
        // Usamos una estrategia de ejecución por si hay reintentos de conexión
        var strategy = _context.Database.CreateExecutionStrategy();

        return await strategy.ExecuteAsync(async () =>
        {
            using var transaction = await _context.Database.BeginTransactionAsync();
            try
            {
                var otp = await _context.UserOtps
                    .Where(o => o.Email == dto.Email && !o.IsUsed)
                    .OrderByDescending(o => o.CreatedAt)
                    .FirstOrDefaultAsync();

                if (otp == null)
                    throw new BusinessException("Código no encontrado o ya utilizado");

                // 1. Verificamos el OTP (esto incrementa intentos internamente)
                try
                {
                    otp.Verify(dto.Code);
                }
                catch (BusinessException ex)
                {
                    // Si el código es incorrecto, guardamos el INTENTO fallido
                    // fuera de esta transacción o confirmando esta pero fallando el proceso.
                    await _context.SaveChangesAsync();
                    await transaction.CommitAsync();
                    return (false, ex.Message, string.Empty);
                }

                // 2. Si el propósito es Confirmación de Orden, actualizamos la orden
                if (otp.Purpose == "OrderConfirmation")
                {
                    var order = await _context.Orders
                        .OrderByDescending(o => o.CreatedAt)
                        .FirstOrDefaultAsync(o => o.Email == dto.Email && o.Status == OrderStatus.Pending);

                    if (order == null)
                        throw new BusinessException("No se encontró una orden pendiente para confirmar");

                    order.VerifyOtp(); // Cambia estado a Paid
                }

                // 3. Guardamos ambos cambios de forma atómica
                await _context.SaveChangesAsync();

                // 4. Confirmamos la transacción
                await transaction.CommitAsync();

                var token = _tokenService.CreateOrderAccessToken(dto.Email);

                return (true, "Verificación exitosa", token);
            }
            catch (Exception ex)
            {
                await transaction.RollbackAsync();
                // Si es una BusinessException la pasamos, si no, es un error genérico
                return (false, ex is BusinessException ? ex.Message : "Error interno al procesar la verificación", string.Empty);
            }
        });
    }
    public async Task<string> ResendOtp(string email)
    {
        var order = await _context.Orders
            .OrderByDescending(o => o.CreatedAt)
            .FirstOrDefaultAsync(o => o.Email == email);

        if (order == null)
            throw new BusinessException("Orden no encontrada");

        // 👇 AQUÍ VA LA VALIDACIÓN ANTI ABUSO
        var lastOtp = await _context.UserOtps
            .Where(o => o.Email == email)
            .OrderByDescending(o => o.CreatedAt)
            .FirstOrDefaultAsync();

        if (lastOtp != null && lastOtp.CreatedAt > DateTime.UtcNow.AddMinutes(-1))
            return "Debes esperar antes de solicitar otro código";

        // Generar nuevo OTP
        var newCode = GenerateOtp();

        var otp = new UserOtp
        {
            Email = email,
            Code = newCode,
            Expiration = DateTime.UtcNow.AddMinutes(10)
        };

        _context.UserOtps.Add(otp);
        await _context.SaveChangesAsync();

        try
        {
            await _emailService.SendOtp(order.Email, otp.Code, otp.Purpose);
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
                FullName = o.FullName,
                Phone = o.Phone,
                Address = o.Address,
                TotalAmount = o.TotalAmount,
                Status = o.Status.ToString(),
                CreatedAt = o.CreatedAt,
                Items = o.Items.Select(i => new OrderItemResponseDto
                {
                    ProductId = i.ProductId,
                    ProductName = i.ProductName,
                    Quantity = i.Quantity,
                    UnitPrice = i.UnitPrice
                }).ToList(),
                // Aquí hacemos el "Join" implícito:
                // Accedemos a la URL del comprobante. 
                // Usamos ?. por si la orden aún no tiene recibo (estado Pending)
                PaymentFileUrl = _context.PaymentReceipts
                    .Where(pr => pr.OrderId == o.Id)
                    .Select(pr => pr.FileUrl)
                    .FirstOrDefault() ?? string.Empty
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
    public async Task RejectOrder(Guid orderId)
    {
        var order = await _context.Orders.FindAsync(orderId);

        if (order == null)
            throw new BusinessException("Order not found");

        if (order.Status != OrderStatus.Pending && order.Status != OrderStatus.PaymentPending && order.Status != OrderStatus.UnderReview)
            throw new BusinessException("Order can not rejected");
        // Validación importante: solo rechazar si está pendiente de revisión
        // o si el flujo de negocio lo permite (ej: UnderReview)
        if (order.Status == OrderStatus.Rejected)
            return;

        using var transaction = await _context.Database.BeginTransactionAsync();
        try
        {
            // 1. Devolvemos el stock al inventario
            await ReleaseItems(orderId);

            // 2. Cambiamos el estado de la orden (usa tu método de entidad si existe)
            // Ejemplo: order.Reject(); 
            order.RejectPayment();

            await _context.SaveChangesAsync();
            await transaction.CommitAsync();
        }
        catch (Exception)
        {
            await transaction.RollbackAsync();
            throw;
        }
    }
    /*public async Task MarkAsUnderReview(Guid id)
    {
        var order = await _context.Orders.FindAsync(id);

        if (order == null)
            throw new BusinessException("Order not found");

        order.MarkAsUnderReview();

        await _context.SaveChangesAsync();
    }*/
    public async Task CancelOrder(Guid orderId)
    {
        var order = await _context.Orders.FindAsync(orderId);

        if (order == null)
            throw new BusinessException("Order not found");
        if (order.Status != OrderStatus.Pending && order.Status != OrderStatus.PaymentPending)
            throw new BusinessException("Order can not cancelled");
        if (order.Status == OrderStatus.Cancelled)
            return;
        using var transaction = await _context.Database.BeginTransactionAsync();
        try
        {
            await ReleaseItems(orderId);
            order.Cancel();
            await _context.SaveChangesAsync();
            await transaction.CommitAsync();
        }
        catch (Exception)
        {
            await transaction.RollbackAsync();
            throw;
        }
    }
    public async Task PrepareOrder(Guid orderId)
    {
        var order = await _context.Orders.FindAsync(orderId);

        if (order == null)
            throw new BusinessException("Order not found");

        order.Prepare();

        await _context.SaveChangesAsync();
    }
    public async Task DispatchOrder(Guid orderId)
    {
        var order = await _context.Orders.FindAsync(orderId);

        if (order == null)
            throw new BusinessException("Order not found");

        order.Deliver();

        await _context.SaveChangesAsync();
    }
    public async Task MarkAsDelivered(Guid orderId)
    {
        var order = await _context.Orders.FindAsync(orderId);

        if (order == null)
            throw new BusinessException("Order not found");

        order.Delivered();

        await _context.SaveChangesAsync();
    }
    public async Task RequestLookupOtp(string email)
    {
        // 1. Normalizar email
        var normalizedEmail = email.Trim().ToLower();

        // 2. Opcional: Validar que existan órdenes para no gastar recursos de email
        var hasOrders = await _context.Orders.AnyAsync(o => o.Email == normalizedEmail);
        if (!hasOrders)
            throw new BusinessException("No se encontraron órdenes asociadas a este correo.");

        // 3. Invalidar OTPs previos de tipo Lookup
        var oldOtps = await _context.UserOtps
            .Where(o => o.Email == normalizedEmail && o.Purpose == "OrderLookup" && !o.IsUsed)
            .ToListAsync();

        foreach (var old in oldOtps) old.IsUsed = true;

        // 4. Crear nuevo OTP
        var otp = new UserOtp
        {
            Email = normalizedEmail,
            Code = new Random().Next(100000, 999999).ToString(),
            Expiration = DateTime.UtcNow.AddMinutes(15),
            Purpose = OtpPurpose.OrderLookup.ToString(), // <--- Crucial para la lógica del VerifyOtp
        };

        _context.UserOtps.Add(otp);
        await _context.SaveChangesAsync();

        // 5. Enviar el email
        await _emailService.SendOtp(normalizedEmail, otp.Code, otp.Purpose);
    }
    public async Task RecoveryUpdate(Guid id, UpdateOrderRecoveryDto dto)
    {
        var order = await _context.Orders.FindAsync(id);
        if (order == null)
            throw new BusinessException("Order not found");
        if (order.Status != OrderStatus.Pending && order.Status != OrderStatus.PaymentPending)
            throw new BusinessException("Solo se pueden editar órdenes en estado Pendiente.");
        // Actualizamos solo lo permitido
        order.Address = dto.Address;
        order.Phone = dto.Phone;
        if(order.Status == OrderStatus.Pending)
            order.VerifyOtp();

        await _context.SaveChangesAsync();
    }

    private string GenerateOtp()
    {
        var random = new Random();
        return random.Next(100000, 999999).ToString();
    }
    private async Task ReleaseItems(Guid orderId)
    {
        var orderItems = await _context.OrderItems
            .Where(oi => oi.OrderId == orderId)
            .ToListAsync();

        foreach (var item in orderItems)
        {
            var product = await _context.Products.FindAsync(item.ProductId);
            if (product != null)
            {
               product.ReleaseStock( item.Quantity);
            }
        }

    }
}
