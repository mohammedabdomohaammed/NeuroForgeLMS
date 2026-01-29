// src/pages/admin/UserDatabase.tsx
import React, { useState } from 'react';
import AdminLayout from '../../components/layout/AdminLayout';
import { Search, MoreVertical, Shield, User, Mail, Ban, CheckCircle } from 'lucide-react';
import { Button } from '../../components/ui/Button';

const UserDatabase = () => {
  const [searchTerm, setSearchTerm] = useState('');

  // Mock Data (Replace with API call to /api/users in production)
  const users = [
    { id: 1, name: 'Shah Rizvi', email: 'admin@pyforge.com', role: 'admin', status: 'Active', joined: '2026-01-10' },
    { id: 2, name: 'John Doe', email: 'john@example.com', role: 'candidate', status: 'Active', joined: '2026-01-28' },
    { id: 3, name: 'Jane Smith', email: 'jane@example.com', role: 'candidate', status: 'Banned', joined: '2026-01-29' },
  ];

  return (
    <AdminLayout>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-white">User Database</h1>
          <p className="text-slate-400">Manage access and permissions.</p>
        </div>
        <Button className="!w-auto bg-slate-800 hover:bg-slate-700">Export CSV</Button>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
        {/* Filters */}
        <div className="p-4 border-b border-slate-800 flex gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
            <input 
              type="text" 
              placeholder="Search users..." 
              className="w-full bg-slate-950 border border-slate-700 rounded-lg pl-10 pr-4 py-2 text-sm text-white focus:outline-none focus:border-red-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {/* Table */}
        <table className="w-full text-left text-sm text-slate-400">
          <thead className="bg-slate-950 text-slate-200 uppercase font-bold text-xs">
            <tr>
              <th className="px-6 py-4">User</th>
              <th className="px-6 py-4">Role</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4">Joined</th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800">
            {users.map((user) => (
              <tr key={user.id} className="hover:bg-slate-800/50">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center text-white font-bold">
                      {user.name.charAt(0)}
                    </div>
                    <div>
                      <div className="text-white font-medium">{user.name}</div>
                      <div className="text-xs text-slate-500 flex items-center gap-1">
                        <Mail className="w-3 h-3" /> {user.email}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs border w-fit ${
                    user.role === 'admin' 
                      ? 'bg-red-500/10 text-red-400 border-red-500/20' 
                      : 'bg-blue-500/10 text-blue-400 border-blue-500/20'
                  }`}>
                    {user.role === 'admin' ? <Shield className="w-3 h-3" /> : <User className="w-3 h-3" />}
                    {user.role}
                  </span>
                </td>
                <td className="px-6 py-4">
                  {user.status === 'Active' ? (
                    <span className="text-green-400 flex items-center gap-1"><CheckCircle className="w-3 h-3" /> Active</span>
                  ) : (
                    <span className="text-slate-500 flex items-center gap-1"><Ban className="w-3 h-3" /> Banned</span>
                  )}
                </td>
                <td className="px-6 py-4">{user.joined}</td>
                <td className="px-6 py-4 text-right">
                  <button className="text-slate-400 hover:text-white">
                    <MoreVertical className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </AdminLayout>
  );
};

export default UserDatabase;