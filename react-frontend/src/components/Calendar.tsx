import React, { useEffect, useState } from "react";
import 'bootstrap/dist/css/bootstrap.min.css';
import axiosInstance from "axiosInstance";

interface Event {
    id: string,
    date: string,
}

// Utility function to get the number of days in a month
const getDaysInMonth = (year: number, month: number): number => {
    return new Date(year, month + 1, 0).getDate();
};

// Utility function to get the first day of the month
const getFirstDayOfMonth = (year: number, month: number): number => {
    return new Date(year, month, 0).getDay();
};

// Utility function to parse "DD-MM-YYYY" to a JavaScript Date object
const parseDate = (dateString: string): Date => {
    const [day, month, year] = dateString.split("-").map(Number);
    return new Date(year, month - 1, day);
};

const Calendar: React.FC = () => {
    const today = new Date();
    const [currentYear, setCurrentYear] = useState(today.getFullYear());
    const [currentMonth, setCurrentMonth] = useState(today.getMonth());
    const [events, setEvents] = useState<Event[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchEvents = async () => {
            try {
                const response = await axiosInstance.get("http://localhost:5000/events")
                setEvents(response.data);
            } catch (err: any) {
                setError(err.response?.data?.message || err.message || "An error occurred");
            } finally {
                setLoading(false);
            }
        };
        fetchEvents();
    }, []);

    // Filter events for the current month and year
    const filteredEvents = events.filter((event) => {
        const eventDate = parseDate(event.date);
        return (
            eventDate.getFullYear() === currentYear &&
            eventDate.getMonth() === currentMonth
        );
    });

    // Generate array of days for the current month
    const daysInMonth = getDaysInMonth(currentYear, currentMonth);
    const firstDay = getFirstDayOfMonth(currentYear, currentMonth);
    const daysOfWeek = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

    // Create an array with empty slots for the first row if the month doesn't start on Monday
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
            <div className="calendar-container">
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
                <div className="weekday-names-header" >
                    {
                        daysOfWeek.map((day) => (
                            <div key={day} >
                                {day}
                            </div>
                        ))
                    }
                </div>

        {/* Render the calendar days */}
        <div className="weekdays-numbers-wrapper" >
          {
            calendarDays.map((day, index) => {
              const isToday =
                day === today.getDate() &&
                currentMonth === today.getMonth() &&
                currentYear === today.getFullYear();

              return (
                <div
                  className={`weekdays-numbers ${isToday ? "current-day" : ""}`
                  }
                  key={index}
                >
                  {day ? day : ""}
                </div>

            </div>
        </div>
    );
};

export default Calendar;
