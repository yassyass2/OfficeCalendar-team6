import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './components/Login'; // Your unchanged Login component
import Calendar from './components/Calendar';
import ForgotPassword from './components/ForgotPassword';
import './styles/App.css'; // Add a CSS file for header/footer styles

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
          <div className="login-status">
              Please log in to continue
          </div>
        </header>



        {/* Main Content */}
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Login />} /> {/* Keep login centered */}
            <Route path="/Calendar" element={<Calendar />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
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
