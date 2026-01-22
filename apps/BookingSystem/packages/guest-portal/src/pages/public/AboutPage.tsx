import React from 'react';
import {
  Box,
  Container,
  Typography,
  Grid2 as Grid,
  Paper,
  Avatar,
} from '@mui/material';
import {
  Public,
  Handshake,
  TrendingUp,
  Security,
} from '@mui/icons-material';
import { useTranslation } from 'react-i18next';

const AboutPage: React.FC = () => {
  const { t } = useTranslation();

  const values = [
    {
      icon: <Public sx={{ fontSize: 40 }} />,
      title: t('common:about.values.global.title'),
      description: t('common:about.values.global.description'),
    },
    {
      icon: <Handshake sx={{ fontSize: 40 }} />,
      title: t('common:about.values.trust.title'),
      description: t('common:about.values.trust.description'),
    },
    {
      icon: <TrendingUp sx={{ fontSize: 40 }} />,
      title: t('common:about.values.innovation.title'),
      description: t('common:about.values.innovation.description'),
    },
    {
      icon: <Security sx={{ fontSize: 40 }} />,
      title: t('common:about.values.safety.title'),
      description: t('common:about.values.safety.description'),
    },
  ];

  const teamMembers = [
    {
      name: 'Ahmed Al-Rahman',
      role: t('common:about.team.ceo'),
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200',
    },
    {
      name: 'Sarah Johnson',
      role: t('common:about.team.cto'),
      image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200',
    },
    {
      name: 'Mohammed Al-Faisal',
      role: t('common:about.team.coo'),
      image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200',
    },
    {
      name: 'Fatima Al-Saud',
      role: t('common:about.team.head_of_customer'),
      image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200',
    },
  ];

  const stats = [
    { value: '50,000+', label: t('common:about.stats.properties') },
    { value: '1M+', label: t('common:about.stats.guests') },
    { value: '6', label: t('common:about.stats.countries') },
    { value: '10,000+', label: t('common:about.stats.hosts') },
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
            {t('common:about.title')}
          </Typography>
          <Typography
            variant="h6"
            sx={{ color: 'rgba(255,255,255,0.9)', fontWeight: 400 }}
          >
            {t('common:about.subtitle')}
          </Typography>
        </Container>
      </Box>

      {/* Our Story */}
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Grid container spacing={6} alignItems="center">
          <Grid size={{ xs: 12, md: 6 }}>
            <Typography variant="h4" component="h2" fontWeight={600} gutterBottom>
              {t('common:about.story.title')}
            </Typography>
            <Typography variant="body1" color="text.secondary" paragraph>
              {t('common:about.story.paragraph1')}
            </Typography>
            <Typography variant="body1" color="text.secondary" paragraph>
              {t('common:about.story.paragraph2')}
            </Typography>
            <Typography variant="body1" color="text.secondary">
              {t('common:about.story.paragraph3')}
            </Typography>
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <Box
              component="img"
              src="https://images.unsplash.com/photo-1582719508461-905c673771fd?w=600"
              alt="About StayGCC"
              sx={{
                width: '100%',
                borderRadius: 3,
                boxShadow: 3,
              }}
            />
          </Grid>
        </Grid>
      </Container>

      {/* Stats */}
      <Box sx={{ backgroundColor: 'background.default', py: 6 }}>
        <Container maxWidth="lg">
          <Grid container spacing={4}>
            {stats.map((stat) => (
              <Grid key={stat.label} size={{ xs: 6, md: 3 }}>
                <Box sx={{ textAlign: 'center' }}>
                  <Typography
                    variant="h3"
                    component="div"
                    fontWeight={700}
                    color="primary.main"
                  >
                    {stat.value}
                  </Typography>
                  <Typography variant="body1" color="text.secondary">
                    {stat.label}
                  </Typography>
                </Box>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* Our Values */}
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Typography variant="h4" component="h2" fontWeight={600} textAlign="center" gutterBottom>
          {t('common:about.values.title')}
        </Typography>
        <Typography
          variant="body1"
          color="text.secondary"
          textAlign="center"
          sx={{ mb: 6, maxWidth: 600, mx: 'auto' }}
        >
          {t('common:about.values.subtitle')}
        </Typography>
        <Grid container spacing={4}>
          {values.map((value) => (
            <Grid key={value.title} size={{ xs: 12, sm: 6, md: 3 }}>
              <Paper
                elevation={0}
                sx={{
                  p: 4,
                  height: '100%',
                  textAlign: 'center',
                  backgroundColor: 'background.default',
                  borderRadius: 3,
                }}
              >
                <Box
                  sx={{
                    color: 'primary.main',
                    mb: 2,
                  }}
                >
                  {value.icon}
                </Box>
                <Typography variant="h6" fontWeight={600} gutterBottom>
                  {value.title}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {value.description}
                </Typography>
              </Paper>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* Our Team */}
      <Box sx={{ backgroundColor: 'background.default', py: 8 }}>
        <Container maxWidth="lg">
          <Typography variant="h4" component="h2" fontWeight={600} textAlign="center" gutterBottom>
            {t('common:about.team.title')}
          </Typography>
          <Typography
            variant="body1"
            color="text.secondary"
            textAlign="center"
            sx={{ mb: 6, maxWidth: 600, mx: 'auto' }}
          >
            {t('common:about.team.subtitle')}
          </Typography>
          <Grid container spacing={4} justifyContent="center">
            {teamMembers.map((member) => (
              <Grid key={member.name} size={{ xs: 6, sm: 3 }}>
                <Box sx={{ textAlign: 'center' }}>
                  <Avatar
                    src={member.image}
                    alt={member.name}
                    sx={{
                      width: 120,
                      height: 120,
                      mx: 'auto',
                      mb: 2,
                      boxShadow: 2,
                    }}
                  />
                  <Typography variant="subtitle1" fontWeight={600}>
                    {member.name}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {member.role}
                  </Typography>
                </Box>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* Mission */}
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
            sx={{ color: 'white', mb: 3 }}
          >
            {t('common:about.mission.title')}
          </Typography>
          <Typography
            variant="h6"
            sx={{ color: 'rgba(255,255,255,0.9)', fontWeight: 400, lineHeight: 1.8 }}
          >
            {t('common:about.mission.description')}
          </Typography>
        </Container>
      </Box>
    </Box>
  );
};

export default AboutPage;
