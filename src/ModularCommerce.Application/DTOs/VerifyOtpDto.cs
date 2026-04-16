using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ModularCommerce.Application.DTOs;

public class VerifyOtpDto
{
    public Guid OrderId { get; set; }
    public string Code { get; set; } = string.Empty;
}
