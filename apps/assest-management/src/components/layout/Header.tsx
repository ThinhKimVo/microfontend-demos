import React, { useState } from 'react';
import {
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  Box,
  Avatar,
  Menu,
  MenuItem,
  ListItemIcon,
  Divider,
  Badge,
} from '@mui/material';
import {
  Menu as MenuIcon,
  Notifications as NotificationsIcon,
  Person as PersonIcon,
  Logout as LogoutIcon,
} from '@mui/icons-material';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

const DRAWER_WIDTH = 260;

interface HeaderProps {
  onMenuClick: () => void;
  title?: string;
}

function Header({ onMenuClick, title = 'Dashboard' }: HeaderProps) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = async () => {
    handleMenuClose();
    await logout();
    navigate('/login');
  };

  const getInitials = (name: string | null | undefined) => {
    if (!name) return 'U';
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <AppBar
      position="fixed"
      elevation={0}
      sx={{
        // Responsive width: full width on mobile/tablet, adjusted for sidebar on desktop
        width: { xs: '100%', md: `calc(100% - ${DRAWER_WIDTH}px)` },
        ml: { xs: 0, md: `${DRAWER_WIDTH}px` },
        bgcolor: 'background.paper',
        color: 'text.primary',
        borderBottom: '1px solid',
        borderColor: 'divider',
      }}
    >
      <Toolbar 
        sx={{ 
          // Responsive padding
          px: { xs: 1.5, sm: 2, md: 3 },
          minHeight: { xs: 56, sm: 64 },
        }}
      >
        <IconButton
          edge="start"
          color="inherit"
          onClick={onMenuClick}
          sx={{ 
            mr: { xs: 1, sm: 2 }, 
            // Show menu button on mobile and tablet
            display: { xs: 'flex', md: 'none' } 
          }}
        >
          <MenuIcon />
        </IconButton>

        <Typography 
          variant="h6" 
          component="h1" 
          fontWeight={600} 
          sx={{ 
            flexGrow: 1,
            // Responsive font size
            fontSize: { xs: '1rem', sm: '1.125rem', md: '1.25rem' },
            // Truncate long titles on mobile
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
          }}
        >
          {title}
        </Typography>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: { xs: 0.5, sm: 1 } }}>
          <IconButton 
            color="inherit"
            sx={{ 
              // Slightly smaller on mobile
              p: { xs: 0.75, sm: 1 } 
            }}
          >
            <Badge badgeContent={3} color="error">
              <NotificationsIcon sx={{ fontSize: { xs: 22, sm: 24 } }} />
            </Badge>
          </IconButton>

          <IconButton 
            onClick={handleMenuOpen} 
            sx={{ 
              p: 0, 
              ml: { xs: 0.5, sm: 1 } 
            }}
          >
            <Avatar
              sx={{
                // Responsive avatar size
                width: { xs: 32, sm: 36 },
                height: { xs: 32, sm: 36 },
                bgcolor: 'primary.main',
                fontSize: { xs: '0.75rem', sm: '0.875rem' },
              }}
              src={user?.photoURL || undefined}
            >
              {getInitials(user?.displayName)}
            </Avatar>
          </IconButton>
        </Box>

        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleMenuClose}
          onClick={handleMenuClose}
          transformOrigin={{ horizontal: 'right', vertical: 'top' }}
          anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
          PaperProps={{
            elevation: 2,
            sx: { minWidth: 200, mt: 1 },
          }}
        >
          <Box sx={{ px: 2, py: 1.5 }}>
            <Typography variant="subtitle2" fontWeight={600}>
              {user?.displayName || 'User'}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {user?.email}
            </Typography>
          </Box>

          <Divider />

          <MenuItem onClick={handleMenuClose}>
            <ListItemIcon>
              <PersonIcon fontSize="small" />
            </ListItemIcon>
            Profile
          </MenuItem>

          <Divider />

          <MenuItem onClick={handleLogout}>
            <ListItemIcon>
              <LogoutIcon fontSize="small" />
            </ListItemIcon>
            Logout
          </MenuItem>
        </Menu>
      </Toolbar>
    </AppBar>
  );
}

export default Header;
