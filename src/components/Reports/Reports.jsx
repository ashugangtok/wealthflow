import React, { useEffect, useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  CardHeader,
  Grid,
  Tab,
  Tabs,
  Typography,
  CircularProgress,
} from '@mui/material';
import {
  LineChart,
  Line,
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
import { useAuth } from '../../context/AuthContext';
import { getAllIncome, getAllExpenses, getAllAssets, getAllLiabilities, getAllCreditCards, getAllBankAccounts } from '../../utils/firebaseHelpers';
import { calculateMonthlyTrend, getExpensesByCategory, getIncomeByCategory } from '../../utils/calculations';
import { ensureDate } from '../../utils/dateHelpers';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D', '#FFC658', '#FF7C7C'];

const TabPanel = ({ children, value, index }) => (
  <div hidden={value !== index} style={{ width: '100%' }}>
    {value === index && <Box sx={{ py: 2 }}>{children}</Box>}
  </div>
);

const Reports = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [tabValue, setTabValue] = useState(0);
  const [data, setData] = useState({
    incomeTrend: [],
    expenseTrend: [],
    netWorthTrend: [],
    expensesByCategory: [],
    incomeByCategory: [],
  });

  useEffect(() => {
    if (user) {
      fetchReportData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  const fetchReportData = async () => {
    if (!user) return;

    try {
      setLoading(true);

      const [income, expenses, assets, liabilities, creditCards, bankAccounts] = await Promise.all([
        getAllIncome(user.uid).catch(() => []),
        getAllExpenses(user.uid).catch(() => []),
        getAllAssets(user.uid).catch(() => []),
        getAllLiabilities(user.uid).catch(() => []),
        getAllCreditCards(user.uid).catch(() => []),
        getAllBankAccounts(user.uid).catch(() => []),
      ]);

      const validIncome = (income || []).filter(item => {
        const date = ensureDate(item.date);
        return date && !isNaN(date);
      });

      const validExpenses = (expenses || []).filter(item => {
        const date = ensureDate(item.date);
        return date && !isNaN(date);
      });

      let incomeTrend = [];
      let expenseTrend = [];
      let netWorthTrend = [];

      if (validIncome.length > 0 || validExpenses.length > 0) {
        incomeTrend = validIncome.length > 0 ? calculateMonthlyTrend(validIncome, 12) : [];
        expenseTrend = validExpenses.length > 0 ? calculateMonthlyTrend(validExpenses, 12) : [];

        if (incomeTrend.length > 0) {
          netWorthTrend = incomeTrend.map((month, index) => {
            const totalIncome = incomeTrend.slice(0, index + 1).reduce((sum, m) => sum + m.value, 0);
            const totalExpenses = expenseTrend.slice(0, index + 1).reduce((sum, m) => sum + m.value, 0);
            const monthAssets = (assets || []).filter((asset) => {
              if (!asset.purchaseDate) return false;
              const assetDate = asset.purchaseDate instanceof Date ? asset.purchaseDate : new Date(asset.purchaseDate);
              const assetMonth = new Date(month.year, month.monthNum - 1);
              return assetDate <= assetMonth;
            }).reduce((sum, a) => sum + (a.currentValue || 0), 0);

            const totalBankBalance = (bankAccounts || []).reduce((sum, acc) => sum + (acc.balance || 0), 0);
            const monthAssetValue = monthAssets + totalBankBalance;
            const monthLiabilities = (liabilities || []).reduce((sum, l) => sum + (l.outstandingAmount || 0), 0);
            const ccOutstanding = (creditCards || []).reduce((sum, c) => sum + (c.outstandingBalance || 0), 0);

            return {
              month: month.month,
              value: monthAssetValue + (totalIncome - totalExpenses) - monthLiabilities - ccOutstanding,
            };
          });
        }
      }

      const expenseByCategory = validExpenses.length > 0 ? getExpensesByCategory(validExpenses) : {};
      const incomeByCategory = validIncome.length > 0 ? getIncomeByCategory(validIncome) : {};

      const expensesByCategory = Object.entries(expenseByCategory).map(([name, value]) => ({
        name,
        value: parseFloat(value.toFixed(2)),
      }));

      const incomeByCategories = Object.entries(incomeByCategory).map(([name, value]) => ({
        name,
        value: parseFloat(value.toFixed(2)),
      }));

      setData({
        incomeTrend,
        expenseTrend,
        netWorthTrend,
        expensesByCategory,
        incomeByCategory: incomeByCategories,
      });
    } catch (err) {
      console.error('Reports error:', err);
      setData({
        incomeTrend: [],
        expenseTrend: [],
        netWorthTrend: [],
        expensesByCategory: [],
        incomeByCategory: [],
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '400px' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      <Typography variant="h4" gutterBottom sx={{ mb: 3, fontWeight: 700 }}>
        Financial Reports
      </Typography>

      <Tabs value={tabValue} onChange={(e, newValue) => setTabValue(newValue)} sx={{ mb: 3 }}>
        <Tab label="Income & Expenses" />
        <Tab label="Net Worth" />
        <Tab label="Categories" />
      </Tabs>

      {/* Income & Expenses Trends */}
      <TabPanel value={tabValue} index={0}>
        <Card>
          <CardHeader title="12-Month Income & Expense Trend" />
          <CardContent>
            {data.incomeTrend.length > 0 || data.expenseTrend.length > 0 ? (
              <ResponsiveContainer width="100%" height={400}>
                <LineChart data={data.incomeTrend.map((item, index) => ({
                  month: item.month,
                  income: item.value,
                  expenses: data.expenseTrend[index]?.value || 0,
                }))}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="income" stroke="#4caf50" strokeWidth={2} />
                  <Line type="monotone" dataKey="expenses" stroke="#f44336" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <Box sx={{ py: 6, textAlign: 'center' }}>
                <Typography color="textSecondary">No income or expense data available yet</Typography>
              </Box>
            )}
          </CardContent>
        </Card>
      </TabPanel>

      {/* Net Worth Trend */}
      <TabPanel value={tabValue} index={1}>
        <Card>
          <CardHeader title="Net Worth Trend (12 Months)" />
          <CardContent>
            {data.netWorthTrend.length > 0 ? (
              <ResponsiveContainer width="100%" height={400}>
                <LineChart data={data.netWorthTrend}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="value" stroke="#1976d2" strokeWidth={2} dot={{ fill: '#1976d2', r: 5 }} />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <Box sx={{ py: 6, textAlign: 'center' }}>
                <Typography color="textSecondary">Not enough data to calculate net worth trend</Typography>
              </Box>
            )}
          </CardContent>
        </Card>
      </TabPanel>

      {/* Categories */}
      <TabPanel value={tabValue} index={2}>
        <Grid container spacing={3}>
          {/* Expense Categories */}
          <Grid item xs={12} md={6}>
            <Card>
              <CardHeader title="Expense Distribution" />
              <CardContent sx={{ textAlign: 'center' }}>
                {data.expensesByCategory.length > 0 ? (
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={data.expensesByCategory}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, value }) => `${name}: ₹${value.toLocaleString()}`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {data.expensesByCategory.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value) => `₹${value.toLocaleString()}`} />
                    </PieChart>
                  </ResponsiveContainer>
                ) : (
                  <Box sx={{ py: 6, textAlign: 'center' }}>
                    <Typography color="textSecondary">No expense data available</Typography>
                  </Box>
                )}
              </CardContent>
            </Card>
          </Grid>

          {/* Income Categories */}
          <Grid item xs={12} md={6}>
            <Card>
              <CardHeader title="Income Distribution" />
              <CardContent sx={{ textAlign: 'center' }}>
                {data.incomeByCategory.length > 0 ? (
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={data.incomeByCategory}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, value }) => `${name}: ₹${value.toLocaleString()}`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {data.incomeByCategory.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value) => `₹${value.toLocaleString()}`} />
                    </PieChart>
                  </ResponsiveContainer>
                ) : (
                  <Box sx={{ py: 6, textAlign: 'center' }}>
                    <Typography color="textSecondary">No income data available</Typography>
                  </Box>
                )}
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </TabPanel>
    </Box>
  );
};

export default Reports;
