import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { jwtDecode, JwtPayload } from 'jwt-decode';


const Login: React.FC = () => {
    const [view, setView] = useState<'login' | 'forgotPassword' | 'register' | 'resetCode' | 'verify' | 'accountVerified'>('login');

    interface CustomJwtPayload extends JwtPayload {
        email?: string;
        role?: string;
        user_id?: string;
    }

    // For login & forgot password
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');

    // For register
    const [confirmPassword, setConfirmPassword] = useState<string>('');
    const [firstName, setFirstName] = useState<string>('');
    const [lastName, setLastName] = useState<string>('');

    // state for the resetpassword code
    const [resetCode, setResetCode] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword2, setConfirmPassword2] = useState('');

    // state for verification
    const [verificationCode, setVerificationCode] = useState<string>('');

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
                if (!decoded.user_id || !decoded.email || !decoded.role) {
                    throw new Error("(user_id) or (email) or (role) is missing in the token.");
                }
                localStorage.setItem('userId', decoded.user_id)
                localStorage.setItem('CurrentUserEmail', decoded.email)
                localStorage.setItem('CurrentUserRole', decoded.role)

            } else {
                setError('No token received. Please try again.');
                return;
            }

            navigate('/user'); // Redirect to User after login

        } catch (err: unknown) {
            if (axios.isAxiosError(err)) {
                setError(err.response?.data?.message || 'Login failed. Check your credentials');
            } else {
                setError('An unexpected error occurred' + err);
            }
        }
    };

    // ----- FORGOT PASSWORD -----
    const requestResetCode = async () => {
        try {
            const response = await axios.post('http://localhost:5000/api/login/forgot-password', { email });
            setMessage('Reset instructions have been sent to your email');
            setError(null);
            clearResetPasswordFields();
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
            setView('verify');
        } catch (err: unknown) {
            if (axios.isAxiosError(err)) {
                setError(err.response?.data || 'Registration failed.');
            } else {
                setError('An unexpected error occurred during registration.');
            }
        }
    };

    const handleVerify = async () => {
        setError(null);
        setMessage(null);
    
        try {
            const response = await axios.post('http://localhost:5000/api/login/verify', {
                code: verificationCode, // Only send the code
            });
     
            
            setMessage('Account verified successfully!');
            setView('accountVerified');
        } catch (err) {
            if (axios.isAxiosError(err)) {
                setError(err.response?.data || 'Verification failed.');
            } else {
                setError('An unexpected error occurred during verification.');
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

    // ----- Reset Massege -----
    const clearMessage = () => {
        setMessage(null);
        setError(null);
    };

    // ----- Reset fields for new password -----
    const clearResetPasswordFields = () => {
        setResetCode('');
        setNewPassword('');
        setConfirmPassword2('');
    };

    // ----- Reset fields for register -----
    const clearRegisterFields = () => {
        setEmail('');
        setPassword('');
        setConfirmPassword('');
        setFirstName('');
        setLastName('');
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
                        : view === 'verify'
                        ? 'Verify Account'
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
                                onClick={() => {
                                    clearMessage(); 
                                    setView('forgotPassword');
                                }}
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
                                    onClick={() => {
                                        clearMessage(); 
                                        clearResetPasswordFields();
                                        setView('login');
                                    }}
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
                                    onClick={() => {
                                        clearMessage(); 
                                        clearRegisterFields();
                                        setView('login');
                                    }}
                                >
                                    Back to Login
                                </a>
                            </div>
                        </div>
                    </form>
                )}

                {/* ----- Verify Account ----- */}
                {view === 'verify' && (
                    <form className="login-form align-items-center">
                        <p>Please enter the 6-digit code sent to your email:</p>

                        <div className="form-field d-flex">
                            <input
                                type="text"
                                placeholder="Enter verification code"
                                value={verificationCode}
                                onChange={(e) => setVerificationCode(e.target.value)}
                            />
                        </div>

                        <div className="container-fluid">
                            <div className="row">
                                <button className="btn-primary mt-3" onClick={handleVerify}>
                                    Verify
                                </button>
                            </div>
                        </div>

                        <div className="container-fluid">
                            <div className="row">
                                <a
                                    className="btn-simple pt-3"
                                    onClick={() => {
                                        clearMessage(); 
                                        setView('register');
                                    }}
                                >
                                    Back to Register
                                </a>
                            </div>
                        </div>
                    </form>
                )}

                {/* ----- Account verified, back to login ----- */}
                {view === 'accountVerified' && (
                    <section className="text-center">
                        <h1>Account Verified</h1>
                        <strong>Your account has been verified successfully. You can now log in to continue.</strong>
                        <button
                            className="btn-primary mt-3"
                            onClick={() => {
                                clearMessage();
                                setView('login'); // Navigate back to the login view
                            }}
                        >
                            Back to Login
                        </button>
                    </section>
                )}


                {/* ----- RESET PASSWORD (code + new password) ----- */}
                {view === 'resetCode' && (
                <form className="login-form align-items-center">

                    {message && <p className="success-message">{message}</p>} 
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
                        onClick={() => {
                            clearMessage(); 
                            clearResetPasswordFields();
                            setView('login');
                        }}
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
                        {view !== 'register' && view !== 'verify' &&(
                            <>
                                <span className="mb-1">Don’t have an account?{' '}</span>
                                <a
                                    className="btn-simple"
                                    onClick={() => {
                                        clearMessage(); 
                                        clearRegisterFields();
                                        setView('register');
                                    }}
                                >
                                    Register here
                                </a>
                            </>
                        )}
                    </div>
                </div>


                {/* ----- ERROR / SUCCESS MESSAGES ----- */}
                {error && <p className="error-message">{error}</p>}
            </div>
        </section>
    );
};

export default Login;
