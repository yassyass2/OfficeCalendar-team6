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
    openAttendanceModal: () => void;
    goToNextEvent: () => void;
    goToPreviousEvent: () => void;
};

const SidePanel: React.FC<Props> = ({ selectedEvent, openInviteModal, openAttendanceModal, goToNextEvent, goToPreviousEvent }) => {
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
                        <button
                            onClick={openInviteModal}
                            className="btn-primary"
                            type="button"
                            data-bs-toggle="modal"
                            data-bs-target="#inviteModal"
                        >
                            INVITE EMPLOYEE
                            <i className="fa-solid fa-caret-right"></i>
                        </button>
                        <button
                            onClick={openAttendanceModal}
                            className="btn-primary"
                            type="button"
                            data-bs-toggle="modal"
                            data-bs-target="#attendanceModal"
                        >
                            ATTEND EVENT
                            <i className="fa-solid fa-caret-right"></i>
                        </button>
                    </div>
                </div>
            </div>
            <div className="row g-0">
                <div className="event-navigation">
                    <button className="prev-btn" onClick={goToPreviousEvent}><i className="fa-solid fa-chevron-left"></i></button>
                    <button className="next-btn" onClick={goToNextEvent}><i className="fa-solid fa-chevron-right"></i></button>
                </div>
            </div>
        </div>
    );
};

export default SidePanel;
