using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Services;

namespace Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ModifyAttendanceController : Controller
    {
        private readonly IEventAttendanceService _attendanceService;

        public ModifyAttendanceController(IEventAttendanceService attendanceService)
        {
            _attendanceService = attendanceService;
        }

        // PUT: api/modifyattendance/update
        [HttpPut("update")]
        [Authorize(Roles = "User")]
        public async Task<IActionResult> UpdateAttendance([FromBody] EventAttendance request)
        {
            // Call the service to modify attendance
            var result = await _attendanceService.ModifyAttendance(request);

            if (result)
            {
                return Ok("Attendance updated successfully.");
            }

            return BadRequest("Failed to update attendance. Check availability or conflicts.");
        }
    }
}
