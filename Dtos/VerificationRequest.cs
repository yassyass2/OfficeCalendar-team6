using System.ComponentModel.DataAnnotations;

public class VerificationRequest
{
    [Required]
    [StringLength(6, MinimumLength = 6, ErrorMessage = "Verification code must be 6 digits")]
    [RegularExpression(@"^\d{6}$", ErrorMessage = "Please enter a valid 6-digit code")]
    public string Code { get; set; } = string.Empty;
}