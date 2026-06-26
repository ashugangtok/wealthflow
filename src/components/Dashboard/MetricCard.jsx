import React from 'react';
import { Card, CardContent, Box, Typography } from '@mui/material';

const MetricCard = ({ title, value, icon, color = 'primary', subtitle = '' }) => {
  const colorMap = {
    primary: '#1976d2',
    success: '#4caf50',
    error: '#f44336',
    warning: '#ff9800',
    info: '#2196f3',
  };

  return (
    <Card sx={{ height: '100%', borderRadius: 2 }}>
      <CardContent>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <Box>
            <Typography color="textSecondary" variant="body2" sx={{ mb: 1 }}>
              {title}
            </Typography>
            <Typography variant="h6" sx={{ fontWeight: 700, mb: 0.5 }}>
              {value}
            </Typography>
            {subtitle && (
              <Typography color="textSecondary" variant="caption">
                {subtitle}
              </Typography>
            )}
          </Box>
          <Box
            sx={{
              color: colorMap[color],
              opacity: 0.5,
              display: 'flex',
              alignItems: 'center',
            }}
          >
            {icon}
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
};

export default MetricCard;
