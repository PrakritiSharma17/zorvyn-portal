import React from 'react';
import { format } from 'date-fns';
import { Transaction } from '../types';
import { Clock3, ShoppingBag, Home, Zap, HeartPulse, ShoppingCart, Truck, Music, DollarSign, Edit2, Trash2, AlertTriangle } from 'lucide-react';

interface TimelineGroup {
  date: string;
  entries: Transaction[];
}

interface TimelineViewProps {
  groups: TimelineGroup[];
  isAdmin: boolean;
  onEdit: (transaction: Transaction) => void;
  onDelete: (id: string) => void;
  unusualIds: string[];
}

const categoryIcon = (category: string) => {
  const mapping: Record<string, React.ReactNode> = {
    Food: <ShoppingBag className="w-5 h-5" />,
    Rent: <Home className="w-5 h-5" />,
    Utilities: <Zap className="w-5 h-5" />,
    Health: <HeartPulse className="w-5 h-5" />,
    Shopping: <ShoppingCart className="w-5 h-5" />,
    Transportation: <Truck className="w-5 h-5" />,
    Entertainment: <Music className="w-5 h-5" />,
    Salary: <DollarSign className="w-5 h-5" />,
    Freelance: <DollarSign className="w-5 h-5" />,
  };
  return mapping[category] || <ShoppingBag className="w-5 h-5" />;
};

export const TimelineView: React.FC<TimelineViewProps> = ({ groups, isAdmin, onEdit, onDelete, unusualIds }) => {
  if (groups.length === 0) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-3xl border border-gray-200 dark:border-gray-700 p-10 text-center">
        <p className="text-gray-500 dark:text-gray-400">No timeline entries available yet. Add transactions to see your story unfold.</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {groups.map((group) => (
        <div key={group.date} className="rounded-3xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-6 shadow-sm">
          <div className="mb-6 flex items-center justify-between gap-4">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-gray-500 dark:text-gray-400">{group.date}</p>
              <p className="text-lg font-semibold text-gray-900 dark:text-white">Daily activity</p>
            </div>
            <div className="inline-flex items-center gap-2 rounded-full bg-gray-50 dark:bg-gray-900 px-4 py-2 text-sm text-gray-600 dark:text-gray-300">
              <Clock3 className="w-4 h-4" /> {group.entries.length} events
            </div>
          </div>

          <div className="space-y-4">
            {group.entries.map((entry) => (
              <div
                key={entry.id}
                className={`rounded-3xl border p-4 transition-shadow ${unusualIds.includes(entry.id) ? 'border-rose-400 bg-rose-50/40 dark:border-rose-500/30 dark:bg-rose-900/20 shadow-sm' : 'border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/70'} `}
              >
                <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                  <div className="flex items-center gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary-50 dark:bg-primary-900/20 text-primary-700 dark:text-primary-300">
                      {categoryIcon(entry.category)}
                    </div>
                    <div>
                      <p className="text-base font-semibold text-gray-900 dark:text-white">
                        {entry.type === 'expense' ? 'You spent' : 'You received'} ₹{entry.amount.toLocaleString('en-IN')} on {entry.category}
                      </p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">{entry.description}</p>
                    </div>
                  </div>
                  <div className="flex flex-col items-start gap-2 text-sm sm:items-end">
                    <span className="text-gray-500 dark:text-gray-400">{format(entry.date, 'hh:mm a')}</span>
                    {unusualIds.includes(entry.id) && (
                      <span className="inline-flex items-center gap-2 rounded-full bg-rose-100 text-rose-700 px-3 py-1 text-xs font-semibold">
                        <AlertTriangle className="w-4 h-4" /> Unusual expense
                      </span>
                    )}
                  </div>
                </div>
                {isAdmin && (
                  <div className="mt-4 flex flex-wrap gap-3">
                    <button
                      onClick={() => onEdit(entry)}
                      className="inline-flex items-center gap-2 rounded-2xl border border-primary-200 bg-primary-50 px-4 py-2 text-sm font-semibold text-primary-700 hover:bg-primary-100 transition"
                    >
                      <Edit2 className="w-4 h-4" /> Edit
                    </button>
                    <button
                      onClick={() => onDelete(entry.id)}
                      className="inline-flex items-center gap-2 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-2 text-sm font-semibold text-rose-700 hover:bg-rose-100 transition"
                    >
                      <Trash2 className="w-4 h-4" /> Delete
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};
