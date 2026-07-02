import React from 'react';
import { Box, Card, Grid, Typography } from '@mui/material';
import { TrendingUp, TrendingDown, WarningAmber, CheckCircle } from '@mui/icons-material';
import { useAICFO } from '../../../context/AICFOContext';

const AIInsights = () => {
  const { currentMonth, months } = useAICFO();
  const month = currentMonth ? months[currentMonth] : null;

  const insights = [
    { icon: <TrendingUp sx={{ fontSize: 24, color: '#ef4444' }} />, text: 'Shopping increased 18% from last month' },
    { icon: <TrendingDown sx={{ fontSize: 24, color: '#10b981' }} />, text: 'Food delivery expenses decreased 12%' },
    { icon: <CheckCircle sx={{ fontSize: 24, color: '#06b6d4' }} />, text: 'Credit utilization improved to 35%' },
    { icon: <WarningAmber sx={{ fontSize: 24, color: '#f59e0b' }} />, text: 'Subscription expenses increased by 3 new services' },
    { icon: <TrendingUp sx={{ fontSize: 24, color: '#8b5cf6' }} />, text: 'Savings rate reached 28%, highest this year' },
    { icon: <CheckCircle sx={{ fontSize: 24, color: '#ec4899' }} />, text: 'Emergency fund now covers 5+ months' },
  ];

  if (!month) {
    return (
      <Typography variant="body2" color="textSecondary">
        Please select a month from the Financial Timeline to view AI insights.
      </Typography>
    );
  }

  return (
    <Box>
      <Typography variant="h5" sx={{ fontWeight: 700, mb: 3 }}>
        AI-Generated Insights
      </Typography>
      <Typography variant="body2" color="textSecondary" sx={{ mb: 4 }}>
        {new Date(month.year, month.month - 1).toLocaleDateString('en-US', {
          month: 'long',
          year: 'numeric',
        })}
      </Typography>

      <Grid container spacing={2}>
        {insights.map((insight, index) => (
          <Grid item xs={12} md={6} key={index}>
            <Card
              sx={{
                p: 3,
                display: 'flex',
                gap: 2,
                background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.05) 0%, rgba(118, 75, 162, 0.05) 100%)',
                border: '1px solid rgba(102, 126, 234, 0.2)',
              }}
            >
              <Box sx={{ flexShrink: 0 }}>{insight.icon}</Box>
              <Typography variant="body2" sx={{ fontWeight: 500 }}>
                {insight.text}
              </Typography>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Detailed Analysis */}
      <Card sx={{ mt: 4, p: 3 }}>
        <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 2 }}>
          📊 Detailed Analysis
        </Typography>
        <Typography variant="body2" color="textSecondary">
          AI analysis shows your financial behavior this month. Based on historical data, we identify trends, patterns,
          and opportunities for optimization.
        </Typography>
      </Card>
    </Box>
  );
};

export default AIInsights;
