import React from 'react';
import { Link } from 'react-router-dom';
import {
  Card,
  CardMedia,
  CardContent,
  Typography,
  Box,
  Chip,
  IconButton,
} from '@mui/material';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import ShareIcon from '@mui/icons-material/Share';
import AccessibleIcon from '@mui/icons-material/Accessible';
import type { Event } from '../types';
import { format } from 'date-fns';

interface EventCardProps {
  event: Event;
  language?: 'en' | 'tc';
}

const EventCard: React.FC<EventCardProps> = ({ event, language = 'en' }) => {
  const timeSlotLabels = {
    morning: language === 'en' ? 'Morning' : '早上',
    afternoon: language === 'en' ? 'Afternoon' : '下午',
    evening: language === 'en' ? 'Evening' : '晚上',
  };

  const handleShare = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    navigator.share?.({
      title: event.title,
      url: window.location.origin + '/events/' + event.id,
    });
  };

  return (
    <Card
      component={Link}
      to={`/events/${event.id}`}
      sx={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        textDecoration: 'none',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <Box sx={{ position: 'relative' }}>
        <CardMedia
          component="img"
          height="180"
          image={event.imageUrl || 'https://via.placeholder.com/400x200?text=Event'}
          alt={event.title}
          sx={{ objectFit: 'cover' }}
        />

        <Box
          sx={{
            position: 'absolute',
            top: 12,
            left: 12,
            display: 'flex',
            gap: 0.5,
            flexWrap: 'wrap',
          }}
        >
          {event.isFree && (
            <Chip
              label={language === 'en' ? 'Free' : '免費'}
              size="small"
              sx={{
                bgcolor: 'success.main',
                color: 'white',
                fontWeight: 600,
              }}
            />
          )}
          {event.isSenFriendly && (
            <Chip
              icon={<AccessibleIcon sx={{ color: 'white !important', fontSize: 16 }} />}
              label="SEN"
              size="small"
              sx={{
                bgcolor: 'info.main',
                color: 'white',
                fontWeight: 600,
              }}
            />
          )}
          {event.isFeatured && (
            <Chip
              label={language === 'en' ? 'Featured' : '精選'}
              size="small"
              sx={{
                bgcolor: 'primary.main',
                color: 'white',
                fontWeight: 600,
              }}
            />
          )}
        </Box>

        <IconButton
          onClick={handleShare}
          sx={{
            position: 'absolute',
            top: 8,
            right: 8,
            bgcolor: 'rgba(255,255,255,0.9)',
            '&:hover': {
              bgcolor: 'white',
            },
          }}
          size="small"
        >
          <ShareIcon fontSize="small" />
        </IconButton>
      </Box>

      <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
        <Typography
          variant="h6"
          component="h3"
          sx={{
            fontWeight: 600,
            mb: 1,
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
            lineHeight: 1.3,
          }}
        >
          {language === 'tc' && event.titleTC ? event.titleTC : event.title}
        </Typography>

        <Box sx={{ display: 'flex', alignItems: 'center', mb: 0.5 }}>
          <CalendarTodayIcon sx={{ fontSize: 16, color: 'text.secondary', mr: 0.5 }} />
          <Typography variant="body2" color="text.secondary">
            {format(new Date(event.date), 'MMM d, yyyy')}
          </Typography>
          <AccessTimeIcon sx={{ fontSize: 16, color: 'text.secondary', ml: 1.5, mr: 0.5 }} />
          <Typography variant="body2" color="text.secondary">
            {timeSlotLabels[event.timeSlot]}
          </Typography>
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1.5 }}>
          <LocationOnIcon sx={{ fontSize: 16, color: 'text.secondary', mr: 0.5 }} />
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
            }}
          >
            {event.district}
          </Typography>
        </Box>

        <Box sx={{ mt: 'auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap' }}>
            {event.ageGroup.slice(0, 2).map((age) => (
              <Chip
                key={age}
                label={age}
                size="small"
                variant="outlined"
                sx={{ fontSize: '0.7rem', height: 24 }}
              />
            ))}
          </Box>
          <Typography
            variant="subtitle1"
            fontWeight={700}
            color={event.isFree ? 'success.main' : 'primary.main'}
          >
            {event.isFree
              ? language === 'en' ? 'Free' : '免費'
              : `HK$${event.price}`}
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );
};

export default EventCard;
