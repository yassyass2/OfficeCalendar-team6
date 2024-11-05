using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Services;
using System;
using System.Threading.Tasks;

namespace Controllers
{
    [Route("api/Attendance")]
    [ApiController]
    public class AttendanceController : Controller
    {
        private readonly IAttendanceService _attendanceService;

        public AttendanceController(IAttendanceService attendanceService)
        {
            _attendanceService = attendanceService;
        }

        private Guid? GetUserId()
        {
            var userIdClaim = User.FindFirst("id");
            return userIdClaim != null ? Guid.Parse(userIdClaim.Value) : (Guid?)null;
        }

        // POST: api/Attendance/attend
        [HttpPost("attend")]
        [Authorize(Roles = "User")]
        public async Task<IActionResult> AttendEvent([FromBody] EventAttendance? request)
        {
            if (request == null) return BadRequest("No body given");
            Console.WriteLine(request.EventId);

            var userId = GetUserId();
            if (userId == null)
            {
                return Unauthorized("User ID not found in session.");
            }

            request.UserId = userId.Value;
            if (await _attendanceService.CreateAttendance(request))
            {
                return Ok("Event successfully attended.");
            }
            return NotFound("Event not found or has already started.");
        }

        // PUT: api/Attendance/modify
        [HttpPut("modify")]
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

        // GET: api/Attendance/attendees/{eventId}
        [HttpGet("attendees/{eventId}")]
        [Authorize(Roles = "User")]
        public async Task<IActionResult> GetAttendees([FromRoute] Guid eventId)
        {
            var attendees = await _attendanceService.GetAttending(eventId);
            return Ok(attendees);
        }

        // DELETE: api/Attendance/attend
        [HttpDelete("attend")]
        [Authorize(Roles = "User")]
        public async Task<IActionResult> DeleteAttendance([FromBody] EventAttendance request)
        {
            var userId = GetUserId();
            if (userId == null)
            {
                return Unauthorized("User ID not found in session.");
            }

            request.UserId = userId.Value;
            return await _attendanceService.DeleteAttendance(request)
                ? Ok("Attendance successfully deleted.")
                : NotFound("Attendance doesn't exist.");
        }

        // GET: api/Attendance/view
        [HttpGet("view")]
        [Authorize(Roles = "User")]
        public async Task<IActionResult> ViewEvents()
        {
            var userId = GetUserId();
            if (userId == null)
            {
                return Unauthorized("User ID not found in session.");
            }

            var events = await _attendanceService.GetAttendedEvents(userId.Value);
            return Ok(events);
        }
    }
}
