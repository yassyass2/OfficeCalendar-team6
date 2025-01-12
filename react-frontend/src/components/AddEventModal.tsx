import React, { useState } from 'react';

export interface AddEventModalProps {
    onClose: () => void;
    onAddEvent: (event: { id: string; title: string; description: string; date: string; start_time: string; end_time: string; location: string }) => void;
}

const AddEventModal: React.FC<AddEventModalProps> = ({ onClose, onAddEvent }) => {
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        date: '',
        start_time: '',
        end_time: '',
        location: '',
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleAddEvent = () => {
        setLoading(true);
        const newEvent = { id: Date.now().toString(), ...formData };
        onAddEvent(newEvent);
        setLoading(false);
        onClose();
    };

    return (
        <div className="modal fade" id="addEventModal" tabIndex={-1} aria-labelledby="addEventModalLabel" aria-hidden="true">
            <div className="modal-dialog">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title" id="addEventModalLabel">Add Event</h5>
                        <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close" onClick={onClose}></button>
                    </div>
                    <div className="modal-body">
                        <form>
                            <input name="title" placeholder="Title" onChange={handleChange} required />
                            <textarea name="description" placeholder="Description" onChange={handleChange} required />
                            <input type="date" name="date" onChange={handleChange} required />
                            <input type="time" name="start_time" onChange={handleChange} required />
                            <input type="time" name="end_time" onChange={handleChange} required />
                            <input name="location" placeholder="Location" onChange={handleChange} required />
                        </form>
                    </div>
                    <div className="modal-footer">
                        <button type="button" className="btn btn-secondary" data-bs-dismiss="modal" onClick={onClose}>Close</button>
                        <button type="button" className="btn btn-primary" onClick={handleAddEvent} disabled={loading}>
                            {loading ? 'Adding...' : 'Add Event'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AddEventModal;
