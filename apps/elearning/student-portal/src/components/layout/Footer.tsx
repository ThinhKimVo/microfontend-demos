import { Link } from 'react-router-dom';
import { Box, Container, Grid, Typography, IconButton, Divider, alpha } from '@mui/material';
import {
  School as SchoolIcon,
  Facebook,
  Twitter,
  LinkedIn,
  YouTube,
  Instagram,
} from '@mui/icons-material';

const footerLinks = {
  company: [
    { label: 'About Us', href: '#' },
    { label: 'Careers', href: '#' },
    { label: 'Blog', href: '#' },
    { label: 'Press', href: '#' },
  ],
  community: [
    { label: 'Become a Teacher', href: '#' },
    { label: 'Affiliate Program', href: '#' },
    { label: 'Referral Program', href: '#' },
    { label: 'Success Stories', href: '#' },
  ],
  resources: [
    { label: 'Help Center', href: '#' },
    { label: 'Contact Us', href: '#' },
    { label: 'Trust & Safety', href: '#' },
    { label: 'Sitemap', href: '#' },
  ],
  legal: [
    { label: 'Terms of Service', href: '#' },
    { label: 'Privacy Policy', href: '#' },
    { label: 'Cookie Policy', href: '#' },
    { label: 'Accessibility', href: '#' },
  ],
};

const socialLinks = [
  { icon: Facebook, label: 'Facebook', color: '#1877F2' },
  { icon: Twitter, label: 'Twitter', color: '#1DA1F2' },
  { icon: LinkedIn, label: 'LinkedIn', color: '#0A66C2' },
  { icon: YouTube, label: 'YouTube', color: '#FF0000' },
  { icon: Instagram, label: 'Instagram', color: '#E4405F' },
];

export default function Footer() {
  return (
    <Box 
      component="footer" 
      sx={{ 
        bgcolor: 'grey.900', 
        color: 'white', 
        py: { xs: 5, sm: 6, md: 8 },
      }}
    >
      <Container maxWidth="lg" sx={{ px: { xs: 3, sm: 4, md: 3 } }}>
        <Grid container spacing={{ xs: 4, md: 5 }}>
          {/* Brand Section */}
          <Grid size={{ xs: 12, md: 4 }}>
            <Link to="/" style={{ textDecoration: 'none', color: 'inherit' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2.5 }}>
                <Box
                  sx={{
                    width: 44,
                    height: 44,
                    borderRadius: 2,
                    bgcolor: 'primary.main',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: '0 4px 12px rgba(37, 99, 235, 0.3)',
                  }}
                >
                  <SchoolIcon sx={{ color: 'white', fontSize: 26 }} />
                </Box>
                <Typography variant="h5" fontWeight={800} letterSpacing="-0.02em">
                  EduLearn
                </Typography>
              </Box>
            </Link>
            <Typography 
              variant="body2" 
              sx={{ 
                mb: 3, 
                maxWidth: 320, 
                color: alpha('#fff', 0.7),
                lineHeight: 1.8,
              }}
            >
              Empowering learners worldwide with high-quality online education.
              Start your learning journey today and unlock your potential.
            </Typography>
            <Box sx={{ display: 'flex', gap: 1 }}>
              {socialLinks.map(({ icon: Icon, label, color }) => (
                <IconButton 
                  key={label}
                  size="small" 
                  aria-label={label}
                  sx={{ 
                    color: alpha('#fff', 0.6), 
                    bgcolor: alpha('#fff', 0.05),
                    transition: 'all 0.2s ease',
                    '&:hover': { 
                      color: 'white',
                      bgcolor: color,
                      transform: 'translateY(-2px)',
                    } 
                  }}
                >
                  <Icon fontSize="small" />
                </IconButton>
              ))}
            </Box>
          </Grid>

          {/* Links */}
          <Grid size={{ xs: 6, sm: 3, md: 2 }}>
            <Typography 
              variant="subtitle2" 
              fontWeight={700} 
              sx={{ mb: 2.5, color: 'white', letterSpacing: '0.02em' }}
            >
              Company
            </Typography>
            {footerLinks.company.map((link) => (
              <Typography
                key={link.label}
                component="a"
                href={link.href}
                variant="body2"
                sx={{
                  display: 'block',
                  color: alpha('#fff', 0.6),
                  textDecoration: 'none',
                  mb: 1.5,
                  transition: 'all 0.2s ease',
                  '&:hover': { 
                    color: 'white',
                    transform: 'translateX(4px)',
                  },
                }}
              >
                {link.label}
              </Typography>
            ))}
          </Grid>

          <Grid size={{ xs: 6, sm: 3, md: 2 }}>
            <Typography 
              variant="subtitle2" 
              fontWeight={700} 
              sx={{ mb: 2.5, color: 'white', letterSpacing: '0.02em' }}
            >
              Community
            </Typography>
            {footerLinks.community.map((link) => (
              <Typography
                key={link.label}
                component="a"
                href={link.href}
                variant="body2"
                sx={{
                  display: 'block',
                  color: alpha('#fff', 0.6),
                  textDecoration: 'none',
                  mb: 1.5,
                  transition: 'all 0.2s ease',
                  '&:hover': { 
                    color: 'white',
                    transform: 'translateX(4px)',
                  },
                }}
              >
                {link.label}
              </Typography>
            ))}
          </Grid>

          <Grid size={{ xs: 6, sm: 3, md: 2 }}>
            <Typography 
              variant="subtitle2" 
              fontWeight={700} 
              sx={{ mb: 2.5, color: 'white', letterSpacing: '0.02em' }}
            >
              Resources
            </Typography>
            {footerLinks.resources.map((link) => (
              <Typography
                key={link.label}
                component="a"
                href={link.href}
                variant="body2"
                sx={{
                  display: 'block',
                  color: alpha('#fff', 0.6),
                  textDecoration: 'none',
                  mb: 1.5,
                  transition: 'all 0.2s ease',
                  '&:hover': { 
                    color: 'white',
                    transform: 'translateX(4px)',
                  },
                }}
              >
                {link.label}
              </Typography>
            ))}
          </Grid>

          <Grid size={{ xs: 6, sm: 3, md: 2 }}>
            <Typography 
              variant="subtitle2" 
              fontWeight={700} 
              sx={{ mb: 2.5, color: 'white', letterSpacing: '0.02em' }}
            >
              Legal
            </Typography>
            {footerLinks.legal.map((link) => (
              <Typography
                key={link.label}
                component="a"
                href={link.href}
                variant="body2"
                sx={{
                  display: 'block',
                  color: alpha('#fff', 0.6),
                  textDecoration: 'none',
                  mb: 1.5,
                  transition: 'all 0.2s ease',
                  '&:hover': { 
                    color: 'white',
                    transform: 'translateX(4px)',
                  },
                }}
              >
                {link.label}
              </Typography>
            ))}
          </Grid>
        </Grid>

        <Divider sx={{ borderColor: alpha('#fff', 0.1), my: { xs: 4, md: 5 } }} />

        <Box
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', sm: 'row' },
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: 2,
            textAlign: { xs: 'center', sm: 'left' },
          }}
        >
          <Typography variant="body2" sx={{ color: alpha('#fff', 0.5) }}>
            © {new Date().getFullYear()} EduLearn. All rights reserved.
          </Typography>
          <Typography variant="body2" sx={{ color: alpha('#fff', 0.5) }}>
            Made with ❤️ for learners everywhere
          </Typography>
        </Box>
      </Container>
    </Box>
  );
}
