import React, { useState } from 'react';
import { EventData } from './AdminMenu';

interface AddEventModalProps {
  onClose: () => void;
  onAddEvent: (newEvent: EventData) => void;
}

const AddEventModal: React.FC<AddEventModalProps> = ({ onClose, onAddEvent }) => {
  const [newEvent, setNewEvent] = useState<Omit<EventData, 'id'>>({
    title: '',
    description: '',
    date: '',
    start_time: '',
    end_time: '',
    location: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setNewEvent((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const eventWithId = { id: crypto.randomUUID(), ...newEvent };
    onAddEvent(eventWithId);
    onClose();
  };

  return (
    <div className="modal fade" id="addEventModal" tabIndex={-1} aria-labelledby="addEventModalLabel" aria-hidden="true">
      <div className="modal-dialog">
        <div className="modal-content">
          <div className="modal-header">
            <h1 className="modal-title fs-5" id="addEventModalLabel">Add Event</h1>
            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close" onClick={onClose}></button>
          </div>
          <div className="modal-body">
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Title</label>
                <input name="title" value={newEvent.title} onChange={handleChange} required className="form-control" />
              </div>
              <div className="form-group">
                <label>Description</label>
                <textarea name="description" value={newEvent.description} onChange={handleChange} required className="form-control" />
              </div>
              <div className="form-group">
                <label>Date</label>
                <input name="date" type="date" value={newEvent.date} onChange={handleChange} required className="form-control" />
              </div>
              <div className="form-group">
                <label>Start Time</label>
                <input name="start_time" type="time" value={newEvent.start_time} onChange={handleChange} required className="form-control" />
              </div>
              <div className="form-group">
                <label>End Time</label>
                <input name="end_time" type="time" value={newEvent.end_time} onChange={handleChange} required className="form-control" />
              </div>
              <div className="form-group">
                <label>Location</label>
                <input name="location" value={newEvent.location} onChange={handleChange} required className="form-control" />
              </div>
              <button type="submit" className="btn btn-primary">Add Event</button>
              <button type="button" className="btn btn-secondary" onClick={onClose}>Close</button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddEventModal;