import React, { useState } from 'react';
import {
  Box,
  Typography,
  Paper,
  Grid2 as Grid,
  Avatar,
  Button,
  TextField,
  Divider,
  Switch,
  FormControlLabel,
  Alert,
  Snackbar,
  MenuItem,
  IconButton,
  Chip,
} from '@mui/material';
import {
  Edit,
  PhotoCamera,
  Verified,
  Language,
  CurrencyExchange,
  Notifications,
  Security,
  AccountBalance,
  Star,
} from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../contexts/AuthContext';
import { useLocale } from '../../contexts/LocaleContext';
import { CURRENCIES, CURRENCY_INFO } from '@staygcc/shared/utils';

const ProfilePage: React.FC = () => {
  const { t } = useTranslation();
  const { host, updateProfile } = useAuth();
  const { language, currency, setLanguage, setCurrency } = useLocale();

  const [isEditing, setIsEditing] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [formData, setFormData] = useState({
    firstNameEn: host?.firstNameEn || '',
    lastNameEn: host?.lastNameEn || '',
    email: host?.email || '',
    phone: host?.phone || '',
    businessName: host?.businessName || '',
    aboutEn: host?.aboutEn || '',
  });

  const [notifications, setNotifications] = useState({
    newBooking: true,
    bookingReminder: true,
    newMessage: true,
    newReview: true,
    payoutNotification: true,
    marketing: false,
  });

  const [payoutInfo] = useState({
    bankName: 'Al Rajhi Bank',
    accountNumber: '****1234',
    iban: 'SA****1234',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSave = async () => {
    const success = await updateProfile(formData);
    if (success) {
      setShowSuccess(true);
      setIsEditing(false);
    }
  };

  return (
    <Box>
      <Typography variant="h4" fontWeight={600} sx={{ mb: 4 }}>
        {t('host:navigation.profile')}
      </Typography>

      <Grid container spacing={4}>
        {/* Profile Card */}
        <Grid size={{ xs: 12, md: 4 }}>
          <Paper sx={{ p: 4, textAlign: 'center' }}>
            <Box sx={{ position: 'relative', display: 'inline-block', mb: 2 }}>
              <Avatar
                src={host?.profileImage}
                alt={host?.firstNameEn}
                sx={{ width: 120, height: 120, mx: 'auto' }}
              >
                {host?.firstNameEn?.charAt(0)}
              </Avatar>
              <IconButton
                sx={{
                  position: 'absolute',
                  bottom: 0,
                  right: 0,
                  backgroundColor: 'primary.main',
                  color: 'white',
                  '&:hover': { backgroundColor: 'primary.dark' },
                }}
                size="small"
              >
                <PhotoCamera fontSize="small" />
              </IconButton>
            </Box>
            <Typography variant="h5" fontWeight={600} gutterBottom>
              {host?.firstNameEn} {host?.lastNameEn}
            </Typography>
            {host?.businessName && (
              <Typography variant="body2" color="text.secondary" gutterBottom>
                {host.businessName}
              </Typography>
            )}
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1, mt: 1 }}>
              {host?.isSuperhost && (
                <Chip
                  icon={<Star sx={{ color: 'warning.main' }} />}
                  label={t('host:superhost')}
                  size="small"
                  sx={{ backgroundColor: 'warning.light' }}
                />
              )}
              {host?.idVerificationStatus === 'verified' && (
                <Chip
                  icon={<Verified sx={{ color: 'primary.main' }} />}
                  label={t('host:verified')}
                  size="small"
                  sx={{ backgroundColor: 'primary.lighter' }}
                />
              )}
            </Box>

            <Divider sx={{ my: 3 }} />

            {/* Host Stats */}
            <Grid container spacing={2}>
              <Grid size={{ xs: 4 }}>
                <Typography variant="h5" fontWeight={600}>
                  {host?.totalListings || 0}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {t('host:profile.listings')}
                </Typography>
              </Grid>
              <Grid size={{ xs: 4 }}>
                <Typography variant="h5" fontWeight={600}>
                  {host?.totalReviews || 0}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {t('host:profile.reviews')}
                </Typography>
              </Grid>
              <Grid size={{ xs: 4 }}>
                <Typography variant="h5" fontWeight={600}>
                  {host?.averageRating?.toFixed(1) || '-'}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {t('host:profile.rating')}
                </Typography>
              </Grid>
            </Grid>
          </Paper>
        </Grid>

        {/* Profile Settings */}
        <Grid size={{ xs: 12, md: 8 }}>
          {/* Personal Information */}
          <Paper sx={{ p: 3, mb: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
              <Typography variant="h6" fontWeight={600}>
                {t('host:profile.personalInfo')}
              </Typography>
              {!isEditing ? (
                <Button startIcon={<Edit />} onClick={() => setIsEditing(true)}>
                  {t('common:actions.edit')}
                </Button>
              ) : (
                <Box sx={{ display: 'flex', gap: 1 }}>
                  <Button variant="outlined" onClick={() => setIsEditing(false)}>
                    {t('common:actions.cancel')}
                  </Button>
                  <Button variant="contained" onClick={handleSave}>
                    {t('common:actions.save')}
                  </Button>
                </Box>
              )}
            </Box>
            <Grid container spacing={3}>
              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                  fullWidth
                  label={t('auth:fields.firstName')}
                  name="firstNameEn"
                  value={formData.firstNameEn}
                  onChange={handleChange}
                  disabled={!isEditing}
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                  fullWidth
                  label={t('auth:fields.lastName')}
                  name="lastNameEn"
                  value={formData.lastNameEn}
                  onChange={handleChange}
                  disabled={!isEditing}
                />
              </Grid>
              <Grid size={{ xs: 12 }}>
                <TextField
                  fullWidth
                  label={t('auth:fields.businessName')}
                  name="businessName"
                  value={formData.businessName}
                  onChange={handleChange}
                  disabled={!isEditing}
                />
              </Grid>
              <Grid size={{ xs: 12 }}>
                <TextField
                  fullWidth
                  label={t('auth:fields.email')}
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  disabled={!isEditing}
                />
              </Grid>
              <Grid size={{ xs: 12 }}>
                <TextField
                  fullWidth
                  label={t('auth:fields.phone')}
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  disabled={!isEditing}
                />
              </Grid>
              <Grid size={{ xs: 12 }}>
                <TextField
                  fullWidth
                  label={t('host:profile.about')}
                  name="aboutEn"
                  value={formData.aboutEn}
                  onChange={handleChange}
                  disabled={!isEditing}
                  multiline
                  rows={3}
                />
              </Grid>
            </Grid>
          </Paper>

          {/* Payout Settings */}
          <Paper sx={{ p: 3, mb: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
              <AccountBalance color="action" />
              <Typography variant="h6" fontWeight={600}>
                {t('host:profile.payoutSettings')}
              </Typography>
            </Box>
            <Grid container spacing={3}>
              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                  fullWidth
                  label={t('host:profile.bankName')}
                  value={payoutInfo.bankName}
                  disabled
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                  fullWidth
                  label={t('host:profile.accountNumber')}
                  value={payoutInfo.accountNumber}
                  disabled
                />
              </Grid>
              <Grid size={{ xs: 12 }}>
                <TextField
                  fullWidth
                  label={t('host:profile.iban')}
                  value={payoutInfo.iban}
                  disabled
                />
              </Grid>
            </Grid>
            <Button variant="outlined" sx={{ mt: 2 }}>
              {t('host:profile.updatePayoutMethod')}
            </Button>
          </Paper>

          {/* Preferences */}
          <Paper sx={{ p: 3, mb: 3 }}>
            <Typography variant="h6" fontWeight={600} sx={{ mb: 3 }}>
              {t('host:profile.preferences')}
            </Typography>
            <Grid container spacing={3}>
              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                  fullWidth
                  select
                  label={t('host:profile.language')}
                  value={language}
                  onChange={(e) => setLanguage(e.target.value as 'en' | 'ar')}
                  InputProps={{
                    startAdornment: <Language sx={{ mr: 1, color: 'action.active' }} />,
                  }}
                >
                  <MenuItem value="en">English</MenuItem>
                  <MenuItem value="ar">العربية</MenuItem>
                </TextField>
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                  fullWidth
                  select
                  label={t('host:profile.currency')}
                  value={currency}
                  onChange={(e) => setCurrency(e.target.value as typeof currency)}
                  InputProps={{
                    startAdornment: <CurrencyExchange sx={{ mr: 1, color: 'action.active' }} />,
                  }}
                >
                  {CURRENCIES.map((curr) => (
                    <MenuItem key={curr} value={curr}>
                      {curr} - {CURRENCY_INFO[curr].name}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>
            </Grid>
          </Paper>

          {/* Notifications */}
          <Paper sx={{ p: 3, mb: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
              <Notifications color="action" />
              <Typography variant="h6" fontWeight={600}>
                {t('host:profile.notifications')}
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              {Object.entries(notifications).map(([key, value]) => (
                <FormControlLabel
                  key={key}
                  control={
                    <Switch
                      checked={value}
                      onChange={(e) => setNotifications({ ...notifications, [key]: e.target.checked })}
                    />
                  }
                  label={t(`host:profile.${key}`)}
                />
              ))}
            </Box>
          </Paper>

          {/* Security */}
          <Paper sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
              <Security color="action" />
              <Typography variant="h6" fontWeight={600}>
                {t('host:profile.security')}
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <Button variant="outlined" fullWidth sx={{ justifyContent: 'flex-start' }}>
                {t('host:profile.changePassword')}
              </Button>
              <Button variant="outlined" fullWidth sx={{ justifyContent: 'flex-start' }}>
                {t('host:profile.twoFactorAuth')}
              </Button>
              <Button variant="outlined" fullWidth sx={{ justifyContent: 'flex-start' }}>
                {t('host:profile.loginHistory')}
              </Button>
            </Box>
          </Paper>
        </Grid>
      </Grid>

      <Snackbar
        open={showSuccess}
        autoHideDuration={3000}
        onClose={() => setShowSuccess(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert severity="success">{t('host:profile.updateSuccess')}</Alert>
      </Snackbar>
    </Box>
  );
};

export default ProfilePage;
