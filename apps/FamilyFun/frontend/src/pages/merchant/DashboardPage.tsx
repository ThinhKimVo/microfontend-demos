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
  Divider,
  LinearProgress,
} from '@mui/material';
import Grid from '@mui/material/Grid2';
import EventIcon from '@mui/icons-material/Event';
import PendingIcon from '@mui/icons-material/Pending';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import AddIcon from '@mui/icons-material/Add';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import StatsCard from '../../components/StatsCard';
import StatusChip from '../../components/StatusChip';
import { mockEvents } from '../../data/mockData';

const MerchantDashboardPage: React.FC = () => {
  const myEvents = mockEvents.slice(0, 5);
  const stats = {
    totalEvents: 12,
    approvedEvents: 8,
    pendingEvents: 3,
    draftEvents: 1,
    totalViews: 4520,
  };

  const trialDaysRemaining = 45;
  const trialProgress = ((60 - trialDaysRemaining) / 60) * 100;

  return (
    <Box>
      {/* Welcome Section */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" fontWeight={700} gutterBottom>
          Welcome back!
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Here's an overview of your events and activity
        </Typography>
      </Box>

      {/* Trial Banner */}
      <Paper
        sx={{
          p: 3,
          mb: 4,
          bgcolor: 'info.main',
          color: 'white',
        }}
      >
        <Grid container alignItems="center" spacing={3}>
          <Grid size={{ xs: 12, md: 8 }}>
            <Typography variant="h6" fontWeight={600} gutterBottom>
              Free Trial Active
            </Typography>
            <Typography variant="body2" sx={{ mb: 2, opacity: 0.9 }}>
              You have {trialDaysRemaining} days remaining in your free trial. Subscribe now to
              continue listing events after your trial ends.
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <LinearProgress
                variant="determinate"
                value={trialProgress}
                sx={{
                  flex: 1,
                  height: 8,
                  borderRadius: 4,
                  bgcolor: 'rgba(255,255,255,0.3)',
                  '& .MuiLinearProgress-bar': {
                    bgcolor: 'white',
                  },
                }}
              />
              <Typography variant="body2" fontWeight={600}>
                {trialDaysRemaining} days left
              </Typography>
            </Box>
          </Grid>
          <Grid size={{ xs: 12, md: 4 }} sx={{ textAlign: { md: 'right' } }}>
            <Button
              variant="contained"
              component={Link}
              to="/merchant/subscription"
              sx={{
                bgcolor: 'white',
                color: 'info.main',
                '&:hover': { bgcolor: 'grey.100' },
              }}
            >
              Subscribe Now
            </Button>
          </Grid>
        </Grid>
      </Paper>

      {/* Stats Grid */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <StatsCard
            title="Total Events"
            value={stats.totalEvents}
            icon={<EventIcon sx={{ fontSize: 28 }} />}
            color="primary.main"
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <StatsCard
            title="Approved"
            value={stats.approvedEvents}
            icon={<CheckCircleIcon sx={{ fontSize: 28 }} />}
            color="success.main"
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <StatsCard
            title="Pending Review"
            value={stats.pendingEvents}
            icon={<PendingIcon sx={{ fontSize: 28 }} />}
            color="warning.main"
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <StatsCard
            title="Total Views"
            value={stats.totalViews.toLocaleString()}
            icon={<TrendingUpIcon sx={{ fontSize: 28 }} />}
            color="info.main"
          />
        </Grid>
      </Grid>

      <Grid container spacing={3}>
        {/* Recent Events */}
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
              <Typography variant="h6" fontWeight={600}>
                Recent Events
              </Typography>
              <Button
                component={Link}
                to="/merchant/events"
                size="small"
              >
                View All
              </Button>
            </Box>
            <List disablePadding>
              {myEvents.map((event, index) => (
                <React.Fragment key={event.id}>
                  {index > 0 && <Divider />}
                  <ListItem
                    sx={{
                      px: 0,
                      py: 2,
                      display: 'flex',
                      alignItems: 'flex-start',
                      gap: 2,
                    }}
                  >
                    <Box
                      sx={{
                        width: 80,
                        height: 60,
                        borderRadius: 1,
                        overflow: 'hidden',
                        flexShrink: 0,
                      }}
                    >
                      <img
                        src={event.imageUrl}
                        alt={event.title}
                        style={{
                          width: '100%',
                          height: '100%',
                          objectFit: 'cover',
                        }}
                      />
                    </Box>
                    <ListItemText
                      primary={
                        <Typography variant="subtitle2" fontWeight={600}>
                          {event.title}
                        </Typography>
                      }
                      secondary={
                        <Typography variant="body2" color="text.secondary">
                          {event.date} · {event.district}
                        </Typography>
                      }
                    />
                    <StatusChip status={event.status} />
                  </ListItem>
                </React.Fragment>
              ))}
            </List>
          </Paper>
        </Grid>

        {/* Quick Actions */}
        <Grid size={{ xs: 12, md: 4 }}>
          <Paper sx={{ p: 3, mb: 3 }}>
            <Typography variant="h6" fontWeight={600} gutterBottom>
              Quick Actions
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                component={Link}
                to="/merchant/submit"
                fullWidth
              >
                Submit New Event
              </Button>
              <Button
                variant="outlined"
                component={Link}
                to="/merchant/events"
                fullWidth
              >
                Manage Events
              </Button>
            </Box>
          </Paper>

          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" fontWeight={600} gutterBottom>
              Status Overview
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Box
                    sx={{
                      width: 12,
                      height: 12,
                      borderRadius: '50%',
                      bgcolor: 'success.main',
                    }}
                  />
                  <Typography variant="body2">Approved</Typography>
                </Box>
                <Typography variant="body2" fontWeight={600}>
                  {stats.approvedEvents}
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Box
                    sx={{
                      width: 12,
                      height: 12,
                      borderRadius: '50%',
                      bgcolor: 'info.main',
                    }}
                  />
                  <Typography variant="body2">Pending</Typography>
                </Box>
                <Typography variant="body2" fontWeight={600}>
                  {stats.pendingEvents}
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Box
                    sx={{
                      width: 12,
                      height: 12,
                      borderRadius: '50%',
                      bgcolor: 'grey.400',
                    }}
                  />
                  <Typography variant="body2">Draft</Typography>
                </Box>
                <Typography variant="body2" fontWeight={600}>
                  {stats.draftEvents}
                </Typography>
              </Box>
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default MerchantDashboardPage;
