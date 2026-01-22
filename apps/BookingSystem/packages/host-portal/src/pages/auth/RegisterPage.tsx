import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  Typography,
  TextField,
  Button,
  Paper,
  Alert,
  InputAdornment,
  IconButton,
  Grid2 as Grid,
  FormControlLabel,
  Checkbox,
  MenuItem,
} from '@mui/material';
import {
  Visibility,
  VisibilityOff,
} from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../contexts/AuthContext';

const RegisterPage: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { register, isLoading } = useAuth();

  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [acceptTerms, setAcceptTerms] = useState(false);

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    phoneCountryCode: '+966',
    password: '',
    confirmPassword: '',
    businessName: '',
  });

  const countryCodes = [
    { code: '+966', countryKey: 'SA' },
    { code: '+971', countryKey: 'AE' },
    { code: '+973', countryKey: 'BH' },
    { code: '+968', countryKey: 'OM' },
    { code: '+965', countryKey: 'KW' },
    { code: '+974', countryKey: 'QA' },
  ];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError(t('auth:errors.passwordMismatch'));
      return;
    }

    if (formData.password.length < 8) {
      setError(t('auth:errors.passwordTooShort'));
      return;
    }

    if (!acceptTerms) {
      setError(t('auth:errors.acceptTerms'));
      return;
    }

    const success = await register({
      email: formData.email,
      phone: formData.phone,
      phoneCountryCode: formData.phoneCountryCode,
      password: formData.password,
      firstNameEn: formData.firstName,
      lastNameEn: formData.lastName,
      businessName: formData.businessName,
    });

    if (success) {
      navigate('/');
    } else {
      setError(t('auth:errors.registrationFailed'));
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        backgroundColor: 'background.default',
        py: 4,
      }}
    >
      <Container maxWidth="sm">
        <Paper sx={{ p: { xs: 3, sm: 5 }, borderRadius: 3 }}>
          <Typography
            variant="h4"
            component={Link}
            to="/"
            sx={{
              color: 'primary.main',
              textDecoration: 'none',
              fontWeight: 700,
              display: 'block',
              textAlign: 'center',
              mb: 4,
            }}
          >
            {t('common:app.hostPortalName')}
          </Typography>

          <Typography variant="h5" fontWeight={600} textAlign="center" gutterBottom>
            {t('auth:register.hostTitle')}
          </Typography>
          <Typography variant="body1" color="text.secondary" textAlign="center" sx={{ mb: 4 }}>
            {t('auth:register.hostSubtitle')}
          </Typography>

          {error && (
            <Alert severity="error" sx={{ mb: 3 }}>
              {error}
            </Alert>
          )}

          <form onSubmit={handleSubmit}>
            <Grid container spacing={2}>
              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                  fullWidth
                  label={t('auth:fields.firstName')}
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  required
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                  fullWidth
                  label={t('auth:fields.lastName')}
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  required
                />
              </Grid>
              <Grid size={{ xs: 12 }}>
                <TextField
                  fullWidth
                  label={t('auth:fields.businessName')}
                  name="businessName"
                  value={formData.businessName}
                  onChange={handleChange}
                  helperText={t('auth:fields.businessNameHint')}
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
                  required
                />
              </Grid>
              <Grid size={{ xs: 4 }}>
                <TextField
                  fullWidth
                  select
                  label={t('auth:fields.countryCode')}
                  name="phoneCountryCode"
                  value={formData.phoneCountryCode}
                  onChange={handleChange}
                >
                  {countryCodes.map((option) => (
                    <MenuItem key={option.code} value={option.code}>
                      {option.code}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>
              <Grid size={{ xs: 8 }}>
                <TextField
                  fullWidth
                  label={t('auth:fields.phone')}
                  name="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                />
              </Grid>
              <Grid size={{ xs: 12 }}>
                <TextField
                  fullWidth
                  label={t('auth:fields.password')}
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={handleChange}
                  required
                  helperText={t('auth:fields.passwordHint')}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={() => setShowPassword(!showPassword)}
                          edge="end"
                        >
                          {showPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>
              <Grid size={{ xs: 12 }}>
                <TextField
                  fullWidth
                  label={t('auth:fields.confirmPassword')}
                  name="confirmPassword"
                  type={showPassword ? 'text' : 'password'}
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required
                />
              </Grid>
              <Grid size={{ xs: 12 }}>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={acceptTerms}
                      onChange={(e) => setAcceptTerms(e.target.checked)}
                      color="primary"
                    />
                  }
                  label={
                    <Typography variant="body2" color="text.secondary">
                      {t('auth:register.agreeToTerms')}{' '}
                      <Typography
                        component={Link}
                        to="/terms"
                        variant="body2"
                        sx={{
                          color: 'primary.main',
                          textDecoration: 'none',
                          '&:hover': { textDecoration: 'underline' },
                        }}
                      >
                        {t('auth:register.hostTerms')}
                      </Typography>
                    </Typography>
                  }
                />
              </Grid>
              <Grid size={{ xs: 12 }}>
                <Button
                  type="submit"
                  variant="contained"
                  fullWidth
                  size="large"
                  disabled={isLoading}
                >
                  {isLoading ? t('common:actions.loading') : t('auth:register.submitHost')}
                </Button>
              </Grid>
            </Grid>
          </form>

          <Typography variant="body2" textAlign="center" color="text.secondary" sx={{ mt: 3 }}>
            {t('auth:register.haveAccount')}{' '}
            <Typography
              component={Link}
              to="/login"
              variant="body2"
              sx={{
                color: 'primary.main',
                textDecoration: 'none',
                fontWeight: 500,
                '&:hover': { textDecoration: 'underline' },
              }}
            >
              {t('auth:register.signIn')}
            </Typography>
          </Typography>
        </Paper>
      </Container>
    </Box>
  );
};

export default RegisterPage;
