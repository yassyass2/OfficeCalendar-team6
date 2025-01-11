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
    openInviteModal: () => void;
};

const SidePanel: React.FC<Props> = ({ openInviteModal }) => {
    return (
        <div className="row g-0">
            <div className="col-auto sidepanel-container">
                <h2>{mockEventData.title}</h2>
                <div className="event-metadata">
                    <i className="fa-regular fa-calendar"></i>
                    <span>{mockEventData.date}</span>

                    <i className="fa-regular fa-clock"></i>
                    <span>{mockEventData.time}</span>

                    <i className="fa-solid fa-user"></i>
                    <span>
                        <span className="attendees-number">
                            {mockEventData.attendees}
                        </span>{' '}
                        attending
                    </span>
                </div>

                <div className="event-body">
                    {mockEventData.description}
                </div>

                <div className="button-group">
                    <button className="btn-primary">
                        ATTEND EVENT
                        <i className="fa-solid fa-caret-right"></i>
                    </button>
                    <button onClick={openInviteModal} className="btn-primary" type="button" data-bs-toggle="modal" data-bs-target="#exampleModal">
                        INVITE EMPLOYEE
                        <i className="fa-solid fa-caret-right"></i>
                    </button>
                </div>
            </div>
        </div>
    );
}

export default SidePanel;
