import React, { useState } from 'react';
import {
  Box,
  Typography,
  Paper,
  Grid2 as Grid,
  Button,
  IconButton,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
} from '@mui/material';
import {
  ChevronLeft,
  ChevronRight,
  Block,
  AttachMoney,
} from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import { mockProperties } from '@staygcc/shared/mock-data';
import { useLocale } from '../../contexts/LocaleContext';

const CalendarPage: React.FC = () => {
  const { t } = useTranslation();
  const { language } = useLocale();

  const [selectedProperty, setSelectedProperty] = useState(mockProperties[0]?.id || '');
  const [currentDate, setCurrentDate] = useState(new Date());
  const [blockDialogOpen, setBlockDialogOpen] = useState(false);
  const [priceDialogOpen, setPriceDialogOpen] = useState(false);
  const [, setSelectedDate] = useState<Date | null>(null);

  const properties = mockProperties;

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDay = firstDay.getDay();

    const days: (number | null)[] = [];
    for (let i = 0; i < startingDay; i++) {
      days.push(null);
    }
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(i);
    }
    return days;
  };

  const goToPreviousMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const goToNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  const handleDateClick = (day: number) => {
    setSelectedDate(new Date(currentDate.getFullYear(), currentDate.getMonth(), day));
  };

  const days = getDaysInMonth(currentDate);
  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  // Mock booking data for calendar
  const bookedDates = [5, 6, 7, 15, 16, 17, 18, 25, 26];
  const blockedDates = [10, 11];
  const customPriceDates: Record<number, number> = { 20: 550, 21: 550, 22: 600 };

  const selectedPropertyData = properties.find((p) => p.id === selectedProperty);
  const _title = language === 'ar' ? selectedPropertyData?.titleAr : selectedPropertyData?.titleEn;
  void _title; // Reserved for future use

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography variant="h4" fontWeight={600}>
          {t('host:navigation.calendar')}
        </Typography>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button
            variant="outlined"
            startIcon={<Block />}
            onClick={() => setBlockDialogOpen(true)}
          >
            {t('host:calendar.blockDates')}
          </Button>
          <Button
            variant="outlined"
            startIcon={<AttachMoney />}
            onClick={() => setPriceDialogOpen(true)}
          >
            {t('host:calendar.customPricing')}
          </Button>
        </Box>
      </Box>

      <Paper sx={{ p: 3, mb: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <FormControl sx={{ minWidth: 300 }}>
            <InputLabel>{t('host:calendar.selectProperty')}</InputLabel>
            <Select
              value={selectedProperty}
              label={t('host:calendar.selectProperty')}
              onChange={(e) => setSelectedProperty(e.target.value)}
            >
              {properties.map((property) => {
                const propertyTitle = language === 'ar' ? property.titleAr : property.titleEn;
                return (
                  <MenuItem key={property.id} value={property.id}>
                    {propertyTitle}
                  </MenuItem>
                );
              })}
            </Select>
          </FormControl>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <IconButton onClick={goToPreviousMonth}>
              <ChevronLeft />
            </IconButton>
            <Typography variant="h6" sx={{ minWidth: 200, textAlign: 'center' }}>
              {currentDate.toLocaleDateString(language === 'ar' ? 'ar-SA' : 'en-US', {
                month: 'long',
                year: 'numeric',
              })}
            </Typography>
            <IconButton onClick={goToNextMonth}>
              <ChevronRight />
            </IconButton>
          </Box>
        </Box>

        {/* Calendar Legend */}
        <Box sx={{ display: 'flex', gap: 3, mb: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Box sx={{ width: 16, height: 16, backgroundColor: 'success.light', borderRadius: 1 }} />
            <Typography variant="body2">{t('host:calendar.booked')}</Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Box sx={{ width: 16, height: 16, backgroundColor: 'grey.400', borderRadius: 1 }} />
            <Typography variant="body2">{t('host:calendar.blocked')}</Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Box sx={{ width: 16, height: 16, backgroundColor: 'warning.light', borderRadius: 1 }} />
            <Typography variant="body2">{t('host:calendar.customPrice')}</Typography>
          </Box>
        </Box>

        {/* Calendar Grid */}
        <Grid container spacing={0}>
          {weekDays.map((day) => (
            <Grid key={day} size={{ xs: 12 / 7 }}>
              <Box
                sx={{
                  py: 1,
                  textAlign: 'center',
                  fontWeight: 600,
                  backgroundColor: 'grey.100',
                }}
              >
                {day}
              </Box>
            </Grid>
          ))}
          {days.map((day, index) => (
            <Grid key={index} size={{ xs: 12 / 7 }}>
              <Box
                onClick={() => day && handleDateClick(day)}
                sx={{
                  minHeight: 80,
                  p: 1,
                  border: '1px solid',
                  borderColor: 'divider',
                  cursor: day ? 'pointer' : 'default',
                  backgroundColor: day
                    ? bookedDates.includes(day)
                      ? 'success.light'
                      : blockedDates.includes(day)
                      ? 'grey.300'
                      : customPriceDates[day]
                      ? 'warning.light'
                      : 'background.paper'
                    : 'grey.50',
                  '&:hover': day ? { backgroundColor: 'action.hover' } : {},
                }}
              >
                {day && (
                  <>
                    <Typography variant="body2" fontWeight={500}>
                      {day}
                    </Typography>
                    {customPriceDates[day] ? (
                      <Typography variant="caption" color="warning.dark" fontWeight={600}>
                        SAR {customPriceDates[day]}
                      </Typography>
                    ) : selectedPropertyData ? (
                      <Typography variant="caption" color="text.secondary">
                        SAR {selectedPropertyData.pricing.basePrice}
                      </Typography>
                    ) : null}
                  </>
                )}
              </Box>
            </Grid>
          ))}
        </Grid>
      </Paper>

      {/* Block Dates Dialog */}
      <Dialog open={blockDialogOpen} onClose={() => setBlockDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>{t('host:calendar.blockDates')}</DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 2 }}>
            <Grid container spacing={2}>
              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                  fullWidth
                  type="date"
                  label={t('host:calendar.startDate')}
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                  fullWidth
                  type="date"
                  label={t('host:calendar.endDate')}
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>
              <Grid size={{ xs: 12 }}>
                <TextField
                  fullWidth
                  label={t('host:calendar.reason')}
                  placeholder={t('host:calendar.reasonPlaceholder')}
                />
              </Grid>
            </Grid>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setBlockDialogOpen(false)}>{t('common:actions.cancel')}</Button>
          <Button variant="contained" onClick={() => setBlockDialogOpen(false)}>
            {t('host:calendar.blockDates')}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Custom Pricing Dialog */}
      <Dialog open={priceDialogOpen} onClose={() => setPriceDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>{t('host:calendar.customPricing')}</DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 2 }}>
            <Grid container spacing={2}>
              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                  fullWidth
                  type="date"
                  label={t('host:calendar.startDate')}
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                  fullWidth
                  type="date"
                  label={t('host:calendar.endDate')}
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>
              <Grid size={{ xs: 12 }}>
                <TextField
                  fullWidth
                  type="number"
                  label={t('host:calendar.pricePerNight')}
                  InputProps={{ startAdornment: 'SAR ' }}
                />
              </Grid>
            </Grid>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setPriceDialogOpen(false)}>{t('common:actions.cancel')}</Button>
          <Button variant="contained" onClick={() => setPriceDialogOpen(false)}>
            {t('common:actions.save')}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default CalendarPage;
