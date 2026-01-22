import { Outlet } from 'react-router-dom';
import { Box } from '@mui/material';
import LearningHeader from './LearningHeader';

export default function LearningLayout() {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', bgcolor: 'grey.50' }}>
      <LearningHeader />
      <Box component="main" sx={{ flex: 1, mt: '64px' }}>
        <Outlet />
      </Box>
    </Box>
  );
}
