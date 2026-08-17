import React, { useCallback, useEffect, useRef, useState } from 'react';
import { api } from '../../lib/api';
import { Star, MapPin, Search, ArrowUp, ArrowDown } from 'lucide-react';
import toast from 'react-hot-toast';
import Pagination from '../../components/ui/Pagination';

export default function Stores() {
  const [stores, setStores] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [sortBy, setSortBy] = useState('name');
  const [order, setOrder] = useState('ASC');
  const [filters, setFilters] = useState({ name: '', address: '' });
  const [loading, setLoading] = useState(true);
  const [submittingId, setSubmittingId] = useState(null);
  const debounceRef = useRef(null);

  const fetchStores = useCallback(async () => {
    setLoading(true);
    try {
      const params = { page, limit, sortBy, order };
      if (filters.name) params.name = filters.name;
      if (filters.address) params.address = filters.address;
      const data = await api.get('/stores', { params });
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

  const handleFilterChange = (key, val) => {
    setFilters(prev => ({ ...prev, [key]: val }));
    setPage(1);
  };

  const handleSort = (field) => {
    if (sortBy === field) setOrder(prev => prev === 'ASC' ? 'DESC' : 'ASC');
    else { setSortBy(field); setOrder('ASC'); }
    setPage(1);
  };

  const handleRating = async (storeId, rating, hasRating) => {
    setSubmittingId(storeId);
    try {
      if (hasRating) {
        await api.put(`/stores/${storeId}/ratings`, { rating });
        toast.success('Rating updated!');
      } else {
        await api.post(`/stores/${storeId}/ratings`, { rating });
        toast.success('Rating submitted!');
      }
      fetchStores();
    } catch (err) {
      const msg = err?.rating || err?.store || err?.auth || 'Failed to submit rating';
      toast.error(msg);
    } finally {
      setSubmittingId(null);
    }
  };

  const SortBtn = ({ field, label }) => {
    const active = sortBy === field;
    return (
      <button
        onClick={() => handleSort(field)}
        className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
          active
            ? 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/40 dark:text-indigo-300'
            : 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
        }`}
      >
        {label}
        {active ? (
          order === 'ASC' ? <ArrowUp size={14} /> : <ArrowDown size={14} />
        ) : null}
      </button>
    );
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Registered Stores</h2>

      {/* Search & Sort Controls */}
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 p-4 space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="relative">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              value={filters.name}
              onChange={e => handleFilterChange('name', e.target.value)}
              placeholder="Search by store name..."
              className="pl-9 pr-3 py-2 w-full border border-gray-300 dark:border-gray-600 rounded-lg text-sm dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-400"
            />
          </div>
          <div className="relative">
            <MapPin size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              value={filters.address}
              onChange={e => handleFilterChange('address', e.target.value)}
              placeholder="Search by address..."
              className="pl-9 pr-3 py-2 w-full border border-gray-300 dark:border-gray-600 rounded-lg text-sm dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-400"
            />
          </div>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-xs text-gray-500 dark:text-gray-400">Sort by:</span>
          <SortBtn field="name" label="Name" />
          <SortBtn field="address" label="Address" />
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 p-6 animate-pulse space-y-3">
              <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded w-3/4" />
              <div className="h-4 bg-gray-100 dark:bg-gray-700 rounded w-1/2" />
              <div className="h-8 bg-gray-100 dark:bg-gray-700 rounded w-full mt-4" />
            </div>
          ))}
        </div>
      ) : stores.length === 0 ? (
        <div className="text-center py-16 text-gray-500 dark:text-gray-400">
          <Star size={40} className="mx-auto mb-3 opacity-30" />
          <p>No stores found.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {stores.map(store => (
            <div key={store.id} className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden hover:shadow-md transition-shadow">
              <div className="p-6">
                <div className="flex justify-between items-start mb-3">
                  <h3 className="text-base font-bold text-gray-900 dark:text-white leading-snug">{store.name}</h3>
                  <div className="flex items-center gap-1 bg-amber-50 dark:bg-amber-900/20 px-2 py-1 rounded text-amber-700 dark:text-amber-300 shrink-0 ml-2">
                    <Star size={14} fill="currentColor" />
                    <span className="font-semibold text-xs">{store.averageRating}</span>
                  </div>
                </div>

                <p className="flex items-center gap-1.5 text-xs text-gray-500 dark:text-gray-400 mb-5">
                  <MapPin size={13} /> {store.address}
                </p>

                <div className="pt-4 border-t border-gray-100 dark:border-gray-700">
                  {store.myRating != null ? (
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-medium text-gray-600 dark:text-gray-300">Your rating</span>
                        <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400">{store.myRating}/5</span>
                      </div>
                      <div className="flex gap-1">
                        {[1, 2, 3, 4, 5].map(star => (
                          <button
                            key={star}
                            disabled={submittingId === store.id}
                            onClick={() => handleRating(store.id, star, true)}
                            title={`Modify rating to ${star}`}
                            className={`transition-transform ${submittingId === store.id ? 'opacity-50 cursor-not-allowed' : 'hover:scale-110 active:scale-95'}`}
                          >
                            <Star
                              size={22}
                              className={star <= store.myRating ? 'text-yellow-400' : 'text-gray-300 dark:text-gray-600'}
                              fill={star <= store.myRating ? 'currentColor' : 'none'}
                            />
                          </button>
                        ))}
                      </div>
                      <p className="text-xs text-gray-400">Click to modify rating</p>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <span className="text-xs font-medium text-gray-600 dark:text-gray-300">Submit your rating:</span>
                      <div className="flex gap-1">
                        {[1, 2, 3, 4, 5].map(star => (
                          <button
                            key={star}
                            disabled={submittingId === store.id}
                            onClick={() => handleRating(store.id, star, false)}
                            title={`Rate ${star} star${star > 1 ? 's' : ''}`}
                            className={`transition-transform ${submittingId === store.id ? 'opacity-50 cursor-not-allowed' : 'hover:scale-110 active:scale-95'}`}
                          >
                            <Star size={22} className="text-gray-300 dark:text-gray-600 hover:text-yellow-400 transition-colors" fill="none" />
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <Pagination
        page={page} total={total} limit={limit}
        onPageChange={setPage}
        onLimitChange={(l) => { setLimit(l); setPage(1); }}
      />
    </div>
  );
}
