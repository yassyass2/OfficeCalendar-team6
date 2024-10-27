using System.ComponentModel.DataAnnotations;

public class ResetPasswordRequest
{
    [Required]
    [StringLength(6, MinimumLength = 6, ErrorMessage = "Verification code must be 6 digits")]
    [RegularExpression(@"^\d{6}$", ErrorMessage = "Please enter a valid 6-digit code")]
    public string Code { get; set; } = string.Empty;

    [Required]
    [MinLength(6, ErrorMessage = "Please enter at least 6 characters!")]
    public string Password { get; set; } = string.Empty;

    [Required]
    [Compare("Password", ErrorMessage = "Passwords do not match")]
    public string ConfirmPassword { get; set; } = string.Empty;
}