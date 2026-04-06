import { addMonths, format, startOfMonth, endOfMonth, isWithinInterval, subMonths } from 'date-fns';
import { Transaction, Goal, GoalProgress, InsightMessage, SimulationProjection, SimulationSettings } from '../types';
import { calculateSummary, groupByCategory } from './calculations';

const clamp = (value: number, min = 0, max = 100) => Math.min(max, Math.max(min, value));

const formatCurrency = (value: number) => `₹${value.toLocaleString('en-IN', { maximumFractionDigits: 0 })}`;

const byDateDesc = (a: Transaction, b: Transaction) => b.date.getTime() - a.date.getTime();

const getMonthRange = (date: Date) => ({
  start: startOfMonth(date),
  end: endOfMonth(date),
});

const aggregateMonth = (transactions: Transaction[], date: Date) => {
  const { start, end } = getMonthRange(date);
  return transactions.filter((transaction) =>
    isWithinInterval(transaction.date, { start, end })
  );
};

export const buildSmartInsights = (transactions: Transaction[]): InsightMessage[] => {
  if (transactions.length === 0) {
    return [{ type: 'positive', message: 'Add your first transaction to generate intelligent insights.' }];
  }

  const now = new Date();
  const currentMonthTransactions = aggregateMonth(transactions, now);
  const lastMonthTransactions = aggregateMonth(transactions, subMonths(now, 1));

  const currentSummary = calculateSummary(currentMonthTransactions);
  const lastSummary = calculateSummary(lastMonthTransactions);

  const insights: InsightMessage[] = [];

  if (lastSummary.totalExpenses > 0) {
    const expenseChange = (currentSummary.totalExpenses - lastSummary.totalExpenses) / lastSummary.totalExpenses;
    if (expenseChange > 0.1) {
      insights.push({
        type: 'negative',
        message: `You spent ${(expenseChange * 100).toFixed(0)}% more this month compared to last month.`,
      });
    } else {
      insights.push({
        type: 'positive',
        message: `Your spending is ${(Math.abs(expenseChange) * 100).toFixed(0)}% lower than last month.`,
      });
    }
  }

  const currentSavings = currentSummary.totalIncome - currentSummary.totalExpenses;
  const lastSavings = lastSummary.totalIncome - lastSummary.totalExpenses;
  if (lastSavings !== 0) {
    const savingsChange = (currentSavings - lastSavings) / Math.abs(lastSavings);
    if (savingsChange < 0) {
      insights.push({
        type: 'negative',
        message: `Your savings decreased by ${Math.abs(savingsChange * 100).toFixed(0)}% compared to last month.`,
      });
    } else {
      insights.push({
        type: 'positive',
        message: `Good job! Your savings improved by ${(savingsChange * 100).toFixed(0)}% this month.`,
      });
    }
  }

  const categoryInsides = groupByCategory(currentMonthTransactions);
  if (categoryInsides.length > 0) {
    const highest = categoryInsides[0];
    insights.push({
      type: 'warning',
      message: `Highest spending category is ${highest.category} at ${formatCurrency(highest.amount)}.`,
    });

    const lastCategoryAmounts = lastMonthTransactions
      .filter((t) => t.type === 'expense')
      .reduce<Record<string, number>>((acc, transaction) => {
        acc[transaction.category] = (acc[transaction.category] || 0) + transaction.amount;
        return acc;
      }, {});

    const increaseCategory = categoryInsides
      .map((category) => ({
        ...category,
        previous: lastCategoryAmounts[category.category] || 0,
      }))
      .filter((category) => category.previous > 0)
      .sort((a, b) => (b.amount / a.previous) - (a.amount / b.previous));

    if (increaseCategory.length > 0) {
      const trend = increaseCategory[0];
      const percent = ((trend.amount - trend.previous) / trend.previous) * 100;
      if (percent > 10) {
        insights.push({
          type: 'warning',
          message: `Spending in ${trend.category} increased by ${percent.toFixed(0)}% compared to last month.`,
        });
      }
    }
  }

  const expenseTransactions = transactions.filter((t) => t.type === 'expense');
  const overallAverage = expenseTransactions.length
    ? expenseTransactions.reduce((sum, t) => sum + t.amount, 0) / expenseTransactions.length
    : 0;

  const categoryAverageMap = expenseTransactions.reduce<Record<string, number>>((acc, t) => {
    acc[t.category] = (acc[t.category] || 0) + t.amount;
    return acc;
  }, {});

  const categoryCounts = expenseTransactions.reduce<Record<string, number>>((acc, t) => {
    acc[t.category] = (acc[t.category] || 0) + 1;
    return acc;
  }, {});

  Object.keys(categoryAverageMap).forEach((category) => {
    categoryAverageMap[category] = categoryAverageMap[category] / categoryCounts[category];
  });

  const detectedSpikes = expenseTransactions.filter((transaction) => {
    const categoryAvg = categoryAverageMap[transaction.category] || overallAverage;
    const threshold = Math.max(categoryAvg, overallAverage) * 2;
    return transaction.amount > threshold;
  });

  detectedSpikes.slice(0, 2).forEach((transaction) => {
    insights.push({
      type: 'warning',
      message: `Unusual expense detected: ${formatCurrency(transaction.amount)} on ${transaction.category}.`,
    });
  });

  if (insights.length === 0) {
    insights.push({
      type: 'positive',
      message: 'Your finances are stable. Keep tracking to uncover new insights.',
    });
  }

  return insights;
};

export const calculateFinancialHealthScore = (transactions: Transaction[]) => {
  const summary = calculateSummary(transactions);
  const income = summary.totalIncome;
  const expenses = summary.totalExpenses;

  const savingsRate = income > 0 ? Math.max(0, Math.min(1, (income - expenses) / income)) : 0;
  const expenseRatio = income > 0 ? Math.min(1, expenses / income) : 1;

  const monthlyBuckets = transactions.reduce<Record<string, number>>((acc, transaction) => {
    const monthKey = format(transaction.date, 'yyyy-MM');
    if (transaction.type === 'expense') {
      acc[monthKey] = (acc[monthKey] || 0) + transaction.amount;
    }
    return acc;
  }, {});

  const values = Object.values(monthlyBuckets);
  const mean = values.reduce((sum, value) => sum + value, 0) / Math.max(values.length, 1);
  const variance = values.reduce((sum, value) => sum + Math.pow(value - mean, 2), 0) / Math.max(values.length, 1);
  const consistency = mean > 0 ? Math.max(0, 1 - Math.sqrt(variance) / mean) : 1;

  let score = 0;
  score += savingsRate * 50;
  score += (1 - expenseRatio) * 30;
  score += consistency * 20;
  score = clamp(score);

  const category = score >= 70 ? 'green' : score >= 40 ? 'yellow' : 'red';

  return {
    score,
    category: category as 'green' | 'yellow' | 'red',
    savingsRate: Math.round(savingsRate * 100),
    expenseRatio: Math.round(expenseRatio * 100),
    consistency: Math.round(consistency * 100),
  };
};

export const analyzeGoalProgress = (
  transactions: Transaction[],
  goals: Goal[]
): GoalProgress[] => {
  const summary = calculateSummary(transactions);
  const expenseByCategory = transactions
    .filter((transaction) => transaction.type === 'expense')
    .reduce<Record<string, number>>((acc, transaction) => {
      acc[transaction.category] = (acc[transaction.category] || 0) + transaction.amount;
      return acc;
    }, {});

  return goals.map((goal) => {
    const current = goal.type === 'savings'
      ? Math.max(0, summary.totalIncome - summary.totalExpenses)
      : goal.category
      ? expenseByCategory[goal.category] || 0
      : summary.totalExpenses;

    const percentage = clamp((current / goal.target) * 100);
    const alert = percentage >= 80 && percentage < 100;
    const status = percentage >= 100 ? 'achieved' : alert ? 'near-limit' : 'on-track';

    return {
      id: goal.id,
      label: goal.label,
      target: goal.target,
      current,
      percentage,
      type: goal.type,
      category: goal.category,
      alert,
      status,
    };
  });
};

export const createSimulationProjection = (
  transactions: Transaction[],
  settings: SimulationSettings,
): SimulationProjection => {
  const summary = calculateSummary(transactions);
  const currentBalance = summary.totalBalance;
  const monthlyIncome = transactions
    .filter((t) => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0) / 3;
  const monthlyExpenses = transactions
    .filter((t) => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0) / 3;

  const adjustedIncome = monthlyIncome * (1 + settings.incomeIncreasePercent / 100);
  const adjustedExpenses = monthlyExpenses * (1 - settings.expenseReducePercent / 100);
  const projectedBalance = Math.round((currentBalance + adjustedIncome - adjustedExpenses) * 100) / 100;

  const monthlyTrend = Array.from({ length: 6 }, (_, index) => ({
    date: format(addMonths(new Date(), index + 1), 'MMM yy'),
    balance: Math.round((currentBalance + (adjustedIncome - adjustedExpenses) * (index + 1)) * 100) / 100,
  }));

  return { projectedBalance, monthlyTrend };
};

export const groupTransactionsByDate = (transactions: Transaction[]) => {
  return transactions
    .sort(byDateDesc)
    .reduce(
      (acc: { date: string; entries: Transaction[] }[], transaction) => {
        const dateKey = format(transaction.date, 'MMM dd, yyyy');
        const group = acc.find((item) => item.date === dateKey);
        if (group) {
          group.entries.push(transaction);
        } else {
          acc.push({ date: dateKey, entries: [transaction] });
        }
        return acc;
      },
      [] as { date: string; entries: Transaction[] }[]
    );
};

export const detectPriceShockIds = (transactions: Transaction[]) => {
  const expenseTransactions = transactions.filter((t) => t.type === 'expense');
  if (expenseTransactions.length === 0) {
    return [];
  }

  const total = expenseTransactions.reduce((sum, t) => sum + t.amount, 0);
  const overallAverage = total / expenseTransactions.length;

  const categorySums = expenseTransactions.reduce<Record<string, number>>((acc, transaction) => {
    acc[transaction.category] = (acc[transaction.category] || 0) + transaction.amount;
    return acc;
  }, {});

  const categoryCounts = expenseTransactions.reduce<Record<string, number>>((acc, transaction) => {
    acc[transaction.category] = (acc[transaction.category] || 0) + 1;
    return acc;
  }, {});

  const categoryAverages = Object.keys(categorySums).reduce<Record<string, number>>((acc, category) => {
    acc[category] = categorySums[category] / (categoryCounts[category] || 1);
    return acc;
  }, {});

  return expenseTransactions
    .filter((transaction) => {
      const average = categoryAverages[transaction.category] || overallAverage;
      return transaction.amount > Math.max(overallAverage, average) * 2;
    })
    .map((transaction) => transaction.id);
};
