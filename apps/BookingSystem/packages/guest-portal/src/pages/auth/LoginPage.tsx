import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  Typography,
  TextField,
  Button,
  Paper,
  Divider,
  Alert,
  Tab,
  Tabs,
  InputAdornment,
  IconButton,
} from '@mui/material';
import {
  Visibility,
  VisibilityOff,
  Google,
  Apple,
} from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../contexts/AuthContext';

const LoginPage: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { login, loginWithPhone, isLoading } = useAuth();

  const [tabValue, setTabValue] = useState(0);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  // Email login state
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // Phone login state
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [otpSent, setOtpSent] = useState(false);

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const success = await login(email, password);
    if (success) {
      navigate('/');
    } else {
      setError(t('auth:errors.invalidCredentials'));
    }
  };

  const handleSendOtp = async () => {
    // Simulate sending OTP
    await new Promise((resolve) => setTimeout(resolve, 500));
    setOtpSent(true);
  };

  const handlePhoneLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const success = await loginWithPhone(phone, otp);
    if (success) {
      navigate('/');
    } else {
      setError(t('auth:errors.invalidOtp'));
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
          {/* Logo */}
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
            {t('common:app.name')}
          </Typography>

          <Typography variant="h5" fontWeight={600} textAlign="center" gutterBottom>
            {t('auth:login.title')}
          </Typography>
          <Typography variant="body1" color="text.secondary" textAlign="center" sx={{ mb: 4 }}>
            {t('auth:login.subtitle')}
          </Typography>

          {error && (
            <Alert severity="error" sx={{ mb: 3 }}>
              {error}
            </Alert>
          )}

          {/* Login Method Tabs */}
          <Tabs
            value={tabValue}
            onChange={(_, value) => setTabValue(value)}
            variant="fullWidth"
            sx={{ mb: 3 }}
          >
            <Tab label={t('auth:login.withEmail')} />
            <Tab label={t('auth:login.withPhone')} />
          </Tabs>

          {/* Email Login */}
          {tabValue === 0 && (
            <form onSubmit={handleEmailLogin}>
              <TextField
                fullWidth
                label={t('auth:fields.email')}
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                sx={{ mb: 2 }}
              />
              <TextField
                fullWidth
                label={t('auth:fields.password')}
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
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
                sx={{ mb: 1 }}
              />
              <Box sx={{ textAlign: 'right', mb: 3 }}>
                <Typography
                  component={Link}
                  to="/forgot-password"
                  variant="body2"
                  sx={{
                    color: 'primary.main',
                    textDecoration: 'none',
                    '&:hover': { textDecoration: 'underline' },
                  }}
                >
                  {t('auth:login.forgotPassword')}
                </Typography>
              </Box>
              <Button
                type="submit"
                variant="contained"
                fullWidth
                size="large"
                disabled={isLoading}
                sx={{ mb: 2 }}
              >
                {isLoading ? t('common:actions.loading') : t('auth:login.submit')}
              </Button>
            </form>
          )}

          {/* Phone Login */}
          {tabValue === 1 && (
            <form onSubmit={handlePhoneLogin}>
              <TextField
                fullWidth
                label={t('auth:fields.phone')}
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required
                disabled={otpSent}
                placeholder={t('common:placeholders.phoneNumber')}
                sx={{ mb: 2 }}
              />
              {!otpSent ? (
                <Button
                  variant="contained"
                  fullWidth
                  size="large"
                  onClick={handleSendOtp}
                  disabled={!phone}
                  sx={{ mb: 2 }}
                >
                  {t('auth:login.sendOtp')}
                </Button>
              ) : (
                <>
                  <TextField
                    fullWidth
                    label={t('auth:fields.otp')}
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    required
                    placeholder={t('common:placeholders.otpCode')}
                    sx={{ mb: 2 }}
                  />
                  <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
                    <Button
                      variant="outlined"
                      fullWidth
                      size="large"
                      onClick={() => setOtpSent(false)}
                    >
                      {t('auth:login.changeNumber')}
                    </Button>
                    <Button
                      type="submit"
                      variant="contained"
                      fullWidth
                      size="large"
                      disabled={isLoading}
                    >
                      {isLoading ? t('common:actions.loading') : t('auth:login.verifyOtp')}
                    </Button>
                  </Box>
                </>
              )}
            </form>
          )}

          {/* Social Login */}
          <Divider sx={{ my: 3 }}>
            <Typography variant="body2" color="text.secondary">
              {t('auth:login.orContinueWith')}
            </Typography>
          </Divider>

          <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
            <Button
              variant="outlined"
              fullWidth
              size="large"
              startIcon={<Google />}
              sx={{ borderColor: 'divider', color: 'text.primary' }}
            >
              {t('common:socialProviders.google')}
            </Button>
            <Button
              variant="outlined"
              fullWidth
              size="large"
              startIcon={<Apple />}
              sx={{ borderColor: 'divider', color: 'text.primary' }}
            >
              {t('common:socialProviders.apple')}
            </Button>
          </Box>

          {/* Register Link */}
          <Typography variant="body2" textAlign="center" color="text.secondary">
            {t('auth:login.noAccount')}{' '}
            <Typography
              component={Link}
              to="/register"
              variant="body2"
              sx={{
                color: 'primary.main',
                textDecoration: 'none',
                fontWeight: 500,
                '&:hover': { textDecoration: 'underline' },
              }}
            >
              {t('auth:login.signUp')}
            </Typography>
          </Typography>
        </Paper>
      </Container>
    </Box>
  );
};

export default LoginPage;
