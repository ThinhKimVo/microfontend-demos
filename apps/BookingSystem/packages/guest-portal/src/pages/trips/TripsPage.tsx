import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  Typography,
  Tabs,
  Tab,
  Card,
  CardMedia,
  CardContent,
  Button,
  Chip,
  Grid2 as Grid,
} from '@mui/material';
import {
  CalendarMonth,
  LocationOn,
  Star,
  Message,
} from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import { mockBookings, mockProperties } from '@staygcc/shared/mock-data';
import { useAuth } from '../../contexts/AuthContext';
import { useLocale } from '../../contexts/LocaleContext';
import { formatCurrency, formatDate } from '@staygcc/shared/utils';

const TripsPage: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const { language, currency } = useLocale();
  const [tabValue, setTabValue] = useState(0);

  if (!isAuthenticated) {
    navigate('/login');
    return null;
  }

  const bookings = mockBookings;

  const upcomingBookings = bookings.filter(
    (b) => b.status === 'confirmed' || b.status === 'pending'
  );
  const pastBookings = bookings.filter(
    (b) => b.status === 'completed'
  );
  const cancelledBookings = bookings.filter(
    (b) => b.status === 'cancelled' || b.status === 'rejected'
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'success';
      case 'pending':
        return 'warning';
      case 'completed':
        return 'info';
      case 'cancelled':
      case 'rejected':
        return 'error';
      default:
        return 'default';
    }
  };

  const renderBookingCard = (booking: typeof bookings[0]) => {
    const property = mockProperties.find((p) => p.id === booking.propertyId);
    if (!property) return null;

    const title = language === 'ar' ? property.titleAr : property.titleEn;

    return (
      <Card key={booking.id} sx={{ mb: 3 }}>
        <Grid container>
          <Grid size={{ xs: 12, sm: 4 }}>
            <CardMedia
              component="img"
              height="200"
              image={property.photos[0]?.url || 'https://via.placeholder.com/400x300'}
              alt={title}
              sx={{ cursor: 'pointer' }}
              onClick={() => navigate(`/property/${property.id}`)}
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 8 }}>
            <CardContent sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
                <Typography
                  variant="h6"
                  fontWeight={600}
                  sx={{ cursor: 'pointer' }}
                  onClick={() => navigate(`/property/${property.id}`)}
                >
                  {title}
                </Typography>
                <Chip
                  size="small"
                  label={t(`booking:status.${booking.status}`)}
                  color={getStatusColor(booking.status) as 'success' | 'warning' | 'info' | 'error' | 'default'}
                />
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mb: 1 }}>
                <LocationOn fontSize="small" color="action" />
                <Typography variant="body2" color="text.secondary">
                  {property.location.city}, {property.location.country}
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mb: 1 }}>
                <CalendarMonth fontSize="small" color="action" />
                <Typography variant="body2" color="text.secondary">
                  {formatDate(booking.checkIn || booking.checkInDate, 'PP', language)} - {formatDate(booking.checkOut || booking.checkOutDate, 'PP', language)}
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mb: 2 }}>
                <Star fontSize="small" color="action" />
                <Typography variant="body2" color="text.secondary">
                  {property.rating?.toFixed(1)} ({property.reviewCount} {t('property:reviews')})
                </Typography>
              </Box>
              <Box sx={{ mt: 'auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="subtitle1" fontWeight={600}>
                  {formatCurrency(booking.pricing.totalPrice, currency, language)}
                </Typography>
                <Box sx={{ display: 'flex', gap: 1 }}>
                  <Button
                    variant="outlined"
                    size="small"
                    startIcon={<Message />}
                    onClick={() => navigate('/messages')}
                  >
                    {t('common:actions.message')}
                  </Button>
                  {booking.status === 'completed' && (
                    <Button
                      variant="contained"
                      size="small"
                      onClick={() => navigate(`/review/${booking.id}`)}
                    >
                      {t('booking:writeReview')}
                    </Button>
                  )}
                  {booking.status === 'confirmed' && (
                    <Button
                      variant="contained"
                      size="small"
                      onClick={() => navigate(`/property/${property.id}`)}
                    >
                      {t('booking:viewDetails')}
                    </Button>
                  )}
                </Box>
              </Box>
            </CardContent>
          </Grid>
        </Grid>
      </Card>
    );
  };

  const renderEmptyState = () => (
    <Box sx={{ textAlign: 'center', py: 8 }}>
      <CalendarMonth sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
      <Typography variant="h6" gutterBottom>
        {t('trips:noTrips')}
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        {t('trips:noTripsDescription')}
      </Typography>
      <Button variant="contained" onClick={() => navigate('/search')}>
        {t('trips:startExploring')}
      </Button>
    </Box>
  );

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" fontWeight={600} gutterBottom>
        {t('common:navigation.trips')}
      </Typography>

      <Tabs
        value={tabValue}
        onChange={(_, value) => setTabValue(value)}
        sx={{ mb: 4, borderBottom: 1, borderColor: 'divider' }}
      >
        <Tab label={`${t('trips:upcoming')} (${upcomingBookings.length})`} />
        <Tab label={`${t('trips:past')} (${pastBookings.length})`} />
        <Tab label={`${t('trips:cancelled')} (${cancelledBookings.length})`} />
      </Tabs>

      {tabValue === 0 && (
        upcomingBookings.length > 0
          ? upcomingBookings.map(renderBookingCard)
          : renderEmptyState()
      )}
      {tabValue === 1 && (
        pastBookings.length > 0
          ? pastBookings.map(renderBookingCard)
          : renderEmptyState()
      )}
      {tabValue === 2 && (
        cancelledBookings.length > 0
          ? cancelledBookings.map(renderBookingCard)
          : renderEmptyState()
      )}
    </Container>
  );
};

export default TripsPage;
