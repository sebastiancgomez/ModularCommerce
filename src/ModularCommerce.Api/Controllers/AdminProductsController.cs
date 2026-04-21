using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using ModularCommerce.Application.DTOs;
using ModularCommerce.Application.Services;

namespace ModularCommerce.Api.Controllers;

[ApiController]
[Authorize(Roles = "Admin")]
[Route("api/admin/products")]
public class AdminProductsController : ControllerBase
{
    private readonly IProductService _service;
    public AdminProductsController(IProductService service)
    {
        _service = service;
    }

    [HttpPost]
    public async Task<IActionResult> Create(CreateProductDto dto)
    {
        var id = await _service.Create(dto);
        return Ok(id);
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> Update(UpdateProductDto dto, Guid id)
    {
        var updated = await _service.Update(dto, id);
        return Ok(id);
    }
}
