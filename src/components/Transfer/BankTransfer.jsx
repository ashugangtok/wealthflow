import React, { useEffect, useState } from 'react';
import {
  Box,
  Button,
  Card,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  MenuItem,
  Alert,
  CircularProgress,
  Typography,
  Grid,
} from '@mui/material';
import { Add as AddIcon } from '@mui/icons-material';
import { useAuth } from '../../context/AuthContext';
import { useBankAccounts } from '../../context/BankAccountsContext';
import { useNotifications } from '../../context/NotificationsContext';
import { getAllTransfers, addTransfer } from '../../utils/firebaseHelpers';

const BankTransfer = () => {
  const { user } = useAuth();
  const { accounts, updateAccountBalance } = useBankAccounts();
  const { addNotification } = useNotifications();
  const [transfers, setTransfers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openDialog, setOpenDialog] = useState(false);
  const [formData, setFormData] = useState({
    fromAccountId: '',
    toAccountId: '',
    amount: '',
    transferDate: new Date().toISOString().split('T')[0],
    notes: '',
  });
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (user) {
      fetchTransfers();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  const fetchTransfers = async () => {
    if (!user) return;
    try {
      setLoading(true);
      const data = await getAllTransfers(user.uid);
      setTransfers(data);
    } catch (err) {
      console.error('Failed to load transfers:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setError('');
  };

  const handleSubmit = async () => {
    if (!formData.fromAccountId || !formData.toAccountId || !formData.amount) {
      setError('Please fill in all required fields');
      return;
    }

    if (formData.fromAccountId === formData.toAccountId) {
      setError('Cannot transfer to the same account');
      return;
    }

    const amount = parseFloat(formData.amount);
    if (amount <= 0) {
      setError('Amount must be greater than zero');
      return;
    }

    const fromAccount = accounts.find((a) => a.id === formData.fromAccountId);
    if (!fromAccount || fromAccount.balance < amount) {
      setError(`Insufficient balance. Available: ₹${(fromAccount?.balance || 0).toLocaleString()}`);
      return;
    }

    setSubmitting(true);
    try {
      const fromAccount = accounts.find((a) => a.id === formData.fromAccountId);
      const toAccount = accounts.find((a) => a.id === formData.toAccountId);

      // Deduct from source account
      await updateAccountBalance(formData.fromAccountId, fromAccount.balance - amount);

      // Add to destination account
      await updateAccountBalance(formData.toAccountId, toAccount.balance + amount);

      // Record transfer
      await addTransfer(user.uid, {
        fromAccountId: formData.fromAccountId,
        fromAccountName: fromAccount.accountName || fromAccount.name,
        toAccountId: formData.toAccountId,
        toAccountName: toAccount.accountName || toAccount.name,
        amount: amount,
        transferDate: new Date(formData.transferDate),
        notes: formData.notes,
        type: 'bank',
        status: 'completed',
      });

      addNotification(
        `✅ Transferred ₹${amount.toLocaleString()} from ${fromAccount.accountName || fromAccount.name} to ${toAccount.accountName || toAccount.name}`,
        'success',
        4000
      );

      setFormData({
        fromAccountId: '',
        toAccountId: '',
        amount: '',
        transferDate: new Date().toISOString().split('T')[0],
        notes: '',
      });
      setOpenDialog(false);
      await fetchTransfers();
    } catch (err) {
      setError(err.message || 'Failed to process transfer');
      addNotification(err.message || 'Failed to process transfer', 'error', 4000);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '400px' }}>
        <CircularProgress />
      </Box>
    );
  }

  const availableDestAccounts = accounts.filter((a) => a.id !== formData.fromAccountId);

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Box>
          <Typography variant="h4" gutterBottom sx={{ fontWeight: 700 }}>
            Bank Transfers
          </Typography>
          <Typography variant="body2" color="textSecondary">
            Transfer money between your bank accounts
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => setOpenDialog(true)}
          sx={{
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            color: 'white',
            fontWeight: 600,
          }}
        >
          New Transfer
        </Button>
      </Box>

      {/* Transfer Form Dialog */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ fontWeight: 600, fontSize: '1.25rem' }}>Transfer Between Accounts</DialogTitle>
        <DialogContent sx={{ pt: 3 }}>
          {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

          <TextField
            fullWidth
            select
            label="From Account"
            name="fromAccountId"
            value={formData.fromAccountId}
            onChange={handleChange}
            margin="normal"
          >
            {accounts.map((account) => (
              <MenuItem key={account.id} value={account.id}>
                {account.accountName || account.name} - ₹{(account.balance || 0).toLocaleString()}
              </MenuItem>
            ))}
          </TextField>

          <TextField
            fullWidth
            select
            label="To Account"
            name="toAccountId"
            value={formData.toAccountId}
            onChange={handleChange}
            margin="normal"
            disabled={!formData.fromAccountId}
          >
            {availableDestAccounts.map((account) => (
              <MenuItem key={account.id} value={account.id}>
                {account.accountName || account.name} - ₹{(account.balance || 0).toLocaleString()}
              </MenuItem>
            ))}
          </TextField>

          <TextField
            fullWidth
            label="Amount"
            name="amount"
            type="number"
            value={formData.amount}
            onChange={handleChange}
            margin="normal"
            placeholder="0.00"
            inputProps={{ step: '0.01', min: '0' }}
          />

          <TextField
            fullWidth
            label="Transfer Date"
            name="transferDate"
            type="date"
            value={formData.transferDate}
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
            placeholder="Optional notes"
          />
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={() => setOpenDialog(false)} disabled={submitting}>
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            variant="contained"
            disabled={submitting}
            startIcon={submitting ? <CircularProgress size={20} /> : null}
            sx={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}
          >
            Transfer
          </Button>
        </DialogActions>
      </Dialog>

      {/* Transfers List */}
      {transfers.filter((t) => t.type === 'bank').length === 0 ? (
        <Card sx={{ p: 6, textAlign: 'center' }}>
          <Box sx={{ fontSize: 64, mb: 2 }}>🔄</Box>
          <Typography variant="h5" sx={{ fontWeight: 700, mb: 1 }}>
            No Transfers Yet
          </Typography>
          <Typography variant="body2" color="textSecondary">
            Transfer money between your bank accounts to manage liquidity.
          </Typography>
        </Card>
      ) : (
        <Grid container spacing={2}>
          {transfers
            .filter((t) => t.type === 'bank')
            .map((transfer) => (
              <Grid item xs={12} sm={6} md={4} key={transfer.id}>
                <Card sx={{ p: 2, background: 'rgba(102, 126, 234, 0.1)', border: '1px solid rgba(102, 126, 234, 0.3)' }}>
                  <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>
                    {transfer.fromAccountName} → {transfer.toAccountName}
                  </Typography>
                  <Typography variant="h6" sx={{ fontWeight: 700, color: '#667eea', mb: 1 }}>
                    ₹{transfer.amount.toLocaleString()}
                  </Typography>
                  <Typography variant="caption" sx={{ color: 'textSecondary' }}>
                    {new Date(transfer.transferDate).toLocaleDateString()}
                  </Typography>
                  {transfer.notes && (
                    <Typography variant="caption" sx={{ display: 'block', mt: 1, color: 'textSecondary' }}>
                      {transfer.notes}
                    </Typography>
                  )}
                </Card>
              </Grid>
            ))}
        </Grid>
      )}
    </Box>
  );
};

export default BankTransfer;
