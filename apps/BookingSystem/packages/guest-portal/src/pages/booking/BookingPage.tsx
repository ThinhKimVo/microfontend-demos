import React, { useState, useEffect } from 'react';
import { useParams, useSearchParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  Typography,
  Grid2 as Grid,
  Paper,
  Button,
  TextField,
  Divider,
  Stepper,
  Step,
  StepLabel,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
  Alert,
  Card,
  CardMedia,
} from '@mui/material';
import {
  CreditCard,
  AccountBalance,
  CheckCircle,
  Star,
} from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import { mockProperties } from '@staygcc/shared/mock-data';
import { useLocale } from '../../contexts/LocaleContext';
import { useAuth } from '../../contexts/AuthContext';
import { formatCurrency } from '@staygcc/shared/utils';
import { Property } from '@staygcc/shared/types';

const BookingPage: React.FC = () => {
  const { propertyId } = useParams<{ propertyId: string }>();
  const [searchParams] = useSearchParams();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { language, currency } = useLocale();
  const { user, isAuthenticated } = useAuth();

  const [property, setProperty] = useState<Property | null>(null);
  const [activeStep, setActiveStep] = useState(0);
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [isProcessing, setIsProcessing] = useState(false);
  const [bookingComplete, setBookingComplete] = useState(false);

  const guests = Number(searchParams.get('guests')) || 1;
  const nights = 1; // Default to 1 night for demo

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    const foundProperty = mockProperties.find((p) => p.id === propertyId);
    setProperty(foundProperty || null);
  }, [propertyId, isAuthenticated, navigate]);

  if (!property) {
    return (
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Typography variant="h5" textAlign="center">
          {t('property:notFound')}
        </Typography>
      </Container>
    );
  }

  const title = language === 'ar' ? property.titleAr : property.titleEn;
  const subtotal = property.pricing.basePrice * nights;
  const cleaningFee = property.pricing.cleaningFee || 0;
  const serviceFee = property.pricing.serviceFee || 0;
  const total = subtotal + cleaningFee + serviceFee;

  const steps = [
    t('booking:steps.review'),
    t('booking:steps.payment'),
    t('booking:steps.confirmation'),
  ];

  const handleNext = async () => {
    if (activeStep === 1) {
      setIsProcessing(true);
      // Simulate payment processing
      await new Promise((resolve) => setTimeout(resolve, 2000));
      setIsProcessing(false);
      setBookingComplete(true);
    }
    setActiveStep((prev) => prev + 1);
  };

  const handleBack = () => {
    setActiveStep((prev) => prev - 1);
  };

  if (bookingComplete) {
    return (
      <Container maxWidth="sm" sx={{ py: 8, textAlign: 'center' }}>
        <CheckCircle sx={{ fontSize: 80, color: 'success.main', mb: 3 }} />
        <Typography variant="h4" fontWeight={600} gutterBottom>
          {t('booking:confirmed.title')}
        </Typography>
        <Typography variant="body1" color="text.secondary" paragraph>
          {t('booking:confirmed.message')}
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 4 }}>
          {t('booking:confirmed.confirmationNumber')}: <strong>STY-{Date.now().toString().slice(-8)}</strong>
        </Typography>
        <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center' }}>
          <Button variant="contained" onClick={() => navigate('/trips')}>
            {t('booking:confirmed.viewTrips')}
          </Button>
          <Button variant="outlined" onClick={() => navigate('/')}>
            {t('booking:confirmed.backToHome')}
          </Button>
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" fontWeight={600} gutterBottom>
        {t('booking:title')}
      </Typography>

      <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
        {steps.map((label) => (
          <Step key={label}>
            <StepLabel>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>

      <Grid container spacing={4}>
        {/* Main Content */}
        <Grid size={{ xs: 12, md: 7 }}>
          {activeStep === 0 && (
            <Box>
              {/* Trip Details */}
              <Paper sx={{ p: 3, mb: 3 }}>
                <Typography variant="h6" fontWeight={600} gutterBottom>
                  {t('booking:tripDetails')}
                </Typography>
                <Grid container spacing={3}>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <Typography variant="subtitle2" color="text.secondary">
                      {t('booking:dates')}
                    </Typography>
                    <Typography variant="body1">
                      {t('booking:selectDates')}
                    </Typography>
                  </Grid>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <Typography variant="subtitle2" color="text.secondary">
                      {t('booking:guests')}
                    </Typography>
                    <Typography variant="body1">
                      {guests} {guests === 1 ? t('booking:guest') : t('booking:guestsPlural')}
                    </Typography>
                  </Grid>
                </Grid>
              </Paper>

              {/* Guest Information */}
              <Paper sx={{ p: 3, mb: 3 }}>
                <Typography variant="h6" fontWeight={600} gutterBottom>
                  {t('booking:guestInfo')}
                </Typography>
                <Grid container spacing={2}>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <TextField
                      fullWidth
                      label={t('auth:fields.firstName')}
                      defaultValue={user?.firstNameEn}
                    />
                  </Grid>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <TextField
                      fullWidth
                      label={t('auth:fields.lastName')}
                      defaultValue={user?.lastNameEn}
                    />
                  </Grid>
                  <Grid size={{ xs: 12 }}>
                    <TextField
                      fullWidth
                      label={t('auth:fields.email')}
                      type="email"
                      defaultValue={user?.email}
                    />
                  </Grid>
                  <Grid size={{ xs: 12 }}>
                    <TextField
                      fullWidth
                      label={t('auth:fields.phone')}
                      defaultValue={user?.phone}
                    />
                  </Grid>
                </Grid>
              </Paper>

              {/* Special Requests */}
              <Paper sx={{ p: 3 }}>
                <Typography variant="h6" fontWeight={600} gutterBottom>
                  {t('booking:specialRequests')}
                </Typography>
                <TextField
                  fullWidth
                  multiline
                  rows={3}
                  placeholder={t('booking:specialRequestsPlaceholder')}
                />
              </Paper>
            </Box>
          )}

          {activeStep === 1 && (
            <Box>
              {/* Payment Method */}
              <Paper sx={{ p: 3, mb: 3 }}>
                <Typography variant="h6" fontWeight={600} gutterBottom>
                  {t('booking:paymentMethod')}
                </Typography>
                <FormControl component="fieldset">
                  <RadioGroup
                    value={paymentMethod}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                  >
                    <Paper
                      variant="outlined"
                      sx={{
                        p: 2,
                        mb: 2,
                        cursor: 'pointer',
                        borderColor: paymentMethod === 'card' ? 'primary.main' : 'divider',
                      }}
                      onClick={() => setPaymentMethod('card')}
                    >
                      <FormControlLabel
                        value="card"
                        control={<Radio />}
                        label={
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <CreditCard />
                            <Typography>{t('booking:creditCard')}</Typography>
                          </Box>
                        }
                      />
                    </Paper>
                    <Paper
                      variant="outlined"
                      sx={{
                        p: 2,
                        cursor: 'pointer',
                        borderColor: paymentMethod === 'bank' ? 'primary.main' : 'divider',
                      }}
                      onClick={() => setPaymentMethod('bank')}
                    >
                      <FormControlLabel
                        value="bank"
                        control={<Radio />}
                        label={
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <AccountBalance />
                            <Typography>{t('booking:bankTransfer')}</Typography>
                          </Box>
                        }
                      />
                    </Paper>
                  </RadioGroup>
                </FormControl>
              </Paper>

              {/* Card Details */}
              {paymentMethod === 'card' && (
                <Paper sx={{ p: 3 }}>
                  <Typography variant="h6" fontWeight={600} gutterBottom>
                    {t('booking:cardDetails')}
                  </Typography>
                  <Grid container spacing={2}>
                    <Grid size={{ xs: 12 }}>
                      <TextField
                        fullWidth
                        label={t('booking:cardNumber')}
                        placeholder="1234 5678 9012 3456"
                      />
                    </Grid>
                    <Grid size={{ xs: 12 }}>
                      <TextField
                        fullWidth
                        label={t('booking:cardholderName')}
                        placeholder="John Doe"
                      />
                    </Grid>
                    <Grid size={{ xs: 6 }}>
                      <TextField
                        fullWidth
                        label={t('booking:expiryDate')}
                        placeholder="MM/YY"
                      />
                    </Grid>
                    <Grid size={{ xs: 6 }}>
                      <TextField
                        fullWidth
                        label={t('booking:cvv')}
                        placeholder="123"
                      />
                    </Grid>
                  </Grid>
                </Paper>
              )}

              {paymentMethod === 'bank' && (
                <Alert severity="info" sx={{ mb: 3 }}>
                  {t('booking:bankTransferInfo')}
                </Alert>
              )}
            </Box>
          )}
        </Grid>

        {/* Booking Summary */}
        <Grid size={{ xs: 12, md: 5 }}>
          <Paper sx={{ p: 3, position: 'sticky', top: 80 }}>
            <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
              <Card sx={{ width: 120, height: 80, flexShrink: 0 }}>
                <CardMedia
                  component="img"
                  height="80"
                  image={property.photos[0]?.url}
                  alt={title}
                />
              </Card>
              <Box>
                <Typography variant="subtitle1" fontWeight={600} sx={{ mb: 0.5 }}>
                  {title}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {property.location.city}, {property.location.country}
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mt: 0.5 }}>
                  <Star sx={{ fontSize: 14, color: 'warning.main' }} />
                  <Typography variant="body2">
                    {property.rating?.toFixed(1)} ({property.reviewCount})
                  </Typography>
                </Box>
              </Box>
            </Box>

            <Divider sx={{ my: 2 }} />

            <Typography variant="h6" fontWeight={600} gutterBottom>
              {t('booking:priceDetails')}
            </Typography>

            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
              <Typography variant="body2">
                {formatCurrency(property.pricing.basePrice, currency, language)} x {nights} {nights === 1 ? t('common:labels.night') : t('common:labels.nights')}
              </Typography>
              <Typography variant="body2">
                {formatCurrency(subtotal, currency, language)}
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
              <Typography variant="body2">{t('booking:cleaningFee')}</Typography>
              <Typography variant="body2">
                {formatCurrency(cleaningFee, currency, language)}
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
              <Typography variant="body2">{t('booking:serviceFee')}</Typography>
              <Typography variant="body2">
                {formatCurrency(serviceFee, currency, language)}
              </Typography>
            </Box>

            <Divider sx={{ my: 2 }} />

            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
              <Typography variant="subtitle1" fontWeight={600}>
                {t('booking:total')}
              </Typography>
              <Typography variant="subtitle1" fontWeight={600}>
                {formatCurrency(total, currency, language)}
              </Typography>
            </Box>

            <Box sx={{ display: 'flex', gap: 2 }}>
              {activeStep > 0 && (
                <Button variant="outlined" onClick={handleBack} fullWidth>
                  {t('common:actions.back')}
                </Button>
              )}
              <Button
                variant="contained"
                onClick={handleNext}
                fullWidth
                disabled={isProcessing}
              >
                {isProcessing
                  ? t('booking:processing')
                  : activeStep === 1
                  ? t('booking:confirmAndPay')
                  : t('common:actions.continue')}
              </Button>
            </Box>

            <Typography variant="caption" color="text.secondary" display="block" sx={{ mt: 2, textAlign: 'center' }}>
              {t('booking:termsAgreement')}
            </Typography>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default BookingPage;
