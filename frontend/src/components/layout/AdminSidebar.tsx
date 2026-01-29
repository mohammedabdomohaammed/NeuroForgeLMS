// src/components/layout/AdminSidebar.tsx
import React from 'react';
import { NavLink, Link } from 'react-router-dom';
import { 
  LayoutDashboard, 
  FileCode, 
  Users, 
  Settings, 
  LogOut, 
  ShieldAlert,
  BarChart3,
  Eye
} from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';

const AdminSidebar = () => {
  const { logout } = useAuth();

  const navItems = [
    { name: 'Control Center', path: '/admin', icon: LayoutDashboard },
    { name: 'Problem Management', path: '/admin/create-problem', icon: FileCode },
    { name: 'User Database', path: '/admin/users', icon: Users },
    { name: 'System Analytics', path: '/admin/analytics', icon: BarChart3 },
    { name: 'Platform Settings', path: '/admin/settings', icon: Settings },
  ];

  return (
    <div className="h-screen w-64 bg-slate-950 border-r border-slate-800 flex flex-col fixed left-0 top-0 z-50">
      {/* Admin Header */}
      <div className="p-6 border-b border-slate-800 bg-red-950/10">
        <div className="flex items-center gap-2 text-red-500 mb-1">
          <ShieldAlert className="w-5 h-5" />
          <span className="text-xs font-bold tracking-wider uppercase">Admin Access</span>
        </div>
        <h1 className="text-xl font-bold text-white tracking-tight">
          PyForge <span className="text-slate-500">Core</span>
        </h1>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            end={item.path === '/admin'} // Exact match for root
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all ${
                isActive
                  ? 'bg-red-500/10 text-red-400 border border-red-500/20 shadow-lg shadow-red-900/20'
                  : 'text-slate-400 hover:bg-slate-900 hover:text-white'
              }`
            }
          >
            <item.icon className="w-5 h-5" />
            {item.name}
          </NavLink>
        ))}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-slate-800 bg-slate-900/50">
        <div className="flex items-center gap-3 mb-4 px-4">
          <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
          <span className="text-xs text-slate-500 font-mono">System Online</span>
        </div>

        {/* View Live Site Button */}
        <Link 
          to="/dashboard" 
          className="flex items-center gap-3 px-4 py-3 w-full text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors text-sm font-medium mb-2 border border-dashed border-slate-800"
        >
          <Eye className="w-5 h-5" />
          View Live Site
        </Link>

        <button
          onClick={logout}
          className="flex items-center gap-3 px-4 py-3 w-full text-slate-400 hover:text-red-400 hover:bg-red-900/10 rounded-lg transition-colors text-sm font-medium"
        >
          <LogOut className="w-5 h-5" />
          Exit Console
        </button>
      </div>
    </div>
  );
};

export default AdminSidebar;