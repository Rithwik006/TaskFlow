import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CheckCircle2, Layout, Calendar, MessageSquare, Zap, Shield, Users, ArrowRight } from 'lucide-react';

const Landing = () => {
  return (
    <div className="min-h-screen bg-white dark:bg-slate-950 overflow-x-hidden">
      {/* Navigation */}
      <nav className="flex items-center justify-between px-6 py-4 max-w-7xl mx-auto">
        <h1 className="text-2xl font-bold bg-gradient-to-r from-primary-600 to-indigo-600 bg-clip-text text-transparent">
          TaskFlow
        </h1>
        <div className="flex items-center gap-4">
          <Link to="/login" className="text-slate-600 dark:text-slate-400 font-medium hover:text-primary-600 transition-colors">
            Login
          </Link>
          <Link to="/signup" className="bg-primary-600 text-white px-5 py-2.5 rounded-xl font-semibold hover:bg-primary-700 transition-all shadow-lg shadow-primary-600/20">
            Get Started
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-20 pb-32 px-6">
        <div className="max-w-7xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <span className="px-4 py-1.5 rounded-full bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400 text-sm font-bold tracking-wide uppercase">
              Next-Gen Task Management
            </span>
            <h2 className="mt-8 text-5xl md:text-7xl font-extrabold text-slate-900 dark:text-white leading-[1.1]">
              Organize your work <br />
              <span className="bg-gradient-to-r from-primary-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent">
                with Intelligence.
              </span>
            </h2>
            <p className="mt-6 text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
              A powerful, AI-driven task management platform designed for modern teams and high-achievers. Kanban boards, calendars, and real-time collaboration.
            </p>
            <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link to="/signup" className="w-full sm:w-auto bg-primary-600 text-white px-8 py-4 rounded-2xl font-bold text-lg hover:bg-primary-700 transition-all flex items-center justify-center gap-2 shadow-xl shadow-primary-600/25">
                Start for free <ArrowRight size={20} />
              </Link>
              <button className="w-full sm:w-auto bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white px-8 py-4 rounded-2xl font-bold text-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition-all">
                View Demo
              </button>
            </div>
          </motion.div>

          {/* Floating UI Elements / Dashboard Preview */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.9, y: 40 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.8 }}
            className="mt-20 relative max-w-5xl mx-auto"
          >
            <div className="rounded-3xl overflow-hidden shadow-2xl border-4 border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-900 p-2">
              <img 
                src="https://images.unsplash.com/photo-1484480974693-6ca0a78fb36b?q=80&w=2072&auto=format&fit=crop" 
                alt="Dashboard Preview" 
                className="w-full rounded-2xl grayscale-[0.2] opacity-90"
              />
            </div>
            
            {/* Floating stats */}
            <div className="absolute -top-6 -left-6 bg-white dark:bg-slate-800 p-4 rounded-2xl shadow-xl border border-slate-100 dark:border-slate-700 hidden lg:block">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-green-100 dark:bg-green-900/30 text-green-600 rounded-lg">
                  <CheckCircle2 size={20} />
                </div>
                <div>
                  <p className="text-xs text-slate-500 uppercase font-bold tracking-tight">Completed</p>
                  <p className="text-lg font-bold">1,284 Tasks</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-slate-50 dark:bg-slate-900/50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-3 gap-12">
            {[
              { title: 'Kanban Board', icon: Layout, desc: 'Drag and drop interface for seamless task progression tracking.' },
              { title: 'Interactive Calendar', icon: Calendar, desc: 'Plan your schedule with a modern, high-performance calendar view.' },
              { title: 'AI Assistant', icon: MessageSquare, desc: 'Chat with Gemini to prioritize tasks and get productivity tips.' },
              { title: 'Lightning Fast', icon: Zap, desc: 'Optimized performance with real-time updates via Socket.IO.' },
              { title: 'Enterprise Security', icon: Shield, desc: 'Your data is safe with Firebase auth and encrypted MongoDB.' },
              { title: 'Team Collaboration', icon: Users, desc: 'Assign tasks and track team progress in real-time.' },
            ].map((feature, i) => (
              <motion.div 
                key={i}
                whileHover={{ y: -5 }}
                className="p-8 bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-sm hover:shadow-xl transition-all"
              >
                <div className="w-12 h-12 bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400 rounded-2xl flex items-center justify-center mb-6">
                  <feature.icon size={24} />
                </div>
                <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
                <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                  {feature.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-slate-200 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-slate-500 text-sm">© 2026 TaskFlow. All rights reserved.</p>
          <div className="flex gap-8 text-sm text-slate-500 font-medium">
            <a href="#" title='privacy' className="hover:text-primary-600">Privacy Policy</a>
            <a href="#" title='terms' className="hover:text-primary-600">Terms of Service</a>
            <a href="#" title='contact' className="hover:text-primary-600">Contact Us</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
