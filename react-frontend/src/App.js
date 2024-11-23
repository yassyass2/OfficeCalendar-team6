import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './components/Login'; // Your Login component
import Calendar from './components/Calendar'; // The page after login

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} /> {/* Login Page */}
        <Route path="/Calendar" element={<Calendar />} /> {/* Calander */}
      </Routes>
    </Router>
  );
}

export default App;
