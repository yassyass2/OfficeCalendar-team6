using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Services;

namespace Controllers
{
    [Route("invite")]
    [ApiController]
    public class InviteController : Controller
    {
        private readonly IInviteService _invitation;
        private readonly IEmailService _mail;
        private readonly IUserService _user;
        public InviteController(IInviteService invitationService, IEmailService emailService, IUserService u)
        {
            _invitation = invitationService;
            _mail = emailService;
            _user = u;
        }

        [HttpPost()]
        [Authorize(Roles = "User,Admin")]
        public async Task<IActionResult> SendInvite(Guid ToInvite, Guid WhatEvent)
        {
            if (ToInvite == Guid.Empty || WhatEvent == Guid.Empty) return BadRequest("traget Id or Event Id not given");
            if (!_invitation.SendInvitation(ToInvite, WhatEvent)) return NotFound("employee or Event do not exist");

            var mail = await _user.GetEmail(ToInvite);
            await _mail.SendEmail(mail, $"You have been invited to event {WhatEvent}! log in to see details");
            return Ok("Invitation to the Event has been sent");
        }
    }
}