import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';
import api from '../services/api';
import toast, { Toaster } from 'react-hot-toast';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [link, setLink] = useState(''); // To show the simulated link
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setLink('');

    try {
      const { data } = await api.post('/users/forgot-password', { email });
      toast.success('Reset link generated!');
      setLink(data.resetLink); // Show link for testing
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to request reset');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
      <Toaster position="top-right" />
      <div className="w-full max-w-md bg-slate-800 rounded-xl shadow-2xl p-8 border border-slate-700">
        <h1 className="text-2xl font-bold text-white mb-2 text-center">Reset Password</h1>
        <p className="text-slate-400 text-center mb-8">Enter your email to receive a recovery link.</p>

        <form onSubmit={handleSubmit}>
          <Input 
            label="Email Address" 
            type="email" 
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <Button type="submit" isLoading={loading} className="mt-4">
            Send Reset Link
          </Button>
        </form>

        {link && (
          <div className="mt-6 p-4 bg-violet-900/20 border border-violet-500/30 rounded-lg">
            <p className="text-xs text-violet-300 font-mono break-all">
              <strong>Dev Mode Link:</strong><br/>
              <a href={link} className="underline hover:text-white">{link}</a>
            </p>
          </div>
        )}

        <div className="mt-6 text-center">
          <Link to="/login" className="text-sm text-slate-400 hover:text-white">
            ← Back to Login
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;