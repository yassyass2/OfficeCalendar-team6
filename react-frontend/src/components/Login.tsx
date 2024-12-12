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
    <section className="row">
      <div className="col-4 login-container position-absolute top-50 start-50 translate-middle text-center align-items-center">
        <div className="login-text">
          {view === 'login' ? 'Login' : 'Forgot Password'}
        </div>

        {view === 'login' && (
          <form className="login-form align-items-center" onSubmit={handleLogin}>
            <div className="form-field d-flex">
              <input
                type="text"
                placeholder="Username or Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="off"
              />
            </div>
            <div className="form-field d-flex">
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <div className="container-fluid">
              <div className="row">
                <button className="btn-primary" type="submit">
                  Login
                  <i className="fa-solid fa-caret-right"></i>
                </button>
              </div>
            </div>

            <div className="form-options d-flex justify-content-between">
              {/* <label className="remember-me">
                <input type="checkbox" /> Remember me
              </label> */}
              <a
                className="btn-simple"
                onClick={() => setView('forgotPassword')}
              >
                Forgot Password?
              </a>
            </div>
          </form>
        )}

        <div className="container-fluid">
          <div className="row">
            <span className="mb-1">Don’t have an account?{' '}</span>
            <a className="btn-simple" onClick={() => navigate('/sign-up')}>
              Register here
            </a>
          </div>
        </div>

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
            <div className="container-fluid">
              <div className="row">
                <button className="btn-primary mt-3" onClick={requestResetCode}>
                  Reset Password
                </button>
              </div>
            </div>
            <div className="container-fluid">
              <div className="row">
                <a
                  className="btn-simple pt-3"
                  onClick={() => setView('login')}
                >
                  Back to Login
                </a>
              </div>
            </div>
          </div>
        )}

        {error && <p className="error-message">{error}</p>}
        {message && <p className="success-message">{message}</p>}
      </div>
    </section >
  );
};

export default Login;
