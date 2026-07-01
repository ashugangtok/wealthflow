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
} from '@mui/material';
import { Add as AddIcon, Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';
import { useAuth } from '../../context/AuthContext';
import { useBankAccounts } from '../../context/BankAccountsContext';
import { getAllIncome, deleteIncome } from '../../utils/firebaseHelpers';
import { formatCurrency } from '../../utils/calculations';
import { ensureDate } from '../../utils/dateHelpers';
import IncomeForm from './IncomeForm';

const Income = () => {
  const { user } = useAuth();
  const { updateAccountBalance, getAccountById } = useBankAccounts();
  const [income, setIncome] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [openDialog, setOpenDialog] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [editingData, setEditingData] = useState(null);

  useEffect(() => {
    if (user) {
      fetchIncome();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  const fetchIncome = async () => {
    if (!user) return;

    try {
      setLoading(true);
      const data = await getAllIncome(user.uid);
      setIncome(data);
    } catch (err) {
      setError('Failed to load income data');
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
    if (!window.confirm('Are you sure you want to delete this income?')) return;

    try {
      const incomeToDelete = income.find((item) => item.id === id);
      await deleteIncome(user.uid, id);

      // Reverse account balance when deleting income
      if (incomeToDelete && incomeToDelete.accountId) {
        const account = getAccountById(incomeToDelete.accountId);
        if (account) {
          const newBalance = account.balance - incomeToDelete.amount;
          await updateAccountBalance(incomeToDelete.accountId, newBalance);
        }
      }

      setIncome(income.filter((item) => item.id !== id));
    } catch (err) {
      setError('Failed to delete income');
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
    await fetchIncome();
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '400px' }}>
        <CircularProgress />
      </Box>
    );
  }

  // Calculate monthly total
  const now = new Date();
  const monthlyIncome = income
    .filter((item) => {
      const itemDate = ensureDate(item.date);
      return itemDate && !isNaN(itemDate) && itemDate.getMonth() === now.getMonth() && itemDate.getFullYear() === now.getFullYear();
    })
    .reduce((sum, item) => sum + (item.amount || 0), 0);

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Box>
          <Typography variant="h4" gutterBottom>
            Income
          </Typography>
          <Typography variant="body2" color="textSecondary">
            Monthly Total: {formatCurrency(monthlyIncome)}
          </Typography>
        </Box>
        <Button variant="contained" startIcon={<AddIcon />} onClick={handleAddClick}>
          Add Income
        </Button>
      </Box>

      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

      {income.length === 0 ? (
        <Card sx={{ p: 3, textAlign: 'center' }}>
          <Typography color="textSecondary">No income records yet. Click "Add Income" to get started.</Typography>
        </Card>
      ) : (
        <TableContainer component={Card}>
          <Table>
            <TableHead sx={{ backgroundColor: 'action.hover' }}>
              <TableRow>
                <TableCell>Date</TableCell>
                <TableCell>Source</TableCell>
                <TableCell>Category</TableCell>
                <TableCell align="right">Amount</TableCell>
                <TableCell>Notes</TableCell>
                <TableCell align="center">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {income.map((item) => {
                const itemDate = ensureDate(item.date);
                const dateStr = itemDate && !isNaN(itemDate) ? itemDate.toLocaleDateString() : 'Invalid Date';
                return (
                  <TableRow key={item.id} hover>
                    <TableCell>{dateStr}</TableCell>
                    <TableCell>{item.source || '-'}</TableCell>
                    <TableCell>
                      <Chip label={item.category} size="small" />
                    </TableCell>
                    <TableCell align="right" sx={{ fontWeight: 600 }}>
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
      )}

      <IncomeForm
        open={openDialog}
        onClose={handleFormClose}
        onSuccess={handleFormSuccess}
        editingData={editingData}
        editingId={editingId}
      />
    </Box>
  );
};

export default Income;
