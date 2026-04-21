using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ModularCommerce.Application.DTOs;
using ModularCommerce.Application.Services;
using ModularCommerce.Domain.Entities;

[ApiController]
[Route("api/[controller]")]
public class SubCategoriesController : ControllerBase
{
    private readonly ISubCategoryService _subCategoryService;

    public SubCategoriesController(ISubCategoryService subCategoryService)
    {
        _subCategoryService = subCategoryService;
    }

    [Authorize(Roles = "Admin")]
    [HttpPost]
    public async Task<IActionResult> Create(CreateSubCategoryDto dto)
    {
        var subCategoryId = await _subCategoryService.Create(dto);
        return Ok(subCategoryId);
    }

    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        var subCategories = await _subCategoryService.GetAll();
        return Ok(subCategories);
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetById(Guid id)
    {
        var subCategory = await _subCategoryService.GetById(id);
        if (subCategory == null)
        {
            return NotFound();
        }
        return Ok(subCategory);
    }
}