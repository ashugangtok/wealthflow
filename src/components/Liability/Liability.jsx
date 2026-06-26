import React, { useEffect, useState } from 'react';
import {
  Box,
  Button,
  Card,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  CircularProgress,
  Alert,
  Typography,
  Chip,
  IconButton,
} from '@mui/material';
import { Add as AddIcon, Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';
import { useAuth } from '../../context/AuthContext';
import { getAllLiabilities, deleteLiability } from '../../utils/firebaseHelpers';
import { formatCurrency } from '../../utils/calculations';
import LiabilityForm from './LiabilityForm';
import LiabilityPaymentForm from './LiabilityPaymentForm';

const Liability = () => {
  const { user } = useAuth();
  const [liabilities, setLiabilities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [openDialog, setOpenDialog] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [editingData, setEditingData] = useState(null);
  const [paymentDialogOpen, setPaymentDialogOpen] = useState(false);
  const [selectedLiabilityForPayment, setSelectedLiabilityForPayment] = useState(null);

  useEffect(() => {
    if (user) {
      fetchLiabilities();
    }
  }, [user]);

  const fetchLiabilities = async () => {
    if (!user) return;

    try {
      setLoading(true);
      const data = await getAllLiabilities(user.uid);
      setLiabilities(data);
    } catch (err) {
      setError('Failed to load liabilities');
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
    if (!window.confirm('Are you sure you want to delete this liability?')) return;

    try {
      await deleteLiability(user.uid, id);
      setLiabilities(liabilities.filter((item) => item.id !== id));
    } catch (err) {
      setError('Failed to delete liability');
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
    await fetchLiabilities();
  };

  const handlePaymentClick = (liability) => {
    setSelectedLiabilityForPayment(liability);
    setPaymentDialogOpen(true);
  };

  const handlePaymentSuccess = async () => {
    setPaymentDialogOpen(false);
    setSelectedLiabilityForPayment(null);
    await fetchLiabilities();
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '400px' }}>
        <CircularProgress />
      </Box>
    );
  }

  const totalLiabilities = liabilities.reduce((sum, liability) => sum + (liability.outstandingAmount || 0), 0);
  const totalEMI = liabilities.reduce((sum, liability) => sum + (liability.emiAmount || 0), 0);

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Box>
          <Typography variant="h4" gutterBottom>
            Liabilities
          </Typography>
          <Typography variant="body2" color="textSecondary">
            Total Outstanding: {formatCurrency(totalLiabilities)} | Monthly EMI: {formatCurrency(totalEMI)}
          </Typography>
        </Box>
        <Button variant="contained" startIcon={<AddIcon />} onClick={handleAddClick}>
          Add Liability
        </Button>
      </Box>

      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

      {liabilities.length === 0 ? (
        <Card sx={{ p: 3, textAlign: 'center' }}>
          <Typography color="textSecondary">No liabilities yet. Click "Add Liability" to get started.</Typography>
        </Card>
      ) : (
        <TableContainer component={Card}>
          <Table>
            <TableHead sx={{ backgroundColor: 'action.hover' }}>
              <TableRow>
                <TableCell>Loan Name</TableCell>
                <TableCell>Type</TableCell>
                <TableCell align="right">Outstanding</TableCell>
                <TableCell align="right">EMI</TableCell>
                <TableCell>Due Date</TableCell>
                <TableCell>Status</TableCell>
                <TableCell align="center">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {liabilities.map((liability) => {
                const dueDate = liability.emiDueDate instanceof Date ? liability.emiDueDate : new Date(liability.emiDueDate);
                const today = new Date();
                const isOverdue = dueDate < today;

                return (
                  <TableRow key={liability.id} hover>
                    <TableCell sx={{ fontWeight: 600 }}>{liability.loanName}</TableCell>
                    <TableCell>
                      <Chip label={liability.liabilityType} size="small" />
                    </TableCell>
                    <TableCell align="right" sx={{ fontWeight: 600, color: 'error.main' }}>
                      {formatCurrency(liability.outstandingAmount)}
                    </TableCell>
                    <TableCell align="right">
                      {formatCurrency(liability.emiAmount || 0)}
                    </TableCell>
                    <TableCell>{dueDate.toLocaleDateString()}</TableCell>
                    <TableCell>
                      <Chip
                        label={isOverdue ? 'Overdue' : 'Active'}
                        size="small"
                        color={isOverdue ? 'error' : 'success'}
                        variant="outlined"
                      />
                    </TableCell>
                    <TableCell align="center">
                      <Button
                        size="small"
                        variant="outlined"
                        onClick={() => handlePaymentClick(liability)}
                        sx={{ mr: 1, textTransform: 'none' }}
                      >
                        Pay EMI
                      </Button>
                      <IconButton
                        size="small"
                        onClick={() => handleEditClick(liability)}
                        color="primary"
                      >
                        <EditIcon fontSize="small" />
                      </IconButton>
                      <IconButton
                        size="small"
                        onClick={() => handleDelete(liability.id)}
                        color="error"
                      >
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      <LiabilityForm
        open={openDialog}
        onClose={handleFormClose}
        onSuccess={handleFormSuccess}
        editingData={editingData}
        editingId={editingId}
      />

      {selectedLiabilityForPayment && (
        <LiabilityPaymentForm
          open={paymentDialogOpen}
          onClose={() => setPaymentDialogOpen(false)}
          onSuccess={handlePaymentSuccess}
          liability={selectedLiabilityForPayment}
        />
      )}
    </Box>
  );
};

export default Liability;
