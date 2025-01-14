import React, { useState, useEffect } from 'react';
import axiosInstance from '../axiosInstance';

import Calendar from './Calendar';
import SidePanel from './SidePanel';
import AddEventModal from './AddEventModal';
import ModifyEventModal from './ModifyEventModal';
import DeleteEventModal from './DeleteEventModal';

export interface EventData {
  id: string;
  title: string;
  description: string;
  date: string;
  start_time: string;
  end_time: string;
  location: string;
}

const AdminMenu: React.FC = () => {
  const [eventData, setEventData] = useState<EventData[]>([]);
  const [selectedEvent, setSelectedEvent] = useState<EventData | null>(null);

  // Controls which modal is open
  const [addEventModal, setAddEventModal] = useState(false);
  const [modifyEventModal, setModifyEventModal] = useState(false);
  const [deleteEventModal, setDeleteEventModal] = useState(false);

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
    setAddEventModal(false);
    setModifyEventModal(false);
    setDeleteEventModal(false);
  };

  // --- Issue #2 (ModifyEvent) & #3 (Re-fetch) fixes below ---
  const handleAddEvent = async (newEvent: EventData) => {
    try {
      await axiosInstance.post('/events', newEvent);
      // Re-fetch so the frontend data stays in sync
      await fetchEventData();
    } catch (error) {
      console.error('Error adding event:', error);
    }
  };

  const handleModifyEvent = async (updatedEvent: EventData) => {
    try {
      // Split the date string that looks like "yyyy-mm-dd"
      const [year, month, day] = updatedEvent.date.split('-');
  
      // Turn it into "dd/mm/yyyy" format
      const convertedDate = `${day}/${month}/${year}`;
  
      // 3. Update the event to match badkend format
      const eventToSend = {
        ...updatedEvent,
        date: convertedDate
      };
  
      // 4. Now send `eventToSend` instead of `updatedEvent`
      await axiosInstance.put(`/events/${updatedEvent.id}`, eventToSend);
  
      await fetchEventData();
    } catch (error) {
      console.error('Error modifying event:', error);
    }
  };  

  const handleDeleteEvent = async (eventId: string) => {
    try {
      await axiosInstance.delete(`/events/${eventId}`);
      // Re-fetch so the frontend data stays in sync
      await fetchEventData();
      setSelectedEvent(null);
    } catch (error) {
      console.error('Error deleting event:', error);
    }
  };

  // Basic “Next/Previous” navigation for selectedEvent
  const goToNextEvent = () => {
    if (selectedEvent && eventData.length) {
      const currentIndex = eventData.findIndex((e) => e.id === selectedEvent.id);
      const nextIndex = (currentIndex + 1) % eventData.length;
      setSelectedEvent(eventData[nextIndex]);
    }
  };

  const goToPreviousEvent = () => {
    if (selectedEvent && eventData.length) {
      const currentIndex = eventData.findIndex((e) => e.id === selectedEvent.id);
      const prevIndex = (currentIndex - 1 + eventData.length) % eventData.length;
      setSelectedEvent(eventData[prevIndex]);
    }
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
            openModal1={() => setAddEventModal(true)}
            openModal2={() => setModifyEventModal(true)}
            openModal3={() => setDeleteEventModal(true)}
            goToNextEvent={goToNextEvent}
            goToPreviousEvent={goToPreviousEvent}
            isAdmin={true}
          />
        </div>
      </div>

      {(selectedEvent &&
        <AddEventModal
          onClose={handleModalClose}
          onAddEvent={handleAddEvent}
        />
      )}

      {(selectedEvent && <ModifyEventModal
        event={selectedEvent}
        onClose={handleModalClose}
        onModifyEvent={handleModifyEvent}
      />)}

      {(selectedEvent && <DeleteEventModal
        event={selectedEvent}
        onClose={handleModalClose}
        onDeleteEvent={handleDeleteEvent}
      />)}
    </section>
  );
};

export default AdminMenu;
