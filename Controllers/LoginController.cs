using Microsoft.AspNetCore.Mvc;
using Services;
using System.Security.Claims;

namespace Controllers
{
    [Route("api/login")]
    [ApiController]
    public class LoginController : Controller
    {
        private readonly IAdminService _adminService;
        private readonly IUserService _userService;
        private readonly ITokenService _tokenService;

        public LoginController(IAdminService adminService, IUserService userService, ITokenService tokenService)
        {
            _adminService = adminService;
            _userService = userService;
            _tokenService = tokenService;

        }


        // POST: login for both Admin and User with JWT
        [HttpPost()]
        public async Task<IActionResult> Login([FromBody] UserLoginRequest model)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest("Invalid request format");
            }

            // Check if the user is an admin
            if (await _adminService.CheckAdmin(new Admin(model.Email, model.Password)))
            {
                // Generate a token for the admin
                var adminToken = _tokenService.GenerateToken(model.Email, "Admin");
                return Ok(new { Token = adminToken, Message = $"Successfully logged in as Admin {model.Email}" });
            }

            // Check if the user is a regular user
            var loginResult = await _userService.Login(model);
            if (!loginResult.Success)
            {
                return Unauthorized(loginResult.Message);
            }

            // Generate a token for the regular user
            var userToken = _tokenService.GenerateToken(model.Email, "User");
            return Ok(new { Token = userToken, Message = "Login successful" });
        }


        // GET: Check if there is an active session (JWT token check)
        [HttpGet("session")]
        public IActionResult CheckSession()
        {
            var role = User.FindFirst(ClaimTypes.Role)?.Value;
            var username = User.FindFirst(ClaimTypes.Name)?.Value;

            if (role == "Admin")
            {
                return Ok(new { IsLoggedIn = true, Role = "Admin", Username = username });
            }
            else if (role == "User")
            {
                return Ok(new { IsLoggedIn = true, Role = "User", Username = username });
            }

            return Ok(new { IsLoggedIn = false });
        }


        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] UserRegisterRequest request)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest("Invalid registration data.");
            }

            var result = await _userService.Register(request);

            if (!result)
            {
                return BadRequest("User already exists.");
            }

            return Ok("User registered successfully.");
        }

        [HttpPost("verify")]
        public async Task<IActionResult> Verify([FromQuery] string token)
        {
            if (string.IsNullOrEmpty(token))
            {
                return BadRequest("Token is required");
            }

            var verifyResult = await _userService.Verify(token);
            if (!verifyResult.Success)
            {
                return BadRequest(verifyResult.Message);
            }

            return Ok("User verified! :)");
        }

    }

}
