import React, { useState, useEffect } from 'react';
import { EventData } from './UserDashboard';
import axiosInstance from '../axiosInstance';
import axios from 'axios';

export interface ModalProps {
    Event: EventData
    onClose: () => void;
}

const AttendanceModal: React.FC<ModalProps> = ({ Event, onClose }) => {

    const [loading, setLoading] = useState(false);
    const [selectedTime, setSelectedTime] = React.useState<string>(Event.start_time);

    const generateTimeOptions = (start: string, end: string): string[] => {
        const options: string[] = [];
        const [startHours, startMinutes] = start.split(":").map(Number);
        const [endHours, endMinutes] = end.split(":").map(Number);

        let currentTime = new Date();
        currentTime.setHours(startHours, startMinutes, 0, 0);

        const endTime = new Date();
        endTime.setHours(endHours, endMinutes, 0, 0);

        while (currentTime <= endTime) {
            const timeString = currentTime
                .toTimeString()
                .slice(0, 5); // HH:MM
            options.push(timeString);

            currentTime.setMinutes(currentTime.getMinutes() + 10);
        }

        return options;
    };

    // Handle Attendance
    const handleAttend = async () => {
        setLoading(true);
        const userId = localStorage.getItem('userId');
        const payload = {
            UserId: userId,
            EventId: Event.id,
            AttendAt: selectedTime,
        };
        try {
            console.log("Sending payload:", payload);
            const response = await axiosInstance.post("/api/Attendance/attend", payload);
    
            if (response.status === 200) {
                alert(`Attendance recorded successfully: ${response.data}`);
            } else {
                console.warn("Unexpected response:", response);
            }
        } catch (error) {
            if (axios.isAxiosError(error)) {
                console.error("API Error:", error.response?.data || error.message);
                alert(`Error: ${error.response?.data || "Failed to attend event"}`);
            } else {
                console.error("Unexpected Error:", error);
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <div className="modal fade" id="attendanceModal" tabIndex={-1} aria-labelledby="attendanceModalLabel" aria-hidden="true">
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h1 className="modal-title fs-5" id="attendanceModalLabel">Attend</h1>
                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close" onClick={onClose}></button>
                            {Event.title} on {Event.date} at {Event.start_time}-{Event.end_time}
                        </div>
                        <div className="modal-body">
                            <h2>Attend this event</h2>

                            {loading ? (
                                <p>Creating attendance...</p>
                            ) : (
                                <>
                                    <label htmlFor="time-select">Select a time to attend:</label>
                                    <select id="time-select" onChange={(e) => setSelectedTime(e.target.value)}>
                                        {generateTimeOptions(Event.start_time, Event.end_time).map((time) => (
                                            <option key={time} value={time}>
                                                {time}
                                            </option>
                                        ))}
                                    </select>
                                </>
                            )}
                        </div>
                        <div className="modal-footer">
                        <button type="button" className="btn-primary btn-primary-close" data-bs-dismiss="modal" onClick={onClose}>Close</button>
                        <button type="button" className="btn-primary" onClick={handleAttend}>Sign me up!</button>
                        </div>
                    </div>
                </div>
            </div>
        </>);
}

export default AttendanceModal;