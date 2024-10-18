using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using Services; // Ensure you have the attendance service implemented
using System.Security.Claims;

namespace Controllers
{
    [Route("api/modifyattendance")]
    [ApiController]
    public class ModifyAttendanceController : ControllerBase
    {
        private readonly IAttendanceService _attendanceService;

        public ModifyAttendanceController(IAttendanceService attendanceService)
        {
            _attendanceService = attendanceService;
        }

        // PUT: api/officeattendance
        [HttpPut]
        [Authorize] // Protect this endpoint
        public async Task<IActionResult> ModifyAttendance([FromBody] EventAttendance request)
        {
            var userIdClaim = HttpContext.User.FindFirst(ClaimTypes.Name)?.Value;
            if (string.IsNullOrEmpty(userIdClaim))
            {
                return Unauthorized("User is not logged in.");
            }

            //Guid userId = Guid.Parse(userIdClaim); // Adjust based on how you store user IDs

            // Check for existing attendance
            var notExistingAttendance = await _attendanceService.CheckAttendance(request.UserId, request.EventId);
            if (notExistingAttendance)
            {
                return BadRequest("can't modify, not attending yet");
            }

            // Modify attendance
            bool result = await _attendanceService.ModifyAttendance(request);
            if (result)
            {
                return Ok("Attendance modified successfully.");
            }

            return BadRequest("Failed to modify attendance.");
        }
    }
}
