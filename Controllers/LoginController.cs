using Microsoft.AspNetCore.Mvc;
using Services;

namespace Controllers
{
    [Route("login")]
    public class LoginController : Controller
    {
        private readonly IAdminService adminService;
        private readonly IUserService userService;

        public LoginController(IAdminService adminService)
        {
            this.adminService = adminService;
        }

        [HttpPost()]
        public async Task<IActionResult> AdminLogin([FromBody] Admin admin)
        {
            if (await adminService.CheckAdmin(admin))
            {
                return Ok($"succesfully logged in as {admin.Username}");
            }
            return Unauthorized("Invalid username or password.");
        }
    }
}