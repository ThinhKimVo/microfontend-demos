import React from 'react';
import {
  Box,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
} from '@mui/material';
import Grid from '@mui/material/Grid2';
import EventIcon from '@mui/icons-material/Event';
import VisibilityIcon from '@mui/icons-material/Visibility';
import StoreIcon from '@mui/icons-material/Store';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import StatsCard from '../../components/StatsCard';
import { mockEvents, mockAnalytics } from '../../data/mockData';

const AnalyticsPage: React.FC = () => {
  const districtStats = mockEvents.reduce((acc, event) => {
    acc[event.district] = (acc[event.district] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const topDistricts = Object.entries(districtStats)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);

  const categoryStats = [
    { name: 'SEN Friendly', count: mockEvents.filter((e) => e.isSenFriendly).length },
    { name: 'Free Events', count: mockEvents.filter((e) => e.isFree).length },
    { name: 'Tourist Friendly', count: mockEvents.filter((e) => e.isTouristFriendly).length },
    { name: 'Featured', count: mockEvents.filter((e) => e.isFeatured).length },
  ];

  return (
    <Box>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" fontWeight={700} gutterBottom>
          Analytics
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Overview of platform performance and statistics
        </Typography>
      </Box>

      {/* Stats Overview */}
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
            title="Page Views"
            value={mockAnalytics.totalPageViews.toLocaleString()}
            icon={<VisibilityIcon sx={{ fontSize: 28 }} />}
            color="info.main"
            trend={{ value: 24, isPositive: true }}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <StatsCard
            title="Active Merchants"
            value={mockAnalytics.totalMerchants}
            icon={<StoreIcon sx={{ fontSize: 28 }} />}
            color="success.main"
            trend={{ value: 8, isPositive: true }}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <StatsCard
            title="Pending Reviews"
            value={mockAnalytics.pendingApprovals}
            icon={<TrendingUpIcon sx={{ fontSize: 28 }} />}
            color="warning.main"
          />
        </Grid>
      </Grid>

      <Grid container spacing={3}>
        {/* Top Events */}
        <Grid size={{ xs: 12, md: 8 }}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" fontWeight={600} gutterBottom>
              Top 5 Events by Views
            </Typography>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Rank</TableCell>
                    <TableCell>Event</TableCell>
                    <TableCell>District</TableCell>
                    <TableCell align="right">Views</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {mockAnalytics.topEvents.map((event, index) => (
                    <TableRow key={event.id}>
                      <TableCell>
                        <Chip
                          label={`#${index + 1}`}
                          size="small"
                          color={index < 3 ? 'primary' : 'default'}
                        />
                      </TableCell>
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                          <Box
                            sx={{
                              width: 48,
                              height: 36,
                              borderRadius: 1,
                              overflow: 'hidden',
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
                          <Typography variant="body2" fontWeight={500}>
                            {event.title}
                          </Typography>
                        </Box>
                      </TableCell>
                      <TableCell>{event.district}</TableCell>
                      <TableCell align="right">
                        <Typography variant="body2" fontWeight={600}>
                          {event.viewCount.toLocaleString()}
                        </Typography>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        </Grid>

        {/* Category Stats */}
        <Grid size={{ xs: 12, md: 4 }}>
          <Paper sx={{ p: 3, mb: 3 }}>
            <Typography variant="h6" fontWeight={600} gutterBottom>
              Event Categories
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              {categoryStats.map((cat) => (
                <Box
                  key={cat.name}
                  sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                  }}
                >
                  <Typography variant="body2">{cat.name}</Typography>
                  <Chip
                    label={cat.count}
                    size="small"
                    variant="outlined"
                  />
                </Box>
              ))}
            </Box>
          </Paper>

          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" fontWeight={600} gutterBottom>
              Top Districts
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              {topDistricts.map(([district, count], index) => (
                <Box
                  key={district}
                  sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Typography
                      variant="body2"
                      sx={{
                        width: 20,
                        fontWeight: 600,
                        color: index < 3 ? 'primary.main' : 'text.secondary',
                      }}
                    >
                      #{index + 1}
                    </Typography>
                    <Typography variant="body2">{district}</Typography>
                  </Box>
                  <Typography variant="body2" fontWeight={600}>
                    {count} events
                  </Typography>
                </Box>
              ))}
            </Box>
          </Paper>
        </Grid>

        {/* Charts Placeholder */}
        <Grid size={{ xs: 12 }}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" fontWeight={600} gutterBottom>
              Views Over Time
            </Typography>
            <Box
              sx={{
                height: 300,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                bgcolor: 'grey.100',
                borderRadius: 2,
              }}
            >
              <Typography color="text.secondary">
                Chart visualization would be displayed here
              </Typography>
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default AnalyticsPage;
