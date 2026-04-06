import React from 'react';
import { ArrowUpRight, ArrowDownLeft, Target } from 'lucide-react';

interface SummaryCardProps {
  title: string;
  value: number;
  type: 'balance' | 'income' | 'expense';
  trend?: number;
}

export const SummaryCard: React.FC<SummaryCardProps> = ({ title, value, type, trend }) => {
  const getIcon = () => {
    if (type === 'income') return <ArrowUpRight className="w-6 h-6 text-green-500" />;
    if (type === 'expense') return <ArrowDownLeft className="w-6 h-6 text-red-500" />;
    return <Target className="w-6 h-6 text-blue-500" />;
  };

  const getColorClass = () => {
    if (type === 'income') return 'border-green-200 dark:border-green-900 bg-green-50 dark:bg-green-900/20';
    if (type === 'expense') return 'border-red-200 dark:border-red-900 bg-red-50 dark:bg-red-900/20';
    return 'border-blue-200 dark:border-blue-900 bg-blue-50 dark:bg-blue-900/20';
  };

  return (
    <div
      className={`border-2 rounded-lg p-6 backdrop-blur-sm transition-transform duration-300 hover:scale-105 ${getColorClass()}`}
    >
      <div className="flex justify-between items-start mb-4">
        <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300">{title}</h3>
        {getIcon()}
      </div>

      <div className="flex items-baseline gap-2">
        <span className="text-2xl font-bold text-gray-900 dark:text-white">
          ${Math.abs(value).toLocaleString('en-US', { minimumFractionDigits: 2 })}
        </span>
        {trend && (
          <span className={`text-sm font-semibold ${trend > 0 ? 'text-green-600' : 'text-red-600'}`}>
            {trend > 0 ? '+' : ''}{trend}%
          </span>
        )}
      </div>

      <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">Monthly Overview</p>
    </div>
  );
};
