import React from 'react';
import { Link } from 'react-router-dom';
import {
  Container,
  Box,
  Typography,
  Paper,
  Button,
} from '@mui/material';
import Grid from '@mui/material/Grid2';
import FamilyRestroomIcon from '@mui/icons-material/FamilyRestroom';
import SearchIcon from '@mui/icons-material/Search';
import VerifiedIcon from '@mui/icons-material/Verified';
import AccessibleIcon from '@mui/icons-material/Accessible';

interface AboutPageProps {
  language?: 'en' | 'tc';
}

const AboutPage: React.FC<AboutPageProps> = ({ language = 'en' }) => {
  const features = [
    {
      icon: <SearchIcon sx={{ fontSize: 48 }} />,
      title: language === 'en' ? 'Easy Discovery' : '輕鬆發現',
      description:
        language === 'en'
          ? 'Find family activities with powerful filters for date, location, age group, and more.'
          : '透過日期、地點、年齡組等強大篩選功能找到家庭活動。',
    },
    {
      icon: <VerifiedIcon sx={{ fontSize: 48 }} />,
      title: language === 'en' ? 'Verified Events' : '認證活動',
      description:
        language === 'en'
          ? 'All events are reviewed by our team to ensure quality and accuracy.'
          : '所有活動都經過我們團隊審核，確保質量和準確性。',
    },
    {
      icon: <AccessibleIcon sx={{ fontSize: 48 }} />,
      title: language === 'en' ? 'SEN Friendly' : 'SEN友善',
      description:
        language === 'en'
          ? 'Easily find inclusive activities suitable for children with special educational needs.'
          : '輕鬆找到適合有特殊教育需要兒童的包容性活動。',
    },
  ];

  return (
    <Box>
      {/* Hero */}
      <Box sx={{ bgcolor: 'primary.main', color: 'white', py: 8 }}>
        <Container maxWidth="md" sx={{ textAlign: 'center' }}>
          <FamilyRestroomIcon sx={{ fontSize: 64, mb: 2 }} />
          <Typography variant="h3" fontWeight={700} gutterBottom>
            {language === 'en' ? 'About Family Fun HK' : '關於 Family Fun HK'}
          </Typography>
          <Typography variant="h6" sx={{ opacity: 0.9 }}>
            {language === 'en'
              ? 'Your one-stop platform for discovering family-friendly activities in Hong Kong'
              : '您探索香港親子活動的一站式平台'}
          </Typography>
        </Container>
      </Box>

      {/* Mission */}
      <Container maxWidth="md" sx={{ py: 8 }}>
        <Typography variant="h4" fontWeight={700} textAlign="center" gutterBottom>
          {language === 'en' ? 'Our Mission' : '我們的使命'}
        </Typography>
        <Typography
          variant="body1"
          color="text.secondary"
          textAlign="center"
          sx={{ fontSize: '1.1rem', lineHeight: 1.8 }}
        >
          {language === 'en'
            ? 'We believe every family deserves quality time together. Our platform connects parents with the best activities, workshops, and events across Hong Kong - making it easier than ever to create lasting memories with your children.'
            : '我們相信每個家庭都值得擁有優質的共處時光。我們的平台將家長與香港各地最好的活動、工作坊和活動聯繫起來 - 讓與孩子創造持久回憶比以往更加容易。'}
        </Typography>
      </Container>

      {/* Features */}
      <Box sx={{ bgcolor: 'background.default', py: 8 }}>
        <Container maxWidth="lg">
          <Grid container spacing={4}>
            {features.map((feature) => (
              <Grid size={{ xs: 12, md: 4 }} key={feature.title}>
                <Paper
                  sx={{
                    p: 4,
                    textAlign: 'center',
                    height: '100%',
                  }}
                >
                  <Box sx={{ color: 'primary.main', mb: 2 }}>{feature.icon}</Box>
                  <Typography variant="h6" fontWeight={600} gutterBottom>
                    {feature.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {feature.description}
                  </Typography>
                </Paper>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* For Merchants */}
      <Container maxWidth="md" sx={{ py: 8, textAlign: 'center' }}>
        <Typography variant="h4" fontWeight={700} gutterBottom>
          {language === 'en' ? 'For Event Organizers' : '活動組織者'}
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
          {language === 'en'
            ? 'Reach thousands of Hong Kong families looking for activities. Submit your events and grow your audience with our platform.'
            : '接觸數千個尋找活動的香港家庭。提交您的活動，通過我們的平台擴大您的受眾。'}
        </Typography>
        <Button
          variant="contained"
          size="large"
          component={Link}
          to="/merchant/register"
        >
          {language === 'en' ? 'Start Free Trial' : '開始免費試用'}
        </Button>
      </Container>
    </Box>
  );
};

export default AboutPage;
