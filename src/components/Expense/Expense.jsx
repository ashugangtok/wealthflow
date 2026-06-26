import React, { useEffect, useState } from 'react';
import {
  Box,
  Button,
  Card,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  CircularProgress,
  Alert,
  Typography,
  Chip,
  IconButton,
  Tab,
  Tabs,
} from '@mui/material';
import { Add as AddIcon, Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';
import { useAuth } from '../../context/AuthContext';
import { getAllExpenses, deleteExpense } from '../../utils/firebaseHelpers';
import { formatCurrency, getExpensesByCategory } from '../../utils/calculations';
import { ensureDate } from '../../utils/dateHelpers';
import ExpenseForm from './ExpenseForm';
import ExpenseSummary from './ExpenseSummary';

const Expense = () => {
  const { user } = useAuth();
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [openDialog, setOpenDialog] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [editingData, setEditingData] = useState(null);
  const [tabValue, setTabValue] = useState(0);

  useEffect(() => {
    if (user) {
      fetchExpenses();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  const fetchExpenses = async () => {
    if (!user) return;

    try {
      setLoading(true);
      const data = await getAllExpenses(user.uid);
      setExpenses(data);
    } catch (err) {
      setError('Failed to load expense data');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddClick = () => {
    setEditingId(null);
    setEditingData(null);
    setOpenDialog(true);
  };

  const handleEditClick = (item) => {
    setEditingId(item.id);
    setEditingData(item);
    setOpenDialog(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this expense?')) return;

    try {
      await deleteExpense(user.uid, id);
      setExpenses(expenses.filter((item) => item.id !== id));
    } catch (err) {
      setError('Failed to delete expense');
      console.error(err);
    }
  };

  const handleFormClose = () => {
    setOpenDialog(false);
    setEditingId(null);
    setEditingData(null);
  };

  const handleFormSuccess = async () => {
    handleFormClose();
    await fetchExpenses();
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '400px' }}>
        <CircularProgress />
      </Box>
    );
  }

  // Get current month data
  const now = new Date();
  const monthlyExpenses = expenses.filter((item) => {
    const itemDate = ensureDate(item.date);
    return itemDate && !isNaN(itemDate) && itemDate.getMonth() === now.getMonth() && itemDate.getFullYear() === now.getFullYear();
  });

  const totalMonthly = monthlyExpenses.reduce((sum, item) => sum + (item.amount || 0), 0);
  const categoryData = getExpensesByCategory(monthlyExpenses);

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Box>
          <Typography variant="h4" gutterBottom>
            Expenses
          </Typography>
          <Typography variant="body2" color="textSecondary">
            Monthly Total: {formatCurrency(totalMonthly)}
          </Typography>
        </Box>
        <Button variant="contained" startIcon={<AddIcon />} onClick={handleAddClick}>
          Add Expense
        </Button>
      </Box>

      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

      <Tabs value={tabValue} onChange={(e, newValue) => setTabValue(newValue)} sx={{ mb: 3 }}>
        <Tab label="List" />
        <Tab label="Summary" />
      </Tabs>

      {tabValue === 0 ? (
        // List View
        expenses.length === 0 ? (
          <Card sx={{ p: 3, textAlign: 'center' }}>
            <Typography color="textSecondary">No expense records yet. Click "Add Expense" to get started.</Typography>
          </Card>
        ) : (
          <TableContainer component={Card}>
            <Table>
              <TableHead sx={{ backgroundColor: 'action.hover' }}>
                <TableRow>
                  <TableCell>Date</TableCell>
                  <TableCell>Description</TableCell>
                  <TableCell>Category</TableCell>
                  <TableCell align="right">Amount</TableCell>
                  <TableCell>Notes</TableCell>
                  <TableCell align="center">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {expenses.map((item) => {
                  const itemDate = ensureDate(item.date);
                  const dateStr = itemDate && !isNaN(itemDate) ? itemDate.toLocaleDateString() : 'Invalid Date';
                  return (
                    <TableRow key={item.id} hover>
                      <TableCell>{dateStr}</TableCell>
                      <TableCell>{item.description || '-'}</TableCell>
                      <TableCell>
                        <Chip label={item.category} size="small" />
                      </TableCell>
                      <TableCell align="right" sx={{ fontWeight: 600, color: 'error.main' }}>
                        {formatCurrency(item.amount)}
                      </TableCell>
                      <TableCell>{item.notes || '-'}</TableCell>
                      <TableCell align="center">
                        <IconButton
                          size="small"
                          onClick={() => handleEditClick(item)}
                          color="primary"
                        >
                          <EditIcon fontSize="small" />
                        </IconButton>
                        <IconButton
                          size="small"
                          onClick={() => handleDelete(item.id)}
                          color="error"
                        >
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>
        )
      ) : (
        // Summary View
        <ExpenseSummary categoryData={categoryData} total={totalMonthly} />
      )}

      <ExpenseForm
        open={openDialog}
        onClose={handleFormClose}
        onSuccess={handleFormSuccess}
        editingData={editingData}
        editingId={editingId}
      />
    </Box>
  );
};

export default Expense;
