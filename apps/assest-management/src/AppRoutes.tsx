import { Routes, Route, Navigate } from 'react-router-dom';

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

export default function AppRoutes() {
  return (
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
  );
}
