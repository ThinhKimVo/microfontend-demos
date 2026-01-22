import React from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import {
  Box,
  Container,
  Typography,
  Grid2 as Grid,
  Card,
  CardMedia,
  CardContent,
  IconButton,
  Button,
} from '@mui/material';
import {
  Favorite,
  FavoriteBorder,
  Star,
} from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import { mockProperties } from '@staygcc/shared/mock-data';
import { useWishlist } from '../../contexts/WishlistContext';
import { useAuth } from '../../contexts/AuthContext';
import { useLocale } from '../../contexts/LocaleContext';
import { formatCurrency } from '@staygcc/shared/utils';

const WishlistsPage: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const { language, currency } = useLocale();
  const { wishlist, toggleWishlist, clearWishlist } = useWishlist();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  const wishlistProperties = mockProperties.filter((p) => wishlist.includes(p.id));

  if (wishlistProperties.length === 0) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Typography variant="h4" fontWeight={600} gutterBottom>
          {t('common:navigation.wishlists')}
        </Typography>
        <Box sx={{ textAlign: 'center', py: 8 }}>
          <FavoriteBorder sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
          <Typography variant="h6" gutterBottom>
            {t('property:wishlist.empty')}
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            {t('property:wishlist.emptyDescription')}
          </Typography>
          <Button variant="contained" onClick={() => navigate('/search')}>
            {t('property:wishlist.startExploring')}
          </Button>
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Box>
          <Typography variant="h4" fontWeight={600} gutterBottom>
            {t('common:navigation.wishlists')}
          </Typography>
          <Typography variant="body1" color="text.secondary">
            {wishlistProperties.length} {t('property:wishlist.savedProperties')}
          </Typography>
        </Box>
        <Button
          variant="outlined"
          color="error"
          onClick={clearWishlist}
        >
          {t('property:wishlist.clearAll')}
        </Button>
      </Box>

      <Grid container spacing={3}>
        {wishlistProperties.map((property) => {
          const title = language === 'ar' ? property.titleAr : property.titleEn;
          return (
            <Grid key={property.id} size={{ xs: 12, sm: 6, md: 4, lg: 3 }}>
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
              >
                <Box sx={{ position: 'relative' }}>
                  <CardMedia
                    component="img"
                    height="200"
                    image={property.photos[0]?.url || 'https://via.placeholder.com/400x300'}
                    alt={title}
                    onClick={() => navigate(`/property/${property.id}`)}
                  />
                  <IconButton
                    sx={{
                      position: 'absolute',
                      top: 8,
                      right: 8,
                      backgroundColor: 'rgba(255,255,255,0.9)',
                      '&:hover': { backgroundColor: 'white' },
                    }}
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleWishlist(property.id);
                    }}
                  >
                    <Favorite sx={{ color: 'error.main' }} />
                  </IconButton>
                </Box>
                <CardContent onClick={() => navigate(`/property/${property.id}`)}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
                    <Typography variant="subtitle1" fontWeight={600} noWrap sx={{ flex: 1 }}>
                      {title}
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, ml: 1 }}>
                      <Star sx={{ fontSize: 16, color: 'warning.main' }} />
                      <Typography variant="body2" fontWeight={500}>
                        {property.rating?.toFixed(1)}
                      </Typography>
                    </Box>
                  </Box>
                  <Typography variant="body2" color="text.secondary" noWrap sx={{ mb: 1 }}>
                    {property.location.city}, {property.location.country}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                    {property.bedrooms} {t('property:details.bedrooms')} • {property.maxGuests} {t('property:details.guests')}
                  </Typography>
                  <Typography variant="subtitle1" fontWeight={600}>
                    {formatCurrency(property.pricing.basePrice, currency, language)}
                    <Typography component="span" variant="body2" color="text.secondary" fontWeight={400}>
                      {' '}/{t('common:labels.night')}
                    </Typography>
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          );
        })}
      </Grid>
    </Container>
  );
};

export default WishlistsPage;
