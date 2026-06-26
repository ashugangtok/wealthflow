import create from 'zustand';
import { devtools, persist } from 'zustand/middleware';

// Types
export interface Transaction {
  id: string;
  type: 'expense' | 'income';
  category: string;
  description: string;
  amount: number;
  date: Date;
  tags?: string[];
}

export interface Budget {
  id: string;
  category: string;
  limit: number;
  spent: number;
  period: 'monthly' | 'yearly';
  createdAt: Date;
  updatedAt: Date;
}

export interface Alert {
  id: string;
  type: 'budget' | 'bill' | 'spending' | 'unusual';
  severity: 'warning' | 'critical';
  title: string;
  message: string;
  read: boolean;
  action?: {
    label: string;
    target: string;
  };
  createdAt: Date;
}

export interface Bill {
  id: string;
  name: string;
  amount: number;
  dueDate: Date;
  frequency: 'monthly' | 'quarterly' | 'yearly';
  paid: boolean;
  createdAt: Date;
}

export interface FinancialMetrics {
  totalBalance: number;
  monthlySpending: number;
  monthlyIncome: number;
  savingsRate: number;
  healthScore: number;
}

export interface FinanceStore {
  // Data
  transactions: Transaction[];
  budgets: Budget[];
  alerts: Alert[];
  bills: Bill[];
  metrics: FinancialMetrics;

  // Loading states
  loading: boolean;
  error: string | null;

  // Transaction methods
  addTransaction: (transaction: Omit<Transaction, 'id'>) => void;
  updateTransaction: (id: string, transaction: Partial<Transaction>) => void;
  deleteTransaction: (id: string) => void;
  getTransactionsByCategory: (category: string) => Transaction[];
  getTransactionsByDateRange: (start: Date, end: Date) => Transaction[];

  // Budget methods
  addBudget: (budget: Omit<Budget, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateBudget: (id: string, budget: Partial<Budget>) => void;
  deleteBudget: (id: string) => void;
  calculateBudgetUtilization: (budgetId: string) => number;

  // Alert methods
  addAlert: (alert: Omit<Alert, 'id' | 'createdAt'>) => void;
  dismissAlert: (id: string) => void;
  markAlertAsRead: (id: string) => void;
  getUnreadAlerts: () => Alert[];

  // Bill methods
  addBill: (bill: Omit<Bill, 'id' | 'createdAt'>) => void;
  updateBill: (id: string, bill: Partial<Bill>) => void;
  deleteBill: (id: string) => void;
  getUpcomingBills: () => Bill[];

  // Metrics methods
  calculateMetrics: () => void;

  // Utility methods
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  reset: () => void;
}

const initialMetrics: FinancialMetrics = {
  totalBalance: 0,
  monthlySpending: 0,
  monthlyIncome: 0,
  savingsRate: 0,
  healthScore: 0,
};

export const useFinanceStore = create<FinanceStore>()(
  devtools(
    persist(
      (set, get) => ({
        // Initial state
        transactions: [],
        budgets: [],
        alerts: [],
        bills: [],
        metrics: initialMetrics,
        loading: false,
        error: null,

        // Transaction methods
        addTransaction: (transaction) =>
          set((state) => ({
            transactions: [
              ...state.transactions,
              {
                ...transaction,
                id: `txn_${Date.now()}`,
              },
            ],
          })),

        updateTransaction: (id, updates) =>
          set((state) => ({
            transactions: state.transactions.map((txn) =>
              txn.id === id ? { ...txn, ...updates } : txn
            ),
          })),

        deleteTransaction: (id) =>
          set((state) => ({
            transactions: state.transactions.filter((txn) => txn.id !== id),
          })),

        getTransactionsByCategory: (category) => {
          const state = get();
          return state.transactions.filter((txn) => txn.category === category);
        },

        getTransactionsByDateRange: (start, end) => {
          const state = get();
          return state.transactions.filter(
            (txn) =>
              new Date(txn.date) >= start &&
              new Date(txn.date) <= end
          );
        },

        // Budget methods
        addBudget: (budget) =>
          set((state) => ({
            budgets: [
              ...state.budgets,
              {
                ...budget,
                id: `budget_${Date.now()}`,
                createdAt: new Date(),
                updatedAt: new Date(),
              },
            ],
          })),

        updateBudget: (id, updates) =>
          set((state) => ({
            budgets: state.budgets.map((b) =>
              b.id === id
                ? { ...b, ...updates, updatedAt: new Date() }
                : b
            ),
          })),

        deleteBudget: (id) =>
          set((state) => ({
            budgets: state.budgets.filter((b) => b.id !== id),
          })),

        calculateBudgetUtilization: (budgetId) => {
          const state = get();
          const budget = state.budgets.find((b) => b.id === budgetId);
          if (!budget) return 0;
          return (budget.spent / budget.limit) * 100;
        },

        // Alert methods
        addAlert: (alert) =>
          set((state) => ({
            alerts: [
              {
                ...alert,
                id: `alert_${Date.now()}`,
                createdAt: new Date(),
              },
              ...state.alerts,
            ],
          })),

        dismissAlert: (id) =>
          set((state) => ({
            alerts: state.alerts.filter((a) => a.id !== id),
          })),

        markAlertAsRead: (id) =>
          set((state) => ({
            alerts: state.alerts.map((a) =>
              a.id === id ? { ...a, read: true } : a
            ),
          })),

        getUnreadAlerts: () => {
          const state = get();
          return state.alerts.filter((a) => !a.read);
        },

        // Bill methods
        addBill: (bill) =>
          set((state) => ({
            bills: [
              ...state.bills,
              {
                ...bill,
                id: `bill_${Date.now()}`,
                createdAt: new Date(),
              },
            ],
          })),

        updateBill: (id, updates) =>
          set((state) => ({
            bills: state.bills.map((b) =>
              b.id === id ? { ...b, ...updates } : b
            ),
          })),

        deleteBill: (id) =>
          set((state) => ({
            bills: state.bills.filter((b) => b.id !== id),
          })),

        getUpcomingBills: () => {
          const state = get();
          const now = new Date();
          const nextWeek = new Date(now);
          nextWeek.setDate(nextWeek.getDate() + 7);

          return state.bills
            .filter(
              (b) =>
                !b.paid &&
                new Date(b.dueDate) >= now &&
                new Date(b.dueDate) <= nextWeek
            )
            .sort(
              (a, b) =>
                new Date(a.dueDate).getTime() -
                new Date(b.dueDate).getTime()
            );
        },

        // Metrics methods
        calculateMetrics: () => {
          const state = get();
          const now = new Date();
          const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
          const monthEnd = new Date(now.getFullYear(), now.getMonth() + 1, 0);

          const monthTransactions = state.transactions.filter(
            (txn) =>
              new Date(txn.date) >= monthStart &&
              new Date(txn.date) <= monthEnd
          );

          const monthlySpending = monthTransactions
            .filter((txn) => txn.type === 'expense')
            .reduce((sum, txn) => sum + txn.amount, 0);

          const monthlyIncome = monthTransactions
            .filter((txn) => txn.type === 'income')
            .reduce((sum, txn) => sum + txn.amount, 0);

          const totalBalance = state.transactions
            .filter((txn) => txn.type === 'income')
            .reduce((sum, txn) => sum + txn.amount, 0) -
            state.transactions
              .filter((txn) => txn.type === 'expense')
              .reduce((sum, txn) => sum + txn.amount, 0);

          const savingsRate = monthlyIncome > 0
            ? ((monthlyIncome - monthlySpending) / monthlyIncome) * 100
            : 0;

          // Calculate health score (0-100)
          const budgetHealth = state.budgets.length > 0
            ? 100 - (state.budgets.reduce(
              (sum, b) => sum + Math.min((b.spent / b.limit) * 100, 100),
              0
            ) / state.budgets.length)
            : 50;

          const savingsHealth = Math.max(0, Math.min(savingsRate * 2, 100));
          const healthScore = (budgetHealth + savingsHealth) / 2;

          set({
            metrics: {
              totalBalance,
              monthlySpending,
              monthlyIncome,
              savingsRate: Math.max(0, savingsRate),
              healthScore: Math.round(healthScore),
            },
          });
        },

        // Utility methods
        setLoading: (loading) => set({ loading }),
        setError: (error) => set({ error }),

        reset: () =>
          set({
            transactions: [],
            budgets: [],
            alerts: [],
            bills: [],
            metrics: initialMetrics,
            loading: false,
            error: null,
          }),
      }),
      {
        name: 'wealthflow-store',
        // Only persist specific fields
        partialize: (state) => ({
          transactions: state.transactions,
          budgets: state.budgets,
          alerts: state.alerts,
          bills: state.bills,
        }),
      }
    )
  )
);

// Selectors
export const selectUnreadAlertCount = (state: FinanceStore) =>
  state.alerts.filter((a) => !a.read).length;

export const selectMonthlyBalance = (state: FinanceStore) =>
  state.metrics.monthlyIncome - state.metrics.monthlySpending;

export const selectExceededBudgets = (state: FinanceStore) =>
  state.budgets.filter((b) => b.spent > b.limit);

export const selectCategoryTotal = (category: string) => (state: FinanceStore) =>
  state.transactions
    .filter((txn) => txn.category === category)
    .reduce((sum, txn) => sum + txn.amount, 0);
