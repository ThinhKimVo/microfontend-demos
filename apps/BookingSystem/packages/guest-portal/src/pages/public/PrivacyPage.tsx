import React from 'react';
import {
  Box,
  Container,
  Typography,
  Paper,
} from '@mui/material';
import { useTranslation } from 'react-i18next';

const PrivacyPage: React.FC = () => {
  const { t } = useTranslation();

  const sections = [
    {
      title: t('common:privacy.sections.collection.title'),
      content: t('common:privacy.sections.collection.content'),
    },
    {
      title: t('common:privacy.sections.usage.title'),
      content: t('common:privacy.sections.usage.content'),
    },
    {
      title: t('common:privacy.sections.sharing.title'),
      content: t('common:privacy.sections.sharing.content'),
    },
    {
      title: t('common:privacy.sections.security.title'),
      content: t('common:privacy.sections.security.content'),
    },
    {
      title: t('common:privacy.sections.cookies.title'),
      content: t('common:privacy.sections.cookies.content'),
    },
    {
      title: t('common:privacy.sections.rights.title'),
      content: t('common:privacy.sections.rights.content'),
    },
    {
      title: t('common:privacy.sections.retention.title'),
      content: t('common:privacy.sections.retention.content'),
    },
    {
      title: t('common:privacy.sections.children.title'),
      content: t('common:privacy.sections.children.content'),
    },
    {
      title: t('common:privacy.sections.international.title'),
      content: t('common:privacy.sections.international.content'),
    },
    {
      title: t('common:privacy.sections.changes.title'),
      content: t('common:privacy.sections.changes.content'),
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
            {t('common:privacy.title')}
          </Typography>
          <Typography
            variant="body1"
            sx={{ color: 'rgba(255,255,255,0.9)' }}
          >
            {t('common:privacy.lastUpdated')}: January 1, 2024
          </Typography>
        </Container>
      </Box>

      {/* Content */}
      <Container maxWidth="md" sx={{ py: 6 }}>
        <Paper sx={{ p: { xs: 3, md: 5 }, borderRadius: 3 }}>
          <Typography variant="body1" color="text.secondary" paragraph sx={{ mb: 4 }}>
            {t('common:privacy.intro')}
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
              {t('common:privacy.contact')}
            </Typography>
            <Typography variant="body2" color="primary.main" sx={{ mt: 1 }}>
              privacy@staygcc.com
            </Typography>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
};

export default PrivacyPage;
