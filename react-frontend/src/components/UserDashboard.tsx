import React, { useState, useEffect } from 'react';
import axiosInstance from '../axiosInstance';

import Calendar from './Calendar';
import SidePanel from './SidePanel';
import InviteModal from './InviteModal';

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
            openInviteModal={() => setInviteModal(true)}
            openAttendanceModal={() => setAttendanceModal(true)}
          />
        </div>
      </div>

      {inviteScreen && selectedEvent && (
        <InviteModal
          id={selectedEvent.id}
          title={selectedEvent.title}
          description={selectedEvent.description}
          date={selectedEvent.date}
          start_time={selectedEvent.start_time}
          end_time={selectedEvent.end_time}
          location={selectedEvent.location}
        />
      )}
    </section>
  );
};

export default UserDashboard;
