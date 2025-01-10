import React, { useState, useEffect } from 'react';
import { Event } from './UserDashboard';
import axiosInstance from '../axiosInstance';

interface attendee {id: string, first_name: string, last_name: string}

const InviteModal: React.FC<Event> = (props: Event) => {

    const [attendees, setAttendees] = useState<string[]>([]);
    const [loading, setLoading] = useState(false);

    const handleInvitation = async () => {
        setLoading(true);
        try {
            const response = await axiosInstance.get("/api/Attendance/attendees", {
                params: {
                    eventId: props.id
            }});
            setAttendees(response.data);

        } catch (error) {
            console.error("Error fetching attendees:", error);
        } finally {
            setLoading(false);
        }
    };

    const sendInvitation = async (attendee: string) => {
        try {
            const url = new URL("http://localhost:5000/invite");
            url.searchParams.append("ToInvite", attendee);
            url.searchParams.append("WhatEvent", props.id);

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
                            <h1 className="modal-title fs-5" id="exampleModalLabel">Invite a Coworker!</h1>
                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                            {props.id}
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
                            <button type="button" className="btn btn-primary" onClick= {() => handleInvitation()}>Show Attendees</button>
                        </div>
                    </div>
                </div>
            </div>
        </>);
}

export default InviteModal;