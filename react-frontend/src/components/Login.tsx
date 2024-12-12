import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';


const Login: React.FC = () => {
  const [view, setView] = useState<'login' | 'forgotPassword'>('login'); // Track current view
  const [email, setEmail] = useState<string>(''); // Email input
  const [password, setPassword] = useState<string>(''); // Password input
  const [error, setError] = useState<string | null>(null); // Error message
  const [message, setMessage] = useState<string | null>(null); // Success message
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
      navigate('/Calendar'); // Redirect to Calendar
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        setError(err.response?.data?.message || 'Login failed. Check your credentials');
      } else {
        setError('An unexpected error occurred');
      }
    }
  };

  const requestResetCode = async () => {
    try {
      const response = await axios.post('http://localhost:5000/api/login/forgot-password', { email });
      setMessage('Reset instructions have been sent to your email');
      setError(null);
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        setError(err.response?.data || 'Failed to send reset instructions');
      } else {
        setError('An unexpected error occurred');
      }
    }
  };

  return (
    <div className="login-page">
      <div className="login-wrapper">
        <div className="text-center mt-4 name">
          {view === 'login' ? 'Login' : 'Forgot Password'}
        </div>

        {view === 'login' && (
          <form className="p-3 mt-3" onSubmit={handleLogin}>
            <div className="form-field d-flex align-items-center">
              <span className="far fa-user"></span>
              <input
                type="text"
                placeholder="Username or Email"
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

        <div className="register-section">
          Don’t have an account?{' '}
          <button className="register-link" onClick={() => navigate('/sign-up')}>
            Register
          </button>
        </div>

        {error && <p className="error-message">{error}</p>}
        {message && <p className="success-message">{message}</p>}
      </div>
    </div>
  );
};

export default Login;
