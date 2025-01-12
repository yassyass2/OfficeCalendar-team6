import React, { useState, useEffect } from 'react';
import Calendar from './Calendar';
import SidePanel from './SidePanel';
import '../scss/pages/_admin-panel.scss';

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
  const [events, setEvents] = useState<Event[]>([]);
  const [currentEventIndex, setCurrentEventIndex] = useState<number>(0);
  const [showAddModal, setShowAddModal] = useState(false);

  useEffect(() => {
    // Load mock data or fetch from backend later
    const mockEvents = [
      {
        id: '1',
        title: 'Team Meeting',
        date: '2024-12-10',
        start_time: '10:00',
        end_time: '11:00',
        location: 'Room 1',
        description: 'Monthly team sync-up.',
      },
      {
        id: '2',
        title: 'Product Demo',
        date: '2024-12-15',
        start_time: '14:00',
        end_time: '15:30',
        location: 'Room 2',
        description: 'Demo of the new product release.',
      },
    ];
    setEvents(mockEvents);
  }, []);

  const currentEvent = events[currentEventIndex];

  const goToNextEvent = () => {
    setCurrentEventIndex((prevIndex) => (prevIndex + 1) % events.length);
  };

  const goToPreviousEvent = () => {
    setCurrentEventIndex(
      (prevIndex) => (prevIndex - 1 + events.length) % events.length
    );
  };

  const openAddEventModal = () => {
    setShowAddModal(true);
  };

  const closeAddEventModal = () => {
    setShowAddModal(false);
  };

  return (
    <div className="admin-panel">
      <div className="row">
        {/* Left Section: Calendar + Event List */}
        <div className="col-md-4 left-section">
          <Calendar />
          <div className="event-list">
            <h3>Upcoming Events</h3>
            <ul>
              {events.map((event) => (
                <li key={event.id}>
                  <strong>{event.title}</strong> - {event.date}, {event.start_time} to {event.end_time}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Right Section: Current Event Details */}
        <div className="col-md-8 right-section">
          <SidePanel
            openInviteModal={() => console.log('Invite modal placeholder')}
          />

          {/* Navigation Buttons */}
          <div className="event-navigation">
            <button className="btn btn-secondary" onClick={goToPreviousEvent}>
              &lt; Previous
            </button>
            <button className="btn btn-primary" onClick={openAddEventModal}>
              Add Event
            </button>
            <button className="btn btn-secondary" onClick={goToNextEvent}>
              Next &gt;
            </button>
          </div>
        </div>
      </div>

      {/* Add Event Modal */}
      {showAddModal && (
        <div className="modal">
          <div className="modal-content">
            <h3>Add Event</h3>
            {/* Placeholder for Add Event Form */}
            <form onSubmit={(e) => e.preventDefault()}>
              <label>Title: <input type="text" /></label>
              <label>Date: <input type="date" /></label>
              <label>Start Time: <input type="time" /></label>
              <label>End Time: <input type="time" /></label>
              <label>Location: <input type="text" /></label>
              <label>Description: <textarea /></label>
              <button type="submit" className="btn btn-primary">Submit</button>
              <button type="button" className="btn btn-secondary" onClick={closeAddEventModal}>Close</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminMenu;
