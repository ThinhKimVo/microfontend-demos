import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  Box,
  Typography,
  Stepper,
  Step,
  StepLabel,
  Button,
  Paper,
  TextField,
  Grid2 as Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormControlLabel,
  Checkbox,
  IconButton,
  Chip,
} from '@mui/material';
import {
  ArrowBack,
  CloudUpload,
  Delete,
} from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import { PROPERTY_TYPES, GCC_COUNTRIES, CANCELLATION_POLICIES } from '@staygcc/shared/utils';

const CreateListingPage: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditing = Boolean(id);

  const [activeStep, setActiveStep] = useState(0);
  const [formData, setFormData] = useState({
    // Basic Info
    titleEn: '',
    titleAr: '',
    descriptionEn: '',
    descriptionAr: '',
    propertyType: 'apartment',
    // Location
    country: 'Saudi Arabia',
    city: '',
    address: '',
    // Details
    bedrooms: 1,
    beds: 1,
    bathrooms: 1,
    maxGuests: 2,
    // Amenities
    wifi: true,
    airConditioning: true,
    kitchen: true,
    parking: false,
    pool: false,
    tv: true,
    washer: false,
    gym: false,
    petFriendly: false,
    // Pricing
    basePrice: '',
    cleaningFee: '',
    weeklyDiscount: '',
    monthlyDiscount: '',
    // Rules
    checkInTime: '15:00',
    checkOutTime: '11:00',
    cancellationPolicy: 'moderate',
    instantBook: true,
    // Images
    images: [] as string[],
  });

  const steps = [
    t('host:listing.steps.basicInfo'),
    t('host:listing.steps.location'),
    t('host:listing.steps.details'),
    t('host:listing.steps.amenities'),
    t('host:listing.steps.pricing'),
    t('host:listing.steps.photos'),
  ];

  const handleChange = (field: string, value: unknown) => {
    setFormData({ ...formData, [field]: value });
  };

  const handleNext = () => {
    if (activeStep === steps.length - 1) {
      // Submit form
      navigate('/listings');
    } else {
      setActiveStep((prev) => prev + 1);
    }
  };

  const handleBack = () => {
    setActiveStep((prev) => prev - 1);
  };

  const renderStepContent = () => {
    switch (activeStep) {
      case 0:
        return (
          <Box>
            <Typography variant="h6" gutterBottom>
              {t('host:listing.basicInfo')}
            </Typography>
            <Grid container spacing={3}>
              <Grid size={{ xs: 12 }}>
                <FormControl fullWidth>
                  <InputLabel>{t('host:listing.propertyType')}</InputLabel>
                  <Select
                    value={formData.propertyType}
                    label={t('host:listing.propertyType')}
                    onChange={(e) => handleChange('propertyType', e.target.value)}
                  >
                    {PROPERTY_TYPES.map((type) => (
                      <MenuItem key={type.type} value={type.type}>
                        {type.nameEn}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                  fullWidth
                  label={t('host:listing.titleEn')}
                  value={formData.titleEn}
                  onChange={(e) => handleChange('titleEn', e.target.value)}
                  required
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                  fullWidth
                  label={t('host:listing.titleAr')}
                  value={formData.titleAr}
                  onChange={(e) => handleChange('titleAr', e.target.value)}
                  dir="rtl"
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                  fullWidth
                  label={t('host:listing.descriptionEn')}
                  value={formData.descriptionEn}
                  onChange={(e) => handleChange('descriptionEn', e.target.value)}
                  multiline
                  rows={4}
                  required
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                  fullWidth
                  label={t('host:listing.descriptionAr')}
                  value={formData.descriptionAr}
                  onChange={(e) => handleChange('descriptionAr', e.target.value)}
                  multiline
                  rows={4}
                  dir="rtl"
                />
              </Grid>
            </Grid>
          </Box>
        );
      case 1:
        return (
          <Box>
            <Typography variant="h6" gutterBottom>
              {t('host:listing.locationInfo')}
            </Typography>
            <Grid container spacing={3}>
              <Grid size={{ xs: 12, sm: 6 }}>
                <FormControl fullWidth>
                  <InputLabel>{t('host:listing.country')}</InputLabel>
                  <Select
                    value={formData.country}
                    label={t('host:listing.country')}
                    onChange={(e) => handleChange('country', e.target.value)}
                  >
                    {GCC_COUNTRIES.map((country) => (
                      <MenuItem key={country.code} value={country.name}>
                        {country.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                  fullWidth
                  label={t('host:listing.city')}
                  value={formData.city}
                  onChange={(e) => handleChange('city', e.target.value)}
                  required
                />
              </Grid>
              <Grid size={{ xs: 12 }}>
                <TextField
                  fullWidth
                  label={t('host:listing.address')}
                  value={formData.address}
                  onChange={(e) => handleChange('address', e.target.value)}
                  helperText={t('host:listing.addressHint')}
                />
              </Grid>
            </Grid>
          </Box>
        );
      case 2:
        return (
          <Box>
            <Typography variant="h6" gutterBottom>
              {t('host:listing.propertyDetails')}
            </Typography>
            <Grid container spacing={3}>
              <Grid size={{ xs: 6, sm: 3 }}>
                <TextField
                  fullWidth
                  type="number"
                  label={t('host:listing.bedrooms')}
                  value={formData.bedrooms}
                  onChange={(e) => handleChange('bedrooms', parseInt(e.target.value))}
                  inputProps={{ min: 0 }}
                />
              </Grid>
              <Grid size={{ xs: 6, sm: 3 }}>
                <TextField
                  fullWidth
                  type="number"
                  label={t('host:listing.beds')}
                  value={formData.beds}
                  onChange={(e) => handleChange('beds', parseInt(e.target.value))}
                  inputProps={{ min: 1 }}
                />
              </Grid>
              <Grid size={{ xs: 6, sm: 3 }}>
                <TextField
                  fullWidth
                  type="number"
                  label={t('host:listing.bathrooms')}
                  value={formData.bathrooms}
                  onChange={(e) => handleChange('bathrooms', parseInt(e.target.value))}
                  inputProps={{ min: 1 }}
                />
              </Grid>
              <Grid size={{ xs: 6, sm: 3 }}>
                <TextField
                  fullWidth
                  type="number"
                  label={t('host:listing.maxGuests')}
                  value={formData.maxGuests}
                  onChange={(e) => handleChange('maxGuests', parseInt(e.target.value))}
                  inputProps={{ min: 1 }}
                />
              </Grid>
            </Grid>
          </Box>
        );
      case 3:
        return (
          <Box>
            <Typography variant="h6" gutterBottom>
              {t('host:listing.amenitiesTitle')}
            </Typography>
            <Grid container spacing={2}>
              {[
                { key: 'wifi', label: t('property:amenities.wifi') },
                { key: 'airConditioning', label: t('property:amenities.airConditioning') },
                { key: 'kitchen', label: t('property:amenities.kitchen') },
                { key: 'parking', label: t('property:amenities.parking') },
                { key: 'pool', label: t('property:amenities.pool') },
                { key: 'tv', label: t('property:amenities.tv') },
                { key: 'washer', label: t('property:amenities.washer') },
                { key: 'gym', label: t('property:amenities.gym') },
                { key: 'petFriendly', label: t('property:amenities.petFriendly') },
              ].map((amenity) => (
                <Grid key={amenity.key} size={{ xs: 6, sm: 4 }}>
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={formData[amenity.key as keyof typeof formData] as boolean}
                        onChange={(e) => handleChange(amenity.key, e.target.checked)}
                      />
                    }
                    label={amenity.label}
                  />
                </Grid>
              ))}
            </Grid>
          </Box>
        );
      case 4:
        return (
          <Box>
            <Typography variant="h6" gutterBottom>
              {t('host:listing.pricingRules')}
            </Typography>
            <Grid container spacing={3}>
              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                  fullWidth
                  type="number"
                  label={t('host:listing.basePrice')}
                  value={formData.basePrice}
                  onChange={(e) => handleChange('basePrice', e.target.value)}
                  InputProps={{ startAdornment: 'SAR' }}
                  required
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                  fullWidth
                  type="number"
                  label={t('host:listing.cleaningFee')}
                  value={formData.cleaningFee}
                  onChange={(e) => handleChange('cleaningFee', e.target.value)}
                  InputProps={{ startAdornment: 'SAR' }}
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                  fullWidth
                  type="number"
                  label={t('host:listing.weeklyDiscount')}
                  value={formData.weeklyDiscount}
                  onChange={(e) => handleChange('weeklyDiscount', e.target.value)}
                  InputProps={{ endAdornment: '%' }}
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                  fullWidth
                  type="number"
                  label={t('host:listing.monthlyDiscount')}
                  value={formData.monthlyDiscount}
                  onChange={(e) => handleChange('monthlyDiscount', e.target.value)}
                  InputProps={{ endAdornment: '%' }}
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                  fullWidth
                  type="time"
                  label={t('host:listing.checkInTime')}
                  value={formData.checkInTime}
                  onChange={(e) => handleChange('checkInTime', e.target.value)}
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                  fullWidth
                  type="time"
                  label={t('host:listing.checkOutTime')}
                  value={formData.checkOutTime}
                  onChange={(e) => handleChange('checkOutTime', e.target.value)}
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>
              <Grid size={{ xs: 12 }}>
                <FormControl fullWidth>
                  <InputLabel>{t('host:listing.cancellationPolicy')}</InputLabel>
                  <Select
                    value={formData.cancellationPolicy}
                    label={t('host:listing.cancellationPolicy')}
                    onChange={(e) => handleChange('cancellationPolicy', e.target.value)}
                  >
                    {CANCELLATION_POLICIES.map((policy) => (
                      <MenuItem key={policy.value} value={policy.value}>
                        {policy.labelEn} - {policy.descriptionEn}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid size={{ xs: 12 }}>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={formData.instantBook}
                      onChange={(e) => handleChange('instantBook', e.target.checked)}
                    />
                  }
                  label={t('host:listing.instantBookDescription')}
                />
              </Grid>
            </Grid>
          </Box>
        );
      case 5:
        return (
          <Box>
            <Typography variant="h6" gutterBottom>
              {t('host:listing.photos')}
            </Typography>
            <Paper
              variant="outlined"
              sx={{
                p: 4,
                textAlign: 'center',
                borderStyle: 'dashed',
                cursor: 'pointer',
                mb: 3,
                '&:hover': { backgroundColor: 'action.hover' },
              }}
            >
              <CloudUpload sx={{ fontSize: 48, color: 'text.secondary', mb: 2 }} />
              <Typography variant="body1" gutterBottom>
                {t('host:listing.dragDropPhotos')}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {t('host:listing.photoRequirements')}
              </Typography>
              <Button variant="outlined" sx={{ mt: 2 }}>
                {t('host:listing.browseFiles')}
              </Button>
            </Paper>
            <Grid container spacing={2}>
              {[1, 2, 3, 4].map((i) => (
                <Grid key={i} size={{ xs: 6, sm: 3 }}>
                  <Paper
                    sx={{
                      height: 120,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      backgroundColor: 'grey.100',
                      position: 'relative',
                    }}
                  >
                    <Typography variant="body2" color="text.secondary">
                      Photo {i}
                    </Typography>
                    <IconButton
                      size="small"
                      sx={{ position: 'absolute', top: 4, right: 4 }}
                    >
                      <Delete fontSize="small" />
                    </IconButton>
                    {i === 1 && (
                      <Chip
                        size="small"
                        label={t('host:listing.coverPhoto')}
                        sx={{ position: 'absolute', bottom: 4, left: 4 }}
                      />
                    )}
                  </Paper>
                </Grid>
              ))}
            </Grid>
          </Box>
        );
      default:
        return null;
    }
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 4 }}>
        <IconButton onClick={() => navigate('/listings')}>
          <ArrowBack />
        </IconButton>
        <Typography variant="h4" fontWeight={600}>
          {isEditing ? t('host:listing.editListing') : t('host:listing.createListing')}
        </Typography>
      </Box>

      <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
        {steps.map((label) => (
          <Step key={label}>
            <StepLabel>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>

      <Paper sx={{ p: 4, mb: 4 }}>
        {renderStepContent()}
      </Paper>

      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
        <Button
          onClick={handleBack}
          disabled={activeStep === 0}
          variant="outlined"
        >
          {t('common:actions.back')}
        </Button>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button variant="outlined" onClick={() => navigate('/listings')}>
            {t('common:actions.saveAsDraft')}
          </Button>
          <Button variant="contained" onClick={handleNext}>
            {activeStep === steps.length - 1 ? t('host:listing.publish') : t('common:actions.continue')}
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

export default CreateListingPage;
