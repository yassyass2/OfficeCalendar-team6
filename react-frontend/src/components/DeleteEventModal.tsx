import React from 'react';

export interface DeleteEventModalProps {
    event: { id: string; title: string };
    onClose: () => void;
    onDeleteEvent: (eventId: string) => void;
}

const DeleteEventModal: React.FC<DeleteEventModalProps> = ({ event, onClose, onDeleteEvent }) => {
    const handleDeleteEvent = () => {
        onDeleteEvent(event.id);
        onClose();
    };

    return (
        <div className="modal fade" id="deleteEventModal" tabIndex={-1} aria-labelledby="deleteEventModalLabel" aria-hidden="true">
            <div className="modal-dialog">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title" id="deleteEventModalLabel">Delete Event</h5>
                        <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close" onClick={onClose}></button>
                    </div>
                    <div className="modal-body">
                        <p>Are you sure you want to delete the event <strong>{event.title}</strong>?</p>
                    </div>
                    <div className="modal-footer">
                        <button type="button" className="btn btn-secondary" data-bs-dismiss="modal" onClick={onClose}>Close</button>
                        <button type="button" className="btn btn-danger" onClick={handleDeleteEvent}>
                            Delete Event
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DeleteEventModal;
