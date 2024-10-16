using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Services;
using SQLitePCL;

namespace Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AttendanceController : Controller
    {
        private readonly IAttendanceService _attendanceService;
        public AttendanceController(IAttendanceService attendanceService)
        {
            _attendanceService = attendanceService;
        }

        // POST: api/event/attend
        [HttpPost("attend")]
        // Check if the user is a "user" from the session
        [Authorize(Roles = "User")]
        public async Task<IActionResult> AttendEvent([FromBody] EventAttendance request)
        {
            if (await _attendanceService.CreateAttendance(request))
            {
                return Ok("event succesfully attended");
            }
            return NotFound("Event not found or has already started");
        }

        // GET: api/event/attendees
        [HttpGet("attendees")]
        // Check if the user is a "user" using token
        [Authorize(Roles = "User")]
        public async Task<IActionResult> GetAttendees([FromRoute] Guid Event_id)
        {
            var attendees = await _attendanceService.GetAttending(Event_id);
            return Ok(attendees);
        }

        // DELETE: api/event/attend
        [HttpDelete("attend")]
        [Authorize(Roles = "User")]
        public async Task<IActionResult> DeleteAttendance([FromBody] EventAttendance request)
        {
            return await _attendanceService.DeleteAttendance(request) ? Ok("Attenance deleted succesfully.") : NotFound("Attendance doesn't exist");
        }
    }
}
