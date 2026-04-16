using Microsoft.EntityFrameworkCore;
using ModularCommerce.Domain.Entities;
using ModularCommerce.Infrastructure.Persistence;
using ModularCommerce.Application.DTOs;
using ModularCommerce.Application.Services;
using ModularCommerce.Domain.Exceptions;

namespace ModularCommerce.Infrastructure.Services;

public class ProductService : IProductService
{
    private readonly AppDbContext _context;

    public ProductService(AppDbContext context)
    {
        _context = context;
    }

    public async Task<List<ProductResponseDto>> GetAll()
    {
        return await _context.Products
            .Include(p => p.Category)
            .Include(p => p.SubCategory)
            .Select(p => new ProductResponseDto
            {
                Id = p.Id,
                Name = p.Name,
                Price = p.Price,
                CategoryName = p.Category.Name,
                SubCategoryName = p.SubCategory.Name,
                Stock = p.Stock,
                Brand = p.Brand,
                ImageUrl = p.ImageUrl,
                CreatedAt = p.CreatedAt,
                UpdatedAt = p.UpdatedAt
            })
            .ToListAsync();
    }

    public async Task<ProductResponseDto?> GetById(Guid id)
    {
        return await _context.Products
            .Where(p => p.Id == id)
            .Select(p => new ProductResponseDto
            {
                Id = p.Id,
                Name = p.Name,
                Price = p.Price,
                CategoryName = p.Category.Name,
                SubCategoryName = p.SubCategory.Name,
                Stock = p.Stock,
                Brand = p.Brand,
                ImageUrl = p.ImageUrl,
                CreatedAt = p.CreatedAt,
                UpdatedAt = p.UpdatedAt
            })
            .FirstOrDefaultAsync();
    }

    public async Task<Guid> Create(CreateProductDto dto)
    {
        var categoryExists = await _context.Categories
            .AnyAsync(c => c.Id == dto.CategoryId);

        if (!categoryExists)
            throw new BusinessException("Categoria no encontrada");

        var subCategoryExists = await _context.SubCategories
            .AnyAsync(sc => sc.Id == dto.SubCategoryId);

        if (!subCategoryExists)
            throw new BusinessException("SubCategoria no encontrada");

        var product = new Product
        {
            Name = dto.Name,
            Description = dto.Description,
            Price = dto.Price,
            Stock = dto.Stock,
            CategoryId = dto.CategoryId,
            SubCategoryId = dto.SubCategoryId,
            Brand = dto.Brand,
            ImageUrl = dto.ImageUrl
        };

        _context.Products.Add(product);
        await _context.SaveChangesAsync();

        return product.Id;
    }
}