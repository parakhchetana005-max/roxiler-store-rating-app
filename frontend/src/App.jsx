import React, { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { useAuthStore } from './store/authStore';
import { Toaster } from 'react-hot-toast';

import Login from './pages/auth/Login';
import Signup from './pages/auth/Signup';
import Layout from './components/layout/Layout';
import AdminDashboard from './pages/admin/Dashboard';
import OwnerDashboard from './pages/owner/Dashboard';
import UserStores from './pages/user/Stores';

const ProtectedRoute = ({ allowedRoles }) => {
  const { user, loading } = useAuthStore();
  
  if (loading) return <div className="p-8 flex justify-center items-center h-screen"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div></div>;
  if (!user) return <Navigate to="/login" replace />;
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/" replace />; // or to unauthorized
  }
  return <Outlet />;
};

export default function App() {
  const { checkAuth, loading, user } = useAuthStore();
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light');

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => setTheme(prev => prev === 'light' ? 'dark' : 'light');

  if (loading) {
    return <div className="h-screen w-full flex items-center justify-center dark:bg-gray-900 bg-gray-50"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div></div>;
  }

  return (
    <BrowserRouter>
      <Toaster position="top-right" />
      <Routes>
        <Route path="/login" element={user ? <Navigate to="/" replace /> : <Login toggleTheme={toggleTheme} theme={theme} />} />
        <Route path="/signup" element={user ? <Navigate to="/" replace /> : <Signup toggleTheme={toggleTheme} theme={theme} />} />
        
        <Route element={<Layout toggleTheme={toggleTheme} theme={theme} />}>
          {/* Base redirect based on role */}
          <Route path="/" element={
            !user ? <Navigate to="/login" replace /> :
            user.role === 'admin' ? <Navigate to="/admin" replace /> :
            user.role === 'owner' ? <Navigate to="/owner" replace /> :
            <Navigate to="/stores" replace />
          } />

          {/* Admin Routes */}
          <Route element={<ProtectedRoute allowedRoles={['admin']} />}>
            <Route path="/admin" element={<AdminDashboard />} />
          </Route>

          {/* Owner Routes */}
          <Route element={<ProtectedRoute allowedRoles={['owner']} />}>
            <Route path="/owner" element={<OwnerDashboard />} />
          </Route>

          {/* User Routes (also accessible by admin/owner if they want, but mostly user) */}
          <Route element={<ProtectedRoute />}>
            <Route path="/stores" element={<UserStores />} />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
