using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Services;

namespace Controllers
{
    [Route("events")]
    [ApiController]
    public class EventController : ControllerBase
    {
        private readonly IEventStorage _eventStorage;

        public EventController(IEventStorage eventStorage)
        {
            _eventStorage = eventStorage;
        }

        // Users can access this
        [HttpGet]
        [Authorize] // Allow any authenticated user (both admins and regular users)
        public async Task<IActionResult> GetEvents()
        {
            return Ok(await _eventStorage.ReadEvents());
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
