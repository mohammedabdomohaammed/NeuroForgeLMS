// src/pages/admin/AdminDashboard.tsx
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminLayout from '../../components/layout/AdminLayout'; // Use NEW Layout
import api from '../../services/api';
import { Button } from '../../components/ui/Button';
import { 
  Plus, 
  Trash2, 
  Search, 
  Filter, 
  Database, 
  Users, 
  Server,
  MoreVertical,
  Edit
} from 'lucide-react';
import toast from 'react-hot-toast';

const AdminDashboard = () => {
  const [problems, setProblems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterDifficulty, setFilterDifficulty] = useState('All');
  const navigate = useNavigate();

  useEffect(() => {
    fetchProblems();
  }, []);

  const fetchProblems = async () => {
    try {
      const { data } = await api.get('/problems');
      setProblems(data);
    } catch (error) {
      toast.error('Failed to load system data');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('⚠️ WARNING: Delete this problem? This cannot be undone.')) return;
    try {
      await api.delete(`/problems/${id}`);
      toast.success('Problem deleted from database');
      fetchProblems(); 
    } catch (error) {
      toast.error('Delete failed');
    }
  };

  // Advanced Filtering Logic
  const filteredProblems = problems.filter(prob => {
    const matchesSearch = prob.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDiff = filterDifficulty === 'All' || prob.difficulty === filterDifficulty;
    return matchesSearch && matchesDiff;
  });

  const stats = {
    total: problems.length,
    easy: problems.filter(p => p.difficulty === 'Easy').length,
    medium: problems.filter(p => p.difficulty === 'Medium').length,
    hard: problems.filter(p => p.difficulty === 'Hard').length,
  };

  return (
    <AdminLayout>
      {/* Header */}
      <div className="flex justify-between items-end mb-10">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">System Control Center</h1>
          <p className="text-slate-400">Overview of platform content and metrics.</p>
        </div>
        <div className="flex gap-3">
          <Button variant="secondary" onClick={() => toast('Feature coming soon')}>
            <Users className="w-4 h-4 mr-2" /> Manage Users
          </Button>
          <Button className="bg-red-600 hover:bg-red-700 !w-auto" onClick={() => navigate('/admin/create-problem')}>
            <Plus className="w-4 h-4 mr-2" /> Deploy Challenge
          </Button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-slate-900 border border-slate-800 p-6 rounded-xl relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
            <Database className="w-24 h-24 text-red-500" />
          </div>
          <h3 className="text-slate-400 font-medium mb-1">Total Challenges</h3>
          <p className="text-3xl font-bold text-white">{stats.total}</p>
          <div className="mt-4 flex gap-2 text-xs">
            <span className="px-2 py-1 bg-green-500/10 text-green-400 rounded border border-green-500/20">{stats.easy} Easy</span>
            <span className="px-2 py-1 bg-yellow-500/10 text-yellow-400 rounded border border-yellow-500/20">{stats.medium} Med</span>
            <span className="px-2 py-1 bg-red-500/10 text-red-400 rounded border border-red-500/20">{stats.hard} Hard</span>
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-6 rounded-xl relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-10">
            <Users className="w-24 h-24 text-blue-500" />
          </div>
          <h3 className="text-slate-400 font-medium mb-1">Active Users</h3>
          <p className="text-3xl font-bold text-white">--</p>
          <p className="text-xs text-slate-500 mt-2">Mock Data</p>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-6 rounded-xl relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-10">
            <Server className="w-24 h-24 text-purple-500" />
          </div>
          <h3 className="text-slate-400 font-medium mb-1">System Status</h3>
          <p className="text-3xl font-bold text-emerald-400">Operational</p>
          <p className="text-xs text-slate-500 mt-2">Latency: 45ms</p>
        </div>
      </div>

      {/* Database Table Section */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
        {/* Toolbar */}
        <div className="p-4 border-b border-slate-800 flex flex-col md:flex-row gap-4 justify-between items-center">
          <div className="relative w-full md:w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
            <input 
              type="text" 
              placeholder="Search database..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded-lg pl-10 pr-4 py-2 text-sm text-white focus:outline-none focus:border-red-500 transition-colors"
            />
          </div>
          
          <div className="flex items-center gap-2 w-full md:w-auto">
            <Filter className="w-4 h-4 text-slate-500" />
            <select 
              value={filterDifficulty}
              onChange={(e) => setFilterDifficulty(e.target.value)}
              className="bg-slate-950 border border-slate-700 text-slate-300 text-sm rounded-lg px-3 py-2 focus:outline-none"
            >
              <option value="All">All Difficulties</option>
              <option value="Easy">Easy</option>
              <option value="Medium">Medium</option>
              <option value="Hard">Hard</option>
            </select>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-400">
            <thead className="bg-slate-950 text-slate-200 uppercase font-bold text-xs">
              <tr>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Title</th>
                <th className="px-6 py-4">Category</th>
                <th className="px-6 py-4">Difficulty</th>
                <th className="px-6 py-4 text-right">Controls</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {loading ? (
                <tr><td colSpan={5} className="p-8 text-center">Accessing Database...</td></tr>
              ) : filteredProblems.length === 0 ? (
                <tr><td colSpan={5} className="p-8 text-center italic">No records found.</td></tr>
              ) : (
                filteredProblems.map((prob) => (
                  <tr key={prob._id} className="hover:bg-slate-800/50 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="w-2 h-2 rounded-full bg-emerald-500" />
                    </td>
                    <td className="px-6 py-4 text-white font-medium">{prob.title}</td>
                    <td className="px-6 py-4">
                      <span className="bg-slate-800 px-2 py-1 rounded text-xs border border-slate-700">
                        {prob.category}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded text-xs border font-medium ${
                         prob.difficulty === 'Easy' ? 'border-green-500/20 text-green-400 bg-green-500/10' :
                         prob.difficulty === 'Medium' ? 'border-yellow-500/20 text-yellow-400 bg-yellow-500/10' :
                         'border-red-500/20 text-red-400 bg-red-500/10'
                      }`}>
                        {prob.difficulty}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button className="p-2 hover:bg-slate-700 rounded-lg text-slate-400 hover:text-white transition-colors">
                          <Edit className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => handleDelete(prob._id)}
                          className="p-2 hover:bg-red-900/30 rounded-lg text-red-400 hover:text-red-300 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;