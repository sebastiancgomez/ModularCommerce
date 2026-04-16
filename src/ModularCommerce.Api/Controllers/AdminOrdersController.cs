using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using ModularCommerce.Application.Services;

[ApiController]
[Authorize(Roles = "Admin")]
[Route("api/admin/orders")]
public class AdminOrdersController : ControllerBase
{
    private readonly IOrderService _service;

    public AdminOrdersController(IOrderService service)
    {
        _service = service;
    }

    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        return Ok(await _service.GetAdminOrders());
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetById(Guid id)
    {
        var order = await _service.GetAdminOrderById(id);

        if (order == null)
            return NotFound();

        return Ok(order);
    }

    [HttpPost("{id}/approve")]
    public async Task<IActionResult> Approve(Guid id)
    {
        await _service.ApproveOrder(id);
        return Ok();
    }

    [HttpPost("{id}/reject")]
    public async Task<IActionResult> Reject(Guid id)
    {
        await _service.RejectOrder(id);
        return Ok();
    }

    [HttpPost("{id}/review")]
    public async Task<IActionResult> Review(Guid id)
    {
        await _service.MarkAsUnderReview(id);
        return Ok();
    }
}