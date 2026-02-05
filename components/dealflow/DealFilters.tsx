import React from 'react';
import { DealFilter } from './types';
import { cn } from '../../utils/cn';

interface DealFiltersProps {
  activeFilter: DealFilter;
  onFilterChange: (filter: DealFilter) => void;
  actionRequiredCount: number;
}

const filters: { id: DealFilter; label: string; showCount?: boolean }[] = [
  { id: 'all', label: 'All' },
  { id: 'action-required', label: 'Action Required', showCount: true },
  { id: 'awaiting-payment', label: 'Awaiting Payment' },
  { id: 'funds-held', label: 'Funds Held' },
  { id: 'funds-released', label: 'Funds Released' },
  { id: 'complete', label: 'Deal Complete' },
];

export const DealFilters: React.FC<DealFiltersProps> = ({
  activeFilter,
  onFilterChange,
  actionRequiredCount,
}) => {
  return (
    <div className="flex flex-wrap items-center gap-2">
      {filters.map((filter) => {
        const isActive = activeFilter === filter.id;
        const showBadge = filter.showCount && actionRequiredCount > 0;

        return (
          <button
            key={filter.id}
            onClick={() => onFilterChange(filter.id)}
            className={cn(
              'px-4 py-2 rounded-lg text-sm font-medium transition-all',
              isActive
                ? 'bg-slate-900 text-white shadow-sm'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            )}
          >
            {filter.label}
            {showBadge && (
              <span
                className={cn(
                  'ml-2 px-1.5 py-0.5 rounded-full text-xs font-bold',
                  isActive ? 'bg-orange-500 text-white' : 'bg-orange-100 text-orange-700'
                )}
              >
                {actionRequiredCount}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
};

export default DealFilters;
