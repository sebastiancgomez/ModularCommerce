using Microsoft.AspNetCore.Http;

namespace ModularCommerce.Application.DTOs;
public class UploadReceiptDto
{
    public Guid OrderId { get; set; }
    public IFormFile File { get; set; } = null!;
}