using System.Text.Json;
using Microsoft.AspNetCore.Mvc;
using System.Security.Cryptography;
using Microsoft.EntityFrameworkCore;
using System.Text;


namespace Services
{
    public class JsonUserService : IUserService
    {
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


    public class UserService : IUserService
    {
        private readonly MyContext _context;
        private readonly IEmailService _emailService;

        public UserService(MyContext context, IEmailService emailService)
        {
            _context = context;
            _emailService = emailService;
        }

        private string GenerateVerificationCode()
        {
            // Generate a random 6-digit number
            Random random = new Random();
            return random.Next(100000, 999999).ToString();
        }

        private string HashVerificationCode(string code)
        {
            using (var sha256 = SHA256.Create())
            {
                var hashedBytes = sha256.ComputeHash(Encoding.UTF8.GetBytes(code));
                return Convert.ToBase64String(hashedBytes);
            }
        }


        public async Task<bool> Register(UserRegisterRequest request)
        {
            if (_context.Users.Any(u => u.Email == request.Email))
            {
                return false;
            }

            CreatePasswordHash(request.Password, out byte[] passwordHash, out byte[] passwordSalt);

            // Generate verification code
            var verificationCode = GenerateVerificationCode();
            var hashedCode = HashVerificationCode(verificationCode);

            var user = new User
            {
                Email = request.Email,
                PasswordHash = passwordHash,
                PasswordSalt = passwordSalt,
                First_name = request.FirstName,
                Last_name = request.LastName,
                VerificationCodeHash = hashedCode,
                VerificationCodeExpires = DateTime.UtcNow.AddMinutes(15)
            };

            _context.Users.Add(user);
            await _context.SaveChangesAsync();

            // Send verification email
            try
            {
                await _emailService.SendVerificationCode(request.Email, verificationCode);
                return true;
            }
            catch (Exception)
            {
                // If email fails, delete the user and return false
                _context.Users.Remove(user);
                await _context.SaveChangesAsync();
                return false;
            }
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




        public async Task<LoginResult> VerifyAccount(string code)
        {
            var hashedInputCode = HashVerificationCode(code);

            var user = await _context.Users.FirstOrDefaultAsync(u =>
                u.VerificationCodeHash == hashedInputCode &&
                u.VerificationCodeExpires > DateTime.UtcNow);

            if (user == null)
            {
                // Add a small delay to prevent timing attacks
                await Task.Delay(Random.Shared.Next(100, 250));
                return new LoginResult { Success = false, Message = "Invalid or expired verification code" };
            }

            user.VerifiedAt = DateTime.UtcNow;
            user.VerificationCodeHash = null;
            user.VerificationCodeExpires = null;
            await _context.SaveChangesAsync();

            return new LoginResult { Success = true, Message = "Account verified successfully!" };
        }

        public async Task<LoginResult> ForgotPassword(string email)
        {
            var user = await _context.Users.FirstOrDefaultAsync(u => u.Email == email);
            if (user == null)
            {
                await Task.Delay(Random.Shared.Next(100, 250));
                return new LoginResult { Success = false, Message = "If the email exists, a reset code has been sent." };
            }

            var resetCode = GenerateVerificationCode();
            user.PasswordResetCodeHash = HashVerificationCode(resetCode);
            user.ResetCodeExpires = DateTime.UtcNow.AddMinutes(15);

            try
            {
                await _emailService.SendPasswordResetCode(email, resetCode);
                await _context.SaveChangesAsync();
                return new LoginResult { Success = true, Message = "If the email exists, a reset code has been sent." };
            }
            catch
            {
                return new LoginResult { Success = false, Message = "Failed to send reset code." };
            }
        }

        public async Task<LoginResult> ResetPassword(ResetPasswordRequest request)
        {
            var hashedInputCode = HashVerificationCode(request.Code);

            var user = await _context.Users.FirstOrDefaultAsync(u =>
                u.PasswordResetCodeHash == hashedInputCode &&
                u.ResetCodeExpires > DateTime.UtcNow);

            if (user == null)
            {
                // Add a small delay to prevent timing attacks
                await Task.Delay(Random.Shared.Next(100, 250));
                return new LoginResult { Success = false, Message = "Invalid or expired reset code" };
            }

            CreatePasswordHash(request.Password, out byte[] passwordHash, out byte[] passwordSalt);

            user.PasswordHash = passwordHash;
            user.PasswordSalt = passwordSalt;
            user.PasswordResetCodeHash = null;
            user.ResetCodeExpires = null;

            await _context.SaveChangesAsync();

            return new LoginResult { Success = true, Message = "Password successfully reset!" };
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
