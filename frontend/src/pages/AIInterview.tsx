// src/pages/AIInterview.tsx
import React, { useState, useRef, useEffect } from 'react';
import AppLayout from '../components/layout/AppLayout';
import { Bot, User, Send, Loader2 } from 'lucide-react';
import api from '../services/api';
import { Button } from '../components/ui/Button';
import toast from 'react-hot-toast';

// --- NEW IMPORTS ---
import ReactMarkdown from 'react-markdown';
import rehypeHighlight from 'rehype-highlight';
import 'highlight.js/styles/atom-one-dark.css'; // Syntax Highlighting Theme

interface Message {
  role: 'user' | 'ai';
  content: string;
}

const AIInterview = () => {
  const [messages, setMessages] = useState<Message[]>([
    { role: 'ai', content: "Hello! I am your AI Python Tutor. I can explain complex concepts, help you debug code, or teach you best practices. What are we learning today?" }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMsg = input;
    setInput('');
    
    const newHistory = [...messages, { role: 'user', content: userMsg } as Message];
    setMessages(newHistory);
    setLoading(true);

    try {
      const { data } = await api.post('/interview/chat', {
        message: userMsg,
        history: newHistory 
      });

      setMessages(prev => [...prev, { role: 'ai', content: data.reply }]);
      
    } catch (error) {
      toast.error('Failed to reach the Tutor');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AppLayout>
      <div className="flex flex-col h-[calc(100vh-100px)] bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
        
        {/* Header */}
        <div className="p-4 border-b border-slate-800 bg-slate-900 flex items-center gap-3">
          <div className="w-10 h-10 bg-emerald-600/20 rounded-full flex items-center justify-center">
            <Bot className="text-emerald-400 w-6 h-6" />
          </div>
          <div>
            <h1 className="font-bold text-white">AI Python Tutor</h1>
            <p className="text-xs text-slate-400">Powered by PyForge Engine</p>
          </div>
        </div>

        {/* Chat Area */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {messages.map((msg, idx) => (
            <div 
              key={idx} 
              className={`flex gap-4 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}
            >
              {/* Avatar */}
              <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                msg.role === 'ai' ? 'bg-emerald-600/20 text-emerald-400' : 'bg-slate-700 text-slate-300'
              }`}>
                {msg.role === 'ai' ? <Bot className="w-5 h-5" /> : <User className="w-5 h-5" />}
              </div>

              {/* Bubble with Markdown Support */}
              <div className={`max-w-[85%] rounded-2xl px-5 py-3 text-sm leading-relaxed ${
                msg.role === 'user' 
                  ? 'bg-emerald-600 text-white rounded-tr-sm' 
                  : 'bg-slate-800 text-slate-200 border border-slate-700 rounded-tl-sm shadow-sm'
              }`}>
                {msg.role === 'ai' ? (
                  /* RENDER AI MARKDOWN */
                  <div className="markdown-body text-slate-300">
                    <ReactMarkdown
                      rehypePlugins={[rehypeHighlight]}
                      components={{
                        // Style code blocks specifically
                        code: ({node, className, children, ...props}) => {
                          const match = /language-(\w+)/.exec(className || '')
                          return match ? (
                            <div className="rounded-md overflow-hidden my-2 border border-slate-700">
                                <div className="bg-slate-900 px-3 py-1 text-xs text-slate-500 border-b border-slate-700 flex justify-between">
                                    <span>{match[1]}</span>
                                </div>
                                <code className={`${className} block bg-slate-950 p-3 overflow-x-auto`} {...props}>
                                    {children}
                                </code>
                            </div>
                          ) : (
                            <code className="bg-slate-700/50 px-1 py-0.5 rounded text-emerald-300 font-mono text-xs" {...props}>
                              {children}
                            </code>
                          )
                        }
                      }}
                    >
                      {msg.content}
                    </ReactMarkdown>
                  </div>
                ) : (
                  /* RENDER USER TEXT */
                  <span>{msg.content}</span>
                )}
              </div>
            </div>
          ))}
          
          {loading && (
            <div className="flex gap-4">
              <div className="w-8 h-8 bg-emerald-600/20 rounded-full flex items-center justify-center">
                <Bot className="text-emerald-400 w-5 h-5" />
              </div>
              <div className="bg-slate-800 px-4 py-3 rounded-2xl rounded-tl-sm border border-slate-700 flex items-center gap-2">
                <Loader2 className="w-4 h-4 animate-spin text-slate-400" />
                <span className="text-xs text-slate-400">Thinking...</span>
              </div>
            </div>
          )}
          <div ref={scrollRef} />
        </div>

        {/* Input Area */}
        <form onSubmit={sendMessage} className="p-4 bg-slate-950 border-t border-slate-800 flex gap-3">
          <input
            type="text"
            className="flex-1 bg-slate-900 border border-slate-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-emerald-500 transition-colors"
            placeholder="Ask for Python code examples..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={loading}
          />
          <Button type="submit" disabled={loading || !input.trim()} className="!w-auto px-6 bg-emerald-600 hover:bg-emerald-700">
            <Send className="w-5 h-5" />
          </Button>
        </form>

      </div>
    </AppLayout>
  );
};

export default AIInterview;