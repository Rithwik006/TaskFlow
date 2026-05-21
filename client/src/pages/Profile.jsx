import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';
import { Camera, User, Mail, Shield, CheckCircle, Clock, Calendar as CalendarIcon, Save } from 'lucide-react';
import { motion } from 'framer-motion';

const Profile = () => {
  const { dbUser, api } = useAuth();
  const [name, setName] = useState(dbUser?.name || '');
  const [isUpdating, setIsUpdating] = useState(false);

  const handleUpdate = async (e) => {
    e.preventDefault();
    setIsUpdating(true);
    try {
      await api.put('/auth/profile', { name });
      toast.success('Profile updated successfully');
    } catch (err) {
      toast.error('Failed to update profile');
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Your Profile</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Left Card - Avatar & Basic Info */}
        <div className="md:col-span-1 space-y-6">
          <div className="bg-white dark:bg-slate-900 p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm text-center">
            <div className="relative inline-block mb-4">
              <img 
                src={dbUser?.avatar || `https://ui-avatars.com/api/?name=${dbUser?.name}&size=256`} 
                alt="Profile" 
                className="w-32 h-32 rounded-3xl object-cover ring-4 ring-primary-500/10"
              />
              <button className="absolute -bottom-2 -right-2 p-2 bg-primary-600 text-white rounded-xl shadow-lg border-2 border-white dark:border-slate-900 hover:bg-primary-700 transition-all">
                <Camera size={16} />
              </button>
            </div>
            <h2 className="text-xl font-bold">{dbUser?.name}</h2>
            <p className="text-slate-500 text-sm">{dbUser?.email}</p>
            <div className="mt-4 flex justify-center">
              <span className="px-3 py-1 bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400 text-xs font-bold rounded-full border border-primary-100 dark:border-primary-800">
                {dbUser?.role}
              </span>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm">
            <h3 className="font-bold mb-4 text-sm uppercase tracking-widest text-slate-400">Account Details</h3>
            <div className="space-y-4">
              <div className="flex items-center gap-3 text-sm text-slate-600 dark:text-slate-400">
                <CalendarIcon size={16} />
                <span>Joined {new Date(dbUser?.createdAt).toLocaleDateString()}</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-slate-600 dark:text-slate-400">
                <Shield size={16} />
                <span>Status: <span className="text-green-500 font-medium">{dbUser?.status}</span></span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Card - Form & Stats */}
        <div className="md:col-span-2 space-y-8">
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white dark:bg-slate-900 p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm"
          >
            <h3 className="text-xl font-bold mb-6">General Settings</h3>
            <form onSubmit={handleUpdate} className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-slate-500 mb-2">Full Name</label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <input 
                      type="text" 
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-800 border-none rounded-xl focus:ring-2 focus:ring-primary-500 transition-all outline-none"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-500 mb-2">Email Address</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <input 
                      type="email" 
                      value={dbUser?.email}
                      disabled
                      className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-800 border-none rounded-xl opacity-60 cursor-not-allowed outline-none"
                    />
                  </div>
                </div>
              </div>
              
              <div className="flex justify-end pt-4">
                <button 
                  type="submit"
                  disabled={isUpdating}
                  className="bg-primary-600 text-white px-6 py-2.5 rounded-xl font-bold flex items-center gap-2 hover:bg-primary-700 transition-all shadow-lg shadow-primary-600/20 disabled:opacity-50"
                >
                  <Save size={18} /> {isUpdating ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </form>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="bg-gradient-to-br from-green-500 to-emerald-600 p-6 rounded-3xl text-white shadow-lg shadow-green-500/20">
              <div className="flex items-center justify-between mb-4">
                <CheckCircle size={24} />
                <span className="text-xs font-bold bg-white/20 px-2 py-1 rounded-lg uppercase">Lifetime</span>
              </div>
              <p className="text-green-100 text-sm font-medium">Completed Tasks</p>
              <h4 className="text-4xl font-extrabold mt-1">124</h4>
            </div>
            
            <div className="bg-gradient-to-br from-amber-500 to-orange-600 p-6 rounded-3xl text-white shadow-lg shadow-amber-500/20">
              <div className="flex items-center justify-between mb-4">
                <Clock size={24} />
                <span className="text-xs font-bold bg-white/20 px-2 py-1 rounded-lg uppercase">This Week</span>
              </div>
              <p className="text-amber-100 text-sm font-medium">Pending Work</p>
              <h4 className="text-4xl font-extrabold mt-1">12</h4>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
