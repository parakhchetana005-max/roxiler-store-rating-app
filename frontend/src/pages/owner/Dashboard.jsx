import React, { useEffect, useState } from 'react';
import { api } from '../../lib/api';
import { Star, Users, ArrowUp, ArrowDown } from 'lucide-react';
import toast from 'react-hot-toast';

export default function OwnerDashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState('created_at');
  const [order, setOrder] = useState('DESC');

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const result = await api.get('/owner/dashboard');
        setData(result);
      } catch (err) {
        toast.error(err?.message || err?.server || 'Failed to load store data');
      } finally {
        setLoading(false);
      }
    };
    fetchDashboard();
  }, []);

  if (loading) return (
    <div className="animate-pulse space-y-4">
      <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/3" />
      <div className="grid grid-cols-2 gap-4">
        <div className="h-24 bg-gray-200 dark:bg-gray-700 rounded" />
        <div className="h-24 bg-gray-200 dark:bg-gray-700 rounded" />
      </div>
    </div>
  );

  if (!data?.store) return (
    <div className="bg-yellow-50 dark:bg-yellow-900/30 border-l-4 border-yellow-400 p-4 rounded-md">
      <p className="text-yellow-700 dark:text-yellow-300">No store assigned to your account. Contact an administrator.</p>
    </div>
  );

  const handleSort = (field) => {
    if (sortBy === field) setOrder(prev => prev === 'ASC' ? 'DESC' : 'ASC');
    else { setSortBy(field); setOrder('ASC'); }
  };

  const sortedRaters = [...(data.raters || [])].sort((a, b) => {
    let aVal, bVal;
    if (sortBy === 'rating') { aVal = a.rating; bVal = b.rating; }
    else if (sortBy === 'name') { aVal = a.user?.name || ''; bVal = b.user?.name || ''; }
    else if (sortBy === 'email') { aVal = a.user?.email || ''; bVal = b.user?.email || ''; }
    else { aVal = new Date(a.created_at); bVal = new Date(b.created_at); }
    if (aVal < bVal) return order === 'ASC' ? -1 : 1;
    if (aVal > bVal) return order === 'ASC' ? 1 : -1;
    return 0;
  });

  const SortTh = ({ field, label }) => {
    const active = sortBy === field;
    return (
      <th
        className="px-4 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700/50"
        onClick={() => handleSort(field)}
      >
        <div className="flex items-center gap-1">
          {label}
          {active ? (
            order === 'ASC' ? <ArrowUp size={13} className="text-indigo-500" /> : <ArrowDown size={13} className="text-indigo-500" />
          ) : null}
        </div>
      </th>
    );
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{data.store.name}</h2>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">{data.store.address} · {data.store.email}</p>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 p-5 flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center">
            <Star size={22} className="text-amber-500" fill="currentColor" />
          </div>
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">Average Rating</p>
            <p className="text-3xl font-bold text-gray-900 dark:text-white">{data.averageRating}</p>
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 p-5 flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center">
            <Users size={22} className="text-indigo-500" />
          </div>
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">Total Reviews</p>
            <p className="text-3xl font-bold text-gray-900 dark:text-white">{data.raters.length}</p>
          </div>
        </div>
      </div>

      {/* Raters Table */}
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 overflow-hidden">
        <div className="px-4 py-4 border-b border-gray-100 dark:border-gray-700">
          <h3 className="font-semibold text-gray-900 dark:text-white">Rating Users</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-100 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-800/80">
              <tr>
                <SortTh field="name" label="Name" />
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Email</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Address</th>
                <SortTh field="rating" label="Rating" />
                <SortTh field="created_at" label="Date" />
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
              {sortedRaters.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-4 py-12 text-center text-gray-500 dark:text-gray-400">No ratings yet.</td>
                </tr>
              ) : sortedRaters.map(r => (
                <tr key={r.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/40 transition-colors">
                  <td className="px-4 py-3 text-sm font-medium text-gray-900 dark:text-white">{r.user?.name || '—'}</td>
                  <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-300">{r.user?.email || '—'}</td>
                  <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-300 max-w-[180px] truncate">{r.user?.address || '—'}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1">
                      {[1, 2, 3, 4, 5].map(s => (
                        <Star key={s} size={14} className={s <= r.rating ? 'text-yellow-400' : 'text-gray-300 dark:text-gray-600'} fill={s <= r.rating ? 'currentColor' : 'none'} />
                      ))}
                      <span className="ml-1 text-sm font-semibold text-gray-700 dark:text-gray-200">{r.rating}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-500 dark:text-gray-400">
                    {new Date(r.created_at).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
