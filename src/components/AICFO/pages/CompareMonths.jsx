import React, { useState } from 'react';
import { Box, Card, Grid, Typography, TextField, MenuItem } from '@mui/material';
import { useAICFO } from '../../../context/AICFOContext';

const CompareMonths = () => {
  const { months } = useAICFO();
  const [month1, setMonth1] = useState('');
  const [month2, setMonth2] = useState('');

  const monthsList = Object.values(months).sort((a, b) => {
    const dateA = new Date(a.year, a.month - 1);
    const dateB = new Date(b.year, b.month - 1);
    return dateB - dateA;
  });

  const comparisons = [
    { label: 'Income Comparison', icon: '📈' },
    { label: 'Expense Comparison', icon: '📉' },
    { label: 'Category Comparison', icon: '📊' },
    { label: 'Savings Comparison', icon: '💰' },
    { label: 'Cash Flow Comparison', icon: '💵' },
    { label: 'Investment Comparison', icon: '📈' },
  ];

  return (
    <Box>
      <Typography variant="h5" sx={{ fontWeight: 700, mb: 3 }}>
        Compare Financial Months
      </Typography>

      {/* Selection */}
      <Card sx={{ mb: 4, p: 3 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} sm={5}>
            <TextField
              fullWidth
              select
              label="Month 1"
              value={month1}
              onChange={(e) => setMonth1(e.target.value)}
            >
              {monthsList.map((m) => (
                <MenuItem key={m.id} value={m.id}>
                  {new Date(m.year, m.month - 1).toLocaleDateString('en-US', {
                    month: 'long',
                    year: 'numeric',
                  })}
                </MenuItem>
              ))}
            </TextField>
          </Grid>
          <Grid item xs={12} sm={2} sx={{ textAlign: 'center' }}>
            <Typography sx={{ fontWeight: 700 }}>vs</Typography>
          </Grid>
          <Grid item xs={12} sm={5}>
            <TextField
              fullWidth
              select
              label="Month 2"
              value={month2}
              onChange={(e) => setMonth2(e.target.value)}
            >
              {monthsList.map((m) => (
                <MenuItem key={m.id} value={m.id}>
                  {new Date(m.year, m.month - 1).toLocaleDateString('en-US', {
                    month: 'long',
                    year: 'numeric',
                  })}
                </MenuItem>
              ))}
            </TextField>
          </Grid>
        </Grid>
      </Card>

      {/* Comparison Results */}
      <Grid container spacing={2}>
        {comparisons.map((comp, index) => (
          <Grid item xs={12} md={6} key={index}>
            <Card
              sx={{
                p: 3,
                background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.05) 0%, rgba(118, 75, 162, 0.05) 100%)',
              }}
            >
              <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 2 }}>
                {comp.icon} {comp.label}
              </Typography>
              <Box sx={{ p: 2, background: 'rgba(255, 255, 255, 0.5)', borderRadius: 1, minHeight: 100 }}>
                <Typography variant="caption" color="textSecondary">
                  Select months to compare
                </Typography>
              </Box>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default CompareMonths;
