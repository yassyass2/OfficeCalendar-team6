import React, { useState, useEffect } from 'react';
import Calendar from './Calendar'; // Import the Calendar component
//import '../styles/AdminMenu.css';

interface Event {
  id: string;
  title: string;
  date: string;
  start_time: string;
  end_time: string;
  location: string;
  description: string;
}

interface Attendance{
    eventId: string;
    userId: string;
    attend_time: string
}

const UserDashboard: React.FC = () => {
  // State to manage attendances
  const [attendances, setAttendances] = useState<Attendance[]>([]);
  const [events, setEvents] = useState<Event[]>([]);
  const [currentEventIndex, setCurrentEventIndex] = useState(0);

  // State for modals
  const [showAddModal, setShowAddModal] = useState(false);
  const [showModifyModal, setShowModifyModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const [newEventData, setNewEventData] = useState<Event>({
    id: '',
    title: '',
    date: '',
    start_time: '',
    end_time: '',
    location: '',
    description: '',
  });

  const currentEvent = events[currentEventIndex];

  // Load attendances from local storage on component mount
  useEffect(() => {
    const storedattendances = localStorage.getItem('attendances');
    if (storedattendances) {
      setAttendances(JSON.parse(storedattendances));
    }
  }, []);

  // Save attendances to local storage whenever they change
  useEffect(() => {
    localStorage.setItem('attendances', JSON.stringify(attendances));
  }, [attendances]);

  // Handle navigation
  const goToNextEvent = () => {
    setCurrentEventIndex((prevIndex) => (prevIndex + 1) % attendances.length);
  };

  const goToPreviousEvent = () => {
    setCurrentEventIndex(
      (prevIndex) => (prevIndex - 1 + attendances.length) % attendances.length
    );
  };

  // Handle Attendance
  const handleAttend = () => {
    
  };

  // Handle Modify Event
  const handleInvitation = () => {

  };

  // Reset New Event Data
  const resetNewEventData = () => {
    setNewEventData({
      id: '',
      title: '',
      date: '',
      start_time: '',
      end_time: '',
      location: '',
      description: '',
    });
  };

  return (
    <div className="User-Dashboard">
      <div className="main-container">
        {/* Left Section: Calendar + Event List */}
        <div className="left-section">
          <Calendar />
          <div className="event-list">
            <h3>Upcoming events</h3>
            <ul>
              {events.map((event: Event) => (
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
              <button className="btn" onClick={() => setShowModifyModal(true)}>
                Update Event
              </button>
              <button className="btn" onClick={() => setShowDeleteModal(true)}>
                Delete Event
              </button>
            </div>
          ) : (
            <p>No event selected.</p>
          )}

          {/* Navigation Buttons */}
          <div className="event-navigation">
            <button onClick={goToPreviousEvent}>&lt; Previous</button>
            <button onClick={() => setShowAddModal(true)}>Attend Event</button>
            <button onClick={() => setShowAddModal(true)}>Invite an employee</button>
            <button onClick={goToNextEvent}>Next &gt;</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;
