namespace Services
{
    public class InviteService : IInviteService
    {
        private readonly MyContext _context;
        public InviteService(MyContext context)
        {
            _context = context;
        }

        public bool SendInvitation(Guid To, Guid Ev)
        {
            var user_to_inv = _context.Users.ToList();
            var evs = _context.Events.ToList();
            if (user_to_inv.FirstOrDefault(u => u.Id == To) == null || evs.FirstOrDefault(e => e.Id == Ev) == null)
            {
                // employee or event doesn't exist
                return false;
            }
            // targeted employee not attending yet and exists, they should see invite in their account
            return true;
        }
    }
}