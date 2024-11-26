import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './components/Login'; // Updated: No need for .js extension
import Calendar from './components/Calendar';
import ForgotPassword from './components/ForgotPassword';

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} /> {/* Login Page */}
        <Route path="/Calendar" element={<Calendar />} /> {/* Calendar Page */}
        <Route path="/forgot-password" element={<ForgotPassword />} /> {/* Forgot Password */}
      </Routes>
    </Router>
  );
};

export default App;
