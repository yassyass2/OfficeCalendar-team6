using Microsoft.AspNetCore.Mvc;

namespace Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AttendanceController : Controller
    {
        private static List<Event> _events = new List<Event>();
        private static List<EventAttendance> _attendances = new List<EventAttendance>();

        public AttendanceController()
        {
            // Example event
            if (!_events.Any())
            {
                _events.Add(new Event("Sample Event", "This is a sample event.", "2024-10-09", "14:00", "16:00", "Online"));
            }
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

            var userId = request.UserId;
            var eventId = request.EventId;

            var eventToAttend = await Task.Run(() => _events.FirstOrDefault(e => e.Id == eventId));
            if (eventToAttend == null)
            {
                return NotFound("Event not found.");
            }

            // Check event availability (based on date and start time)
            DateTime eventDate;
            DateTime eventStartTime;
            if (!DateTime.TryParse(eventToAttend.Date, out eventDate) || !DateTime.TryParse(eventToAttend.Start_time, out eventStartTime))
            {
                return BadRequest("Invalid event date or start time.");
            }

            if (eventDate < DateTime.Now || eventStartTime < DateTime.Now)
            {
                return BadRequest("The event has already started or is not available.");
            }

            // Add attendance
            await Task.Run(() => _attendances.Add(new EventAttendance { UserId = userId, EventId = eventId }));
            return Ok(eventToAttend);
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
