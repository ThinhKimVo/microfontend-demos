import { Link, useParams } from 'react-router-dom';
import { AppBar, Toolbar, Box, Typography, IconButton, LinearProgress, Button } from '@mui/material';
import {
  ArrowBack as ArrowBackIcon,
  School as SchoolIcon,
  MoreVert as MoreVertIcon,
} from '@mui/icons-material';
import { courses, enrollments } from '../../data/mockData';

export default function LearningHeader() {
  const { courseSlug } = useParams();
  const course = courses.find(c => c.slug === courseSlug);
  const enrollment = enrollments.find(e => e.courseId === course?.id);

  return (
    <AppBar position="fixed" elevation={0} sx={{ bgcolor: 'grey.900' }}>
      <Toolbar sx={{ gap: 2 }}>
        {/* Back Button */}
        <IconButton
          component={Link}
          to="/my-courses"
          sx={{ color: 'white' }}
        >
          <ArrowBackIcon />
        </IconButton>

        {/* Logo */}
        <Box
          sx={{
            width: 32,
            height: 32,
            borderRadius: 1,
            bgcolor: 'primary.main',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <SchoolIcon sx={{ color: 'white', fontSize: 20 }} />
        </Box>

        {/* Divider */}
        <Box sx={{ width: 1, height: 24, bgcolor: 'grey.700' }} />

        {/* Course Title */}
        <Typography
          variant="subtitle1"
          fontWeight={500}
          color="white"
          sx={{
            flex: 1,
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
          }}
        >
          {course?.title || 'Course'}
        </Typography>

        {/* Progress */}
        {enrollment && (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Box sx={{ width: 200, display: { xs: 'none', md: 'block' } }}>
              <LinearProgress
                variant="determinate"
                value={enrollment.progress}
                sx={{
                  height: 6,
                  borderRadius: 3,
                  bgcolor: 'grey.700',
                  '& .MuiLinearProgress-bar': {
                    bgcolor: 'primary.main',
                  },
                }}
              />
            </Box>
            <Typography variant="body2" color="grey.400">
              {enrollment.progress}% complete
            </Typography>
          </Box>
        )}

        {/* Leave Review */}
        <Button
          variant="outlined"
          size="small"
          sx={{
            color: 'white',
            borderColor: 'grey.600',
            display: { xs: 'none', sm: 'flex' },
            '&:hover': {
              borderColor: 'grey.400',
            },
          }}
        >
          Leave a review
        </Button>

        <IconButton sx={{ color: 'grey.400' }}>
          <MoreVertIcon />
        </IconButton>
      </Toolbar>
    </AppBar>
  );
}
