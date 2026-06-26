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
} from '@mui/material';
import { useAuth } from '../../context/AuthContext';
import { formatCurrency } from '../../utils/calculations';

const LiabilityPayments = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Load payments from Firestore (when backend is ready)
    setLoading(false);
  }, [user]);

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
                <TableRow>
                  <TableCell colSpan={5} sx={{ textAlign: 'center', py: 8 }}>
                    <Typography sx={{ color: 'rgba(255, 255, 255, 0.6)' }}>
                      No payments recorded yet. Start by clicking "Pay EMI" on any liability.
                    </Typography>
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>
        </Card>

        {/* Summary Card */}
        <Stack direction={{ xs: 'column', md: 'row' }} spacing={3} sx={{ mt: 4 }}>
          <Card sx={{ flex: 1, borderRadius: 4, background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%)', border: '1px solid rgba(102, 126, 234, 0.3)' }}>
            <CardContent>
              <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.6)', mb: 1 }}>
                Total Payments Made
              </Typography>
              <Typography variant="h5" sx={{ color: 'white', fontWeight: 700 }}>
                ₹0.00
              </Typography>
              <Typography variant="caption" sx={{ color: 'rgba(255, 255, 255, 0.5)' }}>
                0 transactions
              </Typography>
            </CardContent>
          </Card>
          <Card sx={{ flex: 1, borderRadius: 4, background: 'linear-gradient(135deg, rgba(17, 153, 142, 0.1) 0%, rgba(56, 239, 125, 0.1) 100%)', border: '1px solid rgba(17, 153, 142, 0.3)' }}>
            <CardContent>
              <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.6)', mb: 1 }}>
                Remaining to Pay
              </Typography>
              <Typography variant="h5" sx={{ color: '#38ef7d', fontWeight: 700 }}>
                ₹0.00
              </Typography>
            </CardContent>
          </Card>
        </Stack>
      </Box>
    </Box>
  );
};

export default LiabilityPayments;
