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

            return Ok("User registered successfully. Please verify your account before logging in");
            //er moet hierna een email automatisch gestuurd worden om account verfication af te maken.  
        }

        [HttpPost("verify")]
        public async Task<IActionResult> Verify([FromQuery] string token)
        {
            if (string.IsNullOrEmpty(token))
            {
                return BadRequest("Token is required");
            }

            var verifyResult = await _userService.VerifyAccount(token);
            if (!verifyResult.Success)
            {
                return BadRequest(verifyResult.Message);
            }

            return Ok("Account verified! :)");
        }

        [HttpPost("forgot-password")]
        public async Task<IActionResult> ForgotPassword([FromQuery] string email)
        {
            if (string.IsNullOrEmpty(email))
            {
                return BadRequest("Email is required");
            }

            var ForgotpasswordRequest = await _userService.ForgotPassword(email);
            if (!ForgotpasswordRequest.Success)
            {
                return BadRequest(ForgotpasswordRequest.Message);
            }

            return Ok("We have sent you an email to reset your password! ");
            //na dit stap moet er een email toegestuurd worden met de token 
            //of een verwijzing naar een andere eendpoint met resetpassword opties.
        }

        [HttpPost("reset-password")]
        public async Task<IActionResult> ResetPassword([FromBody] ResetPasswordRequest request)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest("Invalid request data.");
            }

            var result = await _userService.ResetPassword(request);

            if (!result.Success)
            {
                return BadRequest(result.Message);
            }

            return Ok(result.Message);
        }

    }

}
