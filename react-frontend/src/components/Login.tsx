import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import {jwtDecode, JwtPayload} from 'jwt-decode';


const Login: React.FC = () => {
    const [view, setView] = useState<'login' | 'forgotPassword' | 'register' | 'resetCode'>('login');

    interface CustomJwtPayload extends JwtPayload {
        Name?: string;
        Role?: string;
        Sid?: string;
      }

    // For login & forgot password
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');

    // For register
    const [confirmPassword, setConfirmPassword] = useState<string>('');
    const [firstName, setFirstName] = useState<string>('');
    const [lastName, setLastName] = useState<string>('');

    // Add state for the code
    const [resetCode, setResetCode] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword2, setConfirmPassword2] = useState('');



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
            // Only store the token if it exists:
            if (response.data.token) {
                localStorage.setItem('authToken', response.data.token);
                const decoded = jwtDecode<CustomJwtPayload>(response.data.token);
                localStorage.setItem('userId', decoded.Sid as string)

            } else {
                setError('No token received. Please try again.');
                return;
            }

            navigate('/user'); // Redirect to User after login

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
            setView('resetCode');

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


    const verifyResetCode = async () => {
        setError(null);
        setMessage(null);
    
        try {
          const response = await axios.post('http://localhost:5000/api/login/reset-password', {
            code: resetCode,
            password: newPassword,
            confirmPassword: confirmPassword2,
          });
    
          // If success:
          setMessage(response.data.message || 'Password reset successful!');
          // Optionally redirect to login
          setView('login');
        } catch (err: unknown) {
          if (axios.isAxiosError(err)) {
            setError(err.response?.data || 'Failed to reset password');
          } else {
            setError('An unexpected error occurred');
          }
        }
      };
      

    return (
        <section className="row">
            <div className="col-4 login-container position-absolute top-50 start-50 translate-middle text-center align-items-center">

                {/* Title depends on which view we're on */}
                <h1>
                {view === 'login'
                    ? 'Login'
                    : view === 'forgotPassword'
                    ? 'Forgot Password'
                    : view === 'register'
                        ? 'Register'
                        : 'Reset Password'}
                </h1>

                {/* ----- LOGIN VIEW ----- */}
                {view === 'login' && (
                    <form className="align-items-center" onSubmit={handleLogin}>
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
                            Please enter your email address.
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

                {/* ----- RESET PASSWORD (code + new password) ----- */}
                {view === 'resetCode' && (
                <div className="reset-code-form">
                    <p>Please enter the 6-digit code, then choose your new password:</p>

                    {/* CODE INPUT */}
                    <div className="form-field d-flex">
                    <input
                        type="text"
                        placeholder="Enter 6-digit code"
                        value={resetCode}
                        onChange={(e) => setResetCode(e.target.value)}
                    />
                    </div>

                    {/* NEW PASSWORD INPUT */}
                    <div className="form-field d-flex">
                    <input
                        type="password"
                        placeholder="New Password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                    />
                    </div>

                    {/* CONFIRM NEW PASSWORD INPUT */}
                    <div className="form-field d-flex">
                    <input
                        type="password"
                        placeholder="Confirm New Password"
                        value={confirmPassword2}
                        onChange={(e) => setConfirmPassword2(e.target.value)}
                    />
                    </div>

                    <div className="container-fluid">
                    <div className="row">
                        <button className="btn-primary mt-3" onClick={verifyResetCode}>
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
