import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [stage, setStage] = useState(1); // 1: Email Input, 2: Code and Password Input
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const navigate = useNavigate();

  // Request reset code
  const requestResetCode = async () => {
    try {
      const response = await axios.post('http://localhost:5000/api/login/forgot-password', { email });
      setMessage(response.data);
      setStage(2); // Move to the next stage
    } catch (err) {
      setError(err.response?.data || 'Failed to request reset code');
    }
  };

  // Reset the password
  const resetPassword = async () => {
    try {
      const response = await axios.post('http://localhost:5000/api/login/reset-password', {
        code,
        password,
        confirmPassword,
      });
      setMessage(response.data);
      navigate('/'); // Redirect to login after successful reset
    } catch (err) {
      setError(err.response?.data || 'Failed to reset password');
    }
  };

  // Resend the reset code
  const resendCode = async () => {
    try {
      const response = await axios.post('http://localhost:5000/api/login/forgot-password', { email });
      setMessage('Reset code resent! Please check your email.');
    } catch (err) {
      setError(err.response?.data || 'Failed to resend reset code');
    }
  };

  return (
    <div className="forgot-password-wrapper">
      {stage === 1 && (
        <div>
          <h2 className="header">Forgot Password</h2>
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
          <button
            className="return-btn"
            onClick={() => navigate('/')} // Redirect to Login page
          >
            Return to Login
          </button>
        </div>
      )}

      {stage === 2 && (
        <div>
          <h2 className="header">Reset Password</h2>
          <p style={{ textAlign: 'center', color: 'green' }}>
            {message || 'Enter the code sent to your email.'}
          </p>

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
            <button
              className="link-btn"
              onClick={resendCode}
              style={{
                background: 'none',
                border: 'none',
                color: '#03A9F4',
                cursor: 'pointer',
                textDecoration: 'underline',
                margin: '10px 5px',
              }}
            >
              Resend Code
            </button>
            <button
              className="link-btn"
              onClick={() => {
                setStage(1); // Go back to email input stage
                setError(null); // Clear error
                setMessage(null); // Clear success message
              }}
            >
              Go Back
            </button>
          </div>
        </div>
      )}

      {error && <p style={{ color: 'red', textAlign: 'center' }}>{error}</p>}
      {message && stage === 1 && <p style={{ color: 'green', textAlign: 'center' }}>{message}</p>}
    </div>
  );
}

export default ForgotPassword;
