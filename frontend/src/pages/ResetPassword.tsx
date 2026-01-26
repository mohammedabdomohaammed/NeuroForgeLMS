import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';
import api from '../services/api';
import toast, { Toaster } from 'react-hot-toast';

const ResetPassword = () => {
  const { userId } = useParams(); // Grab ID from URL
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await api.post('/users/reset-password', { userId, password });
      toast.success('Password updated successfully!');
      setTimeout(() => navigate('/login'), 2000);
    } catch (error: any) {
      toast.error('Failed to reset password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
      <Toaster position="top-right" />
      <div className="w-full max-w-md bg-slate-800 rounded-xl shadow-2xl p-8 border border-slate-700">
        <h1 className="text-2xl font-bold text-white mb-6 text-center">Set New Password</h1>
        
        <form onSubmit={handleSubmit}>
          <Input 
            label="New Password" 
            type="password" 
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            placeholder="••••••••"
          />
          <Button type="submit" isLoading={loading} className="mt-4">
            Update Password
          </Button>
        </form>
      </div>
    </div>
  );
};

export default ResetPassword;