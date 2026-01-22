import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Grid2 as Grid,
  Paper,
  Card,
  CardContent,
  Button,
  Avatar,
  Chip,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  LinearProgress,
} from '@mui/material';
import {
  TrendingUp,
  TrendingDown,
  CalendarMonth,
  Home,
  Star,
  AttachMoney,
  BookOnline,
  Message,
} from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../contexts/AuthContext';
import { useLocale } from '../../contexts/LocaleContext';
import { mockBookings, mockProperties } from '@staygcc/shared/mock-data';
import { formatCurrency, formatDate } from '@staygcc/shared/utils';

interface StatCardProps {
  title: string;
  value: string | number;
  change?: number;
  icon: React.ReactNode;
  color: string;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, change, icon, color }) => {
  const { t } = useTranslation();
  return (
    <Paper sx={{ p: 3, height: '100%' }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <Box>
          <Typography variant="body2" color="text.secondary" gutterBottom>
            {title}
          </Typography>
          <Typography variant="h4" fontWeight={600}>
            {value}
          </Typography>
          {change !== undefined && (
            <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
              {change >= 0 ? (
                <TrendingUp sx={{ fontSize: 16, color: 'success.main', mr: 0.5 }} />
              ) : (
                <TrendingDown sx={{ fontSize: 16, color: 'error.main', mr: 0.5 }} />
              )}
              <Typography
                variant="body2"
                color={change >= 0 ? 'success.main' : 'error.main'}
              >
                {change >= 0 ? '+' : ''}{change}% {t('host:dashboard.fromLastMonth')}
              </Typography>
            </Box>
          )}
        </Box>
        <Box
          sx={{
            width: 48,
            height: 48,
            borderRadius: 2,
            backgroundColor: color,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white',
          }}
        >
          {icon}
        </Box>
      </Box>
    </Paper>
  );
};

const DashboardPage: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { host } = useAuth();
  const { language, currency } = useLocale();

  // Mock dashboard data
  const stats = {
    totalEarnings: 45230,
    thisMonth: 12450,
    bookings: 24,
    occupancyRate: 78,
    avgRating: 4.8,
    pendingBookings: 3,
    newMessages: 5,
    activeListings: 4,
  };

  const recentBookings = mockBookings.slice(0, 5);
  const hostListings = mockProperties.slice(0, 3);

  return (
    <Box>
      {/* Welcome Section */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" fontWeight={600} gutterBottom>
          {t('host:dashboard.welcome')}, {host?.firstNameEn}!
        </Typography>
        <Typography variant="body1" color="text.secondary">
          {t('host:dashboard.subtitle')}
        </Typography>
      </Box>

      {/* Stats Grid */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <StatCard
            title={t('host:dashboard.totalEarnings')}
            value={formatCurrency(stats.totalEarnings, currency, language)}
            change={12}
            icon={<AttachMoney />}
            color="#1E3A5F"
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <StatCard
            title={t('host:dashboard.totalBookings')}
            value={stats.bookings}
            change={8}
            icon={<BookOnline />}
            color="#E07A5F"
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <StatCard
            title={t('host:dashboard.occupancyRate')}
            value={`${stats.occupancyRate}%`}
            change={-3}
            icon={<CalendarMonth />}
            color="#2E7D32"
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <StatCard
            title={t('host:dashboard.avgRating')}
            value={stats.avgRating}
            icon={<Star />}
            color="#F9A825"
          />
        </Grid>
      </Grid>

      <Grid container spacing={3}>
        {/* Pending Actions */}
        <Grid size={{ xs: 12, md: 4 }}>
          <Paper sx={{ p: 3, height: '100%' }}>
            <Typography variant="h6" fontWeight={600} gutterBottom>
              {t('host:dashboard.pendingActions')}
            </Typography>
            <List>
              <ListItem
                component="div"
                onClick={() => navigate('/bookings')}
                sx={{ cursor: 'pointer', borderRadius: 2, '&:hover': { backgroundColor: 'action.hover' } }}
              >
                <ListItemAvatar>
                  <Avatar sx={{ backgroundColor: 'warning.light' }}>
                    <BookOnline color="warning" />
                  </Avatar>
                </ListItemAvatar>
                <ListItemText
                  primary={t('host:dashboard.pendingBookings')}
                  secondary={`${stats.pendingBookings} ${t('host:dashboard.needsResponse')}`}
                />
                <Chip label={stats.pendingBookings} color="warning" size="small" />
              </ListItem>
              <ListItem
                component="div"
                onClick={() => navigate('/messages')}
                sx={{ cursor: 'pointer', borderRadius: 2, '&:hover': { backgroundColor: 'action.hover' } }}
              >
                <ListItemAvatar>
                  <Avatar sx={{ backgroundColor: 'info.light' }}>
                    <Message color="info" />
                  </Avatar>
                </ListItemAvatar>
                <ListItemText
                  primary={t('host:dashboard.unreadMessages')}
                  secondary={t('host:dashboard.replyWithin24h')}
                />
                <Chip label={stats.newMessages} color="info" size="small" />
              </ListItem>
              <ListItem
                component="div"
                onClick={() => navigate('/reviews')}
                sx={{ cursor: 'pointer', borderRadius: 2, '&:hover': { backgroundColor: 'action.hover' } }}
              >
                <ListItemAvatar>
                  <Avatar sx={{ backgroundColor: 'success.light' }}>
                    <Star color="success" />
                  </Avatar>
                </ListItemAvatar>
                <ListItemText
                  primary={t('host:dashboard.pendingReviews')}
                  secondary={t('host:dashboard.writeGuestReview')}
                />
                <Chip label={2} color="success" size="small" />
              </ListItem>
            </List>
          </Paper>
        </Grid>

        {/* Recent Bookings */}
        <Grid size={{ xs: 12, md: 8 }}>
          <Paper sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h6" fontWeight={600}>
                {t('host:dashboard.recentBookings')}
              </Typography>
              <Button onClick={() => navigate('/bookings')}>
                {t('common:actions.viewAll')}
              </Button>
            </Box>
            <List>
              {recentBookings.map((booking) => {
                const property = mockProperties.find((p) => p.id === booking.propertyId);
                const title = language === 'ar' ? property?.titleAr : property?.titleEn;
                return (
                  <ListItem
                    key={booking.id}
                    sx={{
                      border: '1px solid',
                      borderColor: 'divider',
                      borderRadius: 2,
                      mb: 1,
                      '&:hover': { backgroundColor: 'action.hover' },
                    }}
                  >
                    <ListItemAvatar>
                      <Avatar src={property?.photos[0]?.url} variant="rounded">
                        <Home />
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary={title}
                      secondary={
                        <Box component="span">
                          {formatDate(booking.checkInDate, 'PP', language)} - {formatDate(booking.checkOutDate, 'PP', language)}
                          <br />
                          {booking.adults + booking.children} {t('common:guests.guests')}
                        </Box>
                      }
                    />
                    <Box sx={{ textAlign: 'right' }}>
                      <Chip
                        size="small"
                        label={t(`booking:status.${booking.status}`)}
                        color={
                          booking.status === 'confirmed' ? 'success' :
                          booking.status === 'pending' ? 'warning' :
                          booking.status === 'completed' ? 'info' : 'default'
                        }
                        sx={{ mb: 1 }}
                      />
                      <Typography variant="subtitle2" fontWeight={600}>
                        {formatCurrency(booking.pricing.totalPrice, currency, language)}
                      </Typography>
                    </Box>
                  </ListItem>
                );
              })}
            </List>
          </Paper>
        </Grid>

        {/* Your Listings */}
        <Grid size={{ xs: 12 }}>
          <Paper sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
              <Typography variant="h6" fontWeight={600}>
                {t('host:dashboard.yourListings')}
              </Typography>
              <Button variant="contained" onClick={() => navigate('/listings/new')}>
                {t('host:listings.addListing')}
              </Button>
            </Box>
            <Grid container spacing={3}>
              {hostListings.map((listing) => {
                const title = language === 'ar' ? listing.titleAr : listing.titleEn;
                return (
                  <Grid key={listing.id} size={{ xs: 12, sm: 6, md: 4 }}>
                    <Card
                      sx={{
                        cursor: 'pointer',
                        '&:hover': { boxShadow: 4 },
                      }}
                      onClick={() => navigate(`/listings/${listing.id}/edit`)}
                    >
                      <Box
                        component="img"
                        src={listing.photos[0]?.url}
                        alt={title}
                        sx={{ width: '100%', height: 160, objectFit: 'cover' }}
                      />
                      <CardContent>
                        <Typography variant="subtitle1" fontWeight={600} noWrap>
                          {title}
                        </Typography>
                        <Typography variant="body2" color="text.secondary" gutterBottom>
                          {listing.location.city}, {listing.location.country}
                        </Typography>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 2 }}>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                            <Star sx={{ fontSize: 16, color: 'warning.main' }} />
                            <Typography variant="body2">
                              {listing.rating?.toFixed(1) || '-'} ({listing.reviewCount || 0})
                            </Typography>
                          </Box>
                          <Typography variant="subtitle2" fontWeight={600}>
                            {formatCurrency(listing.pricing.basePrice, currency, language)}/{t('common:labels.night')}
                          </Typography>
                        </Box>
                        <Box sx={{ mt: 2 }}>
                          <Typography variant="caption" color="text.secondary" display="block" gutterBottom>
                            {t('host:dashboard.occupancy')}: 75%
                          </Typography>
                          <LinearProgress
                            variant="determinate"
                            value={75}
                            sx={{ height: 6, borderRadius: 3 }}
                          />
                        </Box>
                      </CardContent>
                    </Card>
                  </Grid>
                );
              })}
            </Grid>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default DashboardPage;
