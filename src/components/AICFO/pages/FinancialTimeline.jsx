import React, { useState } from 'react';
import {
  Box,
  Card,
  Grid,
  Typography,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
} from '@mui/material';
import { Add as AddIcon, Delete as DeleteIcon } from '@mui/icons-material';
import { useAICFO } from '../../../context/AICFOContext';

const FinancialTimeline = () => {
  const { months, addMonth, setCurrentMonth } = useAICFO();
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);

  const monthsList = Object.values(months);
  const yearGroups = {};

  monthsList.forEach((month) => {
    if (!yearGroups[month.year]) {
      yearGroups[month.year] = [];
    }
    yearGroups[month.year].push(month);
  });

  const years = Object.keys(yearGroups)
    .map(Number)
    .sort((a, b) => b - a);

  const monthNames = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ];

  const handleAddMonth = () => {
    const monthKey = `${selectedYear}-${selectedMonth}`;
    if (!months[monthKey]) {
      addMonth(selectedYear, selectedMonth);
      setOpenDialog(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'complete':
        return { bg: 'rgba(16, 185, 129, 0.1)', text: '#10b981', label: '✓ Complete' };
      case 'processing':
        return { bg: 'rgba(245, 158, 11, 0.1)', text: '#f59e0b', label: '⏳ Processing' };
      case 'missing_documents':
        return { bg: 'rgba(239, 68, 68, 0.1)', text: '#ef4444', label: '⚠ Missing Docs' };
      default:
        return { bg: 'rgba(107, 114, 128, 0.1)', text: '#6b7280', label: '📝 Pending' };
    }
  };

  return (
    <Box>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Box>
          <Typography variant="h5" sx={{ fontWeight: 700, mb: 1 }}>
            Financial Timeline
          </Typography>
          <Typography variant="body2" color="textSecondary">
            Organize and track your financial statements by month
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => setOpenDialog(true)}
          sx={{
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            color: 'white',
          }}
        >
          Create Month
        </Button>
      </Box>

      {/* Timeline */}
      {years.map((year) => (
        <Box key={year} sx={{ mb: 4 }}>
          <Typography variant="h6" sx={{ fontWeight: 700, mb: 2, color: '#667eea' }}>
            {year}
          </Typography>

          <Grid container spacing={2}>
            {monthNames.map((monthName, monthIndex) => {
              const month = (yearGroups[year] || []).find((m) => m.month === monthIndex + 1);
              const monthNum = monthIndex + 1;
              const statusInfo = month ? getStatusColor(month.status) : { bg: 'rgba(107, 114, 128, 0.05)', text: '#9ca3af', label: '+ Add' };

              return (
                <Grid item xs={12} sm={6} md={4} key={`${year}-${monthNum}`}>
                  <Card
                    sx={{
                      background: statusInfo.bg,
                      border: '1px solid',
                      borderColor: statusInfo.text,
                      p: 2.5,
                      cursor: 'pointer',
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        transform: 'translateY(-4px)',
                        boxShadow: 4,
                      },
                    }}
                    onClick={() => {
                      if (month) {
                        setCurrentMonth(month.id);
                      }
                    }}
                  >
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', mb: 2 }}>
                      <Box>
                        <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
                          {monthName}
                        </Typography>
                        <Typography variant="caption" color="textSecondary">
                          {year}
                        </Typography>
                      </Box>
                      {month && (
                        <Typography
                          variant="caption"
                          sx={{
                            px: 1,
                            py: 0.5,
                            borderRadius: 0.5,
                            background: statusInfo.bg,
                            color: statusInfo.text,
                            fontWeight: 600,
                          }}
                        >
                          {statusInfo.label}
                        </Typography>
                      )}
                    </Box>

                    {month ? (
                      <>
                        <Typography variant="caption" color="textSecondary" sx={{ display: 'block', mb: 1.5 }}>
                          {Object.values(month.documents || {}).flat().length} documents
                        </Typography>
                        <Box sx={{ display: 'flex', gap: 1 }}>
                          <Button size="small" variant="text" sx={{ flex: 1 }}>
                            View
                          </Button>
                          <Button size="small" variant="text" color="error">
                            <DeleteIcon sx={{ fontSize: 16 }} />
                          </Button>
                        </Box>
                      </>
                    ) : (
                      <Button size="small" variant="outlined" sx={{ width: '100%' }} onClick={() => addMonth(year, monthNum)}>
                        <AddIcon sx={{ fontSize: 16, mr: 0.5 }} />
                        Add
                      </Button>
                    )}
                  </Card>
                </Grid>
              );
            })}
          </Grid>
        </Box>
      ))}

      {/* Create Month Dialog */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ fontWeight: 600 }}>Create Financial Month</DialogTitle>
        <DialogContent sx={{ pt: 3 }}>
          <TextField
            fullWidth
            label="Year"
            type="number"
            value={selectedYear}
            onChange={(e) => setSelectedYear(parseInt(e.target.value))}
            margin="normal"
            inputProps={{ min: 2000, max: 2050 }}
          />
          <TextField
            fullWidth
            select
            label="Month"
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value)}
            margin="normal"
          >
            {monthNames.map((name, index) => (
              <MenuItem key={index} value={index + 1}>
                {name}
              </MenuItem>
            ))}
          </TextField>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
          <Button
            onClick={handleAddMonth}
            variant="contained"
            sx={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}
          >
            Create
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default FinancialTimeline;
