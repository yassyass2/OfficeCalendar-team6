public interface IAdminService
{
    Task<bool> CheckAdmin(Admin admin); // Verifies admin credentials
}