import React from 'react';
import { Box, Card, Grid, Typography, Button, LinearProgress } from '@mui/material';
import { Download as DownloadIcon, Refresh as RefreshIcon } from '@mui/icons-material';
import { useAICFO } from '../../../context/AICFOContext';

const MonthlyReports = () => {
  const { currentMonth, months, reports } = useAICFO();
  const month = currentMonth ? months[currentMonth] : null;
  const report = currentMonth ? reports[currentMonth] : null;

  const sections = [
    { title: 'Executive Summary', icon: '📋' },
    { title: 'Income Summary', icon: '💵' },
    { title: 'Expense Summary', icon: '💸' },
    { title: 'Cash Flow', icon: '💰' },
    { title: 'Credit Card Analysis', icon: '💳' },
    { title: 'Savings', icon: '🏦' },
    { title: 'Financial Health Score', icon: '⭐' },
    { title: 'Recommendations', icon: '💡' },
  ];

  if (!month) {
    return (
      <Typography variant="body2" color="textSecondary">
        Please select a month from the Financial Timeline to view reports.
      </Typography>
    );
  }

  return (
    <Box>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Box>
          <Typography variant="h5" sx={{ fontWeight: 700, mb: 1 }}>
            Monthly Financial Report
          </Typography>
          <Typography variant="body2" color="textSecondary">
            {new Date(month.year, month.month - 1).toLocaleDateString('en-US', {
              month: 'long',
              year: 'numeric',
            })}
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button
            variant="outlined"
            startIcon={<RefreshIcon />}
            disabled={month.status !== 'complete'}
          >
            Regenerate
          </Button>
          <Button
            variant="contained"
            startIcon={<DownloadIcon />}
            disabled={!report}
            sx={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}
          >
            Export PDF
          </Button>
        </Box>
      </Box>

      {month.status !== 'complete' && (
        <Card sx={{ mb: 3, p: 3, background: 'rgba(245, 158, 11, 0.1)' }}>
          <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 2 }}>
            ⏳ Processing Documents
          </Typography>
          <LinearProgress variant="determinate" value={60} sx={{ mb: 2 }} />
          <Typography variant="caption" color="textSecondary">
            AI is analyzing your financial documents. This typically takes 2-3 minutes.
          </Typography>
        </Card>
      )}

      {/* Report Sections */}
      <Grid container spacing={3}>
        {sections.map((section, index) => (
          <Grid item xs={12} md={6} key={index}>
            <Card
              sx={{
                p: 3,
                background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.05) 0%, rgba(118, 75, 162, 0.05) 100%)',
                border: '1px solid rgba(102, 126, 234, 0.2)',
              }}
            >
              <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 2 }}>
                {section.icon} {section.title}
              </Typography>
              <Box sx={{ mb: 2, p: 2, background: 'rgba(255, 255, 255, 0.5)', borderRadius: 1, minHeight: 80 }}>
                {report ? (
                  <Typography variant="caption" color="textSecondary">
                    Report data will appear here once processing is complete
                  </Typography>
                ) : (
                  <Typography variant="caption" color="textSecondary">
                    Upload documents to generate this section
                  </Typography>
                )}
              </Box>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Report Summary Card */}
      <Card sx={{ mt: 4, p: 3, background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white' }}>
        <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>
          📊 Report Summary
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6} md={3}>
            <Box>
              <Typography variant="caption" sx={{ opacity: 0.9 }}>
                Total Income
              </Typography>
              <Typography variant="h6" sx={{ fontWeight: 700, mt: 0.5 }}>
                ₹--
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Box>
              <Typography variant="caption" sx={{ opacity: 0.9 }}>
                Total Expenses
              </Typography>
              <Typography variant="h6" sx={{ fontWeight: 700, mt: 0.5 }}>
                ₹--
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Box>
              <Typography variant="caption" sx={{ opacity: 0.9 }}>
                Net Savings
              </Typography>
              <Typography variant="h6" sx={{ fontWeight: 700, mt: 0.5 }}>
                ₹--
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Box>
              <Typography variant="caption" sx={{ opacity: 0.9 }}>
                Financial Health
              </Typography>
              <Typography variant="h6" sx={{ fontWeight: 700, mt: 0.5 }}>
                --/100
              </Typography>
            </Box>
          </Grid>
        </Grid>
      </Card>
    </Box>
  );
};

export default MonthlyReports;
