import React from 'react';
import {
  Box,
  Container,
  Typography,
  Paper,
} from '@mui/material';
import { useTranslation } from 'react-i18next';

const TermsPage: React.FC = () => {
  const { t } = useTranslation();

  const sections = [
    {
      title: t('common:terms.sections.acceptance.title'),
      content: t('common:terms.sections.acceptance.content'),
    },
    {
      title: t('common:terms.sections.eligibility.title'),
      content: t('common:terms.sections.eligibility.content'),
    },
    {
      title: t('common:terms.sections.account.title'),
      content: t('common:terms.sections.account.content'),
    },
    {
      title: t('common:terms.sections.booking.title'),
      content: t('common:terms.sections.booking.content'),
    },
    {
      title: t('common:terms.sections.cancellation.title'),
      content: t('common:terms.sections.cancellation.content'),
    },
    {
      title: t('common:terms.sections.hostResponsibilities.title'),
      content: t('common:terms.sections.hostResponsibilities.content'),
    },
    {
      title: t('common:terms.sections.guestResponsibilities.title'),
      content: t('common:terms.sections.guestResponsibilities.content'),
    },
    {
      title: t('common:terms.sections.payment.title'),
      content: t('common:terms.sections.payment.content'),
    },
    {
      title: t('common:terms.sections.liability.title'),
      content: t('common:terms.sections.liability.content'),
    },
    {
      title: t('common:terms.sections.disputes.title'),
      content: t('common:terms.sections.disputes.content'),
    },
    {
      title: t('common:terms.sections.modifications.title'),
      content: t('common:terms.sections.modifications.content'),
    },
    {
      title: t('common:terms.sections.governingLaw.title'),
      content: t('common:terms.sections.governingLaw.content'),
    },
  ];

  return (
    <Box>
      {/* Hero Section */}
      <Box
        sx={{
          position: 'relative',
          py: 10,
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
            {t('common:terms.title')}
          </Typography>
          <Typography
            variant="body1"
            sx={{ color: 'rgba(255,255,255,0.9)' }}
          >
            {t('common:terms.lastUpdated')}: January 1, 2024
          </Typography>
        </Container>
      </Box>

      {/* Content */}
      <Container maxWidth="md" sx={{ py: 6 }}>
        <Paper sx={{ p: { xs: 3, md: 5 }, borderRadius: 3 }}>
          <Typography variant="body1" color="text.secondary" paragraph sx={{ mb: 4 }}>
            {t('common:terms.intro')}
          </Typography>

          {sections.map((section, index) => (
            <Box key={index} sx={{ mb: 4 }}>
              <Typography variant="h6" fontWeight={600} gutterBottom>
                {index + 1}. {section.title}
              </Typography>
              <Typography variant="body1" color="text.secondary" sx={{ whiteSpace: 'pre-line' }}>
                {section.content}
              </Typography>
            </Box>
          ))}

          <Box sx={{ mt: 6, pt: 4, borderTop: '1px solid', borderColor: 'divider' }}>
            <Typography variant="body2" color="text.secondary">
              {t('common:terms.contact')}
            </Typography>
            <Typography variant="body2" color="primary.main" sx={{ mt: 1 }}>
              legal@staygcc.com
            </Typography>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
};

export default TermsPage;
