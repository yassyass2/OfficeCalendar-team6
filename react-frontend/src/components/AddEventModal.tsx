import React, { useState } from 'react';
import axiosInstance from '../axiosInstance';

interface Props {
  onClose: () => void;
  onAddEvent: (newEvent: any) => void;
}

const AddEventModal: React.FC<Props> = ({ onClose, onAddEvent }) => {
  const [eventData, setEventData] = useState({
    title: '',
    description: '',
    date: '',
    start_time: '',
    end_time: '',
    location: '',
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setEventData((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddEvent = async () => {
    setLoading(true);
    try {
        const response = await axiosInstance.post('/api/events', eventData); // POST request to add a new event
        if (response.status === 201) {
            onAddEvent(response.data); // Update state in AdminMenu
            alert('Event added successfully!');
            onClose();
        } else {
            console.warn('Unexpected response:', response);
        }
    } catch (error) {
        console.error('Error adding event:', error);
        alert('Failed to add event.');
    } finally {
        setLoading(false);
    }
};

  return (
    <div className="modal">
      <div className="modal-content">
        <h3>Add Event</h3>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleAddEvent();
          }}
        >
          <label>Title: <input type="text" name="title" value={eventData.title} onChange={handleChange} required /></label>
          <label>Description: <textarea name="description" value={eventData.description} onChange={handleChange} required /></label>
          <label>Date: <input type="date" name="date" value={eventData.date} onChange={handleChange} required /></label>
          <label>Start Time: <input type="time" name="start_time" value={eventData.start_time} onChange={handleChange} required /></label>
          <label>End Time: <input type="time" name="end_time" value={eventData.end_time} onChange={handleChange} required /></label>
          <label>Location: <input type="text" name="location" value={eventData.location} onChange={handleChange} required /></label>
          <button type="submit" disabled={loading}>Add Event</button>
          <button type="button" onClick={onClose}>Close</button>
        </form>
      </div>
    </div>
  );
};

export default AddEventModal;
