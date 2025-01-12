import React, { useState } from 'react';

export interface ModifyEventModalProps {
    event: { id: string; title: string; description: string; date: string; start_time: string; end_time: string; location: string };
    onClose: () => void;
    onModifyEvent: (updatedEvent: { id: string; title: string; description: string; date: string; start_time: string; end_time: string; location: string }) => void;
}

const ModifyEventModal: React.FC<ModifyEventModalProps> = ({ event, onClose, onModifyEvent }) => {
    const [formData, setFormData] = useState(event);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleModifyEvent = () => {
        onModifyEvent(formData);
        onClose();
    };

    return (
        <div className="modal fade" id="modifyEventModal" tabIndex={-1} aria-labelledby="modifyEventModalLabel" aria-hidden="true">
            <div className="modal-dialog">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title" id="modifyEventModalLabel">Modify Event</h5>
                        <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close" onClick={onClose}></button>
                    </div>
                    <div className="modal-body">
                        <form>
                            <input name="title" placeholder="Title" value={formData.title} onChange={handleChange} required />
                            <textarea name="description" placeholder="Description" value={formData.description} onChange={handleChange} required />
                            <input type="date" name="date" value={formData.date} onChange={handleChange} required />
                            <input type="time" name="start_time" value={formData.start_time} onChange={handleChange} required />
                            <input type="time" name="end_time" value={formData.end_time} onChange={handleChange} required />
                            <input name="location" placeholder="Location" value={formData.location} onChange={handleChange} required />
                        </form>
                    </div>
                    <div className="modal-footer">
                        <button type="button" className="btn-primary btn-primary-close" data-bs-dismiss="modal" onClick={onClose}>Close</button>
                        <button type="button" className="btn-primary" onClick={handleModifyEvent}>
                            Modify Event
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ModifyEventModal;
