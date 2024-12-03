import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

const ModifyEvent: React.FC = () => {
  const { eventId } = useParams<{ eventId: string }>();
  const [eventData, setEventData] = useState({
    title: '',
    description: '',
    date: '',
    start_time: '',
    end_time: '',
    location: '',
  });

  useEffect(() => {
    // Mock event data fetching (replace with API call)
    const mockEvents = [
      { id: '1', title: 'Team Meeting', date: '2024-12-10', start_time: '10:00', end_time: '11:00', location: 'Room 1', description: 'Monthly team sync-up' },
      { id: '2', title: 'Product Demo', date: '2024-12-15', start_time: '14:00', end_time: '15:30', location: 'Room 2', description: 'Demo of the new product release' },
    ];
    const event = mockEvents.find((e) => e.id === eventId);
    if (event) {
      setEventData(event);
    }
  }, [eventId]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setEventData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log('Updated Event Data:', { id: eventId, ...eventData });
    alert('Event updated successfully!');
  };

  return (
    <div>
      <h1>Modify Event</h1>
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
    </div>
  );
};

export default ModifyEvent;
