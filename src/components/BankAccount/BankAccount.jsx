import React, { useEffect, useState } from 'react';
import {
  Box,
  Button,
  Grid,
  Card,
  CardContent,
  Typography,
  CircularProgress,
  Alert,
  IconButton,
  Chip,
} from '@mui/material';
import { Add as AddIcon, Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';
import { useAuth } from '../../context/AuthContext';
import { getAllBankAccounts, deleteBankAccount } from '../../utils/firebaseHelpers';
import { formatCurrency } from '../../utils/calculations';
import BankAccountForm from './BankAccountForm';

const BankAccount = () => {
  const { user } = useAuth();
  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [openDialog, setOpenDialog] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [editingData, setEditingData] = useState(null);

  useEffect(() => {
    if (user) {
      fetchBankAccounts();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  const fetchBankAccounts = async () => {
    if (!user) return;

    try {
      setLoading(true);
      const data = await getAllBankAccounts(user.uid);
      setAccounts(data);
    } catch (err) {
      setError('Failed to load bank accounts');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddClick = () => {
    setEditingId(null);
    setEditingData(null);
    setOpenDialog(true);
  };

  const handleEditClick = (item) => {
    setEditingId(item.id);
    setEditingData(item);
    setOpenDialog(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this bank account?')) return;

    try {
      await deleteBankAccount(user.uid, id);
      setAccounts(accounts.filter((item) => item.id !== id));
    } catch (err) {
      setError('Failed to delete bank account');
      console.error(err);
    }
  };

  const handleFormClose = () => {
    setOpenDialog(false);
    setEditingId(null);
    setEditingData(null);
  };

  const handleFormSuccess = async () => {
    handleFormClose();
    await fetchBankAccounts();
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '400px' }}>
        <CircularProgress />
      </Box>
    );
  }

  const totalBalance = accounts.reduce((sum, acc) => sum + (acc.balance || 0), 0);

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3, gap: 2, flexWrap: 'wrap' }}>
        <Box>
          <Typography variant="h4" gutterBottom sx={{ fontWeight: 700 }}>
            Bank Accounts
          </Typography>
          <Typography variant="body2" color="textSecondary" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            Total Balance: <Typography variant="h6" sx={{ fontWeight: 700, color: '#10b981' }}>{formatCurrency(totalBalance)}</Typography>
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleAddClick}
          sx={{
            background: 'linear-gradient(135deg, #06b6d4 0%, #0891b2 100%)',
            color: 'white',
            fontWeight: 600,
            px: 3,
            py: 1.2,
            '&:hover': {
              background: 'linear-gradient(135deg, #0891b2 0%, #0369a1 100%)',
              transform: 'translateY(-2px)',
              boxShadow: '0 8px 16px rgba(6, 182, 212, 0.3)',
            },
            transition: 'all 0.3s ease',
          }}
          aria-label="Add a new bank account"
        >
          Add Account
        </Button>
      </Box>

      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

      {accounts.length === 0 ? (
        <Card
          sx={{
            p: 6,
            textAlign: 'center',
            background: 'linear-gradient(135deg, rgba(6, 182, 212, 0.1) 0%, rgba(6, 182, 212, 0.05) 100%)',
            border: '2px dashed rgba(6, 182, 212, 0.3)',
          }}
        >
          <Box sx={{ fontSize: 64, mb: 2 }}>🏦</Box>
          <Typography variant="h5" sx={{ fontWeight: 700, mb: 1 }}>
            No Bank Accounts Yet
          </Typography>
          <Typography variant="body2" color="textSecondary" sx={{ mb: 3 }}>
            Start tracking your finances by adding your first bank account. Connect all your accounts to get a complete picture of your wealth.
          </Typography>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleAddClick}
            sx={{
              background: 'linear-gradient(135deg, #06b6d4 0%, #0891b2 100%)',
              color: 'white',
              fontWeight: 600,
            }}
          >
            Add Your First Account
          </Button>
        </Card>
      ) : (
        <Grid container spacing={3}>
          {accounts.map((account) => {
            const isZeroBalance = account.balance === 0;
            const isLowBalance = account.balance > 0 && account.balance < 1000;

            return (
              <Grid item xs={12} sm={6} md={4} lg={3} key={account.id}>
                <Card
                  sx={{
                    position: 'relative',
                    height: '100%',
                    background: isZeroBalance
                      ? 'linear-gradient(135deg, rgba(239, 68, 68, 0.1) 0%, rgba(239, 68, 68, 0.05) 100%)'
                      : isLowBalance
                      ? 'linear-gradient(135deg, rgba(245, 158, 11, 0.1) 0%, rgba(245, 158, 11, 0.05) 100%)'
                      : 'inherit',
                    border: isZeroBalance
                      ? '2px solid rgba(239, 68, 68, 0.3)'
                      : isLowBalance
                      ? '2px solid rgba(245, 158, 11, 0.3)'
                      : '1px solid rgba(255, 255, 255, 0.1)',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      transform: 'translateY(-4px)',
                      boxShadow: '0 12px 24px rgba(0, 0, 0, 0.3)',
                    },
                  }}
                >
                  {isZeroBalance && (
                    <Box
                      sx={{
                        position: 'absolute',
                        top: 8,
                        left: 12,
                        backgroundColor: '#ef4444',
                        color: 'white',
                        px: 1.5,
                        py: 0.5,
                        borderRadius: '6px',
                        fontSize: '0.75rem',
                        fontWeight: 600,
                        zIndex: 5,
                      }}
                    >
                      ⚠️ No Funds
                    </Box>
                  )}
                  {isLowBalance && !isZeroBalance && (
                    <Box
                      sx={{
                        position: 'absolute',
                        top: 8,
                        left: 12,
                        backgroundColor: '#f59e0b',
                        color: 'white',
                        px: 1.5,
                        py: 0.5,
                        borderRadius: '6px',
                        fontSize: '0.75rem',
                        fontWeight: 600,
                        zIndex: 5,
                      }}
                    >
                      💡 Low Balance
                    </Box>
                  )}

                  <Box
                    sx={{
                      position: 'absolute',
                      top: 8,
                      right: 8,
                      display: 'flex',
                      gap: 0.5,
                      zIndex: 10,
                    }}
                  >
                    <IconButton size="small" onClick={() => handleEditClick(account)} color="primary" sx={{ p: 0.5 }} aria-label="Edit account">
                      <EditIcon fontSize="small" />
                    </IconButton>
                    <IconButton size="small" onClick={() => handleDelete(account.id)} color="error" sx={{ p: 0.5 }} aria-label="Delete account">
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  </Box>

                  <CardContent sx={{ pt: isZeroBalance || isLowBalance ? 6 : 4 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                      <Box>
                        <Typography variant="h6" sx={{ fontWeight: 700 }}>
                          {account.accountName}
                        </Typography>
                        <Typography variant="body2" color="textSecondary">
                          {account.bankName}
                        </Typography>
                      </Box>
                      <Chip label={account.accountType} size="small" variant="outlined" />
                    </Box>

                    <Box sx={{ mb: 2 }}>
                      <Typography variant="caption" color="textSecondary" sx={{ display: 'block', mb: 0.5 }}>
                        Account Number
                      </Typography>
                      <Typography variant="body2" sx={{ fontWeight: 600, letterSpacing: '1px' }} title="Account number is masked for security">
                        {account.accountNumber || '••••'}
                      </Typography>
                    </Box>

                    <Box sx={{ mb: account.ifscCode ? 2 : 0 }}>
                      <Typography variant="caption" color="textSecondary" sx={{ display: 'block', mb: 0.5 }}>
                        Current Balance
                      </Typography>
                      <Typography
                        variant="h5"
                        sx={{
                          fontWeight: 700,
                          color: isZeroBalance ? '#ef4444' : isLowBalance ? '#f59e0b' : '#10b981',
                          transition: 'color 0.3s ease',
                        }}
                      >
                        {formatCurrency(account.balance || 0)}
                      </Typography>
                    </Box>

                    {account.ifscCode && (
                      <Box>
                        <Typography variant="caption" color="textSecondary" sx={{ display: 'block', mb: 0.5 }}>
                          IFSC Code
                        </Typography>
                        <Typography variant="body2" sx={{ fontFamily: 'monospace' }}>
                          {account.ifscCode}
                        </Typography>
                      </Box>
                    )}
                  </CardContent>
                </Card>
              </Grid>
            );
          })}
        </Grid>
      )}

      <BankAccountForm
        open={openDialog}
        onClose={handleFormClose}
        onSuccess={handleFormSuccess}
        editingData={editingData}
        editingId={editingId}
      />
    </Box>
  );
};

export default BankAccount;
