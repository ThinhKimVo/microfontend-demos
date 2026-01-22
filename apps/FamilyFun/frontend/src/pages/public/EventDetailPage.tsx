import React from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  Container,
  Box,
  Typography,
  Grid,
  Chip,
  Button,
  Paper,
  Divider,
  IconButton,
  Breadcrumbs,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import PersonIcon from '@mui/icons-material/Person';
import ShareIcon from '@mui/icons-material/Share';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import FacebookIcon from '@mui/icons-material/Facebook';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import AccessibleIcon from '@mui/icons-material/Accessible';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import { format } from 'date-fns';
import { mockEvents } from '../../data/mockData';
import EventCard from '../../components/EventCard';

interface EventDetailPageProps {
  language?: 'en' | 'tc';
}

const EventDetailPage: React.FC<EventDetailPageProps> = ({ language = 'en' }) => {
  const { id } = useParams<{ id: string }>();
  const event = mockEvents.find((e) => e.id === id);

  if (!event) {
    return (
      <Container maxWidth="lg" sx={{ py: 8, textAlign: 'center' }}>
        <Typography variant="h4" gutterBottom>
          {language === 'en' ? 'Event not found' : '找不到活動'}
        </Typography>
        <Button component={Link} to="/events" startIcon={<ArrowBackIcon />}>
          {language === 'en' ? 'Back to Events' : '返回活動列表'}
        </Button>
      </Container>
    );
  }

  const timeSlotLabels = {
    morning: language === 'en' ? 'Morning (6AM-12PM)' : '早上 (6AM-12PM)',
    afternoon: language === 'en' ? 'Afternoon (12PM-6PM)' : '下午 (12PM-6PM)',
    evening: language === 'en' ? 'Evening (6PM-12AM)' : '晚上 (6PM-12AM)',
  };

  const relatedEvents = mockEvents
    .filter((e) => e.id !== event.id && e.district === event.district)
    .slice(0, 3);

  const handleShare = () => {
    navigator.share?.({
      title: event.title,
      url: window.location.href,
    });
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
  };

  return (
    <Box sx={{ bgcolor: 'background.default', minHeight: '100vh' }}>
      {/* Hero Image */}
      <Box
        sx={{
          height: { xs: 250, md: 400 },
          position: 'relative',
          bgcolor: 'grey.200',
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
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'linear-gradient(to bottom, transparent 50%, rgba(0,0,0,0.5))',
          }}
        />
        <Container
          maxWidth="lg"
          sx={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            pb: 3,
          }}
        >
          <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
            {event.isFree && (
              <Chip
                label={language === 'en' ? 'Free' : '免費'}
                sx={{ bgcolor: 'success.main', color: 'white', fontWeight: 600 }}
              />
            )}
            {event.isSenFriendly && (
              <Chip
                icon={<AccessibleIcon sx={{ color: 'white !important' }} />}
                label="SEN Friendly"
                sx={{ bgcolor: 'info.main', color: 'white', fontWeight: 600 }}
              />
            )}
            {event.isFeatured && (
              <Chip
                label={language === 'en' ? 'Featured' : '精選'}
                sx={{ bgcolor: 'primary.main', color: 'white', fontWeight: 600 }}
              />
            )}
          </Box>
        </Container>
      </Box>

      <Container maxWidth="lg" sx={{ py: 4 }}>
        {/* Breadcrumbs */}
        <Breadcrumbs sx={{ mb: 3 }}>
          <Link to="/" style={{ color: 'inherit', textDecoration: 'none' }}>
            {language === 'en' ? 'Home' : '首頁'}
          </Link>
          <Link to="/events" style={{ color: 'inherit', textDecoration: 'none' }}>
            {language === 'en' ? 'Events' : '活動'}
          </Link>
          <Typography color="text.primary">
            {language === 'tc' && event.titleTC ? event.titleTC : event.title}
          </Typography>
        </Breadcrumbs>

        <Grid container spacing={4}>
          {/* Main Content */}
          <Grid size={{ xs: 12, md: 8 }}>
            <Paper sx={{ p: 4 }}>
              <Typography variant="h3" fontWeight={700} gutterBottom>
                {language === 'tc' && event.titleTC ? event.titleTC : event.title}
              </Typography>

              <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mb: 3 }}>
                {event.ageGroup.map((age) => (
                  <Chip key={age} label={age} variant="outlined" />
                ))}
              </Box>

              <Divider sx={{ my: 3 }} />

              <Typography variant="h6" fontWeight={600} gutterBottom>
                {language === 'en' ? 'About this event' : '關於此活動'}
              </Typography>
              <Typography variant="body1" color="text.secondary" sx={{ lineHeight: 1.8 }}>
                {language === 'tc' && event.descriptionTC
                  ? event.descriptionTC
                  : event.description}
              </Typography>

              {event.externalUrl && (
                <Button
                  variant="outlined"
                  endIcon={<OpenInNewIcon />}
                  href={event.externalUrl}
                  target="_blank"
                  sx={{ mt: 3 }}
                >
                  {language === 'en' ? 'Visit Original Website' : '訪問原始網站'}
                </Button>
              )}

              <Divider sx={{ my: 4 }} />

              {/* Map Placeholder */}
              <Typography variant="h6" fontWeight={600} gutterBottom>
                {language === 'en' ? 'Location' : '地點'}
              </Typography>
              <Box
                sx={{
                  height: 300,
                  bgcolor: 'grey.200',
                  borderRadius: 2,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  mb: 2,
                }}
              >
                <Typography color="text.secondary">
                  {language === 'en' ? 'Map will be displayed here' : '地圖將在此顯示'}
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1 }}>
                <LocationOnIcon color="action" />
                <Box>
                  <Typography variant="body1" fontWeight={500}>
                    {event.address}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {event.district}
                  </Typography>
                </Box>
              </Box>
            </Paper>
          </Grid>

          {/* Sidebar */}
          <Grid size={{ xs: 12, md: 4 }}>
            <Paper sx={{ p: 3, position: 'sticky', top: 80 }}>
              {/* Price */}
              <Box sx={{ textAlign: 'center', mb: 3 }}>
                <Typography
                  variant="h3"
                  fontWeight={700}
                  color={event.isFree ? 'success.main' : 'primary.main'}
                >
                  {event.isFree
                    ? language === 'en'
                      ? 'FREE'
                      : '免費'
                    : `HK$${event.price}`}
                </Typography>
                {!event.isFree && (
                  <Typography variant="body2" color="text.secondary">
                    {language === 'en' ? 'per person' : '每人'}
                  </Typography>
                )}
              </Box>

              <Divider sx={{ mb: 3 }} />

              {/* Event Details */}
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
                <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
                  <CalendarTodayIcon color="primary" />
                  <Box>
                    <Typography variant="body2" color="text.secondary">
                      {language === 'en' ? 'Date' : '日期'}
                    </Typography>
                    <Typography variant="body1" fontWeight={500}>
                      {format(new Date(event.date), 'EEEE, MMMM d, yyyy')}
                    </Typography>
                  </Box>
                </Box>

                <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
                  <AccessTimeIcon color="primary" />
                  <Box>
                    <Typography variant="body2" color="text.secondary">
                      {language === 'en' ? 'Time' : '時間'}
                    </Typography>
                    <Typography variant="body1" fontWeight={500}>
                      {timeSlotLabels[event.timeSlot]}
                    </Typography>
                  </Box>
                </Box>

                <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
                  <LocationOnIcon color="primary" />
                  <Box>
                    <Typography variant="body2" color="text.secondary">
                      {language === 'en' ? 'Location' : '地點'}
                    </Typography>
                    <Typography variant="body1" fontWeight={500}>
                      {event.district}
                    </Typography>
                  </Box>
                </Box>

                <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
                  <PersonIcon color="primary" />
                  <Box>
                    <Typography variant="body2" color="text.secondary">
                      {language === 'en' ? 'Age Group' : '年齡組'}
                    </Typography>
                    <Typography variant="body1" fontWeight={500}>
                      {event.ageGroup.join(', ')}
                    </Typography>
                  </Box>
                </Box>
              </Box>

              <Divider sx={{ my: 3 }} />

              {/* Share */}
              <Typography variant="subtitle2" gutterBottom>
                {language === 'en' ? 'Share this event' : '分享此活動'}
              </Typography>
              <Box sx={{ display: 'flex', gap: 1 }}>
                <IconButton
                  onClick={handleShare}
                  sx={{ bgcolor: 'action.hover' }}
                  size="small"
                >
                  <ShareIcon />
                </IconButton>
                <IconButton
                  onClick={handleCopyLink}
                  sx={{ bgcolor: 'action.hover' }}
                  size="small"
                >
                  <ContentCopyIcon />
                </IconButton>
                <IconButton
                  sx={{ bgcolor: '#1877F2', color: 'white', '&:hover': { bgcolor: '#166FE5' } }}
                  size="small"
                >
                  <FacebookIcon />
                </IconButton>
                <IconButton
                  sx={{ bgcolor: '#25D366', color: 'white', '&:hover': { bgcolor: '#20BD5A' } }}
                  size="small"
                >
                  <WhatsAppIcon />
                </IconButton>
              </Box>
            </Paper>
          </Grid>
        </Grid>

        {/* Related Events */}
        {relatedEvents.length > 0 && (
          <Box sx={{ mt: 6 }}>
            <Typography variant="h5" fontWeight={700} gutterBottom>
              {language === 'en' ? 'More events in' : '更多活動在'} {event.district}
            </Typography>
            <Grid container spacing={3} sx={{ mt: 1 }}>
              {relatedEvents.map((relEvent) => (
                <Grid size={{ xs: 12, sm: 6, md: 4 }} key={relEvent.id}>
                  <EventCard event={relEvent} language={language} />
                </Grid>
              ))}
            </Grid>
          </Box>
        )}
      </Container>
    </Box>
  );
};

export default EventDetailPage;
