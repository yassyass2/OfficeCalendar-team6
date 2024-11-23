import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Import the hook
import CalendarLogo from '../assets/calendar-logo.png';
import axios from 'axios';

function Login() {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [message, setMessage] = useState(null);
  const navigate = useNavigate(); // Initialize the hook

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

  const handleLogin = async (e) => {
    e.preventDefault();
    setError(null);
    setMessage(null);

    try {
      const response = await axios.post('http://localhost:5000/api/login', {
        email,
        password,
      });
      setMessage(response.data.message);
      console.log('Token:', response.data.token);

      // Store the token in localStorage
      localStorage.setItem('authToken', response.data.token);

      // Redirect to the Calendar
      navigate('/Calendar');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
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
