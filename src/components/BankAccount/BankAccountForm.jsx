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
import { addBankAccount, updateBankAccount } from '../../utils/firebaseHelpers';

const BankAccountForm = ({ open, onClose, onSuccess, editingData, editingId }) => {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    accountName: '',
    bankName: '',
    accountNumber: '',
    accountType: 'Savings',
    balance: '',
    ifscCode: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (editingData) {
      setFormData({
        accountName: editingData.accountName || '',
        bankName: editingData.bankName || '',
        accountNumber: editingData.accountNumber || '',
        accountType: editingData.accountType || 'Savings',
        balance: editingData.balance || '',
        ifscCode: editingData.ifscCode || '',
      });
    } else {
      setFormData({
        accountName: '',
        bankName: '',
        accountNumber: '',
        accountType: 'Savings',
        balance: '',
        ifscCode: '',
      });
    }
    setError('');
  }, [editingData, open]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    if (!formData.accountName.trim() || !formData.bankName.trim() || formData.balance === '') {
      setError('Please fill in all required fields');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const data = {
        ...formData,
        balance: parseFloat(formData.balance),
      };

      if (editingId) {
        await updateBankAccount(user.uid, editingId, data);
      } else {
        await addBankAccount(user.uid, data);
      }

      onSuccess();
    } catch (err) {
      setError(err.message || 'Failed to save bank account');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>{editingId ? 'Edit Bank Account' : 'Add Bank Account'}</DialogTitle>
      <DialogContent sx={{ pt: 2 }}>
        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <TextField
            fullWidth
            label="Account Name"
            name="accountName"
            value={formData.accountName}
            onChange={handleChange}
            placeholder="e.g., Primary Savings"
            disabled={loading}
          />

          <TextField
            fullWidth
            label="Bank Name"
            name="bankName"
            value={formData.bankName}
            onChange={handleChange}
            placeholder="e.g., HDFC Bank"
            disabled={loading}
          />

          <TextField
            fullWidth
            label="Account Number (Last 4 Digits)"
            name="accountNumber"
            value={formData.accountNumber}
            onChange={handleChange}
            placeholder="e.g., 5678"
            disabled={loading}
          />

          <TextField
            fullWidth
            select
            label="Account Type"
            name="accountType"
            value={formData.accountType}
            onChange={handleChange}
            disabled={loading}
          >
            <MenuItem value="Savings">Savings</MenuItem>
            <MenuItem value="Current">Current</MenuItem>
            <MenuItem value="Checking">Checking</MenuItem>
            <MenuItem value="Money Market">Money Market</MenuItem>
          </TextField>

          <TextField
            fullWidth
            label="Current Balance"
            name="balance"
            type="number"
            value={formData.balance}
            onChange={handleChange}
            inputProps={{ step: '0.01', min: '0' }}
            disabled={loading}
          />

          <TextField
            fullWidth
            label="IFSC Code"
            name="ifscCode"
            value={formData.ifscCode}
            onChange={handleChange}
            placeholder="e.g., HDFC0001234"
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

export default BankAccountForm;
