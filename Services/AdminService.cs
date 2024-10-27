using System.Text.Json;

namespace Services
{
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
            return admins.FirstOrDefault(_ => _.Email == admin.Email && _.Password == admin.Password) != null;
        }
    }

    public class AdminService : IAdminService
    {
        private readonly MyContext _context;

        public AdminService(MyContext context)
        {
            _context = context;
        }

        public async Task<bool> CheckAdmin(Admin admin)
        {
            try
            {
                // Check if the admin credentials exist in the database
                if (_context.Admins.FirstOrDefault(x => x.Email == admin.Email && x.Password == admin.Password) != null)
                {
                    return true;
                }
                return false;
            }
            catch
            {
                return false;
            }
        }
    }
}
