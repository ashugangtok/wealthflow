import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { getAllIncome, getAllExpenses, getAllCreditCards, getAllBankAccounts } from '../../utils/firebaseHelpers';
import { ensureDate } from '../../utils/dateHelpers';
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { TrendingUp, TrendingDown, Wallet, Target, AlertCircle, Zap } from 'lucide-react';
import { calculateMonthlyTrend, getExpensesByCategory, formatCurrency } from '../../utils/calculations';
import '../../styles/animations.css';

const COLORS = ['#7C3AED', '#06B6D4', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6'];

interface KPICardProps {
  title: string;
  value: string;
  trend: number;
  icon: React.ReactNode;
  gradient: string;
}

const KPICard: React.FC<KPICardProps> = ({ title, value, trend, icon, gradient }) => {
  return (
    <div className={`p-6 rounded-4xl backdrop-blur-sm border border-white/10 ${gradient} hover:shadow-glow transition-all duration-300 transform hover:scale-105 animate-slide-up`}>
      <div className="flex justify-between items-start mb-4">
        <div className="text-white/70 text-sm font-medium">{title}</div>
        <div className="p-2 bg-white/10 rounded-2xl text-white/80">
          {icon}
        </div>
      </div>
      <div className="mb-4">
        <div className="text-2xl font-bold text-white">{value}</div>
        <div className={`text-sm mt-2 flex items-center gap-1 ${trend >= 0 ? 'text-success' : 'text-danger'}`}>
          {trend >= 0 ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
          {Math.abs(trend)}% from last month
        </div>
      </div>
      <div className="h-1 bg-white/10 rounded-full overflow-hidden">
        <div className="h-full bg-white/30 rounded-full" style={{ width: `${Math.min(100, Math.abs(trend) * 10)}%` }}></div>
      </div>
    </div>
  );
};

const FinancialHealthScore: React.FC<{ score: number }> = ({ score }) => {
  const getStatusColor = (score: number) => {
    if (score >= 80) return 'text-success';
    if (score >= 60) return 'text-warning';
    return 'text-danger';
  };

  return (
    <div className="relative w-32 h-32 flex items-center justify-center">
      <svg className="w-full h-full transform -rotate-90" viewBox="0 0 120 120">
        <circle cx="60" cy="60" r="54" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="8" />
        <circle
          cx="60"
          cy="60"
          r="54"
          fill="none"
          stroke={score >= 80 ? '#10B981' : score >= 60 ? '#F59E0B' : '#EF4444'}
          strokeWidth="8"
          strokeDasharray={`${(score / 100) * 339.29} 339.29`}
          className="transition-all duration-500"
        />
      </svg>
      <div className="absolute text-center">
        <div className={`text-3xl font-bold ${getStatusColor(score)}`}>{score}</div>
        <div className="text-xs text-white/60 mt-1">Score</div>
      </div>
    </div>
  );
};

export const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState({
    income: [],
    expenses: [],
    creditCards: [],
    bankAccounts: [],
  });

  useEffect(() => {
    fetchData();
  }, [user]);

  const fetchData = async () => {
    if (!user) return;
    try {
      const [income, expenses, creditCards, bankAccounts] = await Promise.all([
        getAllIncome(user.uid),
        getAllExpenses(user.uid),
        getAllCreditCards(user.uid),
        getAllBankAccounts(user.uid),
      ]);

      setData({
        income: income.filter(i => {
          const d = ensureDate(i.date);
          return d && !isNaN(d.getTime());
        }),
        expenses: expenses.filter(e => {
          const d = ensureDate(e.date);
          return d && !isNaN(d.getTime());
        }),
        creditCards,
        bankAccounts,
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block">
            <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
          </div>
          <p className="text-white/60 mt-4">Loading your financial data...</p>
        </div>
      </div>
    );
  }

  const now = new Date();
  const currentMonth = data.income.filter(i => {
    const d = ensureDate(i.date);
    return d && d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
  });
  const currentMonthExpenses = data.expenses.filter(e => {
    const d = ensureDate(e.date);
    return d && d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
  });

  const monthlyIncome = currentMonth.reduce((sum, i) => sum + i.amount, 0);
  const monthlyExpenses = currentMonthExpenses.reduce((sum, e) => sum + e.amount, 0);
  const monthlyBalance = monthlyIncome - monthlyExpenses;
  const savingsRate = monthlyIncome > 0 ? ((monthlyBalance / monthlyIncome) * 100).toFixed(1) : '0';

  const lastMonthIncome = data.income
    .filter(i => {
      const d = ensureDate(i.date);
      const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1);
      return d && d.getMonth() === lastMonth.getMonth() && d.getFullYear() === lastMonth.getFullYear();
    })
    .reduce((sum, i) => sum + i.amount, 0);

  const incomeTrend = lastMonthIncome > 0 ? (((monthlyIncome - lastMonthIncome) / lastMonthIncome) * 100).toFixed(1) : '0';

  const chartData = calculateMonthlyTrend(data.income, 6).map((month, idx) => ({
    month: month.month,
    income: data.income
      .filter(i => {
        const d = ensureDate(i.date);
        return d && d.getMonth() === month.monthNum - 1 && d.getFullYear() === month.year;
      })
      .reduce((sum, i) => sum + i.amount, 0),
    expenses: data.expenses
      .filter(e => {
        const d = ensureDate(e.date);
        return d && d.getMonth() === month.monthNum - 1 && d.getFullYear() === month.year;
      })
      .reduce((sum, e) => sum + e.amount, 0),
  }));

  const expensesData = Object.entries(getExpensesByCategory(currentMonthExpenses)).map(([name, value]) => ({
    name,
    value: Math.round(value),
  }));

  const bankBalance = data.bankAccounts.reduce((sum, acc) => sum + acc.balance, 0);
  const creditCardBalance = data.creditCards.reduce((sum, card) => sum + card.outstandingAmount, 0);
  const creditLimit = data.creditCards.reduce((sum, card) => sum + card.limit, 0);
  const creditUtilization = creditLimit > 0 ? ((creditCardBalance / creditLimit) * 100).toFixed(1) : '0';

  const healthScore = Math.round(
    (Math.min(parseFloat(savingsRate), 50) / 50) * 25 +
    (Math.max(0, 100 - parseFloat(creditUtilization)) / 100) * 25 +
    Math.min(bankBalance / (monthlyExpenses * 3), 1) * 25 +
    25
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-background via-card/20">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-primary/20 to-secondary/20 border-b border-white/10 p-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-4xl font-bold text-white mb-2">
                Good Evening, {user?.email?.split('@')[0]} 👋
              </h1>
              <p className="text-white/60">
                {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
              </p>
            </div>
            <div className="text-right">
              <div className="text-4xl font-bold text-white">{formatCurrency(monthlyBalance)}</div>
              <p className="text-white/60">Available to spend</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto p-8">
        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <KPICard
            title="Net Worth"
            value={formatCurrency(bankBalance - creditCardBalance)}
            trend={parseFloat(incomeTrend)}
            icon={<Wallet size={20} />}
            gradient="bg-gradient-to-br from-violet-600/20 to-violet-900/20"
          />
          <KPICard
            title="Monthly Income"
            value={formatCurrency(monthlyIncome)}
            trend={parseFloat(incomeTrend)}
            icon={<TrendingUp size={20} />}
            gradient="bg-gradient-to-br from-success/20 to-success/5"
          />
          <KPICard
            title="Monthly Expenses"
            value={formatCurrency(monthlyExpenses)}
            trend={0}
            icon={<TrendingDown size={20} />}
            gradient="bg-gradient-to-br from-danger/20 to-danger/5"
          />
          <KPICard
            title="Savings Rate"
            value={`${savingsRate}%`}
            trend={0}
            icon={<Target size={20} />}
            gradient="bg-gradient-to-br from-secondary/20 to-secondary/5"
          />
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Cash Flow */}
          <div className="lg:col-span-2 p-6 bg-card/40 backdrop-blur-xl rounded-4xl border border-white/10 hover:border-white/20 transition-all">
            <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
              <Zap size={20} />
              Cash Flow Overview
            </h2>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="incomeGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10B981" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#10B981" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="expenseGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#EF4444" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#EF4444" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                <XAxis dataKey="month" stroke="rgba(255,255,255,0.5)" />
                <YAxis stroke="rgba(255,255,255,0.5)" />
                <Tooltip contentStyle={{ background: '#111827', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px' }} />
                <Legend />
                <Area type="monotone" dataKey="income" stroke="#10B981" fill="url(#incomeGrad)" strokeWidth={2} />
                <Area type="monotone" dataKey="expenses" stroke="#EF4444" fill="url(#expenseGrad)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Health Score */}
          <div className="p-6 bg-card/40 backdrop-blur-xl rounded-4xl border border-white/10 hover:border-white/20 transition-all flex flex-col items-center justify-center">
            <h2 className="text-xl font-bold text-white mb-6">Financial Health</h2>
            <FinancialHealthScore score={healthScore} />
            <p className="text-white/60 text-sm mt-6 text-center">
              {healthScore >= 80
                ? 'Excellent financial health!'
                : healthScore >= 60
                ? 'Good progress, keep it up!'
                : 'Time to optimize your finances'}
            </p>
          </div>
        </div>

        {/* Expense Breakdown & Credit Utilization */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Expenses */}
          <div className="p-6 bg-card/40 backdrop-blur-xl rounded-4xl border border-white/10 hover:border-white/20 transition-all">
            <h2 className="text-xl font-bold text-white mb-6">Expense Breakdown</h2>
            {expensesData.length > 0 ? (
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie data={expensesData} cx="50%" cy="50%" innerRadius={60} outerRadius={100} paddingAngle={2} dataKey="value">
                    {expensesData.map((_, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-250 flex items-center justify-center text-white/60">No expense data</div>
            )}
          </div>

          {/* Credit Utilization */}
          <div className="p-6 bg-card/40 backdrop-blur-xl rounded-4xl border border-white/10 hover:border-white/20 transition-all">
            <h2 className="text-xl font-bold text-white mb-6">Credit Utilization</h2>
            <div className="space-y-6">
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-white/70">Used</span>
                  <span className="font-bold text-white">{formatCurrency(creditCardBalance)}</span>
                </div>
                <div className="h-3 bg-white/10 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-primary to-secondary transition-all duration-500"
                    style={{ width: `${Math.min(100, parseFloat(creditUtilization))}%` }}
                  ></div>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4 pt-4 border-t border-white/10">
                <div>
                  <div className="text-white/60 text-sm">Limit</div>
                  <div className="font-bold text-white">{formatCurrency(creditLimit)}</div>
                </div>
                <div>
                  <div className="text-white/60 text-sm">Available</div>
                  <div className="font-bold text-white">{formatCurrency(creditLimit - creditCardBalance)}</div>
                </div>
              </div>
              <div className="text-center pt-2">
                <span className={`text-sm font-medium ${parseFloat(creditUtilization) > 70 ? 'text-danger' : 'text-success'}`}>
                  {creditUtilization}% utilized
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
