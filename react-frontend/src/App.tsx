import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './components/Login';
import Calendar from './components/Calendar';
import AdminMenu from './components/AdminMenu';
import AddEvent from './components/AddEvent';
import ModifyEvent from './components/ModifyEvent';
import DeleteEvent from './components/DeleteEvent';
import './styles/App.css';

const App: React.FC = () => {
  return (
    <Router>
      <div className="app-container">
        <header className="header">
          {/* Logo container */}
          <div className="logo-container">
            <div className="logo">
              Office<span>Calendar</span>
            </div>
          </div>

          {/* Navigation container */}
          <div className="nav-container">
            <nav>
              <a href="/">Home</a>
              <a href="/about">About</a>
              <a href="/contact">Contact</a>
            </nav>
          </div>

          {/* Login status container */}
          <div className="login-status">Please log in to continue</div>
        </header>

        {/* Main Content */}
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/Calendar" element={<Calendar />} />
            <Route path="/admin" element={<AdminMenu />} />
            <Route path="/admin/modify/:eventId" element={<ModifyEvent />} />
            <Route path="/admin/delete/:eventId" element={<DeleteEvent />} />
            <Route path="/admin/add" element={<AddEvent />} />
          </Routes>
        </main>

        {/* Footer */}
        <footer className="footer">
          <p>&copy; 2024 - OfficeCalendar. Made by [Team 6]</p>
        </footer>
      </div>
    </Router>
  );
};

export default App;