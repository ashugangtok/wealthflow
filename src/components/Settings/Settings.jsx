import React from 'react';
import { Box, Card, CardContent, CardHeader, Button, Typography, Divider, Stack } from '@mui/material';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { useNavigate } from 'react-router-dom';
import LogoutIcon from '@mui/icons-material/Logout';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';

const Settings = () => {
  const { user, logout } = useAuth();
  const { isDarkMode, toggleTheme } = useTheme();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return (
    <Box>
      <Typography variant="h4" gutterBottom sx={{ mb: 3 }}>
        Settings
      </Typography>

      {/* Account Settings */}
      <Card sx={{ mb: 3 }}>
        <CardHeader title="Account Information" />
        <Divider />
        <CardContent>
          <Stack spacing={2}>
            <Box>
              <Typography variant="body2" color="textSecondary" gutterBottom>
                Email Address
              </Typography>
              <Typography variant="body1" sx={{ fontWeight: 600 }}>
                {user?.email}
              </Typography>
            </Box>

            {user?.displayName && (
              <Box>
                <Typography variant="body2" color="textSecondary" gutterBottom>
                  Display Name
                </Typography>
                <Typography variant="body1" sx={{ fontWeight: 600 }}>
                  {user.displayName}
                </Typography>
              </Box>
            )}

            <Box>
              <Typography variant="body2" color="textSecondary" gutterBottom>
                Account Created
              </Typography>
              <Typography variant="body1" sx={{ fontWeight: 600 }}>
                {user?.metadata?.creationTime
                  ? new Date(user.metadata.creationTime).toLocaleDateString()
                  : 'N/A'}
              </Typography>
            </Box>
          </Stack>
        </CardContent>
      </Card>

      {/* Appearance Settings */}
      <Card sx={{ mb: 3 }}>
        <CardHeader title="Appearance" />
        <Divider />
        <CardContent>
          <Stack spacing={2}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Box>
                <Typography variant="body1" sx={{ fontWeight: 600 }}>
                  Dark Mode
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  {isDarkMode ? 'Enabled' : 'Disabled'}
                </Typography>
              </Box>
              <Button
                variant="outlined"
                startIcon={isDarkMode ? <Brightness7Icon /> : <Brightness4Icon />}
                onClick={toggleTheme}
              >
                {isDarkMode ? 'Light Mode' : 'Dark Mode'}
              </Button>
            </Box>
          </Stack>
        </CardContent>
      </Card>

      {/* Data & Privacy */}
      <Card sx={{ mb: 3 }}>
        <CardHeader title="Data & Privacy" />
        <Divider />
        <CardContent>
          <Stack spacing={2}>
            <Box>
              <Typography variant="body2" color="textSecondary" gutterBottom>
                Data Storage
              </Typography>
              <Typography variant="body2">
                Your financial data is securely stored in Google's Firebase, a world-class cloud infrastructure.
                All data is encrypted in transit and at rest.
              </Typography>
            </Box>

            <Box>
              <Typography variant="body2" color="textSecondary" gutterBottom>
                Privacy
              </Typography>
              <Typography variant="body2">
                We do not share your financial information with any third parties. Your data is only accessible
                by you using your account credentials.
              </Typography>
            </Box>

            <Box>
              <Typography variant="body2" color="textSecondary" gutterBottom>
                Backup
              </Typography>
              <Typography variant="body2">
                Your data is automatically backed up daily by Firebase. You can recover your data at any time.
              </Typography>
            </Box>
          </Stack>
        </CardContent>
      </Card>

      {/* Account Actions */}
      <Card>
        <CardHeader title="Account Actions" />
        <Divider />
        <CardContent>
          <Stack spacing={2}>
            <Button
              variant="contained"
              color="error"
              startIcon={<LogoutIcon />}
              onClick={handleLogout}
              fullWidth
            >
              Logout
            </Button>
            <Typography variant="caption" color="textSecondary" align="center">
              You will be logged out from your account and redirected to the login page.
            </Typography>
          </Stack>
        </CardContent>
      </Card>

      {/* App Version */}
      <Box sx={{ mt: 4, textAlign: 'center' }}>
        <Typography variant="caption" color="textSecondary">
          Personal Finance Tracker v1.0.0
        </Typography>
      </Box>
    </Box>
  );
};

export default Settings;
