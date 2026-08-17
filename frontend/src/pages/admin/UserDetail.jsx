import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { api } from '../../lib/api';
import { ArrowLeft, Star, User as UserIcon, Store, Mail, MapPin, Shield } from 'lucide-react';
import toast from 'react-hot-toast';

const ROLE_BADGE = {
  admin: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300',
  owner: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300',
  user: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300',
};

export default function UserDetail() {
  const { id } = useParams();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const data = await api.get(`/admin/users/${id}`);
        setUser(data.user);
      } catch {
        toast.error('Failed to load user details');
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, [id]);

  if (loading) return (
    <div className="animate-pulse space-y-4">
      <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/3" />
      <div className="h-48 bg-gray-200 dark:bg-gray-700 rounded" />
    </div>
  );

  if (!user) return (
    <div className="text-center py-12 text-gray-500 dark:text-gray-400">User not found.</div>
  );

  return (
    <div className="space-y-6 max-w-2xl">
      <Link
        to="/admin/users"
        className="inline-flex items-center gap-2 text-sm text-indigo-600 dark:text-indigo-400 hover:underline"
      >
        <ArrowLeft size={16} /> Back to Users
      </Link>

      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 p-6 space-y-5">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-full bg-indigo-100 dark:bg-indigo-900 flex items-center justify-center text-2xl font-bold text-indigo-600 dark:text-indigo-400">
              {user.name.charAt(0).toUpperCase()}
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">{user.name}</h2>
              <span className={`px-2 py-0.5 text-xs font-semibold rounded-full capitalize ${ROLE_BADGE[user.role]}`}>
                {user.role}
              </span>
            </div>
          </div>
        </div>

        <dl className="space-y-3">
          <div className="flex items-start gap-3">
            <Mail size={16} className="mt-0.5 text-gray-400" />
            <div>
              <dt className="text-xs text-gray-500 dark:text-gray-400">Email</dt>
              <dd className="text-sm text-gray-900 dark:text-white">{user.email}</dd>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <MapPin size={16} className="mt-0.5 text-gray-400" />
            <div>
              <dt className="text-xs text-gray-500 dark:text-gray-400">Address</dt>
              <dd className="text-sm text-gray-900 dark:text-white">{user.address || '—'}</dd>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <Shield size={16} className="mt-0.5 text-gray-400" />
            <div>
              <dt className="text-xs text-gray-500 dark:text-gray-400">Role</dt>
              <dd className="text-sm text-gray-900 dark:text-white capitalize">{user.role}</dd>
            </div>
          </div>
        </dl>
      </div>

      {user.role === 'owner' && (
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 p-6 space-y-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
            <Store size={18} /> Store Information
          </h3>
          {user.store ? (
            <dl className="space-y-3">
              <div>
                <dt className="text-xs text-gray-500 dark:text-gray-400">Store Name</dt>
                <dd className="text-sm font-medium text-gray-900 dark:text-white">{user.store.name}</dd>
              </div>
              <div>
                <dt className="text-xs text-gray-500 dark:text-gray-400">Store Email</dt>
                <dd className="text-sm text-gray-900 dark:text-white">{user.store.email}</dd>
              </div>
              <div>
                <dt className="text-xs text-gray-500 dark:text-gray-400">Address</dt>
                <dd className="text-sm text-gray-900 dark:text-white">{user.store.address}</dd>
              </div>
              <div className="flex items-center gap-2">
                <Star size={16} className="text-yellow-500" fill="currentColor" />
                <span className="text-sm font-medium text-gray-900 dark:text-white">
                  Average Rating: <span className="text-indigo-600 dark:text-indigo-400">{user.averageRating || '0.00'}</span>
                </span>
              </div>
            </dl>
          ) : (
            <p className="text-sm text-gray-500 dark:text-gray-400">No store assigned to this owner yet.</p>
          )}
        </div>
      )}
    </div>
  );
}
