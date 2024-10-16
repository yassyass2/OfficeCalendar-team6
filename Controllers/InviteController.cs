using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Services;

namespace Controllers
{
    public class InviteController : Controller
    {
        private readonly InvitationService _invitation
        [Route("invite")]
        [ApiController]
        public InvitationController(InvitationService invitationService)
        {
            _invitation = invitationService;
        }

        [HttpPost()]
        public Task<IActionResult>([FromBody] EventAttendance invitation)
        {
            if (invitation == null)
            {
                return BadRequest("");
            }
            if (!await _invitation.SendInvitation(inivitation))
            {
                return NotFound("Employee already attending or not found")
            }
            return Ok("Invitation to the Event has been sent");
        }
    }
}