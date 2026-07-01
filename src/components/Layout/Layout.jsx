import React, { useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import {
  Box,
  Drawer,
  AppBar,
  Toolbar,
  List,
  ListItemIcon,
  ListItemText,
  IconButton,
  Typography,
  Avatar,
  Menu,
  MenuItem,
  Divider,
  Badge,
  Chip,
} from '@mui/material';
import {
  Dashboard as DashboardIcon,
  TrendingUp as IncomeIcon,
  ShoppingCart as ExpenseIcon,
  CreditCard as CreditCardIcon,
  
  Home as AssetIcon,
  AttachMoney as LiabilityIcon,
  Assessment as ReportIcon,
  Logout as LogoutIcon,
  Settings as SettingsIcon,
  Menu as MenuIcon,
  TrendingDown as BudgetIcon,
  Wallet as TransactionIcon,
  Notifications as AlertIcon,
  NotificationsActive as BellIcon,
  Favorite as GoalIcon,
  AccountBalance as AccountIcon,
  Close as CloseIcon,
  Receipt as BillsIcon,
  History as PaymentHistoryIcon,
} from '@mui/icons-material';
import ListItemButton from '@mui/material/ListItemButton';
import { useAuth } from '../../context/AuthContext';
import { useNotifications } from '../../context/NotificationsContext';
import FloatingActionMenu from '../FloatingActionMenu/FloatingActionMenu.jsx';

const DRAWER_WIDTH = 280;

const Layout = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [notificationAnchorEl, setNotificationAnchorEl] = useState(null);
  const { user, logout } = useAuth();
  const { notifications, unreadCount, markAsRead, clearNotification } = useNotifications();
  const navigate = useNavigate();

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleNotificationOpen = (event) => {
    setNotificationAnchorEl(event.currentTarget);
  };

  const handleNotificationClose = () => {
    setNotificationAnchorEl(null);
  };

  const handleNotificationClick = (id) => {
    markAsRead(id);
  };

  const getNotificationColor = (type) => {
    switch (type) {
      case 'success':
        return '#10B981';
      case 'error':
        return '#EF4444';
      case 'warning':
        return '#F59E0B';
      default:
        return '#3B82F6';
    }
  };

  const handleLogout = async () => {
    handleMenuClose();
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const menuItems = [
    { label: 'Dashboard', icon: <DashboardIcon />, path: '/dashboard' },
    { label: 'Budgets', icon: <BudgetIcon />, path: '/budgets' },
    { label: 'Goals', icon: <GoalIcon />, path: '/goals' },
    { label: 'Bank Accounts', icon: <AccountIcon />, path: '/bank-accounts' },
    { label: 'Bills', icon: <BillsIcon />, path: '/bills' },
    { label: 'Transactions', icon: <TransactionIcon />, path: '/transactions' },
    { label: 'Alerts', icon: <AlertIcon />, path: '/alerts' },
    { label: 'Income', icon: <IncomeIcon />, path: '/income' },
    { label: 'Expenses', icon: <ExpenseIcon />, path: '/expenses' },
    { label: 'Credit Cards', icon: <CreditCardIcon />, path: '/credit-cards' },
    { label: 'Assets', icon: <AssetIcon />, path: '/assets' },
    { label: 'Liabilities', icon: <LiabilityIcon />, path: '/liabilities' },
    { label: 'Payments', icon: <PaymentHistoryIcon />, path: '/liability-payments' },
    { label: 'Reports', icon: <ReportIcon />, path: '/reports' },
  ];

  const drawerContent = (
    <Box
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        background: 'linear-gradient(180deg, #111827 0%, #09090B 100%)',
        borderRight: '1px solid rgba(255, 255, 255, 0.1)',
      }}
    >
      <Box
        sx={{
          p: 3,
          textAlign: 'center',
          borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
          background: 'linear-gradient(135deg, #7C3AED 0%, #06B6D4 100%)',
        }}
      >
        <Typography variant="h6" sx={{ fontWeight: 700, color: 'white' }}>
          WEALTHFLOW
        </Typography>
        <Typography variant="caption" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
          One Dashboard. Every Rupee.
        </Typography>
      </Box>
      <List sx={{ flex: 1, p: 0 }}>
        {menuItems.map((item) => (
          <ListItemButton
            key={item.path}
            onClick={() => {
              navigate(item.path);
              setMobileOpen(false);
            }}
            aria-label={`Navigate to ${item.label}`}
            sx={{
              px: 2,
              py: 1.5,
              my: 0.5,
              mx: 1,
              height: 48,
              borderRadius: '12px',
              color: 'rgba(255, 255, 255, 0.7)',
              '&:hover': {
                backgroundColor: 'rgba(124, 58, 237, 0.2)',
                color: 'white',
                transform: 'translateX(4px)',
              },
              '&:focus-visible': {
                outline: '2px solid #7C3AED',
                outlineOffset: '2px',
              },
              transition: 'all 0.2s ease',
            }}
          >
            <ListItemIcon sx={{ color: 'inherit', minWidth: 40 }}>
              {item.icon}
            </ListItemIcon>
            <ListItemText primary={item.label} />
          </ListItemButton>
        ))}
      </List>
    </Box>
  );

  return (
    <Box sx={{ display: 'flex', height: '100vh', background: '#09090B', flexDirection: 'column' }}>
      {/* App Bar */}
      <AppBar
        position="sticky"
        sx={{
          zIndex: 100,
          background: 'linear-gradient(90deg, #7C3AED 0%, #06B6D4 100%)',
          boxShadow: '0 4px 20px rgba(124, 58, 237, 0.3)',
          top: 0,
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            edge="start"
            onClick={() => setMobileOpen(!mobileOpen)}
            sx={{ mr: 2, display: { sm: 'none' } }}
            aria-label="open navigation menu"
          >
            <MenuIcon />
          </IconButton>
          {/* Mobile: Show logo icon, Desktop: Hide (sidebar branding shows) */}
          <Box sx={{ display: { xs: 'flex', sm: 'none' }, alignItems: 'center', gap: 1, flex: 1 }}>
            <Wallet sx={{ fontSize: 24 }} />
            <Typography variant="h6" sx={{ fontWeight: 700 }}>WEALTHFLOW</Typography>
          </Box>
          <Box sx={{ display: { xs: 'none', sm: 'flex' }, flex: 1 }} />

          {/* Notification Bell */}
          <IconButton color="inherit" onClick={handleNotificationOpen}>
            <Badge badgeContent={unreadCount} color="error">
              <BellIcon />
            </Badge>
          </IconButton>

          {/* Notification Dropdown Menu */}
          <Menu
            anchorEl={notificationAnchorEl}
            open={Boolean(notificationAnchorEl)}
            onClose={handleNotificationClose}
            anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
            transformOrigin={{ vertical: 'top', horizontal: 'right' }}
            PaperProps={{
              sx: {
                backgroundColor: '#1F2937',
                color: 'white',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                minWidth: '400px',
                maxHeight: '500px',
                overflowY: 'auto',
              },
            }}
          >
            <Box sx={{ p: 2, borderBottom: '1px solid rgba(255, 255, 255, 0.1)' }}>
              <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                Notifications ({unreadCount} unread)
              </Typography>
            </Box>
            {notifications.length === 0 ? (
              <MenuItem disabled>
                <Typography variant="body2" color="textSecondary">
                  No notifications
                </Typography>
              </MenuItem>
            ) : (
              notifications.slice(0, 10).map((notif) => (
                <Box
                  key={notif.id}
                  sx={{
                    px: 2,
                    py: 1.5,
                    borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
                    backgroundColor: notif.read ? 'transparent' : 'rgba(124, 58, 237, 0.1)',
                    cursor: 'pointer',
                    '&:hover': {
                      backgroundColor: 'rgba(255, 255, 255, 0.05)',
                    },
                  }}
                  onClick={() => handleNotificationClick(notif.id)}
                >
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                    <Box sx={{ flex: 1 }}>
                      <Chip
                        label={notif.type.toUpperCase()}
                        size="small"
                        sx={{
                          backgroundColor: getNotificationColor(notif.type),
                          color: 'white',
                          fontWeight: 600,
                          fontSize: '0.65rem',
                          mb: 0.5,
                        }}
                      />
                      <Typography variant="body2" sx={{ fontWeight: notif.read ? 400 : 600 }}>
                        {notif.message}
                      </Typography>
                      <Typography
                        variant="caption"
                        sx={{
                          color: 'rgba(255, 255, 255, 0.5)',
                          display: 'block',
                          mt: 0.5,
                        }}
                      >
                        {new Date(notif.timestamp).toLocaleTimeString()}
                      </Typography>
                    </Box>
                    <IconButton
                      size="small"
                      onClick={(e) => {
                        e.stopPropagation();
                        clearNotification(notif.id);
                      }}
                      sx={{ ml: 1 }}
                    >
                      <CloseIcon fontSize="small" />
                    </IconButton>
                  </Box>
                </Box>
              ))
            )}
          </Menu>

          <IconButton color="inherit" onClick={handleMenuOpen}>
            <Avatar sx={{ width: 36, height: 36, backgroundColor: 'rgba(255, 255, 255, 0.3)' }}>
              {user?.email?.charAt(0).toUpperCase()}
            </Avatar>
          </IconButton>

          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleMenuClose}
            anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
            transformOrigin={{ vertical: 'top', horizontal: 'right' }}
            PaperProps={{
              sx: {
                backgroundColor: '#111827',
                color: 'white',
                border: '1px solid rgba(255, 255, 255, 0.1)',
              },
            }}
          >
            <MenuItem disabled sx={{ color: 'rgba(255, 255, 255, 0.6)' }}>
              <Typography variant="body2">{user?.email}</Typography>
            </MenuItem>
            <Divider sx={{ borderColor: 'rgba(255, 255, 255, 0.1)' }} />
            <MenuItem
              onClick={() => {
                navigate('/settings');
                handleMenuClose();
              }}
            >
              <SettingsIcon sx={{ mr: 1 }} /> Settings
            </MenuItem>
            <MenuItem onClick={handleLogout}>
              <LogoutIcon sx={{ mr: 1 }} /> Logout
            </MenuItem>
          </Menu>
        </Toolbar>
      </AppBar>

      {/* Body Container */}
      <Box sx={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
        {/* Sidebar Drawer - Desktop */}
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: 'none', sm: 'block' },
            width: DRAWER_WIDTH,
            flexShrink: 0,
            '& .MuiDrawer-paper': {
              width: DRAWER_WIDTH,
              boxSizing: 'border-box',
              position: 'relative',
              height: '100%',
              overflowY: 'auto',
            },
          }}
        >
          {drawerContent}
        </Drawer>

        {/* Mobile Drawer */}
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={() => setMobileOpen(false)}
          sx={{
            display: { xs: 'block', sm: 'none' },
            '& .MuiDrawer-paper': {
              backgroundColor: '#111827',
              width: DRAWER_WIDTH,
            },
          }}
        >
          {drawerContent}
        </Drawer>

        {/* Main Content */}
        <Box
          component="main"
          sx={{
            flex: 1,
            backgroundColor: '#09090B',
            background: 'linear-gradient(135deg, #09090B 0%, #111827 100%)',
            overflowY: 'auto',
            overflowX: 'hidden',
          }}
        >
          <Box sx={{ p: 3, minHeight: '100%' }}>
            <Outlet />
          </Box>
        </Box>
      </Box>

      {/* Floating Action Menu */}
      <FloatingActionMenu />
    </Box>
  );
};

export default Layout;
