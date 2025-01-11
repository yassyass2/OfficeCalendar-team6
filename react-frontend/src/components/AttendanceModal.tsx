import React, { useState, useEffect } from 'react';
import { EventData } from './UserDashboard';
import axiosInstance from '../axiosInstance';

export interface ModalProps {
    Event: EventData
    onClose: () => void;
  }

const AttendanceModal: React.FC<ModalProps> = ({ Event, onClose }) => {

    const [loading, setLoading] = useState(false);
    const [time, setTime] = useState(Event.start_time);
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
        try {
            console.log(localStorage.getItem('userId'))
            const response = await axiosInstance.post("/api/Attendance/attend", {
                UserId: localStorage.getItem('userId'),
                EventId: Event.id,
                AttendAt: selectedTime
              });
            alert(response.data)

        } catch (error) {
            console.error("Error attending event:", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <div className="modal fade" id="exampleModal" tabIndex={-1} aria-labelledby="exampleModalLabel" aria-hidden="true">
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h1 className="modal-title fs-5" id="exampleModalLabel">Attend</h1>
                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close" onClick={onClose}></button>
                            {Event.title} on {Event.date} at {Event.start_time}-{Event.end_time}
                        </div>
                        <div className="modal-body">
                            <h2>Attend this event</h2>

                            {loading ? (
                                <p>Loading attendance screen</p>
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
                            <button type="button" className="btn btn-secondary" data-bs-dismiss="modal" onClick={onClose}>Close</button>
                            <button type="button" className="btn btn-primary" onClick={() => handleAttend()}>Sign me up!</button>
                        </div>
                    </div>
                </div>
            </div>
        </>);
}

export default AttendanceModal;