import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  Typography,
  Grid2 as Grid,
  Paper,
  Button,
  Divider,
  Avatar,
  Chip,
  IconButton,
  Dialog,
  TextField,
  useMediaQuery,
  useTheme,
  Rating,
} from '@mui/material';
import {
  Favorite,
  FavoriteBorder,
  Share,
  Star,
  Verified,
  Wifi,
  Pool,
  LocalParking,
  AcUnit,
  Kitchen,
  Tv,
  FitnessCenter,
  Pets,
  SmokeFree,
  Close,
  ChevronLeft,
  ChevronRight,
  CalendarMonth,
  People,
} from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import { mockProperties, mockReviews, mockHosts } from '@staygcc/shared/mock-data';
import { useWishlist } from '../../contexts/WishlistContext';
import { useLocale } from '../../contexts/LocaleContext';
import { useAuth } from '../../contexts/AuthContext';
import { formatCurrency, formatDate } from '@staygcc/shared/utils';
import { Property, Review } from '@staygcc/shared/types';

const amenityIcons: Record<string, React.ReactNode> = {
  wifi: <Wifi />,
  pool: <Pool />,
  parking: <LocalParking />,
  airConditioning: <AcUnit />,
  kitchen: <Kitchen />,
  tv: <Tv />,
  gym: <FitnessCenter />,
  petFriendly: <Pets />,
  smokingAllowed: <SmokeFree />,
};

const PropertyDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { t } = useTranslation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const navigate = useNavigate();
  const { language, currency } = useLocale();
  const { isInWishlist, toggleWishlist } = useWishlist();
  const { isAuthenticated } = useAuth();

  const [property, setProperty] = useState<Property | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [galleryOpen, setGalleryOpen] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [guests, setGuests] = useState(1);

  useEffect(() => {
    // Find property from mock data
    const foundProperty = mockProperties.find((p) => p.id === id);
    if (foundProperty) {
      setProperty(foundProperty);
      // Get reviews for this property
      const propertyReviews = mockReviews.filter((r) => r.propertyId === id);
      setReviews(propertyReviews);
    }
  }, [id]);

  if (!property) {
    return (
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Typography variant="h5" textAlign="center">
          {t('property:notFound')}
        </Typography>
      </Container>
    );
  }

  const host = mockHosts.find((h) => h.id === property.hostId);
  const title = language === 'ar' ? property.titleAr : property.titleEn;
  const description = language === 'ar' ? property.descriptionAr : property.descriptionEn;

  const handleBooking = () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    navigate(`/booking/${property.id}?guests=${guests}`);
  };

  const renderAmenities = () => {
    // amenities is an array of strings like ['wifi', 'pool', 'kitchen']
    const amenities = property.amenities || [];

    return amenities.slice(0, 8).map((amenity) => (
      <Box key={amenity} sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
        {amenityIcons[amenity] || <Verified />}
        <Typography variant="body2">
          {t(`property:amenities.${amenity}`)}
        </Typography>
      </Box>
    ));
  };

  return (
    <Box sx={{ pb: { xs: 10, md: 4 } }}>
      {/* Image Gallery */}
      <Box
        sx={{
          position: 'relative',
          cursor: 'pointer',
        }}
        onClick={() => setGalleryOpen(true)}
      >
        {isMobile ? (
          <Box
            component="img"
            src={property.photos[0]?.url || 'https://via.placeholder.com/800x400'}
            alt={title}
            sx={{ width: '100%', height: 300, objectFit: 'cover' }}
          />
        ) : (
          <Container maxWidth="lg" sx={{ pt: 3 }}>
            <Box sx={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr', gap: 1, borderRadius: 2, overflow: 'hidden' }}>
              <Box
                component="img"
                src={property.photos[0]?.url}
                alt={title}
                sx={{ width: '100%', height: 400, objectFit: 'cover', gridRow: 'span 2' }}
              />
              {property.photos.slice(1, 5).map((img, index) => (
                <Box
                  key={img.id}
                  component="img"
                  src={img.url}
                  alt={`${title} ${index + 2}`}
                  sx={{ width: '100%', height: 196, objectFit: 'cover' }}
                />
              ))}
            </Box>
          </Container>
        )}
        <Button
          variant="contained"
          size="small"
          sx={{
            position: 'absolute',
            bottom: 16,
            right: isMobile ? 16 : 80,
            backgroundColor: 'white',
            color: 'text.primary',
            '&:hover': { backgroundColor: 'grey.100' },
          }}
        >
          {t('property:showAllPhotos')}
        </Button>
      </Box>

      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Grid container spacing={4}>
          {/* Main Content */}
          <Grid size={{ xs: 12, md: 8 }}>
            {/* Title & Actions */}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
              <Box>
                <Typography variant="h4" component="h1" fontWeight={600} gutterBottom>
                  {title}
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flexWrap: 'wrap' }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                    <Star sx={{ color: 'warning.main', fontSize: 20 }} />
                    <Typography variant="body1" fontWeight={500}>
                      {property.rating?.toFixed(1)}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      ({property.reviewCount} {t('property:reviews')})
                    </Typography>
                  </Box>
                  <Typography variant="body2" color="text.secondary">
                    {property.location.city}, {property.location.country}
                  </Typography>
                </Box>
              </Box>
              <Box sx={{ display: 'flex', gap: 1 }}>
                <IconButton onClick={() => toggleWishlist(property.id)}>
                  {isInWishlist(property.id) ? (
                    <Favorite sx={{ color: 'error.main' }} />
                  ) : (
                    <FavoriteBorder />
                  )}
                </IconButton>
                <IconButton>
                  <Share />
                </IconButton>
              </Box>
            </Box>

            <Divider sx={{ my: 3 }} />

            {/* Property Info */}
            <Box sx={{ mb: 3 }}>
              <Typography variant="h6" fontWeight={600} gutterBottom>
                {t(`property:types.${property.propertyType}`)} {t('property:hostedBy')} {host?.firstNameEn}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {property.maxGuests} {t('property:details.guests')} • {property.bedrooms} {t('property:details.bedrooms')} • {property.beds} {t('property:details.beds')} • {property.bathrooms} {t('property:details.bathrooms')}
              </Typography>
            </Box>

            {/* Host Info */}
            <Paper sx={{ p: 3, mb: 3, display: 'flex', alignItems: 'center', gap: 2 }}>
              <Avatar
                src={host?.profileImage}
                alt={host?.firstNameEn}
                sx={{ width: 56, height: 56 }}
              />
              <Box sx={{ flex: 1 }}>
                <Typography variant="subtitle1" fontWeight={600}>
                  {t('property:hostedBy')} {host?.firstNameEn}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {host?.isSuperhost && (
                    <Chip
                      size="small"
                      label={t('property:superhost')}
                      sx={{ mr: 1, height: 20, fontSize: '0.7rem' }}
                    />
                  )}
                  {t('property:hostingSince')} {formatDate(host?.hostingSince || '', 'yyyy', language)}
                </Typography>
              </Box>
              <Button variant="outlined">{t('property:contactHost')}</Button>
            </Paper>

            <Divider sx={{ my: 3 }} />

            {/* Description */}
            <Box sx={{ mb: 3 }}>
              <Typography variant="h6" fontWeight={600} gutterBottom>
                {t('property:aboutThisPlace')}
              </Typography>
              <Typography variant="body1" color="text.secondary" sx={{ whiteSpace: 'pre-line' }}>
                {description}
              </Typography>
            </Box>

            <Divider sx={{ my: 3 }} />

            {/* Amenities */}
            <Box sx={{ mb: 3 }}>
              <Typography variant="h6" fontWeight={600} gutterBottom>
                {t('property:amenitiesTitle')}
              </Typography>
              <Grid container>
                <Grid size={{ xs: 12, sm: 6 }}>
                  {renderAmenities().slice(0, 4)}
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  {renderAmenities().slice(4, 8)}
                </Grid>
              </Grid>
            </Box>

            <Divider sx={{ my: 3 }} />

            {/* Reviews */}
            <Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
                <Star sx={{ color: 'warning.main' }} />
                <Typography variant="h6" fontWeight={600}>
                  {property.rating?.toFixed(1)} • {property.reviewCount} {t('property:reviews')}
                </Typography>
              </Box>
              <Grid container spacing={3}>
                {reviews.slice(0, 4).map((review) => (
                  <Grid key={review.id} size={{ xs: 12, sm: 6 }}>
                    <Box>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
                        <Avatar sx={{ width: 40, height: 40 }}>
                          {review.reviewerName.charAt(0)}
                        </Avatar>
                        <Box>
                          <Typography variant="subtitle2" fontWeight={600}>
                            {review.reviewerName}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {formatDate(review.createdAt, 'PP', language)}
                          </Typography>
                        </Box>
                      </Box>
                      <Rating value={review.ratings.overall} readOnly size="small" sx={{ mb: 1 }} />
                      <Typography variant="body2" color="text.secondary" sx={{
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        display: '-webkit-box',
                        WebkitLineClamp: 3,
                        WebkitBoxOrient: 'vertical',
                      }}>
                        {review.content}
                      </Typography>
                    </Box>
                  </Grid>
                ))}
              </Grid>
              {reviews.length > 4 && (
                <Button variant="outlined" sx={{ mt: 3 }}>
                  {t('property:showAllReviews', { count: property.reviewCount })}
                </Button>
              )}
            </Box>
          </Grid>

          {/* Booking Widget - Desktop */}
          {!isMobile && (
            <Grid size={{ xs: 12, md: 4 }}>
              <Paper
                sx={{
                  p: 3,
                  position: 'sticky',
                  top: 80,
                  borderRadius: 3,
                  border: '1px solid',
                  borderColor: 'divider',
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 1, mb: 3 }}>
                  <Typography variant="h5" fontWeight={600}>
                    {formatCurrency(property.pricing.basePrice, currency, language)}
                  </Typography>
                  <Typography variant="body1" color="text.secondary">
                    /{t('common:labels.night')}
                  </Typography>
                </Box>

                <Box sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 2, mb: 2 }}>
                  <Grid container>
                    <Grid size={{ xs: 6 }} sx={{ borderRight: '1px solid', borderColor: 'divider', p: 2 }}>
                      <Typography variant="caption" fontWeight={600}>
                        {t('booking:checkIn')}
                      </Typography>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <CalendarMonth fontSize="small" color="action" />
                        <Typography variant="body2">{t('booking:addDate')}</Typography>
                      </Box>
                    </Grid>
                    <Grid size={{ xs: 6 }} sx={{ p: 2 }}>
                      <Typography variant="caption" fontWeight={600}>
                        {t('booking:checkOut')}
                      </Typography>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <CalendarMonth fontSize="small" color="action" />
                        <Typography variant="body2">{t('booking:addDate')}</Typography>
                      </Box>
                    </Grid>
                    <Grid size={{ xs: 12 }} sx={{ borderTop: '1px solid', borderColor: 'divider', p: 2 }}>
                      <Typography variant="caption" fontWeight={600}>
                        {t('booking:guests')}
                      </Typography>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <People fontSize="small" color="action" />
                        <TextField
                          select
                          variant="standard"
                          value={guests}
                          onChange={(e) => setGuests(Number(e.target.value))}
                          SelectProps={{ native: true }}
                          sx={{ minWidth: 100 }}
                        >
                          {Array.from({ length: property.maxGuests }, (_, i) => i + 1).map((num) => (
                            <option key={num} value={num}>
                              {num} {num === 1 ? t('booking:guest') : t('booking:guestsPlural')}
                            </option>
                          ))}
                        </TextField>
                      </Box>
                    </Grid>
                  </Grid>
                </Box>

                <Button
                  variant="contained"
                  fullWidth
                  size="large"
                  onClick={handleBooking}
                  sx={{ mb: 2 }}
                >
                  {property.instantBook ? t('booking:instantBook') : t('booking:requestToBook')}
                </Button>

                <Typography variant="body2" color="text.secondary" textAlign="center">
                  {t('booking:noChargeYet')}
                </Typography>

                <Divider sx={{ my: 3 }} />

                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant="body2">
                    {formatCurrency(property.pricing.basePrice, currency, language)} x 1 {t('common:labels.night')}
                  </Typography>
                  <Typography variant="body2">
                    {formatCurrency(property.pricing.basePrice, currency, language)}
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant="body2">{t('booking:cleaningFee')}</Typography>
                  <Typography variant="body2">
                    {formatCurrency(property.pricing.cleaningFee || 0, currency, language)}
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant="body2">{t('booking:serviceFee')}</Typography>
                  <Typography variant="body2">
                    {formatCurrency(property.pricing.serviceFee || 0, currency, language)}
                  </Typography>
                </Box>
                <Divider sx={{ my: 2 }} />
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant="subtitle1" fontWeight={600}>
                    {t('booking:total')}
                  </Typography>
                  <Typography variant="subtitle1" fontWeight={600}>
                    {formatCurrency(
                      property.pricing.basePrice + (property.pricing.cleaningFee || 0) + (property.pricing.serviceFee || 0),
                      currency,
                      language
                    )}
                  </Typography>
                </Box>
              </Paper>
            </Grid>
          )}
        </Grid>
      </Container>

      {/* Mobile Booking Bar */}
      {isMobile && (
        <Paper
          sx={{
            position: 'fixed',
            bottom: 56,
            left: 0,
            right: 0,
            p: 2,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            borderTop: '1px solid',
            borderColor: 'divider',
            zIndex: 1000,
          }}
        >
          <Box>
            <Typography variant="subtitle1" fontWeight={600}>
              {formatCurrency(property.pricing.basePrice, currency, language)}
              <Typography component="span" variant="body2" color="text.secondary" fontWeight={400}>
                {' '}/{t('common:labels.night')}
              </Typography>
            </Typography>
          </Box>
          <Button variant="contained" onClick={handleBooking}>
            {property.instantBook ? t('booking:instantBook') : t('booking:requestToBook')}
          </Button>
        </Paper>
      )}

      {/* Image Gallery Dialog */}
      <Dialog
        fullScreen
        open={galleryOpen}
        onClose={() => setGalleryOpen(false)}
      >
        <Box sx={{ height: '100vh', backgroundColor: 'black', position: 'relative' }}>
          <IconButton
            onClick={() => setGalleryOpen(false)}
            sx={{
              position: 'absolute',
              top: 16,
              left: 16,
              color: 'white',
              zIndex: 1,
            }}
          >
            <Close />
          </IconButton>
          <Box
            sx={{
              height: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <IconButton
              onClick={() => setSelectedImageIndex((prev) => Math.max(0, prev - 1))}
              sx={{ color: 'white', position: 'absolute', left: 16 }}
              disabled={selectedImageIndex === 0}
            >
              <ChevronLeft sx={{ fontSize: 40 }} />
            </IconButton>
            <Box
              component="img"
              src={property.photos[selectedImageIndex]?.url}
              alt={`${title} ${selectedImageIndex + 1}`}
              sx={{ maxWidth: '90%', maxHeight: '80vh', objectFit: 'contain' }}
            />
            <IconButton
              onClick={() => setSelectedImageIndex((prev) => Math.min(property.photos.length - 1, prev + 1))}
              sx={{ color: 'white', position: 'absolute', right: 16 }}
              disabled={selectedImageIndex === property.photos.length - 1}
            >
              <ChevronRight sx={{ fontSize: 40 }} />
            </IconButton>
          </Box>
          <Typography
            variant="body1"
            sx={{
              position: 'absolute',
              bottom: 16,
              left: '50%',
              transform: 'translateX(-50%)',
              color: 'white',
            }}
          >
            {selectedImageIndex + 1} / {property.photos.length}
          </Typography>
        </Box>
      </Dialog>
    </Box>
  );
};

export default PropertyDetailPage;
