import React from 'react';
import { Outlet } from 'react-router-dom';
import { Box } from '@mui/material';
import Header from './Header';
import Footer from './Footer';
import MobileNav from './MobileNav';

const MainLayout: React.FC = () => {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh',
      }}
    >
      <Header />
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          pt: { xs: '56px', sm: '64px' },
          pb: { xs: '56px', sm: 0 },
        }}
      >
        <Outlet />
      </Box>
      <Footer />
      <MobileNav />
    </Box>
  );
};

export default MainLayout;
