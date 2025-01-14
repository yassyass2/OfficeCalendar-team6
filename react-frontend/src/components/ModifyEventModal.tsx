import React, { useState, useEffect } from 'react';
import { EventData } from './AdminMenu';

declare global {
  interface Window {
    bootstrap: any;
  }
}

interface ModifyEventModalProps {
  event: EventData;
  onClose: () => void;
  onModifyEvent: (updatedEvent: EventData) => void;
}

const ModifyEventModal: React.FC<ModifyEventModalProps> = ({ event, onClose, onModifyEvent }) => {
  // Start with the current event as the default
  const [updatedEvent, setUpdatedEvent] = useState<EventData>(event);

  // Update local state whenever `event` prop changes (important if user picks a different event)
  useEffect(() => {
    setUpdatedEvent(event);
  }, [event]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setUpdatedEvent((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onModifyEvent(updatedEvent);
    onClose();
  };

  return (
    <>
      <div
        className="modal fade"
        id="modifyEventModal"
        tabIndex={-1}
        aria-labelledby="modifyEventModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h1 className="modal-title fs-5" id="modifyEventModalLabel">
                Modify Event
              </h1>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
                onClick={onClose}
              ></button>
            </div>
            <div className="modal-body">
              <form onSubmit={handleSubmit}>
                <div className="form-group">
                  <label>Title</label>
                  <input
                    name="title"
                    value={updatedEvent.title}
                    onChange={handleChange}
                    required
                    className="form-control"
                  />
                </div>
                <div className="form-group">
                  <label>Description</label>
                  <textarea
                    name="description"
                    value={updatedEvent.description}
                    onChange={handleChange}
                    required
                    className="form-control"
                  />
                </div>
                <div className="form-group">
                  <label>Date</label>
                  <input
                    name="date"
                    type="date"
                    value={updatedEvent.date}
                    onChange={handleChange}
                    required
                    className="form-control"
                  />
                </div>
                <div className="form-group">
                  <label>Start Time</label>
                  <input
                    name="start_time"
                    type="time"
                    value={updatedEvent.start_time}
                    onChange={handleChange}
                    required
                    className="form-control"
                  />
                </div>
                <div className="form-group">
                  <label>End Time</label>
                  <input
                    name="end_time"
                    type="time"
                    value={updatedEvent.end_time}
                    onChange={handleChange}
                    required
                    className="form-control"
                  />
                </div>
                <div className="form-group">
                  <label>Location</label>
                  <input
                    name="location"
                    value={updatedEvent.location}
                    onChange={handleChange}
                    required
                    className="form-control"
                  />
                </div>
                <button
                  type="button"
                  className="btn-primary btn-primary-close"
                  data-bs-dismiss="modal"
                  onClick={onClose}
                >
                  Close
                </button>
                <button type="submit" className="btn-primary">
                  Save Changes
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ModifyEventModal;
