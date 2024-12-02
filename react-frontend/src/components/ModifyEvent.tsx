import React, { useState } from 'react';

const ModifyEvent: React.FC = () => {
  // Mock list of events (replace with real API data later)
  const mockEvents = [
    { id: '1', title: 'Team Meeting', date: '2024-12-10', start_time: '10:00', end_time: '11:00', location: 'Room 1', description: 'Monthly team sync-up' },
    { id: '2', title: 'Product Demo', date: '2024-12-15', start_time: '14:00', end_time: '15:30', location: 'Room 2', description: 'Demo of the new product release' },
  ];

  // State for selected event and editable form fields
  const [selectedEventId, setSelectedEventId] = useState<string | null>(null);
  const [eventData, setEventData] = useState({
    title: '',
    description: '',
    date: '',
    start_time: '',
    end_time: '',
    location: '',
  });

  // Handle event selection
  const handleEventSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedId = e.target.value;
    setSelectedEventId(selectedId);

    // Pre-fill form fields with the selected event's details
    const event = mockEvents.find((event) => event.id === selectedId);
    if (event) {
      setEventData({
        title: event.title,
        description: event.description,
        date: event.date,
        start_time: event.start_time,
        end_time: event.end_time,
        location: event.location,
      });
    }
  };

  // Handle input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setEventData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // Handle form submission
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log('Updated Event Data:', { id: selectedEventId, ...eventData });

    // Add the backend connection here to send updated data
    alert('Event updated successfully (mocked for now)!');
  };

  return (
    <div>
      <h1>Modify Event</h1>

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

      {/* Editable Form */}
      {selectedEventId && (
        <form onSubmit={handleSubmit}>
          <label>
            Title:
            <input
              type="text"
              name="title"
              value={eventData.title}
              onChange={handleChange}
              required
            />
          </label>
          <label>
            Description:
            <textarea
              name="description"
              value={eventData.description}
              onChange={handleChange}
              required
            ></textarea>
          </label>
          <label>
            Date:
            <input
              type="date"
              name="date"
              value={eventData.date}
              onChange={handleChange}
              required
            />
          </label>
          <label>
            Start Time:
            <input
              type="time"
              name="start_time"
              value={eventData.start_time}
              onChange={handleChange}
              required
            />
          </label>
          <label>
            End Time:
            <input
              type="time"
              name="end_time"
              value={eventData.end_time}
              onChange={handleChange}
              required
            />
          </label>
          <label>
            Location:
            <input
              type="text"
              name="location"
              value={eventData.location}
              onChange={handleChange}
              required
            />
          </label>
          <button type="submit">Update Event</button>
        </form>
      )}
    </div>
  );
};

export default ModifyEvent;