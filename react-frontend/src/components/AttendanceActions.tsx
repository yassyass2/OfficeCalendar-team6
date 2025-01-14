import React, { useState } from "react";
import { EventData } from "./UserDashboard";

interface AttendanceActionsProps {
  event: EventData;
  onUpdateAttendance: (event: EventData, newTime: string) => void;
  onDeleteAttendance: (event: EventData) => void;
  AttendanceTime: string
}

const AttendanceActions: React.FC<AttendanceActionsProps> = ({
  event,
  onUpdateAttendance,
  onDeleteAttendance,
  AttendanceTime,
}) => {
  const [editMode, setEditMode] = useState(false);
  const [newTime, setNewTime] = useState<string>(event.start_time);

  const generateTimeOptions = (start: string, end: string): string[] => {
    const options: string[] = [];
    const [startHours, startMinutes] = start.split(":").map(Number);
    const [endHours, endMinutes] = end.split(":").map(Number);

    let currentTime = new Date();
    currentTime.setHours(startHours, startMinutes, 0, 0);

    const endTime = new Date();
    endTime.setHours(endHours, endMinutes, 0, 0);

    while (currentTime <= endTime) {
      const timeString = currentTime.toTimeString().slice(0, 5);
      options.push(timeString);

      currentTime.setMinutes(currentTime.getMinutes() + 10);
    }

    return options;
  };

  const handleEditClick = () => {
    setEditMode(true);
  };

  const handleDeleteClick = () => {
    const confirmDelete = window.confirm(
      "Are you sure you want to remove your attendance?"
    );
    if (confirmDelete) {
      onDeleteAttendance(event);
    }
  };

  const handleSaveEdit = () => {
    onUpdateAttendance(event, newTime);
    setEditMode(false);
  };

  const handleCancelEdit = () => {
    setEditMode(false);
  };

  return (
    <div>
      <button onClick={handleEditClick} className="btn btn-warning">
        🖊️
      </button>
      <button onClick={handleDeleteClick} className="btn btn-danger">
        🗑️
      </button>

      {editMode && (
        <div>
          <select value={AttendanceTime} onChange={(e) => setNewTime(e.target.value)}>
            {generateTimeOptions(event.start_time, event.end_time).map(
              (time) => (
                <option key={time} value={time}>
                  {time}
                </option>
              )
            )}
          </select>
          <button onClick={handleSaveEdit} className="btn btn-success">
            Save
          </button>
          <button onClick={handleCancelEdit} className="btn btn-secondary">
            Cancel
          </button>
        </div>
      )}
    </div>
  );
};

export default AttendanceActions;
