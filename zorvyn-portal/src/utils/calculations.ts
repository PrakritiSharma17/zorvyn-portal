import { Transaction, SummaryData, CategoryExpense, ChartDataPoint } from '../types';
import { format, startOfMonth, endOfMonth, isWithinInterval } from 'date-fns';

export const calculateSummary = (transactions: Transaction[]): SummaryData => {
  const summary = transactions.reduce(
    (acc, transaction) => {
      if (transaction.type === 'income') {
        acc.totalIncome += transaction.amount;
        acc.totalBalance += transaction.amount;
      } else {
        acc.totalExpenses += transaction.amount;
        acc.totalBalance -= transaction.amount;
      }
      return acc;
    },
    { totalBalance: 0, totalIncome: 0, totalExpenses: 0 }
  );
  return summary;
};

export const groupByCategory = (transactions: Transaction[]): CategoryExpense[] => {
  const grouped = transactions
    .filter((t) => t.type === 'expense')
    .reduce(
      (acc, transaction) => {
        const existing = acc.find((c) => c.category === transaction.category);
        if (existing) {
          existing.amount += transaction.amount;
        } else {
          acc.push({ category: transaction.category, amount: transaction.amount });
        }
        return acc;
      },
      [] as CategoryExpense[]
    );
  return grouped.sort((a, b) => b.amount - a.amount);
};

export const generateBalanceChart = (transactions: Transaction[]): ChartDataPoint[] => {
  const sorted = [...transactions].sort((a, b) => a.date.getTime() - b.date.getTime());
  let balance = 0;
  const chartData = sorted.map((transaction) => {
    if (transaction.type === 'income') {
      balance += transaction.amount;
    } else {
      balance -= transaction.amount;
    }
    return {
      date: format(transaction.date, 'MMM dd'),
      balance: Math.round(balance * 100) / 100,
    };
  });
  return chartData;
};

export const getHighestSpendingCategory = (transactions: Transaction[]): string => {
  const categories = groupByCategory(transactions);
  return categories.length > 0 ? categories[0].category : 'N/A';
};

export const getMonthlyComparison = (transactions: Transaction[]) => {
  const now = new Date();
  const monthStart = startOfMonth(now);
  const monthEnd = endOfMonth(now);

  const monthlyTransactions = transactions.filter((t) =>
    isWithinInterval(t.date, { start: monthStart, end: monthEnd })
  );

  const summary = calculateSummary(monthlyTransactions);
  return {
    monthlyIncome: summary.totalIncome,
    monthlyExpenses: summary.totalExpenses,
    balance: summary.totalBalance,
  };
};

export const filterTransactions = (
  transactions: Transaction[],
  searchTerm: string,
  type: string,
  category: string
): Transaction[] => {
  return transactions.filter((transaction) => {
    const matchesSearch = transaction.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          transaction.category.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = type === 'all' || transaction.type === type;
    const matchesCategory = !category || transaction.category === category;

    return matchesSearch && matchesType && matchesCategory;
  });
};

export const sortTransactions = (
  transactions: Transaction[],
  sortBy: 'date' | 'amount',
  sortOrder: 'asc' | 'desc'
): Transaction[] => {
  const sorted = [...transactions];
  sorted.sort((a, b) => {
    let comparison = 0;
    if (sortBy === 'date') {
      comparison = a.date.getTime() - b.date.getTime();
    } else {
      comparison = a.amount - b.amount;
    }
    return sortOrder === 'asc' ? comparison : -comparison;
  });
  return sorted;
};

export const exportTransactionsToJSON = (transactions: Transaction[]): string => {
  return JSON.stringify(transactions, null, 2);
};

export const exportTransactionsToCSV = (transactions: Transaction[]): string => {
  const headers = ['Date', 'Description', 'Category', 'Type', 'Amount'];
  const rows = transactions.map((t) => [
    format(t.date, 'yyyy-MM-dd'),
    t.description,
    t.category,
    t.type,
    t.amount,
  ]);

  const csv = [headers, ...rows]
    .map((row) =>
      row
        .map((cell) => (typeof cell === 'string' && cell.includes(',') ? `"${cell}"` : cell))
        .join(',')
    )
    .join('\n');

  return csv;
};

export const downloadFile = (content: string, filename: string, type: string) => {
  const element = document.createElement('a');
  element.setAttribute('href', `data:${type};charset=utf-8,${encodeURIComponent(content)}`);
  element.setAttribute('download', filename);
  element.style.display = 'none';
  document.body.appendChild(element);
  element.click();
  document.body.removeChild(element);
};

export const getCategories = (transactions: Transaction[]): string[] => {
  const categories = new Set(transactions.map((t) => t.category));
  return Array.from(categories).sort();
};
