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

  const handleAddEvent = async (newEvent: EventData) => {
    try {
      const response = await axiosInstance.post('/events', newEvent);
      setEventData([...eventData, response.data]);
    } catch (error) {
      console.error('Error adding event:', error);
    }
  };

  const handleModifyEvent = async (updatedEvent: EventData) => {
    try {
      const response = await axiosInstance.put(`/events/${updatedEvent.id}`, updatedEvent);
      setEventData((prev) =>
        prev.map((event) => (event.id === updatedEvent.id ? response.data : event))
      );
    } catch (error) {
      console.error('Error modifying event:', error);
    }
  };

  const handleDeleteEvent = async (eventId: string) => {
    try {
      await axiosInstance.delete(`/events/${eventId}`);
      setEventData((prev) => prev.filter((event) => event.id !== eventId));
      setSelectedEvent(null);
    } catch (error) {
      console.error('Error deleting event:', error);
    }
  };

  const goToNextEvent = () => {
    if (selectedEvent) {
      const currentIndex = eventData.findIndex((e) => e.id === selectedEvent.id);
      const nextIndex = (currentIndex + 1) % eventData.length;
      setSelectedEvent(eventData[nextIndex]);
    }
  };

  const goToPreviousEvent = () => {
    if (selectedEvent) {
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

      {selectedEvent && modifyEventModal && (
        <ModifyEventModal
          event={selectedEvent}
          onClose={handleModalClose}
          onModifyEvent={handleModifyEvent}
        />
      )}

      {selectedEvent && deleteEventModal && (
        <DeleteEventModal
          event={selectedEvent}
          onClose={handleModalClose}
          onDeleteEvent={handleDeleteEvent}
        />
      )}

      {addEventModal && (
        <AddEventModal
          onClose={handleModalClose}
          onAddEvent={handleAddEvent}
        />
      )}
    </section>
  );
};

export default AdminMenu;
