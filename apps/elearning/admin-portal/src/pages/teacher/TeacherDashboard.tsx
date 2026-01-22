import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  Button,
  Avatar,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Snackbar,
  Alert,
} from '@mui/material';
import {
  School as CoursesIcon,
  People as StudentsIcon,
  AttachMoney as RevenueIcon,
  Star as RatingIcon,
  Add as AddIcon,
  TrendingUp as TrendingUpIcon,
  ArrowForward as ArrowForwardIcon,
} from '@mui/icons-material';
import { BarChart } from '@mui/x-charts/BarChart';
import { useAuth } from '../../App';
import { teacherDashboardStats, revenueData, courses, enrollments, reviews } from '../../data/mockData';
import { Teacher } from '../../data/types';

export default function TeacherDashboard() {
  const { user } = useAuth();
  const teacher = user as Teacher;
  const myCourses = courses.filter(c => c.teacherId === teacher?.id).slice(0, 4);
  const recentEnrollments = enrollments.slice(0, 5);
  const recentReviews = reviews.slice(0, 3);

  const [payoutDialogOpen, setPayoutDialogOpen] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);

  const handleRequestPayout = () => {
    setPayoutDialogOpen(false);
    setSnackbarOpen(true);
  };

  const stats = [
    {
      title: 'Total Students',
      value: teacherDashboardStats.totalStudents.toLocaleString(),
      icon: StudentsIcon,
      color: '#2563EB',
      change: '+12%',
    },
    {
      title: 'Published Courses',
      value: teacherDashboardStats.publishedCourses,
      icon: CoursesIcon,
      color: '#10B981',
    },
    {
      title: 'Total Revenue',
      value: `$${(teacherDashboardStats.totalRevenue / 1000).toFixed(1)}K`,
      icon: RevenueIcon,
      color: '#7C3AED',
      change: '+8%',
    },
    {
      title: 'Average Rating',
      value: teacherDashboardStats.averageRating.toFixed(1),
      icon: RatingIcon,
      color: '#F59E0B',
    },
  ];

  return (
    <Box>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Box>
          <Typography variant="h4" fontWeight={700} gutterBottom>
            Welcome back, {teacher?.firstName}!
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Here's what's happening with your courses today.
          </Typography>
        </Box>
        <Button
          component={Link}
          to="/teacher/courses/new"
          variant="contained"
          startIcon={<AddIcon />}
        >
          Create Course
        </Button>
      </Box>

      {/* Stats Grid */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {stats.map((stat, index) => (
          <Grid size={{ xs: 6, md: 3 }} key={index}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <Box>
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      {stat.title}
                    </Typography>
                    <Typography variant="h4" fontWeight={700}>
                      {stat.value}
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mt: 0.5, minHeight: 20 }}>
                      {stat.change && (
                        <>
                          <TrendingUpIcon sx={{ fontSize: 16, color: 'success.main' }} />
                          <Typography variant="caption" color="success.main">
                            {stat.change} this month
                          </Typography>
                        </>
                      )}
                    </Box>
                  </Box>
                  <Box
                    sx={{
                      width: 44,
                      height: 44,
                      borderRadius: 2,
                      bgcolor: `${stat.color}15`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <stat.icon sx={{ fontSize: 22, color: stat.color }} />
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Grid container spacing={3}>
        {/* Revenue Chart */}
        <Grid size={{ xs: 12, md: 8 }}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6" fontWeight={600}>
                  Revenue Overview
                </Typography>
                <Chip label="Last 7 months" size="small" />
              </Box>
              <BarChart
                xAxis={[{ scaleType: 'band', data: revenueData.map(d => d.month) }]}
                series={[
                  { data: revenueData.map(d => d.revenue), label: 'Revenue ($)', color: '#2563EB' },
                ]}
                height={280}
              />
            </CardContent>
          </Card>
        </Grid>

        {/* Pending Payout */}
        <Grid size={{ xs: 12, md: 4 }}>
          <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
            <CardContent sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', flex: 1 }}>
              <Typography variant="h6" fontWeight={600} gutterBottom>
                Pending Payout
              </Typography>
              <Box sx={{ textAlign: 'center', py: 2 }}>
                <Typography variant="h3" fontWeight={700} color="primary.main">
                  ${teacherDashboardStats.pendingPayout.toLocaleString()}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mt: 1, mb: 2 }}>
                  Available for withdrawal
                </Typography>
                <Button variant="contained" fullWidth onClick={() => setPayoutDialogOpen(true)}>
                  Request Payout
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* My Courses */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6" fontWeight={600}>
                  My Courses
                </Typography>
                <Button component={Link} to="/teacher/courses" endIcon={<ArrowForwardIcon />} size="small">
                  View All
                </Button>
              </Box>
              {myCourses.map((course) => (
                <Box
                  key={course.id}
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 2,
                    py: 1.5,
                    borderBottom: '1px solid',
                    borderColor: 'grey.100',
                    '&:last-child': { borderBottom: 'none' },
                  }}
                >
                  <Box
                    component="img"
                    src={course.thumbnail}
                    sx={{ width: 60, height: 40, borderRadius: 1, objectFit: 'cover' }}
                  />
                  <Box sx={{ flex: 1, minWidth: 0 }}>
                    <Typography variant="body2" fontWeight={600} noWrap>
                      {course.title}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {course.totalStudents.toLocaleString()} students
                    </Typography>
                  </Box>
                  <Chip
                    label={course.status}
                    size="small"
                    color={course.status === 'published' ? 'success' : course.status === 'pending' ? 'warning' : 'default'}
                  />
                </Box>
              ))}
            </CardContent>
          </Card>
        </Grid>

        {/* Recent Enrollments */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6" fontWeight={600}>
                  Recent Enrollments
                </Typography>
                <Button component={Link} to="/teacher/students" endIcon={<ArrowForwardIcon />} size="small">
                  View All
                </Button>
              </Box>
              {recentEnrollments.map((enrollment) => (
                <Box
                  key={enrollment.id}
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 2,
                    py: 1.5,
                    borderBottom: '1px solid',
                    borderColor: 'grey.100',
                    '&:last-child': { borderBottom: 'none' },
                  }}
                >
                  <Avatar sx={{ width: 36, height: 36 }}>
                    {enrollment.studentName[0]}
                  </Avatar>
                  <Box sx={{ flex: 1, minWidth: 0 }}>
                    <Typography variant="body2" fontWeight={600} noWrap>
                      {enrollment.studentName}
                    </Typography>
                    <Typography variant="caption" color="text.secondary" noWrap>
                      {enrollment.courseName}
                    </Typography>
                  </Box>
                  <Typography variant="caption" color="text.secondary">
                    {new Date(enrollment.enrolledAt).toLocaleDateString()}
                  </Typography>
                </Box>
              ))}
            </CardContent>
          </Card>
        </Grid>

        {/* Recent Reviews */}
        <Grid size={12}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6" fontWeight={600}>
                  Recent Reviews
                </Typography>
                <Button component={Link} to="/teacher/reviews" endIcon={<ArrowForwardIcon />} size="small">
                  View All
                </Button>
              </Box>
              <Grid container spacing={2}>
                {recentReviews.map((review) => (
                  <Grid size={{ xs: 12, md: 4 }} key={review.id}>
                    <Box sx={{ p: 2, bgcolor: 'grey.50', borderRadius: 2, height: '100%', minHeight: 140, display: 'flex', flexDirection: 'column' }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                        <Avatar sx={{ width: 32, height: 32 }}>{review.userName[0]}</Avatar>
                        <Box>
                          <Typography variant="body2" fontWeight={600}>
                            {review.userName}
                          </Typography>
                          <Box sx={{ display: 'flex', gap: 0.5 }}>
                            {[...Array(5)].map((_, i) => (
                              <RatingIcon
                                key={i}
                                sx={{ fontSize: 14, color: i < review.rating ? '#FBBF24' : 'grey.300' }}
                              />
                            ))}
                          </Box>
                        </Box>
                      </Box>
                      <Typography variant="body2" color="text.secondary" sx={{ mb: 1, flex: 1, overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>
                        {review.comment}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {review.courseName}
                      </Typography>
                    </Box>
                  </Grid>
                ))}
              </Grid>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Dialog open={payoutDialogOpen} onClose={() => setPayoutDialogOpen(false)}>
        <DialogTitle>Request Payout</DialogTitle>
        <DialogContent>
          <DialogContentText>
            You are about to request a payout of ${teacherDashboardStats.pendingPayout.toLocaleString()}.
            The funds will be transferred to your registered bank account within 3-5 business days.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setPayoutDialogOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleRequestPayout}>Confirm Request</Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={4000}
        onClose={() => setSnackbarOpen(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={() => setSnackbarOpen(false)} severity="success" sx={{ width: '100%' }}>
          Payout request submitted successfully! Funds will arrive in 3-5 business days.
        </Alert>
      </Snackbar>
    </Box>
  );
}
