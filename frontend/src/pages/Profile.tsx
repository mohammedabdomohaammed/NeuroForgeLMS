// src/pages/Profile.tsx
import React, { useEffect, useState } from 'react';
import AppLayout from '../components/layout/AppLayout';
import { User, Clock, CheckCircle, XCircle } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import api from '../services/api';

interface Submission {
  _id: string;
  problem: {
    title: string;
    difficulty: string;
  };
  status: string;
  createdAt: string;
}

const Profile = () => {
  const { user } = useAuth();
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const { data } = await api.get('/submissions/my');
        setSubmissions(data);
      } catch (error) {
        console.error('Failed to load history');
      } finally {
        setLoading(false);
      }
    };
    fetchHistory();
  }, []);

  return (
    <AppLayout>
      <div className="max-w-4xl mx-auto">
        {/* Header Card */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-8 mb-8 flex items-center gap-6">
          <div className="w-20 h-20 bg-gradient-to-br from-violet-600 to-purple-800 rounded-full flex items-center justify-center text-white shadow-lg">
            <User className="w-10 h-10" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-white">{user?.name}</h1>
            <p className="text-slate-400">{user?.email}</p>
            <div className="flex gap-2 mt-3">
              <span className="px-3 py-1 bg-violet-500/10 text-violet-400 text-xs rounded-full border border-violet-500/20 capitalize font-medium">
                {user?.role}
              </span>
              <span className="px-3 py-1 bg-green-500/10 text-green-400 text-xs rounded-full border border-green-500/20 font-medium">
                Active
              </span>
            </div>
          </div>
        </div>
        
        {/* Recent Activity Section */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
          <div className="p-6 border-b border-slate-800">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <Clock className="w-5 h-5 text-slate-400" />
              Submission History
            </h2>
          </div>

          {loading ? (
            <div className="p-8 text-center text-slate-500">Loading history...</div>
          ) : submissions.length === 0 ? (
            <div className="p-8 text-center text-slate-500 italic">No submissions yet. Go solve some problems!</div>
          ) : (
            <div className="divide-y divide-slate-800">
              {submissions.map((sub) => (
                <div key={sub._id} className="p-4 hover:bg-slate-800/50 transition-colors flex items-center justify-between">
                  <div>
                    <h3 className="text-white font-medium">{sub.problem?.title || 'Unknown Problem'}</h3>
                    <p className="text-xs text-slate-500 mt-1">
                      {new Date(sub.createdAt).toLocaleDateString()} at {new Date(sub.createdAt).toLocaleTimeString()}
                    </p>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <span className={`text-xs px-2 py-1 rounded border ${
                       sub.problem?.difficulty === 'Hard' ? 'border-red-500/20 text-red-400 bg-red-500/10' :
                       sub.problem?.difficulty === 'Medium' ? 'border-yellow-500/20 text-yellow-400 bg-yellow-500/10' :
                       'border-green-500/20 text-green-400 bg-green-500/10'
                    }`}>
                      {sub.problem?.difficulty || 'N/A'}
                    </span>

                    {sub.status === 'Accepted' ? (
                      <span className="flex items-center gap-1 text-green-400 text-sm font-medium">
                        <CheckCircle className="w-4 h-4" /> Passed
                      </span>
                    ) : (
                      <span className="flex items-center gap-1 text-red-400 text-sm font-medium">
                        <XCircle className="w-4 h-4" /> Failed
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </AppLayout>
  );
};

export default Profile;