using Microsoft.Extensions.Configuration;
using ModularCommerce.Application.Services;
using MailKit.Net.Smtp;
using MailKit.Security;
using MimeKit;

namespace ModularCommerce.Infrastructure.Services;

public class EmailService: IEmailService
{
    private readonly IConfiguration _config;

    public EmailService(IConfiguration config)
    {
        _config = config;
    }

    public async Task SendOtp(string toEmail, string code, string purpose)
    {
        // 1. Diccionario de mensajes según el propósito
        var messages = new Dictionary<string, string>
        {
            { OtpPurpose.OrderConfirmation.ToString(), "Usa este c&oacute;digo para completar tu orden y finalizar tu compra:" },
            { OtpPurpose.OrderLookup.ToString(), "Usa este c&oacute;digo para acceder a tu historial y consultar tus pedidos:" },
            { "Default", "Usa este c&oacute;digo para verificar tu identidad en nuestro sitio:" }
        };
        // 2. Diccionario de Asuntos (Subjects)
        var subjects = new Dictionary<string, string>
        {
            { OtpPurpose.OrderConfirmation.ToString(), "Confirma tu compra - Mis Bellas" },
            { OtpPurpose.OrderLookup.ToString(), "Acceso a tus pedidos - Mis Bellas" },
            { "Default", "Verifica que eres una de Mis Bellas" }
        };

        string messageToUse = messages.ContainsKey(purpose) ? messages[purpose] : messages["Default"];
        string subjectToUse = subjects.GetValueOrDefault(purpose, subjects["Default"]);

        // 3. Cargar y preparar el Template
        string filePath = Path.Combine(AppContext.BaseDirectory, "EmailTemplates", "OtpTemplate.html");
        string htmlBody = await File.ReadAllTextAsync(filePath, System.Text.Encoding.UTF8);

        // Reemplazos
        htmlBody = htmlBody.Replace("{OTP_CODE}", code);
        htmlBody = htmlBody.Replace("{OTP_MESSAGE}", messageToUse);

        // 3. Configurar el mensaje (Mismo código que ya tienes...)
        var email = new MimeMessage();
        email.From.Add(new MailboxAddress("Mis Bellas", _config["Smtp:User"]!));
        email.To.Add(MailboxAddress.Parse(toEmail));

        // Asunto dinámico (Opcional)
        email.Subject = subjectToUse;

        var bodyBuilder = new BodyBuilder { HtmlBody = htmlBody };
        email.Body = bodyBuilder.ToMessageBody();

        // 3. Enviar con MailKit
        using var smtp = new SmtpClient();
        try
        {
            // 'Auto' elegirá SSL para 465 o TLS para 587 automáticamente
            await smtp.ConnectAsync(
                _config["Smtp:Host"]!,
                int.Parse(_config["Smtp:Port"]!),
                SecureSocketOptions.Auto
            );

            await smtp.AuthenticateAsync(_config["Smtp:User"]!, _config["Smtp:Pass"]!);
            await smtp.SendAsync(email);
        }
        finally
        {
            await smtp.DisconnectAsync(true);
        }
    }
}
