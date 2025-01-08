import React, { useState, useEffect } from 'react';


const InviteModal: React.FC = () => {

    const [attendees, setAttendees] = useState<string[]>([]);
    const [loading, setLoading] = useState(false);

    const handleInvitation = async () => {
        setLoading(true);
        try {
            // eventId is hardcoded for now, should be based on CurrentEvent state ID
            const response = await fetch("http://localhost:5000/api/Attendance/attendees?eventId=3FA85F64-5717-4562-B3FC-2C963F66AFA6");
            const data = await response.json();
            setAttendees(data);
        } catch (error) {
            console.error("Error fetching attendees:", error);
        } finally {
            setLoading(false);
        }
    };

    const sendInvitation = async (attendee: string) => {
        try {
            const url = new URL("http://localhost:5000/invite");
            url.searchParams.append("value", attendee);
            url.searchParams.append("param", "3FA85F64-5717-4562-B3FC-2C963F66AFA6");

            await fetch(url.toString(), {
                method: "POST",
            });
            alert(`Invitation sent to ${attendee}`);
        } catch (error) {
            console.error("Error sending invitation:", error);
        }
    };

    return (
        <>
            <div className="modal fade" id="exampleModal" tabIndex={-1} aria-labelledby="exampleModalLabel" aria-hidden="true">
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h1 className="modal-title fs-5" id="exampleModalLabel">Modal title</h1>
                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"
                                onClick= {() => handleInvitation()}>
                            </button>
                        </div>
                        <div className="modal-body">
                            <h2>Invite an Employee</h2>

                            {loading ? (
                                <p>Loading attendees...</p>
                            ) : (
                                <ul>
                                    {attendees.map((attendee, index) => (
                                        <li key={index}>
                                            <button onClick={() => sendInvitation(attendee)}>{attendee}</button>
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                            <button type="button" className="btn btn-primary">Save changes</button>
                        </div>
                    </div>
                </div>
            </div>
        </>);
}

export default InviteModal;