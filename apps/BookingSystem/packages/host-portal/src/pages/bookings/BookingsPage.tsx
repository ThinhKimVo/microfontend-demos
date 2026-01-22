import React, { useState } from 'react';
import {
  Box,
  Typography,
  Paper,
  Tabs,
  Tab,
  Card,
  CardContent,
  Grid2 as Grid,
  Avatar,
  Button,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
} from '@mui/material';
import {
  CalendarMonth,
  Message,
  Check,
  Close,
} from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import { mockBookings, mockProperties } from '@staygcc/shared/mock-data';
import { useLocale } from '../../contexts/LocaleContext';
import { formatCurrency, formatDate } from '@staygcc/shared/utils';

const BookingsPage: React.FC = () => {
  const { t } = useTranslation();
  const { language, currency } = useLocale();

  const [tabValue, setTabValue] = useState(0);
  const [selectedBooking, setSelectedBooking] = useState<string | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [declineReason, setDeclineReason] = useState('');

  const bookings = mockBookings;

  const pendingBookings = bookings.filter((b) => b.status === 'pending');
  const confirmedBookings = bookings.filter((b) => b.status === 'confirmed');
  const completedBookings = bookings.filter((b) => b.status === 'completed');
  const cancelledBookings = bookings.filter((b) => b.status === 'cancelled' || b.status === 'rejected');

  const getCurrentBookings = () => {
    switch (tabValue) {
      case 0:
        return pendingBookings;
      case 1:
        return confirmedBookings;
      case 2:
        return completedBookings;
      case 3:
        return cancelledBookings;
      default:
        return [];
    }
  };

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

  const handleAccept = (bookingId: string) => {
    // Handle accept booking
    console.log('Accepting booking:', bookingId);
  };

  const handleDecline = (bookingId: string) => {
    setSelectedBooking(bookingId);
    setDialogOpen(true);
  };

  const confirmDecline = () => {
    console.log('Declining booking:', selectedBooking, 'Reason:', declineReason);
    setDialogOpen(false);
    setSelectedBooking(null);
    setDeclineReason('');
  };

  const renderBookingCard = (booking: typeof bookings[0]) => {
    const property = mockProperties.find((p) => p.id === booking.propertyId);
    const title = language === 'ar' ? property?.titleAr : property?.titleEn;
    const isPending = booking.status === 'pending';

    return (
      <Card key={booking.id} sx={{ mb: 2 }}>
        <CardContent>
          <Grid container spacing={2} alignItems="center">
            <Grid size={{ xs: 12, md: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Avatar sx={{ width: 48, height: 48 }}>
                  {booking.guestId.charAt(0).toUpperCase()}
                </Avatar>
                <Box>
                  <Typography variant="subtitle1" fontWeight={600}>
                    Guest Name
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {booking.adults + booking.children} {t('booking:guests')}
                  </Typography>
                </Box>
              </Box>
            </Grid>
            <Grid size={{ xs: 12, md: 3 }}>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                {title}
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                <CalendarMonth fontSize="small" color="action" />
                <Typography variant="body2">
                  {formatDate(booking.checkInDate, 'PP', language)} - {formatDate(booking.checkOutDate, 'PP', language)}
                </Typography>
              </Box>
            </Grid>
            <Grid size={{ xs: 12, md: 2 }}>
              <Typography variant="h6" fontWeight={600}>
                {formatCurrency(booking.pricing.totalPrice, currency, language)}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {booking.pricing.nights} {t('common:labels.nights')}
              </Typography>
            </Grid>
            <Grid size={{ xs: 12, md: 2 }}>
              <Chip
                label={t(`booking:status.${booking.status}`)}
                color={getStatusColor(booking.status) as 'success' | 'warning' | 'info' | 'error' | 'default'}
                size="small"
              />
            </Grid>
            <Grid size={{ xs: 12, md: 2 }}>
              {isPending ? (
                <Box sx={{ display: 'flex', gap: 1 }}>
                  <Button
                    size="small"
                    variant="contained"
                    color="success"
                    startIcon={<Check />}
                    onClick={() => handleAccept(booking.id)}
                  >
                    {t('host:booking.accept')}
                  </Button>
                  <Button
                    size="small"
                    variant="outlined"
                    color="error"
                    startIcon={<Close />}
                    onClick={() => handleDecline(booking.id)}
                  >
                    {t('host:booking.decline')}
                  </Button>
                </Box>
              ) : (
                <Button
                  size="small"
                  variant="outlined"
                  startIcon={<Message />}
                >
                  {t('common:actions.message')}
                </Button>
              )}
            </Grid>
          </Grid>
          {booking.specialRequests && (
            <Box sx={{ mt: 2, p: 2, backgroundColor: 'grey.50', borderRadius: 1 }}>
              <Typography variant="body2" color="text.secondary">
                <strong>{t('host:booking.guestMessage')}:</strong> {booking.specialRequests}
              </Typography>
            </Box>
          )}
        </CardContent>
      </Card>
    );
  };

  return (
    <Box>
      <Typography variant="h4" fontWeight={600} sx={{ mb: 4 }}>
        {t('host:navigation.bookings')}
      </Typography>

      <Paper sx={{ mb: 3 }}>
        <Tabs
          value={tabValue}
          onChange={(_, value) => setTabValue(value)}
          variant="fullWidth"
        >
          <Tab label={`${t('host:booking.pending')} (${pendingBookings.length})`} />
          <Tab label={`${t('host:booking.confirmed')} (${confirmedBookings.length})`} />
          <Tab label={`${t('host:booking.completed')} (${completedBookings.length})`} />
          <Tab label={`${t('host:booking.cancelled')} (${cancelledBookings.length})`} />
        </Tabs>
      </Paper>

      {getCurrentBookings().length === 0 ? (
        <Paper sx={{ p: 4, textAlign: 'center' }}>
          <Typography variant="body1" color="text.secondary">
            {t('host:booking.noBookings')}
          </Typography>
        </Paper>
      ) : (
        getCurrentBookings().map(renderBookingCard)
      )}

      {/* Decline Dialog */}
      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>{t('host:booking.declineBooking')}</DialogTitle>
        <DialogContent>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            {t('host:booking.declineMessage')}
          </Typography>
          <TextField
            fullWidth
            multiline
            rows={3}
            label={t('host:booking.declineReason')}
            value={declineReason}
            onChange={(e) => setDeclineReason(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogOpen(false)}>{t('common:actions.cancel')}</Button>
          <Button variant="contained" color="error" onClick={confirmDecline}>
            {t('host:booking.confirmDecline')}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default BookingsPage;
