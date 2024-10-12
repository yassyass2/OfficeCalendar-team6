using System.Text.Json;

namespace Services
{
    public interface IAdminService
    {
        Task<bool> CheckAdmin(Admin admin); // Verifies admin credentials
    }

    public class JsonAdminService : IAdminService
    {
        public async Task<bool> CheckAdmin(Admin admin)
        {
            string path = $"Data/admins.json";
            List<Admin> admins = new List<Admin>();

            // Load admins from the JSON file
            if (File.Exists(path))
            {
                admins = JsonSerializer.Deserialize<List<Admin>>(await File.ReadAllTextAsync(path));
            }


            // Check if the provided credentials match any admin in the list
            return admins.FirstOrDefault(_ => _.Username == admin.Username && _.Password == admin.Password) != null;
        }
    }

    public class DbAdminService : IAdminService
    {
        private readonly MyContext _context;

        public DbAdminService(MyContext context)
        {
            _context = context;
        }

        public async Task<bool> CheckAdmin(Admin admin)
        {
            try
            {
                // Check if the admin credentials exist in the database
                if (_context.Admins.FirstOrDefault(x => x.Username == admin.Username && x.Password == admin.Password) != null)
                {
                    return true; // Return true if the credentials are valid
                }
                return false; // Return false if the credentials are invalid
            }
            catch
            {
                return false; // Return false if any exception occurs
            }
        }
    }
}
