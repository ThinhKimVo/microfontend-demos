import React, { useState } from 'react';
import {
  Box,
  Container,
  Typography,
  Grid2 as Grid,
  Paper,
  TextField,
  Button,
  MenuItem,
  Alert,
  Snackbar,
} from '@mui/material';
import {
  Email,
  Phone,
  LocationOn,
  AccessTime,
} from '@mui/icons-material';
import { useTranslation } from 'react-i18next';

const ContactPage: React.FC = () => {
  const { t } = useTranslation();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [showSuccess, setShowSuccess] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate form submission
    setShowSuccess(true);
    setFormData({ name: '', email: '', subject: '', message: '' });
  };

  const contactInfo = [
    {
      icon: <Email sx={{ fontSize: 32 }} />,
      title: t('common:contact.info.email.title'),
      value: 'support@staygcc.com',
      description: t('common:contact.info.email.description'),
    },
    {
      icon: <Phone sx={{ fontSize: 32 }} />,
      title: t('common:contact.info.phone.title'),
      value: '+966 11 234 5678',
      description: t('common:contact.info.phone.description'),
    },
    {
      icon: <LocationOn sx={{ fontSize: 32 }} />,
      title: t('common:contact.info.address.title'),
      value: t('common:contact.info.address.value'),
      description: t('common:contact.info.address.description'),
    },
    {
      icon: <AccessTime sx={{ fontSize: 32 }} />,
      title: t('common:contact.info.hours.title'),
      value: t('common:contact.info.hours.value'),
      description: t('common:contact.info.hours.description'),
    },
  ];

  const subjects = [
    { value: 'general', label: t('common:contact.subjects.general') },
    { value: 'booking', label: t('common:contact.subjects.booking') },
    { value: 'hosting', label: t('common:contact.subjects.hosting') },
    { value: 'technical', label: t('common:contact.subjects.technical') },
    { value: 'feedback', label: t('common:contact.subjects.feedback') },
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
            {t('common:contact.title')}
          </Typography>
          <Typography
            variant="h6"
            sx={{ color: 'rgba(255,255,255,0.9)', fontWeight: 400 }}
          >
            {t('common:contact.subtitle')}
          </Typography>
        </Container>
      </Box>

      {/* Contact Info Cards */}
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Grid container spacing={3}>
          {contactInfo.map((info) => (
            <Grid key={info.title} size={{ xs: 12, sm: 6, md: 3 }}>
              <Paper
                elevation={0}
                sx={{
                  p: 3,
                  height: '100%',
                  textAlign: 'center',
                  backgroundColor: 'background.default',
                  borderRadius: 3,
                }}
              >
                <Box sx={{ color: 'primary.main', mb: 2 }}>
                  {info.icon}
                </Box>
                <Typography variant="subtitle1" fontWeight={600} gutterBottom>
                  {info.title}
                </Typography>
                <Typography variant="body1" color="text.primary" gutterBottom>
                  {info.value}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {info.description}
                </Typography>
              </Paper>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* Contact Form */}
      <Box sx={{ backgroundColor: 'background.default', py: 8 }}>
        <Container maxWidth="md">
          <Typography variant="h4" component="h2" fontWeight={600} textAlign="center" gutterBottom>
            {t('common:contact.form.title')}
          </Typography>
          <Typography
            variant="body1"
            color="text.secondary"
            textAlign="center"
            sx={{ mb: 6 }}
          >
            {t('common:contact.form.subtitle')}
          </Typography>
          <Paper sx={{ p: 4, borderRadius: 3 }}>
            <form onSubmit={handleSubmit}>
              <Grid container spacing={3}>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <TextField
                    fullWidth
                    label={t('common:contact.form.name')}
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                  />
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <TextField
                    fullWidth
                    label={t('common:contact.form.email')}
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                </Grid>
                <Grid size={{ xs: 12 }}>
                  <TextField
                    fullWidth
                    select
                    label={t('common:contact.form.subject')}
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    required
                  >
                    {subjects.map((option) => (
                      <MenuItem key={option.value} value={option.value}>
                        {option.label}
                      </MenuItem>
                    ))}
                  </TextField>
                </Grid>
                <Grid size={{ xs: 12 }}>
                  <TextField
                    fullWidth
                    label={t('common:contact.form.message')}
                    name="message"
                    multiline
                    rows={5}
                    value={formData.message}
                    onChange={handleChange}
                    required
                  />
                </Grid>
                <Grid size={{ xs: 12 }}>
                  <Button
                    type="submit"
                    variant="contained"
                    size="large"
                    fullWidth
                    sx={{ py: 1.5 }}
                  >
                    {t('common:contact.form.submit')}
                  </Button>
                </Grid>
              </Grid>
            </form>
          </Paper>
        </Container>
      </Box>

      {/* Map Section */}
      <Box sx={{ py: 8 }}>
        <Container maxWidth="lg">
          <Typography variant="h4" component="h2" fontWeight={600} textAlign="center" gutterBottom>
            {t('common:contact.findUs')}
          </Typography>
          <Typography
            variant="body1"
            color="text.secondary"
            textAlign="center"
            sx={{ mb: 4 }}
          >
            {t('common:contact.findUsDescription')}
          </Typography>
          <Paper
            sx={{
              height: 400,
              borderRadius: 3,
              overflow: 'hidden',
              backgroundColor: 'grey.200',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Box sx={{ textAlign: 'center', p: 4 }}>
              <LocationOn sx={{ fontSize: 64, color: 'grey.400', mb: 2 }} />
              <Typography variant="h6" color="text.secondary">
                {t('common:contact.mapPlaceholder')}
              </Typography>
            </Box>
          </Paper>
        </Container>
      </Box>

      {/* Success Snackbar */}
      <Snackbar
        open={showSuccess}
        autoHideDuration={6000}
        onClose={() => setShowSuccess(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert
          onClose={() => setShowSuccess(false)}
          severity="success"
          sx={{ width: '100%' }}
        >
          {t('common:contact.successMessage')}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default ContactPage;
