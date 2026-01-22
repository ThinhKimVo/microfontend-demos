import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Grid,
  Box,
  Typography,
  Button,
  Skeleton,
  Card,
  CardContent,
  alpha,
  useTheme,
  Stack,
} from '@mui/material';
import {
  Inventory as InventoryIcon,
  CheckCircle as ActiveIcon,
  Build as MaintenanceIcon,
  Warning as WarningIcon,
  Add as AddIcon,
  ArrowForward as ArrowForwardIcon,
} from '@mui/icons-material';
import SummaryCard from '../components/dashboard/SummaryCard';
import AlertsWidget from '../components/dashboard/AlertsWidget';
import RecentActivity, { ActivityItem } from '../components/dashboard/RecentActivity';
import { assetService } from '../services/assetService';
import { maintenanceService } from '../services/maintenanceService';
import { AlertItem, AssetStatus, MaintenanceSchedule, Asset } from '../types';
import { Timestamp } from 'firebase/firestore';

function Dashboard() {
  const navigate = useNavigate();
  const theme = useTheme();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalAssets: 0,
    activeAssets: 0,
    inMaintenance: 0,
    overdueCount: 0,
  });
  const [alerts, setAlerts] = useState<AlertItem[]>([]);
  const [activities, setActivities] = useState<ActivityItem[]>([]);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);

      // Load asset stats and assets first (these don't require composite indexes)
      const [assetStats, assets] = await Promise.all([
        assetService.getStats(),
        assetService.getAll(),
      ]);

      // Create a map of asset IDs to names
      const assetMap = assets.reduce(
        (acc, asset) => {
          acc[asset.id] = asset.name;
          return acc;
        },
        {} as Record<string, string>
      );

      // Try to load maintenance data (may fail if indexes are still building)
      let upcoming: MaintenanceSchedule[] = [];
      let overdue: MaintenanceSchedule[] = [];
      
      try {
        [upcoming, overdue] = await Promise.all([
          maintenanceService.getUpcomingMaintenance(7),
          maintenanceService.getOverdueMaintenance(),
        ]);
      } catch (maintenanceError) {
        console.warn('Failed to load maintenance schedules (indexes may still be building):', maintenanceError);
        // Continue with empty arrays - the page will still show asset stats
      }

      // Set stats
      setStats({
        totalAssets: assetStats.total,
        activeAssets: assetStats.byStatus['active' as AssetStatus] || 0,
        inMaintenance: assetStats.byStatus['in_maintenance' as AssetStatus] || 0,
        overdueCount: overdue.length,
      });

      // Generate alerts
      const alertItems: AlertItem[] = [];

      // Add overdue maintenance alerts
      overdue.forEach((schedule: MaintenanceSchedule) => {
        alertItems.push({
          id: `overdue-${schedule.id}`,
          type: 'maintenance_overdue',
          title: schedule.title,
          description: `Maintenance overdue`,
          assetId: schedule.assetId,
          assetName: assetMap[schedule.assetId] || 'Unknown Asset',
          dueDate: (schedule.nextDue as Timestamp).toDate(),
          severity: 'high',
        });
      });

      // Add upcoming maintenance alerts
      upcoming.forEach((schedule: MaintenanceSchedule) => {
        alertItems.push({
          id: `upcoming-${schedule.id}`,
          type: 'maintenance_due',
          title: schedule.title,
          description: `Maintenance due soon`,
          assetId: schedule.assetId,
          assetName: assetMap[schedule.assetId] || 'Unknown Asset',
          dueDate: (schedule.nextDue as Timestamp).toDate(),
          severity: 'medium',
        });
      });

      // Check for expiring warranties
      const now = new Date();
      const thirtyDaysFromNow = new Date();
      thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30);

      assets.forEach((asset: Asset) => {
        if (asset.warrantyExpiry) {
          const expiryDate = (asset.warrantyExpiry as Timestamp).toDate();
          if (expiryDate > now && expiryDate <= thirtyDaysFromNow) {
            alertItems.push({
              id: `warranty-${asset.id}`,
              type: 'warranty_expiring',
              title: `Warranty Expiring`,
              description: `${asset.name} warranty expiring soon`,
              assetId: asset.id,
              assetName: asset.name,
              dueDate: expiryDate,
              severity: 'low',
            });
          }
        }
      });

      // Sort alerts by severity and date
      alertItems.sort((a, b) => {
        const severityOrder = { high: 0, medium: 1, low: 2 };
        if (severityOrder[a.severity] !== severityOrder[b.severity]) {
          return severityOrder[a.severity] - severityOrder[b.severity];
        }
        return a.dueDate.getTime() - b.dueDate.getTime();
      });

      setAlerts(alertItems);

      // Generate recent activities (mock data for now - would come from activity log)
      const recentActivities: ActivityItem[] = assets
        .slice(0, 5)
        .map((asset: Asset) => ({
          id: asset.id,
          type: 'asset_created' as const,
          title: `Asset: ${asset.name}`,
          description: `${asset.type} added`,
          timestamp: (asset.createdAt as Timestamp).toDate(),
          assetId: asset.id,
        }));

      setActivities(recentActivities);
    } catch (error) {
      console.error('Failed to load dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  // Get greeting based on time of day
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  if (loading) {
    return (
      <Box>
        {/* Welcome Section Skeleton */}
        <Box sx={{ mb: 5 }}>
          <Skeleton variant="text" width={300} height={40} />
          <Skeleton variant="text" width={200} height={24} />
        </Box>

        {/* Stats Skeleton */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          {[1, 2, 3, 4].map((i) => (
            <Grid size={{ xs: 12, sm: 6, md: 3 }} key={i}>
              <Skeleton variant="rounded" height={160} sx={{ borderRadius: 2 }} />
            </Grid>
          ))}
        </Grid>

        {/* Content Skeleton */}
        <Grid container spacing={3}>
          <Grid size={{ xs: 12, lg: 8 }}>
            <Skeleton variant="rounded" height={400} sx={{ borderRadius: 2 }} />
          </Grid>
          <Grid size={{ xs: 12, lg: 4 }}>
            <Skeleton variant="rounded" height={400} sx={{ borderRadius: 2 }} />
          </Grid>
        </Grid>
      </Box>
    );
  }

  return (
    <Box>
      {/* Welcome Section */}
      <Box
        sx={{
          mb: 5,
          display: 'flex',
          flexDirection: { xs: 'column', sm: 'row' },
          justifyContent: 'space-between',
          alignItems: { xs: 'flex-start', sm: 'center' },
          gap: 2,
        }}
      >
        <Box>
          <Typography variant="h4" sx={{ mb: 1 }}>
            {getGreeting()}!
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Here's what's happening with your assets today.
          </Typography>
        </Box>

        <Stack direction="row" spacing={2}>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => navigate('/assets/new')}
            sx={{
              px: 3,
              background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
              '&:hover': {
                background: `linear-gradient(135deg, ${theme.palette.primary.dark} 0%, ${theme.palette.primary.darker} 100%)`,
              },
            }}
          >
            Add Asset
          </Button>
          <Button
            variant="outlined"
            color="inherit"
            startIcon={<MaintenanceIcon />}
            onClick={() => navigate('/maintenance/new')}
            sx={{
              px: 3,
              borderColor: alpha(theme.palette.grey[500], 0.32),
              '&:hover': {
                borderColor: theme.palette.grey[500],
                bgcolor: alpha(theme.palette.grey[500], 0.08),
              },
            }}
          >
            Log Maintenance
          </Button>
        </Stack>
      </Box>

      {/* Summary Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <SummaryCard
            title="Total Assets"
            value={stats.totalAssets}
            icon={<InventoryIcon />}
            color="primary"
            onClick={() => navigate('/assets')}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <SummaryCard
            title="Active Assets"
            value={stats.activeAssets}
            icon={<ActiveIcon />}
            color="success"
            onClick={() => navigate('/assets?status=active')}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <SummaryCard
            title="In Maintenance"
            value={stats.inMaintenance}
            icon={<MaintenanceIcon />}
            color="warning"
            onClick={() => navigate('/assets?status=in_maintenance')}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <SummaryCard
            title="Overdue Tasks"
            value={stats.overdueCount}
            subtitle={stats.overdueCount > 0 ? 'Needs attention' : 'All up to date'}
            icon={<WarningIcon />}
            color={stats.overdueCount > 0 ? 'error' : 'success'}
            onClick={() => navigate('/maintenance?status=overdue')}
          />
        </Grid>
      </Grid>

      {/* Alerts and Activity */}
      <Grid container spacing={3}>
        <Grid size={{ xs: 12, lg: 8 }}>
          <AlertsWidget alerts={alerts} title="Maintenance Alerts" maxItems={6} />
        </Grid>
        <Grid size={{ xs: 12, lg: 4 }}>
          <RecentActivity activities={activities} maxItems={5} />
        </Grid>
      </Grid>

      {/* Empty State */}
      {stats.totalAssets === 0 && (
        <Card
          sx={{
            mt: 4,
            textAlign: 'center',
            background: `linear-gradient(135deg, ${alpha(theme.palette.primary.lighter || theme.palette.primary.light, 0.5)} 0%, ${alpha(theme.palette.primary.light, 0.1)} 100%)`,
          }}
        >
          <CardContent sx={{ py: 8 }}>
            <Box
              sx={{
                width: 120,
                height: 120,
                borderRadius: '50%',
                bgcolor: alpha(theme.palette.primary.main, 0.08),
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                mx: 'auto',
                mb: 3,
              }}
            >
              <InventoryIcon sx={{ fontSize: 56, color: 'primary.main' }} />
            </Box>

            <Typography variant="h5" sx={{ mb: 1.5 }}>
              No Assets Yet
            </Typography>

            <Typography
              variant="body1"
              color="text.secondary"
              sx={{ mb: 4, maxWidth: 400, mx: 'auto' }}
            >
              Get started by adding your first asset to the system. Track maintenance, warranties, and more.
            </Typography>

            <Button
              variant="contained"
              size="large"
              startIcon={<AddIcon />}
              endIcon={<ArrowForwardIcon />}
              onClick={() => navigate('/assets/new')}
              sx={{
                px: 4,
                py: 1.5,
                background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
                '&:hover': {
                  background: `linear-gradient(135deg, ${theme.palette.primary.dark} 0%, ${theme.palette.primary.darker} 100%)`,
                },
              }}
            >
              Add Your First Asset
            </Button>
          </CardContent>
        </Card>
      )}
    </Box>
  );
}

export default Dashboard;
