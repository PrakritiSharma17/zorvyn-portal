import { useEffect, useMemo, useState } from 'react';
import { useDashboardStore } from './store/dashboardStore';
import { mockTransactions } from './utils/mockData';
import {
  calculateSummary,
  generateBalanceChart,
  groupByCategory,
  filterTransactions,
  sortTransactions,
  getCategories,
} from './utils/calculations';
import {
  analyzeGoalProgress,
  buildSmartInsights,
  calculateFinancialHealthScore,
  createSimulationProjection,
  detectPriceShockIds,
  groupTransactionsByDate,
} from './utils/insights';
import { SummaryCard } from './components/SummaryCard';
import { BalanceChart } from './components/BalanceChart';
import { ExpensePieChart } from './components/ExpensePieChart';
import { TransactionForm } from './components/TransactionForm';
import { FilterBar } from './components/FilterBar';
import { RoleSelector } from './components/RoleSelector';
import { InsightsSection } from './components/InsightsSection';
import { SmartInsights } from './components/SmartInsights';
import { FinancialHealthScore } from './components/FinancialHealthScore';
import { Goals } from './components/Goals';
import { ScenarioSimulator } from './components/ScenarioSimulator';
import { TimelineView } from './components/TimelineView';
import { Moon, Sun, Menu, X } from 'lucide-react';

function App() {
  const {
    transactions,
    userRole,
    filters,
    goals,
    simulationSettings,
    isDarkMode,
    toggleDarkMode,
    loadFromLocalStorage,
    addTransaction,
    deleteTransaction,
    addGoal,
    setSimulationSettings,
  } = useDashboardStore();

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [categories, setCategories] = useState<string[]>([]);

  // Initialize data on mount
  useEffect(() => {
    loadFromLocalStorage();
  }, [loadFromLocalStorage]);

  // Load mock data if no transactions exist
  useEffect(() => {
    if (transactions.length === 0) {
      mockTransactions.forEach((transaction) => {
        addTransaction(transaction);
      });
    }
  }, []);

  // Update categories when transactions change
  useEffect(() => {
    const allCategories = getCategories(transactions);
    setCategories(allCategories);
  }, [transactions]);

  // Process transactions based on filters
  const filteredTransactions = useMemo(
    () =>
      filterTransactions(
        transactions,
        filters.searchTerm,
        filters.type,
        filters.category
      ),
    [transactions, filters]
  );

  const sortedTransactions = useMemo(
    () =>
      sortTransactions(
        filteredTransactions,
        filters.sortBy,
        filters.sortOrder
      ),
    [filteredTransactions, filters.sortBy, filters.sortOrder]
  );

  const timelineGroups = useMemo(
    () => groupTransactionsByDate(sortedTransactions),
    [sortedTransactions]
  );

  const smartInsights = useMemo(
    () => buildSmartInsights(transactions),
    [transactions]
  );

  const healthScore = useMemo(
    () => calculateFinancialHealthScore(transactions),
    [transactions]
  );

  const goalProgress = useMemo(
    () => analyzeGoalProgress(transactions, goals),
    [transactions, goals]
  );

  const projection = useMemo(
    () => createSimulationProjection(transactions, simulationSettings),
    [transactions, simulationSettings]
  );

  const unusualTransactionIds = useMemo(
    () => detectPriceShockIds(transactions),
    [transactions]
  );

  // Calculate data for display
  const summary = calculateSummary(transactions);
  const chartData = generateBalanceChart(transactions);
  const categoryExpenses = groupByCategory(transactions);

  const handleDeleteTransaction = (id: string) => {
    if (window.confirm('Are you sure you want to delete this transaction?')) {
      deleteTransaction(id);
    }
  };

  const handleEditTransaction = (transaction: any) => {
    setEditingTransaction(transaction);
    setIsFormOpen(true);
  };

  const handleCloseForm = () => {
    setIsFormOpen(false);
    setEditingTransaction(null);
  };

  return (
    <div className={isDarkMode ? 'dark' : ''}>
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 transition-colors duration-300">
        {/* Header */}
        <header className="sticky top-0 z-40 bg-white/80 dark:bg-gray-800/80 backdrop-blur-md border-b-2 border-gray-200 dark:border-gray-700">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center">
                <span className="text-white font-bold text-lg">ZFD</span>
              </div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                Zorvyn Finance <span className="text-primary-600">Dashboard</span>
              </h1>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-6">
              <RoleSelector />
              <button
                onClick={toggleDarkMode}
                className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                title={isDarkMode ? 'Light Mode' : 'Dark Mode'}
              >
                {isDarkMode ? (
                  <Sun className="w-5 h-5 text-yellow-400" />
                ) : (
                  <Moon className="w-5 h-5 text-gray-600" />
                )}
              </button>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              {isMobileMenuOpen ? (
                <X className="w-5 h-5" />
              ) : (
                <Menu className="w-5 h-5" />
              )}
            </button>
          </div>

          {/* Mobile Menu */}
          {isMobileMenuOpen && (
            <div className="md:hidden border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-4 flex flex-col gap-4">
              <RoleSelector />
              <button
                onClick={toggleDarkMode}
                className="flex items-center gap-2 w-full px-4 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              >
                {isDarkMode ? (
                  <>
                    <Sun className="w-5 h-5 text-yellow-400" />
                    Light Mode
                  </>
                ) : (
                  <>
                    <Moon className="w-5 h-5 text-gray-600" />
                    Dark Mode
                  </>
                )}
              </button>
            </div>
          )}
        </header>

        {/* Main Content */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
          {/* Summary Cards */}
          <div className="space-y-2">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Overview</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <SummaryCard
                title="Total Balance"
                value={summary.totalBalance}
                type="balance"
              />
              <SummaryCard
                title="Total Income"
                value={summary.totalIncome}
                type="income"
              />
              <SummaryCard
                title="Total Expenses"
                value={summary.totalExpenses}
                type="expense"
              />
            </div>
          </div>

          {/* Charts Section */}
          <div className="space-y-2">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Analytics</h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <BalanceChart data={chartData} />
              <ExpensePieChart data={categoryExpenses} />
            </div>
          </div>

          <div className="grid gap-6 xl:grid-cols-[1.55fr_0.95fr]">
            <SmartInsights insights={smartInsights} />
            <FinancialHealthScore
              score={healthScore.score}
              category={healthScore.category}
              savingsRate={healthScore.savingsRate}
              expenseRatio={healthScore.expenseRatio}
              consistency={healthScore.consistency}
            />
          </div>

          <InsightsSection transactions={transactions} />

          <div className="grid gap-6 xl:grid-cols-[1.3fr_0.95fr]">
            <Goals
              progress={goalProgress}
              isAdmin={userRole === 'admin'}
              onAddGoal={addGoal}
            />
            <ScenarioSimulator
              settings={simulationSettings}
              projection={projection}
              onChange={setSimulationSettings}
            />
          </div>

          {/* Transactions Section */}
          <div className="space-y-2">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Transactions</h2>
            <FilterBar
              isAdmin={userRole === 'admin'}
              onAddClick={() => {
                setEditingTransaction(null);
                setIsFormOpen(true);
              }}
              categories={categories}
            />
          </div>

          <TimelineView
            groups={timelineGroups}
            isAdmin={userRole === 'admin'}
            onDelete={handleDeleteTransaction}
            onEdit={handleEditTransaction}
            unusualIds={unusualTransactionIds}
          />

          {/* Role-Based Message */}
          <div className="bg-primary-50 dark:bg-primary-900/20 border-2 border-primary-200 dark:border-primary-700 rounded-lg p-4 text-center">
            <p className="text-primary-700 dark:text-primary-300 font-semibold">
              {userRole === 'admin'
                ? '👑 You are in Admin Mode - You can add, edit, and delete transactions'
                : '👁️ You are in Viewer Mode - You can only view transactions'}
            </p>
          </div>
        </main>

        {/* Transaction Form Modal */}
        <TransactionForm
          isOpen={isFormOpen}
          onClose={handleCloseForm}
          editingTransaction={editingTransaction}
          categories={categories}
        />
      </div>
    </div>
  );
}

export default App;
