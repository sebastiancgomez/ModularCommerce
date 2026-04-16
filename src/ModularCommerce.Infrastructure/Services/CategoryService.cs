using Microsoft.EntityFrameworkCore;
using ModularCommerce.Application.DTOs;
using ModularCommerce.Domain.Entities;
using ModularCommerce.Application.Services;
using ModularCommerce.Infrastructure.Persistence;

namespace ModularCommerce.Infrastructure.Services;

public class CategoryService : ICategoryService
{
    private readonly AppDbContext _context;

    public CategoryService(AppDbContext context)
    {
        _context = context;
    }
    public async Task<Guid> Create(CreateCategoryDto dto)
    {
        var category = new Category
        {
            Name = dto.Name
        };

        _context.Categories.Add(category);
        await _context.SaveChangesAsync();

        return category.Id;     
           
    }
    public async Task<List<CategoryResponseDto>> GetAll()
    {
        return await _context.Categories.Select(c => new CategoryResponseDto
        {
            Id = c.Id,
            Name = c.Name,
             SubCategories = c.SubCategories.Select(s => new SubCategoryResponseDto
             {
                 Id = s.Id,
                 Name = s.Name,
                 CreatedAt = s.CreatedAt,
             }).ToList()
        }).ToListAsync();
    }

    public async Task<CategoryResponseDto?> GetById(Guid id)
    {
        return await _context.Categories
             .Where(c => c.Id == id)
             .Select(c => new CategoryResponseDto
             {
                 Id = c.Id,
                 Name = c.Name,
                SubCategories = c.SubCategories.Select(s => new SubCategoryResponseDto
                {
                    Id = s.Id,
                    Name = s.Name,
                    CreatedAt = s.CreatedAt,
                }).ToList()
             })
             .FirstOrDefaultAsync();
    }
}
