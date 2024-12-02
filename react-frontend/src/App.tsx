import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './components/Login'; // Your unchanged Login component
import Calendar from './components/Calendar';
import AdminMenu from './components/AdminMenu';
import AddEvent from 'components/AddEvent';
import ModifyEvent from 'components/ModifyEvent';
import DeleteEvent from 'components/DeleteEvent';
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
            <Route path="/admin" element={<AdminMenu />} /> {/* Admin route */}
            <Route path="/admin/add" element={<AddEvent />} />
            <Route path="/admin/modify" element={<ModifyEvent />} />
            <Route path="/admin/delete" element={<DeleteEvent />} />
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