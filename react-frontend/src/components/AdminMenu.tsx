import React, { useState, useEffect } from 'react';
import Calendar from './Calendar'; // Import the Calendar component
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
  // State to manage events
  const [events, setEvents] = useState<Event[]>([]);
  const [currentEventIndex, setCurrentEventIndex] = useState(0);

  // State for modals
  const [showAddModal, setShowAddModal] = useState(false);
  const [showModifyModal, setShowModifyModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  // State for the form data
  const [newEventData, setNewEventData] = useState<Event | null>(null);

  // Current event
  const currentEvent = events[currentEventIndex];

  // Load events from local storage on component mount
  useEffect(() => {
    const storedEvents = localStorage.getItem('events');
    if (storedEvents) {
      setEvents(JSON.parse(storedEvents));
    }
  }, []);

  // Save events to local storage whenever they change
  useEffect(() => {
    localStorage.setItem('events', JSON.stringify(events));
  }, [events]);

  // Sort events by date
  const sortEvents = (events: Event[]) => {
    return events.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  };

  // Handle navigation
  const goToNextEvent = () => {
    if (events.length > 0) {
      setCurrentEventIndex((prevIndex) => (prevIndex + 1) % events.length);
    }
  };

  const goToPreviousEvent = () => {
    if (events.length > 0) {
      setCurrentEventIndex(
        (prevIndex) => (prevIndex - 1 + events.length) % events.length
      );
    }
  };

  // Handle Add Event
  const handleAddEvent = () => {
    if (newEventData) {
      const newEvent = {
        ...newEventData,
        id: Date.now().toString(), // Generate unique ID
      };
      const updatedEvents = [...events, newEvent];
      setEvents(sortEvents(updatedEvents)); // Sort after adding
      setShowAddModal(false);
      resetNewEventData();
    }
  };

  // Handle Modify Event
  const handleModifyEvent = () => {
    if (newEventData && currentEvent) {
      const updatedEvents = events.map((event) =>
        event.id === currentEvent.id ? { ...event, ...newEventData } : event
      );
      setEvents(sortEvents(updatedEvents)); // Sort after modifying
      setShowModifyModal(false);
      resetNewEventData();
    }
  };

  // Handle Delete Event
  const handleDeleteEvent = () => {
    const updatedEvents = events.filter((event) => event.id !== currentEvent.id);
    setEvents(updatedEvents);

    // Adjust index to prevent out-of-bounds access
    if (currentEventIndex >= updatedEvents.length) {
      setCurrentEventIndex(Math.max(0, updatedEvents.length - 1));
    }

    setShowDeleteModal(false);
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
    <div className="admin-menu">
      <div className="main-container">
        {/* Left Section: Calendar + Event List */}
        <div className="left-section">
          <Calendar />
          <div className="event-list">
            <h3>Upcoming Events</h3>
            <ul>
              {events.map((event, index) => (
                <li
                  key={event.id}
                  onClick={() => setCurrentEventIndex(index)}
                  style={{
                    cursor: 'pointer',
                    fontWeight: currentEventIndex === index ? 'bold' : 'normal',
                  }}
                >
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
                onClick={() => {
                  setNewEventData(currentEvent);
                  setShowModifyModal(true);
                }}
              >
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
            <button
              onClick={() => {
                resetNewEventData();
                setShowAddModal(true);
              }}
            >
              Add Event
            </button>
            <button onClick={goToNextEvent}>Next &gt;</button>
          </div>
        </div>
      </div>

      {/* Modals */}
      {/* Add Event Modal */}
      {showAddModal && (
        <div className="modal">
          <div className="modal-content">
            <h3>Add Event</h3>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleAddEvent();
              }}
            >
              <label>
                Title:
                <input
                  type="text"
                  value={newEventData?.title || ''}
                  onChange={(e) =>
                    setNewEventData({ ...newEventData!, title: e.target.value })
                  }
                  required
                />
              </label>
              <label>
                Date:
                <input
                  type="date"
                  value={newEventData?.date || ''}
                  onChange={(e) =>
                    setNewEventData({ ...newEventData!, date: e.target.value })
                  }
                  required
                />
              </label>
              <label>
                Start Time:
                <input
                  type="time"
                  value={newEventData?.start_time || ''}
                  onChange={(e) =>
                    setNewEventData({ ...newEventData!, start_time: e.target.value })
                  }
                  required
                />
              </label>
              <label>
                End Time:
                <input
                  type="time"
                  value={newEventData?.end_time || ''}
                  onChange={(e) =>
                    setNewEventData({ ...newEventData!, end_time: e.target.value })
                  }
                  required
                />
              </label>
              <label>
                Location:
                <input
                  type="text"
                  value={newEventData?.location || ''}
                  onChange={(e) =>
                    setNewEventData({ ...newEventData!, location: e.target.value })
                  }
                  required
                />
              </label>
              <label>
                Description:
                <textarea
                  value={newEventData?.description || ''}
                  onChange={(e) =>
                    setNewEventData({ ...newEventData!, description: e.target.value })
                  }
                  required
                />
              </label>
              <button type="submit">Add Event</button>
              <button type="button" onClick={() => setShowAddModal(false)}>
                Close
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Modify Event Modal */}
      {showModifyModal && (
        <div className="modal">
          <div className="modal-content">
            <h3>Modify Event</h3>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleModifyEvent();
              }}
            >
              <label>
                Title:
                <input
                  type="text"
                  value={newEventData?.title || ''}
                  onChange={(e) =>
                    setNewEventData({ ...newEventData!, title: e.target.value })
                  }
                  required
                />
              </label>
              <label>
                Date:
                <input
                  type="date"
                  value={newEventData?.date || ''}
                  onChange={(e) =>
                    setNewEventData({ ...newEventData!, date: e.target.value })
                  }
                  required
                />
              </label>
              <label>
                Start Time:
                <input
                  type="time"
                  value={newEventData?.start_time || ''}
                  onChange={(e) =>
                    setNewEventData({ ...newEventData!, start_time: e.target.value })
                  }
                  required
                />
              </label>
              <label>
                End Time:
                <input
                  type="time"
                  value={newEventData?.end_time || ''}
                  onChange={(e) =>
                    setNewEventData({ ...newEventData!, end_time: e.target.value })
                  }
                  required
                />
              </label>
              <label>
                Location:
                <input
                  type="text"
                  value={newEventData?.location || ''}
                  onChange={(e) =>
                    setNewEventData({ ...newEventData!, location: e.target.value })
                  }
                  required
                />
              </label>
              <label>
                Description:
                <textarea
                  value={newEventData?.description || ''}
                  onChange={(e) =>
                    setNewEventData({ ...newEventData!, description: e.target.value })
                  }
                  required
                />
              </label>
              <button type="submit">Update Event</button>
              <button type="button" onClick={() => setShowModifyModal(false)}>
                Close
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Delete Event Modal */}
      {showDeleteModal && (
        <div className="modal">
          <div className="modal-content">
            <h3>Delete Event</h3>
            <p>Are you sure you want to delete this event?</p>
            <button onClick={handleDeleteEvent}>Yes, Delete</button>
            <button onClick={() => setShowDeleteModal(false)}>Cancel</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminMenu;