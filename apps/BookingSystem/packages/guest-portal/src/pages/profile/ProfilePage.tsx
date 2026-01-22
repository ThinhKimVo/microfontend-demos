import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  Typography,
  Grid2 as Grid,
  Paper,
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
} from '@mui/material';
import {
  Edit,
  PhotoCamera,
  Verified,
  Language,
  CurrencyExchange,
  Notifications,
  Security,
  Logout,
} from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../contexts/AuthContext';
import { useLocale } from '../../contexts/LocaleContext';
import { CURRENCIES, CURRENCY_INFO } from '@staygcc/shared/utils';

const ProfilePage: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { user, isAuthenticated, logout, updateProfile } = useAuth();
  const { language, currency, setLanguage, setCurrency } = useLocale();

  const [isEditing, setIsEditing] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [formData, setFormData] = useState({
    firstNameEn: user?.firstNameEn || '',
    lastNameEn: user?.lastNameEn || '',
    email: user?.email || '',
    phone: user?.phone || '',
  });

  const [notifications, setNotifications] = useState({
    email: true,
    sms: false,
    push: true,
    marketing: false,
  });

  if (!isAuthenticated || !user) {
    navigate('/login');
    return null;
  }

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

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Grid container spacing={4}>
        {/* Profile Card */}
        <Grid size={{ xs: 12, md: 4 }}>
          <Paper sx={{ p: 4, textAlign: 'center' }}>
            <Box sx={{ position: 'relative', display: 'inline-block', mb: 2 }}>
              <Avatar
                src={user.profileImage}
                alt={user.firstNameEn}
                sx={{ width: 120, height: 120, mx: 'auto' }}
              >
                {user.firstNameEn?.charAt(0)}
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
              {user.firstNameEn} {user.lastNameEn}
            </Typography>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              {user.email}
            </Typography>
            {user.idVerificationStatus === 'verified' && (
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 0.5, mt: 1 }}>
                <Verified color="primary" fontSize="small" />
                <Typography variant="body2" color="primary">
                  {t('profile:verified')}
                </Typography>
              </Box>
            )}
            <Divider sx={{ my: 3 }} />
            <Button
              variant="outlined"
              color="error"
              fullWidth
              startIcon={<Logout />}
              onClick={handleLogout}
            >
              {t('common:actions.logout')}
            </Button>
          </Paper>
        </Grid>

        {/* Profile Settings */}
        <Grid size={{ xs: 12, md: 8 }}>
          {/* Personal Information */}
          <Paper sx={{ p: 3, mb: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
              <Typography variant="h6" fontWeight={600}>
                {t('profile:personalInfo')}
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
            </Grid>
          </Paper>

          {/* Preferences */}
          <Paper sx={{ p: 3, mb: 3 }}>
            <Typography variant="h6" fontWeight={600} sx={{ mb: 3 }}>
              {t('profile:preferences')}
            </Typography>
            <Grid container spacing={3}>
              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                  fullWidth
                  select
                  label={t('profile:language')}
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
                  label={t('profile:currency')}
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
                {t('profile:notifications')}
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              <FormControlLabel
                control={
                  <Switch
                    checked={notifications.email}
                    onChange={(e) => setNotifications({ ...notifications, email: e.target.checked })}
                  />
                }
                label={t('profile:emailNotifications')}
              />
              <FormControlLabel
                control={
                  <Switch
                    checked={notifications.sms}
                    onChange={(e) => setNotifications({ ...notifications, sms: e.target.checked })}
                  />
                }
                label={t('profile:smsNotifications')}
              />
              <FormControlLabel
                control={
                  <Switch
                    checked={notifications.push}
                    onChange={(e) => setNotifications({ ...notifications, push: e.target.checked })}
                  />
                }
                label={t('profile:pushNotifications')}
              />
              <FormControlLabel
                control={
                  <Switch
                    checked={notifications.marketing}
                    onChange={(e) => setNotifications({ ...notifications, marketing: e.target.checked })}
                  />
                }
                label={t('profile:marketingEmails')}
              />
            </Box>
          </Paper>

          {/* Security */}
          <Paper sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
              <Security color="action" />
              <Typography variant="h6" fontWeight={600}>
                {t('profile:security')}
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <Button variant="outlined" fullWidth sx={{ justifyContent: 'flex-start' }}>
                {t('profile:changePassword')}
              </Button>
              <Button variant="outlined" fullWidth sx={{ justifyContent: 'flex-start' }}>
                {t('profile:twoFactorAuth')}
              </Button>
              <Button variant="outlined" fullWidth sx={{ justifyContent: 'flex-start' }}>
                {t('profile:linkedAccounts')}
              </Button>
              <Button variant="outlined" color="error" fullWidth sx={{ justifyContent: 'flex-start' }}>
                {t('profile:deleteAccount')}
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
        <Alert severity="success">{t('profile:updateSuccess')}</Alert>
      </Snackbar>
    </Container>
  );
};

export default ProfilePage;
