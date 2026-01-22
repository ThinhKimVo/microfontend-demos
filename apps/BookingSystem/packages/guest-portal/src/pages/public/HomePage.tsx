import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  Typography,
  TextField,
  Button,
  Card,
  CardContent,
  CardMedia,
  Grid2 as Grid,
  Paper,
  InputAdornment,
  Chip,
} from '@mui/material';
import {
  Search,
  LocationOn,
  CalendarMonth,
  People,
  Verified,
  Support,
  Star,
} from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import { mockProperties } from '@staygcc/shared/mock-data';
import { useLocale } from '../../contexts/LocaleContext';
import { formatCurrency } from '@staygcc/shared/utils';

const HomePage: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { language, currency } = useLocale();
  const [searchLocation, setSearchLocation] = useState('');

  const handleSearch = () => {
    navigate(`/search?location=${encodeURIComponent(searchLocation)}`);
  };

  const featuredProperties = mockProperties.slice(0, 4);

  const popularDestinations = [
    { name: t('common:destinations.riyadh'), country: t('common:destinations.saudiArabia'), image: 'https://images.unsplash.com/photo-1586724237569-f3d0c1dee8c6?w=400' },
    { name: t('common:destinations.dubai'), country: t('common:destinations.uae'), image: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=400' },
    { name: t('common:destinations.jeddah'), country: t('common:destinations.saudiArabia'), image: 'https://images.unsplash.com/photo-1578681041175-9717c638f1a0?w=400' },
    { name: t('common:destinations.abuDhabi'), country: t('common:destinations.uae'), image: 'https://images.unsplash.com/photo-1512632578888-169bbbc64f33?w=400' },
  ];

  return (
    <Box>
      {/* Hero Section */}
      <Box
        sx={{
          position: 'relative',
          height: { xs: '60vh', md: '70vh' },
          minHeight: 400,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: 'primary.main',
          overflow: 'hidden',
        }}
      >
        <Box
          sx={{
            position: 'absolute',
            inset: 0,
            backgroundImage: 'url(https://images.unsplash.com/photo-1582719508461-905c673771fd?w=1600)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            opacity: 0.3,
          }}
        />
        <Container maxWidth="md" sx={{ position: 'relative', zIndex: 1, textAlign: 'center' }}>
          <Typography
            variant="h2"
            component="h1"
            sx={{
              color: 'white',
              fontWeight: 700,
              mb: 2,
              fontSize: { xs: '2rem', md: '3rem' },
            }}
          >
            {t('common:home.heroTitle')}
          </Typography>
          <Typography
            variant="h6"
            sx={{
              color: 'rgba(255,255,255,0.9)',
              mb: 4,
              fontWeight: 400,
            }}
          >
            {t('common:home.heroSubtitle')}
          </Typography>

          {/* Search Bar */}
          <Paper
            elevation={4}
            sx={{
              p: 2,
              borderRadius: 3,
              maxWidth: 700,
              mx: 'auto',
            }}
          >
            <Grid container spacing={2} alignItems="center">
              <Grid size={{ xs: 12, md: 5 }}>
                <TextField
                  fullWidth
                  placeholder={t('common:search.whereTo')}
                  value={searchLocation}
                  onChange={(e) => setSearchLocation(e.target.value)}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <LocationOn color="action" />
                      </InputAdornment>
                    ),
                  }}
                  variant="outlined"
                  size="small"
                />
              </Grid>
              <Grid size={{ xs: 6, md: 3 }}>
                <TextField
                  fullWidth
                  placeholder={t('common:search.checkIn')}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <CalendarMonth color="action" />
                      </InputAdornment>
                    ),
                  }}
                  variant="outlined"
                  size="small"
                />
              </Grid>
              <Grid size={{ xs: 6, md: 2 }}>
                <TextField
                  fullWidth
                  placeholder={t('common:search.guests')}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <People color="action" />
                      </InputAdornment>
                    ),
                  }}
                  variant="outlined"
                  size="small"
                />
              </Grid>
              <Grid size={{ xs: 12, md: 2 }}>
                <Button
                  fullWidth
                  variant="contained"
                  size="large"
                  onClick={handleSearch}
                  startIcon={<Search />}
                  sx={{ borderRadius: 2 }}
                >
                  {t('common:actions.search')}
                </Button>
              </Grid>
            </Grid>
          </Paper>
        </Container>
      </Box>

      {/* Popular Destinations */}
      <Container maxWidth="lg" sx={{ py: 6 }}>
        <Typography variant="h4" component="h2" fontWeight={600} gutterBottom>
          {t('common:home.popularDestinations')}
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
          {t('common:home.discoverPlaces')}
        </Typography>
        <Grid container spacing={3}>
          {popularDestinations.map((destination) => (
            <Grid key={destination.name} size={{ xs: 6, sm: 3 }}>
              <Card
                sx={{
                  cursor: 'pointer',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: 4,
                  },
                  transition: 'all 0.3s ease',
                }}
                onClick={() => navigate(`/search?location=${encodeURIComponent(destination.name)}`)}
              >
                <CardMedia
                  component="img"
                  height="160"
                  image={destination.image}
                  alt={destination.name}
                />
                <CardContent sx={{ pb: 2 }}>
                  <Typography variant="subtitle1" fontWeight={600}>
                    {destination.name}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {destination.country}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* Featured Properties */}
      <Box sx={{ backgroundColor: 'background.default', py: 6 }}>
        <Container maxWidth="lg">
          <Typography variant="h4" component="h2" fontWeight={600} gutterBottom>
            {t('common:home.featuredProperties')}
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
            {t('common:home.handpickedStays')}
          </Typography>
          <Grid container spacing={3}>
            {featuredProperties.map((property) => (
              <Grid key={property.id} size={{ xs: 12, sm: 6, md: 3 }}>
                <Card
                  sx={{
                    height: '100%',
                    cursor: 'pointer',
                    '&:hover': {
                      transform: 'translateY(-4px)',
                      boxShadow: 4,
                    },
                    transition: 'all 0.3s ease',
                  }}
                  onClick={() => navigate(`/property/${property.id}`)}
                >
                  <Box sx={{ position: 'relative' }}>
                    <CardMedia
                      component="img"
                      height="200"
                      image={property.photos[0]?.url || 'https://via.placeholder.com/400x300'}
                      alt={language === 'ar' ? property.titleAr : property.titleEn}
                    />
                    {property.instantBook && (
                      <Chip
                        size="small"
                        label={t('property:badges.instantBook')}
                        sx={{
                          position: 'absolute',
                          top: 8,
                          left: 8,
                          backgroundColor: 'white',
                          fontWeight: 500,
                        }}
                      />
                    )}
                  </Box>
                  <CardContent>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
                      <Typography variant="subtitle1" fontWeight={600} noWrap sx={{ flex: 1 }}>
                        {language === 'ar' ? property.titleAr : property.titleEn}
                      </Typography>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, ml: 1 }}>
                        <Star sx={{ fontSize: 16, color: 'warning.main' }} />
                        <Typography variant="body2" fontWeight={500}>
                          {property.rating?.toFixed(1)}
                        </Typography>
                      </Box>
                    </Box>
                    <Typography variant="body2" color="text.secondary" noWrap>
                      {property.location.city}, {property.location.country}
                    </Typography>
                    <Typography variant="subtitle1" fontWeight={600} sx={{ mt: 1 }}>
                      {formatCurrency(property.pricing.basePrice, currency, language)}
                      <Typography component="span" variant="body2" color="text.secondary" fontWeight={400}>
                        {' '}/{t('common:labels.night')}
                      </Typography>
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* Why Choose Us */}
      <Container maxWidth="lg" sx={{ py: 6 }}>
        <Typography variant="h4" component="h2" fontWeight={600} textAlign="center" gutterBottom>
          {t('common:home.whyChooseUs')}
        </Typography>
        <Typography variant="body1" color="text.secondary" textAlign="center" sx={{ mb: 5, maxWidth: 600, mx: 'auto' }}>
          {t('common:home.whyChooseUsSubtitle')}
        </Typography>
        <Grid container spacing={4}>
          <Grid size={{ xs: 12, md: 4 }}>
            <Paper
              elevation={0}
              sx={{
                p: 4,
                textAlign: 'center',
                height: '100%',
                backgroundColor: 'background.default',
                borderRadius: 3,
              }}
            >
              <Box
                sx={{
                  width: 64,
                  height: 64,
                  borderRadius: '50%',
                  backgroundColor: 'primary.main',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  mx: 'auto',
                  mb: 2,
                }}
              >
                <Verified sx={{ fontSize: 32, color: 'white' }} />
              </Box>
              <Typography variant="h6" fontWeight={600} gutterBottom>
                {t('common:home.verifiedProperties')}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {t('common:home.verifiedPropertiesDesc')}
              </Typography>
            </Paper>
          </Grid>
          <Grid size={{ xs: 12, md: 4 }}>
            <Paper
              elevation={0}
              sx={{
                p: 4,
                textAlign: 'center',
                height: '100%',
                backgroundColor: 'background.default',
                borderRadius: 3,
              }}
            >
              <Box
                sx={{
                  width: 64,
                  height: 64,
                  borderRadius: '50%',
                  backgroundColor: 'secondary.main',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  mx: 'auto',
                  mb: 2,
                }}
              >
                <Support sx={{ fontSize: 32, color: 'white' }} />
              </Box>
              <Typography variant="h6" fontWeight={600} gutterBottom>
                {t('common:home.support247')}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {t('common:home.support247Desc')}
              </Typography>
            </Paper>
          </Grid>
          <Grid size={{ xs: 12, md: 4 }}>
            <Paper
              elevation={0}
              sx={{
                p: 4,
                textAlign: 'center',
                height: '100%',
                backgroundColor: 'background.default',
                borderRadius: 3,
              }}
            >
              <Box
                sx={{
                  width: 64,
                  height: 64,
                  borderRadius: '50%',
                  backgroundColor: 'success.main',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  mx: 'auto',
                  mb: 2,
                }}
              >
                <Star sx={{ fontSize: 32, color: 'white' }} />
              </Box>
              <Typography variant="h6" fontWeight={600} gutterBottom>
                {t('common:home.bestPrices')}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {t('common:home.bestPricesDesc')}
              </Typography>
            </Paper>
          </Grid>
        </Grid>
      </Container>

      {/* CTA Section */}
      <Box
        sx={{
          backgroundColor: 'primary.main',
          py: 6,
        }}
      >
        <Container maxWidth="md" sx={{ textAlign: 'center' }}>
          <Typography
            variant="h4"
            component="h2"
            fontWeight={600}
            sx={{ color: 'white', mb: 2 }}
          >
            {t('common:home.becomeHost')}
          </Typography>
          <Typography
            variant="body1"
            sx={{ color: 'rgba(255,255,255,0.9)', mb: 4, maxWidth: 500, mx: 'auto' }}
          >
            {t('common:home.becomeHostDesc')}
          </Typography>
          <Button
            variant="contained"
            size="large"
            sx={{
              backgroundColor: 'white',
              color: 'primary.main',
              px: 4,
              '&:hover': {
                backgroundColor: 'rgba(255,255,255,0.9)',
              },
            }}
            href="https://host.staygcc.com"
          >
            {t('common:home.startHosting')}
          </Button>
        </Container>
      </Box>
    </Box>
  );
};

export default HomePage;
