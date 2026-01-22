import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  BottomNavigation,
  BottomNavigationAction,
  Paper,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import {
  Search,
  Favorite,
  Luggage,
  Message,
  Person,
} from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../contexts/AuthContext';

const MobileNav: React.FC = () => {
  const { t } = useTranslation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated } = useAuth();

  // Only show on mobile
  if (!isMobile) {
    return null;
  }

  // Determine current value based on path
  const getCurrentValue = () => {
    const path = location.pathname;
    if (path === '/' || path.startsWith('/search')) return 'search';
    if (path.startsWith('/wishlists')) return 'wishlists';
    if (path.startsWith('/trips')) return 'trips';
    if (path.startsWith('/messages')) return 'messages';
    if (path.startsWith('/profile') || path.startsWith('/login') || path.startsWith('/register'))
      return 'profile';
    return 'search';
  };

  const handleChange = (_event: React.SyntheticEvent, newValue: string) => {
    switch (newValue) {
      case 'search':
        navigate('/');
        break;
      case 'wishlists':
        navigate(isAuthenticated ? '/wishlists' : '/login');
        break;
      case 'trips':
        navigate(isAuthenticated ? '/trips' : '/login');
        break;
      case 'messages':
        navigate(isAuthenticated ? '/messages' : '/login');
        break;
      case 'profile':
        navigate(isAuthenticated ? '/profile' : '/login');
        break;
    }
  };

  return (
    <Paper
      sx={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: theme.zIndex.appBar,
        borderTop: '1px solid',
        borderColor: 'divider',
      }}
      elevation={3}
    >
      <BottomNavigation value={getCurrentValue()} onChange={handleChange} showLabels>
        <BottomNavigationAction
          label={t('common:navigation.explore')}
          value="search"
          icon={<Search />}
          sx={{
            '&.Mui-selected': {
              color: 'primary.main',
            },
          }}
        />
        <BottomNavigationAction
          label={t('common:navigation.wishlists')}
          value="wishlists"
          icon={<Favorite />}
          sx={{
            '&.Mui-selected': {
              color: 'primary.main',
            },
          }}
        />
        <BottomNavigationAction
          label={t('common:navigation.trips')}
          value="trips"
          icon={<Luggage />}
          sx={{
            '&.Mui-selected': {
              color: 'primary.main',
            },
          }}
        />
        <BottomNavigationAction
          label={t('common:navigation.messages')}
          value="messages"
          icon={<Message />}
          sx={{
            '&.Mui-selected': {
              color: 'primary.main',
            },
          }}
        />
        <BottomNavigationAction
          label={t('common:navigation.profile')}
          value="profile"
          icon={<Person />}
          sx={{
            '&.Mui-selected': {
              color: 'primary.main',
            },
          }}
        />
      </BottomNavigation>
    </Paper>
  );
};

export default MobileNav;
