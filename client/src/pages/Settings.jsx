import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';
import { 
  Bell, 
  Volume2, 
  VolumeX, 
  Shield, 
  Smartphone, 
  Mail, 
  Save, 
  HelpCircle, 
  Lock, 
  Moon, 
  Sun,
  LayoutGrid
} from 'lucide-react';

const Settings = () => {
  const { dbUser } = useAuth();
  
  // States
  const [notifications, setNotifications] = useState({
    emailSummary: true,
    realTimeAlerts: true,
    soundPrompts: true,
    taskAssignments: true
  });

  const [appearance, setAppearance] = useState({
    theme: document.body.classList.contains('dark') ? 'dark' : 'light',
    density: 'comfortable', // compact, comfortable
    glassmorphism: true
  });

  const [isSaving, setIsSaving] = useState(false);

  const handleNotificationChange = (field) => {
    setNotifications(prev => ({
      ...prev,
      [field]: !prev[field]
    }));
  };

  const handleThemeChange = (newTheme) => {
    setAppearance(prev => ({ ...prev, theme: newTheme }));
    if (newTheme === 'dark') {
      document.body.classList.add('dark');
    } else {
      document.body.classList.remove('dark');
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsSaving(false);
      toast.success('Settings updated successfully!');
    }, 800);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Settings</h1>
        <p className="text-slate-500 dark:text-slate-400">Configure your workspace defaults and communication preferences</p>
      </div>

      <form onSubmit={handleSave} className="space-y-8">
        {/* Appearance Settings */}
        <motion.div 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-slate-900 p-6 md:p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm"
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400 flex items-center justify-center">
              <Sun size={20} className="dark:hidden" />
              <Moon size={20} className="hidden dark:block" />
            </div>
            <div>
              <h3 className="text-lg font-bold">Appearance</h3>
              <p className="text-xs text-slate-400">Select how TaskFlow looks on your monitor</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {/* Theme Selector */}
            <div>
              <label className="block text-sm font-medium text-slate-500 dark:text-slate-400 mb-3">Color Mode</label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => handleThemeChange('light')}
                  className={`flex items-center justify-center gap-2 p-3 rounded-2xl border text-sm font-semibold transition-all ${
                    appearance.theme === 'light'
                      ? 'border-primary-500 bg-primary-50/50 text-primary-600 dark:bg-primary-950/20'
                      : 'border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400'
                  }`}
                >
                  <Sun size={18} /> Light
                </button>
                <button
                  type="button"
                  onClick={() => handleThemeChange('dark')}
                  className={`flex items-center justify-center gap-2 p-3 rounded-2xl border text-sm font-semibold transition-all ${
                    appearance.theme === 'dark'
                      ? 'border-primary-500 bg-primary-50/50 text-primary-600 dark:bg-primary-950/20'
                      : 'border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400'
                  }`}
                >
                  <Moon size={18} /> Dark
                </button>
              </div>
            </div>

            {/* Density Selector */}
            <div>
              <label className="block text-sm font-medium text-slate-500 dark:text-slate-400 mb-3">Display Density</label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setAppearance(prev => ({ ...prev, density: 'comfortable' }))}
                  className={`flex items-center justify-center gap-2 p-3 rounded-2xl border text-sm font-semibold transition-all ${
                    appearance.density === 'comfortable'
                      ? 'border-primary-500 bg-primary-50/50 text-primary-600'
                      : 'border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400'
                  }`}
                >
                  Comfortable
                </button>
                <button
                  type="button"
                  onClick={() => setAppearance(prev => ({ ...prev, density: 'compact' }))}
                  className={`flex items-center justify-center gap-2 p-3 rounded-2xl border text-sm font-semibold transition-all ${
                    appearance.density === 'compact'
                      ? 'border-primary-500 bg-primary-50/50 text-primary-600'
                      : 'border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400'
                  }`}
                >
                  Compact
                </button>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Notifications & Sounds Settings */}
        <motion.div 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white dark:bg-slate-900 p-6 md:p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm"
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
              <Bell size={20} />
            </div>
            <div>
              <h3 className="text-lg font-bold">Notifications & Sound</h3>
              <p className="text-xs text-slate-400">Control alert dispatches and real-time audios</p>
            </div>
          </div>

          <div className="space-y-5">
            {[
              {
                id: 'realTimeAlerts',
                title: 'Real-time in-app alerts',
                desc: 'Instantly notify me inside the app when a task is updated or reassigned.',
                icon: Bell
              },
              {
                id: 'soundPrompts',
                title: 'Sound triggers on actions',
                desc: 'Play soft action bells when dropping task cards or creating columns.',
                icon: Volume2
              },
              {
                id: 'emailSummary',
                title: 'Daily email dispatches',
                desc: 'Deliver a summary report of pending and completed tasks to my mailbox.',
                icon: Mail
              },
              {
                id: 'taskAssignments',
                title: 'Assignee allocations alerts',
                desc: 'Alert me instantly if another teammate assigns a task card to me.',
                icon: Shield
              }
            ].map((pref) => (
              <div key={pref.id} className="flex items-start justify-between gap-4 p-4 hover:bg-slate-50 dark:hover:bg-slate-800/20 rounded-2xl transition-all">
                <div className="flex gap-3">
                  <div className="p-2 bg-slate-100 dark:bg-slate-800 text-slate-500 rounded-lg shrink-0">
                    <pref.icon size={16} />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold">{pref.title}</h4>
                    <p className="text-xs text-slate-400 mt-0.5">{pref.desc}</p>
                  </div>
                </div>
                
                {/* Switch Toggle */}
                <button
                  type="button"
                  onClick={() => handleNotificationChange(pref.id)}
                  className={`w-11 h-6 rounded-full p-1 transition-colors ${
                    notifications[pref.id] ? 'bg-primary-600' : 'bg-slate-200 dark:bg-slate-700'
                  } flex items-center`}
                >
                  <div
                    className={`w-4 h-4 rounded-full bg-white transition-transform ${
                      notifications[pref.id] ? 'translate-x-5' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Security & Access */}
        <motion.div 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white dark:bg-slate-900 p-6 md:p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm"
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
              <Lock size={20} />
            </div>
            <div>
              <h3 className="text-lg font-bold">Security</h3>
              <p className="text-xs text-slate-400">Account status and credentials details</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-slate-500 dark:text-slate-400 mb-2">Workspace Role</label>
              <input
                type="text"
                value={dbUser?.role || 'User'}
                disabled
                className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border-none rounded-xl text-sm font-semibold opacity-70 cursor-not-allowed outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-500 dark:text-slate-400 mb-2">Auth Mechanism</label>
              <input
                type="text"
                value="Firebase Authenticated Client"
                disabled
                className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border-none rounded-xl text-sm font-semibold opacity-70 cursor-not-allowed outline-none"
              />
            </div>
          </div>
        </motion.div>

        {/* Save Bar */}
        <div className="flex justify-end items-center gap-4">
          <button
            type="button"
            className="px-5 py-3 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 dark:text-slate-300 rounded-2xl text-sm font-bold transition-all"
          >
            Reset Defaults
          </button>
          <button
            type="submit"
            disabled={isSaving}
            className="flex items-center gap-2 px-8 py-3 bg-primary-600 hover:bg-primary-700 text-white rounded-2xl text-sm font-bold shadow-lg hover:shadow-primary-600/20 transition-all active:scale-[0.98] disabled:opacity-50"
          >
            <Save size={18} />
            {isSaving ? 'Saving Preferences...' : 'Save Settings'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default Settings;
