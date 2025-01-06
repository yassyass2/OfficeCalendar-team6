import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Login: React.FC = () => {
  const [view, setView] = useState<'login' | 'forgotPassword' | 'register'>('login');

  // For login & forgot password
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');

  // For register
  const [confirmPassword, setConfirmPassword] = useState<string>('');
  const [firstName, setFirstName] = useState<string>('');
  const [lastName, setLastName] = useState<string>('');

  // For displaying errors/messages
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  const navigate = useNavigate();

  // ----- LOGIN -----
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
        setError(err.response?.data?.message || 'Login failed. Check your credentials');
      } else {
        setError('An unexpected error occurred');
      }
    }
  };

  // ----- FORGOT PASSWORD -----
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

  // ----- REGISTER -----
  const handleRegister = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setMessage(null);

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    try {
      const response = await axios.post('http://localhost:5000/api/login/register', {
        firstName,
        lastName,
        email,
        password,
        confirmPassword,
      });
      // The backend returns either a string or { message: ... }
      if (typeof response.data === 'string') {
        setMessage(response.data);
      } else if (response.data.message) {
        setMessage(response.data.message);
      } else {
        setMessage('Registration successful!');
      }
      // Optionally switch back to login view:
      // setView('login');
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        setError(err.response?.data || 'Registration failed.');
      } else {
        setError('An unexpected error occurred during registration.');
      }
    }
  };

  return (
    <section className="row">
      <div className="col-4 login-container position-absolute top-50 start-50 translate-middle text-center align-items-center">

        {/* Title depends on which view we're on */}
        <div className="login-text">
          {view === 'login'
            ? 'Login'
            : view === 'forgotPassword'
              ? 'Forgot Password'
              : 'Register'}
        </div>

        {/* ----- LOGIN VIEW ----- */}
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
              <a
                className="btn-simple"
                onClick={() => setView('forgotPassword')}
              >
                Forgot Password?
              </a>
            </div>
          </form>
        )}

        {/* ----- FORGOT PASSWORD VIEW ----- */}
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

        {/* ----- REGISTER VIEW ----- */}
        {view === 'register' && (
          <form className="login-form align-items-center" onSubmit={handleRegister}>
            <div className="form-field d-flex">
              <input
                type="text"
                placeholder="First Name"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                autoComplete="off"
              />
            </div>

            <div className="form-field d-flex">
              <input
                type="text"
                placeholder="Last Name"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                autoComplete="off"
              />
            </div>

            <div className="form-field d-flex">
              <input
                type="email"
                placeholder="Email"
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

            <div className="form-field d-flex">
              <input
                type="password"
                placeholder="Confirm Password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </div>

            <div className="container-fluid">
              <div className="row">
                <button className="btn-primary" type="submit">
                  Register
                  <i className="fa-solid fa-caret-right"></i>
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
          </form>
        )}

        {/* ----- FOOTER LINKS ----- */}
        <div className="container-fluid">
          <div className="row">
            {view !== 'register' && (
              <>
                <span className="mb-1">Don’t have an account?{' '}</span>
                <a
                  className="btn-simple"
                  onClick={() => setView('register')}
                >
                  Register here
                </a>
              </>
            )}
          </div>
        </div>

        {/* ----- ERROR / SUCCESS MESSAGES ----- */}
        {error && <p className="error-message">{error}</p>}
        {message && <p className="success-message">{message}</p>}
      </div>
    </section>
  );
};

export default Login;
