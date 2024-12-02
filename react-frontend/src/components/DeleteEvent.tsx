import React, { useState } from 'react';
import axios from 'axios';

const DeleteEvent: React.FC = () => {
  // Mock list of events (replace with API data later)
  const mockEvents = [
    { id: '1', title: 'Team Meeting' },
    { id: '2', title: 'Product Demo' },
  ];

  // State to track selected event
  const [selectedEventId, setSelectedEventId] = useState<string | null>(null);

  // State to hold feedback messages
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Handle event selection
  const handleEventSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedEventId(e.target.value);
  };

  // Handle delete button click
  const handleDelete = async () => {
    if (!selectedEventId) {
      setError('Please select an event to delete.');
      return;
    }

    setMessage(null);
    setError(null);

    try {
      // Replace with your API endpoint
      await axios.delete(`http://localhost:5000/api/events/${selectedEventId}`);
      setMessage('Event deleted successfully!');
      setSelectedEventId(null); // Reset selection
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        setError(err.response?.data?.message || 'Failed to delete event.');
      } else {
        setError('An unexpected error occurred.');
      }
    }
  };

  return (
    <div>
      <h1>Delete Event</h1>

      {/* Event Selection */}
      <label>
        Select Event:
        <select value={selectedEventId || ''} onChange={handleEventSelect}>
          <option value="" disabled>
            -- Select an Event --
          </option>
          {mockEvents.map((event) => (
            <option key={event.id} value={event.id}>
              {event.title}
            </option>
          ))}
        </select>
      </label>

      {/* Delete Button */}
      <button onClick={handleDelete} disabled={!selectedEventId}>
        Delete Event
      </button>

      {/* Feedback Messages */}
      {message && <p style={{ color: 'green' }}>{message}</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  );
};

export default DeleteEvent;