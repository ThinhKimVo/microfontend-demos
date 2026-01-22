import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  IconButton,
  Box,
  Menu,
  MenuItem,
  Avatar,
  Divider,
  ListItemIcon,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import {
  Menu as MenuIcon,
  Language as LanguageIcon,
  AccountCircle,
  Person,
  Favorite,
  Luggage,
  Message,
  Logout,
} from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../contexts/AuthContext';
import { useLocale } from '../../contexts/LocaleContext';

const Header: React.FC = () => {
  const { t } = useTranslation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const navigate = useNavigate();
  const { user, isAuthenticated, logout } = useAuth();
  const { language, toggleLanguage } = useLocale();

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [mobileMenuAnchor, setMobileMenuAnchor] = useState<null | HTMLElement>(null);

  const handleProfileMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setMobileMenuAnchor(null);
  };

  const handleMobileMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setMobileMenuAnchor(event.currentTarget);
  };

  const handleLogout = () => {
    logout();
    handleMenuClose();
    navigate('/');
  };

  const handleNavigate = (path: string) => {
    navigate(path);
    handleMenuClose();
  };

  return (
    <AppBar
      position="fixed"
      elevation={0}
      sx={{
        backgroundColor: 'background.paper',
        borderBottom: '1px solid',
        borderColor: 'divider',
      }}
    >
      <Toolbar sx={{ justifyContent: 'space-between' }}>
        {/* Logo */}
        <Typography
          variant="h6"
          component={Link}
          to="/"
          sx={{
            color: 'primary.main',
            textDecoration: 'none',
            fontWeight: 700,
            fontSize: { xs: '1.1rem', sm: '1.25rem' },
          }}
        >
          StayGCC
        </Typography>

        {/* Desktop Navigation */}
        {!isMobile && (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Button
              color="inherit"
              onClick={toggleLanguage}
              startIcon={<LanguageIcon />}
              sx={{ color: 'text.primary' }}
            >
              {language === 'en' ? 'العربية' : 'English'}
            </Button>

            {isAuthenticated ? (
              <>
                <IconButton
                  onClick={handleProfileMenuOpen}
                  sx={{
                    border: '1px solid',
                    borderColor: 'divider',
                    borderRadius: '24px',
                    p: 0.5,
                    '&:hover': {
                      backgroundColor: 'action.hover',
                    },
                  }}
                >
                  <MenuIcon sx={{ mr: 0.5, fontSize: '1.2rem' }} />
                  {user?.profileImage ? (
                    <Avatar
                      src={user.profileImage}
                      alt={user.firstNameEn}
                      sx={{ width: 30, height: 30 }}
                    />
                  ) : (
                    <AccountCircle sx={{ fontSize: '1.8rem', color: 'text.secondary' }} />
                  )}
                </IconButton>
                <Menu
                  anchorEl={anchorEl}
                  open={Boolean(anchorEl)}
                  onClose={handleMenuClose}
                  transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                  anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
                  PaperProps={{
                    sx: { minWidth: 200, mt: 1 },
                  }}
                >
                  <MenuItem onClick={() => handleNavigate('/profile')}>
                    <ListItemIcon>
                      <Person fontSize="small" />
                    </ListItemIcon>
                    {t('common:navigation.profile')}
                  </MenuItem>
                  <MenuItem onClick={() => handleNavigate('/trips')}>
                    <ListItemIcon>
                      <Luggage fontSize="small" />
                    </ListItemIcon>
                    {t('common:navigation.trips')}
                  </MenuItem>
                  <MenuItem onClick={() => handleNavigate('/wishlists')}>
                    <ListItemIcon>
                      <Favorite fontSize="small" />
                    </ListItemIcon>
                    {t('common:navigation.wishlists')}
                  </MenuItem>
                  <MenuItem onClick={() => handleNavigate('/messages')}>
                    <ListItemIcon>
                      <Message fontSize="small" />
                    </ListItemIcon>
                    {t('common:navigation.messages')}
                  </MenuItem>
                  <Divider />
                  <MenuItem onClick={handleLogout}>
                    <ListItemIcon>
                      <Logout fontSize="small" />
                    </ListItemIcon>
                    {t('common:actions.logout')}
                  </MenuItem>
                </Menu>
              </>
            ) : (
              <>
                <Button
                  color="inherit"
                  component={Link}
                  to="/login"
                  sx={{ color: 'text.primary' }}
                >
                  {t('common:actions.login')}
                </Button>
                <Button
                  variant="contained"
                  component={Link}
                  to="/register"
                  sx={{
                    borderRadius: '24px',
                    px: 3,
                  }}
                >
                  {t('common:actions.signUp')}
                </Button>
              </>
            )}
          </Box>
        )}

        {/* Mobile Navigation */}
        {isMobile && (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            <IconButton onClick={toggleLanguage} sx={{ color: 'text.primary' }}>
              <LanguageIcon />
            </IconButton>
            <IconButton onClick={handleMobileMenuOpen} sx={{ color: 'text.primary' }}>
              <MenuIcon />
            </IconButton>
            <Menu
              anchorEl={mobileMenuAnchor}
              open={Boolean(mobileMenuAnchor)}
              onClose={handleMenuClose}
              transformOrigin={{ horizontal: 'right', vertical: 'top' }}
              anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
              PaperProps={{
                sx: { minWidth: 200, mt: 1 },
              }}
            >
              {isAuthenticated ? (
                [
                  <MenuItem key="profile" onClick={() => handleNavigate('/profile')}>
                    <ListItemIcon>
                      <Person fontSize="small" />
                    </ListItemIcon>
                    {t('common:navigation.profile')}
                  </MenuItem>,
                  <MenuItem key="trips" onClick={() => handleNavigate('/trips')}>
                    <ListItemIcon>
                      <Luggage fontSize="small" />
                    </ListItemIcon>
                    {t('common:navigation.trips')}
                  </MenuItem>,
                  <MenuItem key="wishlists" onClick={() => handleNavigate('/wishlists')}>
                    <ListItemIcon>
                      <Favorite fontSize="small" />
                    </ListItemIcon>
                    {t('common:navigation.wishlists')}
                  </MenuItem>,
                  <MenuItem key="messages" onClick={() => handleNavigate('/messages')}>
                    <ListItemIcon>
                      <Message fontSize="small" />
                    </ListItemIcon>
                    {t('common:navigation.messages')}
                  </MenuItem>,
                  <Divider key="divider" />,
                  <MenuItem key="logout" onClick={handleLogout}>
                    <ListItemIcon>
                      <Logout fontSize="small" />
                    </ListItemIcon>
                    {t('common:actions.logout')}
                  </MenuItem>,
                ]
              ) : (
                [
                  <MenuItem key="login" onClick={() => handleNavigate('/login')}>
                    {t('common:actions.login')}
                  </MenuItem>,
                  <MenuItem key="register" onClick={() => handleNavigate('/register')}>
                    {t('common:actions.signUp')}
                  </MenuItem>,
                ]
              )}
            </Menu>
          </Box>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default Header;
