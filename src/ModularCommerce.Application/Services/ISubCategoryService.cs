using ModularCommerce.Application.DTOs;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ModularCommerce.Application.Services;

public  interface ISubCategoryService
{
    Task<List<SubCategoryResponseDto>> GetAll();
    Task<SubCategoryResponseDto?> GetById(Guid id);
    Task<Guid> Create(CreateSubCategoryDto dto);
}
