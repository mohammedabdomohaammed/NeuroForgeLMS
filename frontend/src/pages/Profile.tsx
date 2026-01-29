// src/pages/Profile.tsx
import React, { useEffect, useState } from 'react';
import AppLayout from '../components/layout/AppLayout';
import { 
  User, 
  Clock, 
  CheckCircle2, 
  XCircle, 
  Mail, 
  Shield, 
  Trophy, 
  Target, 
  Zap,
  Calendar,
  Code
} from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import api from '../services/api';

interface Submission {
  _id: string;
  problem: {
    title: string;
    difficulty: string;
    category?: string;
  };
  status: string;
  createdAt: string;
  language: string;
}

const Profile = () => {
  const { user } = useAuth();
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(true);

  // Derived Stats
  const [stats, setStats] = useState({
    totalSolved: 0,
    acceptanceRate: 0,
    totalSubmissions: 0,
    streak: 0
  });

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const { data } = await api.get('/submissions/my');
        setSubmissions(data);

        // Calculate Stats
        const accepted = data.filter((s: Submission) => s.status === 'Accepted');
        const rate = data.length > 0 ? Math.round((accepted.length / data.length) * 100) : 0;
        
        // Calculate Streak (Mock logic for now, or based on dates)
        // Real logic would compare consecutive dates
        
        setStats({
          totalSolved: accepted.length,
          totalSubmissions: data.length,
          acceptanceRate: rate,
          streak: data.length > 0 ? 3 : 0 // Mock streak for demo
        });

      } catch (error) {
        console.error('Failed to load history');
      } finally {
        setLoading(false);
      }
    };
    fetchHistory();
  }, []);

  const getRank = (solved: number) => {
    if (solved > 50) return { name: 'Grandmaster', color: 'text-rose-400', bg: 'bg-rose-500/10 border-rose-500/20' };
    if (solved > 20) return { name: 'Expert', color: 'text-violet-400', bg: 'bg-violet-500/10 border-violet-500/20' };
    if (solved > 5) return { name: 'Apprentice', color: 'text-emerald-400', bg: 'bg-emerald-500/10 border-emerald-500/20' };
    return { name: 'Novice', color: 'text-slate-400', bg: 'bg-slate-500/10 border-slate-500/20' };
  };

  const rank = getRank(stats.totalSolved);

  return (
    <AppLayout>
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Banner Section */}
        <div className="relative h-48 rounded-2xl bg-gradient-to-r from-slate-900 via-violet-950 to-slate-900 border border-slate-800 overflow-hidden">
          <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20"></div>
          <div className="absolute top-0 right-0 w-96 h-96 bg-violet-600/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 -mt-20 relative z-10 px-4">
          
          {/* Left Column: User Card */}
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl backdrop-blur-sm">
              <div className="flex flex-col items-center text-center">
                <div className="w-24 h-24 bg-gradient-to-br from-violet-500 to-fuchsia-600 rounded-full p-1 shadow-lg shadow-violet-500/20 mb-4">
                  <div className="w-full h-full bg-slate-900 rounded-full flex items-center justify-center text-white">
                     <span className="text-3xl font-bold">{user?.name?.charAt(0)}</span>
                  </div>
                </div>
                
                <h1 className="text-2xl font-bold text-white mb-1">{user?.name}</h1>
                <p className="text-slate-400 text-sm mb-4 flex items-center gap-2">
                  <Mail className="w-3 h-3" /> {user?.email}
                </p>

                <div className={`px-4 py-1.5 rounded-full text-xs font-bold border ${rank.bg} ${rank.color} mb-6 flex items-center gap-2`}>
                  <Trophy className="w-3 h-3" />
                  {rank.name}
                </div>

                <div className="w-full grid grid-cols-2 gap-4 border-t border-slate-800 pt-6">
                  <div className="text-center">
                    <div className="text-xs text-slate-500 mb-1">Role</div>
                    <div className="text-sm font-medium text-white capitalize">{user?.role}</div>
                  </div>
                  <div className="text-center border-l border-slate-800">
                    <div className="text-xs text-slate-500 mb-1">Joined</div>
                    <div className="text-sm font-medium text-white">Jan 2026</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Badges / Achievements (Mock) */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
              <h3 className="text-sm font-bold text-white mb-4 flex items-center gap-2">
                <Shield className="w-4 h-4 text-emerald-500" />
                Badges
              </h3>
              <div className="flex gap-3 flex-wrap">
                {['Early Adopter', 'Bug Hunter', 'Pythonista'].map((badge) => (
                  <span key={badge} className="px-3 py-1 bg-slate-800 text-xs text-slate-300 rounded border border-slate-700">
                    {badge}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column: Stats & History */}
          <div className="lg:col-span-8 space-y-6">
            
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl flex items-center gap-4">
                <div className="p-3 bg-emerald-500/10 rounded-xl text-emerald-400">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-slate-400 text-xs font-medium">Problems Solved</p>
                  <p className="text-2xl font-bold text-white">{stats.totalSolved}</p>
                </div>
              </div>

              <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl flex items-center gap-4">
                <div className="p-3 bg-blue-500/10 rounded-xl text-blue-400">
                  <Target className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-slate-400 text-xs font-medium">Acceptance Rate</p>
                  <p className="text-2xl font-bold text-white">{stats.acceptanceRate}%</p>
                </div>
              </div>

              <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl flex items-center gap-4">
                <div className="p-3 bg-amber-500/10 rounded-xl text-amber-400">
                  <Zap className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-slate-400 text-xs font-medium">Current Streak</p>
                  <p className="text-2xl font-bold text-white">{stats.streak} Days</p>
                </div>
              </div>
            </div>

            {/* Activity History */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
              <div className="p-6 border-b border-slate-800 flex justify-between items-center">
                <h2 className="text-lg font-bold text-white flex items-center gap-2">
                  <Clock className="w-5 h-5 text-violet-500" />
                  Recent Activity
                </h2>
                <span className="text-xs text-slate-500">Last 30 Days</span>
              </div>

              <div className="max-h-[500px] overflow-y-auto">
                {loading ? (
                  <div className="p-8 text-center">
                    <div className="animate-spin w-6 h-6 border-2 border-violet-500 border-t-transparent rounded-full mx-auto mb-2"></div>
                    <p className="text-slate-500 text-sm">Syncing neural logs...</p>
                  </div>
                ) : submissions.length === 0 ? (
                  <div className="p-12 text-center">
                    <Code className="w-12 h-12 text-slate-700 mx-auto mb-3" />
                    <p className="text-slate-400 font-medium">No activity recorded yet.</p>
                    <p className="text-slate-500 text-sm mt-1">Start solving problems to build your profile!</p>
                  </div>
                ) : (
                  <div className="divide-y divide-slate-800">
                    {submissions.map((sub) => (
                      <div key={sub._id} className="p-4 hover:bg-slate-800/50 transition-colors group">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4">
                            <div className={`p-2 rounded-lg ${
                              sub.status === 'Accepted' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-rose-500/10 text-rose-500'
                            }`}>
                              {sub.status === 'Accepted' ? <CheckCircle2 className="w-4 h-4" /> : <XCircle className="w-4 h-4" />}
                            </div>
                            
                            <div>
                              <h4 className="text-sm font-medium text-white group-hover:text-violet-400 transition-colors">
                                {sub.problem?.title || 'Unknown Challenge'}
                              </h4>
                              <div className="flex items-center gap-2 mt-1">
                                <span className={`text-[10px] px-1.5 py-0.5 rounded border ${
                                  sub.problem?.difficulty === 'Hard' ? 'border-rose-500/20 text-rose-400' :
                                  sub.problem?.difficulty === 'Medium' ? 'border-amber-500/20 text-amber-400' :
                                  'border-emerald-500/20 text-emerald-400'
                                }`}>
                                  {sub.problem?.difficulty || 'N/A'}
                                </span>
                                <span className="text-xs text-slate-500">•</span>
                                <span className="text-xs text-slate-500 flex items-center gap-1">
                                  <Calendar className="w-3 h-3" />
                                  {new Date(sub.createdAt).toLocaleDateString()}
                                </span>
                              </div>
                            </div>
                          </div>

                          <div className="text-right hidden sm:block">
                            <div className="text-xs font-mono text-slate-500 mb-1">Python</div>
                            <div className="text-xs text-slate-600">
                              {new Date(sub.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

          </div>
        </div>
      </div>
    </AppLayout>
  );
};

export default Profile;