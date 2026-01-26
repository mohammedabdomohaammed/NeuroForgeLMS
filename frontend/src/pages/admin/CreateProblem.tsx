import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AppLayout from '../../components/layout/AppLayout';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import api from '../../services/api';
import toast from 'react-hot-toast';
import { Plus, X } from 'lucide-react';

const CreateProblem = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  
  // Basic Info
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [difficulty, setDifficulty] = useState('Easy');
  const [category, setCategory] = useState('');
  const [solutionTemplate, setSolutionTemplate] = useState('def solution(x):\n    # Code here\n    pass');
  
  // Test Cases
  const [testCases, setTestCases] = useState([{ input: '', output: '' }]);

  const addTestCase = () => setTestCases([...testCases, { input: '', output: '' }]);
  
  const handleTestCaseChange = (index: number, field: 'input' | 'output', value: string) => {
    const newCases = [...testCases];
    newCases[index][field] = value;
    setTestCases(newCases);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post('/problems', {
        title, description, difficulty, category, solutionTemplate, testCases
      });
      toast.success('Problem Created!');
      navigate('/admin');
    } catch (error) {
      toast.error('Failed to create problem');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AppLayout>
      <div className="max-w-3xl mx-auto">
        <h1 className="text-2xl font-bold text-white mb-6">Create New Challenge</h1>
        <form onSubmit={handleSubmit} className="space-y-6">
          <Input label="Title" value={title} onChange={e => setTitle(e.target.value)} required />
          
          <div className="grid grid-cols-2 gap-4">
             <div className="flex flex-col gap-2">
                <label className="text-sm font-medium text-slate-300">Difficulty</label>
                <select className="bg-slate-800 border border-slate-700 text-white rounded-lg p-2.5" 
                  value={difficulty} onChange={e => setDifficulty(e.target.value)}>
                  <option>Easy</option><option>Medium</option><option>Hard</option>
                </select>
             </div>
             <Input label="Category" value={category} onChange={e => setCategory(e.target.value)} required />
          </div>

          <div>
            <label className="text-sm font-medium text-slate-300 block mb-2">Description</label>
            <textarea className="w-full bg-slate-800 border border-slate-700 text-white rounded-lg p-3 h-32"
              value={description} onChange={e => setDescription(e.target.value)} required />
          </div>

          <div>
            <label className="text-sm font-medium text-slate-300 block mb-2">Starter Code</label>
            <textarea className="w-full bg-slate-950 border border-slate-700 text-slate-300 rounded-lg p-3 h-32 font-mono text-sm"
              value={solutionTemplate} onChange={e => setSolutionTemplate(e.target.value)} required />
          </div>

          <div className="bg-slate-900 p-4 rounded-xl border border-slate-800">
            <div className="flex justify-between items-center mb-4">
              <label className="text-sm font-medium text-slate-300">Test Cases</label>
              <Button type="button" variant="secondary" onClick={addTestCase} className="!w-auto !py-1 !px-3 text-xs">
                <Plus className="w-3 h-3 mr-1" /> Add Case
              </Button>
            </div>
            <div className="space-y-4">
              {testCases.map((tc, index) => (
                <div key={index} className="flex gap-4">
                  <input placeholder="Input" className="w-full bg-slate-800 border-slate-700 text-white rounded px-3 py-2 text-sm font-mono"
                    value={tc.input} onChange={e => handleTestCaseChange(index, 'input', e.target.value)} required />
                  <input placeholder="Output" className="w-full bg-slate-800 border-slate-700 text-white rounded px-3 py-2 text-sm font-mono"
                    value={tc.output} onChange={e => handleTestCaseChange(index, 'output', e.target.value)} required />
                </div>
              ))}
            </div>
          </div>

          <Button type="submit" isLoading={loading}>Create Problem</Button>
        </form>
      </div>
    </AppLayout>
  );
};

export default CreateProblem;