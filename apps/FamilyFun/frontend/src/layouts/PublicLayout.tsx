import React from 'react';
import { Outlet, Link, useNavigate } from 'react-router-dom';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Container,
  Box,
  IconButton,
  useMediaQuery,
  useTheme,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Divider,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import LanguageIcon from '@mui/icons-material/Language';
import FamilyRestroomIcon from '@mui/icons-material/FamilyRestroom';

interface PublicLayoutProps {
  language: 'en' | 'tc';
  onToggleLanguage: () => void;
}

const PublicLayout: React.FC<PublicLayoutProps> = ({ language, onToggleLanguage }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [drawerOpen, setDrawerOpen] = React.useState(false);
  const navigate = useNavigate();

  const navItems = [
    { label: language === 'en' ? 'Home' : '首頁', path: '/' },
    { label: language === 'en' ? 'Events' : '活動', path: '/events' },
    { label: language === 'en' ? 'About' : '關於我們', path: '/about' },
  ];

  const toggleDrawer = (open: boolean) => () => {
    setDrawerOpen(open);
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <AppBar position="sticky" sx={{ bgcolor: 'white' }}>
        <Toolbar>
          <Box
            component={Link}
            to="/"
            sx={{
              display: 'flex',
              alignItems: 'center',
              textDecoration: 'none',
              color: 'primary.main',
            }}
          >
            <FamilyRestroomIcon sx={{ fontSize: 32, mr: 1 }} />
            <Typography
              variant="h6"
              sx={{
                fontWeight: 700,
                display: { xs: 'none', sm: 'block' },
              }}
            >
              Family Fun HK
            </Typography>
          </Box>

          <Box sx={{ flexGrow: 1 }} />

          {isMobile ? (
            <>
              <IconButton
                onClick={onToggleLanguage}
                sx={{ color: 'text.secondary', mr: 1 }}
              >
                <LanguageIcon />
                <Typography variant="caption" sx={{ ml: 0.5 }}>
                  {language === 'en' ? '中文' : 'EN'}
                </Typography>
              </IconButton>
              <IconButton
                edge="end"
                onClick={toggleDrawer(true)}
                sx={{ color: 'text.primary' }}
              >
                <MenuIcon />
              </IconButton>
            </>
          ) : (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              {navItems.map((item) => (
                <Button
                  key={item.path}
                  component={Link}
                  to={item.path}
                  sx={{ color: 'text.primary', fontWeight: 500 }}
                >
                  {item.label}
                </Button>
              ))}
              <Button
                onClick={onToggleLanguage}
                startIcon={<LanguageIcon />}
                sx={{ color: 'text.secondary' }}
              >
                {language === 'en' ? '中文' : 'EN'}
              </Button>
{/* Merchant Login button hidden */}
            </Box>
          )}
        </Toolbar>
      </AppBar>

      <Drawer anchor="right" open={drawerOpen} onClose={toggleDrawer(false)}>
        <Box sx={{ width: 250, pt: 2 }}>
          <List>
            {navItems.map((item) => (
              <ListItem key={item.path} disablePadding>
                <ListItemButton
                  onClick={() => {
                    navigate(item.path);
                    setDrawerOpen(false);
                  }}
                >
                  <ListItemText primary={item.label} />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
          <Divider />
{/* Merchant Login menu item hidden */}
        </Box>
      </Drawer>

      <Box component="main" sx={{ flexGrow: 1 }}>
        <Outlet />
      </Box>

      <Box
        component="footer"
        sx={{
          bgcolor: 'secondary.main',
          color: 'white',
          py: 4,
          mt: 'auto',
        }}
      >
        <Container maxWidth="lg">
          <Box
            sx={{
              display: 'flex',
              flexDirection: { xs: 'column', md: 'row' },
              justifyContent: 'space-between',
              alignItems: { xs: 'center', md: 'flex-start' },
              gap: 3,
            }}
          >
            <Box sx={{ textAlign: { xs: 'center', md: 'left' } }}>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: { xs: 'center', md: 'flex-start' } }}>
                <FamilyRestroomIcon sx={{ fontSize: 28, mr: 1 }} />
                <Typography variant="h6" fontWeight={700}>
                  Family Fun HK
                </Typography>
              </Box>
              <Typography variant="body2" sx={{ mt: 1, opacity: 0.8 }}>
                {language === 'en'
                  ? 'Discover family-friendly activities in Hong Kong'
                  : '探索香港親子活動'}
              </Typography>
            </Box>

            <Box sx={{ display: 'flex', gap: 4 }}>
              <Box>
                <Typography variant="subtitle2" fontWeight={600} gutterBottom>
                  {language === 'en' ? 'Quick Links' : '快速連結'}
                </Typography>
                <Typography variant="body2" sx={{ opacity: 0.8 }}>
                  <Link to="/events" style={{ color: 'inherit', textDecoration: 'none' }}>
                    {language === 'en' ? 'All Events' : '所有活動'}
                  </Link>
                </Typography>
                <Typography variant="body2" sx={{ opacity: 0.8 }}>
                  <Link to="/about" style={{ color: 'inherit', textDecoration: 'none' }}>
                    {language === 'en' ? 'About Us' : '關於我們'}
                  </Link>
                </Typography>
              </Box>
              <Box>
                <Typography variant="subtitle2" fontWeight={600} gutterBottom>
                  {language === 'en' ? 'For Merchants' : '商戶專區'}
                </Typography>
                <Typography variant="body2" sx={{ opacity: 0.8 }}>
                  <Link to="/merchant/login" style={{ color: 'inherit', textDecoration: 'none' }}>
                    {language === 'en' ? 'Login' : '登入'}
                  </Link>
                </Typography>
                <Typography variant="body2" sx={{ opacity: 0.8 }}>
                  <Link to="/merchant/register" style={{ color: 'inherit', textDecoration: 'none' }}>
                    {language === 'en' ? 'Register' : '註冊'}
                  </Link>
                </Typography>
              </Box>
            </Box>
          </Box>

          <Divider sx={{ my: 3, borderColor: 'rgba(255,255,255,0.2)' }} />

          <Typography variant="body2" textAlign="center" sx={{ opacity: 0.6 }}>
            © {new Date().getFullYear()} Family Fun HK. All rights reserved.
          </Typography>
        </Container>
      </Box>
    </Box>
  );
};

export default PublicLayout;
