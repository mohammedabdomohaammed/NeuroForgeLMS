// src/pages/Dashboard.tsx
import React, { useEffect, useState } from 'react';
import AppLayout from '../components/layout/AppLayout';
import api from '../services/api';
import { ArrowRight, BrainCircuit, Trophy, Activity, Target } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface Problem {
  _id: string;
  title: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  category: string;
}

const Dashboard = () => {
  const [problems, setProblems] = useState<Problem[]>([]);
  const [solvedCount, setSolvedCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        // 1. Fetch All Problems
        const { data: problemsData } = await api.get('/problems');
        setProblems(problemsData);

        // 2. Fetch User Submissions to calculate stats
        const { data: submissionsData } = await api.get('/submissions/my');
        
        // Logic: Find unique problems that have at least one 'Accepted' submission
        const solvedProblems = new Set(
          submissionsData
            .filter((sub: any) => sub.status === 'Accepted')
            .map((sub: any) => sub.problem._id)
        );
        
        setSolvedCount(solvedProblems.size);

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
      case 'Easy': return 'text-green-400 bg-green-400/10 border-green-400/20';
      case 'Medium': return 'text-yellow-400 bg-yellow-400/10 border-yellow-400/20';
      case 'Hard': return 'text-red-400 bg-red-400/10 border-red-400/20';
      default: return 'text-slate-400';
    }
  };

  return (
    <AppLayout>
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">My Learning Path</h1>
        <p className="text-slate-400">Track your progress and conquer AI challenges.</p>
      </header>

      {/* Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        
        {/* Card 1: Problems Solved */}
        <div className="bg-slate-900 border border-slate-800 p-6 rounded-xl flex items-center gap-4">
          <div className="p-3 bg-violet-500/10 rounded-lg text-violet-400">
            <Trophy className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-slate-400 text-sm font-medium mb-1">Problems Solved</h3>
            <p className="text-2xl font-bold text-white">
              {loading ? '-' : `${solvedCount} / ${problems.length}`}
            </p>
          </div>
        </div>

        {/* Card 2: Global Rank (Mock) */}
        <div className="bg-slate-900 border border-slate-800 p-6 rounded-xl flex items-center gap-4">
          <div className="p-3 bg-blue-500/10 rounded-lg text-blue-400">
            <Target className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-slate-400 text-sm font-medium mb-1">Global Rank</h3>
            <p className="text-2xl font-bold text-white">Top 5%</p>
          </div>
        </div>

        {/* Card 3: Activity (Mock) */}
        <div className="bg-slate-900 border border-slate-800 p-6 rounded-xl flex items-center gap-4">
          <div className="p-3 bg-green-500/10 rounded-lg text-green-400">
            <Activity className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-slate-400 text-sm font-medium mb-1">Streak</h3>
            <p className="text-2xl font-bold text-white">3 Days</p>
          </div>
        </div>
      </div>

      {/* Recent Problems Section */}
      <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
        <BrainCircuit className="text-violet-500" />
        Recommended Problems
      </h2>

      {loading ? (
        <div className="text-slate-500">Loading neural pathways...</div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {problems.map((problem) => (
            <div 
              key={problem._id}
              onClick={() => navigate(`/problems/${problem._id}`)}
              className="group bg-slate-900 border border-slate-800 p-5 rounded-xl hover:border-violet-500/50 hover:bg-slate-800/50 transition-all cursor-pointer flex items-center justify-between"
            >
              <div>
                <h3 className="text-lg font-semibold text-white group-hover:text-violet-400 transition-colors">
                  {problem.title}
                </h3>
                <p className="text-sm text-slate-400 mt-1">{problem.category}</p>
              </div>

              <div className="flex items-center gap-4">
                <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getDifficultyColor(problem.difficulty)}`}>
                  {problem.difficulty}
                </span>
                <ArrowRight className="text-slate-600 group-hover:text-white transition-colors w-5 h-5" />
              </div>
            </div>
          ))}
        </div>
      )}
    </AppLayout>
  );
};

export default Dashboard;