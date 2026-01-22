import React from 'react';
import { Link } from 'react-router-dom';
import {
  Box,
  Container,
  Grid2 as Grid,
  Typography,
  IconButton,
  Divider,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import {
  Facebook,
  Twitter,
  Instagram,
  LinkedIn,
} from '@mui/icons-material';
import { useTranslation } from 'react-i18next';

const Footer: React.FC = () => {
  const { t } = useTranslation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  // Hide footer on mobile (using bottom nav instead)
  if (isMobile) {
    return null;
  }

  const footerLinks = {
    support: [
      { label: t('common:footer.helpCenter'), path: '/faq' },
      { label: t('common:footer.safetyInfo'), path: '/safety' },
      { label: t('common:footer.cancellationOptions'), path: '/cancellation' },
      { label: t('common:footer.reportConcern'), path: '/report' },
    ],
    hosting: [
      { label: t('common:footer.tryHosting'), path: 'https://host.staygcc.com' },
      { label: t('common:footer.hostResources'), path: '/host-resources' },
      { label: t('common:footer.communityForum'), path: '/community' },
      { label: t('common:footer.responsibleHosting'), path: '/responsible-hosting' },
    ],
    company: [
      { label: t('common:footer.about'), path: '/about' },
      { label: t('common:footer.howItWorks'), path: '/how-it-works' },
      { label: t('common:footer.careers'), path: '/careers' },
      { label: t('common:footer.press'), path: '/press' },
    ],
  };

  return (
    <Box
      component="footer"
      sx={{
        backgroundColor: 'background.paper',
        borderTop: '1px solid',
        borderColor: 'divider',
        py: 6,
        mt: 'auto',
      }}
    >
      <Container maxWidth="lg">
        <Grid container spacing={4}>
          {/* Support */}
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <Typography variant="subtitle1" fontWeight={600} gutterBottom>
              {t('common:footer.support')}
            </Typography>
            {footerLinks.support.map((link) => (
              <Typography
                key={link.path}
                component={Link}
                to={link.path}
                variant="body2"
                sx={{
                  display: 'block',
                  color: 'text.secondary',
                  textDecoration: 'none',
                  py: 0.5,
                  '&:hover': {
                    color: 'primary.main',
                    textDecoration: 'underline',
                  },
                }}
              >
                {link.label}
              </Typography>
            ))}
          </Grid>

          {/* Hosting */}
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <Typography variant="subtitle1" fontWeight={600} gutterBottom>
              {t('common:footer.hosting')}
            </Typography>
            {footerLinks.hosting.map((link) => (
              <Typography
                key={link.path}
                component={link.path.startsWith('http') ? 'a' : Link}
                to={link.path.startsWith('http') ? undefined : link.path}
                href={link.path.startsWith('http') ? link.path : undefined}
                target={link.path.startsWith('http') ? '_blank' : undefined}
                rel={link.path.startsWith('http') ? 'noopener noreferrer' : undefined}
                variant="body2"
                sx={{
                  display: 'block',
                  color: 'text.secondary',
                  textDecoration: 'none',
                  py: 0.5,
                  '&:hover': {
                    color: 'primary.main',
                    textDecoration: 'underline',
                  },
                }}
              >
                {link.label}
              </Typography>
            ))}
          </Grid>

          {/* Company */}
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <Typography variant="subtitle1" fontWeight={600} gutterBottom>
              {t('common:footer.company')}
            </Typography>
            {footerLinks.company.map((link) => (
              <Typography
                key={link.path}
                component={Link}
                to={link.path}
                variant="body2"
                sx={{
                  display: 'block',
                  color: 'text.secondary',
                  textDecoration: 'none',
                  py: 0.5,
                  '&:hover': {
                    color: 'primary.main',
                    textDecoration: 'underline',
                  },
                }}
              >
                {link.label}
              </Typography>
            ))}
          </Grid>

          {/* Social Links */}
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <Typography variant="subtitle1" fontWeight={600} gutterBottom>
              {t('common:footer.followUs')}
            </Typography>
            <Box sx={{ display: 'flex', gap: 1, mt: 1 }}>
              <IconButton
                href="https://facebook.com/staygcc"
                target="_blank"
                rel="noopener noreferrer"
                size="small"
                sx={{
                  backgroundColor: 'action.hover',
                  '&:hover': { backgroundColor: 'primary.main', color: 'white' },
                }}
              >
                <Facebook fontSize="small" />
              </IconButton>
              <IconButton
                href="https://twitter.com/staygcc"
                target="_blank"
                rel="noopener noreferrer"
                size="small"
                sx={{
                  backgroundColor: 'action.hover',
                  '&:hover': { backgroundColor: 'primary.main', color: 'white' },
                }}
              >
                <Twitter fontSize="small" />
              </IconButton>
              <IconButton
                href="https://instagram.com/staygcc"
                target="_blank"
                rel="noopener noreferrer"
                size="small"
                sx={{
                  backgroundColor: 'action.hover',
                  '&:hover': { backgroundColor: 'primary.main', color: 'white' },
                }}
              >
                <Instagram fontSize="small" />
              </IconButton>
              <IconButton
                href="https://linkedin.com/company/staygcc"
                target="_blank"
                rel="noopener noreferrer"
                size="small"
                sx={{
                  backgroundColor: 'action.hover',
                  '&:hover': { backgroundColor: 'primary.main', color: 'white' },
                }}
              >
                <LinkedIn fontSize="small" />
              </IconButton>
            </Box>
          </Grid>
        </Grid>

        <Divider sx={{ my: 4 }} />

        {/* Bottom Bar */}
        <Box
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', md: 'row' },
            justifyContent: 'space-between',
            alignItems: { xs: 'flex-start', md: 'center' },
            gap: 2,
          }}
        >
          <Typography variant="body2" color="text.secondary">
            © {new Date().getFullYear()} StayGCC. {t('common:footer.allRightsReserved')}
          </Typography>
          <Box sx={{ display: 'flex', gap: 3 }}>
            <Typography
              component={Link}
              to="/terms"
              variant="body2"
              sx={{
                color: 'text.secondary',
                textDecoration: 'none',
                '&:hover': {
                  textDecoration: 'underline',
                },
              }}
            >
              {t('common:footer.terms')}
            </Typography>
            <Typography
              component={Link}
              to="/privacy"
              variant="body2"
              sx={{
                color: 'text.secondary',
                textDecoration: 'none',
                '&:hover': {
                  textDecoration: 'underline',
                },
              }}
            >
              {t('common:footer.privacy')}
            </Typography>
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default Footer;
