using System.Text.Json;
using Microsoft.AspNetCore.Mvc;
using System.Security.Cryptography;
using Microsoft.EntityFrameworkCore;



namespace Services
{
    public interface IUserService
    {
        Task<bool> Register(UserRegisterRequest request);
        Task<bool> CheckUser(User user);
        Task<LoginResult> Login(UserLoginRequest request);
        Task<LoginResult> VerifyAccount(string token);
        Task<LoginResult> ForgotPassword(string email);
        Task<LoginResult> ResetPassword(ResetPasswordRequest request);

    }


    public class JsonUserService : IUserService
    {
        //!!!!!! //Alles in JsonUserServices moet later aangepast worden zodra de methode met de database werkt
        public Task<bool> Register(UserRegisterRequest request)
        {
            return Task.FromResult(true);

        }

        public async Task<bool> CheckUser(User user)
        {
            return true;
        }

        public async Task<LoginResult> Login(UserLoginRequest request)
        {
            return new LoginResult { Success = true, Message = "To be implemented" };
        }

        public async Task<LoginResult> VerifyAccount(string token)
        {

            return new LoginResult { Success = true, Message = "To be implemented" };
        }

        public async Task<LoginResult> ForgotPassword(string email)
        {

            return new LoginResult { Success = true, Message = "To be implemented" };
        }

        public async Task<LoginResult> ResetPassword(ResetPasswordRequest request)
        {
            return new LoginResult { Success = true, Message = "To be implemented" };
        }

    }


    public class DbUserService : IUserService
    {
        private readonly MyContext _context;

        public DbUserService(MyContext context)
        {
            _context = context;
        }


        public async Task<bool> Register(UserRegisterRequest request)
        {
            // Check if the user already exists
            if (_context.Users.Any(u => u.Email == request.Email))
            {
                return false;
            }

            // Create the password hash and salt
            CreatePasswordHash(request.Password, out byte[] passwordHash, out byte[] passwordSalt);

            // Create a new user object
            var user = new User
            {
                Email = request.Email,
                PasswordHash = passwordHash,
                PasswordSalt = passwordSalt,
                First_name = request.FirstName,
                Last_name = request.LastName,
                VerificationToken = CreateRandomToken()
            };

            // Add the user to the database
            _context.Users.Add(user);
            await _context.SaveChangesAsync();

            return true;
        }

        public async Task<LoginResult> Login(UserLoginRequest request)
        {
            var user = await _context.Users.FirstOrDefaultAsync(u => u.Email == request.Email);
            if (user == null)
            {
                return new LoginResult { Success = false, Message = "User not found" };
            }

            if (!VerifyPasswordHash(request.Password, user.PasswordHash, user.PasswordSalt))
            {
                return new LoginResult { Success = false, Message = "Password is incorrect" };
            }

            if (user.VerifiedAt == null)
            {
                return new LoginResult { Success = false, Message = "User not verified" };
            }

            return new LoginResult { Success = true, Message = "Login successful" };
        }




        public async Task<LoginResult> VerifyAccount(string token)
        {
            var user = await _context.Users.FirstOrDefaultAsync(u => u.VerificationToken == token);
            if (user == null)
            {
                return new LoginResult { Success = false, Message = "Invalid token :(" };
            }

            user.VerifiedAt = DateTime.Now;
            await _context.SaveChangesAsync();

            return new LoginResult { Success = true, Message = "Account verified! :)" };
        }

        public async Task<LoginResult> ForgotPassword(string email)
        {
            var user = await _context.Users.FirstOrDefaultAsync(u => u.Email == email);
            if (user == null)
            {
                return new LoginResult { Success = false, Message = "User not found." };
            }

            user.PasswordResetToken = CreateRandomToken();
            user.ResetTokenExpires = DateTime.Now.AddDays(1);
            await _context.SaveChangesAsync();

            return new LoginResult { Success = true, Message = "You may reset your password." };
        }

        public async Task<LoginResult> ResetPassword(ResetPasswordRequest request)
        {
            var user = await _context.Users.FirstOrDefaultAsync(u => u.PasswordResetToken == request.Token);

            if (user == null || user.ResetTokenExpires < DateTime.Now)
            {
                return new LoginResult { Success = false, Message = "Invalid token or token expired" };
            }

            CreatePasswordHash(request.Password, out byte[] passwordHash, out byte[] passwordSalt);

            user.PasswordHash = passwordHash;
            user.PasswordSalt = passwordSalt;
            user.PasswordResetToken = null;
            user.ResetTokenExpires = null;

            await _context.SaveChangesAsync();

            return new LoginResult { Success = true, Message = "Password reset completed!" };
        }




        private void CreatePasswordHash(string password, out byte[] passwordHash, out byte[] passwordSalt)
        {
            using (var hmac = new HMACSHA512())
            {
                passwordSalt = hmac.Key;
                passwordHash = hmac
                    .ComputeHash(System.Text.Encoding.UTF8.GetBytes(password));
            }
        }

        private bool VerifyPasswordHash(string password, byte[] passwordHash, byte[] passwordSalt)
        {
            using (var hmac = new HMACSHA512(passwordSalt))
            {
                var computedHash = hmac
                    .ComputeHash(System.Text.Encoding.UTF8.GetBytes(password));
                return computedHash.SequenceEqual(passwordHash);
            }
        }

        private string CreateRandomToken()
        {
            return Convert.ToHexString(RandomNumberGenerator.GetBytes(64));
        }

        public async Task<bool> CheckUser(User user)
        {
            try
            {
                // Check if the user credentials exist in the database
                var existingUser = await _context.Users
                    .FirstOrDefaultAsync(x => x.Email == user.Email && x.PasswordHash == user.PasswordHash);

                if (existingUser != null)
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
