// src/components/Register.tsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { registerUser, RegisterRequest } from '../api/login-api'; // Adjust import path

const Register: React.FC = () => {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');
  const [firstName, setFirstName] = useState<string>('');
  const [lastName, setLastName] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  const navigate = useNavigate();

  const handleRegister = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setMessage(null);

    // Basic client-side check, optional:
    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    try {
      // If your backend expects { email, password, confirmPassword }
      const payload: RegisterRequest = {
        email,
        password,
        confirmPassword,
        firstName,
        lastName,
      };

      const response = await registerUser(payload);
      // If backend returns a message, show it:
      setMessage(response.message || 'Registration successful!');
      // Optionally redirect to login after success
      // navigate('/');
    } catch (err: any) {
      // If the backend sends back an error message
      if (typeof err === 'string') {
        setError(err);
      } else if (err?.message) {
        setError(err.message);
      } else {
        setError('Registration failed');
      }
    }
  };

  return (
    <section className="row">
      <div className="col-4 login-container position-absolute top-50 start-50 translate-middle text-center align-items-center">
        <h2>Register</h2>

        <form onSubmit={handleRegister}>

          <div className="form-field d-flex">
            <input
              type="text"
              placeholder="First Name"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
            />
          </div>

          <div className="form-field d-flex">
            <input
              type="text"
              placeholder="Last Name"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
            />
          </div>


          <div className="form-field d-flex">
            <input
              type="email"
              placeholder="Email"
              autoComplete="off"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="form-field d-flex">
            <input
              type="password"
              placeholder="Password"
              autoComplete="off"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <div className="form-field d-flex">
            <input
              type="password"
              placeholder="Confirm Password"
              autoComplete="off"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </div>

          <div className="container-fluid">
            <div className="row">
              <button className="btn-primary" type="submit">
                Register
              </button>
            </div>
          </div>
        </form>

        {error && <p className="error-message">{error}</p>}
        {message && <p className="success-message">{message}</p>}

        <div className="container-fluid">
          <div className="row mt-3">
            <span>Already have an account? </span>
            <button
              className="btn-simple"
              style={{ marginLeft: '5px' }}
              onClick={() => navigate('/')}
            >
              Login
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Register;
