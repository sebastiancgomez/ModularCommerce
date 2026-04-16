using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using ModularCommerce.Application.DTOs;

namespace ModularCommerce.Application.Services;

public interface ICategoryService
{
    Task<List<CategoryResponseDto>> GetAll();
    Task<CategoryResponseDto?> GetById(Guid id);
    Task<Guid> Create(CreateCategoryDto dto);
}
