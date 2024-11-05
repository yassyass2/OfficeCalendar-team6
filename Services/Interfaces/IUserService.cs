namespace Services{
    public interface IUserService
    {
        Task<bool> Register(UserRegisterRequest request);
        Task<bool> CheckUser(User user);
        Task<LoginResult> Login(UserLoginRequest request);
        Task<LoginResult> VerifyAccount(string token);
        Task<LoginResult> ForgotPassword(string email);
        Task<LoginResult> ResetPassword(ResetPasswordRequest request);
        Task<string> GetEmail(Guid id);
    }
}