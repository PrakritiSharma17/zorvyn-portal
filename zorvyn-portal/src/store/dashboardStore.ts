import { create } from 'zustand';
import { Transaction, UserRole, FilterState, Goal, SimulationSettings } from '../types';

interface DashboardStore {
  // Transactions
  transactions: Transaction[];
  addTransaction: (transaction: Omit<Transaction, 'id'>) => void;
  updateTransaction: (id: string, transaction: Partial<Transaction>) => void;
  deleteTransaction: (id: string) => void;
  
  // Role Management
  userRole: UserRole;
  setUserRole: (role: UserRole) => void;
  
  // Filters
  filters: FilterState;
  setFilters: (filters: Partial<FilterState>) => void;
  resetFilters: () => void;
  
  // Goals
  goals: Goal[];
  addGoal: (goal: Omit<Goal, 'id'>) => void;
  deleteGoal: (id: string) => void;
  updateGoal: (id: string, updates: Partial<Goal>) => void;

  // Scenario Simulation
  simulationSettings: SimulationSettings;
  setSimulationSettings: (settings: Partial<SimulationSettings>) => void;
  
  // Dark Mode
  isDarkMode: boolean;
  toggleDarkMode: () => void;
  
  // LocalStorage
  loadFromLocalStorage: () => void;
  saveToLocalStorage: () => void;
}

const defaultFilters: FilterState = {
  searchTerm: '',
  type: 'all',
  category: '',
  sortBy: 'date',
  sortOrder: 'desc',
};

export const useDashboardStore = create<DashboardStore>((set, get) => ({
  transactions: [],
  userRole: 'viewer',
  filters: defaultFilters,
  goals: [
    {
      id: 'goal-save-50000',
      type: 'savings',
      label: 'Save ₹50,000 this year',
      target: 50000,
    },
    {
      id: 'goal-food-limit',
      type: 'limit',
      label: 'Food budget for the month',
      target: 5000,
      category: 'Food',
    },
  ],
  simulationSettings: {
    incomeIncreasePercent: 10,
    expenseReducePercent: 5,
  },
  isDarkMode: false,

  addTransaction: (transaction) => {
    const newTransaction: Transaction = {
      ...transaction,
      id: Date.now().toString(),
    };
    set((state) => ({
      transactions: [newTransaction, ...state.transactions],
    }));
    get().saveToLocalStorage();
  },

  updateTransaction: (id, updates) => {
    set((state) => ({
      transactions: state.transactions.map((t) =>
        t.id === id ? { ...t, ...updates } : t
      ),
    }));
    get().saveToLocalStorage();
  },

  deleteTransaction: (id) => {
    set((state) => ({
      transactions: state.transactions.filter((t) => t.id !== id),
    }));
    get().saveToLocalStorage();
  },

  setUserRole: (role) => {
    set({ userRole: role });
    localStorage.setItem('userRole', role);
  },

  setFilters: (filters) => {
    set((state) => ({
      filters: { ...state.filters, ...filters },
    }));
  },

  resetFilters: () => {
    set({ filters: defaultFilters });
  },

  addGoal: (goal) => {
    const newGoal: Goal = {
      ...goal,
      id: Date.now().toString(),
    };
    set((state) => ({ goals: [...state.goals, newGoal] }));
    get().saveToLocalStorage();
  },

  updateGoal: (id, updates) => {
    set((state) => ({
      goals: state.goals.map((goal) =>
        goal.id === id ? { ...goal, ...updates } : goal
      ),
    }));
    get().saveToLocalStorage();
  },

  deleteGoal: (id) => {
    set((state) => ({ goals: state.goals.filter((goal) => goal.id !== id) }));
    get().saveToLocalStorage();
  },

  setSimulationSettings: (settings) => {
    set((state) => {
      const newSettings = { ...state.simulationSettings, ...settings };
      localStorage.setItem('simulationSettings', JSON.stringify(newSettings));
      return { simulationSettings: newSettings };
    });
  },

  toggleDarkMode: () => {
    set((state) => {
      const newMode = !state.isDarkMode;
      localStorage.setItem('darkMode', String(newMode));
      if (newMode) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
      return { isDarkMode: newMode };
    });
  },

  loadFromLocalStorage: () => {
    const savedTransactions = localStorage.getItem('transactions');
    const savedRole = localStorage.getItem('userRole');
    const savedDarkMode = localStorage.getItem('darkMode');
    const savedGoals = localStorage.getItem('goals');
    const savedSimulationSettings = localStorage.getItem('simulationSettings');

    let transactions: Transaction[] = [];
    if (savedTransactions) {
      try {
        transactions = JSON.parse(savedTransactions).map((t: any) => ({
          ...t,
          date: new Date(t.date),
        }));
      } catch (e) {
        console.error('Failed to load transactions:', e);
      }
    }

    let goals: Goal[] = [];
    if (savedGoals) {
      try {
        goals = JSON.parse(savedGoals);
      } catch (e) {
        console.error('Failed to load goals:', e);
      }
    }

    let simulationSettings: SimulationSettings = {
      incomeIncreasePercent: 10,
      expenseReducePercent: 5,
    };
    if (savedSimulationSettings) {
      try {
        simulationSettings = JSON.parse(savedSimulationSettings);
      } catch (e) {
        console.error('Failed to load simulation settings:', e);
      }
    }

    const isDarkMode = savedDarkMode === 'true';
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    }

    set({
      transactions,
      userRole: (savedRole as UserRole) || 'viewer',
      isDarkMode,
      goals: goals.length ? goals : [
        {
          id: 'goal-save-50000',
          type: 'savings',
          label: 'Save ₹50,000 this year',
          target: 50000,
        },
        {
          id: 'goal-food-limit',
          type: 'limit',
          label: 'Food budget for the month',
          target: 5000,
          category: 'Food',
        },
      ],
      simulationSettings,
    });
  },

  saveToLocalStorage: () => {
    const { transactions, goals, simulationSettings } = get();
    localStorage.setItem('transactions', JSON.stringify(transactions));
    localStorage.setItem('goals', JSON.stringify(goals));
    localStorage.setItem('simulationSettings', JSON.stringify(simulationSettings));
  },
}));
