import { useState, useEffect } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import {
  Box,
  Drawer,
  AppBar,
  Toolbar,
  List,
  Typography,
  Divider,
  IconButton,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Avatar,
  Menu,
  MenuItem,
  Badge,
  Chip,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import {
  Menu as MenuIcon,
  Dashboard as DashboardIcon,
  School as CoursesIcon,
  People as StudentsIcon,
  BarChart as AnalyticsIcon,
  AttachMoney as EarningsIcon,
  Star as ReviewsIcon,
  Settings as SettingsIcon,
  Notifications as NotificationsIcon,
  Logout as LogoutIcon,
  Person as UsersIcon,
  Category as CategoryIcon,
  Receipt as TransactionsIcon,
  Payments as PayoutsIcon,
  LocalOffer as CouponsIcon,
  Support as SupportIcon,
  SupervisorAccount as TeachersIcon,
  SwapHoriz as SwitchIcon,
  Message as MessagesIcon,
} from '@mui/icons-material';
import { useAuth } from '../../App';
import { notifications } from '../../data/mockData';

const DRAWER_WIDTH = 260;

const teacherMenuItems = [
  { title: 'Dashboard', icon: DashboardIcon, path: '/teacher' },
  { title: 'My Courses', icon: CoursesIcon, path: '/teacher/courses' },
  { title: 'Students', icon: StudentsIcon, path: '/teacher/students' },
  { title: 'Messages', icon: MessagesIcon, path: '/teacher/messages' },
  { title: 'Analytics', icon: AnalyticsIcon, path: '/teacher/analytics' },
  { title: 'Earnings', icon: EarningsIcon, path: '/teacher/earnings' },
  { title: 'Reviews', icon: ReviewsIcon, path: '/teacher/reviews' },
  { title: 'Settings', icon: SettingsIcon, path: '/teacher/settings' },
];

const adminMenuItems = [
  { title: 'Dashboard', icon: DashboardIcon, path: '/admin' },
  { title: 'Users', icon: UsersIcon, path: '/admin/users' },
  { title: 'Teachers', icon: TeachersIcon, path: '/admin/teachers' },
  { title: 'Courses', icon: CoursesIcon, path: '/admin/courses' },
  { title: 'Categories', icon: CategoryIcon, path: '/admin/categories' },
  { title: 'Transactions', icon: TransactionsIcon, path: '/admin/transactions' },
  { title: 'Payouts', icon: PayoutsIcon, path: '/admin/payouts' },
  { title: 'Coupons', icon: CouponsIcon, path: '/admin/coupons' },
  { title: 'Support', icon: SupportIcon, path: '/admin/support' },
  { title: 'Settings', icon: SettingsIcon, path: '/admin/settings' },
];

export default function DashboardLayout() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const location = useLocation();
  const navigate = useNavigate();
  const { user, role, logout, switchRole } = useAuth();

  const [mobileOpen, setMobileOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [notifAnchorEl, setNotifAnchorEl] = useState<null | HTMLElement>(null);

  // Determine current section from URL and sync role
  const isAdminSection = location.pathname.startsWith('/admin');
  const currentRole = isAdminSection ? 'admin' : 'teacher';

  // Sync auth role with current route
  useEffect(() => {
    if (role !== currentRole) {
      switchRole(currentRole);
    }
  }, [currentRole, role, switchRole]);

  const menuItems = isAdminSection ? adminMenuItems : teacherMenuItems;
  const unreadNotifications = notifications.filter(n => !n.isRead).length;

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleProfileMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleProfileMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    logout();
    handleProfileMenuClose();
    navigate('/login');
  };

  const handleSwitchRole = () => {
    const newRole = currentRole === 'teacher' ? 'admin' : 'teacher';
    handleProfileMenuClose();
    navigate(newRole === 'admin' ? '/admin' : '/teacher');
  };

  const drawer = (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      {/* Logo */}
      <Box sx={{ p: 2, display: 'flex', alignItems: 'center', gap: 1.5 }}>
        <Box
          sx={{
            width: 40,
            height: 40,
            borderRadius: 1.5,
            bgcolor: 'primary.main',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <CoursesIcon sx={{ color: 'white', fontSize: 24 }} />
        </Box>
        <Box>
          <Typography variant="h6" fontWeight={700} color="primary.main">
            EduLearn
          </Typography>
          <Chip
            label={currentRole === 'admin' ? 'Admin' : 'Teacher'}
            size="small"
            color={currentRole === 'admin' ? 'error' : 'primary'}
            sx={{ height: 20, fontSize: '0.6875rem' }}
          />
        </Box>
      </Box>

      <Divider />

      {/* Menu Items */}
      <List sx={{ flex: 1, px: 1, py: 2 }}>
        {menuItems.map((item) => {
          const isActive = location.pathname === item.path ||
            (item.path !== '/teacher' && item.path !== '/admin' && location.pathname.startsWith(item.path));
          return (
            <ListItemButton
              key={item.path}
              component={Link}
              to={item.path}
              selected={isActive}
              onClick={() => isMobile && setMobileOpen(false)}
              sx={{ mb: 0.5 }}
            >
              <ListItemIcon sx={{ minWidth: 40 }}>
                <item.icon fontSize="small" />
              </ListItemIcon>
              <ListItemText primary={item.title} primaryTypographyProps={{ fontSize: '0.875rem' }} />
            </ListItemButton>
          );
        })}
      </List>

      {/* User Info */}
      <Box sx={{ p: 2, borderTop: '1px solid', borderColor: 'grey.200' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <Avatar src={user?.avatar} sx={{ width: 40, height: 40 }}>
            {user?.firstName?.[0]}
          </Avatar>
          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Typography variant="subtitle2" fontWeight={600} noWrap>
              {user?.firstName} {user?.lastName}
            </Typography>
            <Typography variant="caption" color="text.secondary" noWrap>
              {user?.email}
            </Typography>
          </Box>
        </Box>
      </Box>
    </Box>
  );

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      {/* App Bar */}
      <AppBar
        position="fixed"
        elevation={0}
        sx={{
          width: { md: `calc(100% - ${DRAWER_WIDTH}px)` },
          ml: { md: `${DRAWER_WIDTH}px` },
          bgcolor: 'white',
          borderBottom: '1px solid',
          borderColor: 'grey.200',
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { md: 'none' }, color: 'text.primary' }}
          >
            <MenuIcon />
          </IconButton>

          <Box sx={{ flex: 1 }} />

          {/* Notifications */}
          <IconButton
            onClick={(e) => setNotifAnchorEl(e.currentTarget)}
            sx={{ color: 'text.secondary' }}
          >
            <Badge badgeContent={unreadNotifications} color="error">
              <NotificationsIcon />
            </Badge>
          </IconButton>

          {/* Profile */}
          <IconButton onClick={handleProfileMenuOpen} sx={{ ml: 1 }}>
            <Avatar src={user?.avatar} sx={{ width: 36, height: 36 }}>
              {user?.firstName?.[0]}
            </Avatar>
          </IconButton>
        </Toolbar>
      </AppBar>

      {/* Profile Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleProfileMenuClose}
        PaperProps={{ sx: { width: 220, mt: 1 } }}
      >
        <Box sx={{ px: 2, py: 1.5 }}>
          <Typography variant="subtitle2" fontWeight={600}>
            {user?.firstName} {user?.lastName}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            {currentRole === 'admin' ? 'Administrator' : 'Teacher'}
          </Typography>
        </Box>
        <Divider />
        <MenuItem onClick={handleSwitchRole}>
          <ListItemIcon>
            <SwitchIcon fontSize="small" />
          </ListItemIcon>
          Switch to {currentRole === 'admin' ? 'Teacher' : 'Admin'}
        </MenuItem>
        <MenuItem onClick={handleLogout} sx={{ color: 'error.main' }}>
          <ListItemIcon>
            <LogoutIcon fontSize="small" color="error" />
          </ListItemIcon>
          Logout
        </MenuItem>
      </Menu>

      {/* Notifications Menu */}
      <Menu
        anchorEl={notifAnchorEl}
        open={Boolean(notifAnchorEl)}
        onClose={() => setNotifAnchorEl(null)}
        PaperProps={{ sx: { width: 320, maxHeight: 400 } }}
      >
        <Box sx={{ px: 2, py: 1.5, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="subtitle1" fontWeight={600}>
            Notifications
          </Typography>
          <Typography variant="caption" color="primary" sx={{ cursor: 'pointer' }}>
            Mark all read
          </Typography>
        </Box>
        <Divider />
        {notifications.slice(0, 5).map((notif) => (
          <MenuItem
            key={notif.id}
            onClick={() => setNotifAnchorEl(null)}
            sx={{ py: 1.5, bgcolor: notif.isRead ? 'transparent' : 'primary.light' }}
          >
            <Box>
              <Typography variant="body2" fontWeight={notif.isRead ? 400 : 600}>
                {notif.title}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {notif.message}
              </Typography>
            </Box>
          </MenuItem>
        ))}
      </Menu>

      {/* Drawer */}
      <Box component="nav" sx={{ width: { md: DRAWER_WIDTH }, flexShrink: { md: 0 } }}>
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{ keepMounted: true }}
          sx={{
            display: { xs: 'block', md: 'none' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: DRAWER_WIDTH },
          }}
        >
          {drawer}
        </Drawer>
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: 'none', md: 'block' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: DRAWER_WIDTH },
          }}
          open
        >
          {drawer}
        </Drawer>
      </Box>

      {/* Main Content */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: { xs: 2, md: 3 },
          width: { md: `calc(100% - ${DRAWER_WIDTH}px)` },
          mt: '64px',
          bgcolor: 'background.default',
          minHeight: 'calc(100vh - 64px)',
        }}
      >
        <Outlet />
      </Box>
    </Box>
  );
}
