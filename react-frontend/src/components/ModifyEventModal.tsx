import React, { useState } from 'react';
import axiosInstance from '../axiosInstance'; // Import axiosInstance
import { EventData } from './AdminMenu'; // Ensure correct import path for EventData

interface ModifyEventModalProps {
    event: EventData;
    onClose: () => void;
    onModifyEvent: (updatedEvent: EventData) => void;
}

const ModifyEventModal: React.FC<ModifyEventModalProps> = ({ event, onClose, onModifyEvent }) => {
    const [loading, setLoading] = useState(false);
    const [updatedEventData, setUpdatedEventData] = useState<EventData>(event);

    // Handle input changes
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setUpdatedEventData((prev: EventData) => ({ ...prev, [name]: value }));
    };

    // Handle modifying the event
    const handleModifyEvent = async () => {
        setLoading(true);
        try {
            const response = await axiosInstance.put(`/api/events/${event.id}`, updatedEventData); // PUT request
            if (response.status === 200) {
                onModifyEvent(response.data); // Notify parent with updated event
                alert('Event modified successfully!');
                onClose();
            } else {
                console.warn('Unexpected response:', response);
            }
        } catch (error) {
            console.error('Error modifying event:', error);
            alert('Failed to modify event.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="modal fade" id="modifyEventModal" tabIndex={-1} aria-labelledby="modifyEventModalLabel" aria-hidden="true">
            <div className="modal-dialog">
                <div className="modal-content">
                    <div className="modal-header">
                        <h1 className="modal-title fs-5" id="modifyEventModalLabel">Modify Event</h1>
                        <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close" onClick={onClose}></button>
                    </div>
                    <div className="modal-body">
                        <form>
                            <label>Title:
                                <input
                                    type="text"
                                    name="title"
                                    value={updatedEventData.title}
                                    onChange={handleInputChange}
                                    required
                                />
                            </label>
                            <label>Description:
                                <textarea
                                    name="description"
                                    value={updatedEventData.description}
                                    onChange={handleInputChange}
                                    required
                                />
                            </label>
                            <label>Date:
                                <input
                                    type="date"
                                    name="date"
                                    value={updatedEventData.date}
                                    onChange={handleInputChange}
                                    required
                                />
                            </label>
                            <label>Start Time:
                                <input
                                    type="time"
                                    name="start_time"
                                    value={updatedEventData.start_time}
                                    onChange={handleInputChange}
                                    required
                                />
                            </label>
                            <label>End Time:
                                <input
                                    type="time"
                                    name="end_time"
                                    value={updatedEventData.end_time}
                                    onChange={handleInputChange}
                                    required
                                />
                            </label>
                            <label>Location:
                                <input
                                    type="text"
                                    name="location"
                                    value={updatedEventData.location}
                                    onChange={handleInputChange}
                                    required
                                />
                            </label>
                        </form>
                    </div>
                    <div className="modal-footer">
                        <button type="button" className="btn btn-secondary" data-bs-dismiss="modal" onClick={onClose}>Close</button>
                        <button type="button" className="btn btn-primary" onClick={handleModifyEvent} disabled={loading}>
                            {loading ? 'Saving...' : 'Save Changes'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ModifyEventModal;
