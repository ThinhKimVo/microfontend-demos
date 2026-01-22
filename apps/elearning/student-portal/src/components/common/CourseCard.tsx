import { Link } from 'react-router-dom';
import {
  Card,
  CardMedia,
  CardContent,
  Box,
  Typography,
  Chip,
  Rating,
  Avatar,
  IconButton,
  alpha,
  useTheme,
} from '@mui/material';
import {
  AccessTime as DurationIcon,
  PlayLesson as LessonsIcon,
  FavoriteBorder as FavoriteIcon,
  Favorite as FavoriteFilledIcon,
  People as PeopleIcon,
} from '@mui/icons-material';
import { Course } from '../../data/types';

interface CourseCardProps {
  course: Course;
  isWishlisted?: boolean;
  onWishlistToggle?: (courseId: string) => void;
  showProgress?: boolean;
  progress?: number;
}

export default function CourseCard({
  course,
  isWishlisted = false,
  onWishlistToggle,
  showProgress = false,
  progress = 0,
}: CourseCardProps) {
  const theme = useTheme();
  
  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
  };

  const formatPrice = (price: number, currency: string) => {
    if (price === 0) return 'Free';
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency,
    }).format(price);
  };

  const discountPercent = course.originalPrice && course.originalPrice > course.price
    ? Math.round((1 - course.price / course.originalPrice) * 100)
    : 0;

  return (
    <Card
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        transition: 'all 0.3s ease',
        overflow: 'hidden',
        '&:hover': {
          transform: 'translateY(-6px)',
          boxShadow: '0px 16px 32px rgba(0, 0, 0, 0.1)',
          '& .course-thumbnail': {
            transform: 'scale(1.05)',
          },
        },
      }}
    >
      {/* Thumbnail */}
      <Box sx={{ position: 'relative', overflow: 'hidden' }}>
        <Link to={`/course/${course.slug}`}>
          <CardMedia
            className="course-thumbnail"
            component="img"
            sx={{ 
              height: { xs: 140, sm: 160, md: 180 },
              objectFit: 'cover',
              transition: 'transform 0.4s ease',
            }}
            image={course.thumbnail}
            alt={course.title}
          />
        </Link>

        {/* Badges */}
        <Box sx={{ position: 'absolute', top: 12, left: 12, display: 'flex', gap: 0.5, flexWrap: 'wrap' }}>
          {course.isBestseller && (
            <Chip 
              label="Bestseller" 
              size="small" 
              sx={{ 
                bgcolor: '#FBBF24', 
                color: 'grey.900', 
                fontWeight: 700,
                fontSize: '0.7rem',
                height: 24,
              }} 
            />
          )}
          {course.isNew && (
            <Chip 
              label="New" 
              size="small" 
              sx={{ 
                bgcolor: '#10B981', 
                color: 'white', 
                fontWeight: 700,
                fontSize: '0.7rem',
                height: 24,
              }} 
            />
          )}
          {discountPercent > 0 && (
            <Chip 
              label={`${discountPercent}% OFF`} 
              size="small" 
              sx={{ 
                bgcolor: 'error.main', 
                color: 'white', 
                fontWeight: 700,
                fontSize: '0.7rem',
                height: 24,
              }} 
            />
          )}
        </Box>

        {/* Wishlist Button */}
        {onWishlistToggle && (
          <IconButton
            onClick={(e) => {
              e.preventDefault();
              onWishlistToggle(course.id);
            }}
            sx={{
              position: 'absolute',
              top: 10,
              right: 10,
              bgcolor: alpha('#fff', 0.95),
              boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
              transition: 'all 0.2s ease',
              '&:hover': { 
                bgcolor: 'white',
                transform: 'scale(1.1)',
              },
            }}
            size="small"
          >
            {isWishlisted ? (
              <FavoriteFilledIcon sx={{ color: 'error.main', fontSize: 20 }} />
            ) : (
              <FavoriteIcon sx={{ fontSize: 20 }} />
            )}
          </IconButton>
        )}

        {/* Progress Bar */}
        {showProgress && progress > 0 && (
          <Box
            sx={{
              position: 'absolute',
              bottom: 0,
              left: 0,
              right: 0,
              height: 5,
              bgcolor: alpha('#000', 0.3),
            }}
          >
            <Box
              sx={{
                height: '100%',
                width: `${progress}%`,
                bgcolor: 'primary.main',
                borderRadius: '0 2px 2px 0',
              }}
            />
          </Box>
        )}
      </Box>

      {/* Content */}
      <CardContent 
        sx={{ 
          flex: 1, 
          display: 'flex', 
          flexDirection: 'column',
          p: { xs: 2, sm: 2.5 },
        }}
      >
        {/* Category */}
        <Typography 
          variant="caption" 
          sx={{ 
            color: 'primary.main',
            fontWeight: 600, 
            mb: 1,
            fontSize: '0.7rem',
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
          }}
        >
          {course.category.name}
        </Typography>

        {/* Title */}
        <Link to={`/course/${course.slug}`} style={{ textDecoration: 'none', color: 'inherit' }}>
          <Typography
            variant="subtitle1"
            fontWeight={600}
            sx={{
              mb: 1.5,
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
              lineHeight: 1.4,
              minHeight: '2.8em',
              fontSize: { xs: '0.9rem', sm: '1rem' },
              transition: 'color 0.2s ease',
              '&:hover': { color: 'primary.main' },
            }}
          >
            {course.title}
          </Typography>
        </Link>

        {/* Instructor */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
          <Avatar 
            src={course.teacher.avatar} 
            sx={{ 
              width: 24, 
              height: 24,
              border: '1px solid',
              borderColor: 'grey.200',
            }} 
          />
          <Typography variant="body2" color="text.secondary" fontWeight={500}>
            {course.teacher.name}
          </Typography>
        </Box>

        {/* Meta Info */}
        <Box 
          sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: { xs: 1.5, sm: 2 }, 
            mb: 2,
            flexWrap: 'wrap',
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            <DurationIcon sx={{ fontSize: 15, color: 'grey.500' }} />
            <Typography variant="caption" color="text.secondary" fontWeight={500}>
              {formatDuration(course.duration)}
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            <LessonsIcon sx={{ fontSize: 15, color: 'grey.500' }} />
            <Typography variant="caption" color="text.secondary" fontWeight={500}>
              {course.totalLessons} lessons
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            <PeopleIcon sx={{ fontSize: 15, color: 'grey.500' }} />
            <Typography variant="caption" color="text.secondary" fontWeight={500}>
              {course.totalStudents.toLocaleString()}
            </Typography>
          </Box>
        </Box>

        {/* Rating */}
        <Box 
          sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: 0.5, 
            mb: 2,
            p: 1,
            bgcolor: alpha(theme.palette.warning.main, 0.08),
            borderRadius: 1.5,
            width: 'fit-content',
          }}
        >
          <Typography variant="body2" fontWeight={700} color="warning.dark">
            {course.rating}
          </Typography>
          <Rating value={course.rating} precision={0.1} size="small" readOnly />
          <Typography variant="caption" color="text.secondary" fontWeight={500}>
            ({course.totalRatings.toLocaleString()})
          </Typography>
        </Box>

        {/* Price */}
        <Box 
          sx={{ 
            mt: 'auto', 
            display: 'flex', 
            alignItems: 'baseline', 
            gap: 1,
            pt: 2,
            borderTop: '1px solid',
            borderColor: 'grey.100',
          }}
        >
          <Typography 
            variant="h6" 
            fontWeight={800} 
            color={course.price === 0 ? 'success.main' : 'text.primary'}
            sx={{ fontSize: { xs: '1.1rem', sm: '1.25rem' } }}
          >
            {formatPrice(course.price, course.currency)}
          </Typography>
          {course.originalPrice && course.originalPrice > course.price && (
            <Typography 
              variant="body2" 
              color="text.secondary" 
              sx={{ textDecoration: 'line-through', fontSize: '0.85rem' }}
            >
              {formatPrice(course.originalPrice, course.currency)}
            </Typography>
          )}
        </Box>
      </CardContent>
    </Card>
  );
}
