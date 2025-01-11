import React from 'react';

interface EventData {
    id: string;
    title: string;
    description: string;
    date: string;
    start_time: string;
    end_time: string;
    location: string;
}

type Props = {
    selectedEvent: EventData | null;
    openInviteModal: () => void;
};

const SidePanel: React.FC<Props> = ({ selectedEvent, openInviteModal }) => {
    if (!selectedEvent) {
        return (
            <div className="sidepanel-container">
                <p>No event selected. Click an event to view details.</p>
            </div>
        );
    }

    return (
        <div className="row g-0">
            <div className="col-auto sidepanel-container">
                <div className="event-container">
                    <h2>{selectedEvent.title}</h2>
                    <div className="event-metadata">
                        <i className="fa-regular fa-calendar"></i>
                        <span>{selectedEvent.date}</span>

                        <i className="fa-regular fa-clock"></i>
                        <span>
                            {selectedEvent.start_time} - {selectedEvent.end_time}
                        </span>

                        <i className="fa-solid fa-user"></i>
                        <span>
                            <span className="attendees-number">{0}</span> {/* Placeholder */}
                            attending
                        </span>
                    </div>

                    <div className="event-body">
                        {selectedEvent.description}
                    </div>

                    <div className="button-group">
                        <button className="btn-primary">
                            ATTEND EVENT
                            <i className="fa-solid fa-caret-right"></i>
                        </button>
                        <button
                            onClick={openInviteModal}
                            className="btn-primary"
                            type="button"
                            data-bs-toggle="modal"
                            data-bs-target="#exampleModal"
                        >
                            INVITE EMPLOYEE
                            <i className="fa-solid fa-caret-right"></i>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SidePanel;
