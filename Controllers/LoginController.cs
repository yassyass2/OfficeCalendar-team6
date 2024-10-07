using Microsoft.AspNetCore.Mvc;
using Services;
using Microsoft.AspNetCore.Http;

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

        // POST: Unified login for both Admin and User
        [HttpPost()]
        public async Task<IActionResult> Login([FromBody] LoginModel model)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest("Invalid request format");
            }

            // Check if the user is an admin
            if (await _adminService.CheckAdmin(new Admin(model.Username, model.Password)))
            {
                // Set session values for admin
                HttpContext.Session.SetString("IsLoggedIn", "true");
                HttpContext.Session.SetString("Username", model.Username);
                HttpContext.Session.SetString("Role", "admin");

                return Ok($"Successfully logged in as Admin {model.Username}, session registered");
            }

            // Check if the user is a regular user
            if (await _userService.CheckUser(new User(model.Username, model.Password)))
            {
                // Set session values for user
                HttpContext.Session.SetString("IsLoggedIn", "true");
                HttpContext.Session.SetString("Username", model.Username);
                HttpContext.Session.SetString("Role", "user");

                return Ok($"Successfully logged in as User {model.Username}, session registered");
            }

            // If neither, return unauthorized
            return Unauthorized("Invalid credentials.");
        }

        // GET: Check if there is an active session
        [HttpGet("session")]
        public IActionResult CheckSession()
        {
            // Check for admin session
            if (HttpContext.Session.GetString("Role") == "admin")
            {
                var adminUsername = HttpContext.Session.GetString("Username");
                return Ok(new { IsLoggedIn = true, Role = "Admin", Username = adminUsername });
            }

            // Check for user session
            if (HttpContext.Session.GetString("Role") == "user")
            {
                var username = HttpContext.Session.GetString("Username");
                return Ok(new { IsLoggedIn = true, Role = "User", Username = username });
            }

            return Ok(new { IsLoggedIn = false });
        }

        // POST: Logout and clear session
        [HttpPost("logout")]
        public IActionResult Logout()
        {
            HttpContext.Session.Clear();
            return Ok("User has been logged out.");
        }
    }

    // LoginModel to handle login data
    public class LoginModel
    {
        public string Username { get; set; }
        public string Password { get; set; }
    }
}
