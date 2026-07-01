import React, { useState } from 'react';
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
  Typography,
} from '@mui/material';
import { useAuth } from '../../context/AuthContext';
import { useBankAccounts } from '../../context/BankAccountsContext';
import { useNotifications } from '../../context/NotificationsContext';
import { ensureDate } from '../../utils/dateHelpers';
import { addLiabilityPayment, updateLiability } from '../../utils/firebaseHelpers';

const LiabilityPaymentForm = ({ open, onClose, onSuccess, liability }) => {
  const { user } = useAuth();
  const { accounts, updateAccountBalance } = useBankAccounts();
  const { addNotification } = useNotifications();
  const [formData, setFormData] = useState({
    amount: liability?.emiAmount || '',
    accountId: accounts.length > 0 ? accounts[0].id : '',
    paymentDate: new Date().toISOString().split('T')[0],
    notes: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async () => {
    if (!formData.amount || !formData.accountId) {
      setError('Please fill in all required fields');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const amount = parseFloat(formData.amount);
      const selectedAccount = accounts.find(a => a.id === formData.accountId);

      if (!selectedAccount) {
        setError('Please select a valid account');
        setLoading(false);
        return;
      }

      // Check if account has sufficient balance
      if (selectedAccount.balance < amount) {
        setError(`Insufficient balance. Available: ₹${selectedAccount.balance.toLocaleString()}`);
        setLoading(false);
        return;
      }

      // 1. Deduct from bank account
      const newBalance = selectedAccount.balance - amount;
      await updateAccountBalance(formData.accountId, newBalance);

      // 2. Save payment record to Firestore
      const paymentRecord = {
        liabilityId: liability.id,
        liabilityName: liability.loanName,
        liabilityType: liability.liabilityType,
        amount: amount,
        accountId: formData.accountId,
        accountName: selectedAccount.name || selectedAccount.accountName,
        paymentDate: new Date(formData.paymentDate),
        notes: formData.notes,
        status: 'completed',
      };
      await addLiabilityPayment(user.uid, paymentRecord);

      // 3. Calculate next EMI due date (add 1 month)
      const currentDueDate = ensureDate(liability.emiDueDate) || new Date();
      const nextDueDate = new Date(currentDueDate);
      nextDueDate.setMonth(nextDueDate.getMonth() + 1);

      // 4. Update liability with new due date and reduced outstanding amount
      const updatedOutstanding = Math.max(0, (liability.outstandingAmount || 0) - amount);
      await updateLiability(user.uid, liability.id, {
        emiDueDate: nextDueDate,
        outstandingAmount: updatedOutstanding,
      });

      addNotification(
        `✅ EMI Payment of ₹${amount.toLocaleString()} recorded. Next EMI due: ${nextDueDate.toLocaleDateString()}`,
        'success',
        4000
      );

      onSuccess();
      setFormData({
        amount: liability?.emiAmount || '',
        accountId: accounts.length > 0 ? accounts[0].id : '',
        paymentDate: new Date().toISOString().split('T')[0],
        notes: '',
      });
    } catch (err) {
      setError(err.message || 'Failed to record payment');
      addNotification(err.message || 'Failed to record payment', 'error', 4000);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ fontWeight: 600, fontSize: '1.25rem' }}>
        Pay EMI - {liability?.loanName}
      </DialogTitle>
      <DialogContent sx={{ pt: 3 }}>
        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

        <Box sx={{ mb: 2, p: 2, background: 'rgba(17, 153, 142, 0.1)', borderRadius: 2 }}>
          <Typography variant="body2" sx={{ color: 'text.secondary', mb: 0.5 }}>
            Outstanding Amount
          </Typography>
          <Typography variant="h6" sx={{ color: '#38ef7d', fontWeight: 700 }}>
            ₹{(liability?.outstandingAmount || 0).toLocaleString()}
          </Typography>
        </Box>

        <TextField
          fullWidth
          label="Payment Amount"
          name="amount"
          type="number"
          value={formData.amount}
          onChange={handleChange}
          margin="normal"
          placeholder="0.00"
          inputProps={{ step: '0.01', min: '0' }}
          helperText={`Suggested EMI: ₹${(liability?.emiAmount || 0).toLocaleString()}`}
        />

        <TextField
          fullWidth
          select
          label="Pay From Account"
          name="accountId"
          value={formData.accountId}
          onChange={handleChange}
          margin="normal"
        >
          {accounts.map((account) => (
            <MenuItem key={account.id} value={account.id}>
              {account.accountName || account.name || 'Account'} - ₹{(account.balance || 0).toLocaleString()}
            </MenuItem>
          ))}
        </TextField>

        <TextField
          fullWidth
          label="Payment Date"
          name="paymentDate"
          type="date"
          value={formData.paymentDate}
          onChange={handleChange}
          margin="normal"
          InputLabelProps={{ shrink: true }}
        />

        <TextField
          fullWidth
          label="Notes"
          name="notes"
          value={formData.notes}
          onChange={handleChange}
          margin="normal"
          multiline
          rows={2}
          placeholder="Optional notes about this payment"
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
          sx={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}
        >
          Record Payment
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default LiabilityPaymentForm;
