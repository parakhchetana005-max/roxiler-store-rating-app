import React, { useEffect, useState } from 'react';
import { api } from '../../lib/api';
import { Users, Store, Star } from 'lucide-react';
import toast from 'react-hot-toast';

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const data = await api.get('/admin/dashboard');
        setStats(data);
      } catch (err) {
        toast.error('Failed to load dashboard stats');
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) return <div className="animate-pulse flex space-x-4"><div className="flex-1 space-y-4 py-1"><div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div></div></div>;

  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Admin Dashboard</h2>
      
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {/* Total Users */}
        <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm rounded-xl border border-gray-100 dark:border-gray-700 transition-all hover:shadow-md">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Users className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">Total Users</dt>
                  <dd className="text-2xl font-semibold text-gray-900 dark:text-white">{stats?.totalUsers || 0}</dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        {/* Total Stores */}
        <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm rounded-xl border border-gray-100 dark:border-gray-700 transition-all hover:shadow-md">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Store className="h-6 w-6 text-purple-600 dark:text-purple-400" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">Total Stores</dt>
                  <dd className="text-2xl font-semibold text-gray-900 dark:text-white">{stats?.totalStores || 0}</dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        {/* Total Ratings */}
        <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm rounded-xl border border-gray-100 dark:border-gray-700 transition-all hover:shadow-md">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Star className="h-6 w-6 text-yellow-500" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">Total Ratings</dt>
                  <dd className="text-2xl font-semibold text-gray-900 dark:text-white">{stats?.totalRatings || 0}</dd>
                </dl>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Tables could go here for Users and Stores management */}
      <div className="mt-8">
         <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">Management (Placeholder)</h3>
         <p className="text-gray-500 dark:text-gray-400 mt-2">The table listing users and stores goes here.</p>
      </div>
    </div>
  );
}
