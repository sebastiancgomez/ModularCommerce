using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Configuration;
using ModularCommerce.Application.Services;

namespace ModularCommerce.Infrastructure.Services;


public class FileStorageService: IFileStorageService
{
    private readonly string _basePath;

    public FileStorageService(IConfiguration config)
    {
        _basePath = Path.Combine("wwwroot", config["Storage:ReceiptPath"]!);
    }

    public async Task<string> SaveFile(IFormFile file)
    {
        if (!Directory.Exists(_basePath))
            Directory.CreateDirectory(_basePath);

        var fileName = $"{Guid.NewGuid()}_{file.FileName}";
        var fullPath = Path.Combine(_basePath, fileName);

        using var stream = new FileStream(fullPath, FileMode.Create);
        await file.CopyToAsync(stream);

        return $"/receipts/{fileName}";
    }
}
