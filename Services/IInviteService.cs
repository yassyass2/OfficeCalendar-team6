namespace Services
{
    public interface IInviteService
    {
        Task<bool> SendInvite(EventAttendance invite);
    }

    public class DbInviteService : IInviteService
    {
        private readonly Mycontext _context;
        public DbInviteService(Mycontext context)
        {
            _context = context;
        }

        public async Task<bool> SendInvite(EventAttendance invite)
        {
            if  await _context.Attendances.Where(a => a.EventId == invite.EventId && a.UserId == invite.UserId)
            {
                // employee already attending
                return false;
            }
            var user_to_inv = await _context.Users.Where(u => u.Id == invite.UserId)
            if (user_to_inv is null)
            {
                // employee doesn't exist
                return false;
            }
            var to_mail = user_to_inv
            // targeted employee not attending yet and exists, send invite via mail HERE\/\/\/
            return true;
        }
    }
}