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

        public LoginController(IAdminService adminService, IUserService userService,
            ITokenService tokenService)
        {
            _adminService = adminService;
            _userService = userService;
            _tokenService = tokenService;
        }

        [HttpPost()]
        public async Task<IActionResult> Login([FromBody] UserLoginRequest model)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest("Invalid request format");
            }

            // 1. Validate user credentials (either admin or regular user)
            if (await _adminService.CheckAdmin(new Admin { Email = model.Email, Password = model.Password }))
            {
                // 2. Generate Admin token
                var token = _tokenService.GenerateToken(model.Email, "Admin");

                // 3. Return token in JSON
                return Ok(new
                {
                    Message = $"Successfully logged in as Admin {model.Email}",
                    Token = token
                });
            }

            // 2. Check normal user
            var loginResult = await _userService.Login(model);
            if (!loginResult.Success)
            {
                return Unauthorized(loginResult.Message);
            }

            // Generate user token
            var userToken = _tokenService.GenerateToken(model.Email, "User");

            return Ok(new
            {
                Message = "Login successful",
                Token = userToken
            });
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