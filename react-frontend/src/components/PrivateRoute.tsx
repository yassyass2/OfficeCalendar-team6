import React from 'react';
import { Navigate } from 'react-router-dom';

interface PrivateRouteProps {
  children: JSX.Element;
}

function PrivateRoute({ children }: PrivateRouteProps) {
  const token = localStorage.getItem('authToken');

  // If no token is found, redirect to /login
  if (!token) {
    return <Navigate to="/" replace />;
  }

  // Otherwise, render the protected component
  return children;
}

export default PrivateRoute;
