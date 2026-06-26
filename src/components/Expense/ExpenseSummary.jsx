import React from 'react';
import { Grid, Card, CardContent, Typography, Box, LinearProgress, Chip } from '@mui/material';
import { formatCurrency } from '../../utils/calculations';

const ExpenseSummary = ({ categoryData, total }) => {
  const categoryEntries = Object.entries(categoryData).sort((a, b) => b[1] - a[1]);

  const getColor = (index) => {
    const colors = ['primary', 'secondary', 'error', 'warning', 'info', 'success'];
    return colors[index % colors.length];
  };

  return (
    <Grid container spacing={3}>
      {categoryEntries.map(([category, amount], index) => {
        const percentage = total > 0 ? (amount / total) * 100 : 0;

        return (
          <Grid item xs={12} sm={6} md={4} key={category}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                  <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                    {category}
                  </Typography>
                  <Chip label={`${percentage.toFixed(1)}%`} size="small" color={getColor(index)} />
                </Box>
                <Typography variant="h6" sx={{ mb: 1.5, fontWeight: 700 }}>
                  {formatCurrency(amount)}
                </Typography>
                <LinearProgress
                  variant="determinate"
                  value={percentage}
                  sx={{ height: 8, borderRadius: 4 }}
                />
              </CardContent>
            </Card>
          </Grid>
        );
      })}

      {categoryEntries.length === 0 && (
        <Grid item xs={12}>
          <Card sx={{ p: 3, textAlign: 'center' }}>
            <Typography color="textSecondary">No expense data available</Typography>
          </Card>
        </Grid>
      )}
    </Grid>
  );
};

export default ExpenseSummary;
