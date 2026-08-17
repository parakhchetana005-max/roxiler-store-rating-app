import React, { useCallback, useEffect, useRef, useState } from 'react';
import { api } from '../../lib/api';
import toast from 'react-hot-toast';
import { Search, Plus, Star, X } from 'lucide-react';
import Pagination from '../../components/ui/Pagination';
import SortableHeader from '../../components/ui/SortableHeader';

const initialForm = { name: '', email: '', address: '', owner_id: '' };

export default function AdminStores() {
  const [stores, setStores] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [sortBy, setSortBy] = useState('created_at');
  const [order, setOrder] = useState('DESC');
  const [filters, setFilters] = useState({ name: '', email: '', address: '' });
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState(initialForm);
  const [formErrors, setFormErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [owners, setOwners] = useState([]);
  const debounceRef = useRef(null);

  const fetchOwners = async () => {
    try {
      const data = await api.get('/admin/users', { params: { role: 'owner', limit: 100 } });
      setOwners(data.users);
    } catch {}
  };

  const fetchStores = useCallback(async () => {
    setLoading(true);
    try {
      const params = { page, limit, sortBy, order };
      if (filters.name) params.name = filters.name;
      if (filters.email) params.email = filters.email;
      if (filters.address) params.address = filters.address;
      const data = await api.get('/admin/stores', { params });
      setStores(data.stores);
      setTotal(data.total);
    } catch {
      toast.error('Failed to load stores');
    } finally {
      setLoading(false);
    }
  }, [page, limit, sortBy, order, filters]);

  useEffect(() => {
    clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(fetchStores, 300);
    return () => clearTimeout(debounceRef.current);
  }, [fetchStores]);

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
    if (!form.name) e.name = 'Store name required';
    if (!form.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = 'Valid email required';
    if (!form.address) e.address = 'Address required';
    if (form.address && form.address.length > 400) e.address = 'Max 400 characters';
    if (!form.owner_id) e.owner_id = 'Owner required';
    return e;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const e2 = validate();
    if (Object.keys(e2).length) { setFormErrors(e2); return; }
    setSubmitting(true);
    try {
      await api.post('/admin/stores', form);
      toast.success('Store created successfully');
      setShowModal(false);
      setForm(initialForm);
      setFormErrors({});
      fetchStores();
    } catch (err) {
      const serverErrors = err || {};
      setFormErrors(serverErrors);
      toast.error(Object.values(serverErrors)[0] || 'Failed to create store');
    } finally {
      setSubmitting(false);
    }
  };

  const openModal = () => {
    setShowModal(true);
    setForm(initialForm);
    setFormErrors({});
    fetchOwners();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Stores</h2>
        <button
          onClick={openModal}
          className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 text-sm font-medium transition-colors"
        >
          <Plus size={16} /> Add Store
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 p-4">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
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
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Owner</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Rating</th>
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
              ) : stores.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-4 py-12 text-center text-gray-500 dark:text-gray-400">No stores found.</td>
                </tr>
              ) : (
                stores.map(store => (
                  <tr key={store.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/40 transition-colors">
                    <td className="px-4 py-3 text-sm font-medium text-gray-900 dark:text-white max-w-[180px] truncate">{store.name}</td>
                    <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-300">{store.email}</td>
                    <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-300 max-w-[200px] truncate">{store.address}</td>
                    <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-300">{store.owner?.name || '—'}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1 text-sm font-medium">
                        <Star size={14} className="text-yellow-500" fill="currentColor" />
                        {store.averageRating}
                      </div>
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

      {/* Add Store Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-lg mx-4">
            <div className="flex items-center justify-between p-6 border-b dark:border-gray-700">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">Add New Store</h3>
              <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200">
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              {[
                { key: 'name', label: 'Store Name', type: 'text' },
                { key: 'email', label: 'Store Email', type: 'email' },
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
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Store Owner</label>
                <select
                  value={form.owner_id}
                  onChange={e => setForm(prev => ({ ...prev, owner_id: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-400"
                >
                  <option value="">Select an owner...</option>
                  {owners.map(o => (
                    <option key={o.id} value={o.id}>{o.name} ({o.email})</option>
                  ))}
                </select>
                {formErrors.owner_id && <p className="text-xs text-red-500 mt-1">{formErrors.owner_id}</p>}
              </div>
              <div className="flex gap-3 pt-2">
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex-1 py-2.5 bg-indigo-600 text-white rounded-lg font-medium text-sm hover:bg-indigo-700 disabled:opacity-50 transition-colors"
                >
                  {submitting ? 'Creating...' : 'Create Store'}
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
