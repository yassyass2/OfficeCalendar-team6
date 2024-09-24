using Microsoft.AspNetCore.Mvc;
using Services;

namespace Controllers
{
    [Route("/event")]
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
            await EventStorage.ReadEvents(address);
            return Ok();
        }
    }
}