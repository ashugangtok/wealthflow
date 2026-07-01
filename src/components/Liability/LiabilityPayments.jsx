import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  CardHeader,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Stack,
  CircularProgress,
  Chip,
  Alert,
} from '@mui/material';
import { useAuth } from '../../context/AuthContext';
import { getAllLiabilityPayments } from '../../utils/firebaseHelpers';
import { formatCurrency } from '../../utils/calculations';
import { ensureDate } from '../../utils/dateHelpers';

const LiabilityPayments = () => {
  const { user } = useAuth();
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (user) {
      fetchPayments();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  const fetchPayments = async () => {
    if (!user) return;
    try {
      setLoading(true);
      const data = await getAllLiabilityPayments(user.uid);
      setPayments(data);
    } catch (err) {
      setError('Failed to load payments');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '400px' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ background: 'linear-gradient(135deg, #0f0f23 0%, #1a1a3e 100%)', minHeight: '100vh', p: 4, pt: 8 }}>
      <Box sx={{ maxWidth: 1200, margin: '0 auto' }}>
        <Typography variant="h4" sx={{ fontWeight: 700, color: 'white', mb: 4 }}>
          Liability Payments History
        </Typography>

        <Card sx={{ borderRadius: 4, boxShadow: '0 10px 40px rgba(0, 0, 0, 0.1)', border: '1px solid rgba(255, 255, 255, 0.1)' }}>
          <CardHeader
            title="📅 All EMI Payments"
            titleTypographyProps={{ variant: 'h6', fontWeight: 600, sx: { color: 'white' } }}
            sx={{ borderBottom: '1px solid rgba(255, 255, 255, 0.1)' }}
          />
          {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow sx={{ background: 'rgba(102, 126, 234, 0.1)' }}>
                  <TableCell sx={{ color: 'rgba(255, 255, 255, 0.8)', fontWeight: 600 }}>Loan Name</TableCell>
                  <TableCell align="right" sx={{ color: 'rgba(255, 255, 255, 0.8)', fontWeight: 600 }}>Payment Amount</TableCell>
                  <TableCell sx={{ color: 'rgba(255, 255, 255, 0.8)', fontWeight: 600 }}>Account</TableCell>
                  <TableCell sx={{ color: 'rgba(255, 255, 255, 0.8)', fontWeight: 600 }}>Date</TableCell>
                  <TableCell sx={{ color: 'rgba(255, 255, 255, 0.8)', fontWeight: 600 }}>Status</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {payments.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} sx={{ textAlign: 'center', py: 8 }}>
                      <Typography sx={{ color: 'rgba(255, 255, 255, 0.6)' }}>
                        No payments recorded yet. Start by clicking "Pay EMI" on any liability.
                      </Typography>
                    </TableCell>
                  </TableRow>
                ) : (
                  payments.map((payment) => {
                    const paymentDate = ensureDate(payment.paymentDate);
                    const formattedDate = paymentDate && !isNaN(paymentDate) ? paymentDate.toLocaleDateString() : 'Invalid Date';
                    return (
                      <TableRow key={payment.id} sx={{ '&:hover': { backgroundColor: 'rgba(102, 126, 234, 0.05)' } }}>
                        <TableCell sx={{ color: 'white', fontWeight: 600 }}>{payment.liabilityName}</TableCell>
                        <TableCell align="right" sx={{ color: '#38ef7d', fontWeight: 700 }}>
                          {formatCurrency(payment.amount)}
                        </TableCell>
                        <TableCell sx={{ color: 'rgba(255, 255, 255, 0.8)' }}>
                          {payment.accountName}
                        </TableCell>
                        <TableCell sx={{ color: 'rgba(255, 255, 255, 0.8)' }}>
                          {formattedDate}
                        </TableCell>
                        <TableCell>
                          <Chip
                            label={payment.status || 'Completed'}
                            size="small"
                            sx={{
                              backgroundColor: '#10b981',
                              color: 'white',
                              fontWeight: 600,
                            }}
                          />
                        </TableCell>
                      </TableRow>
                    );
                  })
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Card>

        {/* Summary Cards */}
        <Stack direction={{ xs: 'column', md: 'row' }} spacing={3} sx={{ mt: 4 }}>
          <Card sx={{ flex: 1, borderRadius: 4, background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%)', border: '1px solid rgba(102, 126, 234, 0.3)' }}>
            <CardContent>
              <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.6)', mb: 1 }}>
                Total Payments Made
              </Typography>
              <Typography variant="h5" sx={{ color: 'white', fontWeight: 700 }}>
                {formatCurrency(payments.reduce((sum, p) => sum + (p.amount || 0), 0))}
              </Typography>
              <Typography variant="caption" sx={{ color: 'rgba(255, 255, 255, 0.5)' }}>
                {payments.length} transaction{payments.length !== 1 ? 's' : ''}
              </Typography>
            </CardContent>
          </Card>
          <Card sx={{ flex: 1, borderRadius: 4, background: 'linear-gradient(135deg, rgba(17, 153, 142, 0.1) 0%, rgba(56, 239, 125, 0.1) 100%)', border: '1px solid rgba(17, 153, 142, 0.3)' }}>
            <CardContent>
              <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.6)', mb: 1 }}>
                Last Payment
              </Typography>
              <Typography variant="h5" sx={{ color: '#38ef7d', fontWeight: 700 }}>
                {payments.length > 0
                  ? formatCurrency(payments[0].amount)
                  : '₹0.00'}
              </Typography>
              <Typography variant="caption" sx={{ color: 'rgba(255, 255, 255, 0.5)' }}>
                {payments.length > 0
                  ? ensureDate(payments[0].paymentDate)?.toLocaleDateString()
                  : 'No payments yet'}
              </Typography>
            </CardContent>
          </Card>
        </Stack>
      </Box>
    </Box>
  );
};

export default LiabilityPayments;
