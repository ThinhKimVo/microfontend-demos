import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  Typography,
  Grid2 as Grid,
  Card,
  CardMedia,
  CardContent,
  Chip,
  TextField,
  InputAdornment,
  Button,
  Drawer,
  IconButton,
  Slider,
  FormControlLabel,
  Checkbox,
  FormGroup,
  Divider,
  useMediaQuery,
  useTheme,
  Skeleton,
  MenuItem,
} from '@mui/material';
import {
  Search,
  FilterList,
  Close,
  LocationOn,
  Star,
  FavoriteBorder,
  Favorite,
} from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import { useSearch } from '../../contexts/SearchContext';
import { useWishlist } from '../../contexts/WishlistContext';
import { useLocale } from '../../contexts/LocaleContext';
import { formatCurrency } from '@staygcc/shared/utils';
import { PropertyType } from '@staygcc/shared/types';

const SearchPage: React.FC = () => {
  const { t } = useTranslation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { language, currency } = useLocale();

  const { filters, results, isLoading, setFilters, search } = useSearch();
  const { isInWishlist, toggleWishlist } = useWishlist();

  const [filterDrawerOpen, setFilterDrawerOpen] = useState(false);
  const [localFilters, setLocalFilters] = useState(filters);

  // Initialize from URL params
  useEffect(() => {
    const location = searchParams.get('location') || '';
    if (location) {
      setFilters({ location });
    }
    search();
  }, []);

  const handleSearch = () => {
    setFilters(localFilters);
    search();
    setFilterDrawerOpen(false);
  };

  const handleFilterChange = (key: string, value: unknown) => {
    setLocalFilters({ ...localFilters, [key]: value });
  };

  const propertyTypes: PropertyType[] = ['apartment', 'villa', 'traditional_house', 'chalet', 'studio', 'desert_camp'];

  const amenitiesOptions = [
    { key: 'wifi', label: t('property:amenities.wifi') },
    { key: 'pool', label: t('property:amenities.pool') },
    { key: 'parking', label: t('property:amenities.parking') },
    { key: 'airConditioning', label: t('property:amenities.airConditioning') },
    { key: 'kitchen', label: t('property:amenities.kitchen') },
    { key: 'washer', label: t('property:amenities.washer') },
    { key: 'tv', label: t('property:amenities.tv') },
    { key: 'gym', label: t('property:amenities.gym') },
  ];

  const FilterContent = () => (
    <Box sx={{ p: 3, width: isMobile ? '100%' : 280 }}>
      {isMobile && (
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h6" fontWeight={600}>
            {t('common:search.filters')}
          </Typography>
          <IconButton onClick={() => setFilterDrawerOpen(false)}>
            <Close />
          </IconButton>
        </Box>
      )}

      {/* Price Range */}
      <Typography variant="subtitle2" fontWeight={600} gutterBottom>
        {t('common:search.priceRange')}
      </Typography>
      <Box sx={{ px: 1, mb: 3 }}>
        <Slider
          value={[localFilters.priceMin, localFilters.priceMax]}
          onChange={(_, value) => {
            const [min, max] = value as number[];
            handleFilterChange('priceMin', min);
            handleFilterChange('priceMax', max);
          }}
          valueLabelDisplay="auto"
          min={0}
          max={10000}
          step={100}
        />
        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <Typography variant="body2" color="text.secondary">
            {formatCurrency(localFilters.priceMin, currency, language)}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {formatCurrency(localFilters.priceMax, currency, language)}
          </Typography>
        </Box>
      </Box>

      <Divider sx={{ my: 2 }} />

      {/* Property Type */}
      <Typography variant="subtitle2" fontWeight={600} gutterBottom>
        {t('common:search.propertyType')}
      </Typography>
      <TextField
        select
        fullWidth
        size="small"
        value={localFilters.propertyType || ''}
        onChange={(e) => handleFilterChange('propertyType', e.target.value || null)}
        sx={{ mb: 3 }}
      >
        <MenuItem value="">{t('common:search.allTypes')}</MenuItem>
        {propertyTypes.map((type) => (
          <MenuItem key={type} value={type}>
            {t(`property:types.${type}`)}
          </MenuItem>
        ))}
      </TextField>

      <Divider sx={{ my: 2 }} />

      {/* Bedrooms */}
      <Typography variant="subtitle2" fontWeight={600} gutterBottom>
        {t('common:search.bedrooms')}
      </Typography>
      <Box sx={{ display: 'flex', gap: 1, mb: 3, flexWrap: 'wrap' }}>
        {[0, 1, 2, 3, 4].map((num) => (
          <Chip
            key={num}
            label={num === 0 ? t('common:search.any') : num.toString() + '+'}
            onClick={() => handleFilterChange('bedrooms', num)}
            variant={localFilters.bedrooms === num ? 'filled' : 'outlined'}
            color={localFilters.bedrooms === num ? 'primary' : 'default'}
          />
        ))}
      </Box>

      <Divider sx={{ my: 2 }} />

      {/* Amenities */}
      <Typography variant="subtitle2" fontWeight={600} gutterBottom>
        {t('common:search.amenities')}
      </Typography>
      <FormGroup>
        {amenitiesOptions.map((amenity) => (
          <FormControlLabel
            key={amenity.key}
            control={
              <Checkbox
                size="small"
                checked={localFilters.amenities.includes(amenity.key)}
                onChange={(e) => {
                  if (e.target.checked) {
                    handleFilterChange('amenities', [...localFilters.amenities, amenity.key]);
                  } else {
                    handleFilterChange(
                      'amenities',
                      localFilters.amenities.filter((a) => a !== amenity.key)
                    );
                  }
                }}
              />
            }
            label={<Typography variant="body2">{amenity.label}</Typography>}
          />
        ))}
      </FormGroup>

      <Divider sx={{ my: 2 }} />

      {/* Instant Book */}
      <FormControlLabel
        control={
          <Checkbox
            checked={localFilters.instantBook}
            onChange={(e) => handleFilterChange('instantBook', e.target.checked)}
          />
        }
        label={
          <Typography variant="body2" fontWeight={500}>
            {t('common:search.instantBook')}
          </Typography>
        }
      />

      <Button
        variant="contained"
        fullWidth
        onClick={handleSearch}
        sx={{ mt: 3 }}
      >
        {t('common:search.applyFilters')}
      </Button>
    </Box>
  );

  return (
    <Box sx={{ backgroundColor: 'background.default', minHeight: '100vh', py: 3 }}>
      <Container maxWidth="xl">
        {/* Search Bar */}
        <Box sx={{ mb: 4 }}>
          <Grid container spacing={2} alignItems="center">
            <Grid size={{ xs: 12, md: 6 }}>
              <TextField
                fullWidth
                placeholder={t('common:search.searchPlaceholder')}
                value={localFilters.location}
                onChange={(e) => handleFilterChange('location', e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <LocationOn color="action" />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end">
                      <Button
                        variant="contained"
                        size="small"
                        onClick={handleSearch}
                        startIcon={<Search />}
                      >
                        {t('common:actions.search')}
                      </Button>
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <Box sx={{ display: 'flex', gap: 2, justifyContent: { xs: 'flex-start', md: 'flex-end' } }}>
                {isMobile && (
                  <Button
                    variant="outlined"
                    startIcon={<FilterList />}
                    onClick={() => setFilterDrawerOpen(true)}
                  >
                    {t('common:search.filters')}
                  </Button>
                )}
                <Typography variant="body1" color="text.secondary" sx={{ alignSelf: 'center' }}>
                  {isLoading
                    ? t('common:search.searching')
                    : t('common:search.resultsCount', { count: results.length })}
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </Box>

        <Grid container spacing={3}>
          {/* Filters Sidebar - Desktop */}
          {!isMobile && (
            <Grid size={{ xs: 12, md: 3 }}>
              <Box
                sx={{
                  position: 'sticky',
                  top: 80,
                  backgroundColor: 'background.paper',
                  borderRadius: 2,
                  border: '1px solid',
                  borderColor: 'divider',
                }}
              >
                <FilterContent />
              </Box>
            </Grid>
          )}

          {/* Results Grid */}
          <Grid size={{ xs: 12, md: isMobile ? 12 : 9 }}>
            {isLoading ? (
              <Grid container spacing={3}>
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <Grid key={i} size={{ xs: 12, sm: 6, lg: 4 }}>
                    <Card>
                      <Skeleton variant="rectangular" height={200} />
                      <CardContent>
                        <Skeleton width="80%" />
                        <Skeleton width="60%" />
                        <Skeleton width="40%" />
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            ) : results.length === 0 ? (
              <Box sx={{ textAlign: 'center', py: 8 }}>
                <Search sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
                <Typography variant="h6" gutterBottom>
                  {t('common:search.noResults')}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {t('common:search.tryAdjustingFilters')}
                </Typography>
              </Box>
            ) : (
              <Grid container spacing={3}>
                {results.map((property) => (
                  <Grid key={property.id} size={{ xs: 12, sm: 6, lg: 4 }}>
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
                          {isInWishlist(property.id) ? (
                            <Favorite sx={{ color: 'error.main' }} />
                          ) : (
                            <FavoriteBorder />
                          )}
                        </IconButton>
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
                        <Typography variant="body2" color="text.secondary" noWrap sx={{ mb: 1 }}>
                          {property.location.city}, {property.location.country}
                        </Typography>
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                          {property.bedrooms} {t('property:details.bedrooms')} • {property.bathrooms} {t('property:details.bathrooms')} • {property.maxGuests} {t('property:details.guests')}
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
                ))}
              </Grid>
            )}
          </Grid>
        </Grid>
      </Container>

      {/* Mobile Filter Drawer */}
      <Drawer
        anchor="bottom"
        open={filterDrawerOpen}
        onClose={() => setFilterDrawerOpen(false)}
        PaperProps={{
          sx: {
            borderTopLeftRadius: 16,
            borderTopRightRadius: 16,
            maxHeight: '90vh',
          },
        }}
      >
        <FilterContent />
      </Drawer>
    </Box>
  );
};

export default SearchPage;
