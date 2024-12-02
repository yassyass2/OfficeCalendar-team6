import React from 'react';
import { useNavigate } from 'react-router-dom';
import Calendar from './Calendar'; // Import Calendar component

const AdminMenu: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="admin-menu-container">
      <header className="admin-header">
        <h1>Admin Panel</h1>
        <p>Welcome, Admin! Manage your events below:</p>
      </header>

      <section className="calendar-section">
        {/* Display the calendar */}
        <Calendar />
      </section>

      <section className="admin-actions">
        <h2>Event Management</h2>
        <div className="menu-buttons">
          <button className="menu-btn" onClick={() => navigate('/admin/add')}>
            Add Event
          </button>
          <button className="menu-btn" onClick={() => navigate('/admin/modify')}>
            Modify Event
          </button>
          <button className="menu-btn" onClick={() => navigate('/admin/delete')}>
            Delete Event
          </button>
        </div>
      </section>
    </div>
  );
};

export default AdminMenu;