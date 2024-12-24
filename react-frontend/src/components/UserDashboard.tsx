import React, { useState, useEffect } from 'react';
import Calendar from './Calendar'; // Import the Calendar component

interface Event {
  id: string;
  title: string;
  date: string;
  start_time: string;
  end_time: string;
  location: string;
  description: string;
}

interface Attendance {
  eventId: string;
  userId: string;
  attend_time: string
}

const UserDashboard: React.FC = () => {
  // State to manage attendances
  const [attendances, setAttendances] = useState<Attendance[]>([]);
  const [events, setEvents] = useState<Event[]>([
    { id: "1", title: "Meeting met HR - U wordt ontslagen L + ratio", date: "01-01-2025", start_time: "09:00", end_time: "10:00", location: "Rotterdam", description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce vitae dui id turpis venenatis ultrices vel sed urna." },
    { id: "2", title: "Eindejaarsborrel #5 - 2014", date: "01-01-2025", start_time: "11:00", end_time: "13:00", location: "Utrecht", description: "Integer at quam eu tellus tempor tempor. Curabitur malesuada ipsum ullamcorper blandit posuere. Aliquam dictum lacinia." },
    { id: "3", title: "Eindejaarsborrel #6", date: "01-01-2025", start_time: "11:00", end_time: "13:00", location: "Utrecht", description: "Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Sed dignissim hendrerit." },
    { id: "4", title: "Weekly stand-up van Jeanine en Alex", date: "01-01-2025", start_time: "11:00", end_time: "13:00", location: "Utrecht", description: "Nunc pulvinar diam ut enim mattis laoreet. Donec sollicitudin laoreet tellus, sed sodales velit." }
  ]);
  const [currentEventIndex, setCurrentEventIndex] = useState(0);

  // State for modals
  const [attendanceModal, setAttendanceModal] = useState(false);
  const [inviteModal, setInviteModal] = useState(false);

  const [newEventData, setNewEventData] = useState<Event>({
    id: '',
    title: '',
    date: '',
    start_time: '',
    end_time: '',
    location: '',
    description: '',
  });

  const [currentEvent, setCurrentEvent] = useState<Event>(events[currentEventIndex]);

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
    setCurrentEventIndex((prevIndex) => Math.min(prevIndex + 1, events.length - 1));
    console.log(currentEventIndex)
    setCurrentEvent(() => events[currentEventIndex])
  };

  const goToPreviousEvent = () => {
    setCurrentEventIndex(
      (prevIndex) => Math.max(prevIndex - 1, 0));
    setCurrentEvent(() => events[currentEventIndex])
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
    <section className="row">
      <Calendar />
      <div className="row">
        <div className="col-4 g-0">

          {/* Left Section: Event List */}
          <div className="event-list-container">
            {events.map((event: Event) => (
              <div className="event" key={event.id}>
                <span className="event-title">{event.title}</span>
                <p className="event-description">
                  {event.description}
                  {/* <br />
                  {event.date}, {event.start_time} to{' '}
                  {event.end_time} */}
                </p>
              </div>
            ))}
          </div>

          {/* Right Section: Current Event Details */}
          {/* --- VERVANG ONDERSRAANDE MET SidePanel.tsx --- */}
          <div className="right-section">
            <h3>Current Event</h3>
            {(
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
              </div>
            )}
            {/* --------- */}

            {/* Navigation Buttons */}
            <div className="event-navigation">
              <button className="prev-btn" onClick={goToPreviousEvent}><i className="fa-solid fa-chevron-left"></i></button>
              <button onClick={() => setAttendanceModal(true)}>Attend Event</button>
              <button onClick={() => setInviteModal(true)}>Invite an employee</button>
              <button className="next-btn" onClick={goToNextEvent}><i className="fa-solid fa-chevron-right"></i></button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default UserDashboard;
