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
        {/* Header */}
        <header className="header">
          <div className="logo">OfficeCalendar</div>
          <nav>
            <a href="/">Home</a>
            <a href="/about">About</a>
            <a href="/contact">Contact</a>
          </nav>
          <div className="login-status">Please log in to continue</div>
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
          <p>&copy; 2024 - OfficeCalendar. Made by [Your Team]</p>
        </footer>
      </div>
    </Router>
  );
};

export default App;
