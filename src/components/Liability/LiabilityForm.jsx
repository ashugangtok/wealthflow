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
import { addLiability, updateLiability } from '../../utils/firebaseHelpers';
import { LIABILITY_TYPES } from '../../config/constants';

const LiabilityForm = ({ open, onClose, onSuccess, editingData, editingId }) => {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    loanName: '',
    liabilityType: 'Personal Loan',
    outstandingAmount: '',
    totalAmount: '',
    emiAmount: '',
    emiDueDate: '',
    interestRate: '',
    startDate: '',
    endDate: '',
    notes: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (editingData) {
      setFormData({
        loanName: editingData.loanName || '',
        liabilityType: editingData.liabilityType || 'Personal Loan',
        outstandingAmount: editingData.outstandingAmount || '',
        totalAmount: editingData.totalAmount || '',
        emiAmount: editingData.emiAmount || '',
        emiDueDate: editingData.emiDueDate || '',
        interestRate: editingData.interestRate || '',
        startDate: editingData.startDate || '',
        endDate: editingData.endDate || '',
        notes: editingData.notes || '',
      });
    } else {
      setFormData({
        loanName: '',
        liabilityType: 'Personal Loan',
        outstandingAmount: '',
        totalAmount: '',
        emiAmount: '',
        emiDueDate: '',
        interestRate: '',
        startDate: '',
        endDate: '',
        notes: '',
      });
    }
    setError('');
  }, [editingData, open]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    if (!formData.loanName.trim() || !formData.liabilityType || !formData.outstandingAmount) {
      setError('Please fill in all required fields');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const data = {
        ...formData,
        outstandingAmount: parseFloat(formData.outstandingAmount),
        totalAmount: formData.totalAmount ? parseFloat(formData.totalAmount) : null,
        emiAmount: formData.emiAmount ? parseFloat(formData.emiAmount) : 0,
        interestRate: formData.interestRate ? parseFloat(formData.interestRate) : null,
      };

      if (editingId) {
        await updateLiability(user.uid, editingId, data);
      } else {
        await addLiability(user.uid, data);
      }

      onSuccess();
    } catch (err) {
      setError(err.message || 'Failed to save liability');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>{editingId ? 'Edit Liability' : 'Add Liability'}</DialogTitle>
      <DialogContent sx={{ pt: 2 }}>
        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <TextField
            fullWidth
            label="Loan Name"
            name="loanName"
            value={formData.loanName}
            onChange={handleChange}
            placeholder="e.g., Home Loan - HDFC"
            disabled={loading}
          />

          <TextField
            fullWidth
            select
            label="Liability Type"
            name="liabilityType"
            value={formData.liabilityType}
            onChange={handleChange}
            disabled={loading}
          >
            {LIABILITY_TYPES.map((type) => (
              <MenuItem key={type} value={type}>
                {type}
              </MenuItem>
            ))}
          </TextField>

          <TextField
            fullWidth
            label="Total Loan Amount"
            name="totalAmount"
            type="number"
            value={formData.totalAmount}
            onChange={handleChange}
            inputProps={{ step: '0.01', min: '0' }}
            disabled={loading}
          />

          <TextField
            fullWidth
            label="Outstanding Amount"
            name="outstandingAmount"
            type="number"
            value={formData.outstandingAmount}
            onChange={handleChange}
            inputProps={{ step: '0.01', min: '0' }}
            disabled={loading}
          />

          <TextField
            fullWidth
            label="Monthly EMI"
            name="emiAmount"
            type="number"
            value={formData.emiAmount}
            onChange={handleChange}
            inputProps={{ step: '0.01', min: '0' }}
            disabled={loading}
          />

          <TextField
            fullWidth
            label="EMI Due Date"
            name="emiDueDate"
            type="date"
            value={formData.emiDueDate}
            onChange={handleChange}
            InputLabelProps={{ shrink: true }}
            disabled={loading}
          />

          <TextField
            fullWidth
            label="Interest Rate (%)"
            name="interestRate"
            type="number"
            value={formData.interestRate}
            onChange={handleChange}
            inputProps={{ step: '0.01', min: '0' }}
            disabled={loading}
          />

          <TextField
            fullWidth
            label="Loan Start Date"
            name="startDate"
            type="date"
            value={formData.startDate}
            onChange={handleChange}
            InputLabelProps={{ shrink: true }}
            disabled={loading}
          />

          <TextField
            fullWidth
            label="Loan End Date"
            name="endDate"
            type="date"
            value={formData.endDate}
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

export default LiabilityForm;
