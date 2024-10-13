using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using Services; // Ensure you have the attendance service implemented
using System.Security.Claims;

namespace Controllers
{
    [Route("api/officeattendance")]
    [ApiController]
    public class OfficeAttendanceController : ControllerBase
    {
        private readonly IAttendanceService _attendanceService;

        public OfficeAttendanceController(IAttendanceService attendanceService)
        {
            _attendanceService = attendanceService;
        }

        // PUT: api/officeattendance
        [HttpPut]
        [Authorize] // Protect this endpoint
        public async Task<IActionResult> ModifyAttendance([FromBody] OfficeAttendanceRequest request)
        {
            var userIdClaim = HttpContext.User.FindFirst(ClaimTypes.Name)?.Value;
            if (string.IsNullOrEmpty(userIdClaim))
            {
                return Unauthorized("User is not logged in.");
            }

            Guid userId = Guid.Parse(userIdClaim); // Adjust based on how you store user IDs

            // Check for existing attendance
            var existingAttendance = await _attendanceService.GetAttendance(userId, request.Date);
            if (existingAttendance != null)
            {
                return BadRequest("Attendance for this date is already booked.");
            }

            // Modify attendance
            bool result = await _attendanceService.ModifyAttendance(userId, request);
            if (result)
            {
                return Ok("Attendance modified successfully.");
            }

            return BadRequest("Failed to modify attendance.");
        }
    }
}
