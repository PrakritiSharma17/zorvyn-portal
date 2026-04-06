import React, { useState } from 'react';
import { Goal, GoalProgress } from '../types';
import { Plus, Star } from 'lucide-react';

interface GoalsProps {
  progress: GoalProgress[];
  isAdmin: boolean;
  onAddGoal: (goal: Omit<Goal, 'id'>) => void;
}

export const Goals: React.FC<GoalsProps> = ({ progress, isAdmin, onAddGoal }) => {
  const [label, setLabel] = useState('New savings goal');
  const [target, setTarget] = useState(10000);
  const [type, setType] = useState<'savings' | 'limit'>('savings');
  const [category, setCategory] = useState('');

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (!label || target <= 0) return;
    onAddGoal({ label, target, type, category: type === 'limit' ? category : undefined });
    setLabel('New savings goal');
    setTarget(10000);
    setCategory('');
    setType('savings');
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-3xl border border-gray-200 dark:border-gray-700 p-6 shadow-sm">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between mb-6">
        <div>
          <p className="text-sm uppercase tracking-[0.2em] text-primary-600 dark:text-primary-400 font-semibold">
            Goal tracking
          </p>
          <h3 className="text-2xl font-semibold text-gray-900 dark:text-white">
            Stay on target
          </h3>
        </div>
        <div className="rounded-full bg-gray-50 dark:bg-gray-900 px-4 py-2 text-sm text-gray-600 dark:text-gray-300 inline-flex items-center gap-2">
          <Star className="w-4 h-4 text-yellow-500" /> Save smarter
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.3fr_0.9fr]">
        <div className="space-y-4">
          {progress.length === 0 ? (
            <div className="rounded-3xl border border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 p-6 text-center">
              <p className="text-gray-600 dark:text-gray-400">No active goals yet. Add one to begin tracking progress.</p>
            </div>
          ) : (
            progress.map((goal) => (
              <div key={goal.id} className="rounded-3xl border border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 p-5">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="font-semibold text-gray-900 dark:text-white">{goal.label}</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                      {goal.type === 'savings'
                        ? `Target savings ${goal.target.toLocaleString('en-IN')}`
                        : `Limit ${goal.category ?? 'overall'} expenses to ${goal.target.toLocaleString('en-IN')}`}
                    </p>
                  </div>
                  <span className={`rounded-full px-3 py-1 text-xs font-semibold ${goal.status === 'achieved' ? 'bg-emerald-100 text-emerald-700' : goal.alert ? 'bg-amber-100 text-amber-700' : 'bg-slate-100 dark:bg-slate-900 text-slate-700 dark:text-slate-300'}`}>
                    {goal.status === 'achieved' ? 'Achieved' : goal.alert ? '80% reached' : 'On track'}
                  </span>
                </div>
                <div className="mt-4 h-3 rounded-full bg-gray-200 dark:bg-gray-700 overflow-hidden">
                  <div className="h-full rounded-full bg-gradient-to-r from-primary-500 to-primary-600" style={{ width: `${goal.percentage}%` }} />
                </div>
                <div className="mt-3 flex items-center justify-between text-sm text-gray-600 dark:text-gray-400">
                  <span>{goal.current.toLocaleString('en-IN')} used</span>
                  <span>{goal.percentage.toFixed(0)}%</span>
                </div>
              </div>
            ))
          )}
        </div>

        <div className="rounded-3xl border border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 p-6">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-gray-500 dark:text-gray-400 mb-4">Create new goal</p>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Goal type</label>
              <select
                value={type}
                onChange={(event) => setType(event.target.value as 'savings' | 'limit')}
                className="w-full rounded-2xl border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 px-4 py-3 text-gray-900 dark:text-white"
              >
                <option value="savings">Savings goal</option>
                <option value="limit">Expense limit</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Label</label>
              <input
                value={label}
                onChange={(event) => setLabel(event.target.value)}
                className="w-full rounded-2xl border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 px-4 py-3 text-gray-900 dark:text-white"
              />
            </div>

            {type === 'limit' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Category</label>
                <input
                  value={category}
                  onChange={(event) => setCategory(event.target.value)}
                  placeholder="e.g. Food"
                  className="w-full rounded-2xl border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 px-4 py-3 text-gray-900 dark:text-white"
                />
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Target amount</label>
              <input
                type="number"
                min={1}
                value={target}
                onChange={(event) => setTarget(Number(event.target.value))}
                className="w-full rounded-2xl border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 px-4 py-3 text-gray-900 dark:text-white"
              />
            </div>

            <button
              type="submit"
              disabled={!isAdmin}
              className="w-full inline-flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-primary-500 to-primary-600 px-4 py-3 text-white font-semibold hover:shadow-lg transition-all disabled:cursor-not-allowed disabled:opacity-50"
            >
              <Plus className="w-4 h-4" /> Add goal
            </button>
            {!isAdmin && (
              <p className="text-sm text-gray-500 dark:text-gray-400">Switch to Admin mode to create new goals.</p>
            )}
          </form>
        </div>
      </div>
    </div>
  );
};
