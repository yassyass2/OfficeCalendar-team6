import React, { useState, useEffect } from 'react';
import { EventData } from './UserDashboard';
import axiosInstance from '../axiosInstance';
import axios from 'axios';

interface ModalProps {
    onClose: () => void;
}

const MyEventsModal: React.FC<ModalProps> = ({ onClose }) => {
    const [loading, setLoading] = useState(false);
    const [attendances, setAttendances] = useState<string[]>([]);
    const [events, setEvents] = useState<string[]>([]);

    useEffect(() => {
        FetchAttendances();
      }, []);

    useEffect(() => {
        const fetchTitles = async () => {
            if (attendances.length > 0) {
            const titles = await Promise.all(
                attendances.map((attendance) => FetchEventTitle(attendance))
            );
            setEvents(titles);
            }
        };
        
            if (attendances.length > 0) {
            fetchTitles();
            }
        }, [attendances]);

    const FetchAttendances = async () => {
        setLoading(true);

        const response = await axiosInstance.get("/api/Attendance/view", {
            params: {
                userId: localStorage.getItem('userId')
            }
        });
        setAttendances(response.data);
    }

    const FetchEventTitle = async (attendanceId: string) => {
        try {
        setLoading(true)
          const response = await fetch(`/api/event/${attendanceId}`);
          const event = await response.json();
          return event.title;
        } catch (error) {
          console.error('Error fetching event title:', error);
          return '';
        } finally {
            setLoading(false)
        }
      };

    return (<>
        <div className="modal fade" id="attendanceModal" tabIndex={-1} aria-labelledby="attendanceModalLabel" aria-hidden="true">
            <div className="modal-dialog">
                <div className="modal-content">
                    <div className="modal-header">
                        <h1 className="modal-title fs-5" id="attendanceModalLabel">Registered Events</h1>
                        <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close" onClick={onClose}></button>
                    </div>
                    <div className="modal-body">
                        <h2>Your events</h2>

                        {loading ? (
                            <p>Getting attending events...</p>
                        ) : (
                            <div>
                                <ul>
                                    {events.map((title, index) => (
                                    <li key={index}>{title}</li>
                                    ))}
                                </ul>
                            </div>
                        )}
                    </div>
                    <div className="modal-footer">
                    <button type="button" className="btn-primary btn-primary-close" data-bs-dismiss="modal" onClick={onClose}>Close</button>
                    </div>
                </div>
            </div>
        </div>
    </>);
}

export default MyEventsModal;