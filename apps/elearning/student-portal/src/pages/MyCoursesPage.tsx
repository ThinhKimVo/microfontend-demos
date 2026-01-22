import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Box,
  Container,
  Typography,
  Tabs,
  Tab,
  Grid,
  Card,
  CardContent,
  CardMedia,
  LinearProgress,
  Button,
  Chip,
  IconButton,
  Menu,
  MenuItem,
  alpha,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import {
  PlayArrow as PlayIcon,
  MoreVert as MoreIcon,
  Star as StarIcon,
  AccessTime as TimeIcon,
  School as SchoolIcon,
} from '@mui/icons-material';
import { enrollments } from '../data/mockData';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel({ children, value, index }: TabPanelProps) {
  return (
    <div role="tabpanel" hidden={value !== index}>
      {value === index && <Box sx={{ pt: 3 }}>{children}</Box>}
    </div>
  );
}

export default function MyCoursesPage() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [tabValue, setTabValue] = useState(0);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const activeEnrollments = enrollments.filter(e => e.status === 'active');
  const completedEnrollments = enrollments.filter(e => e.status === 'completed');

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>, _courseId: string) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
  };

  const CourseGrid = ({ items }: { items: typeof enrollments }) => (
    <Grid container spacing={{ xs: 2, sm: 2.5, md: 3 }}>
      {items.map((enrollment) => (
        <Grid size={{ xs: 12, sm: 6, lg: 4 }} key={enrollment.id}>
          <Card 
            sx={{ 
              height: '100%', 
              display: 'flex', 
              flexDirection: 'column',
              transition: 'all 0.3s ease',
              '&:hover': {
                transform: 'translateY(-4px)',
              }
            }}
          >
            <Box sx={{ position: 'relative', overflow: 'hidden' }}>
              <CardMedia
                component="img"
                sx={{ 
                  height: { xs: 140, sm: 160, md: 180 },
                  transition: 'transform 0.4s ease',
                }}
                image={enrollment.course.thumbnail}
                alt={enrollment.course.title}
              />
              {enrollment.status === 'completed' && (
                <Chip
                  label="Completed"
                  size="small"
                  sx={{
                    position: 'absolute',
                    top: 10,
                    left: 10,
                    bgcolor: '#10B981',
                    color: 'white',
                    fontWeight: 700,
                    fontSize: '0.7rem',
                  }}
                />
              )}
              {enrollment.status === 'active' && (
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
                      width: `${enrollment.progress}%`,
                      bgcolor: 'primary.main',
                      borderRadius: '0 2px 2px 0',
                    }}
                  />
                </Box>
              )}
            </Box>

            <CardContent sx={{ flex: 1, display: 'flex', flexDirection: 'column', p: { xs: 2, sm: 2.5 } }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
                <Typography 
                  variant="caption" 
                  sx={{ 
                    color: 'primary.main',
                    fontWeight: 600,
                    fontSize: '0.7rem',
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em',
                  }}
                >
                  {enrollment.course.category.name}
                </Typography>
                <IconButton
                  size="small"
                  onClick={(e) => handleMenuOpen(e, enrollment.id)}
                  sx={{ mt: -0.5, mr: -0.5 }}
                >
                  <MoreIcon fontSize="small" />
                </IconButton>
              </Box>

              <Typography
                variant="subtitle1"
                fontWeight={600}
                sx={{
                  mb: 1,
                  display: '-webkit-box',
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: 'vertical',
                  overflow: 'hidden',
                  fontSize: { xs: '0.9rem', sm: '1rem' },
                  lineHeight: 1.4,
                }}
              >
                {enrollment.course.title}
              </Typography>

              <Typography variant="body2" color="text.secondary" fontWeight={500} sx={{ mb: 2 }}>
                {enrollment.course.teacher.name}
              </Typography>

              {enrollment.status === 'active' && (
                <Box sx={{ mb: 2 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                    <Typography variant="caption" color="text.secondary" fontWeight={500}>
                      Progress
                    </Typography>
                    <Typography variant="caption" fontWeight={700} color="primary.main">
                      {enrollment.progress}%
                    </Typography>
                  </Box>
                  <LinearProgress
                    variant="determinate"
                    value={enrollment.progress}
                    sx={{ height: 8, borderRadius: 4, bgcolor: 'grey.200' }}
                  />
                </Box>
              )}

              <Box sx={{ display: 'flex', gap: 2, mb: 2, mt: 'auto' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                  <TimeIcon sx={{ fontSize: 15, color: 'grey.500' }} />
                  <Typography variant="caption" color="text.secondary" fontWeight={500}>
                    {formatDuration(enrollment.course.duration)}
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                  <StarIcon sx={{ fontSize: 15, color: '#FBBF24' }} />
                  <Typography variant="caption" color="text.secondary" fontWeight={500}>
                    {enrollment.course.rating}
                  </Typography>
                </Box>
              </Box>

              <Button
                component={Link}
                to={`/learn/${enrollment.course.slug}`}
                variant="contained"
                fullWidth
                startIcon={<PlayIcon />}
                sx={{ borderRadius: 2 }}
              >
                {enrollment.status === 'completed' ? 'Review' : 'Continue'}
              </Button>
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
  );

  return (
    <Box sx={{ bgcolor: 'grey.50', minHeight: '100vh', py: { xs: 3, sm: 4, md: 5 } }}>
      <Container maxWidth="lg" sx={{ px: { xs: 2, sm: 3, md: 4 } }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1 }}>
          <SchoolIcon sx={{ color: 'primary.main', fontSize: { xs: 28, sm: 32 } }} />
          <Typography 
            variant="h4" 
            fontWeight={800}
            sx={{ fontSize: { xs: '1.5rem', sm: '1.75rem', md: '2rem' } }}
          >
            My Courses
          </Typography>
        </Box>
        <Typography variant="body1" color="text.secondary" sx={{ mb: { xs: 3, sm: 4 } }}>
          Continue learning and track your progress
        </Typography>

        <Tabs
          value={tabValue}
          onChange={(_, value) => setTabValue(value)}
          sx={{ 
            borderBottom: 1, 
            borderColor: 'divider', 
            mb: 3,
            '& .MuiTab-root': {
              fontWeight: 600,
              fontSize: { xs: '0.85rem', sm: '0.9375rem' },
            }
          }}
          variant={isMobile ? 'fullWidth' : 'standard'}
        >
          <Tab label={`In Progress (${activeEnrollments.length})`} />
          <Tab label={`Completed (${completedEnrollments.length})`} />
        </Tabs>

        <TabPanel value={tabValue} index={0}>
          {activeEnrollments.length > 0 ? (
            <CourseGrid items={activeEnrollments} />
          ) : (
            <Card sx={{ textAlign: 'center', py: { xs: 6, sm: 8 }, borderRadius: 3 }}>
              <CardContent>
                <Typography variant="h6" fontWeight={600} gutterBottom>
                  No courses in progress
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 3, maxWidth: 300, mx: 'auto' }}>
                  Start learning something new today!
                </Typography>
                <Button component={Link} to="/explore" variant="contained" sx={{ borderRadius: 2 }}>
                  Explore Courses
                </Button>
              </CardContent>
            </Card>
          )}
        </TabPanel>

        <TabPanel value={tabValue} index={1}>
          {completedEnrollments.length > 0 ? (
            <CourseGrid items={completedEnrollments} />
          ) : (
            <Card sx={{ textAlign: 'center', py: { xs: 6, sm: 8 }, borderRadius: 3 }}>
              <CardContent>
                <Typography variant="h6" fontWeight={600} gutterBottom>
                  No completed courses yet
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ maxWidth: 300, mx: 'auto' }}>
                  Keep learning to complete your first course!
                </Typography>
              </CardContent>
            </Card>
          )}
        </TabPanel>
      </Container>

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        <MenuItem onClick={handleMenuClose}>View Course Details</MenuItem>
        <MenuItem onClick={handleMenuClose}>Leave a Review</MenuItem>
        <MenuItem onClick={handleMenuClose}>Download Certificate</MenuItem>
        <MenuItem onClick={handleMenuClose} sx={{ color: 'error.main' }}>
          Unenroll
        </MenuItem>
      </Menu>
    </Box>
  );
}
