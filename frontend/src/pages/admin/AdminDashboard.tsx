import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AppLayout from '../../components/layout/AppLayout';
import api from '../../services/api';
import { Button } from '../../components/ui/Button';
import { Plus, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';

const AdminDashboard = () => {
  const [problems, setProblems] = useState<any[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchProblems();
  }, []);

  const fetchProblems = async () => {
    try {
      const { data } = await api.get('/problems');
      setProblems(data);
    } catch (error) {
      toast.error('Failed to load problems');
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Delete this problem?')) return;
    try {
      await api.delete(`/problems/${id}`);
      toast.success('Problem deleted');
      fetchProblems(); 
    } catch (error) {
      toast.error('Delete failed');
    }
  };

  return (
    <AppLayout>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Admin Control</h1>
          <p className="text-slate-400">Manage coding challenges</p>
        </div>
        <Button className="!w-auto" onClick={() => navigate('/admin/create-problem')}>
          <Plus className="w-4 h-4 mr-2" /> Add Problem
        </Button>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
        <table className="w-full text-left text-sm text-slate-400">
          <thead className="bg-slate-950 text-slate-200 uppercase font-medium">
            <tr>
              <th className="px-6 py-4">Title</th>
              <th className="px-6 py-4">Difficulty</th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800">
            {problems.map((prob) => (
              <tr key={prob._id} className="hover:bg-slate-800/50">
                <td className="px-6 py-4 text-white font-medium">{prob.title}</td>
                <td className="px-6 py-4">{prob.difficulty}</td>
                <td className="px-6 py-4 text-right">
                  <button 
                    onClick={() => handleDelete(prob._id)}
                    className="text-red-400 hover:text-red-300 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </AppLayout>
  );
};

export default AdminDashboard;