import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../index.css'; // Global styles
import '../styles/login-light.css'; // Login-specific styles

const Login: React.FC = () => {
  const [view, setView] = useState<'login' | 'forgotPassword' | 'register'>('login');
  const [email, setEmail] = useState<string>(''); // Stores email/username input
  const [password, setPassword] = useState<string>(''); // Stores password input
  const [confirmPassword, setConfirmPassword] = useState<string>(''); // For register view
  const [error, setError] = useState<string | null>(null); // Displays error messages
  const [message, setMessage] = useState<string | null>(null); // Displays success messages
  const navigate = useNavigate();

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
      localStorage.setItem('authToken', response.data.token);
      navigate('/Calendar'); // Redirect to Calendar after login
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        setError(err.response?.data?.message || 'Login failed. Check your credentials.');
      } else {
        setError('An unexpected error occurred.');
      }
    }
  };

  const requestResetCode = async () => {
    try {
      const response = await axios.post('http://localhost:5000/api/login/forgot-password', { email });
      setMessage('Reset instructions have been sent to your email.');
      setError(null);
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        setError(err.response?.data || 'Failed to send reset instructions.');
      } else {
        setError('An unexpected error occurred.');
      }
    }
  };

  const handleRegister = async () => {
    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    try {
      const response = await axios.post('http://localhost:5000/api/register', {
        email,
        password,
      });
      setMessage('Registration successful! You can now log in.');
      setView('login'); // Switch back to login view
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        setError(err.response?.data?.message || 'Registration failed.');
      } else {
        setError('An unexpected error occurred.');
      }
    }
  };

  return (
    <div className="login-page">
      <div className="login-wrapper">
        <div className="text-center mt-4 name">
          {view === 'login' && 'Login'}
          {view === 'forgotPassword' && 'Forgot Password'}
          {view === 'register' && 'Register'}
        </div>

        {view === 'login' && (
          <form className="p-3 mt-3" onSubmit={handleLogin}>
            <div className="form-field d-flex align-items-center">
              <span className="far fa-user"></span>
              <input
                type="text"
                placeholder="Username"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="off"
              />
            </div>
            <div className="form-field d-flex align-items-center">
              <span className="fas fa-key"></span>
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <div className="form-options d-flex justify-content-between">
              <label className="remember-me">
                <input type="checkbox" /> Remember me
              </label>
              <button
                className="forgot-password-btn"
                type="button"
                onClick={() => setView('forgotPassword')}
              >
                Forgot Password?
              </button>
            </div>
            <button className="btn mt-3" type="submit">
              Login
            </button>
          </form>
        )}

        {view === 'forgotPassword' && (
          <div className="forgot-password-form">
            <p className="forgot-password-instructions">
              Please enter your email address. You will receive an email with instructions to reset your password.
            </p>
            <div className="form-field">
              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <button className="btn mt-3" onClick={requestResetCode}>
              Reset Password
            </button>
            <button
              className="link-btn mt-3"
              onClick={() => setView('login')}
              style={{
                background: 'none',
                border: 'none',
                color: '#6C3BAA',
                textDecoration: 'underline',
                cursor: 'pointer',
              }}
            >
              Back to Login
            </button>
          </div>
        )}

        {view === 'register' && (
          <div className="register-form">
            <p className="register-instructions">
              Please fill in your details to create an account.
            </p>
            <div className="form-field">
              <input
                type="text"
                placeholder="Username"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="form-field">
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <div className="form-field">
              <input
                type="password"
                placeholder="Confirm Password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </div>
            <button className="btn mt-3" onClick={handleRegister}>
              Register
            </button>
            <button
              className="link-btn mt-3"
              onClick={() => setView('login')}
              style={{
                background: 'none',
                border: 'none',
                color: '#6C3BAA',
                textDecoration: 'underline',
                cursor: 'pointer',
              }}
            >
              Back to Login
            </button>
          </div>
        )}

        {view === 'login' && (
          <div className="register-section">
            Don’t have an account?{' '}
            <button
              className="register-link"
              onClick={() => setView('register')}
              style={{
                background: 'none',
                border: 'none',
                color: '#6C3BAA',
                textDecoration: 'underline',
                cursor: 'pointer',
              }}
            >
              Register
            </button>
          </div>
        )}

        {error && <p className="error-message">{error}</p>}
        {message && <p className="success-message">{message}</p>}
      </div>
    </div>
  );
};

export default Login;
