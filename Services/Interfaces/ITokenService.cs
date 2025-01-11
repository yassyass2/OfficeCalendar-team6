namespace Services{
    public interface ITokenService
    {
        string GenerateToken(string email, string role, Guid id);
    }
}