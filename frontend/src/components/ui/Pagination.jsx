import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export default function Pagination({ page, total, limit, onPageChange, onLimitChange }) {
  const totalPages = Math.max(1, Math.ceil(total / limit));

  return (
    <div className="flex flex-wrap items-center justify-between gap-3 mt-4">
      <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
        <span>Rows per page:</span>
        <select
          value={limit}
          onChange={(e) => { onLimitChange(Number(e.target.value)); onPageChange(1); }}
          className="border border-gray-300 dark:border-gray-600 rounded px-2 py-1 text-sm dark:bg-gray-800 dark:text-white"
        >
          {[10, 25, 50].map(n => <option key={n} value={n}>{n}</option>)}
        </select>
      </div>

      <div className="flex items-center gap-3 text-sm text-gray-600 dark:text-gray-400">
        <span>
          {total === 0 ? '0' : (page - 1) * limit + 1}–{Math.min(page * limit, total)} of {total}
        </span>
        <div className="flex items-center gap-1">
          <button
            disabled={page <= 1}
            onClick={() => onPageChange(page - 1)}
            className="p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <ChevronLeft size={18} />
          </button>
          <span className="font-medium px-1">
            {page} / {totalPages}
          </span>
          <button
            disabled={page >= totalPages}
            onClick={() => onPageChange(page + 1)}
            className="p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <ChevronRight size={18} />
          </button>
        </div>
      </div>
    </div>
  );
}
