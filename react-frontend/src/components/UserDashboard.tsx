import React, { useState, useEffect } from 'react';
import axiosInstance from '../axiosInstance';

import Calendar from './Calendar';
import SidePanel from './SidePanel';
import InviteModal from './InviteModal';
import AttendanceModal from './AttendanceModal';

export interface EventData {
  id: string;
  title: string;
  description: string;
  date: string;
  start_time: string;
  end_time: string;
  location: string;
}

const UserDashboard: React.FC = () => {
  const [eventData, setEventData] = useState<EventData[]>([]);
  const [selectedEvent, setSelectedEvent] = useState<EventData | null>(null);

  const [inviteScreen, setInviteModal] = useState(false);
  const [attendanceScreen, setAttendanceModal] = useState(false);

  const [loading, setLoading] = useState(false);

  const fetchEventData = async () => {
    setLoading(true);
    try {
      const response = await axiosInstance.get('/events');
      setEventData(response.data);
    } catch (error) {
      console.error('Error fetching events: ', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEventData();
  }, []);

  const handleEventClick = (event: EventData) => {
    setSelectedEvent(event);
  };

  const handleModalClose = () => {
    setAttendanceModal(false);
    setInviteModal(false);
  };

  const [currentEventIndex, setCurrentEventIndex] = useState(0);
  const [currentEvent, setCurrentEvent] = useState<EventData>(eventData[currentEventIndex]);

  const goToNextEvent = () => {
    setCurrentEventIndex((prevIndex) => {
      const nextIndex = Math.min(prevIndex + 1, eventData.length - 1);
      setSelectedEvent(eventData[nextIndex]);
      return nextIndex;
    });
  };

  const goToPreviousEvent = () => {
    setCurrentEventIndex((prevIndex) => {
      const prevIndexUpdated = Math.max(prevIndex - 1, 0);
      setSelectedEvent(eventData[prevIndexUpdated]);
      return prevIndexUpdated;
    });
  };

  return (
    <section className="row">
      <div className="row">
        <div className="col-4">
          <Calendar />
          <div className="event-list-container">
            {loading ? (
              <p>Loading...</p>
            ) : (
              eventData.map((event) => (
                <div
                  key={event.id}
                  className="event clickable"
                  onClick={() => handleEventClick(event)}
                >
                  <span className="event-title">{event.title}</span>
                  <p className="event-description">
                    {event.description.length > 125
                      ? `${event.description.slice(0, 125)}...`
                      : event.description}
                  </p>
                </div>
              ))
            )}
          </div>
        </div>
        <div className="col-1">
          <div className="divider-horizontal g-0"></div>
        </div>
        <div className="col-7 g-0">
          <SidePanel
            selectedEvent={selectedEvent}
            openModal1={() => setInviteModal(true)}
            openModal2={() => setAttendanceModal(true)}
            openModal3 ={() => undefined}
            goToNextEvent={goToNextEvent}
            goToPreviousEvent={goToPreviousEvent}
            isAdmin={false}
          />
        </div>
      </div>

      {selectedEvent && (
        <AttendanceModal
          Event={selectedEvent}
          onClose={handleModalClose}
        />)}

      {selectedEvent && (
        <InviteModal
          Event={selectedEvent}
          onClose={handleModalClose} />)}
    </section>
  );
};

export default UserDashboard;
