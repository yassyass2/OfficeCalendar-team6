import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

import Login from './components/Login';
import Calendar from './components/Calendar';
import AdminMenu from './components/AdminMenu';
import UserDashboard from './components/UserDashboard';
import ContactForm from './components/Contact';
import PrivateRoute from './components/PrivateRoute';

import { Breadcrumbs } from './components/misc/Breadcrumbs';
import { Nav } from './components/misc/Nav';
import { Footer } from './components/misc/Footer';

import './scss/style.scss';


const App: React.FC = () => {
    return (
        <Router>
            <Nav />

            <main className="container main-content g-0 flex-1">
                <Breadcrumbs />
                <Routes>
                    {/* Public routes */}
                    <Route path="/" element={<Login />} />
                    <Route path="/calendar" element={<Calendar />} />
                    <Route path="/contact" element={<ContactForm />} />

                    {/* this one is to protect from manually typing /user in url */}
                    <Route
                        path="/user"
                        element={
                            <PrivateRoute>
                                <UserDashboard />
                            </PrivateRoute>
                        }
                    />

                    {/* Possibly protect /admin too */}
                    <Route
                        path="/admin"
                        element={
                            <PrivateRoute>
                                <AdminMenu />
                            </PrivateRoute>
                        }
                    />

                    <Route
                        path="/404"
                        element={
                            <div className="g-0 pt-4">
                                <h3>
                                    <strong>Error 404 - Not Found</strong>
                                </h3>
                            </div>
                        }
                    />
                    <Route path="*" element={<Navigate replace to="/404" />} />
                </Routes>
            </main>

            <Footer />
        </Router>
    );
};

export default App;
