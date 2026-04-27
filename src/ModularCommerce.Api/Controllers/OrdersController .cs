using Microsoft.AspNetCore.Mvc;
using ModularCommerce.Application.DTOs;
using ModularCommerce.Application.Services;
using ModularCommerce.Domain.Entities;
using ModularCommerce.Infrastructure.Services;

namespace ModularCommerce.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class OrdersController : ControllerBase
{
    private readonly IOrderService _service;

    public OrdersController(IOrderService service)
    {
        _service = service;
    }

    [HttpPost]
    public async Task<IActionResult> Create(CreateOrderDto dto)
    {
        var id = await _service.Create(dto);
        return Ok(id);
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetById(Guid id)
    {
        var order = await _service.GetById(id);
        if (order == null) return NotFound();

        return Ok(order);
    }

    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        return Ok(await _service.GetAll());
    }

    [HttpPut("{id}/status")]
    public async Task<IActionResult> UpdateStatus(Guid id, OrderStatus status)
    {
        await _service.UpdateStatus(id, status);
        return NoContent();
    }

    [HttpPost("verify-otp")]
    public async Task<IActionResult> VerifyOtp(VerifyOtpDto dto)
    {
        var result = await _service.VerifyOtp(dto);

        if (!result.Success)
            return BadRequest(result.Message);

        return Ok(result.Message);
    }

    [HttpPost("{id}/resend-otp")]
    public async Task<IActionResult> ResendOtp(Guid id)
    {
        var message = await _service.ResendOtp(id);
        return Ok(message);
    }

    [HttpPost("{id}/upload-receipt")]
    public async Task<IActionResult> UploadReceipt(Guid id, [FromForm] IFormFile file)
    {
        var request = new UploadReceiptDto
        {
            OrderId = id,
            File = file
        };

        var result = await _service.UploadReceipt(request);

        return Ok(result);
    }

    [HttpPost("{id}/cancel")]
    public async Task<IActionResult> Cancel(Guid id)
    {
        await _service.CancelOrder(id);
        return Ok(new { message = "Order cancelled" });
    }

    [HttpPost("{id}/deliver")]
    public async Task<IActionResult> Deliver(Guid id)
    {
        await _service.MarkAsDelivered(id);
        return Ok(new { message = "Order delivered" });
    }
}
