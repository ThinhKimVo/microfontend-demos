import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Button,
  Grid2 as Grid,
  Card,
  CardMedia,
  CardContent,
  IconButton,
  Menu,
  MenuItem,
  Chip,
  TextField,
  InputAdornment,
  Tabs,
  Tab,
} from '@mui/material';
import {
  Add,
  MoreVert,
  Search,
  Edit,
  Delete,
  Visibility,
  VisibilityOff,
  Star,
} from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import { mockProperties } from '@staygcc/shared/mock-data';
import { useLocale } from '../../contexts/LocaleContext';
import { formatCurrency } from '@staygcc/shared/utils';

const ListingsPage: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { language, currency } = useLocale();

  const [tabValue, setTabValue] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [menuAnchor, setMenuAnchor] = useState<{ element: HTMLElement; id: string } | null>(null);

  const listings = mockProperties;

  const activeListings = listings.filter((l) => l.status === 'active');
  const draftListings = listings.filter((l) => l.status === 'draft');
  const inactiveListings = listings.filter((l) => l.status === 'inactive');

  const getCurrentListings = () => {
    let filtered = tabValue === 0 ? activeListings : tabValue === 1 ? draftListings : inactiveListings;
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (l) =>
          l.titleEn.toLowerCase().includes(query) ||
          l.titleAr.toLowerCase().includes(query) ||
          l.location.city.toLowerCase().includes(query)
      );
    }
    return filtered;
  };

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>, id: string) => {
    setMenuAnchor({ element: event.currentTarget, id });
  };

  const handleMenuClose = () => {
    setMenuAnchor(null);
  };

  const renderListingCard = (listing: typeof listings[0]) => {
    const title = language === 'ar' ? listing.titleAr : listing.titleEn;
    return (
      <Grid key={listing.id} size={{ xs: 12, sm: 6, lg: 4 }}>
        <Card sx={{ height: '100%' }}>
          <Box sx={{ position: 'relative' }}>
            <CardMedia
              component="img"
              height="180"
              image={listing.photos[0]?.url || 'https://via.placeholder.com/400x300'}
              alt={title}
            />
            <IconButton
              sx={{
                position: 'absolute',
                top: 8,
                right: 8,
                backgroundColor: 'rgba(255,255,255,0.9)',
              }}
              onClick={(e) => handleMenuOpen(e, listing.id)}
            >
              <MoreVert />
            </IconButton>
            <Chip
              size="small"
              label={t(`host:listing.status.${listing.status}`)}
              color={listing.status === 'active' ? 'success' : listing.status === 'draft' ? 'warning' : 'default'}
              sx={{ position: 'absolute', top: 8, left: 8 }}
            />
          </Box>
          <CardContent>
            <Typography variant="subtitle1" fontWeight={600} noWrap gutterBottom>
              {title}
            </Typography>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              {listing.location.city}, {listing.location.country}
            </Typography>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 2 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                <Star sx={{ fontSize: 16, color: 'warning.main' }} />
                <Typography variant="body2">
                  {listing.rating?.toFixed(1) || '-'} ({listing.reviewCount || 0})
                </Typography>
              </Box>
              <Typography variant="subtitle2" fontWeight={600}>
                {formatCurrency(listing.pricing.basePrice, currency, language)}/{t('common:labels.night')}
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', gap: 1, mt: 2 }}>
              <Button
                size="small"
                variant="outlined"
                startIcon={<Edit />}
                onClick={() => navigate(`/listings/${listing.id}/edit`)}
                fullWidth
              >
                {t('common:actions.edit')}
              </Button>
              <Button
                size="small"
                variant="outlined"
                onClick={() => navigate('/calendar')}
                fullWidth
              >
                {t('host:listing.calendar')}
              </Button>
            </Box>
          </CardContent>
        </Card>
      </Grid>
    );
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography variant="h4" fontWeight={600}>
          {t('host:navigation.listings')}
        </Typography>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={() => navigate('/listings/new')}
        >
          {t('host:actions.addListing')}
        </Button>
      </Box>

      <Box sx={{ display: 'flex', gap: 2, mb: 3, flexWrap: 'wrap' }}>
        <TextField
          placeholder={t('host:listing.searchPlaceholder')}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          size="small"
          sx={{ minWidth: 300 }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Search />
              </InputAdornment>
            ),
          }}
        />
      </Box>

      <Tabs
        value={tabValue}
        onChange={(_, value) => setTabValue(value)}
        sx={{ mb: 3, borderBottom: 1, borderColor: 'divider' }}
      >
        <Tab label={`${t('host:listing.active')} (${activeListings.length})`} />
        <Tab label={`${t('host:listing.draft')} (${draftListings.length})`} />
        <Tab label={`${t('host:listing.inactive')} (${inactiveListings.length})`} />
      </Tabs>

      {getCurrentListings().length === 0 ? (
        <Box sx={{ textAlign: 'center', py: 8 }}>
          <Typography variant="h6" gutterBottom>
            {t('host:listing.noListings')}
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            {t('host:listing.noListingsDescription')}
          </Typography>
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={() => navigate('/listings/new')}
          >
            {t('host:actions.addListing')}
          </Button>
        </Box>
      ) : (
        <Grid container spacing={3}>
          {getCurrentListings().map(renderListingCard)}
        </Grid>
      )}

      {/* Actions Menu */}
      <Menu
        anchorEl={menuAnchor?.element}
        open={Boolean(menuAnchor)}
        onClose={handleMenuClose}
      >
        <MenuItem onClick={() => { navigate(`/listings/${menuAnchor?.id}/edit`); handleMenuClose(); }}>
          <Edit sx={{ mr: 1 }} fontSize="small" />
          {t('common:actions.edit')}
        </MenuItem>
        <MenuItem onClick={handleMenuClose}>
          <Visibility sx={{ mr: 1 }} fontSize="small" />
          {t('host:listing.preview')}
        </MenuItem>
        <MenuItem onClick={handleMenuClose}>
          <VisibilityOff sx={{ mr: 1 }} fontSize="small" />
          {t('host:listing.deactivate')}
        </MenuItem>
        <MenuItem onClick={handleMenuClose} sx={{ color: 'error.main' }}>
          <Delete sx={{ mr: 1 }} fontSize="small" />
          {t('common:actions.delete')}
        </MenuItem>
      </Menu>
    </Box>
  );
};

export default ListingsPage;
