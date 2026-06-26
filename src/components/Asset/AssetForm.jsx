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
import { addAsset, updateAsset } from '../../utils/firebaseHelpers';
import { ASSET_TYPES } from '../../config/constants';

const AssetForm = ({ open, onClose, onSuccess, editingData, editingId }) => {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    assetName: '',
    assetType: 'Mutual Funds',
    quantity: '',
    currentValue: '',
    purchasePrice: '',
    purchaseDate: '',
    notes: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (editingData) {
      setFormData({
        assetName: editingData.assetName || '',
        assetType: editingData.assetType || 'Mutual Funds',
        quantity: editingData.quantity || '',
        currentValue: editingData.currentValue || '',
        purchasePrice: editingData.purchasePrice || '',
        purchaseDate: editingData.purchaseDate || '',
        notes: editingData.notes || '',
      });
    } else {
      setFormData({
        assetName: '',
        assetType: 'Mutual Funds',
        quantity: '',
        currentValue: '',
        purchasePrice: '',
        purchaseDate: '',
        notes: '',
      });
    }
    setError('');
  }, [editingData, open]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    if (!formData.assetName.trim() || !formData.assetType || !formData.currentValue) {
      setError('Please fill in all required fields');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const data = {
        ...formData,
        currentValue: parseFloat(formData.currentValue),
        purchasePrice: formData.purchasePrice ? parseFloat(formData.purchasePrice) : null,
      };

      if (editingId) {
        await updateAsset(user.uid, editingId, data);
      } else {
        await addAsset(user.uid, data);
      }

      onSuccess();
    } catch (err) {
      setError(err.message || 'Failed to save asset');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>{editingId ? 'Edit Asset' : 'Add Asset'}</DialogTitle>
      <DialogContent sx={{ pt: 2 }}>
        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <TextField
            fullWidth
            label="Asset Name"
            name="assetName"
            value={formData.assetName}
            onChange={handleChange}
            placeholder="e.g., SBI MF Portfolio"
            disabled={loading}
          />

          <TextField
            fullWidth
            select
            label="Asset Type"
            name="assetType"
            value={formData.assetType}
            onChange={handleChange}
            disabled={loading}
          >
            {ASSET_TYPES.map((type) => (
              <MenuItem key={type} value={type}>
                {type}
              </MenuItem>
            ))}
          </TextField>

          <TextField
            fullWidth
            label="Quantity"
            name="quantity"
            value={formData.quantity}
            onChange={handleChange}
            placeholder="e.g., 100 units, 1 (for real estate)"
            disabled={loading}
          />

          <TextField
            fullWidth
            label="Current Value"
            name="currentValue"
            type="number"
            value={formData.currentValue}
            onChange={handleChange}
            inputProps={{ step: '0.01', min: '0' }}
            disabled={loading}
          />

          <TextField
            fullWidth
            label="Purchase Price"
            name="purchasePrice"
            type="number"
            value={formData.purchasePrice}
            onChange={handleChange}
            inputProps={{ step: '0.01', min: '0' }}
            disabled={loading}
          />

          <TextField
            fullWidth
            label="Purchase Date"
            name="purchaseDate"
            type="date"
            value={formData.purchaseDate}
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

export default AssetForm;
