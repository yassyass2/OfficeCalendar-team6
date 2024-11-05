namespace Services{
    public interface IInviteService
    {
        bool SendInvitation(Guid To, Guid Ev);
    }
}