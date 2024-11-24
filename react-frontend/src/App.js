import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './components/Login'; // Your Login component
import Calendar from './components/Calendar'; // The page after login
import ForgotPassword from './components/ForgotPassword';


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} /> {/* Login Page */}
        <Route path="/Calendar" element={<Calendar />} /> {/* Calander */}
        <Route path="/forgot-password" element={<ForgotPassword />} />
      </Routes>
    </Router>
  );
}

export default App;
