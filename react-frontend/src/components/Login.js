import React, { useState } from 'react';
import CalendarLogo from '../assets/calendar-logo.png'; // Adjust the path as needed
import axios from 'axios'; // For API requests

function Login() {
  const [isDarkMode, setIsDarkMode] = useState(false); // State for dark mode
  const [email, setEmail] = useState(''); // Email input
  const [password, setPassword] = useState(''); // Password input
  const [error, setError] = useState(null); // Error message
  const [message, setMessage] = useState(null); // Success message

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);

    const lightLink = document.querySelector('link[href="/styles/login-light.css"]');
    const darkLink = document.querySelector('link[href="/styles/login-dark.css"]');

    if (isDarkMode) {
      lightLink.disabled = false;
      darkLink.disabled = true;
    } else {
      lightLink.disabled = true;
      darkLink.disabled = false;
    }
  };

  // Handle form submission
  const handleLogin = async (e) => {
    e.preventDefault(); // Prevent page refresh
    setError(null); // Clear previous errors
    setMessage(null); // Clear previous messages

    try {
      const response = await axios.post('http://localhost:5000/api/login', {
        email,
        password,
      });
      setMessage(response.data.message); // Show success message
      console.log('Token:', response.data.token); // Log the token
      // Store the token in localStorage for future use
      localStorage.setItem('authToken', response.data.token);
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed'); // Show error message
    }
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
      <form className="p-3 mt-3" onSubmit={handleLogin}>
        <div className="form-field d-flex align-items-center">
          <span className="far fa-user"></span>
          <input
            type="email"
            name="email"
            id="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div className="form-field d-flex align-items-center">
          <span className="fas fa-key"></span>
          <input
            type="password"
            name="password"
            id="pwd"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <button className="btn mt-3" type="submit">Login</button>
      </form>

      {error && <p style={{ color: 'red', textAlign: 'center' }}>{error}</p>}
      {message && <p style={{ color: 'green', textAlign: 'center' }}>{message}</p>}
    </div>
  );
}

export default Login;
