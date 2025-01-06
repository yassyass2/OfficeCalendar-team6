import React, { useState } from "react";
import 'bootstrap/dist/css/bootstrap.min.css';

// Utility function to get the number of days in a month
const getDaysInMonth = (year: number, month: number): number => {
  return new Date(year, month + 1, 0).getDate();
};

// Utility function to get the first day of the month (0 = Sunday, 1 = Monday, etc.)
const getFirstDayOfMonth = (year: number, month: number): number => {
  return new Date(year, month, 0).getDay();
};

const Calendar: React.FC = () => {
  const today = new Date();
  const [currentYear, setCurrentYear] = useState(today.getFullYear());
  const [currentMonth, setCurrentMonth] = useState(today.getMonth());

  // Generate array of days for the current month
  const daysInMonth = getDaysInMonth(currentYear, currentMonth);
  const firstDay = getFirstDayOfMonth(currentYear, currentMonth);

  // Create an array to represent days of the week (Monaday to Sunday)
  const daysOfWeek = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

  // Create an array with empty slots for the first row if the month doesn't start on Sunday
  const emptySlots = Array(firstDay).fill(null);

  // Create an array of day numbers for the current month
  const daysArray = Array.from({ length: daysInMonth }, (_, index) => index + 1);

  // Combine empty slots and day numbers into a single array
  const calendarDays = [...emptySlots, ...daysArray];

  // Function to handle switching months
  const switchMonth = (increment: number) => {
    let newMonth = currentMonth + increment;
    let newYear = currentYear;

    if (newMonth < 0) {
      newMonth = 11;
      newYear -= 1;
    } else if (newMonth > 11) {
      newMonth = 0;
      newYear += 1;
    }

    setCurrentMonth(newMonth);
    setCurrentYear(newYear);
  };

  return (
    <div className="row">
      <div className="col-3 g-0 calendar-container">

        <div className="calendar-header">
          <div className="current-date">
            <span>
              {new Date(currentYear, currentMonth).toLocaleString("default", { month: "long" })}
            </span>
            &nbsp;
            <span>{currentYear}</span>
          </div>

          <div className="calendar-button-group">
            <a onClick={() => switchMonth(-1)} className="btn-simple p-2">{<i className="fa-solid fa-chevron-left"></i>}</a>
            <a onClick={() => switchMonth(1)} className="btn-simple p-2">{<i className="fa-solid fa-chevron-right"></i>}</a>
          </div>
        </div>

        {/* Render the days of the week */}
        <div className="weekday-names-header">
          {daysOfWeek.map((day) => (
            <div key={day}>
              {day}
            </div>
          ))}
        </div>

        {/* Render the calendar days */}
        <div className="weekdays-numbers-wrapper">
          {calendarDays.map((day, index) => {
            const isToday =
              day === today.getDate() &&
              currentMonth === today.getMonth() &&
              currentYear === today.getFullYear();

            return (
              <div
                className={`weekdays-numbers ${isToday ? "current-day" : ""}`}
                key={index}
              >
                {day ? day : ""}
              </div>
            );
          })}
        </div>

      </div>
    </div>
  );
};

export default Calendar;
