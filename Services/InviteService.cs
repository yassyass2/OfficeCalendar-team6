namespace Services
{
    

    public class InviteService : IInviteService
    {
        private readonly MyContext _context;
        public InviteService(MyContext context)
        {
            _context = context;
        }

        public bool SendInvitation(EventAttendance invite)
        {
            if  ( _context.Attendances.FirstOrDefault(a => a.EventId == invite.EventId && a.UserId == invite.UserId) != null )
            {
                // employee already attending
                return false;
            }
            var user_to_inv = _context.Users.FirstOrDefault(u => u.Id == invite.UserId);
            if (user_to_inv is null || _context.Events.FirstOrDefault(e => e.Id == invite.EventId) == null)
            {
                // employee or event doesn't exist
                return false;
            }
            var to_mail = user_to_inv;
            // targeted employee not attending yet and exists, they should see invite in their account
            return true;
        }
    }
}