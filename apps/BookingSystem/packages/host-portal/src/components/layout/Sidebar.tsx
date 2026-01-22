import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  Box,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
  Divider,
  Avatar,
  useTheme,
} from '@mui/material';
import {
  Dashboard,
  Home,
  CalendarMonth,
  BookOnline,
  AttachMoney,
  Message,
  Star,
  Person,
  Logout,
} from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../contexts/AuthContext';

interface SidebarProps {
  open: boolean;
  onClose: () => void;
  isMobile: boolean;
  width: number;
}

const Sidebar: React.FC<SidebarProps> = ({ open, onClose, isMobile, width }) => {
  const { t } = useTranslation();
  const theme = useTheme();
  const location = useLocation();
  const navigate = useNavigate();
  const { host, logout } = useAuth();

  const menuItems = [
    { path: '/', icon: <Dashboard />, label: t('host:navigation.dashboard') },
    { path: '/listings', icon: <Home />, label: t('host:navigation.listings') },
    { path: '/calendar', icon: <CalendarMonth />, label: t('host:navigation.calendar') },
    { path: '/bookings', icon: <BookOnline />, label: t('host:navigation.bookings') },
    { path: '/earnings', icon: <AttachMoney />, label: t('host:navigation.earnings') },
    { path: '/messages', icon: <Message />, label: t('host:navigation.messages') },
    { path: '/reviews', icon: <Star />, label: t('host:navigation.reviews') },
  ];

  const handleNavigate = (path: string) => {
    navigate(path);
    if (isMobile) {
      onClose();
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isCollapsed = width < 200;

  const drawerContent = (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        backgroundColor: 'background.paper',
      }}
    >
      {/* Logo */}
      <Box
        sx={{
          p: 2,
          display: 'flex',
          alignItems: 'center',
          justifyContent: isCollapsed ? 'center' : 'flex-start',
          minHeight: 64,
        }}
      >
        <Typography
          variant="h6"
          sx={{
            color: 'primary.main',
            fontWeight: 700,
            cursor: 'pointer',
          }}
          onClick={() => handleNavigate('/')}
        >
          {isCollapsed ? 'S' : 'StayGCC Host'}
        </Typography>
      </Box>

      <Divider />

      {/* Host Profile */}
      {!isCollapsed && (
        <Box
          sx={{
            p: 2,
            display: 'flex',
            alignItems: 'center',
            gap: 2,
            cursor: 'pointer',
          }}
          onClick={() => handleNavigate('/profile')}
        >
          <Avatar src={host?.profileImage} alt={host?.firstNameEn}>
            {host?.firstNameEn?.charAt(0)}
          </Avatar>
          <Box>
            <Typography variant="subtitle2" fontWeight={600}>
              {host?.firstNameEn} {host?.lastNameEn}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {host?.isSuperhost ? t('host:superhost') : t('host:host')}
            </Typography>
          </Box>
        </Box>
      )}

      {isCollapsed && (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 2 }}>
          <Avatar
            src={host?.profileImage}
            alt={host?.firstNameEn}
            sx={{ cursor: 'pointer' }}
            onClick={() => handleNavigate('/profile')}
          >
            {host?.firstNameEn?.charAt(0)}
          </Avatar>
        </Box>
      )}

      <Divider />

      {/* Navigation */}
      <List sx={{ flex: 1, py: 1 }}>
        {menuItems.map((item) => (
          <ListItem key={item.path} disablePadding>
            <ListItemButton
              onClick={() => handleNavigate(item.path)}
              selected={location.pathname === item.path}
              sx={{
                minHeight: 48,
                justifyContent: isCollapsed ? 'center' : 'flex-start',
                px: isCollapsed ? 2 : 3,
                '&.Mui-selected': {
                  backgroundColor: 'primary.lighter',
                  borderRight: `3px solid ${theme.palette.primary.main}`,
                  '&:hover': {
                    backgroundColor: 'primary.lighter',
                  },
                },
              }}
            >
              <ListItemIcon
                sx={{
                  minWidth: isCollapsed ? 0 : 40,
                  color: location.pathname === item.path ? 'primary.main' : 'text.secondary',
                }}
              >
                {item.icon}
              </ListItemIcon>
              {!isCollapsed && (
                <ListItemText
                  primary={item.label}
                  primaryTypographyProps={{
                    fontWeight: location.pathname === item.path ? 600 : 400,
                    color: location.pathname === item.path ? 'primary.main' : 'text.primary',
                  }}
                />
              )}
            </ListItemButton>
          </ListItem>
        ))}
      </List>

      <Divider />

      {/* Bottom Actions */}
      <List>
        <ListItem disablePadding>
          <ListItemButton
            onClick={() => handleNavigate('/profile')}
            sx={{
              minHeight: 48,
              justifyContent: isCollapsed ? 'center' : 'flex-start',
              px: isCollapsed ? 2 : 3,
            }}
          >
            <ListItemIcon sx={{ minWidth: isCollapsed ? 0 : 40 }}>
              <Person />
            </ListItemIcon>
            {!isCollapsed && <ListItemText primary={t('host:navigation.profile')} />}
          </ListItemButton>
        </ListItem>
        <ListItem disablePadding>
          <ListItemButton
            onClick={handleLogout}
            sx={{
              minHeight: 48,
              justifyContent: isCollapsed ? 'center' : 'flex-start',
              px: isCollapsed ? 2 : 3,
            }}
          >
            <ListItemIcon sx={{ minWidth: isCollapsed ? 0 : 40, color: 'error.main' }}>
              <Logout />
            </ListItemIcon>
            {!isCollapsed && (
              <ListItemText
                primary={t('common:actions.logout')}
                primaryTypographyProps={{ color: 'error.main' }}
              />
            )}
          </ListItemButton>
        </ListItem>
      </List>
    </Box>
  );

  if (isMobile) {
    return (
      <Drawer
        variant="temporary"
        open={open}
        onClose={onClose}
        ModalProps={{ keepMounted: true }}
        sx={{
          '& .MuiDrawer-paper': {
            width: 280,
            boxSizing: 'border-box',
          },
        }}
      >
        {drawerContent}
      </Drawer>
    );
  }

  return (
    <Drawer
      variant="permanent"
      sx={{
        '& .MuiDrawer-paper': {
          width,
          boxSizing: 'border-box',
          borderRight: '1px solid',
          borderColor: 'divider',
          transition: theme.transitions.create(['width'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
          }),
        },
      }}
    >
      {drawerContent}
    </Drawer>
  );
};

export default Sidebar;
