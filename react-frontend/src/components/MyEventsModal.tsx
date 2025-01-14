import React, { useState, useEffect } from "react";
import { EventData } from "./UserDashboard";
import axiosInstance from "../axiosInstance";
import AttendanceActions from "./AttendanceActions";

interface ModalProps {
  onClose: () => void;
}

interface Attendance {
  userId: string,
  eventId: string,
  attendAt: string
}

const MyEventsModal: React.FC<ModalProps> = ({ onClose }) => {
  const [loading, setLoading] = useState(false);
  const [attendances, setAttendances] = useState<Attendance[]>([]);
  const [events, setEvents] = useState<EventData[]>([]);

  useEffect(() => {
    FetchAttendances();
  }, []);

  useEffect(() => {
    const fetchTitles = async () => {
      if (attendances.length > 0) {
        const titles = await Promise.all(
          attendances.map((attendance) => FetchEventTitle(attendance.eventId))
        );
        setEvents(titles);
      }
    };

    if (attendances.length > 0) {
      fetchTitles();
    }
  }, [attendances]);

  const FetchAttendances = async () => {
    setLoading(true);
    try {
      const response = await axiosInstance.get("/api/Attendance/view", {
        params: {
          userId: localStorage.getItem("userId"),
        },
      });
      setAttendances(response.data);
    } catch (error) {
      console.error("Error fetching attendances:", error);
    } finally {
      setLoading(false);
    }
  };

  const FetchEventTitle = async (EventId: string) => {
    try {
      setLoading(true);
      const response = await axiosInstance.get(`/events/${EventId}`);
      const event = response.data;
      return event;
    } catch (error) {
      console.error("Error fetching event title:", error);
      return "";
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateAttendance = async (event: EventData, newTime: string) => {
    setLoading(true);
    try {
      const response = await axiosInstance.put("/api/ModifyAttendance", {
        UserId: localStorage.getItem("userId"),
        EventId: event.id,
        AttendAt: newTime,
      });

      alert("Attendance updated successfully!");
    } catch (error) {
      console.error("Error updating attendance:", error);
      alert("Failed to update attendance. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAttendance = async (event: EventData) => {
    try {
      const response = await axiosInstance.delete("/api/Attendance/attend", {
        data: {
          UserId: localStorage.getItem('userId'),
          EventId: event.id
        }
      });
      alert(response.data);
      FetchAttendances();
    } catch (error) {
      console.error("Error deleting attendance:", error);
    } finally {
      setLoading(false);
    }
    console.log("Deleted attendance");
  };

  return (
    <div
      className="modal fade"
      id="MyEventsModal"
      tabIndex={-1}
      aria-labelledby="MyEventsModalLabel"
      aria-hidden="true"
    >
      <div className="modal-dialog">
        <div className="modal-content">
          <div className="modal-header">
            <h1 className="modal-title fs-5" id="MyEventsModalLabel">
              Registered Events
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
            <h2>Your events</h2>

            {loading ? (
              <p>Getting attending events...</p>
            ) : (
              <div>
                <ul>
                  {events.map((event, index) => (
                    <li key={index}>
                      {event.title}
                      <AttendanceActions
                        event={event}
                        onUpdateAttendance={handleUpdateAttendance}
                        onDeleteAttendance={handleDeleteAttendance}
                        AttendanceTime={attendances[index].attendAt}
                      />
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
          <div className="modal-footer">
            <button
              type="button"
              className="btn-primary btn-primary-close"
              data-bs-dismiss="modal"
              onClick={onClose}
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyEventsModal;
