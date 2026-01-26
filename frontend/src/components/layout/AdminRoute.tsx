import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

const AdminRoute = ({ children }: { children: JSX.Element }) => {
  const { user, loading } = useAuth();

  if (loading) return <div>Loading...</div>;
  
  // Must be logged in AND have role 'admin'
  if (user && user.role === 'admin') {
    return children;
  }
  
  return <Navigate to="/dashboard" />;
};

export default AdminRoute;