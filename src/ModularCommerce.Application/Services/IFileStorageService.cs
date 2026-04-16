using Microsoft.AspNetCore.Http;

namespace ModularCommerce.Application.Services;

public interface IFileStorageService
{
    Task<string> SaveFile(IFormFile file);
}
