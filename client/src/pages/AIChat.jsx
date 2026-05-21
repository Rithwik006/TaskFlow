import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Bot, 
  User, 
  Send, 
  Sparkles, 
  Clock, 
  Loader2, 
  AlertCircle, 
  ChevronRight, 
  MessageSquare,
  HelpCircle,
  Zap,
  TrendingUp
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';

const AIChat = () => {
  const { api, dbUser } = useAuth();
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [loadingHistory, setLoadingHistory] = useState(true);
  const chatEndRef = useRef(null);

  const quickPrompts = [
    { text: 'Which tasks should I prioritize today?', icon: Zap, color: 'text-amber-500 bg-amber-50 dark:bg-amber-950/20' },
    { text: 'Give me a summary of my pending work.', icon: TrendingUp, color: 'text-blue-500 bg-blue-50 dark:bg-blue-950/20' },
    { text: 'Help me draft a plan for a high-priority task.', icon: HelpCircle, color: 'text-emerald-500 bg-emerald-50 dark:bg-emerald-950/20' }
  ];

  const fetchChatHistory = async () => {
    try {
      const res = await api.get('/ai/history');
      // Sync DB records format: user input as role 'user', assistant response as role 'assistant'
      const formattedHistory = res.data.map(h => ({
        role: h.role, // 'user' or 'assistant'
        content: h.content,
        timestamp: h.timestamp || h.createdAt
      }));
      setMessages(formattedHistory);
    } catch (err) {
      toast.error('Failed to load conversation logs');
    } finally {
      setLoadingHistory(false);
    }
  };

  useEffect(() => {
    fetchChatHistory();
  }, []);

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const handleSendMessage = async (textToSend) => {
    const messageText = textToSend || input;
    if (!messageText.trim() || isLoading) return;

    const userMessage = { role: 'user', content: messageText, timestamp: new Date() };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const res = await api.post('/ai/chat', { message: messageText });
      const assistantMessage = { role: 'assistant', content: res.data.message, timestamp: new Date() };
      setMessages(prev => [...prev, assistantMessage]);
    } catch (err) {
      toast.error('AI assistant failed to respond');
      setMessages(prev => [
        ...prev, 
        { role: 'assistant', content: 'Apologies, I encountered an issue handling your prompt. Please check your credentials or try again later.' }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickPromptClick = (text) => {
    handleSendMessage(text);
  };

  return (
    <div className="h-[calc(100vh-140px)] flex flex-col md:flex-row gap-6">
      {/* Sidebar - Context & Quick Prompts */}
      <div className="w-full md:w-80 shrink-0 flex flex-col gap-6">
        <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between h-fit">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-primary-100 dark:bg-primary-950/30 text-primary-600 dark:text-primary-400 flex items-center justify-center">
                <Sparkles size={20} />
              </div>
              <div>
                <h3 className="font-bold">AI Assistant</h3>
                <p className="text-xs text-slate-400">Powered by Gemini</p>
              </div>
            </div>
            <p className="text-sm text-slate-500 leading-relaxed">
              Ask TaskFlow AI to prioritize your Kanban board, highlight late work, or suggest efficient productivity steps.
            </p>
          </div>
        </div>

        {/* Quick Prompts Panel */}
        <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm flex-1 flex flex-col justify-start h-fit">
          <h4 className="font-bold text-xs uppercase tracking-wider text-slate-400 mb-4">Quick Actions</h4>
          <div className="space-y-3">
            {quickPrompts.map((prompt, idx) => (
              <button
                key={idx}
                onClick={() => handleQuickPromptClick(prompt.text)}
                disabled={isLoading}
                className="w-full text-left p-3.5 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-800 flex gap-3 transition-all hover:scale-[1.01] hover:shadow-sm"
              >
                <div className={`p-2 rounded-xl shrink-0 ${prompt.color}`}>
                  <prompt.icon size={16} />
                </div>
                <div className="flex items-center justify-between w-full">
                  <span className="text-xs font-semibold text-slate-700 dark:text-slate-300 leading-normal">
                    {prompt.text}
                  </span>
                  <ChevronRight size={14} className="text-slate-400 shrink-0 ml-1" />
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col overflow-hidden h-full">
        {/* Chat Header */}
        <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-slate-950/20">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-primary-100 dark:bg-primary-950/30 text-primary-600 dark:text-primary-400 rounded-xl flex items-center justify-center font-bold">
              <Bot size={18} />
            </div>
            <div>
              <h3 className="font-bold text-sm text-slate-900 dark:text-white">Workspace AI Assistant</h3>
              <p className="text-[10px] text-green-500 font-medium">Ready to support your productivity</p>
            </div>
          </div>
        </div>

        {/* Chat History */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-slate-50 dark:bg-slate-950/30">
          {loadingHistory ? (
            <div className="flex flex-col items-center justify-center h-full gap-3 text-slate-400">
              <Loader2 className="animate-spin" size={24} />
              <p className="text-xs font-medium">Syncing previous conversations...</p>
            </div>
          ) : messages.length === 0 ? (
            <div className="text-center py-20 max-w-md mx-auto">
              <div className="w-16 h-16 bg-primary-50 dark:bg-primary-950/20 text-primary-600 dark:text-primary-400 mx-auto rounded-3xl flex items-center justify-center mb-6">
                <Bot size={32} />
              </div>
              <h4 className="font-bold text-xl mb-2">Hello, {dbUser?.name}!</h4>
              <p className="text-sm text-slate-500 leading-relaxed">
                Welcome to your premium standalone AI conversation console. I have access to your active tasks list. Type a prompt or click one of the quick actions to plan your day.
              </p>
            </div>
          ) : (
            messages.map((msg, i) => (
              <div key={i} className={`flex gap-4 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                {/* Avatar */}
                <div className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 border shadow-sm ${
                  msg.role === 'user' 
                    ? 'bg-slate-200 border-slate-300 text-slate-700' 
                    : 'bg-primary-100 border-primary-200 text-primary-600 dark:bg-primary-950/40 dark:border-primary-900'
                }`}>
                  {msg.role === 'user' ? <User size={16} /> : <Bot size={16} />}
                </div>

                {/* Bubble */}
                <div className={`max-w-[70%] p-4 rounded-3xl text-sm leading-relaxed shadow-sm ${
                  msg.role === 'user'
                    ? 'bg-primary-600 text-white rounded-tr-none'
                    : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-100 dark:border-slate-850 rounded-tl-none'
                }`}>
                  <p className="whitespace-pre-line">{msg.content}</p>
                  
                  {/* Timestamp */}
                  <span className={`block text-[9px] mt-2 text-right ${
                    msg.role === 'user' ? 'text-primary-200' : 'text-slate-400'
                  }`}>
                    {msg.timestamp ? new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''}
                  </span>
                </div>
              </div>
            ))
          )}

          {isLoading && (
            <div className="flex gap-4">
              <div className="w-9 h-9 bg-primary-100 border border-primary-200 text-primary-600 rounded-full flex items-center justify-center shrink-0 dark:bg-primary-950/40 dark:border-primary-900">
                <Bot size={16} />
              </div>
              <div className="bg-white dark:bg-slate-800 p-4 rounded-3xl rounded-tl-none border border-slate-100 dark:border-slate-850 shadow-sm flex items-center gap-2">
                <Loader2 size={16} className="animate-spin text-primary-500" />
                <span className="text-xs text-slate-400 font-medium">Gemini is thinking...</span>
              </div>
            </div>
          )}
          <div ref={chatEndRef} />
        </div>

        {/* Input */}
        <form 
          onSubmit={(e) => { e.preventDefault(); handleSendMessage(); }} 
          className="p-4 border-t border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900"
        >
          <div className="relative flex items-center">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask me anything..."
              disabled={isLoading || loadingHistory}
              className="w-full pl-4 pr-14 py-3.5 bg-slate-50 dark:bg-slate-850 border-none rounded-2xl focus:ring-2 focus:ring-primary-500 outline-none text-sm text-slate-700 dark:text-slate-200 disabled:opacity-50"
            />
            <button
              type="submit"
              disabled={!input.trim() || isLoading}
              className="absolute right-2 w-10 h-10 bg-primary-600 hover:bg-primary-700 text-white rounded-xl flex items-center justify-center transition-all disabled:opacity-50 active:scale-95 shadow-md shadow-primary-600/10"
            >
              <Send size={16} />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AIChat;
