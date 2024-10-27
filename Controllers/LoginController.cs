using Microsoft.AspNetCore.Mvc;
using Services;
using System.Security.Claims;
using System.Text;


namespace Controllers
{
    [Route("api/login")]
    [ApiController]
    public class LoginController : Controller
    {
        private readonly IAdminService _adminService;
        private readonly IUserService _userService;
        private readonly ITokenService _tokenService;
        private readonly IEmailService _emailService;

        public LoginController(IAdminService adminService, IUserService userService,
            ITokenService tokenService, IEmailService emailService)
        {
            _adminService = adminService;
            _userService = userService;
            _tokenService = tokenService;
            _emailService = emailService;
        }

        [HttpPost()]
        public async Task<IActionResult> Login([FromBody] UserLoginRequest model)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest("Invalid request format");
            }

            string token;

            // Check if the user is an admin
            if (await _adminService.CheckAdmin(new Admin(model.Email, model.Password)))
            {
                token = _tokenService.GenerateToken(model.Email, "Admin");
                HttpContext.Session.Set("JwtToken", Encoding.UTF8.GetBytes(token));
                return Ok(new { Message = $"Successfully logged in as Admin {model.Email}" });
            }

            // Check if the user is a regular user
            var loginResult = await _userService.Login(model);
            if (!loginResult.Success)
            {
                return Unauthorized(loginResult.Message);
            }

            // Generate token for regular user
            token = _tokenService.GenerateToken(model.Email, "User");

            // Store the token in session for automatic usage by middleware
            HttpContext.Session.Set("JwtToken", Encoding.UTF8.GetBytes(token));

            return Ok(new { Message = "Login successful" });
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
                return BadRequest("User registration failed. Email might already be registered.");
            }

            return Ok("Registration successful! Please check your email for the verification code.");
        }

        [HttpPost("verify")]
        public async Task<IActionResult> Verify([FromBody] VerificationRequest request)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest("Invalid verification code");
            }

            var verifyResult = await _userService.VerifyAccount(request.Code);
            if (!verifyResult.Success)
            {
                return BadRequest(verifyResult.Message);
            }

            return Ok(verifyResult.Message);
        }

        [HttpPost("forgot-password")]
        public async Task<IActionResult> ForgotPassword([FromBody] ForgotPasswordRequest request)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest("Email is required");
            }

            var result = await _userService.ForgotPassword(request.Email);

            // Always return OK to prevent email enumeration
            return Ok("If the email exists, a password reset code has been sent.");
        }

        [HttpPost("reset-password")]
        public async Task<IActionResult> ResetPassword([FromBody] ResetPasswordRequest request)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
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