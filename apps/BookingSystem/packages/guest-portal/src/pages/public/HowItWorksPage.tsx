import React from 'react';
import {
  Box,
  Container,
  Typography,
  Grid2 as Grid,
  Paper,
  Button,
} from '@mui/material';
import {
  Search,
  DateRange,
  Payment,
  Key,
  Star,
  Support,
} from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

const HowItWorksPage: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const guestSteps = [
    {
      icon: <Search sx={{ fontSize: 48 }} />,
      number: '01',
      title: t('common:howItWorks.guest.step1.title'),
      description: t('common:howItWorks.guest.step1.description'),
    },
    {
      icon: <DateRange sx={{ fontSize: 48 }} />,
      number: '02',
      title: t('common:howItWorks.guest.step2.title'),
      description: t('common:howItWorks.guest.step2.description'),
    },
    {
      icon: <Payment sx={{ fontSize: 48 }} />,
      number: '03',
      title: t('common:howItWorks.guest.step3.title'),
      description: t('common:howItWorks.guest.step3.description'),
    },
    {
      icon: <Key sx={{ fontSize: 48 }} />,
      number: '04',
      title: t('common:howItWorks.guest.step4.title'),
      description: t('common:howItWorks.guest.step4.description'),
    },
  ];

  const hostSteps = [
    {
      number: '01',
      title: t('common:howItWorks.host.step1.title'),
      description: t('common:howItWorks.host.step1.description'),
    },
    {
      number: '02',
      title: t('common:howItWorks.host.step2.title'),
      description: t('common:howItWorks.host.step2.description'),
    },
    {
      number: '03',
      title: t('common:howItWorks.host.step3.title'),
      description: t('common:howItWorks.host.step3.description'),
    },
    {
      number: '04',
      title: t('common:howItWorks.host.step4.title'),
      description: t('common:howItWorks.host.step4.description'),
    },
  ];

  const features = [
    {
      icon: <Star sx={{ fontSize: 32, color: 'warning.main' }} />,
      title: t('common:howItWorks.features.verified.title'),
      description: t('common:howItWorks.features.verified.description'),
    },
    {
      icon: <Support sx={{ fontSize: 32, color: 'primary.main' }} />,
      title: t('common:howItWorks.features.support.title'),
      description: t('common:howItWorks.features.support.description'),
    },
    {
      icon: <Payment sx={{ fontSize: 32, color: 'success.main' }} />,
      title: t('common:howItWorks.features.payment.title'),
      description: t('common:howItWorks.features.payment.description'),
    },
  ];

  return (
    <Box>
      {/* Hero Section */}
      <Box
        sx={{
          position: 'relative',
          py: 12,
          backgroundColor: 'primary.main',
        }}
      >
        <Container maxWidth="md" sx={{ textAlign: 'center' }}>
          <Typography
            variant="h3"
            component="h1"
            fontWeight={700}
            sx={{ color: 'white', mb: 2 }}
          >
            {t('common:howItWorks.title')}
          </Typography>
          <Typography
            variant="h6"
            sx={{ color: 'rgba(255,255,255,0.9)', fontWeight: 400 }}
          >
            {t('common:howItWorks.subtitle')}
          </Typography>
        </Container>
      </Box>

      {/* Guest Steps */}
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Typography variant="h4" component="h2" fontWeight={600} textAlign="center" gutterBottom>
          {t('common:howItWorks.guest.title')}
        </Typography>
        <Typography
          variant="body1"
          color="text.secondary"
          textAlign="center"
          sx={{ mb: 6, maxWidth: 600, mx: 'auto' }}
        >
          {t('common:howItWorks.guest.subtitle')}
        </Typography>
        <Grid container spacing={4}>
          {guestSteps.map((step, index) => (
            <Grid key={step.number} size={{ xs: 12, sm: 6, md: 3 }}>
              <Paper
                elevation={0}
                sx={{
                  p: 4,
                  height: '100%',
                  textAlign: 'center',
                  backgroundColor: 'background.default',
                  borderRadius: 3,
                  position: 'relative',
                }}
              >
                <Typography
                  variant="h2"
                  sx={{
                    position: 'absolute',
                    top: 16,
                    right: 16,
                    color: 'divider',
                    fontWeight: 700,
                    fontSize: '3rem',
                    lineHeight: 1,
                  }}
                >
                  {step.number}
                </Typography>
                <Box sx={{ color: 'primary.main', mb: 2 }}>
                  {step.icon}
                </Box>
                <Typography variant="h6" fontWeight={600} gutterBottom>
                  {step.title}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {step.description}
                </Typography>
                {index < guestSteps.length - 1 && (
                  <Box
                    sx={{
                      display: { xs: 'none', md: 'block' },
                      position: 'absolute',
                      right: -32,
                      top: '50%',
                      transform: 'translateY(-50%)',
                      color: 'divider',
                      fontSize: '2rem',
                    }}
                  >
                    →
                  </Box>
                )}
              </Paper>
            </Grid>
          ))}
        </Grid>
        <Box sx={{ textAlign: 'center', mt: 4 }}>
          <Button
            variant="contained"
            size="large"
            onClick={() => navigate('/search')}
            sx={{ px: 4 }}
          >
            {t('common:howItWorks.startSearching')}
          </Button>
        </Box>
      </Container>

      {/* Host Steps */}
      <Box sx={{ backgroundColor: 'background.default', py: 8 }}>
        <Container maxWidth="lg">
          <Typography variant="h4" component="h2" fontWeight={600} textAlign="center" gutterBottom>
            {t('common:howItWorks.host.title')}
          </Typography>
          <Typography
            variant="body1"
            color="text.secondary"
            textAlign="center"
            sx={{ mb: 6, maxWidth: 600, mx: 'auto' }}
          >
            {t('common:howItWorks.host.subtitle')}
          </Typography>
          <Grid container spacing={4}>
            {hostSteps.map((step, index) => (
              <Grid key={step.number} size={{ xs: 12, md: 6 }}>
                <Paper
                  sx={{
                    p: 4,
                    height: '100%',
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: 3,
                    borderRadius: 3,
                  }}
                >
                  <Box
                    sx={{
                      width: 48,
                      height: 48,
                      borderRadius: '50%',
                      backgroundColor: 'primary.main',
                      color: 'white',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontWeight: 700,
                      fontSize: '1.25rem',
                      flexShrink: 0,
                    }}
                  >
                    {index + 1}
                  </Box>
                  <Box>
                    <Typography variant="h6" fontWeight={600} gutterBottom>
                      {step.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {step.description}
                    </Typography>
                  </Box>
                </Paper>
              </Grid>
            ))}
          </Grid>
          <Box sx={{ textAlign: 'center', mt: 4 }}>
            <Button
              variant="contained"
              size="large"
              href="https://host.staygcc.com"
              sx={{ px: 4 }}
            >
              {t('common:howItWorks.becomeHost')}
            </Button>
          </Box>
        </Container>
      </Box>

      {/* Features */}
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Typography variant="h4" component="h2" fontWeight={600} textAlign="center" gutterBottom>
          {t('common:howItWorks.features.title')}
        </Typography>
        <Typography
          variant="body1"
          color="text.secondary"
          textAlign="center"
          sx={{ mb: 6, maxWidth: 600, mx: 'auto' }}
        >
          {t('common:howItWorks.features.subtitle')}
        </Typography>
        <Grid container spacing={4}>
          {features.map((feature) => (
            <Grid key={feature.title} size={{ xs: 12, md: 4 }}>
              <Box
                sx={{
                  textAlign: 'center',
                  p: 4,
                }}
              >
                <Box sx={{ mb: 2 }}>{feature.icon}</Box>
                <Typography variant="h6" fontWeight={600} gutterBottom>
                  {feature.title}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {feature.description}
                </Typography>
              </Box>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* CTA */}
      <Box
        sx={{
          backgroundColor: 'primary.main',
          py: 8,
        }}
      >
        <Container maxWidth="md" sx={{ textAlign: 'center' }}>
          <Typography
            variant="h4"
            component="h2"
            fontWeight={600}
            sx={{ color: 'white', mb: 2 }}
          >
            {t('common:howItWorks.cta.title')}
          </Typography>
          <Typography
            variant="body1"
            sx={{ color: 'rgba(255,255,255,0.9)', mb: 4 }}
          >
            {t('common:howItWorks.cta.description')}
          </Typography>
          <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Button
              variant="contained"
              size="large"
              onClick={() => navigate('/register')}
              sx={{
                backgroundColor: 'white',
                color: 'primary.main',
                px: 4,
                '&:hover': {
                  backgroundColor: 'rgba(255,255,255,0.9)',
                },
              }}
            >
              {t('common:actions.signUp')}
            </Button>
            <Button
              variant="outlined"
              size="large"
              onClick={() => navigate('/search')}
              sx={{
                borderColor: 'white',
                color: 'white',
                px: 4,
                '&:hover': {
                  borderColor: 'white',
                  backgroundColor: 'rgba(255,255,255,0.1)',
                },
              }}
            >
              {t('common:howItWorks.exploreProperties')}
            </Button>
          </Box>
        </Container>
      </Box>
    </Box>
  );
};

export default HowItWorksPage;
