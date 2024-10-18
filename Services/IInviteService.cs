namespace Services
{
    public interface IInviteService
    {
        bool SendInvitation(EventAttendance invite);
    }

    public class DbInviteService : IInviteService
    {
        private readonly MyContext _context;
        public DbInviteService(MyContext context)
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
            if (user_to_inv is null)
            {
                // employee doesn't exist
                return false;
            }
            var to_mail = user_to_inv;
            // targeted employee not attending yet and exists, send invite via mail HERE\/\/\/
            return true;
        }
    }
}