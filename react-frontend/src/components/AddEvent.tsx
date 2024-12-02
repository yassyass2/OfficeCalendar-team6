import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const AddEvent: React.FC = () => {
  const navigate = useNavigate();

  const [eventData, setEventData] = useState({
    title: '',
    description: '',
    date: '',
    start_time: '',
    end_time: '',
    location: '',
  });

  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setEventData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setMessage(null);
    setError(null);

    try {
      const response = await axios.post('http://localhost:5000/api/events', {
        ...eventData,
        admin_approval: false,
      });

      setMessage('Event added successfully!');
      setTimeout(() => {
        navigate('/admin');
      }, 2000);
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        setError(err.response?.data?.message || 'Failed to add event.');
      } else {
        setError('An unexpected error occurred.');
      }
    }
  };

  return (
    <div>
      <h1>Add New Event</h1>
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
        <button type="submit">Add Event</button>
      </form>

      {message && <p>{message}</p>}
      {error && <p>{error}</p>}
    </div>
  );
};

export default AddEvent;