import React, { useState, useEffect } from 'react';
import CalendarLogo from '../assets/calendar-logo.png'; // Assuming you're using a local logo

function Login() {
  const [isDarkMode, setIsDarkMode] = useState(false); // State to toggle dark mode

  // Dynamically load the correct CSS file
  useEffect(() => {
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.type = 'text/css';
    link.href = `/styles/${isDarkMode ? 'login-dark.css' : 'login-light.css'}`; // Use absolute path from public
    document.head.appendChild(link);
  
    return () => {
      document.head.removeChild(link); // Clean up the stylesheet
    };
  }, [isDarkMode]);
  

  // Toggle dark mode
  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
  };

  return (
    <div className="wrapper">
      {/* Dark Mode Toggle Button */}
      <button
        className="toggle-btn"
        onClick={toggleDarkMode}
        style={{
          position: 'absolute',
          top: '20px',
          right: '20px',
          padding: '10px 20px',
          border: 'none',
          borderRadius: '5px',
          cursor: 'pointer',
          backgroundColor: isDarkMode ? '#555' : '#ddd',
          color: isDarkMode ? '#fff' : '#000',
        }}
      >
        {isDarkMode ? 'Light Mode' : 'Dark Mode'}
      </button>

      {/* Logo */}
      <div className="logo">
        <img src={CalendarLogo} alt="Calendar Logo" />
      </div>

      {/* App Name */}
      <div className="text-center mt-4 name">ShitCalender</div>

      {/* Login Form */}
      <form className="p-3 mt-3">
        <div className="form-field d-flex align-items-center">
          <span className="far fa-user"></span>
          <input
            type="text"
            name="userName"
            id="userName"
            placeholder="Username"
          />
        </div>
        <div className="form-field d-flex align-items-center">
          <span className="fas fa-key"></span>
          <input
            type="password"
            name="password"
            id="pwd"
            placeholder="Password"
          />
        </div>
        <button className="btn mt-3">Login</button>
      </form>

      <div className="text-center fs-6">
        <a href="#">Forget password?</a> or <a href="#">Sign up</a>
      </div>
    </div>
  );
}

export default Login;
