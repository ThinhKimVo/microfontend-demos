import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  Badge,
  Menu,
  MenuItem,
  Box,
  Avatar,
  Divider,
  ListItemIcon,
  Button,
} from '@mui/material';
import {
  Menu as MenuIcon,
  Notifications,
  Language,
  Settings,
  Person,
  Logout,
  Add,
} from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../contexts/AuthContext';
import { useLocale } from '../../contexts/LocaleContext';

interface TopBarProps {
  onMenuToggle: () => void;
}

const TopBar: React.FC<TopBarProps> = ({ onMenuToggle }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { host, logout } = useAuth();
  const { toggleLanguage } = useLocale();

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [notificationAnchor, setNotificationAnchor] = useState<null | HTMLElement>(null);

  const handleProfileMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setNotificationAnchor(null);
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
    handleMenuClose();
  };

  const notifications = [
    { id: 1, message: t('host:notifications.newBooking'), time: '5m ago' },
    { id: 2, message: t('host:notifications.newMessage'), time: '1h ago' },
    { id: 3, message: t('host:notifications.newReview'), time: '2h ago' },
  ];

  return (
    <AppBar
      position="fixed"
      elevation={0}
      sx={{
        backgroundColor: 'background.paper',
        borderBottom: '1px solid',
        borderColor: 'divider',
        zIndex: (theme) => theme.zIndex.drawer + 1,
      }}
    >
      <Toolbar>
        <IconButton
          edge="start"
          color="inherit"
          onClick={onMenuToggle}
          sx={{ mr: 2, color: 'text.primary' }}
        >
          <MenuIcon />
        </IconButton>

        <Box sx={{ flex: 1 }} />

        {/* Add Listing Button */}
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={() => navigate('/listings/new')}
          sx={{ mr: 2, display: { xs: 'none', sm: 'flex' } }}
        >
          {t('host:actions.addListing')}
        </Button>

        {/* Language Toggle */}
        <IconButton onClick={toggleLanguage} sx={{ color: 'text.primary' }}>
          <Language />
        </IconButton>

        {/* Notifications */}
        <IconButton
          onClick={(e) => setNotificationAnchor(e.currentTarget)}
          sx={{ color: 'text.primary', mx: 1 }}
        >
          <Badge badgeContent={3} color="error">
            <Notifications />
          </Badge>
        </IconButton>
        <Menu
          anchorEl={notificationAnchor}
          open={Boolean(notificationAnchor)}
          onClose={handleMenuClose}
          PaperProps={{
            sx: { width: 320, mt: 1 },
          }}
          transformOrigin={{ horizontal: 'right', vertical: 'top' }}
          anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
        >
          <Box sx={{ px: 2, py: 1.5 }}>
            <Typography variant="subtitle1" fontWeight={600}>
              {t('host:notifications.title')}
            </Typography>
          </Box>
          <Divider />
          {notifications.map((notification) => (
            <MenuItem key={notification.id} onClick={handleMenuClose}>
              <Box>
                <Typography variant="body2">{notification.message}</Typography>
                <Typography variant="caption" color="text.secondary">
                  {notification.time}
                </Typography>
              </Box>
            </MenuItem>
          ))}
          <Divider />
          <MenuItem onClick={handleMenuClose} sx={{ justifyContent: 'center' }}>
            <Typography variant="body2" color="primary">
              {t('host:notifications.viewAll')}
            </Typography>
          </MenuItem>
        </Menu>

        {/* Profile Menu */}
        <IconButton onClick={handleProfileMenuOpen} sx={{ ml: 1 }}>
          <Avatar
            src={host?.profileImage}
            alt={host?.firstNameEn}
            sx={{ width: 36, height: 36 }}
          >
            {host?.firstNameEn?.charAt(0)}
          </Avatar>
        </IconButton>
        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleMenuClose}
          PaperProps={{
            sx: { width: 200, mt: 1 },
          }}
          transformOrigin={{ horizontal: 'right', vertical: 'top' }}
          anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
        >
          <Box sx={{ px: 2, py: 1.5 }}>
            <Typography variant="subtitle2" fontWeight={600}>
              {host?.firstNameEn} {host?.lastNameEn}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {host?.email}
            </Typography>
          </Box>
          <Divider />
          <MenuItem onClick={() => { navigate('/profile'); handleMenuClose(); }}>
            <ListItemIcon>
              <Person fontSize="small" />
            </ListItemIcon>
            {t('host:navigation.profile')}
          </MenuItem>
          <MenuItem onClick={handleMenuClose}>
            <ListItemIcon>
              <Settings fontSize="small" />
            </ListItemIcon>
            {t('host:navigation.settings')}
          </MenuItem>
          <Divider />
          <MenuItem onClick={handleLogout}>
            <ListItemIcon>
              <Logout fontSize="small" color="error" />
            </ListItemIcon>
            <Typography color="error">{t('common:actions.logout')}</Typography>
          </MenuItem>
        </Menu>
      </Toolbar>
    </AppBar>
  );
};

export default TopBar;
