import { Link } from 'react-router-dom';
import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  Button,
  LinearProgress,
  IconButton,
  alpha,
  useTheme,
  useMediaQuery,
  Chip,
} from '@mui/material';
import {
  School as SchoolIcon,
  CardMembership as CertificateIcon,
  AccessTime as TimeIcon,
  LocalFireDepartment as StreakIcon,
  PlayArrow as PlayIcon,
  ArrowForward as ArrowForwardIcon,
  ChevronRight as ChevronRightIcon,
  WavingHand as WaveIcon,
} from '@mui/icons-material';
import { BarChart } from '@mui/x-charts/BarChart';
import StatsCard from '../components/common/StatsCard';
import { useAuth } from '../App';
import { enrollments, learningProgress, notifications, courses } from '../data/mockData';

export default function DashboardPage() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const { user } = useAuth();
  const activeEnrollments = enrollments.filter(e => e.status === 'active');
  const recentNotifications = notifications.slice(0, 3);
  const recommendedCourses = courses.filter(c => !enrollments.some(e => e.courseId === c.id)).slice(0, 3);

  return (
    <Box sx={{ bgcolor: 'grey.50', minHeight: '100vh', py: { xs: 3, sm: 4, md: 5 } }}>
      <Container maxWidth="lg" sx={{ px: { xs: 2, sm: 3, md: 4 } }}>
        {/* Welcome Header */}
        <Box 
          sx={{ 
            mb: { xs: 3, sm: 4 },
            p: { xs: 3, sm: 4 },
            bgcolor: 'background.paper',
            borderRadius: 3,
            border: '1px solid',
            borderColor: 'grey.100',
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
            <Typography 
              variant="h4" 
              fontWeight={800}
              sx={{ fontSize: { xs: '1.5rem', sm: '1.75rem', md: '2rem' } }}
            >
              Welcome back, {user?.firstName}!
            </Typography>
            <WaveIcon sx={{ fontSize: { xs: 24, sm: 28 }, color: '#FBBF24' }} />
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flexWrap: 'wrap' }}>
            <Typography variant="body1" color="text.secondary">
              Continue your learning journey
            </Typography>
            <Chip
              icon={<StreakIcon sx={{ fontSize: 16 }} />}
              label={`${learningProgress.currentStreak}-day streak 🔥`}
              size="small"
              sx={{ 
                bgcolor: alpha(theme.palette.warning.main, 0.1),
                color: 'warning.dark',
                fontWeight: 600,
                '& .MuiChip-icon': { color: 'warning.main' }
              }}
            />
          </Box>
        </Box>

        {/* Stats Row */}
        <Grid container spacing={{ xs: 2, sm: 2.5, md: 3 }} sx={{ mb: { xs: 3, sm: 4 } }}>
          <Grid size={{ xs: 6, sm: 6, md: 3 }}>
            <StatsCard
              title="Enrolled Courses"
              value={learningProgress.totalCourses}
              icon={SchoolIcon}
              color="#2563EB"
            />
          </Grid>
          <Grid size={{ xs: 6, sm: 6, md: 3 }}>
            <StatsCard
              title="Completed"
              value={learningProgress.completedCourses}
              icon={CertificateIcon}
              color="#10B981"
            />
          </Grid>
          <Grid size={{ xs: 6, sm: 6, md: 3 }}>
            <StatsCard
              title="Hours Learned"
              value={learningProgress.totalHoursLearned}
              icon={TimeIcon}
              color="#7C3AED"
            />
          </Grid>
          <Grid size={{ xs: 6, sm: 6, md: 3 }}>
            <StatsCard
              title="Day Streak"
              value={learningProgress.currentStreak}
              subtitle={`Best: ${learningProgress.longestStreak} days`}
              icon={StreakIcon}
              color="#F59E0B"
            />
          </Grid>
        </Grid>

        <Grid container spacing={{ xs: 2, sm: 2.5, md: 3 }}>
          {/* Continue Learning */}
          <Grid size={{ xs: 12, lg: 8 }}>
            <Card sx={{ mb: { xs: 2, sm: 3 } }}>
              <CardContent sx={{ p: { xs: 2, sm: 3 } }}>
                <Box 
                  sx={{ 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    alignItems: 'center', 
                    mb: 3,
                    flexWrap: 'wrap',
                    gap: 1,
                  }}
                >
                  <Typography variant="h6" fontWeight={700}>
                    Continue Learning
                  </Typography>
                  <Button
                    component={Link}
                    to="/my-courses"
                    endIcon={<ArrowForwardIcon />}
                    size="small"
                    sx={{ flexShrink: 0 }}
                  >
                    View All
                  </Button>
                </Box>

                {activeEnrollments.length > 0 ? (
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    {activeEnrollments.slice(0, 3).map((enrollment) => (
                      <Box
                        key={enrollment.id}
                        sx={{
                          display: 'flex',
                          alignItems: { xs: 'flex-start', sm: 'center' },
                          flexDirection: { xs: 'column', sm: 'row' },
                          gap: 2,
                          p: { xs: 2, sm: 2.5 },
                          bgcolor: 'grey.50',
                          borderRadius: 2,
                          border: '1px solid',
                          borderColor: 'grey.100',
                          transition: 'all 0.2s ease',
                          '&:hover': { 
                            bgcolor: 'grey.100',
                            borderColor: 'grey.200',
                          },
                        }}
                      >
                        <Box
                          component="img"
                          src={enrollment.course.thumbnail}
                          sx={{
                            width: { xs: '100%', sm: 120 },
                            height: { xs: 100, sm: 70 },
                            borderRadius: 1.5,
                            objectFit: 'cover',
                            flexShrink: 0,
                          }}
                        />
                        <Box sx={{ flex: 1, minWidth: 0, width: '100%' }}>
                          <Typography 
                            variant="subtitle2" 
                            fontWeight={600} 
                            sx={{
                              display: '-webkit-box',
                              WebkitLineClamp: { xs: 2, sm: 1 },
                              WebkitBoxOrient: 'vertical',
                              overflow: 'hidden',
                              mb: 1,
                            }}
                          >
                            {enrollment.course.title}
                          </Typography>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                            <LinearProgress
                              variant="determinate"
                              value={enrollment.progress}
                              sx={{ 
                                flex: 1, 
                                height: 8, 
                                borderRadius: 4,
                                bgcolor: 'grey.200',
                              }}
                            />
                            <Typography 
                              variant="caption" 
                              color="text.secondary"
                              fontWeight={600}
                              sx={{ minWidth: 36 }}
                            >
                              {enrollment.progress}%
                            </Typography>
                          </Box>
                        </Box>
                        <Button
                          component={Link}
                          to={`/learn/${enrollment.course.slug}`}
                          variant="contained"
                          size="small"
                          startIcon={<PlayIcon />}
                          sx={{ 
                            flexShrink: 0,
                            width: { xs: '100%', sm: 'auto' },
                          }}
                        >
                          Resume
                        </Button>
                      </Box>
                    ))}
                  </Box>
                ) : (
                  <Box sx={{ textAlign: 'center', py: 6 }}>
                    <Typography variant="body1" color="text.secondary" gutterBottom>
                      You haven't enrolled in any courses yet.
                    </Typography>
                    <Button component={Link} to="/explore" variant="contained" sx={{ mt: 2 }}>
                      Explore Courses
                    </Button>
                  </Box>
                )}
              </CardContent>
            </Card>

            {/* Weekly Activity Chart */}
            <Card>
              <CardContent sx={{ p: { xs: 2, sm: 3 } }}>
                <Typography variant="h6" fontWeight={700} gutterBottom>
                  Weekly Activity
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  Your learning time this week
                </Typography>
                <Box sx={{ width: '100%', overflowX: 'auto' }}>
                  <BarChart
                    xAxis={[
                      {
                        scaleType: 'band',
                        data: learningProgress.weeklyProgress.map(d => d.day),
                      },
                    ]}
                    series={[
                      {
                        data: learningProgress.weeklyProgress.map(d => d.minutes),
                        color: '#2563EB',
                      },
                    ]}
                    height={isMobile ? 180 : 220}
                  />
                </Box>
              </CardContent>
            </Card>
          </Grid>

          {/* Sidebar */}
          <Grid size={{ xs: 12, lg: 4 }}>
            {/* Notifications */}
            <Card sx={{ mb: { xs: 2, sm: 3 } }}>
              <CardContent sx={{ p: { xs: 2, sm: 3 } }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                  <Typography variant="h6" fontWeight={700}>
                    Notifications
                  </Typography>
                  <Button component={Link} to="/notifications" size="small">
                    View All
                  </Button>
                </Box>

                {recentNotifications.map((notif, index) => (
                  <Box
                    key={notif.id}
                    sx={{
                      display: 'flex',
                      gap: 2,
                      py: 2,
                      borderBottom: index < recentNotifications.length - 1 ? '1px solid' : 'none',
                      borderColor: 'grey.100',
                    }}
                  >
                    <Box
                      sx={{
                        width: 10,
                        height: 10,
                        borderRadius: '50%',
                        bgcolor: notif.isRead ? 'grey.300' : 'primary.main',
                        mt: 0.5,
                        flexShrink: 0,
                        boxShadow: notif.isRead ? 'none' : `0 0 0 3px ${alpha(theme.palette.primary.main, 0.2)}`,
                      }}
                    />
                    <Box sx={{ flex: 1, minWidth: 0 }}>
                      <Typography 
                        variant="body2" 
                        fontWeight={notif.isRead ? 400 : 600}
                        sx={{
                          display: '-webkit-box',
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: 'vertical',
                          overflow: 'hidden',
                        }}
                      >
                        {notif.title}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {new Date(notif.createdAt).toLocaleDateString()}
                      </Typography>
                    </Box>
                  </Box>
                ))}
              </CardContent>
            </Card>

            {/* Recommended */}
            <Card>
              <CardContent sx={{ p: { xs: 2, sm: 3 } }}>
                <Typography variant="h6" fontWeight={700} gutterBottom>
                  Recommended for You
                </Typography>

                {recommendedCourses.map((course, index) => (
                  <Box
                    key={course.id}
                    component={Link}
                    to={`/course/${course.slug}`}
                    sx={{
                      display: 'flex',
                      gap: 2,
                      py: 2,
                      textDecoration: 'none',
                      color: 'inherit',
                      borderBottom: index < recommendedCourses.length - 1 ? '1px solid' : 'none',
                      borderColor: 'grey.100',
                      borderRadius: 1,
                      transition: 'all 0.2s ease',
                      '&:hover': { 
                        bgcolor: 'grey.50',
                        '& .course-arrow': {
                          transform: 'translateX(4px)',
                          color: 'primary.main',
                        }
                      },
                    }}
                  >
                    <Box
                      component="img"
                      src={course.thumbnail}
                      sx={{
                        width: { xs: 60, sm: 70 },
                        height: { xs: 45, sm: 52 },
                        borderRadius: 1.5,
                        objectFit: 'cover',
                        flexShrink: 0,
                      }}
                    />
                    <Box sx={{ flex: 1, minWidth: 0 }}>
                      <Typography 
                        variant="body2" 
                        fontWeight={600}
                        sx={{
                          display: '-webkit-box',
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: 'vertical',
                          overflow: 'hidden',
                          mb: 0.5,
                        }}
                      >
                        {course.title}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {course.teacher.name}
                      </Typography>
                    </Box>
                    <IconButton 
                      size="small"
                      className="course-arrow"
                      sx={{ 
                        flexShrink: 0,
                        transition: 'all 0.2s ease',
                      }}
                    >
                      <ChevronRightIcon fontSize="small" />
                    </IconButton>
                  </Box>
                ))}
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}
