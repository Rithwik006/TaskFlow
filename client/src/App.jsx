import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { AuthProvider, useAuth } from './context/AuthContext';
import DashboardLayout from './layouts/DashboardLayout';

import Landing from './pages/Landing';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import Tasks from './pages/Tasks';
import Calendar from './pages/Calendar';
import Profile from './pages/Profile';
import Admin from './pages/Admin';
import Settings from './pages/Settings';

const NotFound = () => (
  <div className="min-h-screen flex flex-col items-center justify-center p-10 text-center bg-slate-50 dark:bg-slate-950">
    <h1 className="text-5xl font-extrabold text-primary-600 mb-4">404</h1>
    <h2 className="text-2xl font-bold mb-4">Page Not Found</h2>
    <p className="text-slate-500 mb-8 max-w-sm">The page you are looking for might have been removed or is temporarily unavailable.</p>
    <a href="/" className="px-6 py-3 bg-primary-600 hover:bg-primary-700 text-white font-semibold rounded-2xl shadow-lg shadow-primary-600/20 transition-all">Go Back Home</a>
  </div>
);

const ProtectedRoute = ({ children, adminOnly = false }) => {
  const { currentUser, dbUser, loading } = useAuth();

  if (loading) return <div>Loading...</div>;
  if (!currentUser) return <Navigate to="/login" />;
  if (adminOnly && dbUser?.role !== 'Admin') return <Navigate to="/dashboard" />;

  return children;
};

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />

      <Route element={<ProtectedRoute><DashboardLayout /></ProtectedRoute>}>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/tasks" element={<Tasks />} />
        <Route path="/calendar" element={<Calendar />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/settings" element={<Settings />} />
        
        {/* Admin only routes */}
        <Route path="/admin" element={
          <ProtectedRoute adminOnly>
            <Admin />
          </ProtectedRoute>
        } />
      </Route>

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <AppRoutes />
        <ToastContainer position="top-right" autoClose={3000} />
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
