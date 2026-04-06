import React from 'react';
import { LineChart, Line, ResponsiveContainer, Tooltip, CartesianGrid, XAxis, YAxis } from 'recharts';
import { SimulationSettings, SimulationProjection } from '../types';
import { BarChart3, ArrowUpRight, ArrowDownRight } from 'lucide-react';

interface ScenarioSimulatorProps {
  settings: SimulationSettings;
  projection: SimulationProjection;
  onChange: (settings: Partial<SimulationSettings>) => void;
}

export const ScenarioSimulator: React.FC<ScenarioSimulatorProps> = ({ settings, projection, onChange }) => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-3xl border border-gray-200 dark:border-gray-700 p-6 shadow-sm">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between mb-6">
        <div>
          <p className="text-sm uppercase tracking-[0.2em] text-primary-600 dark:text-primary-400 font-semibold">
            Scenario simulation
          </p>
          <h3 className="text-2xl font-semibold text-gray-900 dark:text-white">Future balance forecast</h3>
        </div>
        <div className="inline-flex items-center gap-2 rounded-full bg-gray-50 dark:bg-gray-900 px-4 py-2 text-sm text-gray-600 dark:text-gray-300">
          <BarChart3 className="w-4 h-4" /> Real-time updates
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.05fr_0.95fr]">
        <div className="space-y-6">
          <div className="rounded-3xl border border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 p-5">
            <p className="text-sm text-gray-500 dark:text-gray-400">Projected balance</p>
            <div className="mt-3 flex items-end gap-2">
              <p className="text-4xl font-semibold text-gray-900 dark:text-white">₹{projection.projectedBalance.toLocaleString('en-IN')}</p>
              <span className="rounded-full bg-emerald-100 text-emerald-700 px-3 py-1 text-xs font-semibold">Optimized</span>
            </div>
            <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">Based on a {settings.incomeIncreasePercent}% income increase and {settings.expenseReducePercent}% expense reduction.</p>
          </div>

          <div className="space-y-4 rounded-3xl border border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 p-5">
            <div>
              <p className="text-sm font-semibold text-gray-900 dark:text-white">Income increase</p>
              <div className="mt-3 flex items-center justify-between gap-4">
                <input
                  type="range"
                  min={0}
                  max={50}
                  value={settings.incomeIncreasePercent}
                  onChange={(event) => onChange({ incomeIncreasePercent: Number(event.target.value) })}
                  className="w-full"
                />
                <span className="w-16 text-right text-sm text-gray-700 dark:text-gray-300">{settings.incomeIncreasePercent}%</span>
              </div>
            </div>

            <div>
              <p className="text-sm font-semibold text-gray-900 dark:text-white">Expense reduction</p>
              <div className="mt-3 flex items-center justify-between gap-4">
                <input
                  type="range"
                  min={0}
                  max={50}
                  value={settings.expenseReducePercent}
                  onChange={(event) => onChange({ expenseReducePercent: Number(event.target.value) })}
                  className="w-full"
                />
                <span className="w-16 text-right text-sm text-gray-700 dark:text-gray-300">{settings.expenseReducePercent}%</span>
              </div>
            </div>
          </div>
        </div>

        <div className="rounded-3xl border border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Balance trend</p>
              <h4 className="text-xl font-semibold text-gray-900 dark:text-white">Next 6 months</h4>
            </div>
            <div className="rounded-2xl bg-primary-100 dark:bg-primary-900 px-3 py-2 text-primary-700 dark:text-primary-300 text-xs font-semibold">
              Forecast
            </div>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={projection.monthlyTrend}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,0.4)" />
                <XAxis dataKey="date" tick={{ fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ backgroundColor: '#111827', border: '1px solid #374151', borderRadius: '12px', color: '#fff' }} />
                <Line type="monotone" dataKey="balance" stroke="#0ea5e9" strokeWidth={3} dot={{ r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-4 flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
            <div className="flex items-center gap-2">
              <ArrowUpRight className="w-4 h-4 text-emerald-500" />
              <span>Income boost</span>
            </div>
            <div className="flex items-center gap-2">
              <ArrowDownRight className="w-4 h-4 text-rose-500" />
              <span>Expense reduction</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
