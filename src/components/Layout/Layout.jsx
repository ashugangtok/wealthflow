import React, { useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import {
  Box,
  AppBar,
  Toolbar,
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
  Logout as LogoutIcon,
  Settings as SettingsIcon,
  Menu as MenuIcon,
  TrendingDown as BudgetIcon,
  Wallet as TransactionIcon,
  Notifications as AlertIcon,
  NotificationsActive as BellIcon,
  AccountBalance as AccountIcon,
  Close as CloseIcon,
  ExpandMore as ExpandMoreIcon,
} from '@mui/icons-material';
import { useAuth } from '../../context/AuthContext';
import { useNotifications } from '../../context/NotificationsContext';
import FloatingActionMenu from '../FloatingActionMenu/FloatingActionMenu.jsx';

const Layout = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [notificationAnchorEl, setNotificationAnchorEl] = useState(null);
  const [navDropdowns, setNavDropdowns] = useState({});
  const { user, logout } = useAuth();
  const { notifications, unreadCount, markAsRead, clearNotification } = useNotifications();
  const navigate = useNavigate();

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleNavDropdown = (name, event) => {
    setNavDropdowns((prev) => ({
      ...prev,
      [name]: event.currentTarget,
    }));
  };

  const handleNavDropdownClose = (name) => {
    setNavDropdowns((prev) => ({
      ...prev,
      [name]: null,
    }));
  };

  const navigateTo = (path) => {
    navigate(path);
    setMobileOpen(false);
    Object.keys(navDropdowns).forEach((key) => handleNavDropdownClose(key));
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

  const navMenu = [
    {
      label: 'Dashboard',
      icon: <DashboardIcon />,
      path: '/dashboard',
    },
    {
      label: 'Accounts',
      icon: <AccountIcon />,
      submenu: [
        { label: 'Bank Accounts', path: '/bank-accounts' },
        { label: 'Credit Cards', path: '/credit-cards' },
        { label: 'Assets', path: '/assets' },
        { label: 'Liabilities', path: '/liabilities' },
      ],
    },
    {
      label: 'Transactions',
      icon: <TransactionIcon />,
      submenu: [
        { label: 'Income', path: '/income' },
        { label: 'Expenses', path: '/expenses' },
        { label: 'Bills', path: '/bills' },
        { label: 'Payments', path: '/liability-payments' },
        { label: 'Bank Transfers', path: '/bank-transfers' },
        { label: 'Card Transfers', path: '/card-transfers' },
      ],
    },
    {
      label: 'Planning',
      icon: <BudgetIcon />,
      submenu: [
        { label: 'Budgets', path: '/budgets' },
        { label: 'Goals', path: '/goals' },
        { label: 'Reports', path: '/reports' },
      ],
    },
    {
      label: 'Tools',
      icon: <AlertIcon />,
      submenu: [
        { label: 'Alerts', path: '/alerts' },
        { label: 'Statements', path: '/statements' },
      ],
    },
  ];

  return (
    <Box sx={{ display: 'flex', height: '100vh', background: '#09090B', flexDirection: 'column' }}>
      {/* Top Navigation Bar */}
      <AppBar
        position="sticky"
        sx={{
          zIndex: 100,
          background: 'linear-gradient(90deg, #7C3AED 0%, #06B6D4 100%)',
          boxShadow: '0 4px 20px rgba(124, 58, 237, 0.3)',
          top: 0,
        }}
      >
        <Toolbar sx={{ display: 'flex', justifyContent: 'space-between', gap: 2 }}>
          {/* Mobile Menu Button + Brand */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <IconButton
              color="inherit"
              edge="start"
              onClick={() => setMobileOpen(!mobileOpen)}
              sx={{ display: { sm: 'none' } }}
              aria-label="open navigation menu"
            >
              <MenuIcon />
            </IconButton>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <TransactionIcon sx={{ fontSize: 24 }} />
              <Typography variant="h6" sx={{ fontWeight: 700 }}>WEALTHFLOW</Typography>
            </Box>
          </Box>

          {/* Desktop Navigation Menu */}
          <Box sx={{ display: { xs: 'none', sm: 'flex' }, gap: 0.5, flex: 1, alignItems: 'center' }}>
            {navMenu.map((item) => (
              <Box key={item.label}>
                <IconButton
                  color="inherit"
                  onClick={(e) => {
                    if (item.submenu) {
                      handleNavDropdown(item.label, e);
                    } else {
                      navigateTo(item.path);
                    }
                  }}
                  sx={{
                    textTransform: 'none',
                    fontSize: '0.95rem',
                    px: 1.5,
                    display: 'flex',
                    gap: 0.5,
                    alignItems: 'center',
                    '&:hover': {
                      backgroundColor: 'rgba(255, 255, 255, 0.15)',
                    },
                  }}
                >
                  {item.icon}
                  <Typography sx={{ fontWeight: 500 }}>{item.label}</Typography>
                  {item.submenu && <ExpandMoreIcon sx={{ fontSize: 16 }} />}
                </IconButton>

                {/* Dropdown Menu */}
                {item.submenu && (
                  <Menu
                    anchorEl={navDropdowns[item.label]}
                    open={Boolean(navDropdowns[item.label])}
                    onClose={() => handleNavDropdownClose(item.label)}
                    anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
                    transformOrigin={{ vertical: 'top', horizontal: 'left' }}
                    PaperProps={{
                      sx: {
                        backgroundColor: '#1F2937',
                        color: 'white',
                        border: '1px solid rgba(255, 255, 255, 0.1)',
                        minWidth: '180px',
                      },
                    }}
                  >
                    {item.submenu.map((subitem) => (
                      <MenuItem
                        key={subitem.path}
                        onClick={() => navigateTo(subitem.path)}
                      >
                        {subitem.label}
                      </MenuItem>
                    ))}
                  </Menu>
                )}
              </Box>
            ))}
          </Box>

          {/* Right Side: Notifications, Avatar, Menu */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
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

            {/* User Avatar Menu */}
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
          </Box>
        </Toolbar>

        {/* Mobile Navigation Menu */}
        {mobileOpen && (
          <Box sx={{ display: { sm: 'none' }, backgroundColor: 'rgba(0, 0, 0, 0.2)', borderTop: '1px solid rgba(255, 255, 255, 0.1)' }}>
            <Box sx={{ p: 2, display: 'flex', flexDirection: 'column', gap: 1 }}>
              {navMenu.map((item) => (
                <Box key={item.label}>
                  {item.submenu ? (
                    <>
                      <Typography
                        sx={{
                          fontWeight: 600,
                          fontSize: '0.9rem',
                          px: 1.5,
                          py: 1,
                          color: 'rgba(255, 255, 255, 0.8)',
                        }}
                      >
                        {item.label}
                      </Typography>
                      <Box sx={{ pl: 2 }}>
                        {item.submenu.map((subitem) => (
                          <Box
                            key={subitem.path}
                            onClick={() => navigateTo(subitem.path)}
                            sx={{
                              px: 1.5,
                              py: 0.75,
                              cursor: 'pointer',
                              borderRadius: '6px',
                              '&:hover': {
                                backgroundColor: 'rgba(255, 255, 255, 0.1)',
                              },
                            }}
                          >
                            <Typography sx={{ fontSize: '0.85rem' }}>
                              {subitem.label}
                            </Typography>
                          </Box>
                        ))}
                      </Box>
                    </>
                  ) : (
                    <Box
                      onClick={() => navigateTo(item.path)}
                      sx={{
                        px: 1.5,
                        py: 1,
                        cursor: 'pointer',
                        borderRadius: '6px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 1,
                        '&:hover': {
                          backgroundColor: 'rgba(255, 255, 255, 0.1)',
                        },
                      }}
                    >
                      {item.icon}
                      <Typography sx={{ fontWeight: 500, fontSize: '0.9rem' }}>
                        {item.label}
                      </Typography>
                    </Box>
                  )}
                </Box>
              ))}
            </Box>
          </Box>
        )}
      </AppBar>

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

      {/* Floating Action Menu */}
      <FloatingActionMenu />
    </Box>
  );
};

export default Layout;
