// src/pages/Dashboard.tsx
import React, { useEffect, useState } from 'react';
import AppLayout from '../components/layout/AppLayout';
import { useAuth } from '../hooks/useAuth';
import api from '../services/api';
import { 
  ArrowRight, 
  BrainCircuit, 
  Trophy, 
  Activity, 
  Target, 
  Zap,
  CheckCircle2,
  TrendingUp,
  Code2
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface Problem {
  _id: string;
  title: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  category: string;
}

const Dashboard = () => {
  const { user } = useAuth();
  const [problems, setProblems] = useState<Problem[]>([]);
  const [solvedIds, setSolvedIds] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        // 1. Fetch All Problems
        const { data: problemsData } = await api.get('/problems');
        setProblems(problemsData);

        // 2. Fetch User Submissions
        const { data: submissionsData } = await api.get('/submissions/my');
        
        // Logic: Store IDs of solved problems to show "Completed" status
        const solved = new Set<string>(
          submissionsData
            .filter((sub: any) => sub.status === 'Accepted')
            .map((sub: any) => sub.problem._id)
        );
        
        setSolvedIds(solved);

      } catch (error) {
        console.error('Failed to load dashboard data', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const getDifficultyColor = (diff: string) => {
    switch (diff) {
      case 'Easy': return 'text-emerald-400 bg-emerald-400/10 border-emerald-400/20';
      case 'Medium': return 'text-amber-400 bg-amber-400/10 border-amber-400/20';
      case 'Hard': return 'text-rose-400 bg-rose-400/10 border-rose-400/20';
      default: return 'text-slate-400';
    }
  };

  const progressPercentage = problems.length > 0 
    ? Math.round((solvedIds.size / problems.length) * 100) 
    : 0;

  return (
    <AppLayout>
      {/* Hero Section */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-violet-900/50 to-slate-900 border border-slate-800 p-8 mb-8">
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-center gap-6">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
              Welcome back, <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-emerald-400">{user?.name?.split(' ')[0]}</span>
            </h1>
            <p className="text-slate-400 max-w-lg">
              "Artificial Intelligence is not magic, it's just math at scale." 
              Ready to solve your next challenge?
            </p>
            
            <div className="mt-6 flex items-center gap-4">
              <button 
                onClick={() => navigate('/tutor')}
                className="bg-white text-slate-900 px-6 py-2.5 rounded-lg font-bold hover:bg-slate-200 transition-colors flex items-center gap-2"
              >
                <Zap className="w-4 h-4 fill-slate-900" /> Start Learning
              </button>
              <button 
                onClick={() => navigate('/profile')}
                className="px-6 py-2.5 rounded-lg font-medium text-white border border-slate-700 hover:bg-slate-800 transition-colors"
              >
                View Profile
              </button>
            </div>
          </div>

          {/* Progress Circle */}
          <div className="bg-slate-950/50 p-6 rounded-2xl border border-slate-800 backdrop-blur-sm min-w-[200px] text-center">
            <div className="text-sm text-slate-400 mb-2 font-medium">Course Progress</div>
            <div className="text-4xl font-black text-white mb-1">{progressPercentage}%</div>
            <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
              <div 
                className="bg-gradient-to-r from-violet-500 to-emerald-500 h-full transition-all duration-1000 ease-out"
                style={{ width: `${progressPercentage}%` }}
              />
            </div>
            <div className="text-xs text-slate-500 mt-2">
              {solvedIds.size} of {problems.length} Modules Completed
            </div>
          </div>
        </div>

        {/* Decorative background glow */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-violet-600/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-10">
        <div className="bg-slate-900/50 border border-slate-800 p-4 rounded-xl flex flex-col justify-between hover:border-violet-500/30 transition-colors">
          <div className="flex justify-between items-start mb-2">
            <div className="p-2 bg-emerald-500/10 rounded-lg text-emerald-400">
              <Trophy className="w-5 h-5" />
            </div>
            <span className="text-xs font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded">+12%</span>
          </div>
          <div>
            <div className="text-2xl font-bold text-white">{solvedIds.size}</div>
            <div className="text-xs text-slate-400">Total Solved</div>
          </div>
        </div>

        <div className="bg-slate-900/50 border border-slate-800 p-4 rounded-xl flex flex-col justify-between hover:border-blue-500/30 transition-colors">
          <div className="flex justify-between items-start mb-2">
            <div className="p-2 bg-blue-500/10 rounded-lg text-blue-400">
              <Target className="w-5 h-5" />
            </div>
          </div>
          <div>
            <div className="text-2xl font-bold text-white">Top 5%</div>
            <div className="text-xs text-slate-400">Global Rank</div>
          </div>
        </div>

        <div className="bg-slate-900/50 border border-slate-800 p-4 rounded-xl flex flex-col justify-between hover:border-amber-500/30 transition-colors">
          <div className="flex justify-between items-start mb-2">
            <div className="p-2 bg-amber-500/10 rounded-lg text-amber-400">
              <Activity className="w-5 h-5" />
            </div>
          </div>
          <div>
            <div className="text-2xl font-bold text-white">3 Days</div>
            <div className="text-xs text-slate-400">Current Streak</div>
          </div>
        </div>

        <div className="bg-slate-900/50 border border-slate-800 p-4 rounded-xl flex flex-col justify-between hover:border-purple-500/30 transition-colors">
          <div className="flex justify-between items-start mb-2">
            <div className="p-2 bg-purple-500/10 rounded-lg text-purple-400">
              <Code2 className="w-5 h-5" />
            </div>
          </div>
          <div>
            <div className="text-2xl font-bold text-white">{problems.length - solvedIds.size}</div>
            <div className="text-xs text-slate-400">Remaining</div>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Col: Recommended Problems */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <BrainCircuit className="text-violet-500 w-5 h-5" />
              Recommended Curriculum
            </h2>
            <button onClick={() => navigate('/problems')} className="text-sm text-slate-400 hover:text-white transition-colors">
              View All
            </button>
          </div>

          {loading ? (
            <div className="space-y-4">
               {[1,2,3].map(i => <div key={i} className="h-24 bg-slate-900/50 animate-pulse rounded-xl border border-slate-800" />)}
            </div>
          ) : (
            <div className="grid gap-4">
              {problems.slice(0, 4).map((problem) => {
                const isSolved = solvedIds.has(problem._id);
                return (
                  <div 
                    key={problem._id}
                    onClick={() => navigate(`/problems/${problem._id}`)}
                    className={`group relative p-5 rounded-xl border transition-all cursor-pointer flex items-center justify-between ${
                      isSolved 
                        ? 'bg-slate-900/30 border-slate-800 opacity-75 hover:opacity-100' 
                        : 'bg-slate-900 border-slate-800 hover:border-violet-500/50 hover:bg-slate-800'
                    }`}
                  >
                    <div>
                      <h3 className={`text-lg font-semibold transition-colors flex items-center gap-2 ${
                        isSolved ? 'text-emerald-400' : 'text-white group-hover:text-violet-400'
                      }`}>
                        {problem.title}
                        {isSolved && <CheckCircle2 className="w-4 h-4" />}
                      </h3>
                      <p className="text-sm text-slate-400 mt-1 flex items-center gap-2">
                        <span className="bg-slate-800 px-2 py-0.5 rounded text-xs border border-slate-700">
                          {problem.category}
                        </span>
                      </p>
                    </div>

                    <div className="flex items-center gap-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getDifficultyColor(problem.difficulty)}`}>
                        {problem.difficulty}
                      </span>
                      <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center group-hover:bg-white group-hover:text-slate-900 transition-colors">
                         <ArrowRight className="w-4 h-4" />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Right Col: Trending / Updates */}
        <div className="space-y-6">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <TrendingUp className="text-rose-500 w-5 h-5" />
            Trending Topics
          </h2>
          
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
            <div className="space-y-6">
              {[
                { topic: "Transformers", popularity: "98%", color: "bg-purple-500" },
                { topic: "RAG Systems", popularity: "85%", color: "bg-blue-500" },
                { topic: "Computer Vision", popularity: "72%", color: "bg-emerald-500" },
              ].map((item, idx) => (
                <div key={idx}>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-slate-300 font-medium">{item.topic}</span>
                    <span className="text-slate-500">{item.popularity}</span>
                  </div>
                  <div className="w-full bg-slate-950 h-1.5 rounded-full overflow-hidden">
                    <div className={`${item.color} h-full rounded-full`} style={{ width: item.popularity }} />
                  </div>
                </div>
              ))}
            </div>
            
            <div className="mt-8 pt-6 border-t border-slate-800">
               <h4 className="text-sm font-bold text-white mb-2">New to PyForge?</h4>
               <p className="text-xs text-slate-400 mb-4">Check out our getting started guide for Python AI development.</p>
               <button className="w-full py-2 text-sm font-medium text-slate-300 bg-slate-800 rounded-lg hover:bg-slate-700 hover:text-white transition-colors">
                 Read Guide
               </button>
            </div>
          </div>
        </div>

      </div>
    </AppLayout>
  );
};

export default Dashboard;