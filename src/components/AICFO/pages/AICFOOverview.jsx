import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Grid,
  Typography,
  Button,
  LinearProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
} from '@mui/material';
import { TrendingUp, Description, CheckCircle, AccessTime } from '@mui/icons-material';
import { useAICFO } from '../../../context/AICFOContext';

const AICFOOverview = () => {
  const { months, setCurrentMonth, addMonth } = useAICFO();
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);

  const monthsList = Object.values(months);
  const completeCount = monthsList.filter((m) => m.status === 'complete').length;
  const processingCount = monthsList.filter((m) => m.status === 'processing').length;

  const handleCreateMonth = () => {
    const monthKey = `${selectedYear}-${selectedMonth}`;
    if (!months[monthKey]) {
      addMonth(selectedYear, selectedMonth);
      setOpenDialog(false);
    }
  };

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

  const stats = [
    {
      title: 'Total Months',
      value: monthsList.length,
      icon: <Description sx={{ fontSize: 32, color: '#06b6d4' }} />,
      bg: 'rgba(6, 182, 212, 0.1)',
    },
    {
      title: 'Complete',
      value: completeCount,
      icon: <CheckCircle sx={{ fontSize: 32, color: '#10b981' }} />,
      bg: 'rgba(16, 185, 129, 0.1)',
    },
    {
      title: 'Processing',
      value: processingCount,
      icon: <AccessTime sx={{ fontSize: 32, color: '#f59e0b' }} />,
      bg: 'rgba(245, 158, 11, 0.1)',
    },
    {
      title: 'Growth',
      value: '+12%',
      icon: <TrendingUp sx={{ fontSize: 32, color: '#8b5cf6' }} />,
      bg: 'rgba(139, 92, 246, 0.1)',
    },
  ];

  return (
    <Box>
      {/* Welcome Section */}
      <Card sx={{ mb: 3, background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white' }}>
        <CardContent sx={{ p: 4 }}>
          <Typography variant="h5" sx={{ fontWeight: 700, mb: 1 }}>
            Welcome to Your AI CFO
          </Typography>
          <Typography variant="body2" sx={{ opacity: 0.9, mb: 2 }}>
            Upload your financial statements and let AI analyze your complete financial picture
          </Typography>
          <Button variant="contained" sx={{ backgroundColor: 'white', color: '#667eea', fontWeight: 600 }}>
            Get Started
          </Button>
        </CardContent>
      </Card>

      {/* Statistics */}
      <Grid container spacing={2} sx={{ mb: 4 }}>
        {stats.map((stat, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <Card sx={{ background: stat.bg }}>
              <CardContent sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Box>
                  <Typography color="textSecondary" variant="body2" sx={{ mb: 0.5 }}>
                    {stat.title}
                  </Typography>
                  <Typography variant="h6" sx={{ fontWeight: 700 }}>
                    {stat.value}
                  </Typography>
                </Box>
                {stat.icon}
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Recent Activity */}
      <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>
        Recent Months
      </Typography>
      <Grid container spacing={2}>
        {monthsList.slice(-3).reverse().map((month) => (
          <Grid item xs={12} md={6} key={month.id}>
            <Card
              sx={{
                p: 2.5,
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                '&:hover': { boxShadow: 4, transform: 'translateY(-2px)' },
              }}
              onClick={() => setCurrentMonth(month.id)}
            >
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', mb: 2 }}>
                <Box>
                  <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
                    {new Date(month.year, month.month - 1).toLocaleDateString('en-US', {
                      month: 'long',
                      year: 'numeric',
                    })}
                  </Typography>
                </Box>
                <Box
                  sx={{
                    px: 1.5,
                    py: 0.5,
                    borderRadius: 1,
                    background:
                      month.status === 'complete'
                        ? 'rgba(16, 185, 129, 0.2)'
                        : month.status === 'processing'
                        ? 'rgba(245, 158, 11, 0.2)'
                        : 'rgba(107, 114, 128, 0.2)',
                    fontSize: '0.75rem',
                    fontWeight: 600,
                    color:
                      month.status === 'complete'
                        ? '#10b981'
                        : month.status === 'processing'
                        ? '#f59e0b'
                        : '#6b7280',
                  }}
                >
                  {month.status.replace('_', ' ').charAt(0).toUpperCase() + month.status.slice(1)}
                </Box>
              </Box>
              <LinearProgress
                variant="determinate"
                value={month.status === 'complete' ? 100 : month.status === 'processing' ? 60 : 20}
                sx={{ mb: 1.5 }}
              />
              <Typography variant="caption" color="textSecondary">
                {Object.values(month.documents || {})
                  .flat()
                  .length || 0} document(s) uploaded
              </Typography>
            </Card>
          </Grid>
        ))}
      </Grid>

      {monthsList.length === 0 && (
        <Card sx={{ p: 4, textAlign: 'center' }}>
          <Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>
            No Financial Data Yet
          </Typography>
          <Typography variant="body2" color="textSecondary" sx={{ mb: 3 }}>
            Create your first financial month and upload statements to get started
          </Typography>
          <Button
            variant="contained"
            onClick={() => setOpenDialog(true)}
            sx={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}
          >
            Create First Month
          </Button>
        </Card>
      )}

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
            onClick={handleCreateMonth}
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

export default AICFOOverview;
