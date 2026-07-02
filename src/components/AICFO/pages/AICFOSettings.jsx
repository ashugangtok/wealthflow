import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Switch,
  FormControlLabel,
  TextField,
  Button,
  Divider,
  Grid,
  MenuItem,
} from '@mui/material';

const AICFOSettings = () => {
  const [settings, setSettings] = useState({
    autoAnalyze: true,
    emailReports: true,
    monthlyNotifications: true,
    anomalyAlerts: true,
    financialYear: 'april',
    exportFormat: 'pdf',
    dataRetention: '5years',
    aiLearning: true,
  });

  const handleChange = (key, value) => {
    setSettings({ ...settings, [key]: value });
  };

  const handleSave = () => {
    console.log('Settings saved:', settings);
  };

  return (
    <Box>
      <Typography variant="h5" sx={{ fontWeight: 700, mb: 3 }}>
        AI CFO Settings
      </Typography>

      {/* General Settings */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 2 }}>
            General Settings
          </Typography>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <FormControlLabel
              control={<Switch checked={settings.autoAnalyze} onChange={(e) => handleChange('autoAnalyze', e.target.checked)} />}
              label="Automatically analyze uploaded documents"
            />
            <FormControlLabel
              control={<Switch checked={settings.emailReports} onChange={(e) => handleChange('emailReports', e.target.checked)} />}
              label="Email me monthly financial reports"
            />
            <FormControlLabel
              control={<Switch checked={settings.monthlyNotifications} onChange={(e) => handleChange('monthlyNotifications', e.target.checked)} />}
              label="Send monthly financial notifications"
            />
            <FormControlLabel
              control={<Switch checked={settings.anomalyAlerts} onChange={(e) => handleChange('anomalyAlerts', e.target.checked)} />}
              label="Alert me on unusual spending patterns"
            />
          </Box>
        </CardContent>
      </Card>

      {/* Financial Settings */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 2 }}>
            Financial Settings
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                select
                label="Financial Year"
                value={settings.financialYear}
                onChange={(e) => handleChange('financialYear', e.target.value)}
              >
                <MenuItem value="january">January - December</MenuItem>
                <MenuItem value="april">April - March (India)</MenuItem>
                <MenuItem value="july">July - June</MenuItem>
              </TextField>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                select
                label="Export Format"
                value={settings.exportFormat}
                onChange={(e) => handleChange('exportFormat', e.target.value)}
              >
                <MenuItem value="pdf">PDF</MenuItem>
                <MenuItem value="xlsx">Excel</MenuItem>
                <MenuItem value="csv">CSV</MenuItem>
              </TextField>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Data & Privacy */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 2 }}>
            Data & Privacy
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                select
                label="Data Retention"
                value={settings.dataRetention}
                onChange={(e) => handleChange('dataRetention', e.target.value)}
              >
                <MenuItem value="1year">1 Year</MenuItem>
                <MenuItem value="3years">3 Years</MenuItem>
                <MenuItem value="5years">5 Years</MenuItem>
                <MenuItem value="unlimited">Unlimited</MenuItem>
              </TextField>
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControlLabel
                control={<Switch checked={settings.aiLearning} onChange={(e) => handleChange('aiLearning', e.target.checked)} />}
                label="Allow AI to learn from patterns"
                sx={{ mt: 1 }}
              />
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Custom Categories */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 2 }}>
            Custom Categories
          </Typography>
          <Typography variant="body2" color="textSecondary" sx={{ mb: 2 }}>
            Create custom expense categories for better expense categorization
          </Typography>
          <Button variant="outlined">Manage Categories</Button>
        </CardContent>
      </Card>

      {/* Merchant Rules */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 2 }}>
            Merchant Rules
          </Typography>
          <Typography variant="body2" color="textSecondary" sx={{ mb: 2 }}>
            Set custom rules for how transactions are categorized
          </Typography>
          <Button variant="outlined">Manage Rules</Button>
        </CardContent>
      </Card>

      <Divider sx={{ my: 3 }} />

      {/* Save Button */}
      <Box sx={{ display: 'flex', gap: 2 }}>
        <Button
          variant="contained"
          onClick={handleSave}
          sx={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}
        >
          Save Settings
        </Button>
        <Button variant="outlined">Reset to Defaults</Button>
      </Box>
    </Box>
  );
};

export default AICFOSettings;
