import React, { useCallback, useEffect, useRef, useState } from 'react';
import { api } from '../../lib/api';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { Search, Plus, X, Eye } from 'lucide-react';
import Pagination from '../../components/ui/Pagination';
import SortableHeader from '../../components/ui/SortableHeader';

const ROLE_BADGE = {
  admin: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300',
  owner: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300',
  user: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300',
};

const initialForm = { name: '', email: '', password: '', address: '', role: 'user' };

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [sortBy, setSortBy] = useState('created_at');
  const [order, setOrder] = useState('DESC');
  const [filters, setFilters] = useState({ name: '', email: '', address: '', role: '' });
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState(initialForm);
  const [formErrors, setFormErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const debounceRef = useRef(null);

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    try {
      const params = { page, limit, sortBy, order };
      if (filters.name) params.name = filters.name;
      if (filters.email) params.email = filters.email;
      if (filters.address) params.address = filters.address;
      if (filters.role) params.role = filters.role;
      const data = await api.get('/admin/users', { params });
      setUsers(data.users);
      setTotal(data.total);
    } catch {
      toast.error('Failed to load users');
    } finally {
      setLoading(false);
    }
  }, [page, limit, sortBy, order, filters]);

  useEffect(() => {
    clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(fetchUsers, 300);
    return () => clearTimeout(debounceRef.current);
  }, [fetchUsers]);

  const handleSort = (field) => {
    if (sortBy === field) setOrder(prev => prev === 'ASC' ? 'DESC' : 'ASC');
    else { setSortBy(field); setOrder('ASC'); }
    setPage(1);
  };

  const handleFilterChange = (key, val) => {
    setFilters(prev => ({ ...prev, [key]: val }));
    setPage(1);
  };

  const validate = () => {
    const e = {};
    if (!form.name || form.name.length < 20) e.name = 'Name must be at least 20 characters';
    if (form.name.length > 60) e.name = 'Name must be at most 60 characters';
    if (!form.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = 'Valid email required';
    if (!form.password || form.password.length < 8 || form.password.length > 16) e.password = 'Password must be 8-16 characters';
    if (!/[A-Z]/.test(form.password)) e.password = (e.password || '') + ' Must contain uppercase.';
    if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(form.password)) e.password = (e.password || '') + ' Must contain special character.';
    if (form.address && form.address.length > 400) e.address = 'Address max 400 characters';
    if (!form.role) e.role = 'Role required';
    return e;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const e2 = validate();
    if (Object.keys(e2).length) { setFormErrors(e2); return; }
    setSubmitting(true);
    try {
      await api.post('/admin/users', form);
      toast.success('User created successfully');
      setShowModal(false);
      setForm(initialForm);
      setFormErrors({});
      fetchUsers();
    } catch (err) {
      const serverErrors = err || {};
      setFormErrors(serverErrors);
      toast.error(Object.values(serverErrors)[0] || 'Failed to create user');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Users</h2>
        <button
          onClick={() => { setShowModal(true); setForm(initialForm); setFormErrors({}); }}
          className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 text-sm font-medium transition-colors"
        >
          <Plus size={16} /> Add User
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 p-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {[
            { key: 'name', placeholder: 'Search by name...' },
            { key: 'email', placeholder: 'Search by email...' },
            { key: 'address', placeholder: 'Search by address...' },
          ].map(({ key, placeholder }) => (
            <div key={key} className="relative">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                value={filters[key]}
                onChange={e => handleFilterChange(key, e.target.value)}
                placeholder={placeholder}
                className="pl-9 pr-3 py-2 w-full border border-gray-300 dark:border-gray-600 rounded-lg text-sm dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-400"
              />
            </div>
          ))}
          <select
            value={filters.role}
            onChange={e => handleFilterChange('role', e.target.value)}
            className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-400"
          >
            <option value="">All roles</option>
            <option value="admin">Admin</option>
            <option value="user">User</option>
            <option value="owner">Store Owner</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-100 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-800/80">
              <tr>
                <SortableHeader label="Name" field="name" sortBy={sortBy} order={order} onSort={handleSort} />
                <SortableHeader label="Email" field="email" sortBy={sortBy} order={order} onSort={handleSort} />
                <SortableHeader label="Address" field="address" sortBy={sortBy} order={order} onSort={handleSort} />
                <SortableHeader label="Role" field="role" sortBy={sortBy} order={order} onSort={handleSort} />
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
              {loading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i} className="animate-pulse">
                    {Array.from({ length: 5 }).map((_, j) => (
                      <td key={j} className="px-4 py-3"><div className="h-4 bg-gray-100 dark:bg-gray-700 rounded" /></td>
                    ))}
                  </tr>
                ))
              ) : users.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-4 py-12 text-center text-gray-500 dark:text-gray-400">No users found.</td>
                </tr>
              ) : (
                users.map(user => (
                  <tr key={user.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/40 transition-colors">
                    <td className="px-4 py-3 text-sm font-medium text-gray-900 dark:text-white max-w-[200px] truncate">{user.name}</td>
                    <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-300">{user.email}</td>
                    <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-300 max-w-[200px] truncate">{user.address || '—'}</td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-0.5 text-xs font-semibold rounded-full capitalize ${ROLE_BADGE[user.role]}`}>
                        {user.role}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <Link
                        to={`/admin/users/${user.id}`}
                        className="inline-flex items-center gap-1 text-xs text-indigo-600 dark:text-indigo-400 hover:underline"
                      >
                        <Eye size={14} /> View
                      </Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        <div className="px-4 py-3 border-t border-gray-100 dark:border-gray-700">
          <Pagination
            page={page} total={total} limit={limit}
            onPageChange={setPage}
            onLimitChange={(l) => { setLimit(l); setPage(1); }}
          />
        </div>
      </div>

      {/* Add User Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-lg mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b dark:border-gray-700">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">Add New User</h3>
              <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200">
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              {[
                { key: 'name', label: 'Name', type: 'text', hint: '20–60 characters' },
                { key: 'email', label: 'Email', type: 'email' },
                { key: 'password', label: 'Password', type: 'password', hint: '8-16 chars, 1 uppercase, 1 special' },
                { key: 'address', label: 'Address', type: 'text', hint: 'Max 400 characters' },
              ].map(({ key, label, type, hint }) => (
                <div key={key}>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{label}</label>
                  <input
                    type={type}
                    value={form[key]}
                    onChange={e => setForm(prev => ({ ...prev, [key]: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-400"
                  />
                  {hint && <p className="text-xs text-gray-400 mt-1">{hint}</p>}
                  {formErrors[key] && <p className="text-xs text-red-500 mt-1">{formErrors[key]}</p>}
                </div>
              ))}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Role</label>
                <select
                  value={form.role}
                  onChange={e => setForm(prev => ({ ...prev, role: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-400"
                >
                  <option value="user">Normal User</option>
                  <option value="admin">Admin</option>
                  <option value="owner">Store Owner</option>
                </select>
                {formErrors.role && <p className="text-xs text-red-500 mt-1">{formErrors.role}</p>}
              </div>
              <div className="flex gap-3 pt-2">
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex-1 py-2.5 bg-indigo-600 text-white rounded-lg font-medium text-sm hover:bg-indigo-700 disabled:opacity-50 transition-colors"
                >
                  {submitting ? 'Creating...' : 'Create User'}
                </button>
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg font-medium text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
