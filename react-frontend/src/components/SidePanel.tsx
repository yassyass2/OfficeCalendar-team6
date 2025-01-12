import React, {useEffect, useState} from 'react';
import axiosInstance from '../axiosInstance';

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
    openModal1: () => void; // First modal (Invite/Add)
    openModal2: () => void; // Second modal (Attendance/Modify)
    openModal3: () => void; // Third modal (Delete)
    goToNextEvent: () => void;
    goToPreviousEvent: () => void;
    isAdmin: boolean;
};

const SidePanel: React.FC<Props> = ({
    selectedEvent,
    openModal1,
    openModal2,
    openModal3,
    goToNextEvent,
    goToPreviousEvent,
    isAdmin,
}) => {

    const [attendeeAmount, setAttendeeAmount] = useState(0)
    
    // wnr selectedEvent verandert, opnieuw attendees request
    useEffect(() => {
        GetAttendeeAmount();},
        [selectedEvent]
      );


    const GetAttendeeAmount = async () => {
      try {
          if (!selectedEvent){
            setAttendeeAmount(0)
            return;
          }
          const response = await axiosInstance.get("/api/Attendance/attendees", {
              params: {
                  eventId: selectedEvent.id
              }
          });
          setAttendeeAmount(response.data.length)

      } catch (error) {
          console.error("Error fetching attendees:", error);
          setAttendeeAmount(0)
      }
  };
    if (!selectedEvent) {
      return (
          <div className="sidepanel-container">
              <p>No event selected. Click an event to view details.</p>
          </div>
      );
  }

    return !selectedEvent ? (<div className="sidepanel-container">
      <p>No event selected. Click an event to view details.</p>
  </div>) : (
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
                            <span className="attendees-number">{attendeeAmount}</span> {/* Placeholder */}
                            attending
                        </span>
                    </div>

                    <div className="event-body">
                        {selectedEvent.description}
                    </div>

                    <div className="button-group">
                        {isAdmin ? (
                            <>
                                <button
                                    onClick={openModal1}
                                    className="btn-primary"
                                    type="button"
                                    data-bs-toggle="modal"
                                    data-bs-target="#addEventModal"
                                >
                                    ADD EVENT
                                    <i className="fa-solid fa-caret-right"></i>
                                </button>
                                <button
                                    onClick={openModal2}
                                    className="btn-primary"
                                    type="button"
                                    data-bs-toggle="modal"
                                    data-bs-target="#modifyEventModal"
                                >
                                    MODIFY EVENT
                                    <i className="fa-solid fa-caret-right"></i>
                                </button>
                                <button
                                    onClick={openModal3}
                                    className="btn-primary btn-primary-delete"
                                    type="button"
                                    data-bs-toggle="modal"
                                    data-bs-target="#deleteEventModal"
                                >
                                    DELETE EVENT
                                    <i className="fa-solid fa-caret-right"></i>
                                </button>
                            </>
                        ) : (
                            <>
                                <button
                                    onClick={openModal1}
                                    className="btn-primary"
                                    type="button"
                                    data-bs-toggle="modal"
                                    data-bs-target="#inviteModal"
                                >
                                    INVITE EMPLOYEE
                                    <i className="fa-solid fa-caret-right"></i>
                                </button>
                                <button
                                    onClick={openModal2}
                                    className="btn-primary"
                                    type="button"
                                    data-bs-toggle="modal"
                                    data-bs-target="#attendanceModal"
                                >
                                    ATTEND EVENT
                                    <i className="fa-solid fa-caret-right"></i>
                                </button>
                                <button
                                    onClick={openModal3}
                                    className="btn-primary"
                                    type="button"
                                    data-bs-toggle="modal"
                                    data-bs-target="#MyEventsModal"
                                >
                                    MY PLANNED EVENTS
                                    <i className="fa-solid fa-caret-right"></i>
                                </button>
                            </>
                        )}
                    </div>
                </div>
            </div>
            <div className="row g-0">
                <div className="event-navigation">
                    <button className="prev-btn" onClick={goToPreviousEvent}>
                        <i className="fa-solid fa-chevron-left"></i>
                    </button>
                    <button className="next-btn" onClick={goToNextEvent}>
                        <i className="fa-solid fa-chevron-right"></i>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default SidePanel;
