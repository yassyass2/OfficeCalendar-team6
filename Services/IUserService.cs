using System.Text.Json;

namespace Services
{
    public interface IUserService
    {
        Task<bool> CheckUser(User user); // Verifies user credentials
    }

    public class JsonUserService : IUserService
    {
        public async Task<bool> CheckUser(User user)
        {
            string path = $"Data/users.json";
            List<User> users = new List<User>();

            // Load users from the JSON file
            if (File.Exists(path))
            {
                users = JsonSerializer.Deserialize<List<User>>(await File.ReadAllTextAsync(path));
            }

            // Check if the user exists in the file
            return users.FirstOrDefault(_ => _.Email == user.Email && _.Password == user.Password) != null;
        }
    }

    public class DbUserService : IUserService
    {
        private readonly MyContext _context;

        public DbUserService(MyContext context)
        {
            _context = context;
        }

        public async Task<bool> CheckUser(User user)
        {
            try
            {
                // Check if the user credentials exist in the database
                var dbUser = _context.Users.FirstOrDefault(x => x.Email == user.Email && x.Password == user.Password);
                if (dbUser != null)
                {
                    return true; // Return true if the credentials are valid
                }
                return false; // Return false if the credentials are invalid
            }
            catch (Exception ex)
            {
                // Log the error (if logging is set up)
                Console.WriteLine("Error checking user credentials: " + ex.Message);
                return false; // Return false if any exception occurs
            }
        }
    }
}
