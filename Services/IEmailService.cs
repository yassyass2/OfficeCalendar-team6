public interface IEmailService
{
    Task<bool> SendEmail(string to, string body);
    Task<bool> SendVerificationCode(string to, string code);
    Task<bool> SendPasswordResetCode(string to, string code);
}
