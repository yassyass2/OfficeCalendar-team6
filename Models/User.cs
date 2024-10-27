public class User
{
    public Guid Id { get; set; }
    public string First_name { get; set; } = string.Empty;
    public string Last_name { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public byte[] PasswordHash { get; set; } = new byte[32];
    public byte[] PasswordSalt { get; set; } = new byte[32];
    public string? VerificationCodeHash { get; set; }  // Store hashed version
    public DateTime? VerificationCodeExpires { get; set; }
    public DateTime? VerifiedAt { get; set; }
    public string? PasswordResetCodeHash { get; set; }  // Store hashed version
    public DateTime? ResetCodeExpires { get; set; }
    public int Recurring_days { get; set; }
}