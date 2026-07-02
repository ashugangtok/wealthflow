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
import { useCreditCards } from '../../context/CreditCardsContext';
import { useNotifications } from '../../context/NotificationsContext';
import { getAllTransfers, addTransfer, updateCreditCard } from '../../utils/firebaseHelpers';

const CreditCardTransfer = () => {
  const { user } = useAuth();
  const { cards, fetchAllCards } = useCreditCards();
  const { addNotification } = useNotifications();
  const [transfers, setTransfers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openDialog, setOpenDialog] = useState(false);
  const [formData, setFormData] = useState({
    fromCardId: '',
    toCardId: '',
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
    if (!formData.fromCardId || !formData.toCardId || !formData.amount) {
      setError('Please fill in all required fields');
      return;
    }

    if (formData.fromCardId === formData.toCardId) {
      setError('Cannot transfer to the same card');
      return;
    }

    const amount = parseFloat(formData.amount);
    if (amount <= 0) {
      setError('Amount must be greater than zero');
      return;
    }

    const fromCard = cards.find((c) => c.id === formData.fromCardId);
    const toCard = cards.find((c) => c.id === formData.toCardId);

    if (!fromCard || fromCard.outstandingBalance < amount) {
      setError(`Insufficient outstanding balance. Available: ₹${(fromCard?.outstandingBalance || 0).toLocaleString()}`);
      return;
    }

    if (!toCard) {
      setError('Invalid destination card');
      return;
    }

    setSubmitting(true);
    try {
      // Reduce from card's outstanding balance
      await updateCreditCard(user.uid, formData.fromCardId, {
        outstandingBalance: Math.max(0, fromCard.outstandingBalance - amount),
      });

      // Increase to card's outstanding balance
      await updateCreditCard(user.uid, formData.toCardId, {
        outstandingBalance: toCard.outstandingBalance + amount,
      });

      // Record transfer
      await addTransfer(user.uid, {
        fromCardId: formData.fromCardId,
        fromCardName: fromCard.cardName,
        toCardId: formData.toCardId,
        toCardName: toCard.cardName,
        amount: amount,
        transferDate: new Date(formData.transferDate),
        notes: formData.notes,
        type: 'creditcard',
        status: 'completed',
      });

      addNotification(
        `✅ Transferred ₹${amount.toLocaleString()} from ${fromCard.cardName} to ${toCard.cardName}`,
        'success',
        4000
      );

      setFormData({
        fromCardId: '',
        toCardId: '',
        amount: '',
        transferDate: new Date().toISOString().split('T')[0],
        notes: '',
      });
      setOpenDialog(false);
      await fetchTransfers();
      await fetchAllCards();
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

  const availableDestCards = cards.filter((c) => c.id !== formData.fromCardId);

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Box>
          <Typography variant="h4" gutterBottom sx={{ fontWeight: 700 }}>
            Credit Card Transfers
          </Typography>
          <Typography variant="body2" color="textSecondary">
            Transfer balance from one credit card to another
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => setOpenDialog(true)}
          sx={{
            background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
            color: 'white',
            fontWeight: 600,
          }}
        >
          New Transfer
        </Button>
      </Box>

      {/* Transfer Form Dialog */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ fontWeight: 600, fontSize: '1.25rem' }}>Transfer Between Credit Cards</DialogTitle>
        <DialogContent sx={{ pt: 3 }}>
          {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

          <TextField
            fullWidth
            select
            label="From Card"
            name="fromCardId"
            value={formData.fromCardId}
            onChange={handleChange}
            margin="normal"
          >
            {cards.map((card) => (
              <MenuItem key={card.id} value={card.id}>
                {card.cardName} - Outstanding: ₹{(card.outstandingBalance || 0).toLocaleString()}
              </MenuItem>
            ))}
          </TextField>

          <TextField
            fullWidth
            select
            label="To Card"
            name="toCardId"
            value={formData.toCardId}
            onChange={handleChange}
            margin="normal"
            disabled={!formData.fromCardId}
          >
            {availableDestCards.map((card) => (
              <MenuItem key={card.id} value={card.id}>
                {card.cardName} - Outstanding: ₹{(card.outstandingBalance || 0).toLocaleString()}
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
            sx={{ background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)' }}
          >
            Transfer
          </Button>
        </DialogActions>
      </Dialog>

      {/* Transfers List */}
      {transfers.filter((t) => t.type === 'creditcard').length === 0 ? (
        <Card sx={{ p: 6, textAlign: 'center' }}>
          <Box sx={{ fontSize: 64, mb: 2 }}>💳</Box>
          <Typography variant="h5" sx={{ fontWeight: 700, mb: 1 }}>
            No Card Transfers Yet
          </Typography>
          <Typography variant="body2" color="textSecondary">
            Transfer credit card balances to consolidate debt or manage multiple cards.
          </Typography>
        </Card>
      ) : (
        <Grid container spacing={2}>
          {transfers
            .filter((t) => t.type === 'creditcard')
            .map((transfer) => (
              <Grid item xs={12} sm={6} md={4} key={transfer.id}>
                <Card sx={{ p: 2, background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.3)' }}>
                  <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>
                    {transfer.fromCardName} → {transfer.toCardName}
                  </Typography>
                  <Typography variant="h6" sx={{ fontWeight: 700, color: '#ef4444', mb: 1 }}>
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

export default CreditCardTransfer;
