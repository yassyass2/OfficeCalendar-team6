import React, { useEffect } from 'react';
import { EventData } from './AdminMenu';

declare global {
  interface Window {
    bootstrap: any;
  }
}

interface DeleteEventModalProps {
  event: EventData;
  onClose: () => void;
  onDeleteEvent: (eventId: string) => void;
}

const DeleteEventModal: React.FC<DeleteEventModalProps> = ({ event, onClose, onDeleteEvent }) => {
  const handleDelete = () => {
    onDeleteEvent(event.id);
    onClose();
  };

  return (
    <div className="modal fade" id="deleteEventModal" tabIndex={-1} aria-labelledby="deleteEventModalLabel" aria-hidden="true">
      <div className="modal-dialog">
        <div className="modal-content">
          <div className="modal-header">
            <h1 className="modal-title fs-5" id="deleteEventModalLabel">Delete Event</h1>
            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close" onClick={onClose}></button>
          </div>
          <div className="modal-body">
            <p>Are you sure you want to delete the event titled "{event.title}"?</p>
          </div>
          <div className="modal-footer">
            <button onClick={handleDelete} data-bs-dismiss="modal" className="btn-primary btn-primary-close">Yes, Delete</button>
            <button onClick={onClose} data-bs-dismiss="modal" className="btn-primary">Cancel</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeleteEventModal;