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
import { useNotifications } from '../../context/NotificationsContext';
import { useBills } from '../../context/BillsContext';
import { parseDateString, formatDateString, ensureDate } from '../../utils/dateHelpers';

const BILL_CATEGORIES = [
  'Utilities',
  'Rent',
  'Internet',
  'Phone',
  'Insurance',
  'Subscription',
  'Loan Payment',
  'EMI',
  'Maintenance',
  'Other',
];

const BillsForm = ({ open, onClose, onSuccess, editingData, editingId }) => {
  const { user } = useAuth();
  const { addNewBill, updateBillItem } = useBills();
  const { addNotification } = useNotifications();
  const [formData, setFormData] = useState({
    billName: '',
    amount: '',
    category: 'Utilities',
    billDate: new Date().toISOString().split('T')[0],
    recurring: false,
    frequency: 'monthly',
    notes: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (editingData) {
      const itemDate = ensureDate(editingData.billDate);
      setFormData({
        billName: editingData.billName || '',
        amount: editingData.amount || '',
        category: editingData.category || 'Utilities',
        billDate: formatDateString(itemDate),
        recurring: editingData.recurring || false,
        frequency: editingData.frequency || 'monthly',
        notes: editingData.notes || '',
      });
    } else {
      setFormData({
        billName: '',
        amount: '',
        category: 'Utilities',
        billDate: formatDateString(new Date()),
        recurring: false,
        frequency: 'monthly',
        notes: '',
      });
    }
    setError('');
  }, [editingData, open]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = async () => {
    if (!formData.billName.trim() || !formData.amount || !formData.category) {
      setError('Please fill in all required fields');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const amount = parseFloat(formData.amount);
      const data = {
        billName: formData.billName,
        amount: amount,
        category: formData.category,
        billDate: parseDateString(formData.billDate),
        recurring: formData.recurring,
        frequency: formData.recurring ? formData.frequency : null,
        notes: formData.notes,
      };

      if (editingId) {
        await updateBillItem(editingId, data);
        addNotification('Bill updated successfully', 'success', 3000);
      } else {
        await addNewBill(data);
        addNotification(`Bill "${formData.billName}" added successfully`, 'success', 3000);
      }

      onSuccess();
    } catch (err) {
      const errorMsg = err.message || 'Failed to save bill';
      setError(errorMsg);
      addNotification(errorMsg, 'error', 4000);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ fontWeight: 600, fontSize: '1.25rem' }}>
        {editingId ? 'Edit Bill' : 'Add Bill'}
      </DialogTitle>
      <DialogContent sx={{ pt: 3 }}>
        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

        <TextField
          fullWidth
          label="Bill Name"
          name="billName"
          value={formData.billName}
          onChange={handleChange}
          margin="normal"
          placeholder="e.g., Electricity Bill, Internet, Rent"
        />

        <TextField
          fullWidth
          label="Amount"
          name="amount"
          type="number"
          value={formData.amount}
          onChange={handleChange}
          margin="normal"
          placeholder="0"
          inputProps={{ step: '0.01', min: '0' }}
        />

        <TextField
          fullWidth
          select
          label="Category"
          name="category"
          value={formData.category}
          onChange={handleChange}
          margin="normal"
        >
          {BILL_CATEGORIES.map((cat) => (
            <MenuItem key={cat} value={cat}>
              {cat}
            </MenuItem>
          ))}
        </TextField>

        <TextField
          fullWidth
          label="Due Date"
          name="billDate"
          type="date"
          value={formData.billDate}
          onChange={handleChange}
          margin="normal"
          InputLabelProps={{ shrink: true }}
        />

        <Box sx={{ mt: 2, mb: 1 }}>
          <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer' }}>
            <input
              type="checkbox"
              name="recurring"
              checked={formData.recurring}
              onChange={handleChange}
              style={{ width: 18, height: 18, cursor: 'pointer' }}
            />
            <span>Recurring Bill</span>
          </label>
        </Box>

        {formData.recurring && (
          <TextField
            fullWidth
            select
            label="Frequency"
            name="frequency"
            value={formData.frequency}
            onChange={handleChange}
            margin="normal"
          >
            <MenuItem value="weekly">Weekly</MenuItem>
            <MenuItem value="biweekly">Bi-weekly</MenuItem>
            <MenuItem value="monthly">Monthly</MenuItem>
            <MenuItem value="quarterly">Quarterly</MenuItem>
            <MenuItem value="yearly">Yearly</MenuItem>
          </TextField>
        )}

        <TextField
          fullWidth
          label="Notes"
          name="notes"
          value={formData.notes}
          onChange={handleChange}
          margin="normal"
          multiline
          rows={3}
          placeholder="Add any notes about this bill"
        />
      </DialogContent>
      <DialogActions sx={{ p: 2 }}>
        <Button onClick={onClose} disabled={loading}>
          Cancel
        </Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          disabled={loading}
          startIcon={loading ? <CircularProgress size={20} /> : null}
        >
          {editingId ? 'Update' : 'Add'} Bill
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default BillsForm;
