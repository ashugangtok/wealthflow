import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Box,
  MenuItem,
  Alert,
  CircularProgress,
} from '@mui/material';
import { useAuth } from '../../context/AuthContext';
import { useBankAccounts } from '../../context/BankAccountsContext';
import { useNotifications } from '../../context/NotificationsContext';
import { addIncome, updateIncome } from '../../utils/firebaseHelpers';
import { INCOME_CATEGORIES } from '../../config/constants';
import { parseDateString, formatDateString, ensureDate } from '../../utils/dateHelpers';

const IncomeForm = ({ open, onClose, onSuccess, editingData, editingId }) => {
  const { user } = useAuth();
  const { accounts, updateAccountBalance, getAccountById } = useBankAccounts();
  const { addNotification } = useNotifications();
  const [formData, setFormData] = useState({
    source: '',
    amount: '',
    category: 'Salary',
    date: new Date().toISOString().split('T')[0],
    notes: '',
    accountId: accounts.length > 0 ? accounts[0].id : '',
    accountName: accounts.length > 0 ? accounts[0].name : '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (editingData) {
      const itemDate = ensureDate(editingData.date);
      setFormData({
        source: editingData.source || '',
        amount: editingData.amount || '',
        category: editingData.category || 'Salary',
        date: formatDateString(itemDate),
        notes: editingData.notes || '',
        accountId: editingData.accountId || (accounts.length > 0 ? accounts[0].id : ''),
        accountName: editingData.accountName || (accounts.length > 0 ? accounts[0].name : ''),
      });
    } else {
      setFormData({
        source: '',
        amount: '',
        category: 'Salary',
        date: formatDateString(new Date()),
        notes: '',
        accountId: accounts.length > 0 ? accounts[0].id : '',
        accountName: accounts.length > 0 ? accounts[0].name : '',
      });
    }
    setError('');
  }, [editingData, open, accounts]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'accountId') {
      const selected = accounts.find(a => a.id === value);
      setFormData((prev) => ({ ...prev, accountId: value, accountName: selected?.name || '' }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async () => {
    if (!formData.source.trim() || !formData.amount || !formData.category) {
      setError('Please fill in all required fields');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const amount = parseFloat(formData.amount);
      const data = {
        source: formData.source,
        amount: amount,
        category: formData.category,
        date: parseDateString(formData.date),
        notes: formData.notes,
        accountId: formData.accountId,
      };

      if (editingId) {
        await updateIncome(user.uid, editingId, data);
      } else {
        await addIncome(user.uid, data);

        // Update account balance - add income to account
        if (formData.accountId) {
          const account = getAccountById(formData.accountId);
          if (account) {
            const newBalance = account.balance + amount;
            await updateAccountBalance(formData.accountId, newBalance);
          }
        }
      }

      addNotification(
        `Income of ₹${amount.toLocaleString('en-IN')} added successfully`,
        'success',
        4000
      );
      onSuccess();
    } catch (err) {
      const errorMsg = err.message || 'Failed to save income';
      setError(errorMsg);
      addNotification(errorMsg, 'error', 5000);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>{editingId ? 'Edit Income' : 'Add Income'}</DialogTitle>
      <DialogContent sx={{ pt: 2 }}>
        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <TextField
            fullWidth
            label="Source"
            name="source"
            value={formData.source}
            onChange={handleChange}
            placeholder="e.g., Salary, Freelance Project"
            disabled={loading}
          />

          <TextField
            fullWidth
            label="Amount"
            name="amount"
            type="number"
            value={formData.amount}
            onChange={handleChange}
            inputProps={{ step: '0.01', min: '0' }}
            disabled={loading}
          />

          <TextField
            fullWidth
            select
            label="Category"
            name="category"
            value={formData.category}
            onChange={handleChange}
            disabled={loading}
          >
            {INCOME_CATEGORIES.map((cat) => (
              <MenuItem key={cat} value={cat}>
                {cat}
              </MenuItem>
            ))}
          </TextField>

          <TextField
            fullWidth
            select
            label="Bank Account"
            name="accountId"
            value={formData.accountId}
            onChange={handleChange}
            disabled={loading || accounts.length === 0}
          >
            {accounts.map((account) => (
              <MenuItem key={account.id} value={account.id}>
                {account.name || account.bankName} (₹{account.balance?.toLocaleString('en-IN') || '0'})
              </MenuItem>
            ))}
          </TextField>

          <TextField
            fullWidth
            label="Date"
            name="date"
            type="date"
            value={formData.date}
            onChange={handleChange}
            InputLabelProps={{ shrink: true }}
            disabled={loading}
          />

          <TextField
            fullWidth
            label="Notes"
            name="notes"
            value={formData.notes}
            onChange={handleChange}
            multiline
            rows={3}
            placeholder="Add any additional notes..."
            disabled={loading}
          />
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} disabled={loading}>
          Cancel
        </Button>
        <Button onClick={handleSubmit} variant="contained" disabled={loading}>
          {loading ? <CircularProgress size={24} /> : editingId ? 'Update' : 'Add'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default IncomeForm;
