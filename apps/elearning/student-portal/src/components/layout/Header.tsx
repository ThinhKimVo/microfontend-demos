import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import {
  AppBar,
  Toolbar,
  Box,
  Typography,
  Button,
  IconButton,
  Badge,
  Avatar,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Divider,
  InputBase,
  Paper,
  useMediaQuery,
  useTheme,
  Drawer,
  List,
  ListItemButton,
  alpha,
} from '@mui/material';
import {
  Search as SearchIcon,
  ShoppingCart as CartIcon,
  Favorite as FavoriteIcon,
  Notifications as NotificationsIcon,
  Person as PersonIcon,
  Dashboard as DashboardIcon,
  School as SchoolIcon,
  CardMembership as CertificateIcon,
  Settings as SettingsIcon,
  Logout as LogoutIcon,
  Menu as MenuIcon,
  Explore as ExploreIcon,
  Close as CloseIcon,
  Message as MessageIcon,
  Home as HomeIcon,
} from '@mui/icons-material';
import { useAuth } from '../../App';
import { notifications as mockNotifications, cartItems } from '../../data/mockData';

export default function Header() {
  const theme = useTheme();
  const location = useLocation();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const navigate = useNavigate();
  const { user, isAuthenticated, logout } = useAuth();

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const unreadNotifications = mockNotifications.filter(n => !n.isRead).length;
  const cartCount = cartItems.length;

  const handleProfileMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleProfileMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    logout();
    handleProfileMenuClose();
    navigate('/');
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/explore?q=${encodeURIComponent(searchQuery.trim())}`);
      setMobileMenuOpen(false);
    }
  };

  const menuItems = [
    { label: 'Dashboard', icon: <DashboardIcon />, path: '/dashboard' },
    { label: 'My Courses', icon: <SchoolIcon />, path: '/my-courses' },
    { label: 'Messages', icon: <MessageIcon />, path: '/messages' },
    { label: 'Certificates', icon: <CertificateIcon />, path: '/certificates' },
    { label: 'Profile', icon: <PersonIcon />, path: '/profile' },
    { label: 'Settings', icon: <SettingsIcon />, path: '/settings' },
  ];

  const navItems = [
    { label: 'Home', icon: <HomeIcon />, path: '/' },
    { label: 'Explore', icon: <ExploreIcon />, path: '/explore' },
  ];

  const isActivePath = (path: string) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  return (
    <>
      <AppBar 
        position="fixed" 
        elevation={0}
        sx={{
          backdropFilter: 'blur(8px)',
          backgroundColor: alpha(theme.palette.background.paper, 0.95),
          borderBottom: '1px solid',
          borderColor: 'divider',
        }}
      >
        <Toolbar 
          sx={{ 
            gap: { xs: 1, sm: 1.5, md: 2 },
            px: { xs: 2, sm: 3, md: 4 },
            minHeight: { xs: 60, sm: 70 },
            justifyContent: 'space-between',
          }}
        >
          {/* Left Section: Menu + Logo + Nav */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: { xs: 1, sm: 1.5 }, flexShrink: 0 }}>
            {isMobile && (
              <IconButton 
                edge="start" 
                onClick={() => setMobileMenuOpen(true)}
                sx={{ 
                  color: 'text.primary',
                  '&:hover': { bgcolor: alpha(theme.palette.primary.main, 0.08) }
                }}
              >
                <MenuIcon />
              </IconButton>
            )}

            {/* Logo */}
            <Link to="/" style={{ textDecoration: 'none', color: 'inherit' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Box
                  sx={{
                    width: { xs: 36, sm: 38 },
                    height: { xs: 36, sm: 38 },
                    borderRadius: 2,
                    bgcolor: 'primary.main',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: '0 2px 8px rgba(37, 99, 235, 0.25)',
                  }}
                >
                  <SchoolIcon sx={{ color: 'white', fontSize: { xs: 22, sm: 22 } }} />
                </Box>
                {!isMobile && (
                  <Typography variant="h6" fontWeight={800} color="primary.main" letterSpacing="-0.02em">
                    EduLearn
                  </Typography>
                )}
              </Box>
            </Link>

            {/* Navigation Links - Desktop */}
            {!isMobile && (
              <Box sx={{ display: 'flex', gap: 0.5, ml: 2 }}>
                {navItems.map((item) => (
                  <Button
                    key={item.path}
                    component={Link}
                    to={item.path}
                    startIcon={item.icon}
                    size="small"
                    sx={{ 
                      color: isActivePath(item.path) ? 'primary.main' : 'text.secondary',
                      bgcolor: isActivePath(item.path) ? alpha(theme.palette.primary.main, 0.08) : 'transparent',
                      fontWeight: isActivePath(item.path) ? 600 : 500,
                      px: 1.5,
                      py: 0.75,
                      fontSize: '0.875rem',
                      '&:hover': {
                        bgcolor: alpha(theme.palette.primary.main, 0.08),
                        color: 'primary.main',
                      }
                    }}
                  >
                    {item.label}
                  </Button>
                ))}
              </Box>
            )}
          </Box>

          {/* Center Section: Search Bar - Desktop/Tablet only */}
          {!isMobile && (
            <Paper
              component="form"
              onSubmit={handleSearch}
              elevation={0}
              sx={{
                width: '100%',
                maxWidth: 480,
                display: 'flex',
                alignItems: 'center',
                px: 2,
                py: 0.75,
                bgcolor: alpha(theme.palette.grey[100], 0.8),
                borderRadius: 2,
                border: '1px solid',
                borderColor: 'transparent',
                transition: 'all 0.2s ease',
                '&:hover': {
                  bgcolor: 'grey.100',
                  borderColor: 'grey.200',
                },
                '&:focus-within': {
                  bgcolor: 'background.paper',
                  borderColor: 'primary.main',
                  boxShadow: `0 0 0 3px ${alpha(theme.palette.primary.main, 0.1)}`,
                },
              }}
            >
              <SearchIcon sx={{ color: 'grey.500', mr: 1, fontSize: 20 }} />
              <InputBase
                placeholder="Search for courses..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                sx={{ flex: 1, fontSize: '0.875rem' }}
              />
            </Paper>
          )}

          {/* Right Section: Action Icons */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: { xs: 0.5, sm: 1 }, flexShrink: 0 }}>
            {isAuthenticated ? (
              <>
                {!isMobile && (
                  <IconButton
                    component={Link}
                    to="/wishlist"
                    sx={{ 
                      color: 'text.secondary',
                      '&:hover': { color: 'error.main', bgcolor: alpha(theme.palette.error.main, 0.08) }
                    }}
                  >
                    <FavoriteIcon />
                  </IconButton>
                )}

                <IconButton
                  component={Link}
                  to="/cart"
                  sx={{ 
                    color: 'text.secondary',
                    '&:hover': { color: 'primary.main', bgcolor: alpha(theme.palette.primary.main, 0.08) }
                  }}
                >
                  <Badge 
                    badgeContent={cartCount} 
                    color="error"
                    sx={{
                      '& .MuiBadge-badge': {
                        fontSize: '0.7rem',
                        minWidth: 18,
                        height: 18,
                      }
                    }}
                  >
                    <CartIcon />
                  </Badge>
                </IconButton>

                <IconButton
                  component={Link}
                  to="/notifications"
                  sx={{ 
                    color: 'text.secondary',
                    '&:hover': { color: 'primary.main', bgcolor: alpha(theme.palette.primary.main, 0.08) }
                  }}
                >
                  <Badge 
                    badgeContent={unreadNotifications} 
                    color="error"
                    sx={{
                      '& .MuiBadge-badge': {
                        fontSize: '0.7rem',
                        minWidth: 18,
                        height: 18,
                      }
                    }}
                  >
                    <NotificationsIcon />
                  </Badge>
                </IconButton>

                <IconButton 
                  onClick={handleProfileMenuOpen} 
                  sx={{ 
                    ml: 0.5,
                    p: 0.5,
                    border: '2px solid',
                    borderColor: 'transparent',
                    '&:hover': { borderColor: 'primary.light' }
                  }}
                >
                  <Avatar
                    src={user?.avatar}
                    alt={`${user?.firstName} ${user?.lastName}`}
                    sx={{ 
                      width: 36, 
                      height: 36,
                      fontSize: '0.9rem',
                    }}
                  >
                    {user?.firstName?.[0]}
                  </Avatar>
                </IconButton>
              </>
            ) : (
              <>
                <Button 
                  component={Link} 
                  to="/login" 
                  sx={{ 
                    color: 'text.primary',
                    fontWeight: 500,
                    display: { xs: 'none', sm: 'inline-flex' }
                  }}
                >
                  Log In
                </Button>
                <Button 
                  component={Link} 
                  to="/register" 
                  variant="contained" 
                  sx={{ 
                    ml: 1,
                    px: { xs: 2, sm: 3 },
                  }}
                >
                  {isMobile ? 'Join' : 'Sign Up'}
                </Button>
              </>
            )}
          </Box>
        </Toolbar>
      </AppBar>

      {/* Profile Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleProfileMenuClose}
        onClick={handleProfileMenuClose}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
        PaperProps={{
          sx: { width: 240, mt: 1 },
        }}
      >
        <Box sx={{ px: 2, py: 1.5 }}>
          <Typography variant="subtitle1" fontWeight={600}>
            {user?.firstName} {user?.lastName}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {user?.email}
          </Typography>
        </Box>
        <Divider />
        {menuItems.map((item) => (
          <MenuItem key={item.path} component={Link} to={item.path}>
            <ListItemIcon>{item.icon}</ListItemIcon>
            <ListItemText>{item.label}</ListItemText>
          </MenuItem>
        ))}
        <Divider />
        <MenuItem onClick={handleLogout} sx={{ color: 'error.main' }}>
          <ListItemIcon>
            <LogoutIcon color="error" />
          </ListItemIcon>
          <ListItemText>Logout</ListItemText>
        </MenuItem>
      </Menu>

      {/* Mobile Drawer */}
      <Drawer
        anchor="left"
        open={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
        PaperProps={{ 
          sx: { 
            width: { xs: '85%', sm: 320 },
            maxWidth: 360,
          } 
        }}
      >
        <Box sx={{ p: 2.5, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <Box
              sx={{
                width: 36,
                height: 36,
                borderRadius: 2,
                bgcolor: 'primary.main',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <SchoolIcon sx={{ color: 'white', fontSize: 22 }} />
            </Box>
            <Typography variant="h6" fontWeight={800} color="primary.main">
              EduLearn
            </Typography>
          </Box>
          <IconButton 
            onClick={() => setMobileMenuOpen(false)}
            sx={{ 
              bgcolor: 'grey.100',
              '&:hover': { bgcolor: 'grey.200' }
            }}
          >
            <CloseIcon />
          </IconButton>
        </Box>
        
        {/* Mobile Search */}
        <Box sx={{ px: 2, pb: 2 }}>
          <Paper
            component="form"
            onSubmit={handleSearch}
            elevation={0}
            sx={{
              display: 'flex',
              alignItems: 'center',
              px: 2,
              py: 1.5,
              bgcolor: 'grey.100',
              borderRadius: 2,
            }}
          >
            <SearchIcon sx={{ color: 'grey.500', mr: 1.5, fontSize: 20 }} />
            <InputBase
              placeholder="Search for courses..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              sx={{ flex: 1, fontSize: '0.9375rem' }}
              fullWidth
            />
          </Paper>
        </Box>
        
        <Divider />
        
        <List sx={{ px: 1, py: 2 }}>
          <Typography variant="overline" color="text.secondary" sx={{ px: 2, mb: 1, display: 'block' }}>
            Browse
          </Typography>
          {navItems.map((item) => (
            <ListItemButton 
              key={item.path}
              component={Link} 
              to={item.path} 
              onClick={() => setMobileMenuOpen(false)}
              selected={isActivePath(item.path)}
              sx={{
                borderRadius: 2,
                mb: 0.5,
                '&.Mui-selected': {
                  bgcolor: alpha(theme.palette.primary.main, 0.1),
                  '&:hover': { bgcolor: alpha(theme.palette.primary.main, 0.15) },
                }
              }}
            >
              <ListItemIcon sx={{ minWidth: 44 }}>{item.icon}</ListItemIcon>
              <ListItemText 
                primary={item.label} 
                primaryTypographyProps={{ fontWeight: isActivePath(item.path) ? 600 : 400 }}
              />
            </ListItemButton>
          ))}
          
          {isAuthenticated && (
            <>
              <Divider sx={{ my: 2 }} />
              <Typography variant="overline" color="text.secondary" sx={{ px: 2, mb: 1, display: 'block' }}>
                My Account
              </Typography>
              {menuItems.map((item) => (
                <ListItemButton 
                  key={item.path} 
                  component={Link} 
                  to={item.path} 
                  onClick={() => setMobileMenuOpen(false)}
                  selected={isActivePath(item.path)}
                  sx={{
                    borderRadius: 2,
                    mb: 0.5,
                    '&.Mui-selected': {
                      bgcolor: alpha(theme.palette.primary.main, 0.1),
                      '&:hover': { bgcolor: alpha(theme.palette.primary.main, 0.15) },
                    }
                  }}
                >
                  <ListItemIcon sx={{ minWidth: 44 }}>{item.icon}</ListItemIcon>
                  <ListItemText 
                    primary={item.label}
                    primaryTypographyProps={{ fontWeight: isActivePath(item.path) ? 600 : 400 }}
                  />
                </ListItemButton>
              ))}
              <Divider sx={{ my: 2 }} />
              <ListItemButton 
                onClick={() => { handleLogout(); setMobileMenuOpen(false); }}
                sx={{ 
                  borderRadius: 2,
                  color: 'error.main',
                  '&:hover': { bgcolor: alpha(theme.palette.error.main, 0.08) }
                }}
              >
                <ListItemIcon sx={{ minWidth: 44, color: 'error.main' }}><LogoutIcon /></ListItemIcon>
                <ListItemText primary="Logout" />
              </ListItemButton>
            </>
          )}
          
          {!isAuthenticated && (
            <>
              <Divider sx={{ my: 2 }} />
              <Box sx={{ px: 1 }}>
                <Button 
                  component={Link} 
                  to="/login" 
                  fullWidth 
                  variant="outlined"
                  onClick={() => setMobileMenuOpen(false)}
                  sx={{ mb: 1.5 }}
                >
                  Log In
                </Button>
                <Button 
                  component={Link} 
                  to="/register" 
                  fullWidth 
                  variant="contained"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Sign Up
                </Button>
              </Box>
            </>
          )}
        </List>
      </Drawer>
    </>
  );
}
