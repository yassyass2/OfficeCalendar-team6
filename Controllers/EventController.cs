using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Services;
using Filters;

namespace Controllers
{
    [Route("events")]
    [ApiController]
    [ServiceFilter(typeof(NotificationFilter))]
    public class EventController : ControllerBase
    {
        private readonly IEventStorage _eventStorage;
        private readonly IAttendanceService _att;
        private readonly IEmailService _mail;
        private readonly IUserService _user;

        public EventController(IEventStorage eventStorage, IAttendanceService attendanceService, IEmailService mail, IUserService u)
        {
            _eventStorage = eventStorage;
            _att = attendanceService;
            _mail = mail;
            _user = u;
        }

        // Users can access this
        [HttpGet]
        [Authorize] // Allow any authenticated user (both admins and regular users)
        public async Task<IActionResult> GetEvents()
        {
            return Ok(await _eventStorage.ReadEvents());
        }

        [HttpGet("{eventId}")]
        [Authorize] // Allow any authenticated user (both admins and regular users)
        public async Task<IActionResult> GetEvent([FromRoute] Guid eventId)
        {
            if (eventId == Guid.Empty) return BadRequest("No valid Guid was given");
            var ev = await _eventStorage.OneEvent(eventId);
            if (ev == null) return BadRequest("No such event exists");
            return Ok(ev);
        }

        // Only Admins can create/delete/update events
        [HttpPost]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> CreateEvent([FromBody] Event e)
        {
            await _eventStorage.CreateEvent(e);
            return Ok("Event has been created");
        }

        [HttpDelete("{Event_Id}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> DeleteEvent([FromRoute] Guid Event_Id)
        {
            return await _eventStorage.DeleteEvent(Event_Id) ? Ok($"Event with id {Event_Id} deleted") : NotFound("Event with that Id doesn't exist.");
        }

        [HttpPut("{Event_Id}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> UpdateEvent([FromRoute] Guid Event_Id, [FromBody] Event e)
        {
            return await _eventStorage.Put(Event_Id, e) ? Ok($"Event with id {Event_Id} updated") : NotFound("Event with that Id doesn't exist.");
        }
    }
}
