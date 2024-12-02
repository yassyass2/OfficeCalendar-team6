import React, { useState } from "react";

// Utility function to get the number of days in a month
const getDaysInMonth = (year: number, month: number): number => {
  return new Date(year, month + 1, 0).getDate();
};

// Utility function to get the first day of the month (0 = Sunday, 1 = Monday, etc.)
const getFirstDayOfMonth = (year: number, month: number): number => {
  return new Date(year, month, 1).getDay();
};

const Calendar: React.FC = () => {
  const today = new Date();
  const [currentYear, setCurrentYear] = useState(today.getFullYear());
  const [currentMonth, setCurrentMonth] = useState(today.getMonth());

  // Generate array of days for the current month
  const daysInMonth = getDaysInMonth(currentYear, currentMonth);
  const firstDay = getFirstDayOfMonth(currentYear, currentMonth);

  // Create an array to represent days of the week (Sunday to Saturday)
  const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

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
    <div>
      <div>
        <button onClick={() => switchMonth(-1)}>{'<'}</button>
        <span>
          {new Date(currentYear, currentMonth).toLocaleString("default", { month: "long" })}
          {currentYear}
        </span>
        <button onClick={() => switchMonth(1)}>{'>'}</button>
      </div>

      {/* Render the days of the week */}
      <div style={{ display: "flex" }}>
        {daysOfWeek.map((day) => (
          <div key={day} style={{ width: "14.28%", textAlign: "center" }}>
            {day}
          </div>
        ))}
      </div>

      {/* Render the calendar days */}
      <div style={{ display: "flex", flexWrap: "wrap" }}>
        {calendarDays.map((day, index) => (
          <div
            key={index}
            style={{
              width: "14.28%",
              textAlign: "center",
              height: "40px",
              lineHeight: "40px",
              border: "1px solid #ddd",
            }}
          >
            {day ? day : ""}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Calendar;
