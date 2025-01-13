import React, { useState } from 'react';
import axiosInstance from '../axiosInstance';

interface Props {
  event: any;
  onClose: () => void;
  onDeleteEvent: (eventId: string) => void;
}

const DeleteEventModal: React.FC<Props> = ({ event, onClose, onDeleteEvent }) => {
  const [loading, setLoading] = useState(false);

  const handleDeleteEvent = async () => {
    setLoading(true);
    try {
        const response = await axiosInstance.delete(`/api/events/${event.id}`); // DELETE request with event ID
        if (response.status === 200) {
            onDeleteEvent(event.id); // Update state in AdminMenu
            alert('Event deleted successfully!');
            onClose();
        } else {
            console.warn('Unexpected response:', response);
        }
    } catch (error) {
        console.error('Error deleting event:', error);
        alert('Failed to delete event.');
    } finally {
        setLoading(false);
    }
};

  return (
    <div className="modal">
      <div className="modal-content">
        <h3>Delete Event</h3>
        <p>Are you sure you want to delete the event "{event.title}"?</p>
        <button onClick={handleDeleteEvent} disabled={loading}>Yes, Delete</button>
        <button onClick={onClose}>Cancel</button>
      </div>
    </div>
  );
};

export default DeleteEventModal;
