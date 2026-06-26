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
import { useCreditCards } from '../../context/CreditCardsContext';
import { useNotifications } from '../../context/NotificationsContext';
import { useBudgets } from '../../context/BudgetsContext';
import { addExpense, updateExpense } from '../../utils/firebaseHelpers';
import { EXPENSE_CATEGORIES } from '../../config/constants';
import { parseDateString, formatDateString, ensureDate } from '../../utils/dateHelpers';

const ExpenseForm = ({ open, onClose, onSuccess, editingData, editingId }) => {
  const { user } = useAuth();
  const { accounts, updateAccountBalance, getAccountById } = useBankAccounts();
  const { cards, updateOutstandingBalance, getCardById } = useCreditCards();
  const { budgets, updateBudgetItem } = useBudgets();
  const { addNotification } = useNotifications();
  const [formData, setFormData] = useState({
    description: '',
    amount: '',
    category: 'Groceries',
    date: new Date().toISOString().split('T')[0],
    notes: '',
    paymentSource: 'bank', // 'bank' or 'creditCard'
    accountId: accounts.length > 0 ? accounts[0].id : '',
    accountName: accounts.length > 0 ? accounts[0].name : '',
    creditCardId: cards.length > 0 ? cards[0].id : '',
    creditCardName: cards.length > 0 ? cards[0].cardName : '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (editingData) {
      const itemDate = ensureDate(editingData.date);
      setFormData({
        description: editingData.description || '',
        amount: editingData.amount || '',
        category: editingData.category || 'Groceries',
        date: formatDateString(itemDate),
        notes: editingData.notes || '',
        paymentSource: editingData.paymentSource || 'bank',
        accountId: editingData.accountId || (accounts.length > 0 ? accounts[0].id : ''),
        accountName: editingData.accountName || (accounts.length > 0 ? (accounts[0].name || accounts[0].bankName || '') : ''),
        creditCardId: editingData.creditCardId || (cards.length > 0 ? cards[0].id : ''),
        creditCardName: editingData.creditCardName || (cards.length > 0 ? cards[0].cardName : ''),
      });
    } else {
      setFormData({
        description: '',
        amount: '',
        category: 'Groceries',
        date: formatDateString(new Date()),
        notes: '',
        paymentSource: 'bank',
        accountId: accounts.length > 0 ? accounts[0].id : '',
        accountName: accounts.length > 0 ? (accounts[0].name || accounts[0].bankName || '') : '',
        creditCardId: cards.length > 0 ? cards[0].id : '',
        creditCardName: cards.length > 0 ? cards[0].cardName : '',
      });
    }
    setError('');
  }, [editingData, open, accounts, cards]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'accountId') {
      const selected = accounts.find(a => a.id === value);
      setFormData((prev) => ({ ...prev, accountId: value, accountName: selected?.name || selected?.bankName || '' }));
    } else if (name === 'creditCardId') {
      const selected = cards.find(c => c.id === value);
      setFormData((prev) => ({ ...prev, creditCardId: value, creditCardName: selected?.cardName || '' }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async () => {
    if (!formData.description.trim() || !formData.amount || !formData.category) {
      setError('Please fill in all required fields');
      return;
    }

    // Validate payment source selection
    if (formData.paymentSource === 'bank' && !formData.accountId) {
      setError('Please select a bank account');
      return;
    }
    if (formData.paymentSource === 'creditCard' && !formData.creditCardId) {
      setError('Please select a credit card');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const amount = parseFloat(formData.amount);

      // Build data object based on payment source to avoid undefined fields
      const baseData = {
        description: formData.description,
        amount: amount,
        category: formData.category,
        date: parseDateString(formData.date),
        notes: formData.notes,
        paymentSource: formData.paymentSource,
      };

      // Check if category matches a budget
      const linkedBudget = budgets.find(b => b.category === formData.category);
      if (linkedBudget) {
        baseData.budgetId = linkedBudget.id;
      }

      let data;
      if (formData.paymentSource === 'bank') {
        data = {
          ...baseData,
          accountId: formData.accountId,
        };
      } else {
        data = {
          ...baseData,
          creditCardId: formData.creditCardId,
        };
      }

      if (editingId) {
        await updateExpense(user.uid, editingId, data);
      } else {
        await addExpense(user.uid, data);

        // Update budget spent amount if expense is linked to a budget
        if (linkedBudget) {
          const newSpent = (linkedBudget.spent || 0) + amount;
          await updateBudgetItem(linkedBudget.id, { spent: newSpent });
        }

        // Update balance based on payment source
        if (formData.paymentSource === 'bank' && formData.accountId) {
          // Deduct from bank account
          const account = getAccountById(formData.accountId);
          if (account) {
            const newBalance = account.balance - amount;
            await updateAccountBalance(formData.accountId, newBalance);
          }
        } else if (formData.paymentSource === 'creditCard' && formData.creditCardId) {
          // Add to credit card outstanding balance
          const card = getCardById(formData.creditCardId);
          if (card) {
            const newOutstandingBalance = (card.outstandingBalance || 0) + amount;
            await updateOutstandingBalance(formData.creditCardId, newOutstandingBalance);
          }
        }
      }

      addNotification(
        `Expense of ₹${amount.toLocaleString('en-IN')} added successfully`,
        'success',
        4000
      );
      onSuccess();
    } catch (err) {
      const errorMsg = err.message || 'Failed to save expense';
      setError(errorMsg);
      addNotification(errorMsg, 'error', 5000);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>{editingId ? 'Edit Expense' : 'Add Expense'}</DialogTitle>
      <DialogContent sx={{ pt: 2 }}>
        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <TextField
            fullWidth
            label="Description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="e.g., Grocery Shopping"
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
            {/* Standard categories */}
            {EXPENSE_CATEGORIES.map((cat) => (
              <MenuItem key={cat} value={cat}>
                {cat}
              </MenuItem>
            ))}

            {/* Budget categories separator and header */}
            {budgets && budgets.length > 0 && (
              <MenuItem disabled sx={{ opacity: 0.5 }}>
                ──── Custom Budgets ────
              </MenuItem>
            )}

            {/* Budget categories (custom) - directly selectable */}
            {budgets && budgets.length > 0 && budgets.map((budget) => {
              const categoryValue = budget.category || '';
              if (!categoryValue) return null;
              return (
                <MenuItem
                  key={`budget-${budget.id}`}
                  value={categoryValue}
                  sx={{ pl: 3 }}
                >
                  💰 {categoryValue}
                </MenuItem>
              );
            })}
          </TextField>

          <TextField
            fullWidth
            select
            label="Pay From"
            name="paymentSource"
            value={formData.paymentSource}
            onChange={handleChange}
            disabled={loading}
          >
            <MenuItem value="bank">Bank Account</MenuItem>
            <MenuItem value="creditCard">Credit Card</MenuItem>
          </TextField>

          {formData.paymentSource === 'bank' && (
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
          )}

          {formData.paymentSource === 'creditCard' && (
            <TextField
              fullWidth
              select
              label="Credit Card"
              name="creditCardId"
              value={formData.creditCardId}
              onChange={handleChange}
              disabled={loading || cards.length === 0}
            >
              {cards.map((card) => (
                <MenuItem key={card.id} value={card.id}>
                  {card.cardName} (Outstanding: ₹{(card.outstandingBalance || 0).toLocaleString('en-IN')})
                </MenuItem>
              ))}
            </TextField>
          )}

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

export default ExpenseForm;
