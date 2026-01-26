import React from 'react';
import { Link } from 'react-router-dom';
import {
  Box,
  Typography,
  Paper,
  Button,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  Divider,
  Chip,
} from '@mui/material';
import Grid from '@mui/material/Grid2';
import EventIcon from '@mui/icons-material/Event';
import StoreIcon from '@mui/icons-material/Store';
import VisibilityIcon from '@mui/icons-material/Visibility';
import PendingActionsIcon from '@mui/icons-material/PendingActions';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import StatsCard from '../../components/StatsCard';
import StatusChip from '../../components/StatusChip';
import { mockEvents, mockMerchants, mockAnalytics } from '../../data/mockData';

const AdminDashboardPage: React.FC = () => {
  const pendingEvents = mockEvents.filter((e) => e.status === 'submitted').slice(0, 5);
  const recentMerchants = mockMerchants.slice(0, 5);

  return (
    <Box>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" fontWeight={700} gutterBottom>
          Dashboard
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Welcome back! Here's what's happening with Family Fun HK.
        </Typography>
      </Box>

      {/* Stats Grid */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <StatsCard
            title="Total Events"
            value={mockAnalytics.totalEvents}
            icon={<EventIcon sx={{ fontSize: 28 }} />}
            color="primary.main"
            trend={{ value: 12, isPositive: true }}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <StatsCard
            title="Total Merchants"
            value={mockAnalytics.totalMerchants}
            icon={<StoreIcon sx={{ fontSize: 28 }} />}
            color="info.main"
            trend={{ value: 8, isPositive: true }}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <StatsCard
            title="Page Views"
            value={mockAnalytics.totalPageViews.toLocaleString()}
            icon={<VisibilityIcon sx={{ fontSize: 28 }} />}
            color="success.main"
            trend={{ value: 24, isPositive: true }}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <StatsCard
            title="Pending Approvals"
            value={mockAnalytics.pendingApprovals}
            icon={<PendingActionsIcon sx={{ fontSize: 28 }} />}
            color="warning.main"
          />
        </Grid>
      </Grid>

      <Grid container spacing={3}>
        {/* Pending Approvals */}
        <Grid size={{ xs: 12, md: 8 }}>
          <Paper sx={{ p: 3 }}>
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                mb: 2,
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Typography variant="h6" fontWeight={600}>
                  Pending Approvals
                </Typography>
                <Chip
                  label={mockAnalytics.pendingApprovals}
                  color="warning"
                  size="small"
                />
              </Box>
              <Button
                component={Link}
                to="/admin/approvals"
                endIcon={<ArrowForwardIcon />}
                size="small"
              >
                View All
              </Button>
            </Box>

            <List disablePadding>
              {pendingEvents.map((event, index) => (
                <React.Fragment key={event.id}>
                  {index > 0 && <Divider />}
                  <ListItem
                    sx={{
                      px: 0,
                      py: 2,
                    }}
                    secondaryAction={
                      <Box sx={{ display: 'flex', gap: 1 }}>
                        <Button size="small" variant="outlined" color="error">
                          Reject
                        </Button>
                        <Button size="small" variant="contained" color="success">
                          Approve
                        </Button>
                      </Box>
                    }
                  >
                    <ListItemAvatar>
                      <Avatar
                        variant="rounded"
                        src={event.imageUrl}
                        sx={{ width: 56, height: 56, mr: 1 }}
                      />
                    </ListItemAvatar>
                    <ListItemText
                      primary={
                        <Typography variant="subtitle2" fontWeight={600}>
                          {event.title}
                        </Typography>
                      }
                      secondary={
                        <>
                          {event.district} · {event.date}
                        </>
                      }
                    />
                  </ListItem>
                </React.Fragment>
              ))}
            </List>
          </Paper>
        </Grid>

        {/* Top Events */}
        <Grid size={{ xs: 12, md: 4 }}>
          <Paper sx={{ p: 3, mb: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
              <TrendingUpIcon color="primary" />
              <Typography variant="h6" fontWeight={600}>
                Top Events
              </Typography>
            </Box>

            <List disablePadding>
              {mockAnalytics.topEvents.slice(0, 5).map((event, index) => (
                <ListItem
                  key={event.id}
                  sx={{
                    px: 0,
                    py: 1,
                    borderBottom: index < 4 ? 1 : 0,
                    borderColor: 'divider',
                  }}
                >
                  <Typography
                    variant="body2"
                    sx={{
                      width: 24,
                      fontWeight: 600,
                      color: index < 3 ? 'primary.main' : 'text.secondary',
                    }}
                  >
                    #{index + 1}
                  </Typography>
                  <ListItemText
                    primary={
                      <Typography
                        variant="body2"
                        sx={{
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap',
                        }}
                      >
                        {event.title}
                      </Typography>
                    }
                  />
                  <Typography variant="body2" color="text.secondary">
                    {event.viewCount.toLocaleString()}
                  </Typography>
                </ListItem>
              ))}
            </List>
          </Paper>

          <Paper sx={{ p: 3 }}>
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                mb: 2,
              }}
            >
              <Typography variant="h6" fontWeight={600}>
                Recent Merchants
              </Typography>
              <Button
                component={Link}
                to="/admin/merchants"
                size="small"
              >
                View All
              </Button>
            </Box>

            <List disablePadding>
              {recentMerchants.slice(0, 4).map((merchant, index) => (
                <ListItem
                  key={merchant.id}
                  sx={{
                    px: 0,
                    py: 1.5,
                    borderBottom: index < 3 ? 1 : 0,
                    borderColor: 'divider',
                  }}
                >
                  <ListItemAvatar>
                    <Avatar sx={{ bgcolor: 'primary.main' }}>
                      {merchant.companyName.charAt(0)}
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText
                    primary={
                      <Typography variant="body2" fontWeight={600}>
                        {merchant.companyName}
                      </Typography>
                    }
                    secondary={merchant.email}
                  />
                  <StatusChip status={merchant.subscriptionStatus} size="small" />
                </ListItem>
              ))}
            </List>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default AdminDashboardPage;
