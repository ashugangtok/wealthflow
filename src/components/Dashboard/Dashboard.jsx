import React, { useEffect, useState } from 'react';
import { Box, Grid, Card, CardContent, CardHeader, CircularProgress, Alert, Typography, Button, Stack, LinearProgress, Container, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import { TrendingUp, CreditCard, AccountBalance, Wallet, Savings } from '@mui/icons-material';
import { LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useBills } from '../../context/BillsContext';
import { useBudgets } from '../../context/BudgetsContext';
import { getAllIncome, getAllExpenses, getAllCreditCards, getAllBankAccounts, getAllAssets, getAllLiabilities, getAllBills } from '../../utils/firebaseHelpers';
import { calculateNetWorth, calculateTotalAssets, calculateTotalLiabilities, calculateMonthlyIncome, calculateMonthlyExpenses, calculateUpcomingDuePayments, calculateEMIPayments, formatCurrency, calculateMonthlyTrend, getExpensesByCategory } from '../../utils/calculations';
import { ensureDate } from '../../utils/dateHelpers';
import SavingsGoalsWidget from '../Goals/SavingsGoalsWidget.jsx';
import { useQuickActions } from '../../context/QuickActionsContext';
import IncomeForm from '../Income/IncomeForm.jsx';
import ExpenseForm from '../Expense/ExpenseForm.jsx';
import FinancialHealthScore from './FinancialHealthScore.jsx';
import AIInsights from './AIInsights.jsx';
import SpendingHeatmap from './SpendingHeatmap.jsx';
import AssetAllocation from './AssetAllocation.jsx';
import '../../styles/animations.css';

const COLORS = ['#667eea', '#764ba2', '#f093fb', '#4facfe', '#00f2fe', '#43e97b', '#fa709a', '#fee140'];

const MetricCardAnimated = ({ title, value, icon: Icon, gradient, index, onClick }) => {
  return (
    <Card onClick={onClick} sx={{ background: `linear-gradient(135deg, ${gradient[0]} 0%, ${gradient[1]} 100%)`, color: 'white', borderRadius: 4, boxShadow: '0 10px 40px rgba(0, 0, 0, 0.15)', position: 'relative', overflow: 'hidden', border: '1px solid rgba(255, 255, 255, 0.2)', animation: `fadeInUp 0.8s ease-out ${index * 0.1}s both`, cursor: onClick ? 'pointer' : 'default', '&:hover': { transform: onClick ? 'translateY(-8px) scale(1.02)' : 'translateY(-8px)', boxShadow: onClick ? '0 20px 60px rgba(0, 0, 0, 0.35)' : '0 20px 50px rgba(0, 0, 0, 0.25)' } }}>
      <CardContent sx={{ position: 'relative', zIndex: 1 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Box>
            <Typography variant="body2" sx={{ fontWeight: 600, opacity: 0.9 }}>{title}</Typography>
            <Typography variant="h5" sx={{ mt: 1.5, fontWeight: 700, fontSize: '1.8rem', animation: `counterUp 0.8s ease-out ${index * 0.1 + 0.3}s both` }}>{value}</Typography>
          </Box>
          <Icon sx={{ fontSize: 48, opacity: 0.5, animation: `float 3s ease-in-out infinite`, animationDelay: `${index * 0.2}s` }} />
        </Box>
      </CardContent>
    </Card>
  );
};

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { openModal, closeModal } = useQuickActions();
  const { budgets } = useBudgets();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [data, setData] = useState({ income: [], expenses: [], creditCards: [], bankAccounts: [], assets: [], liabilities: [], bills: [] });
  const [billsModalOpen, setBillsModalOpen] = useState(false);

  useEffect(() => {
    fetchDashboardData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  const fetchDashboardData = async () => {
    if (!user) return;
    try {
      setLoading(true);
      setError('');
      const [income, expenses, creditCards, bankAccounts, assets, liabilities, fetchedBills] = await Promise.all([getAllIncome(user.uid), getAllExpenses(user.uid), getAllCreditCards(user.uid), getAllBankAccounts(user.uid), getAllAssets(user.uid), getAllLiabilities(user.uid), getAllBills(user.uid)]);
      setData({ income, expenses, creditCards, bankAccounts, assets, liabilities, bills: fetchedBills || [] });
    } catch (err) {
      setError(err.message || 'Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}><CircularProgress /></Box>;

  const netWorth = calculateNetWorth(data.bankAccounts, data.assets, data.liabilities);
  const totalAssets = calculateTotalAssets(data.bankAccounts, data.assets);
  const totalLiabilities = calculateTotalLiabilities(data.liabilities, data.creditCards);
  const monthlyIncome = calculateMonthlyIncome(data.income);
  const monthlyExpenses = calculateMonthlyExpenses(data.expenses);
  const totalBankBalance = data.bankAccounts.reduce((sum, acc) => sum + (acc.balance || 0), 0);
  const savingsRate = monthlyIncome > 0 ? (monthlyIncome - monthlyExpenses) / monthlyIncome : 0;
  const chartData = calculateMonthlyTrend(data.income, data.expenses);
  const expenseCategoryObj = getExpensesByCategory(data.expenses);
  const expensesByCategory = Object.entries(expenseCategoryObj).map(([category, value]) => ({
    category,
    value,
  }));
  const thisMonthSaved = monthlyIncome - monthlyExpenses;
  const recentTransactions = [...data.income, ...data.expenses].sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 5);

  // Consolidate all upcoming bills from credit cards, liabilities, and bills module
  const getAllUpcomingBills = () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const allBills = [];

    // Credit card due payments
    data.creditCards.forEach((card) => {
      if (card.dueDate) {
        const dueDate = ensureDate(card.dueDate);
        if (dueDate && !isNaN(dueDate)) {
          const daysUntilDue = Math.ceil((dueDate - today) / (1000 * 60 * 60 * 24));
          allBills.push({
            id: `cc_${card.id}`,
            name: `${card.cardName} Payment`,
            amount: card.outstandingBalance || 0,
            dueDate,
            daysUntilDue,
            type: 'creditCard',
            isOverdue: daysUntilDue < 0,
          });
        }
      }
    });

    // Liability EMI payments
    data.liabilities.forEach((liability) => {
      if (liability.emiDueDate && liability.emiAmount) {
        const dueDate = ensureDate(liability.emiDueDate);
        if (dueDate && !isNaN(dueDate)) {
          const daysUntilDue = Math.ceil((dueDate - today) / (1000 * 60 * 60 * 24));
          allBills.push({
            id: `emi_${liability.id}`,
            name: `${liability.loanName} EMI`,
            amount: liability.emiAmount,
            dueDate,
            daysUntilDue,
            type: 'emi',
            isOverdue: daysUntilDue < 0,
          });
        }
      }
    });

    // Bills from bills module
    data.bills.forEach((bill) => {
      if (bill.billDate) {
        const dueDate = ensureDate(bill.billDate);
        if (dueDate && !isNaN(dueDate)) {
          const daysUntilDue = Math.ceil((dueDate - today) / (1000 * 60 * 60 * 24));
          allBills.push({
            id: `bill_${bill.id}`,
            name: bill.billName,
            amount: bill.amount,
            dueDate,
            daysUntilDue,
            type: 'bill',
            isOverdue: daysUntilDue < 0,
          });
        }
      }
    });

    // Sort by daysUntilDue (upcoming first)
    return allBills.sort((a, b) => a.daysUntilDue - b.daysUntilDue);
  };

  const allUpcomingBills = getAllUpcomingBills();

  return (
    <Box sx={{ background: 'linear-gradient(135deg, #0f0f23 0%, #1a1a3e 100%)', minHeight: '100vh', pt: 4 }}>
      {/* Header */}
      <Box sx={{ position: 'relative', overflow: 'hidden', mb: 4, color: 'white' }}>
        <Box sx={{ position: 'absolute', top: -80, right: -80, width: '300px', height: '300px', borderRadius: '50%', background: 'rgba(102, 126, 234, 0.1)', animation: 'float 6s ease-in-out infinite' }} />
        <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
          <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>Good morning, {user?.email?.split('@')[0]}! 👋</Typography>
          <Typography variant="body2" sx={{ opacity: 0.7 }}>{new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}</Typography>
        </Container>
      </Box>

      <Container maxWidth="lg">
        {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}

        {/* Row 1: 5 Metric Cards */}
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(3, 1fr)', lg: 'repeat(5, 1fr)' }, gap: 2.5, mb: 4 }}>
          <MetricCardAnimated title="Net Worth" value={formatCurrency(netWorth)} icon={Wallet} gradient={['#667eea', '#764ba2']} index={0} onClick={() => navigate('/bank-accounts')} />
          <MetricCardAnimated title="Cash Available" value={formatCurrency(totalBankBalance)} icon={AccountBalance} gradient={['#11998e', '#38ef7d']} index={1} onClick={() => navigate('/bank-accounts')} />
          <MetricCardAnimated title="Total Investments" value={formatCurrency(data.assets.reduce((sum, a) => sum + (a.value || 0), 0))} icon={TrendingUp} gradient={['#4facfe', '#00f2fe']} index={2} onClick={() => navigate('/assets')} />
          <MetricCardAnimated title="Credit Card Due" value={formatCurrency(data.creditCards.reduce((sum, c) => sum + (c.outstandingBalance || 0), 0))} icon={CreditCard} gradient={['#f093fb', '#f5576c']} index={3} onClick={() => navigate('/credit-cards')} />
          <MetricCardAnimated title="Monthly Savings" value={formatCurrency(thisMonthSaved)} icon={Savings} gradient={['#fa709a', '#fee140']} index={4} />
        </Box>

        {/* Row 2: Cash Flow, Income vs Expenses, Net Worth Trend */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          {/* Cash Flow */}
          <Grid item xs={12} md={4}>
            <Card sx={{ borderRadius: 4, boxShadow: '0 10px 40px rgba(0, 0, 0, 0.1)', border: '1px solid rgba(0, 0, 0, 0.05)', animation: 'fadeInUp 0.8s ease-out 0.1s both' }}>
              <CardHeader title="💹 Cash Flow (This Month)" titleTypographyProps={{ variant: 'h6', fontWeight: 600 }} sx={{ pb: 1, background: 'linear-gradient(135deg, #667eea10 0%, #764ba210 100%)' }} />
              <CardContent sx={{ pt: 2 }}>
                <ResponsiveContainer width="100%" height={250}>
                  <PieChart>
                    <Pie data={[{ name: 'Income', value: monthlyIncome }, { name: 'Expenses', value: monthlyExpenses }, { name: 'Savings', value: Math.max(0, thisMonthSaved) }]} cx="50%" cy="50%" innerRadius={60} outerRadius={90} dataKey="value">
                      <Cell fill="#11998e" />
                      <Cell fill="#f5576c" />
                      <Cell fill="#4facfe" />
                    </Pie>
                    <Tooltip formatter={(value) => formatCurrency(value)} />
                  </PieChart>
                </ResponsiveContainer>
                <Box sx={{ mt: 3, textAlign: 'center', color: 'white' }}>
                  <Typography variant="h6" sx={{ fontWeight: 700 }}>₹{monthlyIncome.toLocaleString()}</Typography>
                  <Typography variant="body2" sx={{ opacity: 0.7 }}>Total Income</Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>

          {/* Income vs Expenses */}
          <Grid item xs={12} md={4}>
            <Card sx={{ borderRadius: 4, boxShadow: '0 10px 40px rgba(0, 0, 0, 0.1)', border: '1px solid rgba(0, 0, 0, 0.05)', animation: 'fadeInUp 0.8s ease-out 0.2s both' }}>
              <CardHeader title="📊 Income vs Expenses" titleTypographyProps={{ variant: 'h6', fontWeight: 600 }} sx={{ pb: 1, background: 'linear-gradient(135deg, #667eea10 0%, #764ba210 100%)' }} />
              <CardContent sx={{ pt: 2 }}>
                <ResponsiveContainer width="100%" height={250}>
                  <AreaChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                    <defs>
                      <linearGradient id="colorIncome" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#11998e" stopOpacity={0.8} />
                        <stop offset="95%" stopColor="#11998e" stopOpacity={0} />
                      </linearGradient>
                      <linearGradient id="colorExpenses" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#f5576c" stopOpacity={0.8} />
                        <stop offset="95%" stopColor="#f5576c" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis dataKey="month" stroke="#999" />
                    <YAxis stroke="#999" />
                    <Tooltip contentStyle={{ background: 'rgba(255, 255, 255, 0.95)', border: '2px solid #667eea', borderRadius: '12px' }} />
                    <Area type="monotone" dataKey="income" stroke="#11998e" fillOpacity={1} fill="url(#colorIncome)" strokeWidth={3} />
                    <Area type="monotone" dataKey="expenses" stroke="#f5576c" fillOpacity={1} fill="url(#colorExpenses)" strokeWidth={3} />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </Grid>

          {/* Net Worth Trend */}
          <Grid item xs={12} md={4}>
            <Card sx={{ borderRadius: 4, boxShadow: '0 10px 40px rgba(0, 0, 0, 0.1)', border: '1px solid rgba(0, 0, 0, 0.05)', animation: 'fadeInUp 0.8s ease-out 0.3s both' }}>
              <CardHeader title="📈 Net Worth Trend" titleTypographyProps={{ variant: 'h6', fontWeight: 600 }} sx={{ pb: 1, background: 'linear-gradient(135deg, #667eea10 0%, #764ba210 100%)' }} />
              <CardContent sx={{ pt: 2 }}>
                <ResponsiveContainer width="100%" height={250}>
                  <LineChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis dataKey="month" stroke="#999" />
                    <YAxis stroke="#999" />
                    <Tooltip contentStyle={{ background: 'rgba(255, 255, 255, 0.95)', border: '2px solid #667eea', borderRadius: '12px' }} />
                    <Line type="monotone" dataKey="income" stroke="#667eea" strokeWidth={3} dot={{ fill: '#667eea', r: 6 }} />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Row 3: Expense Breakdown, Budget Tracker, AI Insights */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          {/* Expense Breakdown */}
          <Grid item xs={12} md={4}>
            <Card sx={{ borderRadius: 4, boxShadow: '0 10px 40px rgba(0, 0, 0, 0.1)', border: '1px solid rgba(0, 0, 0, 0.05)', animation: 'fadeInUp 0.8s ease-out 0.4s both' }}>
              <CardHeader title="🥧 Expense Breakdown" titleTypographyProps={{ variant: 'h6', fontWeight: 600 }} sx={{ pb: 1, background: 'linear-gradient(135deg, #667eea10 0%, #764ba210 100%)' }} />
              <CardContent sx={{ pt: 2 }}>
                {expensesByCategory.length > 0 ? (
                  <Box>
                    <ResponsiveContainer width="100%" height={220}>
                      <PieChart>
                        <Pie data={expensesByCategory} cx="50%" cy="45%" labelLine={false} label={false} outerRadius={70} fill="#8884d8" dataKey="value">
                          {expensesByCategory.map((entry, index) => <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />)}
                        </Pie>
                        <Tooltip formatter={(value) => formatCurrency(value)} />
                      </PieChart>
                    </ResponsiveContainer>
                    <Stack spacing={1} sx={{ mt: 2 }}>
                      {expensesByCategory.map((cat, idx) => (
                        <Box key={idx} sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                          <Box sx={{ width: 12, height: 12, borderRadius: '50%', backgroundColor: COLORS[idx % COLORS.length], flexShrink: 0 }} />
                          <Typography variant="caption" sx={{ color: 'white', flex: 1, fontSize: '0.75rem' }}>
                            {cat.category}
                          </Typography>
                          <Typography variant="caption" sx={{ color: '#667eea', fontWeight: 600, fontSize: '0.75rem' }}>
                            {((cat.value / monthlyExpenses) * 100).toFixed(0)}%
                          </Typography>
                        </Box>
                      ))}
                    </Stack>
                  </Box>
                ) : (
                  <Typography sx={{ color: 'rgba(255, 255, 255, 0.6)', py: 6 }}>No expense data yet</Typography>
                )}
              </CardContent>
            </Card>
          </Grid>

          {/* Budget Tracker */}
          <Grid item xs={12} md={4}>
            <Card sx={{ borderRadius: 4, boxShadow: '0 10px 40px rgba(0, 0, 0, 0.1)', border: '1px solid rgba(0, 0, 0, 0.05)' }}>
              <CardHeader title="💰 Budget Tracker" titleTypographyProps={{ variant: 'h6', fontWeight: 600 }} sx={{ pb: 1 }} />
              <CardContent sx={{ pt: 2 }}>
                {budgets.length > 0 ? (
                  <Stack spacing={2}>
                    {budgets.slice(0, 5).map((budget) => {
                      const spent = budget.spent || 0;
                      const limit = budget.limit || 1;
                      const percentage = Math.min((spent / limit) * 100, 100);
                      return (
                        <Box key={budget.id}>
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                            <Typography variant="body2" sx={{ color: 'white', fontWeight: 600 }}>{budget.category}</Typography>
                            <Typography variant="caption" sx={{ color: percentage > 100 ? '#f5576c' : '#38ef7d', fontWeight: 600 }}>
                              {Math.round(percentage)}%
                            </Typography>
                          </Box>
                          <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                            <LinearProgress
                              variant="determinate"
                              value={Math.min(percentage, 100)}
                              sx={{
                                flex: 1,
                                height: 8,
                                borderRadius: 4,
                                backgroundColor: 'rgba(255,255,255,0.1)',
                                '& .MuiLinearProgress-bar': {
                                  backgroundColor: percentage > 100 ? '#f5576c' : '#667eea'
                                }
                              }}
                            />
                          </Box>
                          <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.6)', mt: 0.5 }}>
                            ₹{spent.toLocaleString()} / ₹{limit.toLocaleString()}
                          </Typography>
                        </Box>
                      );
                    })}
                  </Stack>
                ) : (
                  <Typography sx={{ color: 'rgba(255, 255, 255, 0.6)', textAlign: 'center', py: 4 }}>
                    No budgets created yet
                  </Typography>
                )}
              </CardContent>
            </Card>
          </Grid>

          {/* AI Insights */}
          <Grid item xs={12} md={4}>
            <AIInsights expenses={data.expenses} budgets={[]} monthlyIncome={monthlyIncome} />
          </Grid>
        </Grid>

        {/* Row 4: Financial Health (Full Width) */}
        <Box sx={{ mb: 4 }}>
          <FinancialHealthScore savingsRate={savingsRate} debtToAssets={totalLiabilities > 0 ? totalLiabilities / (totalAssets + totalLiabilities || 1) : 0} emergencyFundMonths={totalBankBalance > 0 && monthlyExpenses > 0 ? totalBankBalance / monthlyExpenses : 0} budgetAdherence={0.8} />
        </Box>

        {/* Row 5: Top Expenses & Asset Allocation */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} md={6}>
            <Card sx={{ borderRadius: 4, boxShadow: '0 10px 40px rgba(0, 0, 0, 0.1)', border: '1px solid rgba(0, 0, 0, 0.05)', minHeight: 400 }}>
              <CardHeader title="📊 Top Expenses" titleTypographyProps={{ variant: 'h6', fontWeight: 600 }} sx={{ pb: 2 }} />
              <CardContent>
                {expensesByCategory.length > 0 ? (
                  <Stack spacing={3}>
                    {expensesByCategory.slice(0, 5).map((cat, idx) => (
                      <Box key={idx}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                          <Typography variant="body2" sx={{ color: 'white', fontWeight: 600 }}>{cat.category}</Typography>
                          <Typography variant="body2" sx={{ color: '#667eea', fontWeight: 700 }}>₹{cat.value.toLocaleString()}</Typography>
                        </Box>
                        <Box sx={{ width: '100%', height: 8, background: 'rgba(255,255,255,0.1)', borderRadius: 4, overflow: 'hidden' }}>
                          <Box sx={{ height: '100%', background: `linear-gradient(90deg, #667eea, #764ba2)`, width: `${monthlyExpenses > 0 ? (cat.value / monthlyExpenses) * 100 : 0}%` }} />
                        </Box>
                      </Box>
                    ))}
                  </Stack>
                ) : (
                  <Typography sx={{ color: 'rgba(255, 255, 255, 0.6)', textAlign: 'center', py: 8 }}>No expense data</Typography>
                )}
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={6}><AssetAllocation assets={data.assets} /></Grid>
        </Grid>

        {/* Row 6: Goals & Savings Goals Widget */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12}><SavingsGoalsWidget /></Grid>
        </Grid>

        {/* Row 7: Credit Cards & Upcoming Bills */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} md={6}>
            <Card sx={{ borderRadius: 4, boxShadow: '0 10px 40px rgba(0, 0, 0, 0.1)', border: '1px solid rgba(0, 0, 0, 0.05)' }}>
              <CardHeader title="💳 Credit Cards" titleTypographyProps={{ variant: 'h6', fontWeight: 600 }} />
              <CardContent>
                <Stack spacing={2}>
                  {data.creditCards.length > 0 ? (
                    data.creditCards.slice(0, 3).map((card, idx) => {
                      const dueDate = ensureDate(card.dueDate);
                      const today = new Date();
                      today.setHours(0, 0, 0, 0);
                      const daysUntilDue = dueDate ? Math.ceil((dueDate - today) / (1000 * 60 * 60 * 24)) : null;
                      const isOverdue = daysUntilDue !== null && daysUntilDue < 0;

                      return (
                        <Box key={idx} sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', py: 1.5, borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                          <Box>
                            <Typography variant="body2" sx={{ color: 'white', fontWeight: 600 }}>{card.cardName}</Typography>
                            <Typography variant="caption" sx={{ color: isOverdue ? '#f5576c' : 'rgba(255,255,255,0.6)' }}>
                              {daysUntilDue !== null ? (isOverdue ? `Overdue ${Math.abs(daysUntilDue)} days` : `Due in ${daysUntilDue} days`) : 'No due date'}
                            </Typography>
                          </Box>
                          <Typography variant="body2" sx={{ color: '#f5576c', fontWeight: 600 }}>₹{(card.outstandingBalance || 0).toLocaleString()}</Typography>
                        </Box>
                      );
                    })
                  ) : (
                    <Typography sx={{ color: 'rgba(255,255,255,0.6)', py: 4 }}>No credit cards</Typography>
                  )}
                </Stack>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={6}>
            <Card sx={{ borderRadius: 4, boxShadow: '0 10px 40px rgba(0, 0, 0, 0.1)', border: '1px solid rgba(0, 0, 0, 0.05)' }}>
              <CardHeader title="📅 All Upcoming Bills" titleTypographyProps={{ variant: 'h6', fontWeight: 600 }} />
              <CardContent>
                <Stack spacing={2}>
                  {allUpcomingBills.length > 0 ? (
                    <>
                      {allUpcomingBills.slice(0, 4).map((bill) => (
                        <Box key={bill.id} sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', py: 1.5, borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                          <Box>
                            <Typography variant="body2" sx={{ color: 'white', fontWeight: 600 }}>{bill.name}</Typography>
                            <Typography variant="caption" sx={{ color: bill.isOverdue ? '#f5576c' : 'rgba(255,255,255,0.6)' }}>
                              {bill.isOverdue ? `Overdue ${Math.abs(bill.daysUntilDue)} days` : `Due in ${bill.daysUntilDue} days`}
                            </Typography>
                          </Box>
                          <Typography variant="body2" sx={{ color: bill.isOverdue ? '#f5576c' : '#38ef7d', fontWeight: 600 }}>₹{bill.amount.toLocaleString()}</Typography>
                        </Box>
                      ))}
                      {allUpcomingBills.length > 4 && (
                        <Button
                          onClick={() => setBillsModalOpen(true)}
                          sx={{ textTransform: 'none', color: 'rgba(255,255,255,0.6)', '&:hover': { color: 'white' }, pt: 1, justifyContent: 'center' }}
                        >
                          <Typography variant="caption">
                            +{allUpcomingBills.length - 4} more bills
                          </Typography>
                        </Button>
                      )}
                    </>
                  ) : (
                    <Typography sx={{ color: 'rgba(255,255,255,0.6)', py: 4, textAlign: 'center' }}>No upcoming bills</Typography>
                  )}
                </Stack>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Row 8: Recent Transactions & Spending Heatmap */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} md={6}>
            <Card sx={{ borderRadius: 4, boxShadow: '0 10px 40px rgba(0, 0, 0, 0.1)', border: '1px solid rgba(0, 0, 0, 0.05)' }}>
              <CardHeader title="📝 Recent Transactions" titleTypographyProps={{ variant: 'h6', fontWeight: 600 }} />
              <CardContent>
                <Stack spacing={1}>
                  {recentTransactions.length > 0 ? (
                    recentTransactions.slice(0, 6).map((t, idx) => {
                      const transactionDate = ensureDate(t.date);
                      const formattedDate = transactionDate && !isNaN(transactionDate)
                        ? transactionDate.toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric' })
                        : 'Unknown Date';
                      return (
                        <Box key={idx} sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', py: 1, borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                          <Box>
                            <Typography variant="body2" sx={{ color: 'white', fontWeight: 600 }}>{t.source || t.description}</Typography>
                            <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.5)' }}>{formattedDate}</Typography>
                          </Box>
                          <Typography variant="body2" sx={{ color: t.type === 'income' ? '#38ef7d' : '#f5576c', fontWeight: 600 }}>
                            {t.type === 'income' ? '+' : '-'}₹{(t.amount || 0).toLocaleString()}
                          </Typography>
                        </Box>
                      );
                    })
                  ) : (
                    <Typography sx={{ color: 'rgba(255,255,255,0.6)', py: 4 }}>No transactions</Typography>
                  )}
                </Stack>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={6}><SpendingHeatmap expenses={data.expenses} /></Grid>
        </Grid>

        {/* Income/Expense Modals */}
        <IncomeForm open={openModal === 'income'} onClose={closeModal} onSuccess={() => { closeModal(); fetchDashboardData(); }} />
        <ExpenseForm open={openModal === 'expense'} onClose={closeModal} onSuccess={() => { closeModal(); fetchDashboardData(); }} />

        {/* Upcoming Bills Modal */}
        <Dialog open={billsModalOpen} onClose={() => setBillsModalOpen(false)} maxWidth="sm" fullWidth>
          <DialogTitle sx={{ fontWeight: 600, fontSize: '1.25rem', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white' }}>
            📅 All Upcoming Bills
          </DialogTitle>
          <DialogContent sx={{ pt: 3 }}>
            {allUpcomingBills.length > 0 ? (
              <Stack spacing={2}>
                {allUpcomingBills.map((bill) => (
                  <Box
                    key={bill.id}
                    sx={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      py: 2,
                      px: 2,
                      borderRadius: 2,
                      background: 'rgba(102, 126, 234, 0.1)',
                      border: '1px solid rgba(102, 126, 234, 0.2)',
                      '&:hover': { background: 'rgba(102, 126, 234, 0.15)' },
                    }}
                  >
                    <Box sx={{ flex: 1 }}>
                      <Typography variant="body2" sx={{ color: 'white', fontWeight: 600 }}>
                        {bill.name}
                      </Typography>
                      <Typography variant="caption" sx={{ color: bill.isOverdue ? '#f5576c' : 'rgba(255,255,255,0.6)' }}>
                        {bill.isOverdue ? `Overdue ${Math.abs(bill.daysUntilDue)} days` : `Due in ${bill.daysUntilDue} days`}
                      </Typography>
                    </Box>
                    <Typography variant="body2" sx={{ color: bill.isOverdue ? '#f5576c' : '#38ef7d', fontWeight: 700, ml: 2 }}>
                      ₹{bill.amount.toLocaleString()}
                    </Typography>
                  </Box>
                ))}
              </Stack>
            ) : (
              <Typography sx={{ color: 'rgba(255,255,255,0.6)', py: 4, textAlign: 'center' }}>
                No upcoming bills
              </Typography>
            )}
          </DialogContent>
          <DialogActions sx={{ p: 2 }}>
            <Button onClick={() => setBillsModalOpen(false)}>Close</Button>
            <Button
              onClick={() => {
                setBillsModalOpen(false);
                navigate('/bills');
              }}
              variant="contained"
              sx={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}
            >
              View All Bills
            </Button>
          </DialogActions>
        </Dialog>
      </Container>
    </Box>
  );
};

export default Dashboard;
