using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Services;
using System;
using System.Threading.Tasks;

namespace Controllers
{
    [Route("api/ModifyAttendance")]
    [ApiController]
    public class ModifyAttendanceController : ControllerBase
    {
        private readonly IAttendanceService _attendanceService;

        public ModifyAttendanceController(IAttendanceService attendanceService)
        {
            _attendanceService = attendanceService;
        }

        private Guid? GetUserId()
        {
            var userIdClaim = User.FindFirst("id");
            return userIdClaim != null ? Guid.Parse(userIdClaim.Value) : (Guid?)null;
        }

        // PUT: api/ModifyAttendance
        [HttpPut]
        [Authorize(Roles = "User")]
        public async Task<IActionResult> ModifyAttendance([FromQuery] Guid newEventId)
        {
            var userId = GetUserId();
            if (userId == null)
            {
                return Unauthorized("User ID not found in session.");
            }

            var result = await _attendanceService.ModifyEventAttendance(userId.Value, newEventId);
            return result ? Ok("Attendance successfully modified.") : BadRequest("Failed to modify attendance.");
        }
    }
}
