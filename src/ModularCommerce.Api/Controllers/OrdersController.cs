using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ModularCommerce.Application.DTOs;
using ModularCommerce.Application.Services;
using ModularCommerce.Domain.Entities;
using ModularCommerce.Domain.Exceptions;
using ModularCommerce.Infrastructure.Services;
using System.Security.Claims;

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
    [HttpGet("getByEmail")]
    public async Task<IActionResult> GetByEmail([FromQuery] string email)
    {
        try
        {
            var userEmailFromToken = User.FindFirst(System.Security.Claims.ClaimTypes.Email)?.Value;

            // VALIDACIÓN DE SEGURIDAD:
            // ¿El email que pide las órdenes es el mismo que validó el OTP?
            if (string.IsNullOrEmpty(userEmailFromToken) ||
                !userEmailFromToken.Equals(email, StringComparison.OrdinalIgnoreCase))
            {
                return Forbid("No tienes permiso para acceder a los pedidos de este correo.");
            }
            return Ok(await _service.GetByEmail(email));
        }
        catch (Exception ex)
        {
            Console.WriteLine(ex.ToString());
            return BadRequest();
        }
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
            return BadRequest(new { message = result.Message });

        return Ok(new
        {
            message = result.Message,
            email = dto.Email,
            token = result.Token // <-- El frontend lo guardará
        });
    }

    [HttpPost("/resend-otp")]
    public async Task<IActionResult> ResendOtp(string email)
    {
        var message = await _service.ResendOtp(email);
        return Ok(message);
    }

    [HttpPost("{id}/upload-receipt")]
    public async Task<IActionResult> UploadReceipt(Guid id, IFormFile file)
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
    [HttpPost("request-lookup")]
    public async Task<IActionResult> RequestLookup([FromQuery] string email)
    {
        if (string.IsNullOrEmpty(email))
            return BadRequest("El email es requerido");

        try
        {
            await _service.RequestLookupOtp(email);
            return Ok(new { message = "Código de verificación enviado al correo." });
        }
        catch (BusinessException ex)
        {
            return BadRequest(new { message = ex.Message });
        }
    }
    [HttpPatch("{id}/recovery-update")]
    [Authorize] // El token del OTP ya nos da la seguridad necesaria
    public async Task<IActionResult> RecoveryUpdate(Guid id, [FromBody] UpdateOrderRecoveryDto dto)
    {
        // Validar que la orden pertenezca al email del token (Seguridad extra)
        var emailFromToken = User.FindFirst(ClaimTypes.Email)?.Value;

        var order = await _service.GetById(id);
        if (order == null || order.Email.ToLower().Trim() != emailFromToken?.ToLower().Trim())
            return Forbid();

        if (order.Status != "Pending")
            return BadRequest("Solo se pueden editar órdenes en estado Pendiente.");

        await _service.RecoveryUpdate(id, dto);
        // Actualizamos solo lo permitido
        
        return Ok(new { message = "Datos actualizados correctamente" });
    }
}
