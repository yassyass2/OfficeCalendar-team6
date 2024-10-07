using Microsoft.AspNetCore.Mvc;
using Services;

namespace Controllers
{
    [Route("events")]
    public class EventController : Controller
    {
        private readonly IEventStorage EventStorage;

        public EventController(IEventStorage eventStorage)
        {
            EventStorage = eventStorage;
        }

        // Users can access this
        [HttpGet]
        public async Task<IActionResult> GetEvents()
        {
            return Ok(await EventStorage.ReadEvents());
        }

        // Only Admins can create events
        [HttpPost]
        public async Task<IActionResult> CreateEvent([FromBody] Event e)
        {
            // Check if the user is an admin from the session
            if (HttpContext.Session.GetString("Role") != "admin")
            {
                return Unauthorized("Only admins can create events.");
            }

            await EventStorage.CreateEvent(e);
            return Ok("Event has been created");
        }

        // Only Admins can delete events
        [HttpDelete("{Event_Id}")]
        public async Task<IActionResult> DeleteEvent([FromRoute] Guid Event_Id)
        {
            // Check if the user is an admin from the session
            if (HttpContext.Session.GetString("Role") != "admin")
            {
                return Unauthorized("Only admins can delete events.");
            }

            return await EventStorage.DeleteEvent(Event_Id) ? Ok($"Event with id {Event_Id} deleted") : NotFound("Event with that Id doesn't exist.");
        }

        // Only Admins can update events
        [HttpPut("{Event_Id}")]
        public async Task<IActionResult> UpdateEvent([FromRoute] Guid Event_Id, [FromBody] Event e)
        {
            // Check if the user is an admin from the session
            if (HttpContext.Session.GetString("Role") != "admin")
            {
                return Unauthorized("Only admins can update events.");
            }

            return await EventStorage.Put(Event_Id, e) ? Ok($"Event with id {Event_Id} updated") : NotFound("Event with that Id doesn't exist.");
        }
    }
}
