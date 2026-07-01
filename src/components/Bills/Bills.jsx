import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Card,
  CardContent,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  Stack,
  Chip,
  Tabs,
  Tab,
} from '@mui/material';
import { Edit, Delete, Add } from '@mui/icons-material';
import { useAuth } from '../../context/AuthContext';
import { useBills } from '../../context/BillsContext';
import { useCreditCards } from '../../context/CreditCardsContext';
import { useGoals } from '../../context/GoalsContext';
import { useNotifications } from '../../context/NotificationsContext';
import { ensureDate } from '../../utils/dateHelpers';
import { getAllLiabilityPayments, getAllLiabilities } from '../../utils/firebaseHelpers';
import { formatCurrency } from '../../utils/calculations';
import BillsForm from './BillsForm';
import BillPaymentForm from './BillPaymentForm';

const Bills = () => {
  const { user } = useAuth();
  const { bills, deleteBillItem, fetchBills } = useBills();
  const { cards } = useCreditCards();
  const { addNotification } = useNotifications();
  const [liabilities, setLiabilities] = useState([]);
  const [liabilityPayments, setLiabilityPayments] = useState([]);
  const [openForm, setOpenForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [editingData, setEditingData] = useState(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [billToDelete, setBillToDelete] = useState(null);
  const [activeTab, setActiveTab] = useState(0); // 0 = Upcoming, 1 = Paid
  const [paymentDialogOpen, setPaymentDialogOpen] = useState(false);
  const [selectedBillForPayment, setSelectedBillForPayment] = useState(null);

  useEffect(() => {
    fetchBills();
    if (user) {
      fetchLiabilityPayments();
      fetchLiabilities();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  const fetchLiabilityPayments = async () => {
    try {
      const payments = await getAllLiabilityPayments(user.uid);
      setLiabilityPayments(payments);
    } catch (err) {
      console.error('Failed to load liability payments:', err);
    }
  };

  const fetchLiabilities = async () => {
    try {
      const data = await getAllLiabilities(user.uid);
      setLiabilities(data);
    } catch (err) {
      console.error('Failed to load liabilities:', err);
    }
  };

  const handleAddClick = () => {
    setEditingId(null);
    setEditingData(null);
    setOpenForm(true);
  };

  const handleEditClick = (bill) => {
    setEditingId(bill.id);
    setEditingData(bill);
    setOpenForm(true);
  };

  const handleDeleteClick = (bill) => {
    setBillToDelete(bill);
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!billToDelete) return;
    try {
      await deleteBillItem(billToDelete.id);
      addNotification(`Bill "${billToDelete.billName}" deleted`, 'success', 3000);
      setDeleteDialogOpen(false);
      setBillToDelete(null);
    } catch (error) {
      addNotification('Failed to delete bill', 'error', 3000);
    }
  };

  const handleFormClose = () => {
    setOpenForm(false);
    setEditingId(null);
    setEditingData(null);
  };

  const handleFormSuccess = () => {
    handleFormClose();
    fetchBills();
  };

  const handlePaymentClick = (bill) => {
    setSelectedBillForPayment(bill);
    setPaymentDialogOpen(true);
  };

  const handlePaymentSuccess = async () => {
    setPaymentDialogOpen(false);
    setSelectedBillForPayment(null);
    await fetchBills();
  };

  const formatDate = (date) => {
    if (!date) return 'N/A';
    const d = ensureDate(date) || new Date();
    return d.toLocaleDateString('en-IN', { year: 'numeric', month: 'short', day: 'numeric' });
  };

  const getUpcomingBills = () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const allBills = [];

    // Bills from bills collection
    bills.forEach((bill) => {
      const billDate = ensureDate(bill.billDate);
      if (billDate && !isNaN(billDate)) {
        billDate.setHours(0, 0, 0, 0);
        if (billDate >= today) {
          allBills.push({
            id: `bill_${bill.id}`,
            name: bill.billName,
            amount: bill.amount || 0,
            dueDate: billDate,
            type: 'bill',
            source: 'Bills',
            original: bill,
          });
        }
      }
    });

    // Credit card due payments
    cards.forEach((card) => {
      if (card.dueDate) {
        const dueDate = ensureDate(card.dueDate);
        if (dueDate && !isNaN(dueDate)) {
          dueDate.setHours(0, 0, 0, 0);
          if (dueDate >= today) {
            allBills.push({
              id: `cc_${card.id}`,
              name: `${card.cardName} Payment`,
              amount: card.outstandingBalance || 0,
              dueDate: dueDate,
              type: 'creditCard',
              source: 'Credit Card',
              original: card,
            });
          }
        }
      }
    });

    // Liability EMI payments
    liabilities.forEach((liability) => {
      if (liability.emiDueDate && liability.emiAmount) {
        const dueDate = ensureDate(liability.emiDueDate);
        if (dueDate && !isNaN(dueDate)) {
          dueDate.setHours(0, 0, 0, 0);
          if (dueDate >= today) {
            allBills.push({
              id: `emi_${liability.id}`,
              name: `${liability.loanName} EMI`,
              amount: liability.emiAmount,
              dueDate: dueDate,
              type: 'emi',
              source: 'Liability',
              original: liability,
            });
          }
        }
      }
    });

    return allBills.sort((a, b) => a.dueDate - b.dueDate);
  };

  const getPastBills = () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const allPastBills = [];

    // Past bills from bills collection
    bills.forEach((bill) => {
      const billDate = ensureDate(bill.billDate);
      if (billDate && !isNaN(billDate)) {
        billDate.setHours(0, 0, 0, 0);
        if (billDate < today) {
          allPastBills.push({
            id: `bill_${bill.id}`,
            name: bill.billName,
            amount: bill.amount || 0,
            dueDate: billDate,
            type: 'bill',
            source: 'Bills',
            original: bill,
          });
        }
      }
    });

    return allPastBills.sort((a, b) => b.dueDate - a.dueDate);
  };

  const upcomingBills = getUpcomingBills();
  const pastBills = getPastBills();
  const totalUpcoming = upcomingBills.reduce((sum, b) => sum + (b.amount || 0), 0);

  return (
    <Box sx={{ background: 'linear-gradient(135deg, #0f0f23 0%, #1a1a3e 100%)', minHeight: '100vh', p: 4, pt: 8 }}>
      <Box sx={{ maxWidth: 1200, margin: '0 auto' }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
          <Typography variant="h4" sx={{ fontWeight: 700, color: 'white' }}>
            Bills & Recurring Payments
          </Typography>
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={handleAddClick}
            sx={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}
          >
            Add Bill
          </Button>
        </Box>

        {/* Summary Cards */}
        <Stack direction={{ xs: 'column', md: 'row' }} spacing={3} sx={{ mb: 4 }}>
          <Card sx={{ flex: 1, borderRadius: 4, background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%)', border: '1px solid rgba(102, 126, 234, 0.3)' }}>
            <CardContent>
              <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.6)', mb: 1 }}>
                Upcoming Bills & Payments
              </Typography>
              <Typography variant="h5" sx={{ color: 'white', fontWeight: 700 }}>
                {upcomingBills.length}
              </Typography>
              <Typography variant="caption" sx={{ color: 'rgba(255, 255, 255, 0.5)' }}>
                Total: {formatCurrency(upcomingBills.reduce((sum, b) => sum + (b.amount || 0), 0))}
              </Typography>
            </CardContent>
          </Card>
          <Card sx={{ flex: 1, borderRadius: 4, background: 'linear-gradient(135deg, rgba(17, 153, 142, 0.1) 0%, rgba(56, 239, 125, 0.1) 100%)', border: '1px solid rgba(17, 153, 142, 0.3)' }}>
            <CardContent>
              <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.6)', mb: 1 }}>
                Paid Bills & Payments
              </Typography>
              <Typography variant="h5" sx={{ color: 'white', fontWeight: 700 }}>
                {pastBills.length + liabilityPayments.length}
              </Typography>
              <Typography variant="caption" sx={{ color: 'rgba(255, 255, 255, 0.5)' }}>
                Total: {formatCurrency(liabilityPayments.reduce((sum, p) => sum + (p.amount || 0), 0) + pastBills.reduce((sum, b) => sum + (b.amount || 0), 0))}
              </Typography>
            </CardContent>
          </Card>
        </Stack>

        {/* Tabs */}
        <Card sx={{ borderRadius: 4, boxShadow: '0 10px 40px rgba(0, 0, 0, 0.2)', background: 'rgba(15, 15, 35, 0.8)', border: '1px solid rgba(255, 255, 255, 0.1)' }}>
          <Box sx={{ borderBottom: '1px solid rgba(255, 255, 255, 0.1)' }}>
            <Tabs
              value={activeTab}
              onChange={(e, newValue) => setActiveTab(newValue)}
              sx={{
                '& .MuiTab-root': {
                  color: 'rgba(255, 255, 255, 0.6)',
                  textTransform: 'none',
                  fontSize: '1rem',
                  '&.Mui-selected': {
                    color: 'white',
                  },
                },
                '& .MuiTabs-indicator': {
                  backgroundColor: '#667eea',
                },
              }}
            >
              <Tab label={`📅 Upcoming (${upcomingBills.length})`} />
              <Tab label={`✅ Paid (${pastBills.length + liabilityPayments.length})`} />
            </Tabs>
          </Box>

          {/* Upcoming Bills Tab */}
          {activeTab === 0 && (
            <TableContainer>
              {upcomingBills.length > 0 ? (
                <Table>
                  <TableHead>
                    <TableRow sx={{ background: 'rgba(102, 126, 234, 0.1)' }}>
                      <TableCell sx={{ color: 'rgba(255, 255, 255, 0.8)', fontWeight: 600 }}>Bill Name</TableCell>
                      <TableCell sx={{ color: 'rgba(255, 255, 255, 0.8)', fontWeight: 600 }}>Category</TableCell>
                      <TableCell align="right" sx={{ color: 'rgba(255, 255, 255, 0.8)', fontWeight: 600 }}>Amount</TableCell>
                      <TableCell sx={{ color: 'rgba(255, 255, 255, 0.8)', fontWeight: 600 }}>Due Date</TableCell>
                      <TableCell sx={{ color: 'rgba(255, 255, 255, 0.8)', fontWeight: 600 }}>Type</TableCell>
                      <TableCell align="center" sx={{ color: 'rgba(255, 255, 255, 0.8)', fontWeight: 600 }}>Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {upcomingBills.map((bill) => (
                      <TableRow
                        key={bill.id}
                        sx={{
                          '&:hover': { background: 'rgba(102, 126, 234, 0.05)' },
                          borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
                        }}
                      >
                        <TableCell sx={{ color: 'white', fontWeight: 600 }}>{bill.name}</TableCell>
                        <TableCell>
                          <Chip
                            label={bill.source}
                            size="small"
                            sx={{
                              background: bill.type === 'creditCard' ? 'rgba(239, 68, 68, 0.2)' : bill.type === 'emi' ? 'rgba(17, 153, 142, 0.2)' : 'rgba(102, 126, 234, 0.2)',
                              color: bill.type === 'creditCard' ? '#ef4444' : bill.type === 'emi' ? '#11998e' : '#667eea',
                              fontWeight: 500,
                            }}
                          />
                        </TableCell>
                        <TableCell align="right" sx={{ color: '#38ef7d', fontWeight: 700 }}>
                          {formatCurrency(bill.amount)}
                        </TableCell>
                        <TableCell sx={{ color: 'white' }}>{formatDate(bill.dueDate)}</TableCell>
                        <TableCell>
                          <Chip
                            label={bill.type === 'creditCard' ? 'CC' : bill.type === 'emi' ? 'EMI' : 'Recurring'}
                            size="small"
                            variant="outlined"
                            sx={{ borderColor: 'rgba(102, 126, 234, 0.5)', color: '#667eea' }}
                          />
                        </TableCell>
                        <TableCell align="center">
                          {bill.type === 'bill' && (
                            <>
                              <Button
                                size="small"
                                variant="outlined"
                                onClick={() => handlePaymentClick(bill.original)}
                                sx={{ mr: 1, textTransform: 'none', color: '#38ef7d', borderColor: '#38ef7d' }}
                              >
                                Pay
                              </Button>
                              <IconButton
                                size="small"
                                onClick={() => handleEditClick(bill.original)}
                                sx={{ color: '#667eea' }}
                              >
                                <Edit fontSize="small" />
                              </IconButton>
                              <IconButton
                                size="small"
                                onClick={() => handleDeleteClick(bill.original)}
                                sx={{ color: '#f5576c' }}
                              >
                                <Delete fontSize="small" />
                              </IconButton>
                            </>
                          )}
                          {(bill.type === 'creditCard' || bill.type === 'emi') && (
                            <Chip label="View Details" size="small" sx={{ background: 'rgba(102, 126, 234, 0.2)', color: '#667eea' }} />
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <Box sx={{ p: 4, textAlign: 'center' }}>
                  <Typography sx={{ color: 'rgba(255, 255, 255, 0.6)' }}>No upcoming bills</Typography>
                </Box>
              )}
            </TableContainer>
          )}

          {/* Paid Bills Tab - Shows both past bills and EMI payments */}
          {activeTab === 1 && (
            <TableContainer>
              {pastBills.length > 0 || liabilityPayments.length > 0 ? (
                <Table>
                  <TableHead>
                    <TableRow sx={{ background: 'rgba(102, 126, 234, 0.1)' }}>
                      <TableCell sx={{ color: 'rgba(255, 255, 255, 0.8)', fontWeight: 600 }}>Name</TableCell>
                      <TableCell sx={{ color: 'rgba(255, 255, 255, 0.8)', fontWeight: 600 }}>Type</TableCell>
                      <TableCell align="right" sx={{ color: 'rgba(255, 255, 255, 0.8)', fontWeight: 600 }}>Amount</TableCell>
                      <TableCell sx={{ color: 'rgba(255, 255, 255, 0.8)', fontWeight: 600 }}>Date</TableCell>
                      <TableCell sx={{ color: 'rgba(255, 255, 255, 0.8)', fontWeight: 600 }}>Account</TableCell>
                      <TableCell align="center" sx={{ color: 'rgba(255, 255, 255, 0.8)', fontWeight: 600 }}>Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {/* Past Bills */}
                    {pastBills.map((bill) => (
                      <TableRow
                        key={`bill-${bill.id}`}
                        sx={{
                          '&:hover': { background: 'rgba(102, 126, 234, 0.05)' },
                          borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
                          opacity: 0.8,
                        }}
                      >
                        <TableCell sx={{ color: 'white' }}>{bill.billName}</TableCell>
                        <TableCell>
                          <Chip label="Bill" size="small" sx={{ background: 'rgba(102, 126, 234, 0.2)', color: '#667eea' }} />
                        </TableCell>
                        <TableCell align="right" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                          ₹{(bill.amount || 0).toLocaleString('en-IN')}
                        </TableCell>
                        <TableCell sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>{formatDate(bill.billDate)}</TableCell>
                        <TableCell sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>-</TableCell>
                        <TableCell align="center">
                          <IconButton
                            size="small"
                            onClick={() => handleDeleteClick(bill)}
                            sx={{ color: '#f5576c' }}
                          >
                            <Delete fontSize="small" />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    ))}

                    {/* EMI Payments */}
                    {liabilityPayments.map((payment) => {
                      const paymentDate = ensureDate(payment.paymentDate);
                      return (
                        <TableRow
                          key={`payment-${payment.id}`}
                          sx={{
                            '&:hover': { background: 'rgba(17, 153, 142, 0.05)' },
                            borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
                          }}
                        >
                          <TableCell sx={{ color: 'white' }}>{payment.liabilityName}</TableCell>
                          <TableCell>
                            <Chip label="EMI" size="small" sx={{ background: 'rgba(17, 153, 142, 0.2)', color: '#11998e' }} />
                          </TableCell>
                          <TableCell align="right" sx={{ color: '#38ef7d', fontWeight: 700 }}>
                            {formatCurrency(payment.amount)}
                          </TableCell>
                          <TableCell sx={{ color: 'white' }}>
                            {paymentDate ? paymentDate.toLocaleDateString() : 'N/A'}
                          </TableCell>
                          <TableCell sx={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: '0.9rem' }}>
                            {payment.accountName}
                          </TableCell>
                          <TableCell align="center">
                            <Chip label="✓ Paid" size="small" sx={{ background: 'rgba(16, 185, 129, 0.2)', color: '#10b981' }} />
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              ) : (
                <Box sx={{ p: 4, textAlign: 'center' }}>
                  <Typography sx={{ color: 'rgba(255, 255, 255, 0.6)' }}>No paid bills or EMI payments yet</Typography>
                </Box>
              )}
            </TableContainer>
          )}
        </Card>
      </Box>

      <BillsForm
        open={openForm}
        onClose={handleFormClose}
        onSuccess={handleFormSuccess}
        editingData={editingData}
        editingId={editingId}
      />

      {selectedBillForPayment && (
        <BillPaymentForm
          open={paymentDialogOpen}
          onClose={() => setPaymentDialogOpen(false)}
          onSuccess={handlePaymentSuccess}
          bill={selectedBillForPayment}
        />
      )}

      <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
        <DialogTitle>Delete Bill</DialogTitle>
        <DialogContent>
          Are you sure you want to delete "{billToDelete?.billName}"?
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleConfirmDelete} variant="contained" color="error">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Bills;
