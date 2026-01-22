import React, { useState } from 'react'
import { Outlet, useNavigate, useLocation } from 'react-router-dom'
import {
  Box,
  Drawer,
  AppBar,
  Toolbar,
  Typography,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  IconButton,
  Avatar,
  Menu,
  MenuItem,
  Divider,
  Badge,
  Collapse,
  useTheme,
  useMediaQuery,
  Tooltip,
} from '@mui/material'
import {
  Dashboard as DashboardIcon,
  Business as BuildingIcon,
  Inventory2 as AssetIcon,
  Assignment as WorkOrderIcon,
  Event as PMIcon,
  Warehouse as InventoryIcon,
  Engineering as TechnicianIcon,
  Store as VendorIcon,
  SupportAgent as RequestIcon,
  Assessment as ReportIcon,
  Menu as MenuIcon,
  Notifications as NotificationIcon,
  AccountCircle as AccountIcon,
  ExpandLess,
  ExpandMore,
  Settings as SettingsIcon,
  Logout as LogoutIcon,
  ChevronLeft as ChevronLeftIcon,
  ChevronRight as ChevronRightIcon,
} from '@mui/icons-material'
import { APP_NAME, DRAWER_WIDTH_FULL, DRAWER_WIDTH_MINI } from '../utils/constants'

interface NavItem {
  title: string
  path: string
  icon: React.ReactNode
  children?: { title: string; path: string }[]
}

const navItems: NavItem[] = [
  { title: 'Dashboard', path: '/', icon: <DashboardIcon /> },
  { title: 'Facilities', path: '/facilities', icon: <BuildingIcon /> },
  { title: 'Assets', path: '/assets', icon: <AssetIcon /> },
  {
    title: 'Work Orders',
    path: '/work-orders',
    icon: <WorkOrderIcon />,
    children: [
      { title: 'All Work Orders', path: '/work-orders' },
      { title: 'Kanban Board', path: '/work-orders/kanban' },
    ],
  },
  { title: 'Preventive Maintenance', path: '/preventive-maintenance', icon: <PMIcon /> },
  { title: 'Inventory', path: '/inventory', icon: <InventoryIcon /> },
  { title: 'Technicians', path: '/technicians', icon: <TechnicianIcon /> },
  { title: 'Vendors', path: '/vendors', icon: <VendorIcon /> },
  { title: 'Requests', path: '/requests', icon: <RequestIcon /> },
  { title: 'Reports', path: '/reports', icon: <ReportIcon /> },
]

const MainLayout: React.FC = () => {
  const theme = useTheme()
  // Responsive breakpoints
  const isMobile = useMediaQuery(theme.breakpoints.down('sm')) // 0-599px
  const isDesktop = useMediaQuery(theme.breakpoints.up('lg')) // 1200px+
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('lg')) // Below 1200px (mobile + tablet)

  const navigate = useNavigate()
  const location = useLocation()

  const [mobileOpen, setMobileOpen] = useState(false)
  const [drawerCollapsed, setDrawerCollapsed] = useState(false)
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const [expandedItems, setExpandedItems] = useState<string[]>(['Work Orders'])

  // Calculate current drawer width based on state and screen size
  const currentDrawerWidth = isSmallScreen
    ? DRAWER_WIDTH_FULL
    : (drawerCollapsed ? DRAWER_WIDTH_MINI : DRAWER_WIDTH_FULL)

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen)
  }

  const handleDrawerCollapse = () => {
    setDrawerCollapsed(!drawerCollapsed)
  }

  const handleProfileMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget)
  }

  const handleProfileMenuClose = () => {
    setAnchorEl(null)
  }

  const handleNavClick = (path: string) => {
    navigate(path)
    if (isMobile) {
      setMobileOpen(false)
    }
  }

  const handleExpandClick = (title: string) => {
    setExpandedItems(prev =>
      prev.includes(title)
        ? prev.filter(item => item !== title)
        : [...prev, title]
    )
  }

  const isSelected = (path: string) => {
    if (path === '/') {
      return location.pathname === '/'
    }
    return location.pathname.startsWith(path)
  }

  // Check if drawer should show collapsed state (only on desktop when collapsed)
  const showCollapsed = isDesktop && drawerCollapsed

  const drawer = (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      {/* Header */}
      <Box
        sx={{
          p: showCollapsed ? 1.5 : 2,
          display: 'flex',
          alignItems: 'center',
          gap: 1.5,
          borderBottom: '1px solid',
          borderColor: 'divider',
          justifyContent: showCollapsed ? 'center' : 'flex-start',
          minHeight: 64,
        }}
      >
        <Box
          sx={{
            width: 40,
            height: 40,
            borderRadius: 2,
            bgcolor: 'primary.main',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white',
            fontWeight: 700,
            fontSize: '1.1rem',
            flexShrink: 0,
          }}
        >
          CM
        </Box>
        {!showCollapsed && (
          <Box sx={{ overflow: 'hidden' }}>
            <Typography variant="subtitle1" fontWeight={600} noWrap>
              CMMS
            </Typography>
            <Typography variant="caption" color="text.secondary" noWrap>
              Maintenance Management
            </Typography>
          </Box>
        )}
      </Box>

      {/* Navigation */}
      <List sx={{ flex: 1, px: showCollapsed ? 1 : 1.5, py: 2, overflow: 'auto' }}>
        {navItems.map((item) => (
          <React.Fragment key={item.title}>
            <ListItem disablePadding sx={{ mb: 0.5 }}>
              <Tooltip
                title={showCollapsed ? item.title : ''}
                placement="right"
                arrow
              >
                <ListItemButton
                  selected={isSelected(item.path) && !item.children}
                  onClick={() => {
                    if (item.children && !showCollapsed) {
                      handleExpandClick(item.title)
                    } else {
                      handleNavClick(item.path)
                    }
                  }}
                  sx={{
                    borderRadius: 2,
                    justifyContent: showCollapsed ? 'center' : 'flex-start',
                    px: showCollapsed ? 1.5 : 2,
                    minHeight: 44,
                    '&.Mui-selected': {
                      bgcolor: 'primary.main',
                      color: 'white',
                      '&:hover': {
                        bgcolor: 'primary.dark',
                      },
                      '& .MuiListItemIcon-root': {
                        color: 'white',
                      },
                    },
                  }}
                >
                  <ListItemIcon
                    sx={{
                      minWidth: showCollapsed ? 0 : 40,
                      color: isSelected(item.path) && !item.children ? 'inherit' : 'text.secondary',
                      justifyContent: 'center',
                    }}
                  >
                    {item.icon}
                  </ListItemIcon>
                  {!showCollapsed && (
                    <>
                      <ListItemText
                        primary={item.title}
                        primaryTypographyProps={{
                          fontSize: { xs: '0.85rem', sm: '0.9rem' },
                          fontWeight: 500,
                          noWrap: true,
                        }}
                      />
                      {item.children && (
                        expandedItems.includes(item.title) ? <ExpandLess /> : <ExpandMore />
                      )}
                    </>
                  )}
                </ListItemButton>
              </Tooltip>
            </ListItem>
            {item.children && !showCollapsed && (
              <Collapse in={expandedItems.includes(item.title)} timeout="auto" unmountOnExit>
                <List disablePadding>
                  {item.children.map((child) => (
                    <ListItem key={child.path} disablePadding sx={{ pl: 2 }}>
                      <ListItemButton
                        selected={location.pathname === child.path}
                        onClick={() => handleNavClick(child.path)}
                        sx={{
                          borderRadius: 2,
                          py: 0.75,
                          '&.Mui-selected': {
                            bgcolor: 'primary.light',
                            color: 'primary.contrastText',
                            '&:hover': {
                              bgcolor: 'primary.main',
                            },
                          },
                        }}
                      >
                        <ListItemText
                          primary={child.title}
                          primaryTypographyProps={{ fontSize: '0.85rem', noWrap: true }}
                        />
                      </ListItemButton>
                    </ListItem>
                  ))}
                </List>
              </Collapse>
            )}
          </React.Fragment>
        ))}
      </List>

      {/* Collapse toggle button - only on desktop */}
      {isDesktop && (
        <Box
          sx={{
            display: 'flex',
            justifyContent: showCollapsed ? 'center' : 'flex-end',
            px: 1,
            py: 0.5,
            borderTop: '1px solid',
            borderColor: 'divider',
          }}
        >
          <IconButton onClick={handleDrawerCollapse} size="small">
            {showCollapsed ? <ChevronRightIcon /> : <ChevronLeftIcon />}
          </IconButton>
        </Box>
      )}

      {/* User profile */}
      <Box
        sx={{
          p: showCollapsed ? 1.5 : 2,
          borderTop: '1px solid',
          borderColor: 'divider',
        }}
      >
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 1.5,
            justifyContent: showCollapsed ? 'center' : 'flex-start',
          }}
        >
          <Tooltip title={showCollapsed ? 'Nguyễn Văn Admin' : ''} placement="right" arrow>
            <Avatar
              sx={{
                width: { xs: 32, sm: 36 },
                height: { xs: 32, sm: 36 },
                bgcolor: 'secondary.main',
                fontSize: { xs: '0.75rem', sm: '0.875rem' },
              }}
            >
              NV
            </Avatar>
          </Tooltip>
          {!showCollapsed && (
            <Box sx={{ flex: 1, minWidth: 0, overflow: 'hidden' }}>
              <Typography variant="body2" fontWeight={500} noWrap>
                Nguyễn Văn Admin
              </Typography>
              <Typography variant="caption" color="text.secondary" noWrap>
                System Administrator
              </Typography>
            </Box>
          )}
        </Box>
      </Box>
    </Box>
  )

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      {/* AppBar - Responsive */}
      <AppBar
        position="fixed"
        sx={{
          width: {
            xs: '100%',
            lg: `calc(100% - ${currentDrawerWidth}px)`,
          },
          ml: { lg: `${currentDrawerWidth}px` },
          bgcolor: 'background.paper',
          color: 'text.primary',
          transition: theme.transitions.create(['width', 'margin'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
          }),
        }}
        elevation={0}
      >
        <Toolbar
          sx={{
            minHeight: { xs: 56, sm: 64 },
            px: { xs: 1, sm: 2, md: 3 },
          }}
        >
          {/* Menu toggle - visible on mobile/tablet */}
          <IconButton
            color="inherit"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{
              mr: { xs: 1, sm: 2 },
              display: { lg: 'none' },
            }}
          >
            <MenuIcon />
          </IconButton>

          {/* App title - responsive */}
          <Box sx={{ flex: 1, overflow: 'hidden' }}>
            <Typography
              variant="h6"
              fontWeight={600}
              noWrap
              sx={{
                fontSize: { xs: '1rem', sm: '1.125rem', md: '1.25rem' },
              }}
            >
              {isMobile ? 'CMMS' : APP_NAME}
            </Typography>
          </Box>

          {/* Notification icon */}
          <IconButton
            color="inherit"
            sx={{
              mr: { xs: 0.5, sm: 1 },
            }}
          >
            <Badge badgeContent={3} color="error">
              <NotificationIcon sx={{ fontSize: { xs: 22, sm: 24 } }} />
            </Badge>
          </IconButton>

          {/* Profile menu */}
          <IconButton
            onClick={handleProfileMenuOpen}
            color="inherit"
          >
            <AccountIcon sx={{ fontSize: { xs: 22, sm: 24 } }} />
          </IconButton>

          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleProfileMenuClose}
            transformOrigin={{ horizontal: 'right', vertical: 'top' }}
            anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
            PaperProps={{
              sx: {
                minWidth: 180,
                mt: 1,
              },
            }}
          >
            <MenuItem onClick={handleProfileMenuClose}>
              <ListItemIcon>
                <AccountIcon fontSize="small" />
              </ListItemIcon>
              Profile
            </MenuItem>
            <MenuItem onClick={handleProfileMenuClose}>
              <ListItemIcon>
                <SettingsIcon fontSize="small" />
              </ListItemIcon>
              Settings
            </MenuItem>
            <Divider />
            <MenuItem onClick={handleProfileMenuClose}>
              <ListItemIcon>
                <LogoutIcon fontSize="small" />
              </ListItemIcon>
              Logout
            </MenuItem>
          </Menu>
        </Toolbar>
      </AppBar>

      {/* Navigation Drawer */}
      <Box
        component="nav"
        sx={{
          width: { lg: currentDrawerWidth },
          flexShrink: { lg: 0 },
          transition: theme.transitions.create('width', {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
          }),
        }}
      >
        {/* Mobile/Tablet Drawer - Temporary */}
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{ keepMounted: true }}
          sx={{
            display: { xs: 'block', lg: 'none' },
            '& .MuiDrawer-paper': {
              boxSizing: 'border-box',
              width: { xs: '85%', sm: DRAWER_WIDTH_FULL },
              maxWidth: DRAWER_WIDTH_FULL,
            },
          }}
        >
          {drawer}
        </Drawer>

        {/* Desktop Drawer - Permanent */}
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: 'none', lg: 'block' },
            '& .MuiDrawer-paper': {
              boxSizing: 'border-box',
              width: currentDrawerWidth,
              borderRight: '1px solid',
              borderColor: 'divider',
              transition: theme.transitions.create('width', {
                easing: theme.transitions.easing.sharp,
                duration: theme.transitions.duration.leavingScreen,
              }),
              overflowX: 'hidden',
            },
          }}
          open
        >
          {drawer}
        </Drawer>
      </Box>

      {/* Main Content Area */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          width: {
            xs: '100%',
            lg: `calc(100% - ${currentDrawerWidth}px)`,
          },
          minHeight: '100vh',
          bgcolor: 'background.default',
          transition: theme.transitions.create(['width', 'margin'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
          }),
        }}
      >
        {/* Toolbar spacer - responsive height */}
        <Toolbar sx={{ minHeight: { xs: 56, sm: 64 } }} />

        {/* Content with responsive padding */}
        <Box
          sx={{
            p: { xs: 1.5, sm: 2, md: 3 },
            maxWidth: '100%',
            overflow: 'hidden',
          }}
        >
          <Outlet />
        </Box>
      </Box>
    </Box>
  )
}

export default MainLayout
