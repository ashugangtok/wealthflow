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
} from '@mui/material';
import { useAuth } from '../../context/AuthContext';
import { useBankAccounts } from '../../context/BankAccountsContext';
import { useCreditCards } from '../../context/CreditCardsContext';
import { useNotifications } from '../../context/NotificationsContext';
import { addExpense } from '../../utils/firebaseHelpers';

const CreditCardPaymentForm = ({ open, onClose, onSuccess, creditCard }) => {
  const { user } = useAuth();
  const { accounts, updateAccountBalance, getAccountById } = useBankAccounts();
  const { updateOutstandingBalance } = useCreditCards();
  const { addNotification } = useNotifications();

  const [formData, setFormData] = useState({
    paymentAmount: '',
    sourceAccountId: accounts.length > 0 ? accounts[0].id : '',
    sourceAccountName: accounts.length > 0 ? accounts[0].accountName : '',
    date: new Date().toISOString().split('T')[0],
    notes: '',
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'sourceAccountId') {
      const selected = accounts.find(a => a.id === value);
      setFormData((prev) => ({
        ...prev,
        sourceAccountId: value,
        sourceAccountName: selected?.accountName || selected?.name || '',
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async () => {
    if (!formData.paymentAmount) {
      setError('Please enter payment amount');
      return;
    }

    if (!formData.sourceAccountId) {
      setError('Please select a bank account to pay from');
      return;
    }

    const paymentAmount = parseFloat(formData.paymentAmount);
    const outstandingBalance = creditCard?.outstandingBalance || 0;

    if (paymentAmount > outstandingBalance) {
      setError(`Payment amount cannot exceed outstanding balance (₹${outstandingBalance.toLocaleString('en-IN')})`);
      return;
    }

    setLoading(true);
    setError('');

    try {
      // Record the payment as an expense
      const paymentTransaction = {
        description: `Credit Card Payment - ${creditCard.cardName}`,
        amount: paymentAmount,
        category: 'Credit Card Payment',
        date: new Date(formData.date),
        notes: formData.notes,
        paymentSource: 'bank',
        accountId: formData.sourceAccountId,
        accountName: formData.sourceAccountName,
        creditCardId: creditCard.id,
        creditCardName: creditCard.cardName,
        transactionType: 'cc_payment',
      };

      // Add payment to transactions
      await addExpense(user.uid, paymentTransaction);

      // Update credit card outstanding balance
      const newOutstandingBalance = outstandingBalance - paymentAmount;
      await updateOutstandingBalance(creditCard.id, newOutstandingBalance);

      // Deduct from bank account
      const sourceAccount = getAccountById(formData.sourceAccountId);
      if (sourceAccount) {
        const newAccountBalance = sourceAccount.balance - paymentAmount;
        await updateAccountBalance(formData.sourceAccountId, newAccountBalance);
      }

      addNotification(
        `Payment of ₹${paymentAmount.toLocaleString('en-IN')} processed successfully`,
        'success',
        4000
      );
      onSuccess();
      onClose();
    } catch (err) {
      const errorMsg = err.message || 'Failed to process payment';
      setError(errorMsg);
      addNotification(errorMsg, 'error', 5000);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Pay Credit Card Bill</DialogTitle>
      <DialogContent sx={{ pt: 2 }}>
        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <TextField
            fullWidth
            label="Card Name"
            value={creditCard?.cardName || ''}
            disabled
          />

          <TextField
            fullWidth
            label="Outstanding Balance"
            value={`₹${(creditCard?.outstandingBalance || 0).toLocaleString('en-IN')}`}
            disabled
          />

          <TextField
            fullWidth
            label="Payment Amount"
            name="paymentAmount"
            type="number"
            value={formData.paymentAmount}
            onChange={handleChange}
            inputProps={{ step: '0.01', min: '0' }}
            disabled={loading}
            placeholder="Enter amount to pay"
          />

          <TextField
            fullWidth
            select
            label="Pay From Bank Account"
            name="sourceAccountId"
            value={formData.sourceAccountId}
            onChange={handleChange}
            disabled={loading || accounts.length === 0}
          >
            {accounts.map((account) => (
              <MenuItem key={account.id} value={account.id}>
                {account.accountName || account.name || account.bankName || 'Account'} - ₹{(account.balance || 0).toLocaleString('en-IN')}
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
            rows={2}
            placeholder="Add any notes..."
            disabled={loading}
          />
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} disabled={loading}>
          Cancel
        </Button>
        <Button onClick={handleSubmit} variant="contained" disabled={loading}>
          {loading ? <CircularProgress size={24} /> : 'Pay Bill'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CreditCardPaymentForm;
