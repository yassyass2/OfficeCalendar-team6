using Microsoft.AspNetCore.Mvc;
using Services;

namespace Controllers
{
    [Route("api/login")]
    public class LoginController : Controller
    {
        private readonly IAdminService _adminService;
        private readonly IUserService userService;

        public LoginController(IAdminService adminService)
        {
            _adminService = adminService;
        }

        [HttpPost()]
        public async Task<IActionResult> AdminLogin([FromBody] Admin admin)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest("Invalid request format");
            }
            if (await _adminService.CheckAdmin(admin))
            {
                return Ok($"succesfully logged in as Admin {admin.Username}, session registered");
            }
            return Unauthorized("Invalid username or password.");
        }

        [HttpGet("session")]
        public async Task<IActionResult> CheckSession()
        {
            if (_adminService.ActiveSession(out string adminUsername))
            {
                return Ok(new { IsLoggedIn = true, AdminUsername = adminUsername });
            }

            return Ok(new { IsLoggedIn = false });
        }
    }
}