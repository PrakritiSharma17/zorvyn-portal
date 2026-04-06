export type UserRole = 'viewer' | 'admin';

export type TransactionType = 'income' | 'expense';

export interface Transaction {
  id: string;
  date: Date;
  amount: number;
  category: string;
  type: TransactionType;
  description: string;
}

export interface SummaryData {
  totalBalance: number;
  totalIncome: number;
  totalExpenses: number;
}

export interface ChartDataPoint {
  date: string;
  balance: number;
}

export interface CategoryExpense {
  category: string;
  amount: number;
}

export interface Insight {
  label: string;
  value: string | number;
}

export type InsightType = 'positive' | 'negative' | 'warning';

export interface InsightMessage {
  type: InsightType;
  message: string;
}

export type GoalType = 'savings' | 'limit';

export interface Goal {
  id: string;
  type: GoalType;
  label: string;
  target: number;
  category?: string;
}

export interface GoalProgress {
  id: string;
  label: string;
  target: number;
  current: number;
  percentage: number;
  type: GoalType;
  category?: string;
  alert: boolean;
  status: 'on-track' | 'near-limit' | 'achieved';
}

export interface SimulationSettings {
  incomeIncreasePercent: number;
  expenseReducePercent: number;
}

export interface SimulationProjection {
  projectedBalance: number;
  monthlyTrend: ChartDataPoint[];
}

export interface FilterState {
  searchTerm: string;
  type: TransactionType | 'all';
  category: string;
  sortBy: 'date' | 'amount';
  sortOrder: 'asc' | 'desc';
}
