import React from 'react';
import { TrendingUp, TrendingDown, Zap } from 'lucide-react';
import { Transaction, Insight } from '../types';
import { getHighestSpendingCategory, getMonthlyComparison, groupByCategory } from '../utils/calculations';

interface InsightsSectionProps {
  transactions: Transaction[];
}

export const InsightsSection: React.FC<InsightsSectionProps> = ({ transactions }) => {
  const monthlyComparison = getMonthlyComparison(transactions);
  const highestCategory = getHighestSpendingCategory(transactions);
  const totalCategories = groupByCategory(transactions).length;

  const insights: Insight[] = [
    {
      label: 'This Month Income',
      value: `$${monthlyComparison.monthlyIncome.toLocaleString('en-US', { minimumFractionDigits: 2 })}`,
    },
    {
      label: 'This Month Expenses',
      value: `$${monthlyComparison.monthlyExpenses.toLocaleString('en-US', { minimumFractionDigits: 2 })}`,
    },
    {
      label: 'Monthly Balance',
      value: `$${monthlyComparison.balance.toLocaleString('en-US', { minimumFractionDigits: 2 })}`,
    },
    {
      label: 'Top Spending Category',
      value: highestCategory,
    },
    {
      label: 'Expense Categories',
      value: totalCategories,
    },
  ];

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-bold text-gray-900 dark:text-white">Financial Insights</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        {insights.map((insight, index) => (
          <div
            key={insight.label}
            className="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-700 dark:to-gray-800 rounded-lg border-2 border-gray-200 dark:border-gray-600 p-4 hover:shadow-lg transition-shadow duration-300"
          >
            <div className="flex items-start justify-between mb-2">
              <p className="text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase">
                {insight.label}
              </p>
              {index < 3 && (
                <div className={`p-2 rounded-lg ${
                  insight.label.includes('Expenses') ? 'bg-red-100 dark:bg-red-900/30' : 'bg-green-100 dark:bg-green-900/30'
                }`}>
                  {insight.label.includes('Expenses') ? (
                    <TrendingDown className={`w-4 h-4 ${insight.label.includes('Expenses') ? 'text-red-600' : 'text-green-600'}`} />
                  ) : (
                    <TrendingUp className="w-4 h-4 text-green-600" />
                  )}
                </div>
              )}
              {index >= 3 && (
                <Zap className="w-4 h-4 text-yellow-500" />
              )}
            </div>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">
              {insight.value}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};
