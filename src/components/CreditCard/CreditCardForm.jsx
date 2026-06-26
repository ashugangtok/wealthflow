import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Box,
  Alert,
  CircularProgress,
} from '@mui/material';
import { useAuth } from '../../context/AuthContext';
import { addCreditCard, updateCreditCard } from '../../utils/firebaseHelpers';

const CreditCardForm = ({ open, onClose, onSuccess, editingData, editingId }) => {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    cardName: '',
    cardNumber: '',
    limitAmount: '',
    outstandingBalance: '',
    dueDate: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (editingData) {
      setFormData({
        cardName: editingData.cardName || '',
        cardNumber: editingData.cardNumber || '',
        limitAmount: editingData.limitAmount || '',
        outstandingBalance: editingData.outstandingBalance || '',
        dueDate: editingData.dueDate || '',
      });
    } else {
      setFormData({
        cardName: '',
        cardNumber: '',
        limitAmount: '',
        outstandingBalance: '',
        dueDate: '',
      });
    }
    setError('');
  }, [editingData, open]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    if (!formData.cardName.trim() || !formData.limitAmount) {
      setError('Please fill in all required fields');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const data = {
        ...formData,
        limitAmount: parseFloat(formData.limitAmount),
        outstandingBalance: parseFloat(formData.outstandingBalance) || 0,
      };

      if (editingId) {
        await updateCreditCard(user.uid, editingId, data);
      } else {
        await addCreditCard(user.uid, data);
      }

      onSuccess();
    } catch (err) {
      setError(err.message || 'Failed to save credit card');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>{editingId ? 'Edit Credit Card' : 'Add Credit Card'}</DialogTitle>
      <DialogContent sx={{ pt: 2 }}>
        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <TextField
            fullWidth
            label="Card Name"
            name="cardName"
            value={formData.cardName}
            onChange={handleChange}
            placeholder="e.g., HDFC Credit Card"
            disabled={loading}
          />

          <TextField
            fullWidth
            label="Card Number (Last 4 Digits)"
            name="cardNumber"
            value={formData.cardNumber}
            onChange={handleChange}
            placeholder="e.g., 1234"
            disabled={loading}
          />

          <TextField
            fullWidth
            label="Credit Limit"
            name="limitAmount"
            type="number"
            value={formData.limitAmount}
            onChange={handleChange}
            inputProps={{ step: '0.01', min: '0' }}
            disabled={loading}
          />

          <TextField
            fullWidth
            label="Outstanding Balance"
            name="outstandingBalance"
            type="number"
            value={formData.outstandingBalance}
            onChange={handleChange}
            inputProps={{ step: '0.01', min: '0' }}
            disabled={loading}
          />

          <TextField
            fullWidth
            label="Due Date"
            name="dueDate"
            type="date"
            value={formData.dueDate}
            onChange={handleChange}
            InputLabelProps={{ shrink: true }}
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

export default CreditCardForm;
