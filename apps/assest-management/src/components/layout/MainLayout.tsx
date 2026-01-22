import React, { useState } from "react";
import { Outlet, Navigate, useLocation } from "react-router-dom";
import { Box, Toolbar, CircularProgress } from "@mui/material";
import Sidebar from "./Sidebar";
import Header from "./Header";
import { useAuth } from "../../contexts/AuthContext";

const DRAWER_WIDTH = 260;

const pageTitles: Record<string, string> = {
  "/": "Dashboard",
  "/assets": "Assets",
  "/maintenance": "Maintenance",
  "/schedule": "Schedule",
  "/settings": "Settings",
};

function MainLayout() {
  const { user, loading } = useAuth();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  // Get page title based on current path
  const getPageTitle = () => {
    const path = location.pathname;

    // Check exact matches first
    if (pageTitles[path]) {
      return pageTitles[path];
    }

    // Check for asset detail page
    if (path.startsWith("/assets/")) {
      return "Asset Details";
    }

    // Check for maintenance detail page
    if (path.startsWith("/maintenance/")) {
      return "Maintenance Details";
    }

    return "Dashboard";
  };

  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return (
    <Box sx={{ display: "flex", minHeight: "100vh" }}>
      {/* Mobile & Tablet sidebar (temporary drawer) */}
      <Sidebar
        open={mobileOpen}
        onClose={handleDrawerToggle}
        variant="temporary"
      />

      {/* Desktop sidebar (permanent drawer) */}
      <Sidebar open={true} onClose={() => {}} variant="permanent" />

      {/* Main content */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          bgcolor: "background.default",
          minHeight: "100vh",
          width: { xs: "100%", md: `calc(100% - ${DRAWER_WIDTH}px)` },
          maxWidth: "100%",
          overflow: "hidden",
        }}
      >
        <Header onMenuClick={handleDrawerToggle} title={getPageTitle()} />
        <Toolbar />
        {/* Responsive padding: mobile (16px), tablet (20px), desktop (24px) */}
        <Box
          sx={{
            p: { xs: 2, sm: 2.5, md: 3 },
            maxWidth: "100%",
            overflow: "auto",
          }}
        >
          <Outlet />
        </Box>
      </Box>
    </Box>
  );
}

export default MainLayout;
