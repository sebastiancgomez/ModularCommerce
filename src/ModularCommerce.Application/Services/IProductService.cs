using ModularCommerce.Application.DTOs;
namespace ModularCommerce.Application.Services;
public interface IProductService
{
    Task<List<ProductResponseDto>> GetAll();
    Task<ProductResponseDto?> GetById(Guid id);
    Task<Guid> Create(CreateProductDto dto);
    Task<bool> Update(UpdateProductDto dto, Guid id);
}