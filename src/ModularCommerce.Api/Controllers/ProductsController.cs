using Microsoft.AspNetCore.Mvc;
using ModularCommerce.Application.DTOs;
using ModularCommerce.Application.Services;

namespace ModularCommerce.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ProductsController : ControllerBase
{
    private readonly IProductService _service;

    public ProductsController(IProductService service)
    {
        _service = service;
    }

    [HttpGet]
    public async Task<IActionResult> GetAll()
        => Ok(await _service.GetAll());

    [HttpGet("{id}")]
    public async Task<IActionResult> GetById(Guid id)
    {
        var product = await _service.GetById(id);
        if (product == null) return NotFound();

        return Ok(product);
    }

}