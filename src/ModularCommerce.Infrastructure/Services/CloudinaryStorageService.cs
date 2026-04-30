using CloudinaryDotNet;
using CloudinaryDotNet.Actions;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Configuration;
using ModularCommerce.Application.Services;

public class CloudinaryStorageService : IFileStorageService
{
    private readonly Cloudinary _cloudinary;

    public CloudinaryStorageService(IConfiguration config)
    {
        // En el backend usamos la triada completa de seguridad
        var account = new Account(
            config["Cloudinary:CloudName"],
            config["Cloudinary:ApiKey"],
            config["Cloudinary:ApiSecret"]
        );
        _cloudinary = new Cloudinary(account);
    }

    public async Task<string> SaveFile(IFormFile file)
    {
        if (file == null || file.Length == 0) throw new Exception("Archivo no válido");

        using var stream = file.OpenReadStream();
        var uploadParams = new ImageUploadParams()
        {
            File = new FileDescription($"{Guid.NewGuid()}_{file.FileName}", stream),
            // Usamos una carpeta específica para los recibos de pago
            Folder = "modular_commerce/payments",
            // Forzamos optimización para que el admin no cargue fotos de 10MB
            Transformation = new Transformation().Width(1200).Crop("limit").Quality("auto").FetchFormat("auto")
        };

        var uploadResult = await _cloudinary.UploadAsync(uploadParams);

        if (uploadResult.Error != null)
            throw new Exception(uploadResult.Error.Message);

        // Devolvemos la URL segura para guardarla en la tabla Orders
        return uploadResult.SecureUrl.ToString();
    }
}