using Microsoft.AspNetCore.Mvc;
using Services;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace Controllers
{
    [Route("api/login")]
    public class LoginController : Controller
    {
        private readonly IAdminService _adminService;
        private readonly IUserService _userService;

        public LoginController(IAdminService adminService, IUserService userService)
        {
            _adminService = adminService;
            _userService = userService;
        }

        // POST: Unified login for both Admin and User with JWT token generation
        [HttpPost()]
        public async Task<IActionResult> Login([FromBody] LoginModel model)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest("Invalid request format");
            }

            // JWT token creation logic
            var tokenHandler = new JwtSecurityTokenHandler();
            var key = Encoding.ASCII.GetBytes("12345"); // Use the same secret key as in Program.cs

            // Check if the user is an admin
            if (await _adminService.CheckAdmin(new Admin(model.Username, model.Password)))
            {
                // Create claims for the admin
                var tokenDescriptor = new SecurityTokenDescriptor
                {
                    Subject = new ClaimsIdentity(new[]
                    {
                        new Claim(ClaimTypes.Name, model.Username),
                        new Claim(ClaimTypes.Role, "admin")
                    }),
                    Expires = DateTime.UtcNow.AddHours(1),
                    SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256Signature)
                };

                var token = tokenHandler.CreateToken(tokenDescriptor);
                var tokenString = tokenHandler.WriteToken(token);

                return Ok(new { Token = tokenString, Message = $"Successfully logged in as Admin {model.Username}" });
            }

            // Check if the user is a regular user
            if (await _userService.CheckUser(new User(model.Username, model.Password)))
            {
                // Create claims for the user
                var tokenDescriptor = new SecurityTokenDescriptor
                {
                    Subject = new ClaimsIdentity(new[]
                    {
                        new Claim(ClaimTypes.Name, model.Username),
                        new Claim(ClaimTypes.Role, "user")
                    }),
                    Expires = DateTime.UtcNow.AddHours(1),
                    SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256Signature)
                };

                var token = tokenHandler.CreateToken(tokenDescriptor);
                var tokenString = tokenHandler.WriteToken(token);

                return Ok(new { Token = tokenString, Message = $"Successfully logged in as User {model.Username}" });
            }

            // If neither, return unauthorized
            return Unauthorized("Invalid credentials.");
        }

        // GET: Check if there is an active session (JWT token check)
        [HttpGet("session")]
        public IActionResult CheckSession()
        {
            var role = User.FindFirst(ClaimTypes.Role)?.Value;
            var username = User.FindFirst(ClaimTypes.Name)?.Value;

            if (role == "admin")
            {
                return Ok(new { IsLoggedIn = true, Role = "Admin", Username = username });
            }
            else if (role == "user")
            {
                return Ok(new { IsLoggedIn = true, Role = "User", Username = username });
            }

            return Ok(new { IsLoggedIn = false });
        }

        // POST: ni echt nodig van jwt gebruikt geen session 
        [HttpPost("logout")]
        public IActionResult Logout()
        {
            return Ok("User has been logged out (JWT does not use sessions).");
        }
    }

    // LoginModel to handle login data
    public class LoginModel
    {
        public string Username { get; set; }
        public string Password { get; set; }
    }
}
