import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Import the hook
import CalendarLogo from '../assets/calendar-logo.png'; // Ensure correct path for the image
import axios from 'axios';
import '../index.css'; // Global styles
import '../styles/login-light.css'; // Include any required CSS styles
import '../styles/forgotpassword.css'; // Include any required CSS styles

const Login: React.FC = () => {
  const [email, setEmail] = useState<string>(''); // Email state
  const [password, setPassword] = useState<string>(''); // Password state
  const [error, setError] = useState<string | null>(null); // Error message state
  const [message, setMessage] = useState<string | null>(null); // Success message state
  const navigate = useNavigate(); // React Router navigation hook

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault(); // Prevent default form submission
    setError(null); // Clear previous error
    setMessage(null); // Clear previous success message

    try {
      // Make the API request to login
      const response = await axios.post('http://localhost:5000/api/login', {
        email,
        password,
      });

      setMessage(response.data.message); // Set success message
      console.log('Token:', response.data.token);

      // Store the token in localStorage
      localStorage.setItem('authToken', response.data.token);

      // Redirect to the Calendar page
      navigate('/Calendar');
    } catch (err: unknown) {
      // Handle errors
      if (axios.isAxiosError(err)) {
        setError(err.response?.data?.message || 'Wrong credentials! Please check your email or password.');
      } else {
        setError('An unexpected error occurred.');
      }
    }
  };

  return (
    <div className="login-page">
      <div className="login-wrapper">
        {/* Logo */}
        

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
              autoComplete="off" // Prevents autofill
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
          <button className="btn mt-3" type="submit">
            Login
          </button>
        </form>

        {/* Forgot Password and Sign Up */}
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
          <a href="/sign-up" className="sign-up">
            Sign Up
          </a>
        </div>

        {/* Error and Success Messages */}
        <div className="message-container">
          {error && <p className="error-message">{error}</p>}
          {message && <p className="success-message">{message}</p>}
        </div>
      </div>
    </div>
  );
};

export default Login;
