import React from 'react';
import { InsightMessage } from '../types';
import { CheckCircle2, AlertTriangle, Smile, Sparkles } from 'lucide-react';

interface SmartInsightsProps {
  insights: InsightMessage[];
}

const iconByType = {
  positive: <CheckCircle2 className="w-5 h-5 text-emerald-600" />,
  negative: <AlertTriangle className="w-5 h-5 text-rose-600" />,
  warning: <Sparkles className="w-5 h-5 text-amber-500" />,
};

export const SmartInsights: React.FC<SmartInsightsProps> = ({ insights }) => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-3xl border border-gray-200 dark:border-gray-700 p-6 shadow-sm">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <p className="text-sm uppercase tracking-[0.2em] text-primary-600 dark:text-primary-400 font-semibold">
            Intelligent insights
          </p>
          <h3 className="text-2xl font-semibold text-gray-900 dark:text-white">
            What your money story says
          </h3>
        </div>
        <div className="inline-flex items-center gap-2 rounded-full border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 px-4 py-2 text-sm text-gray-600 dark:text-gray-300">
          <Smile className="w-4 h-4" /> AI-like analysis
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {insights.map((insight, index) => (
          <div
            key={`${insight.type}-${index}`}
            className="flex gap-4 rounded-3xl border border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 p-4"
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600">
              {iconByType[insight.type]}
            </div>
            <div>
              <p className="text-sm font-medium text-gray-900 dark:text-white capitalize">
                {insight.type.replace(/\b\w/g, (ch) => ch.toUpperCase())} insight
              </p>
              <p className="mt-1 text-sm text-gray-600 dark:text-gray-300">
                {insight.message}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
