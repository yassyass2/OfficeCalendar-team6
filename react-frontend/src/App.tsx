import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/Login';
import Calendar from './components/Calendar';
import AdminMenu from './components/AdminMenu';
import UserDashboard from './components/UserDashboard';
import SidePanel from './components/SidePanel';
import Breadcrumbs from './components/misc/Breadcrumbs';

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
            <div className="col-auto login-status-container">
              <span className="login-status-text"><a href="https://www.youtube.com/watch?v=dQw4w9WgXcQ">Please log in to continue</a></span>
              <img src={profileImage} alt='' width={40} height={40} />
            </div>
          </div>
        </nav>
      </div>

      {/* Main Content */}
      <main className="container main-content g-0 flex-1">
        {<Breadcrumbs />}
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/calendar" element={<Calendar />} />
          <Route path="/admin" element={<AdminMenu />} />
          <Route path="/user" element={<UserDashboard />} />
          <Route path="/sidepanel" element={<SidePanel />} />
          <Route path="/404" element={<div className="g-0 pt-4"><h3><strong>Error 404 - Not Found</strong></h3></div>} />
          <Route path="*" element={<Navigate replace to="/404" />} />
        </Routes>
      </main>

      {/* Footer */}
      <div className="container-fluid footer-parent">
        <footer className="container d-flex justify-content-center">
          <div className="row">
            <div className="col-auto text-center">
              <p>&copy; 2024 - OfficeCalendar.</p>
              <p>Made by Yassine, Maurice, Mohammad, Halit en Thijs</p>
            </div>
          </div>
        </footer>
      </div>
    </Router>
  );
};

export default App;