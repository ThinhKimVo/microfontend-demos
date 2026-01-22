import React from 'react';
import { Link } from 'react-router-dom';
import {
  Container,
  Box,
  Typography,
  Grid,
  Button,
  TextField,
  InputAdornment,
  Card,
  Chip,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import AccessibleIcon from '@mui/icons-material/Accessible';
import FlightIcon from '@mui/icons-material/Flight';
import LocalOfferIcon from '@mui/icons-material/LocalOffer';
import EventCard from '../../components/EventCard';
import { mockEvents } from '../../data/mockData';

interface HomePageProps {
  language?: 'en' | 'tc';
}

const HomePage: React.FC<HomePageProps> = ({ language = 'en' }) => {
  const featuredEvents = mockEvents.filter((e) => e.isFeatured);
  const senEvents = mockEvents.filter((e) => e.isSenFriendly);
  const freeEvents = mockEvents.filter((e) => e.isFree);

  const quickCategories = [
    {
      icon: <AccessibleIcon sx={{ fontSize: 40 }} />,
      title: language === 'en' ? 'SEN Friendly' : 'SEN友善',
      description: language === 'en' ? 'Inclusive activities for all abilities' : '適合所有能力的包容性活動',
      color: '#0984E3',
      link: '/events?sen=true',
    },
    {
      icon: <LocalOfferIcon sx={{ fontSize: 40 }} />,
      title: language === 'en' ? 'Free Events' : '免費活動',
      description: language === 'en' ? 'Great activities at no cost' : '精彩的免費活動',
      color: '#00B894',
      link: '/events?price=free',
    },
    {
      icon: <FlightIcon sx={{ fontSize: 40 }} />,
      title: language === 'en' ? 'Tourist Mode' : '遊客模式',
      description: language === 'en' ? 'Perfect for visitors to HK' : '適合香港遊客',
      color: '#FF6B35',
      link: '/events?tourist=true',
    },
  ];

  return (
    <Box>
      {/* Hero Section */}
      <Box
        sx={{
          bgcolor: 'primary.main',
          color: 'white',
          py: { xs: 6, md: 10 },
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <Container maxWidth="lg">
          <Grid container spacing={4} alignItems="center">
            <Grid size={{ xs: 12, md: 7 }}>
              <Typography
                variant="h2"
                component="h1"
                fontWeight={700}
                sx={{
                  fontSize: { xs: '2rem', md: '3rem' },
                  mb: 2,
                }}
              >
                {language === 'en'
                  ? 'Discover Family Fun in Hong Kong'
                  : '探索香港親子樂趣'}
              </Typography>
              <Typography
                variant="h6"
                sx={{ mb: 4, opacity: 0.9, fontWeight: 400 }}
              >
                {language === 'en'
                  ? 'Find the perfect activities for your family - from educational workshops to outdoor adventures'
                  : '為您的家庭找到完美的活動 - 從教育工作坊到戶外探險'}
              </Typography>

              <Box
                sx={{
                  display: 'flex',
                  gap: 2,
                  flexDirection: { xs: 'column', sm: 'row' },
                }}
              >
                <TextField
                  placeholder={language === 'en' ? 'Search events...' : '搜索活動...'}
                  variant="outlined"
                  fullWidth
                  sx={{
                    maxWidth: 400,
                    bgcolor: 'white',
                    borderRadius: 2,
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 2,
                    },
                  }}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <SearchIcon color="action" />
                      </InputAdornment>
                    ),
                  }}
                />
                <Button
                  variant="contained"
                  size="large"
                  component={Link}
                  to="/events"
                  sx={{
                    bgcolor: 'white',
                    color: 'primary.main',
                    px: 4,
                    '&:hover': {
                      bgcolor: 'grey.100',
                    },
                  }}
                >
                  {language === 'en' ? 'Browse All' : '瀏覽全部'}
                </Button>
              </Box>
            </Grid>
            <Grid size={{ xs: 12, md: 5 }} sx={{ display: { xs: 'none', md: 'block' } }}>
              <Box
                sx={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(2, 1fr)',
                  gap: 2,
                }}
              >
                {featuredEvents.slice(0, 4).map((event, idx) => (
                  <Box
                    key={event.id}
                    sx={{
                      borderRadius: 3,
                      overflow: 'hidden',
                      height: idx === 0 || idx === 3 ? 180 : 140,
                      boxShadow: 3,
                    }}
                  >
                    <img
                      src={event.imageUrl}
                      alt={event.title}
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                      }}
                    />
                  </Box>
                ))}
              </Box>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Quick Categories */}
      <Container maxWidth="lg" sx={{ mt: -4, mb: 6, position: 'relative', zIndex: 1 }}>
        <Grid container spacing={3}>
          {quickCategories.map((cat) => (
            <Grid size={{ xs: 12, md: 4 }} key={cat.title}>
              <Card
                component={Link}
                to={cat.link}
                sx={{
                  textDecoration: 'none',
                  display: 'flex',
                  alignItems: 'center',
                  p: 3,
                  gap: 2,
                  cursor: 'pointer',
                  '&:hover': {
                    '& .icon-box': {
                      transform: 'scale(1.1)',
                    },
                  },
                }}
              >
                <Box
                  className="icon-box"
                  sx={{
                    p: 2,
                    borderRadius: 2,
                    bgcolor: `${cat.color}15`,
                    color: cat.color,
                    transition: 'transform 0.2s',
                  }}
                >
                  {cat.icon}
                </Box>
                <Box>
                  <Typography variant="h6" fontWeight={600}>
                    {cat.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {cat.description}
                  </Typography>
                </Box>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* Featured Events */}
      <Container maxWidth="lg" sx={{ py: 6 }}>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            mb: 4,
          }}
        >
          <Box>
            <Typography variant="h4" fontWeight={700}>
              {language === 'en' ? 'Featured Events' : '精選活動'}
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mt: 0.5 }}>
              {language === 'en'
                ? 'Handpicked activities for families'
                : '精心挑選的家庭活動'}
            </Typography>
          </Box>
          <Button
            component={Link}
            to="/events?featured=true"
            endIcon={<ArrowForwardIcon />}
          >
            {language === 'en' ? 'View All' : '查看全部'}
          </Button>
        </Box>

        <Grid container spacing={3}>
          {featuredEvents.slice(0, 4).map((event) => (
            <Grid size={{ xs: 12, sm: 6, md: 3 }} key={event.id}>
              <EventCard event={event} language={language} />
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* SEN Friendly Section */}
      <Box sx={{ bgcolor: '#E3F2FD', py: 6 }}>
        <Container maxWidth="lg">
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              mb: 4,
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Box
                sx={{
                  p: 1.5,
                  borderRadius: 2,
                  bgcolor: 'info.main',
                  color: 'white',
                }}
              >
                <AccessibleIcon />
              </Box>
              <Box>
                <Typography variant="h4" fontWeight={700}>
                  {language === 'en' ? 'SEN Friendly Events' : 'SEN友善活動'}
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  {language === 'en'
                    ? 'Inclusive activities for children with special needs'
                    : '適合有特殊需要兒童的包容性活動'}
                </Typography>
              </Box>
            </Box>
            <Button
              component={Link}
              to="/events?sen=true"
              endIcon={<ArrowForwardIcon />}
              sx={{ display: { xs: 'none', sm: 'flex' } }}
            >
              {language === 'en' ? 'View All' : '查看全部'}
            </Button>
          </Box>

          <Grid container spacing={3}>
            {senEvents.slice(0, 4).map((event) => (
              <Grid size={{ xs: 12, sm: 6, md: 3 }} key={event.id}>
                <EventCard event={event} language={language} />
              </Grid>
            ))}
          </Grid>

          <Box sx={{ display: { xs: 'block', sm: 'none' }, mt: 3, textAlign: 'center' }}>
            <Button
              component={Link}
              to="/events?sen=true"
              endIcon={<ArrowForwardIcon />}
            >
              {language === 'en' ? 'View All SEN Events' : '查看所有SEN活動'}
            </Button>
          </Box>
        </Container>
      </Box>

      {/* Free Events Section */}
      <Container maxWidth="lg" sx={{ py: 6 }}>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            mb: 4,
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Chip
              label={language === 'en' ? 'FREE' : '免費'}
              color="success"
              sx={{ fontWeight: 700, fontSize: '1rem', py: 2 }}
            />
            <Box>
              <Typography variant="h4" fontWeight={700}>
                {language === 'en' ? 'Free Events' : '免費活動'}
              </Typography>
              <Typography variant="body1" color="text.secondary">
                {language === 'en'
                  ? 'Great family fun at no cost'
                  : '精彩的免費家庭活動'}
              </Typography>
            </Box>
          </Box>
          <Button
            component={Link}
            to="/events?price=free"
            endIcon={<ArrowForwardIcon />}
          >
            {language === 'en' ? 'View All' : '查看全部'}
          </Button>
        </Box>

        <Grid container spacing={3}>
          {freeEvents.slice(0, 4).map((event) => (
            <Grid size={{ xs: 12, sm: 6, md: 3 }} key={event.id}>
              <EventCard event={event} language={language} />
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* CTA Section */}
      <Box sx={{ bgcolor: 'secondary.main', color: 'white', py: 8 }}>
        <Container maxWidth="md">
          <Box textAlign="center">
            <Typography variant="h4" fontWeight={700} gutterBottom>
              {language === 'en'
                ? 'Are you an event organizer?'
                : '您是活動組織者嗎？'}
            </Typography>
            <Typography variant="h6" sx={{ mb: 4, opacity: 0.9 }}>
              {language === 'en'
                ? 'List your family events and reach thousands of parents in Hong Kong'
                : '列出您的家庭活動，接觸香港數千名家長'}
            </Typography>
            <Button
              variant="contained"
              size="large"
              component={Link}
              to="/merchant/register"
              sx={{
                bgcolor: 'primary.main',
                px: 5,
                py: 1.5,
                fontSize: '1.1rem',
                '&:hover': {
                  bgcolor: 'primary.dark',
                },
              }}
            >
              {language === 'en' ? 'Start Free Trial' : '開始免費試用'}
            </Button>
            <Typography variant="body2" sx={{ mt: 2, opacity: 0.7 }}>
              {language === 'en'
                ? '2 months free trial - No credit card required'
                : '2個月免費試用 - 無需信用卡'}
            </Typography>
          </Box>
        </Container>
      </Box>
    </Box>
  );
};

export default HomePage;
