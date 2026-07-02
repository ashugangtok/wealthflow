import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { BankAccountsProvider } from './context/BankAccountsContext';
import { CreditCardsProvider } from './context/CreditCardsContext';
import { NotificationsProvider } from './context/NotificationsContext';
import { BudgetsProvider } from './context/BudgetsContext';
import { GoalsProvider } from './context/GoalsContext';
import { QuickActionsProvider } from './context/QuickActionsContext';
import { SubscriptionsProvider } from './context/SubscriptionsContext';
import { BillsProvider } from './context/BillsContext';
import ProtectedRoute from './components/ProtectedRoute';
import Layout from './components/Layout/Layout';
import Login from './components/Auth/Login';
import SignUp from './components/Auth/SignUp';
import Dashboard from './components/Dashboard/Dashboard';
import Income from './components/Income/Income';
import Expense from './components/Expense/Expense';
import CreditCard from './components/CreditCard/CreditCard';
import BankAccount from './components/BankAccount/BankAccount';
import Asset from './components/Asset/Asset';
import Liability from './components/Liability/Liability';
import Reports from './components/Reports/Reports';
import Settings from './components/Settings/Settings';
import BudgetModule from './components/Budget/BudgetModule.jsx';
import TransactionList from './components/Transactions/TransactionList.jsx';
import NotificationCenter from './components/Notifications/NotificationCenter.jsx';
import SavingsGoals from './components/Goals/SavingsGoals.jsx';
import Bills from './components/Bills/Bills.jsx';
import LiabilityPayments from './components/Liability/LiabilityPayments.jsx';
import BankTransfer from './components/Transfer/BankTransfer.jsx';
import CreditCardTransfer from './components/Transfer/CreditCardTransfer.jsx';
import StatementUpload from './components/Statements/StatementUpload.jsx';
// import AICFO from './components/AICFO/AICFO.jsx';
// import { AICFOProvider } from './context/AICFOContext';

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <NotificationsProvider>
          <BankAccountsProvider>
              <CreditCardsProvider>
                <BudgetsProvider>
                  <GoalsProvider>
                    <QuickActionsProvider>
                      <SubscriptionsProvider>
                        <BillsProvider>
                      <Router>
          <Routes>
            {/* Public Routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<SignUp />} />

            {/* Protected Routes */}
            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <Layout />
                </ProtectedRoute>
              }
            >
              <Route path="/" element={<Navigate to="/dashboard" replace />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/income" element={<Income />} />
              <Route path="/expenses" element={<Expense />} />
              <Route path="/credit-cards" element={<CreditCard />} />
              <Route path="/bank-accounts" element={<BankAccount />} />
              <Route path="/assets" element={<Asset />} />
              <Route path="/liabilities" element={<Liability />} />
              <Route path="/liability-payments" element={<LiabilityPayments />} />
              <Route path="/reports" element={<Reports />} />
              <Route path="/settings" element={<Settings />} />
              <Route path="/budgets" element={<BudgetModule />} />
              <Route path="/transactions" element={<TransactionList />} />
              <Route path="/alerts" element={<NotificationCenter />} />
              <Route path="/goals" element={<SavingsGoals />} />
              <Route path="/bills" element={<Bills />} />
              <Route path="/bank-transfers" element={<BankTransfer />} />
              <Route path="/card-transfers" element={<CreditCardTransfer />} />
              <Route path="/statements" element={<StatementUpload />} />
            </Route>

            {/* Catch all */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
                      </Router>
                      </BillsProvider>
                    </SubscriptionsProvider>
                  </QuickActionsProvider>
                </GoalsProvider>
              </BudgetsProvider>
            </CreditCardsProvider>
          </BankAccountsProvider>
        </NotificationsProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
