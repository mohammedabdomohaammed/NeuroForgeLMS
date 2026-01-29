// src/components/layout/AdminRoute.tsx
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

const AdminRoute = ({ children }: { children: JSX.Element }) => {
  const { user, loading } = useAuth();

  if (loading) return <div className="min-h-screen bg-slate-950 flex items-center justify-center text-red-500 font-mono">Verifying Clearance...</div>;

  // 1. Must be logged in
  if (!user) {
    return <Navigate to="/admin/login" />;
  }

  // 2. Must be an ADMIN
  if (user.role !== 'admin') {
    return <Navigate to="/dashboard" />; // Kick them back to student dashboard
  }

  return children;
};

export default AdminRoute;