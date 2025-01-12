import React, { useState, useEffect } from 'react';
import { EventData } from './UserDashboard';
import axiosInstance from '../axiosInstance';
import { ModalProps } from './AttendanceModal'

interface attendee { id: string, first_name: string, last_name: string }

const InviteModal: React.FC<ModalProps> = ({ Event, onClose }) => {

    const [attendees, setAttendees] = useState<string[]>([]);
    const [loading, setLoading] = useState(false);
    const [currAttendee, setCurrAttendee] = useState("");

    const handleInvitation = async () => {
        setLoading(true);
        try {
            const response = await axiosInstance.get("/api/Attendance/attendees", {
                params: {
                    eventId: Event.id
                }
            });
            setAttendees(response.data);

        } catch (error) {
            console.error("Error fetching attendees:", error);
        } finally {
            setLoading(false);
        }
    };

    const sendInvitation = async (attendee: string) => {
        try {
            const response = await axiosInstance.post("/invite", {
                params: {
                    ToInvite: attendee,
                    WhatEvent: Event.id
                }
            });

            alert(response.data);
        } catch (error) {
            alert("Error sending invitation:" + error);
        }
    };

    return (
        <>
            <div className="modal fade" id="inviteModal" tabIndex={-1} aria-labelledby="inviteModalLabel" aria-hidden="true">
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h1 className="modal-title fs-5" id="inviteModalLabel">Notify a Coworker!</h1>
                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close" onClick={onClose}></button>
                        </div>
                        <div className="modal-body">
                            <h2>Notify an attendee</h2>

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
                        <div className="button-group-modal-footer">
                            <button type="button" className="btn-primary btn-primary-close" data-bs-dismiss="modal" onClick={onClose}>Close</button>
                            <button type="button" className="btn-primary">Save changes</button>
                            <button type="button" className="btn-primary" onClick={() => handleInvitation()}>Show Attendees</button>
                        </div>
                    </div>
                </div>
            </div>
        </>);
}

export default InviteModal;