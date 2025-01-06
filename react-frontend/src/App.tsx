import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

// Import components
import Login from './components/Login';
import Register from './components/Register';
import Calendar from './components/Calendar';
import AdminMenu from './components/AdminMenu';
import UserDashboard from './components/UserDashboard';
import SidePanel from './components/SidePanel';

// Misc imports
import { Breadcrumbs } from './components/misc/Breadcrumbs';
import { Nav } from './components/misc/Nav';
import { Footer } from './components/misc/Footer';

// Import main stylesheet
import './scss/style.scss';

const App: React.FC = () => {
  return (
    <Router>
      {/* Navbar component */}
      {<Nav />}

      {/* Main content */}
      <main className="container main-content g-0 flex-1">
        {/* Breadcrumbs component */}
        {<Breadcrumbs />}
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/sign-up" element={<Register />} />
          <Route path="/calendar" element={<Calendar />} />
          <Route path="/admin" element={<AdminMenu />} />
          <Route path="/user" element={<UserDashboard />} />
          <Route path="/sidepanel" element={<SidePanel />} />
          <Route path="/404" element={<div className="g-0 pt-4"><h3><strong>Error 404 - Not Found</strong></h3></div>} />
          <Route path="*" element={<Navigate replace to="/404" />} />
        </Routes>
      </main>

      {/* Footer component */}
      {<Footer />}
    </Router>
  );
};

export default App;