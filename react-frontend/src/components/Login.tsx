import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Import the hook
import CalendarLogo from '../assets/calendar-logo.png'; // For TypeScript, ensure to configure type declarations for images
import axios from 'axios';

// Define types for state and props where necessary
const Login: React.FC = () => {
  const [isDarkMode, setIsDarkMode] = useState<boolean>(false);
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const navigate = useNavigate(); // Initialize the hook

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);

    const lightLink = document.querySelector<HTMLLinkElement>(
      'link[href="/styles/login-light.css"]'
    );
    const darkLink = document.querySelector<HTMLLinkElement>(
      'link[href="/styles/login-dark.css"]'
    );

    if (isDarkMode) {
      if (lightLink) lightLink.disabled = false;
      if (darkLink) darkLink.disabled = true;
    } else {
      if (lightLink) lightLink.disabled = true;
      if (darkLink) darkLink.disabled = false;
    }
  };

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
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
    } catch (err: unknown) {
      // Handle error with proper typing
      if (axios.isAxiosError(err)) {
        setError(err.response?.data?.message || 'Wrong credentials! Please check your email or password.');
      } else {
        setError('An unexpected error occurred.');
      }
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
      <div className="text-center mt-4 name">OfficeCalendar</div>

      {/* Login Form */}
      <form className="p-3 mt-3" onSubmit={handleLogin}>
        <div className="form-field d-flex align-items-center">
          <span className="far fa-user"></span>
          <input
            type="text"
            name="email"
            id="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="off" /* Prevents autofill */
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

      <div className="text-center fs-6 mt-3">
        <button
          className="forgot-password-btn"
          onClick={() => navigate('/forgot-password')}
          style={{
            background: 'none',
            border: 'none',
            color: '#007bff',
            cursor: 'pointer',
            padding: 0,
          }}
        >
          Forgot Password
        </button>
        <span> or </span>
        <a href="/sign-up" className="sign-up">Sign Up</a>
      </div>

      {/* Error and Success Messages */}
      <div className="message-container">
        {error && <p className="error-message">{error}</p>}
        {message && <p className="success-message">{message}</p>}
      </div>
    </div>
  );
};

export default Login;
