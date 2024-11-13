using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Services;
using System;
using System.Threading.Tasks;

namespace Controllers
{
    [Route("api/Attendance")]
    [ApiController]
    public class AttendanceController : ControllerBase
    {
        private readonly IAttendanceService _attendanceService;

        public AttendanceController(IAttendanceService attendanceService)
        {
            _attendanceService = attendanceService;
        }

        // POST: api/Attendance/attend
        [HttpPost("attend")]
        [Authorize(Roles = "User")]
        public async Task<IActionResult> AttendEvent([FromBody] EventAttendance? request)
        {
            if (request == null) return BadRequest("No body given");
            Console.WriteLine(request.EventId);

            if (await _attendanceService.CreateAttendance(request))
            {
                return Ok("Event successfully attended.");
            }
            return NotFound("Event not found or has already started.");
        }

        // GET: api/Attendance/attendees/{eventId}
        [HttpGet("attendees")]
        [Authorize(Roles = "User")]
        public async Task<IActionResult> GetAttendees([FromQuery] Guid eventId)
        {
            var attendees = await _attendanceService.GetAttending(eventId);
            return Ok(attendees);
        }

        // DELETE: api/Attendance/attend
        [HttpDelete("attend")]
        [Authorize(Roles = "User")]
        public async Task<IActionResult> DeleteAttendance([FromBody] EventAttendance request)
        {
            return await _attendanceService.DeleteAttendance(request)
                ? Ok("Attendance successfully deleted.")
                : NotFound("Attendance doesn't exist.");
        }

        // GET: api/Attendance/view
        [HttpGet("view")]
        [Authorize(Roles = "User")]
        public async Task<IActionResult> ViewEvents(Guid userId)
        {
            if (userId == Guid.Empty)
            {
                return Unauthorized("User ID not found in session.");
            }

            var events = await _attendanceService.GetAttendedEvents(userId);
            return Ok(events);
        }
    }
}
