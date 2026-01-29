// src/components/layout/AdminLayout.tsx
import React from 'react';
import AdminSidebar from './AdminSidebar';
import { Toaster } from 'react-hot-toast';

interface AdminLayoutProps {
  children: React.ReactNode;
}

const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-red-500/30">
      <AdminSidebar />
      <div className="ml-64 p-8">
        <Toaster 
          position="top-right"
          toastOptions={{
            style: {
              background: '#0f172a',
              color: '#fff',
              border: '1px solid #1e293b',
            },
          }}
        />
        {children}
      </div>
    </div>
  );
};

export default AdminLayout;