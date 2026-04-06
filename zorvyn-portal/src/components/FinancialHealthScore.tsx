import React from 'react';
import { CircleDollarSign, ShieldCheck, Activity } from 'lucide-react';

interface FinancialHealthScoreProps {
  score: number;
  category: 'green' | 'yellow' | 'red';
  savingsRate: number;
  expenseRatio: number;
  consistency: number;
}

const colorMap = {
  green: 'from-emerald-500 to-emerald-400',
  yellow: 'from-amber-400 to-amber-300',
  red: 'from-rose-500 to-rose-400',
};

export const FinancialHealthScore: React.FC<FinancialHealthScoreProps> = ({
  score,
  category,
  savingsRate,
  expenseRatio,
  consistency,
}) => {
  const fill = Math.min(Math.max(score, 0), 100);

  return (
    <div className="bg-white dark:bg-gray-800 rounded-3xl border border-gray-200 dark:border-gray-700 p-6 shadow-sm">
      <div className="flex items-center justify-between gap-4 mb-6">
        <div>
          <p className="text-sm text-primary-600 dark:text-primary-400 font-semibold uppercase tracking-[0.2em]">
            Financial health
          </p>
          <h3 className="text-2xl font-semibold text-gray-900 dark:text-white">
            Scoreboard
          </h3>
        </div>
        <div className="rounded-3xl bg-gray-50 dark:bg-gray-900 px-4 py-2 text-sm font-semibold text-gray-700 dark:text-gray-300">
          {category === 'green' ? 'Good' : category === 'yellow' ? 'Moderate' : 'At Risk'}
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.1fr_1fr] items-center">
        <div className="relative flex items-center justify-center">
          <div className="w-48 h-48 rounded-full bg-gray-100 dark:bg-gray-900 flex items-center justify-center">
            <div
              className={`absolute inset-0 rounded-full bg-gradient-to-r ${colorMap[category]} opacity-30`}
            />
            <div className="relative z-10 flex h-36 w-36 items-center justify-center rounded-full bg-white dark:bg-gray-800 shadow-sm">
              <div className="text-center">
                <p className="text-xl font-semibold text-gray-900 dark:text-white">
                  {fill}%
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400">Health score</p>
              </div>
            </div>
          </div>
          <div className="absolute inset-x-1/4 top-12 h-4 rounded-full bg-gray-200 dark:bg-gray-700" />
        </div>

        <div className="space-y-4">
          <div className="rounded-3xl border border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 p-4 flex items-center gap-4">
            <div className="rounded-2xl bg-primary-100 dark:bg-primary-900 p-3 text-primary-700 dark:text-primary-300">
              <CircleDollarSign className="w-5 h-5" />
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Savings rate</p>
              <p className="text-lg font-semibold text-gray-900 dark:text-white">{savingsRate}%</p>
            </div>
          </div>

          <div className="rounded-3xl border border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 p-4 flex items-center gap-4">
            <div className="rounded-2xl bg-amber-100 dark:bg-amber-900/20 p-3 text-amber-600">
              <Activity className="w-5 h-5" />
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Expense ratio</p>
              <p className="text-lg font-semibold text-gray-900 dark:text-white">{expenseRatio}%</p>
            </div>
          </div>

          <div className="rounded-3xl border border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 p-4 flex items-center gap-4">
            <div className="rounded-2xl bg-emerald-100 dark:bg-emerald-900/20 p-3 text-emerald-600">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Consistency</p>
              <p className="text-lg font-semibold text-gray-900 dark:text-white">{consistency}%</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
