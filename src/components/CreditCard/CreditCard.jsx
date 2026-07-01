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
  LinearProgress,
  IconButton,
} from '@mui/material';
import { Add as AddIcon, Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';
import { useAuth } from '../../context/AuthContext';
import { getAllCreditCards, deleteCreditCard } from '../../utils/firebaseHelpers';
import { formatCurrency, calculateCreditCardUtilization } from '../../utils/calculations';
import CreditCardForm from './CreditCardForm';
import CreditCardPaymentForm from './CreditCardPaymentForm';

const CreditCard = () => {
  const { user } = useAuth();
  const [cards, setCards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [openDialog, setOpenDialog] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [editingData, setEditingData] = useState(null);
  const [paymentDialogOpen, setPaymentDialogOpen] = useState(false);
  const [selectedCardForPayment, setSelectedCardForPayment] = useState(null);

  useEffect(() => {
    if (user) {
      fetchCreditCards();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  const fetchCreditCards = async () => {
    if (!user) return;

    try {
      setLoading(true);
      const data = await getAllCreditCards(user.uid);
      setCards(data);
    } catch (err) {
      setError('Failed to load credit cards');
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
    if (!window.confirm('Are you sure you want to delete this credit card?')) return;

    try {
      await deleteCreditCard(user.uid, id);
      setCards(cards.filter((item) => item.id !== id));
    } catch (err) {
      setError('Failed to delete credit card');
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
    await fetchCreditCards();
  };

  const handlePaymentClick = (card) => {
    setSelectedCardForPayment(card);
    setPaymentDialogOpen(true);
  };

  const handlePaymentSuccess = async () => {
    await fetchCreditCards();
    setPaymentDialogOpen(false);
    setSelectedCardForPayment(null);
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '400px' }}>
        <CircularProgress />
      </Box>
    );
  }

  const totalOutstanding = cards.reduce((sum, card) => sum + (card.outstandingBalance || 0), 0);
  const totalLimit = cards.reduce((sum, card) => sum + (card.limitAmount || 0), 0);
  const overallUtilization = totalLimit > 0 ? ((totalOutstanding / totalLimit) * 100).toFixed(2) : 0;

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3, gap: 2, flexWrap: 'wrap' }}>
        <Box>
          <Typography variant="h4" gutterBottom sx={{ fontWeight: 700 }}>
            Credit Cards
          </Typography>
          <Box sx={{ display: 'flex', gap: 3, flexWrap: 'wrap' }}>
            <Typography variant="body2" color="textSecondary">
              Outstanding: <Typography component="span" sx={{ fontWeight: 700, color: '#ef4444' }}>{formatCurrency(totalOutstanding)}</Typography>
            </Typography>
            <Typography variant="body2" color="textSecondary">
              Limit: <Typography component="span" sx={{ fontWeight: 700, color: '#10b981' }}>{formatCurrency(totalLimit)}</Typography>
            </Typography>
            <Typography variant="body2" color="textSecondary">
              Utilization: <Typography component="span" sx={{ fontWeight: 700, color: overallUtilization > 80 ? '#ef4444' : overallUtilization > 50 ? '#f59e0b' : '#10b981' }}>{overallUtilization}%</Typography>
            </Typography>
          </Box>
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
          aria-label="Add a new credit card"
        >
          Add Card
        </Button>
      </Box>

      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

      {cards.length === 0 ? (
        <Card
          sx={{
            p: 6,
            textAlign: 'center',
            background: 'linear-gradient(135deg, rgba(239, 68, 68, 0.1) 0%, rgba(239, 68, 68, 0.05) 100%)',
            border: '2px dashed rgba(239, 68, 68, 0.3)',
          }}
        >
          <Box sx={{ fontSize: 64, mb: 2 }}>💳</Box>
          <Typography variant="h5" sx={{ fontWeight: 700, mb: 1 }}>
            No Credit Cards Yet
          </Typography>
          <Typography variant="body2" color="textSecondary" sx={{ mb: 3 }}>
            Add your credit cards to track outstanding balance and manage payments in one place.
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
            Add Your First Card
          </Button>
        </Card>
      ) : (
        <Grid container spacing={3}>
          {cards.map((card) => {
            const utilization = calculateCreditCardUtilization(card.limitAmount, card.outstandingBalance);
            const utilizationColor = utilization > 80 ? 'error' : utilization > 50 ? 'warning' : 'success';

            return (
              <Grid item xs={12} sm={6} md={4} lg={3} key={card.id}>
                <Card
                  sx={{
                    position: 'relative',
                    height: '100%',
                    maxHeight: '320px',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      transform: 'translateY(-4px)',
                      boxShadow: '0 12px 24px rgba(0, 0, 0, 0.3)',
                    },
                  }}
                >
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
                    <IconButton size="small" onClick={() => handleEditClick(card)} color="primary" sx={{ p: 0.5 }} aria-label="Edit credit card">
                      <EditIcon fontSize="small" />
                    </IconButton>
                    <IconButton size="small" onClick={() => handleDelete(card.id)} color="error" sx={{ p: 0.5 }} aria-label="Delete credit card">
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  </Box>

                  <CardContent sx={{ p: 2, pt: 3 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', mb: 1.5 }}>
                      <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
                        {card.cardName}
                      </Typography>
                      {utilization > 80 && (
                        <Box sx={{ backgroundColor: '#ef4444', color: 'white', px: 1, py: 0.5, borderRadius: '4px', fontSize: '0.65rem', fontWeight: 600 }}>
                          High Usage
                        </Box>
                      )}
                    </Box>

                    <Box sx={{ mb: 1.5 }}>
                      <Typography variant="caption" color="textSecondary">
                        Card Number
                      </Typography>
                      <Typography variant="caption" sx={{ fontWeight: 600, display: 'block', letterSpacing: '1px' }} title="Card number is masked for security">
                        {card.cardNumber || '••••'}
                      </Typography>
                    </Box>

                    <Box sx={{ mb: 1.5 }}>
                      <Typography variant="caption" color="textSecondary">
                        Outstanding Balance
                      </Typography>
                      <Typography variant="body2" sx={{ fontWeight: 700, color: 'error.main' }}>
                        {formatCurrency(card.outstandingBalance || 0)}
                      </Typography>
                    </Box>

                    <Box sx={{ mb: 1.5 }}>
                      <Typography variant="caption" color="textSecondary">
                        Credit Limit
                      </Typography>
                      <Typography variant="caption" sx={{ fontWeight: 600, display: 'block' }}>
                        {formatCurrency(card.limitAmount || 0)}
                      </Typography>
                    </Box>

                    <Box sx={{ mb: 1.5 }}>
                      <Typography variant="caption" color="textSecondary">
                        Available Credit
                      </Typography>
                      <Typography variant="caption" sx={{ fontWeight: 600, display: 'block' }}>
                        {formatCurrency((card.limitAmount || 0) - (card.outstandingBalance || 0))}
                      </Typography>
                    </Box>

                    <Box sx={{ mb: 1.5 }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                        <Typography variant="caption">Utilization</Typography>
                        <Typography variant="caption" sx={{ fontWeight: 600 }}>
                          {utilization}%
                        </Typography>
                      </Box>
                      <LinearProgress variant="determinate" value={utilization} color={utilizationColor} />
                    </Box>

                    {card.dueDate && (
                      <Box sx={{ mb: 1.5 }}>
                        <Typography variant="caption" color="textSecondary">
                          Due Date
                        </Typography>
                        <Typography variant="caption" sx={{ display: 'block' }}>
                          {new Date(card.dueDate).toLocaleDateString()}
                        </Typography>
                      </Box>
                    )}

                    {(card.outstandingBalance || 0) > 0 && (
                      <Button
                        fullWidth
                        variant="contained"
                        color="primary"
                        size="small"
                        onClick={() => handlePaymentClick(card)}
                        sx={{ mt: 1 }}
                      >
                        Pay Bill
                      </Button>
                    )}
                  </CardContent>
                </Card>
              </Grid>
            );
          })}
        </Grid>
      )}

      <CreditCardForm
        open={openDialog}
        onClose={handleFormClose}
        onSuccess={handleFormSuccess}
        editingData={editingData}
        editingId={editingId}
      />

      {selectedCardForPayment && (
        <CreditCardPaymentForm
          open={paymentDialogOpen}
          onClose={() => {
            setPaymentDialogOpen(false);
            setSelectedCardForPayment(null);
          }}
          onSuccess={handlePaymentSuccess}
          creditCard={selectedCardForPayment}
        />
      )}
    </Box>
  );
};

export default CreditCard;
