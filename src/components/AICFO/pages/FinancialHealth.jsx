import React from 'react';
import { Box, Card, Grid, Typography, LinearProgress } from '@mui/material';
import { CheckCircle, WarningAmber } from '@mui/icons-material';

const FinancialHealth = () => {
  const metrics = [
    { label: 'Savings Rate', value: 72, target: 80, color: '#10b981' },
    { label: 'Debt-to-Income', value: 15, target: 20, color: '#06b6d4' },
    { label: 'Emergency Fund', value: 65, target: 100, color: '#f59e0b' },
    { label: 'Investment Ratio', value: 45, target: 50, color: '#8b5cf6' },
  ];

  const strengths = [
    '💪 Strong savings discipline',
    '📈 Diversified income sources',
    '🎯 On-track with financial goals',
    '💳 Excellent credit utilization',
  ];

  const improvements = [
    '⚠️ Increase emergency fund to 6 months',
    '📊 Reduce subscription expenses by 15%',
    '🎓 Consider investing in education',
    '🏠 Plan for major expenses',
  ];

  return (
    <Box>
      <Typography variant="h5" sx={{ fontWeight: 700, mb: 4 }}>
        Financial Health Score
      </Typography>

      {/* Overall Score */}
      <Card sx={{ mb: 4, background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white', p: 4 }}>
        <Box sx={{ textAlign: 'center' }}>
          <Typography variant="h2" sx={{ fontWeight: 700, mb: 1 }}>
            78
          </Typography>
          <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
            Very Good
          </Typography>
          <Typography variant="body2" sx={{ opacity: 0.9 }}>
            Your financial health is strong. Keep up the good habits!
          </Typography>
        </Box>
      </Card>

      {/* Metrics */}
      <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>
        Key Metrics
      </Typography>
      <Grid container spacing={2} sx={{ mb: 4 }}>
        {metrics.map((metric, index) => (
          <Grid item xs={12} md={6} key={index}>
            <Card sx={{ p: 2.5 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
                  {metric.label}
                </Typography>
                <Typography variant="subtitle2" sx={{ fontWeight: 700, color: metric.color }}>
                  {metric.value}%
                </Typography>
              </Box>
              <LinearProgress variant="determinate" value={metric.value} sx={{ mb: 1 }} />
              <Typography variant="caption" color="textSecondary">
                Target: {metric.target}%
              </Typography>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Strengths & Improvements */}
      <Grid container spacing={2}>
        <Grid item xs={12} md={6}>
          <Card sx={{ p: 3 }}>
            <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
              <CheckCircle sx={{ fontSize: 20, color: '#10b981' }} />
              Strengths
            </Typography>
            <Box component="ul" sx={{ pl: 2 }}>
              {strengths.map((item, index) => (
                <Typography key={index} component="li" variant="body2" sx={{ mb: 1 }}>
                  {item}
                </Typography>
              ))}
            </Box>
          </Card>
        </Grid>
        <Grid item xs={12} md={6}>
          <Card sx={{ p: 3 }}>
            <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
              <WarningAmber sx={{ fontSize: 20, color: '#f59e0b' }} />
              Areas to Improve
            </Typography>
            <Box component="ul" sx={{ pl: 2 }}>
              {improvements.map((item, index) => (
                <Typography key={index} component="li" variant="body2" sx={{ mb: 1 }}>
                  {item}
                </Typography>
              ))}
            </Box>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default FinancialHealth;
