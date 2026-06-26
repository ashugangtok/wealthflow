import React, { useEffect, useState } from 'react';
import {
  Box,
  Grid,
  Card,
  CardContent,
  CardHeader,
  CircularProgress,
  Alert,
  Typography,
  Button,
  Stack,
  LinearProgress,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Container,
} from '@mui/material';
import {
  TrendingUp,
  TrendingDown,
  CreditCard,
  AccountBalance,
  Add,
  ArrowRight,
  Wallet,
  ShowChart,
  Analytics,
  AutoGraph,
  LocalAtm,
  Savings,
  AttachMoney,
} from '@mui/icons-material';
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import {
  getAllIncome,
  getAllExpenses,
  getAllCreditCards,
  getAllBankAccounts,
  getAllAssets,
  getAllLiabilities,
} from '../../utils/firebaseHelpers';
import {
  calculateNetWorth,
  calculateTotalAssets,
  calculateTotalLiabilities,
  calculateMonthlyIncome,
  calculateMonthlyExpenses,
  calculateUpcomingDuePayments,
  calculateEMIPayments,
  formatCurrency,
  calculateMonthlyTrend,
  getExpensesByCategory,
} from '../../utils/calculations';
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
    <Card
      onClick={onClick}
      sx={{
        background: `linear-gradient(135deg, ${gradient[0]} 0%, ${gradient[1]} 100%)`,
        color: 'white',
        borderRadius: 4,
        boxShadow: '0 10px 40px rgba(0, 0, 0, 0.15)',
        position: 'relative',
        overflow: 'hidden',
        border: '1px solid rgba(255, 255, 255, 0.2)',
        animation: `fadeInUp 0.8s ease-out ${index * 0.1}s both`,
        cursor: onClick ? 'pointer' : 'default',
        '&:hover': {
          transform: onClick ? 'translateY(-8px) scale(1.02)' : 'translateY(-8px)',
          boxShadow: onClick ? '0 20px 60px rgba(0, 0, 0, 0.35)' : '0 20px 50px rgba(0, 0, 0, 0.25)',
        },
        transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
      }}
    >
      {/* Animated Background Gradient */}
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          right: 0,
          width: '100px',
          height: '100px',
          borderRadius: '50%',
          opacity: 0.1,
          background: 'rgba(255, 255, 255, 0.3)',
          animation: 'float 4s ease-in-out infinite',
        }}
      />
      <Box
        sx={{
          position: 'absolute',
          bottom: -20,
          left: -20,
          width: '150px',
          height: '150px',
          borderRadius: '50%',
          opacity: 0.1,
          background: 'rgba(255, 255, 255, 0.3)',
          animation: 'float 5s ease-in-out infinite',
          animationDelay: '1s',
        }}
      />

      <CardContent sx={{ position: 'relative', zIndex: 1 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <Box>
            <Typography
              variant="body2"
              sx={{
                opacity: 0.85,
                fontWeight: 500,
                fontSize: '0.95rem',
                letterSpacing: '0.5px',
              }}
            >
              {title}
            </Typography>
            <Typography
              variant="h4"
              sx={{
                mt: 1.5,
                fontWeight: 700,
                fontSize: '1.8rem',
                animation: `counterUp 0.8s ease-out ${index * 0.1 + 0.3}s both`,
              }}
            >
              {value}
            </Typography>
          </Box>
          <Icon
            sx={{
              fontSize: 48,
              opacity: 0.5,
              animation: `float 3s ease-in-out infinite`,
              animationDelay: `${index * 0.2}s`,
            }}
          />
        </Box>
      </CardContent>
    </Card>
  );
};

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { openModal, closeModal } = useQuickActions();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [data, setData] = useState({
    income: [],
    expenses: [],
    creditCards: [],
    bankAccounts: [],
    assets: [],
    liabilities: [],
  });

  useEffect(() => {
    fetchDashboardData();
  }, [user]);

  const fetchDashboardData = async () => {
    if (!user) return;

    try {
      setLoading(true);
      setError('');

      const [income, expenses, creditCards, bankAccounts, assets, liabilities] =
        await Promise.all([
          getAllIncome(user.uid),
          getAllExpenses(user.uid),
          getAllCreditCards(user.uid),
          getAllBankAccounts(user.uid),
          getAllAssets(user.uid),
          getAllLiabilities(user.uid),
        ]);

      setData({
        income: income.filter((item) => {
          const date = ensureDate(item.date);
          return date && !isNaN(date);
        }),
        expenses: expenses.filter((item) => {
          const date = ensureDate(item.date);
          return date && !isNaN(date);
        }),
        creditCards,
        bankAccounts,
        assets,
        liabilities,
      });
    } catch (err) {
      setError('Failed to load dashboard data');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '600px',
          background: 'linear-gradient(135deg, #667eea15 0%, #764ba215 100%)',
        }}
      >
        <Box sx={{ textAlign: 'center' }}>
          <CircularProgress size={60} sx={{ color: '#667eea', mb: 2 }} />
          <Typography variant="h6" sx={{ color: "rgba(255, 255, 255, 0.6)" }}>
            Loading your financial data...
          </Typography>
        </Box>
      </Box>
    );
  }

  const now = new Date();
  const monthIncome = data.income.filter((item) => {
    const itemDate = ensureDate(item.date);
    return (
      itemDate &&
      !isNaN(itemDate) &&
      itemDate.getMonth() === now.getMonth() &&
      itemDate.getFullYear() === now.getFullYear()
    );
  });

  const monthExpenses = data.expenses.filter((item) => {
    const itemDate = ensureDate(item.date);
    return (
      itemDate &&
      !isNaN(itemDate) &&
      itemDate.getMonth() === now.getMonth() &&
      itemDate.getFullYear() === now.getFullYear()
    );
  });

  const totalBankBalance = data.bankAccounts.reduce((sum, acc) => sum + (acc.balance || 0), 0);
  const totalAssets = calculateTotalAssets(totalBankBalance, data.creditCards, data.assets);
  const totalLiabilities = calculateTotalLiabilities(data.creditCards, data.liabilities);
  const netWorth = calculateNetWorth(totalAssets, totalLiabilities);
  const monthlyIncome = calculateMonthlyIncome(monthIncome);
  const monthlyExpenses = calculateMonthlyExpenses(monthExpenses);
  const creditCardOutstanding = data.creditCards.reduce(
    (sum, card) => sum + (card.outstandingBalance || 0),
    0
  );
  const savingsRate = monthlyIncome > 0 ? ((monthlyIncome - monthlyExpenses) / monthlyIncome) * 100 : 0;
  const upcomingPayments = calculateUpcomingDuePayments(data.creditCards);
  const upcomingEMIs = calculateEMIPayments(data.liabilities);

  // Chart data
  const chartData = calculateMonthlyTrend([...monthIncome, ...monthExpenses], 6).map((month) => ({
    month: month.month,
    income: data.income
      .filter((i) => {
        const d = ensureDate(i.date);
        return d && d.getMonth() === month.monthNum - 1 && d.getFullYear() === month.year;
      })
      .reduce((sum, i) => sum + (i.amount || 0), 0),
    expenses: data.expenses
      .filter((i) => {
        const d = ensureDate(i.date);
        return d && d.getMonth() === month.monthNum - 1 && d.getFullYear() === month.year;
      })
      .reduce((sum, i) => sum + (i.amount || 0), 0),
  }));

  const expensesByCategory = getExpensesByCategory(monthExpenses);
  const categoryData = Object.entries(expensesByCategory).map(([name, value]) => ({ name, value }));

  const recentTransactions = [...monthIncome, ...monthExpenses]
    .sort((a, b) => {
      const dateA = ensureDate(a.date);
      const dateB = ensureDate(b.date);
      return dateB - dateA;
    })
    .slice(0, 5);

  return (
    <Box
      sx={{
        background: 'linear-gradient(135deg, #667eea08 0%, #764ba208 100%)',
        minHeight: '100vh',
        pb: 6,
      }}
    >
      {/* Hero Section */}
      <Box
        sx={{
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white',
          py: 4,
          mb: 4,
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <Box
          sx={{
            position: 'absolute',
            top: -100,
            right: -100,
            width: '300px',
            height: '300px',
            borderRadius: '50%',
            background: 'rgba(255, 255, 255, 0.1)',
            animation: 'float 8s ease-in-out infinite',
          }}
        />
        <Box
          sx={{
            position: 'absolute',
            bottom: -50,
            left: -50,
            width: '250px',
            height: '250px',
            borderRadius: '50%',
            background: 'rgba(255, 255, 255, 0.08)',
            animation: 'float 6s ease-in-out infinite',
            animationDelay: '1s',
          }}
        />

        <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
          <Typography variant="h3" sx={{ fontWeight: 700, mb: 1 }}>
            Welcome back, {user?.email?.split('@')[0]}! 👋
          </Typography>
          <Typography variant="body1" sx={{ opacity: 0.9, fontSize: '1.1rem' }}>
            {new Date().toLocaleDateString('en-US', {
              weekday: 'long',
              month: 'long',
              day: 'numeric',
              year: 'numeric',
            })}
          </Typography>
        </Container>
      </Box>

      <Container maxWidth="lg">
        {error && <Alert severity="error" sx={{ mb: 3, animation: 'fadeInUp 0.5s ease-out' }}>{error}</Alert>}

        {/* Primary Metrics */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} sm={6} lg={3}>
            <MetricCardAnimated
              title="Net Worth"
              value={formatCurrency(netWorth)}
              icon={Wallet}
              gradient={['#667eea', '#764ba2']}
              index={0}
              onClick={() => navigate('/bank-accounts')}
            />
          </Grid>
          <Grid item xs={12} sm={6} lg={3}>
            <MetricCardAnimated
              title="Monthly Income"
              value={formatCurrency(monthlyIncome)}
              icon={TrendingUp}
              gradient={['#11998e', '#38ef7d']}
              index={1}
              onClick={() => navigate('/income')}
            />
          </Grid>
          <Grid item xs={12} sm={6} lg={3}>
            <MetricCardAnimated
              title="Monthly Expenses"
              value={formatCurrency(monthlyExpenses)}
              icon={TrendingDown}
              gradient={['#f093fb', '#f5576c']}
              index={2}
              onClick={() => navigate('/expenses')}
            />
          </Grid>
          <Grid item xs={12} sm={6} lg={3}>
            <MetricCardAnimated
              title="Remaining Balance"
              value={formatCurrency(monthlyIncome - monthlyExpenses)}
              icon={LocalAtm}
              gradient={['#4facfe', '#00f2fe']}
              index={3}
              onClick={() => navigate('/transactions')}
            />
          </Grid>
        </Grid>

        {/* Savings Goals Widget - Phase 1 */}
        <Box sx={{ mb: 4 }}>
          <SavingsGoalsWidget />
        </Box>

        {/* Financial Health Score & AI Insights */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} md={6}>
            <FinancialHealthScore
              savingsRate={monthlyIncome > 0 ? (monthlyIncome - monthlyExpenses) / monthlyIncome : 0}
              debtToAssets={totalLiabilities > 0 ? totalLiabilities / (totalAssets + totalLiabilities || 1) : 0}
              emergencyFundMonths={totalBankBalance > 0 && monthlyExpenses > 0 ? totalBankBalance / monthlyExpenses : 0}
              budgetAdherence={0.8}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <AIInsights
              expenses={data.expenses}
              budgets={[]}
              monthlyIncome={monthlyIncome}
            />
          </Grid>
        </Grid>

        {/* Spending Heatmap & Asset Allocation */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} lg={6}>
            <SpendingHeatmap expenses={data.expenses} />
          </Grid>
          <Grid item xs={12} lg={6}>
            <AssetAllocation assets={data.assets} />
          </Grid>
        </Grid>

        {/* Charts Section */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          {/* Income vs Expenses Chart */}
          <Grid item xs={12} lg={8}>
            <Card
              sx={{
                borderRadius: 4,
                boxShadow: '0 10px 40px rgba(0, 0, 0, 0.1)',
                border: '1px solid rgba(0, 0, 0, 0.05)',
                animation: 'fadeInUp 0.8s ease-out 0.2s both',
                overflow: 'hidden',
                '&:hover': {
                  boxShadow: '0 15px 50px rgba(0, 0, 0, 0.15)',
                },
              }}
            >
              <CardHeader
                title="💹 Income & Expenses Trend (6 Months)"
                titleTypographyProps={{ variant: 'h6', fontWeight: 600 }}
                sx={{ pb: 1, background: 'linear-gradient(135deg, #667eea10 0%, #764ba210 100%)' }}
              />
              <CardContent sx={{ pt: 2 }}>
                <ResponsiveContainer width="100%" height={350}>
                  <AreaChart
                    data={chartData}
                    margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                  >
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
                    <Tooltip
                      contentStyle={{
                        background: 'rgba(255, 255, 255, 0.95)',
                        border: '2px solid #667eea',
                        borderRadius: '12px',
                        boxShadow: '0 10px 40px rgba(0, 0, 0, 0.2)',
                      }}
                    />
                    <Legend />
                    <Area
                      type="monotone"
                      dataKey="income"
                      stroke="#11998e"
                      fillOpacity={1}
                      fill="url(#colorIncome)"
                      strokeWidth={3}
                    />
                    <Area
                      type="monotone"
                      dataKey="expenses"
                      stroke="#f5576c"
                      fillOpacity={1}
                      fill="url(#colorExpenses)"
                      strokeWidth={3}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </Grid>

          {/* Expense Distribution */}
          <Grid item xs={12} lg={4}>
            <Card
              sx={{
                borderRadius: 4,
                boxShadow: '0 10px 40px rgba(0, 0, 0, 0.1)',
                border: '1px solid rgba(0, 0, 0, 0.05)',
                animation: 'fadeInUp 0.8s ease-out 0.3s both',
                '&:hover': {
                  boxShadow: '0 15px 50px rgba(0, 0, 0, 0.15)',
                },
              }}
            >
              <CardHeader
                title="📊 Expense Breakdown"
                titleTypographyProps={{ variant: 'h6', fontWeight: 600 }}
                sx={{ pb: 1, background: 'linear-gradient(135deg, #f093fb10 0%, #f5576c10 100%)' }}
              />
              <CardContent sx={{ textAlign: 'center', pt: 2 }}>
                {categoryData.length > 0 ? (
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={categoryData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={100}
                        paddingAngle={2}
                        dataKey="value"
                        animationDuration={1000}
                        animationEasing="ease-out"
                      >
                        {categoryData.map((entry, index) => (
                          <Cell
                            key={`cell-${index}`}
                            fill={COLORS[index % COLORS.length]}
                            style={{ filter: 'drop-shadow(0 4px 12px rgba(0,0,0,0.1))' }}
                          />
                        ))}
                      </Pie>
                      <Tooltip
                        contentStyle={{
                          background: 'rgba(255, 255, 255, 0.95)',
                          border: '2px solid #667eea',
                          borderRadius: '12px',
                        }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                ) : (
                  <Typography sx={{ color: "rgba(255, 255, 255, 0.6)" }} sx={{ py: 6 }}>
                    📈 No expense data yet
                  </Typography>
                )}
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Financial Health & Quick Actions */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          {/* Health Card */}
          <Grid item xs={12} md={6}>
            <Card
              sx={{
                borderRadius: 4,
                boxShadow: '0 10px 40px rgba(0, 0, 0, 0.1)',
                border: '1px solid rgba(0, 0, 0, 0.05)',
                animation: 'fadeInUp 0.8s ease-out 0.4s both',
                background: 'linear-gradient(135deg, rgba(17, 153, 142, 0.05) 0%, rgba(56, 239, 125, 0.05) 100%)',
                '&:hover': {
                  boxShadow: '0 15px 50px rgba(0, 0, 0, 0.15)',
                },
              }}
            >
              <CardHeader
                title="💚 Financial Health"
                titleTypographyProps={{ variant: 'h6', fontWeight: 600 }}
              />
              <CardContent>
                <Stack spacing={3}>
                  {/* Savings Rate */}
                  <Box>
                    <Box
                      sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        mb: 1.5,
                      }}
                    >
                      <Typography variant="body2" fontWeight={600}>
                        Savings Rate
                      </Typography>
                      <Chip
                        label={`${savingsRate.toFixed(1)}%`}
                        color={
                          savingsRate > 30
                            ? 'success'
                            : savingsRate > 15
                            ? 'warning'
                            : 'error'
                        }
                        size="small"
                        sx={{
                          fontWeight: 700,
                          fontSize: '0.85rem',
                          animation: 'pulse 2s ease-in-out infinite',
                        }}
                      />
                    </Box>
                    <LinearProgress
                      variant="determinate"
                      value={Math.min(savingsRate, 100)}
                      sx={{
                        height: 10,
                        borderRadius: 5,
                        backgroundColor: '#f0f0f0',
                        '& .MuiLinearProgress-bar': {
                          borderRadius: 5,
                          background:
                            'linear-gradient(90deg, #11998e 0%, #38ef7d 100%)',
                          boxShadow: '0 0 10px rgba(17, 153, 142, 0.4)',
                        },
                      }}
                    />
                  </Box>

                  {/* Stats */}
                  <Box>
                    <Typography
                      variant="body2"
                      fontWeight={600}
                      gutterBottom
                      sx={{ mb: 1.5 }}
                    >
                      Quick Stats
                    </Typography>
                    <Stack spacing={1.5}>
                      {[
                        { label: 'Total Assets', value: formatCurrency(totalAssets), color: '#11998e' },
                        {
                          label: 'Total Liabilities',
                          value: formatCurrency(totalLiabilities),
                          color: '#f5576c',
                        },
                        {
                          label: 'Credit Card Due',
                          value: formatCurrency(creditCardOutstanding),
                          color: '#667eea',
                        },
                      ].map((stat, idx) => (
                        <Box
                          key={idx}
                          sx={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            p: 1.5,
                            backgroundColor: 'rgba(255, 255, 255, 0.08)',
                            borderRadius: 2,
                            borderLeft: `4px solid ${stat.color}`,
                          }}
                        >
                          <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                            {stat.label}
                          </Typography>
                          <Typography
                            variant="body2"
                            fontWeight={700}
                            sx={{ color: stat.color }}
                          >
                            {stat.value}
                          </Typography>
                        </Box>
                      ))}
                    </Stack>
                  </Box>
                </Stack>
              </CardContent>
            </Card>
          </Grid>

        </Grid>

        {/* Recent Transactions */}
        {recentTransactions.length > 0 && (
          <Card
            sx={{
              borderRadius: 4,
              boxShadow: '0 10px 40px rgba(0, 0, 0, 0.1)',
              border: '1px solid rgba(0, 0, 0, 0.05)',
              animation: 'fadeInUp 0.8s ease-out 0.6s both',
              mb: 4,
              overflow: 'hidden',
            }}
          >
            <CardHeader
              title="📝 Recent Transactions"
              titleTypographyProps={{ variant: 'h6', fontWeight: 600 }}
              action={
                <Button
                  size="small"
                  onClick={() => navigate('/income')}
                  sx={{
                    textTransform: 'none',
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    color: 'white',
                    fontWeight: 600,
                    '&:hover': {
                      transform: 'translateX(4px)',
                    },
                  }}
                  endIcon={<ArrowRight />}
                >
                  View All
                </Button>
              }
              sx={{ background: 'linear-gradient(135deg, rgba(0,0,0,0.02) 0%, rgba(0,0,0,0.04) 100%)' }}
            />
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow
                    sx={{
                      background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%)',
                    }}
                  >
                    {['Date', 'Description', 'Category', 'Amount'].map((header) => (
                      <TableCell key={header} sx={{ fontWeight: 700, color: '#667eea' }}>
                        {header}
                      </TableCell>
                    ))}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {recentTransactions.map((transaction, idx) => {
                    const isIncome = transaction.source !== undefined;
                    const date = ensureDate(transaction.date);
                    return (
                      <TableRow
                        key={idx}
                        sx={{
                          '&:hover': {
                            backgroundColor: 'rgba(102, 126, 234, 0.05)',
                            transform: 'scale(1.01)',
                          },
                          animation: `fadeInUp 0.5s ease-out ${0.6 + idx * 0.05}s both`,
                          transition: 'all 0.3s ease',
                        }}
                      >
                        <TableCell sx={{ fontSize: '0.9rem', fontWeight: 500 }}>
                          {date?.toLocaleDateString()}
                        </TableCell>
                        <TableCell sx={{ fontSize: '0.9rem' }}>
                          {isIncome ? transaction.source : transaction.description}
                        </TableCell>
                        <TableCell>
                          <Chip
                            label={transaction.category}
                            size="small"
                            variant="outlined"
                            sx={{
                              fontWeight: 600,
                              borderColor: isIncome ? '#11998e' : '#f5576c',
                              color: isIncome ? '#11998e' : '#f5576c',
                            }}
                          />
                        </TableCell>
                        <TableCell
                          align="right"
                          sx={{
                            fontWeight: 700,
                            color: isIncome ? '#11998e' : '#f5576c',
                            fontSize: '0.95rem',
                          }}
                        >
                          {isIncome ? '+' : '-'}{formatCurrency(transaction.amount)}
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </TableContainer>
          </Card>
        )}

        {/* Upcoming Payments */}
        {(upcomingPayments.length > 0 || upcomingEMIs.length > 0) && (
          <Grid container spacing={3}>
            {upcomingPayments.length > 0 && (
              <Grid item xs={12} md={6}>
                <Card
                  sx={{
                    borderRadius: 4,
                    boxShadow: '0 10px 40px rgba(0, 0, 0, 0.1)',
                    border: '1px solid rgba(0, 0, 0, 0.05)',
                    animation: 'fadeInUp 0.8s ease-out 0.7s both',
                    background: 'linear-gradient(135deg, rgba(245, 87, 108, 0.05) 0%, rgba(240, 147, 251, 0.05) 100%)',
                  }}
                >
                  <CardHeader
                    title="💳 Upcoming Credit Card Payments"
                    titleTypographyProps={{ variant: 'h6', fontWeight: 600 }}
                  />
                  <CardContent>
                    <Stack spacing={2}>
                      {upcomingPayments.slice(0, 3).map((payment, idx) => (
                        <Box
                          key={idx}
                          sx={{
                            p: 2.5,
                            backgroundColor: 'rgba(255, 255, 255, 0.6)',
                            borderRadius: 2.5,
                            borderLeft: `5px solid ${
                              payment.isDueSoon ? '#f5576c' : '#667eea'
                            }`,
                            backdropFilter: 'blur(10px)',
                            animation: `slideInLeft 0.6s ease-out ${0.7 + idx * 0.1}s both`,
                            '&:hover': {
                              backgroundColor: 'rgba(255, 255, 255, 0.8)',
                              transform: 'translateX(4px)',
                            },
                          }}
                        >
                          <Box
                            sx={{
                              display: 'flex',
                              justifyContent: 'space-between',
                              alignItems: 'center',
                              mb: 1,
                            }}
                          >
                            <Typography variant="body2" fontWeight={700}>
                              {payment.cardName}
                            </Typography>
                            <Chip
                              label={`${payment.daysUntilDue} days`}
                              size="small"
                              color={
                                payment.isOverdue
                                  ? 'error'
                                  : payment.isDueSoon
                                  ? 'warning'
                                  : 'default'
                              }
                              sx={{
                                fontWeight: 700,
                                animation:
                                  payment.isDueSoon ? 'pulse 2s ease-in-out infinite' : 'none',
                              }}
                            />
                          </Box>
                          <Typography variant="body2" sx={{ color: "rgba(255, 255, 255, 0.6)" }}>
                            Due: {new Date(payment.dueDate).toLocaleDateString()}
                          </Typography>
                        </Box>
                      ))}
                    </Stack>
                  </CardContent>
                </Card>
              </Grid>
            )}

            {upcomingEMIs.length > 0 && (
              <Grid item xs={12} md={6}>
                <Card
                  sx={{
                    borderRadius: 4,
                    boxShadow: '0 10px 40px rgba(0, 0, 0, 0.1)',
                    border: '1px solid rgba(0, 0, 0, 0.05)',
                    animation: 'fadeInUp 0.8s ease-out 0.8s both',
                    background: 'linear-gradient(135deg, rgba(17, 153, 142, 0.05) 0%, rgba(56, 239, 125, 0.05) 100%)',
                  }}
                >
                  <CardHeader
                    title="📅 Upcoming EMI Payments"
                    titleTypographyProps={{ variant: 'h6', fontWeight: 600 }}
                  />
                  <CardContent>
                    <Stack spacing={2}>
                      {upcomingEMIs.slice(0, 3).map((emi, idx) => (
                        <Box
                          key={idx}
                          sx={{
                            p: 2.5,
                            backgroundColor: 'rgba(255, 255, 255, 0.6)',
                            borderRadius: 2.5,
                            borderLeft: `5px solid ${
                              emi.isDueSoon ? '#f5576c' : '#11998e'
                            }`,
                            backdropFilter: 'blur(10px)',
                            animation: `slideInRight 0.6s ease-out ${0.8 + idx * 0.1}s both`,
                            '&:hover': {
                              backgroundColor: 'rgba(255, 255, 255, 0.8)',
                              transform: 'translateX(-4px)',
                            },
                          }}
                        >
                          <Box
                            sx={{
                              display: 'flex',
                              justifyContent: 'space-between',
                              alignItems: 'center',
                              mb: 1,
                            }}
                          >
                            <Typography variant="body2" fontWeight={700}>
                              {emi.loanName || 'EMI'}
                            </Typography>
                            <Chip
                              label={`${emi.daysUntilDue} days`}
                              size="small"
                              color={
                                emi.isOverdue
                                  ? 'error'
                                  : emi.isDueSoon
                                  ? 'warning'
                                  : 'default'
                              }
                              sx={{
                                fontWeight: 700,
                                animation:
                                  emi.isDueSoon ? 'pulse 2s ease-in-out infinite' : 'none',
                              }}
                            />
                          </Box>
                          <Typography variant="body2" sx={{ color: "rgba(255, 255, 255, 0.6)" }}>
                            Amount: {formatCurrency(emi.emiAmount)}
                          </Typography>
                        </Box>
                      ))}
                    </Stack>
                  </CardContent>
                </Card>
              </Grid>
            )}
          </Grid>
        )}

        {/* Income Form Modal */}
        <IncomeForm
          open={openModal === 'income'}
          onClose={closeModal}
          onSuccess={() => {
            closeModal();
            fetchDashboardData();
          }}
        />

        {/* Expense Form Modal */}
        <ExpenseForm
          open={openModal === 'expense'}
          onClose={closeModal}
          onSuccess={() => {
            closeModal();
            fetchDashboardData();
          }}
        />
      </Container>
    </Box>
  );
};

export default Dashboard;
