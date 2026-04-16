using Microsoft.EntityFrameworkCore;
using ModularCommerce.Application.DTOs;
using ModularCommerce.Domain.Entities;
using ModularCommerce.Infrastructure.Persistence;
using ModularCommerce.Application.Services;
using ModularCommerce.Domain.Exceptions;

namespace ModularCommerce.Infrastructure.Services
{
    public class SubCategoryService : ISubCategoryService
    {
        private readonly AppDbContext _context;

        public SubCategoryService(AppDbContext context)
        {
            _context = context;
        }
        public async Task<Guid> Create(CreateSubCategoryDto dto)
        {
            var categoryExists = await _context.Categories
                .AnyAsync(c => c.Id == dto.CategoryId);

            if (!categoryExists)
                throw new BusinessException("Categoria no encontrada");
            var subCategory = new SubCategory
            {
                Name = dto.Name,
                CategoryId = dto.CategoryId
            };

            _context.SubCategories.Add(subCategory);
            await _context.SaveChangesAsync();

            return subCategory.Id;
        }

        public async Task<List<SubCategoryResponseDto>> GetAll()
        {
            return await _context.SubCategories.Select(s => new SubCategoryResponseDto
            {
                Id = s.Id,
                Name = s.Name,
                CategoryId = s.CategoryId,
                CategoryName = s.Category.Name,
                CreatedAt = s.CreatedAt,
            }).ToListAsync();
        }

        public async Task<SubCategoryResponseDto?> GetById(Guid id)
        {
            return await _context.SubCategories.Where(s => s.Id == id)
                .Select(s => new SubCategoryResponseDto
                {
                    Id = s.Id,
                    Name = s.Name,
                    CategoryId = s.CategoryId,
                    CategoryName = s.Category.Name, 
                    CreatedAt = s.CreatedAt,
                }).FirstOrDefaultAsync();
        }
    }
}
