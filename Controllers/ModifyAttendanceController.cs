using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Services;
using System;
using System.Threading.Tasks;

namespace Controllers
{
    [Route("api/att")]
    [ApiController]
    public class OfficeAttendanceController : ControllerBase
    {
        private readonly IAttendanceService _attendanceService;

        public OfficeAttendanceController(IAttendanceService attendanceService)
        {
            _attendanceService = attendanceService;
        }

        // POST: api/office/attend
        [HttpPost("attend")]
        [Authorize(Roles = "User")]
        public async Task<IActionResult> AttendEvent([FromBody] EventAttendance request)
        {
            if (await _attendanceService.CreateAttendance(request))
            {
                return Ok("Event successfully attended.");
            }
            return BadRequest("Event not found, has already started, or is fully booked.");
        }

        // GET: api/office/attendees/{eventId}
        [HttpGet("attendees/{eventId}")]
        [Authorize(Roles = "User")]
        public async Task<IActionResult> GetAttendees([FromRoute] Guid eventId)
        {
            var attendees = await _attendanceService.GetAttending(eventId);
            return Ok(attendees);
        }

        // DELETE: api/office/attend
        [HttpDelete("attend")]
        [Authorize(Roles = "User")]
        public async Task<IActionResult> DeleteAttendance([FromBody] EventAttendance request)
        {
            var result = await _attendanceService.DeleteAttendance(request);
            return result ? Ok("Attendance successfully deleted.") : NotFound("Attendance not found.");
        }

        // PUT: api/office/attendance
        [HttpPut("modify")]
        [Authorize(Roles = "User")]
        public async Task<IActionResult> ModifyAttendance([FromBody] EventAttendance request)
        {
            var userId = User.FindFirst("id")?.Value; // Assumes the user ID is stored in the claims
            if (userId == null || !Guid.TryParse(userId, out Guid parsedUserId) || request.UserId != parsedUserId)
            {
                return Unauthorized("You can only modify your own attendance.");
            }

            var result = await _attendanceService.ModifyAttendance(request);
            if (result.Item1)
            {
                return Ok("Attendance successfully modified.");
            }

            return BadRequest(result.Item2); // Return the error message from the service
        }
    }
}
