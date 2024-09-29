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

        [HttpGet()]
        public async Task<IActionResult> GetEvents()
        {
            return Ok(await EventStorage.ReadEvents());
        }

        [HttpPost()]
        public async Task<IActionResult> CreateEvent([FromBody] Event e)
        {
            //nog bezig met dit
            /*
            if (!HttpContext.Session.GetString("IsAdmin", out var isAdmin) || isAdmin != "true")
            {
                return Unauthorized("Admin session is required.");
            }
            */
            // checken voor valid body
            await EventStorage.CreateEvent(e);
            return Ok("Event has been created");
        }

        [HttpDelete("{Event_Id}")]
        public async Task<IActionResult> DeleteEvent([FromRoute] Guid Event_Id)
        {
            return await EventStorage.DeleteEvent(Event_Id) ? Ok($"Event with id {Event_Id} deleted") : NotFound("Event with that Id doesn't exist.");
        }

        [HttpPut("{Event_Id}")]
        public async Task<IActionResult> PutEvent([FromRoute] Guid Event_Id, [FromBody] Event e)
        {
            return await EventStorage.Put(Event_Id, e) ? Ok($"Event with id {Event_Id} updated") : NotFound("Event with that Id doesn't exist.");
        }
    }
}