// src/pages/ProblemDetail.tsx
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Editor from '@monaco-editor/react';
import { Play, Send, CheckCircle2 } from 'lucide-react';
import AppLayout from '../components/layout/AppLayout';
import api from '../services/api';
import { Button } from '../components/ui/Button';
import toast from 'react-hot-toast';

const ProblemDetail = () => {
  const { id } = useParams();
  const [problem, setProblem] = useState<any>(null);
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(true);
  
  // States for buttons
  const [submitting, setSubmitting] = useState(false);
  const [running, setRunning] = useState(false);
  
  // Console Output
  const [output, setOutput] = useState<string | null>(null);

  // Fetch problem details on load
  useEffect(() => {
    const fetchProblem = async () => {
      try {
        const { data } = await api.get(`/problems/${id}`);
        setProblem(data);
        // Set the starter code (template)
        setCode(data.solutionTemplate || '# Write your Python code here');
      } catch (error) {
        toast.error('Could not load problem');
      } finally {
        setLoading(false);
      }
    };
    fetchProblem();
  }, [id]);

  // Handle "Run" (Dry Run)
  const handleRun = async () => {
    setRunning(true);
    setOutput(null);
    try {
      const { data } = await api.post('/submissions/run', {
        problemId: id,
        code: code
      });
      
      // Format the output for the console
      let display = "--- Execution Logs ---\n";
      display += (data.logs || "No print output.") + "\n\n";
      display += "--- Test Results ---\n";
      
      data.results.forEach((res: any) => {
         // Check if there was an execution/syntax error
         if (res.error) {
           display += `❌ Case ${res.case === 0 ? 'Start' : res.case}: Execution Error\n   ${res.error}\n`;
         } else {
           const icon = res.passed ? "✅" : "❌";
           display += `${icon} Case ${res.case}: Expected '${res.expected}' -> Got '${res.actual}'\n`;
         }
      });

      setOutput(display);
      toast.success('Execution Complete');
    } catch (error) {
      toast.error('Run failed');
    } finally {
      setRunning(false);
    }
  };

  // Handle "Submit" (Grading)
  const handleSubmit = async () => {
    setSubmitting(true);
    setOutput(null); 
    try {
      const { data } = await api.post('/submissions', {
        problemId: id,
        code: code,
        language: 'python'
      });
      
      toast.success('Code Submitted!');
      setOutput(data.output);
      
    } catch (error) {
      toast.error('Submission failed');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <div className="text-white p-10">Loading environment...</div>;

  return (
    <AppLayout>
      <div className="flex h-[calc(100vh-100px)] gap-6">
        {/* LEFT PANEL: Problem Description */}
        <div className="w-1/2 flex flex-col bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
          <div className="p-6 border-b border-slate-800 bg-slate-900/50">
            <div className="flex justify-between items-start mb-4">
              <h1 className="text-2xl font-bold text-white">{problem?.title}</h1>
              <span className="px-3 py-1 rounded-full text-xs font-medium bg-violet-500/10 text-violet-400 border border-violet-500/20">
                {problem?.difficulty}
              </span>
            </div>
            <div className="prose prose-invert max-w-none text-slate-300">
              <p className="whitespace-pre-wrap">{problem?.description}</p>
            </div>
          </div>

          {/* Test Cases Preview */}
          <div className="flex-1 p-6 bg-slate-950 overflow-y-auto">
            <h3 className="text-sm font-bold text-white mb-4 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-green-400" />
              Example Test Cases
            </h3>
            <div className="space-y-4">
              {problem?.testCases?.slice(0, 2).map((test: any, i: number) => (
                <div key={i} className="bg-slate-900 p-4 rounded-lg border border-slate-800 font-mono text-sm">
                  <div className="mb-2">
                    <span className="text-slate-500">Input:</span> 
                    <span className="text-green-300 ml-2">{test.input}</span>
                  </div>
                  <div>
                    <span className="text-slate-500">Output:</span> 
                    <span className="text-violet-300 ml-2">{test.output}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* RIGHT PANEL: Code Editor & Console */}
        <div className="w-1/2 flex flex-col bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
          {/* Editor Header */}
          <div className="flex items-center justify-between px-4 py-3 bg-slate-900 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-red-500" />
              <div className="w-3 h-3 rounded-full bg-yellow-500" />
              <div className="w-3 h-3 rounded-full bg-green-500" />
              <span className="ml-2 text-sm text-slate-400 font-mono">main.py</span>
            </div>
            <div className="flex gap-2">
              <Button 
                variant="secondary" 
                className="!py-1.5 !px-3 text-xs"
                onClick={handleRun}
                isLoading={running}
              >
                <Play className="w-3 h-3 mr-2" /> Run
              </Button>
              <Button 
                className="!py-1.5 !px-3 text-xs"
                onClick={handleSubmit}
                isLoading={submitting}
              >
                <Send className="w-3 h-3 mr-2" /> Submit
              </Button>
            </div>
          </div>

          {/* The Monaco Editor */}
          <div className="flex-1 relative">
            <Editor
              height="100%"
              defaultLanguage="python"
              theme="vs-dark"
              value={code}
              onChange={(value) => setCode(value || '')}
              options={{
                minimap: { enabled: false },
                fontSize: 14,
                scrollBeyondLastLine: false,
                automaticLayout: true,
              }}
            />
          </div>

          {/* Output Console */}
          <div className="h-48 bg-slate-950 border-t border-slate-800 p-4 font-mono text-sm overflow-y-auto">
            <div className="flex items-center gap-2 text-slate-500 mb-2">
              <div className="w-2 h-2 rounded-full bg-slate-600" />
              <span>Console Output</span>
            </div>
            
            {output ? (
              <pre className="text-green-400 whitespace-pre-wrap">{output}</pre>
            ) : (
              <div className="text-slate-600 italic">Run your code to see output...</div>
            )}
          </div>
        </div>
      </div>
    </AppLayout>
  );
};

export default ProblemDetail;