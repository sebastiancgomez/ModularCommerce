using ModularCommerce.Application.DTOs;
using ModularCommerce.Domain.Entities;
using System.Threading.Tasks;

namespace ModularCommerce.Application.Services;

public interface IOrderService
{
    Task<Guid> Create(CreateOrderDto dto);
    Task<OrderResponseDto?> GetById(Guid id);
    Task<List<OrderResponseDto>> GetAll();
    Task UpdateStatus(Guid id, OrderStatus status);
    Task<(bool Success, string Message)> VerifyOtp(VerifyOtpDto dto);
    Task<string> ResendOtp(Guid orderId);
    Task<string> UploadReceipt(UploadReceiptDto dto);
    Task<List<OrderAdminListDto>> GetAdminOrders();
    Task<OrderAdminDetailDto?> GetAdminOrderById(Guid id);
    Task ApproveOrder(Guid id);
    Task RejectOrder(Guid id);
    Task MarkAsUnderReview(Guid id);
    Task CancelOrder(Guid orderId);
    Task MarkAsDelivered(Guid orderId);
}
