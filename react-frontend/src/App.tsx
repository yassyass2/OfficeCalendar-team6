import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './components/Login';
import Calendar from './components/Calendar';
import AdminMenu from './components/AdminMenu';
import UserDashboard from 'components/UserDashboard';
import SidePanel from 'components/SidePanel';

// Import images
import profileImage from './assets/profile-image-placeholder@4x.png';

// Import main stylesheet
import './scss/style.scss';

const App: React.FC = () => {
  return (
    <Router>
      <div className="container-fluid navbar-parent">
        <nav className="container navbar">
          <div className="row">
            {/* Logo container */}
            <div className="col-auto logo-container">
              <a href="/">
                Office<span>Calendar<b>.</b></span>
              </a>
            </div>

            {/* Navigation container */}
            <div className="col-auto nav-container position-absolute top-50 start-50 translate-middle">
              <nav>
                <a href="/">Home</a>
                <a href="/about">About</a>
                <a href="/contact">Contact</a>
              </nav>
            </div>

            {/* Login status container */}
            <div className="col-auto login-status">Please log in to continue</div>
            </div>
        </nav>
      </div>

      {/* Main Content */}
      <main className="main-content">
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/Calendar" element={<Calendar />} />
          <Route path="/admin" element={<AdminMenu />} />
          <Route path ="/user" element={<UserDashboard/>} />
          <Route path ="/sidepanel" element={<SidePanel/>} />
        </Routes>
      </main>

      {/* Footer */}
      <footer className="footer">
        <p>&copy; 2024 - OfficeCalendar. Made by [Team 6]</p>
      </footer>
    </Router>
  );
};

export default App;