import React, { useState } from 'react';
import Calendar from './Calendar'; // Import the Calendar component
import { useNavigate } from 'react-router-dom';
import '../styles/AdminMenu.css';

interface Event {
  id: string;
  title: string;
  date: string;
  start_time: string;
  end_time: string;
  location: string;
  description: string;
}

const AdminMenu: React.FC = () => {
  const navigate = useNavigate();

  // Mock events for now
  const mockEvents: Event[] = [
    {
      id: '1',
      title: 'Team Meeting',
      date: '2024-12-10',
      start_time: '10:00',
      end_time: '11:00',
      location: 'Room 1',
      description:
        'Join us for the monthly team sync-up where we discuss project updates, address challenges, and plan for upcoming tasks.',
    },
    {
      id: '2',
      title: 'Product Demo',
      date: '2024-12-15',
      start_time: '14:00',
      end_time: '15:30',
      location: 'Room 2',
      description:
        'Demo of the new product release with insights from the development team.',
    },
  ];

  const [currentEventIndex, setCurrentEventIndex] = useState(0);
  const currentEvent = mockEvents[currentEventIndex];

  const goToNextEvent = () => {
    setCurrentEventIndex((prevIndex) => (prevIndex + 1) % mockEvents.length);
  };

  const goToPreviousEvent = () => {
    setCurrentEventIndex(
      (prevIndex) => (prevIndex - 1 + mockEvents.length) % mockEvents.length
    );
  };

  return (
    <div className="admin-menu">
      <div className="main-container">
        {/* Left Section: Calendar + Event List */}
        <div className="left-section">
          <Calendar />
          <div className="event-list">
            <h3>Upcoming Events</h3>
            <ul>
              {mockEvents.map((event) => (
                <li key={event.id}>
                  <strong>{event.title}</strong> - {event.date}, {event.start_time} to{' '}
                  {event.end_time}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Right Section: Current Event Details */}
        <div className="right-section">
          <h3>Current Event</h3>
          {currentEvent ? (
            <div className="event-details">
              <h4>{currentEvent.title}</h4>
              <p>{currentEvent.description}</p>
              <p>
                <strong>Date:</strong> {currentEvent.date}
              </p>
              <p>
                <strong>Time:</strong> {currentEvent.start_time} - {currentEvent.end_time}
              </p>
              <p>
                <strong>Location:</strong> {currentEvent.location}
              </p>
              <button
                className="btn"
                onClick={() => navigate(`/admin/modify/${currentEvent.id}`)}
              >
                Update Event
              </button>
              <button
                className="btn"
                onClick={() => navigate(`/admin/delete/${currentEvent.id}`)}
              >
                Delete Event
              </button>
            </div>
          ) : (
            <p>No event selected.</p>
          )}

          {/* Navigation Buttons */}
          <div className="event-navigation">
            <button onClick={goToPreviousEvent}>&lt; Previous</button>
            <button onClick={() => navigate('/admin/add')}>Add Event</button>
            <button onClick={goToNextEvent}>Next &gt;</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminMenu;
