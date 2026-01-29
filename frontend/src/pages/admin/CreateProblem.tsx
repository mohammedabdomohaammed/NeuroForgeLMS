// src/pages/admin/CreateProblem.tsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminLayout from '../../components/layout/AdminLayout'; // Use Admin Layout
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import api from '../../services/api';
import toast from 'react-hot-toast';
import { Plus, X, Eye, EyeOff, Code, Save, ArrowLeft } from 'lucide-react';
import Editor from '@monaco-editor/react'; // Advanced Editor

interface TestCase {
  input: string;
  output: string;
  isHidden: boolean; // New Feature
}

const CreateProblem = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  
  // Basic Info
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [difficulty, setDifficulty] = useState('Easy');
  const [category, setCategory] = useState('');
  const [solutionTemplate, setSolutionTemplate] = useState(
    'def solution(x):\n    # Write your code here\n    pass'
  );
  
  // Test Cases
  const [testCases, setTestCases] = useState<TestCase[]>([
    { input: '', output: '', isHidden: false }
  ]);

  const addTestCase = () => setTestCases([...testCases, { input: '', output: '', isHidden: false }]);
  const removeTestCase = (idx: number) => setTestCases(testCases.filter((_, i) => i !== idx));

  const handleTestCaseChange = (index: number, field: keyof TestCase, value: any) => {
    const newCases = [...testCases];
    // @ts-ignore
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
      toast.success('Challenge deployed successfully!');
      navigate('/admin');
    } catch (error) {
      toast.error('Deployment failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AdminLayout>
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <button 
            onClick={() => navigate('/admin')}
            className="p-2 hover:bg-slate-800 rounded-lg text-slate-400 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-white">Deploy New Challenge</h1>
            <p className="text-slate-400 text-sm">Create a new problem module for the curriculum.</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          
          {/* Section 1: Meta Data */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              <div className="bg-slate-900 p-6 rounded-xl border border-slate-800">
                <h2 className="text-lg font-bold text-white mb-4">Problem Details</h2>
                <div className="space-y-4">
                  <Input label="Challenge Title" value={title} onChange={e => setTitle(e.target.value)} required placeholder="e.g. Matrix Multiplication" />
                  <div>
                    <label className="text-sm font-medium text-slate-300 block mb-2">Description (Markdown Supported)</label>
                    <textarea 
                      className="w-full bg-slate-950 border border-slate-700 text-white rounded-lg p-4 h-48 focus:border-red-500 focus:outline-none transition-colors"
                      value={description} 
                      onChange={e => setDescription(e.target.value)} 
                      required 
                      placeholder="Describe the problem..."
                    />
                  </div>
                </div>
              </div>

              {/* Code Template Editor */}
              <div className="bg-slate-900 p-6 rounded-xl border border-slate-800 overflow-hidden">
                <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                  <Code className="w-5 h-5 text-red-400" />
                  Starter Code Template
                </h2>
                <div className="h-64 border border-slate-700 rounded-lg overflow-hidden">
                  <Editor
                    height="100%"
                    defaultLanguage="python"
                    theme="vs-dark"
                    value={solutionTemplate}
                    onChange={(val) => setSolutionTemplate(val || '')}
                    options={{ minimap: { enabled: false }, fontSize: 14 }}
                  />
                </div>
              </div>
            </div>

            {/* Sidebar Settings */}
            <div className="space-y-6">
              <div className="bg-slate-900 p-6 rounded-xl border border-slate-800">
                <h2 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-4">Configuration</h2>
                
                <div className="space-y-4">
                  <div className="flex flex-col gap-2">
                    <label className="text-sm font-medium text-slate-300">Difficulty</label>
                    <select 
                      className="bg-slate-950 border border-slate-700 text-white rounded-lg p-2.5 focus:border-red-500 outline-none" 
                      value={difficulty} 
                      onChange={e => setDifficulty(e.target.value)}
                    >
                      <option>Easy</option>
                      <option>Medium</option>
                      <option>Hard</option>
                    </select>
                  </div>
                  <Input label="Category" value={category} onChange={e => setCategory(e.target.value)} required placeholder="e.g. NumPy" />
                </div>
              </div>

              {/* Test Cases Panel */}
              <div className="bg-slate-900 p-6 rounded-xl border border-slate-800">
                 <div className="flex justify-between items-center mb-4">
                  <h2 className="text-sm font-bold text-slate-400 uppercase tracking-wider">Test Cases</h2>
                  <Button type="button" variant="secondary" onClick={addTestCase} className="!w-auto !py-1 !px-2 text-xs">
                    <Plus className="w-3 h-3 mr-1" /> Add
                  </Button>
                </div>

                <div className="space-y-3">
                  {testCases.map((tc, index) => (
                    <div key={index} className="bg-slate-950 p-3 rounded-lg border border-slate-800 relative group">
                      <button 
                        type="button"
                        onClick={() => removeTestCase(index)}
                        className="absolute top-2 right-2 text-slate-600 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X className="w-3 h-3" />
                      </button>
                      
                      <div className="grid gap-2 mb-2">
                        <input 
                          placeholder="Input (e.g. [1,2])" 
                          className="w-full bg-slate-900 border border-slate-700 text-white rounded px-2 py-1.5 text-xs font-mono"
                          value={tc.input} 
                          onChange={e => handleTestCaseChange(index, 'input', e.target.value)} 
                          required 
                        />
                        <input 
                          placeholder="Output (e.g. 3)" 
                          className="w-full bg-slate-900 border border-slate-700 text-white rounded px-2 py-1.5 text-xs font-mono"
                          value={tc.output} 
                          onChange={e => handleTestCaseChange(index, 'output', e.target.value)} 
                          required 
                        />
                      </div>
                      
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input 
                          type="checkbox" 
                          checked={tc.isHidden}
                          onChange={e => handleTestCaseChange(index, 'isHidden', e.target.checked)}
                          className="rounded border-slate-700 bg-slate-800 text-red-500 focus:ring-red-500"
                        />
                        <span className="text-xs text-slate-400 flex items-center gap-1">
                          {tc.isHidden ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                          {tc.isHidden ? 'Hidden Case (Grading Only)' : 'Visible Example'}
                        </span>
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              <Button type="submit" isLoading={loading} className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3">
                <Save className="w-4 h-4 mr-2" /> Deploy Problem
              </Button>

            </div>
          </div>
        </form>
      </div>
    </AdminLayout>
  );
};

export default CreateProblem;