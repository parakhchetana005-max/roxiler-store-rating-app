import React from 'react';
import { ArrowUp, ArrowDown, ArrowUpDown } from 'lucide-react';

export default function SortableHeader({ label, field, sortBy, order, onSort }) {
  const active = sortBy === field;
  return (
    <th
      className="px-4 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700/50 select-none"
      onClick={() => onSort(field)}
    >
      <div className="flex items-center gap-1">
        {label}
        {active ? (
          order === 'ASC' ? <ArrowUp size={14} className="text-indigo-500" /> : <ArrowDown size={14} className="text-indigo-500" />
        ) : (
          <ArrowUpDown size={14} className="opacity-30" />
        )}
      </div>
    </th>
  );
}
