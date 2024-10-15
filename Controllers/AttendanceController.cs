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
        public async Task<IActionResult> AttendEvent([FromBody] EventAttendance request)
        {
            // Check if the user is a "user" from the session
            if (HttpContext.Session.GetString("Role") != "user")
            {
                return Unauthorized("Only logged-in users can attend events.");
            }

            if (await _attendanceService.CreateAttendance(request))
            {
                return Ok("event succesfully attended");
            }
            return NotFound("Event not found or has already started");
        }

        // GET: api/event/attendees
        [HttpGet("attendees")]
        public async Task<IActionResult> GetAttendees()
        {
            // Check if the user is a "user" from the session
            if (HttpContext.Session.GetString("Role") != "user")
            {
                return Unauthorized("Only logged-in users can view attendees.");
            }

            var attendees = await Task.Run(() =>
            {
                return _attendances
                    .GroupBy(a => a.EventId)
                    .Select(group => new
                    {
                        EventId = group.Key,
                        Attendees = group.Select(a => a.UserId).ToList()
                    });
            });

            return Ok(attendees);
        }

        // DELETE: api/event/attend
        [HttpDelete("attend")]
        public async Task<IActionResult> DeleteAttendance([FromBody] EventAttendance request)
        {
            // Check if the user is a "user" from the session
            if (HttpContext.Session.GetString("Role") != "user")
            {
                return Unauthorized("Only logged-in users can delete attendance.");
            }

            var attendance = await Task.Run(() =>
                _attendances.FirstOrDefault(a => a.UserId == request.UserId && a.EventId == request.EventId)
            );

            if (attendance == null)
            {
                return NotFound("No attendance found for the given user and event.");
            }

            await Task.Run(() => _attendances.Remove(attendance));
            return Ok("Attendance deleted successfully.");
        }
    }
}
