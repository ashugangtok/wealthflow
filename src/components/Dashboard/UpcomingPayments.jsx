import React from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  List,
  ListItem,
  ListItemText,
  Chip,
  Box,
  Typography,
} from '@mui/material';
import { formatCurrency } from '../../utils/calculations';

const UpcomingPayments = ({ title, payments, type }) => {
  const getChipColor = (payment) => {
    if (payment.isOverdue) return 'error';
    if (payment.isDueSoon) return 'warning';
    return 'success';
  };

  const getStatusLabel = (payment) => {
    if (payment.isOverdue) return 'Overdue';
    if (payment.isDueSoon) return 'Due Soon';
    return `In ${payment.daysUntilDue} days`;
  };

  if (!payments || payments.length === 0) {
    return (
      <Card>
        <CardHeader title={title} />
        <CardContent>
          <Typography color="textSecondary" align="center">
            No upcoming payments
          </Typography>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader title={title} />
      <CardContent sx={{ p: 0 }}>
        <List>
          {payments.map((payment, index) => (
            <ListItem
              key={index}
              sx={{
                borderBottom: index !== payments.length - 1 ? '1px solid' : 'none',
                borderColor: 'divider',
                py: 2,
              }}
            >
              <ListItemText
                primary={
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>
                      {payment.cardName || payment.loanName || 'Payment'}
                    </Typography>
                    <Chip
                      label={getStatusLabel(payment)}
                      size="small"
                      color={getChipColor(payment)}
                      variant="outlined"
                    />
                  </Box>
                }
                secondary={
                  type === 'creditCard'
                    ? `Outstanding: ${formatCurrency(payment.outstandingBalance || 0)}`
                    : `EMI: ${formatCurrency(payment.emiAmount || 0)}`
                }
                secondaryTypographyProps={{ variant: 'caption' }}
                sx={{ py: 0.5 }}
              />
            </ListItem>
          ))}
        </List>
      </CardContent>
    </Card>
  );
};

export default UpcomingPayments;
