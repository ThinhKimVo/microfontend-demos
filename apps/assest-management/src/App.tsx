import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, CssBaseline } from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import theme from './theme/theme';
import { AuthProvider } from './contexts/AuthContext';

// Layout
import MainLayout from './components/layout/MainLayout';

// Pages
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Assets from './pages/Assets';
import AddAsset from './pages/AddAsset';
import AssetDetail from './pages/AssetDetail';
import EditAsset from './pages/EditAsset';
import Maintenance from './pages/Maintenance';
import AddMaintenance from './pages/AddMaintenance';
import Schedule from './pages/Schedule';
import Settings from './pages/Settings';

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <AuthProvider>
          <BrowserRouter>
            <Routes>
              {/* Public routes */}
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />

              {/* Protected routes */}
              <Route path="/" element={<MainLayout />}>
                <Route index element={<Dashboard />} />

                {/* Assets */}
                <Route path="assets" element={<Assets />} />
                <Route path="assets/new" element={<AddAsset />} />
                <Route path="assets/:id" element={<AssetDetail />} />
                <Route path="assets/:id/edit" element={<EditAsset />} />

                {/* Maintenance */}
                <Route path="maintenance" element={<Maintenance />} />
                <Route path="maintenance/new" element={<AddMaintenance />} />

                {/* Schedule */}
                <Route path="schedule" element={<Schedule />} />

                {/* Settings */}
                <Route path="settings" element={<Settings />} />
              </Route>

              {/* Catch all */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </BrowserRouter>
        </AuthProvider>
      </LocalizationProvider>
    </ThemeProvider>
  );
}

export default App;
