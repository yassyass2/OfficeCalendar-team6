import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../styles/forgotpassword.css'; // Import scoped styles

const ForgotPassword: React.FC = () => {
  const [email, setEmail] = useState<string>(''); // Email input
  const [code, setCode] = useState<string>(''); // Reset code
  const [password, setPassword] = useState<string>(''); // New password
  const [confirmPassword, setConfirmPassword] = useState<string>(''); // Confirm new password
  const [stage, setStage] = useState<number>(1); // Stages: 1 = Request code, 2 = Reset password
  const [message, setMessage] = useState<string | null>(null); // Success message
  const [error, setError] = useState<string | null>(null); // Error message

  const navigate = useNavigate();

  // Request reset code
  const requestResetCode = async () => {
    try {
      const response = await axios.post<string>('http://localhost:5000/api/login/forgot-password', { email });
      setMessage(response.data);
      setStage(2); // Move to reset password stage
      setError(null); // Clear previous error
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        setError(err.response?.data || 'Failed to request reset code.');
      } else {
        setError('An unexpected error occurred.');
      }
    }
  };

  // Reset the password
  const resetPassword = async () => {
    if (password !== confirmPassword) {
      setError('Passwords do not match!');
      return;
    }
    try {
      const response = await axios.post<string>('http://localhost:5000/api/login/reset-password', {
        code,
        password,
        confirmPassword,
      });
      setMessage(response.data);
      setError(null); // Clear previous error
      navigate('/'); // Redirect to login page
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        setError(err.response?.data || 'Failed to reset password.');
      } else {
        setError('An unexpected error occurred.');
      }
    }
  };

  // Resend the reset code
  const resendCode = async () => {
    try {
      await axios.post<string>('http://localhost:5000/api/login/forgot-password', { email });
      setMessage('Reset code resent! Please check your email.');
      setError(null); // Clear previous error
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        setError(err.response?.data || 'Failed to resend reset code.');
      } else {
        setError('An unexpected error occurred.');
      }
    }
  };

  return (
    <div className="forgot-password-page">
      <div className="forgot-password-wrapper">
        {stage === 1 && (
          <div>
            {/* Changed "Forgot Password" from header to a div */}
            <div className="forgot-password-title">Forgot Password</div>
            <div className="form-field">
              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <button className="btn" onClick={requestResetCode}>
              Request Reset Code
            </button>
            <button className="return-btn" onClick={() => navigate('/')}>
              Return to Login
            </button>
          </div>
        )}

        {stage === 2 && (
          <div>
            {/* Changed "Reset Password" from header to a div */}
            <div className="forgot-password-title">Reset Password</div>
            <p className="message">{message || 'Enter the code sent to your email.'}</p>
            <div className="form-field">
              <input
                type="text"
                placeholder="Enter reset code"
                value={code}
                onChange={(e) => setCode(e.target.value)}
              />
            </div>
            <div className="form-field">
              <input
                type="password"
                placeholder="New password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <div className="form-field">
              <input
                type="password"
                placeholder="Confirm new password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </div>
            <button className="btn" onClick={resetPassword}>
              Reset Password
            </button>
            <div className="text-center">
              <button className="link-btn" onClick={resendCode}>
                Resend Code
              </button>
              <button
                className="link-btn"
                onClick={() => {
                  setStage(1);
                  setError(null);
                  setMessage(null);
                }}
              >
                Go Back
              </button>
            </div>
          </div>
        )}

        {error && <p className="error-message">{error}</p>}
        {message && stage === 1 && <p className="success-message">{message}</p>}
      </div>
    </div>
  );
};

export default ForgotPassword;
