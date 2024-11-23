import React, { useState } from 'react';
import CalendarLogo from '../assets/calendar-logo.png'; // Adjust the path as needed

function Login() {
  const [isDarkMode, setIsDarkMode] = useState(false); // State to toggle dark mode

  // Toggle light/dark mode and enable/disable preloaded styles
  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
  
    // Select the preloaded stylesheets
    const lightLink = document.querySelector('link[href="/styles/login-light.css"]');
    const darkLink = document.querySelector('link[href="/styles/login-dark.css"]');
  
    console.log("Before toggle:", {
      lightDisabled: lightLink?.disabled,
      darkDisabled: darkLink?.disabled,
    });
  
    // Toggle the disabled property
    if (isDarkMode) {
      lightLink.disabled = false; // Enable light mode
      darkLink.disabled = true;  // Disable dark mode
    } else {
      lightLink.disabled = true; // Disable light mode
      darkLink.disabled = false; // Enable dark mode
    }
  
    console.log("After toggle:", {
      lightDisabled: lightLink?.disabled,
      darkDisabled: darkLink?.disabled,
    });
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
      <div className="text-center mt-4 name">ShitCalendar</div>

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
