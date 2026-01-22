import { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  Button,
  Chip,
  Rating,
  Avatar,
  Tabs,
  Tab,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  IconButton,
  Snackbar,
  Alert,
} from '@mui/material';
import {
  PlayCircle as PlayIcon,
  AccessTime as TimeIcon,
  People as PeopleIcon,
  School as LessonsIcon,
  Language as LanguageIcon,
  Update as UpdateIcon,
  CheckCircle as CheckIcon,
  ExpandMore as ExpandMoreIcon,
  PlayLesson as VideoIcon,
  Article as ArticleIcon,
  Quiz as QuizIcon,
  Assignment as AssignmentIcon,
  Lock as LockIcon,
  FavoriteBorder as FavoriteBorderIcon,
  Favorite as FavoriteIcon,
  Share as ShareIcon,
  ShoppingCart as CartIcon,
} from '@mui/icons-material';
import { courses, courseSections, reviews, enrollments } from '../data/mockData';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel({ children, value, index }: TabPanelProps) {
  return (
    <div role="tabpanel" hidden={value !== index}>
      {value === index && <Box sx={{ py: 3 }}>{children}</Box>}
    </div>
  );
}

const lessonTypeIcons = {
  video: VideoIcon,
  text: ArticleIcon,
  quiz: QuizIcon,
  assignment: AssignmentIcon,
};

export default function CourseDetailPage() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [tabValue, setTabValue] = useState(0);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');

  const course = courses.find(c => c.slug === slug);

  const handleAddToWishlist = () => {
    setIsWishlisted(!isWishlisted);
    setSnackbarMessage(isWishlisted ? 'Removed from wishlist' : 'Added to wishlist');
    setSnackbarOpen(true);
  };

  const handleShare = async () => {
    if (navigator.share) {
      await navigator.share({
        title: course?.title,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      setSnackbarMessage('Link copied to clipboard!');
      setSnackbarOpen(true);
    }
  };

  const handleBuyNow = () => {
    navigate('/checkout');
  };
  const sections = courseSections.filter(s => s.courseId === course?.id);
  const courseReviews = reviews.filter(r => r.courseId === course?.id);
  const isEnrolled = enrollments.some(e => e.courseId === course?.id);

  if (!course) {
    return (
      <Container maxWidth="lg" sx={{ py: 8, textAlign: 'center' }}>
        <Typography variant="h5">Course not found</Typography>
        <Button component={Link} to="/explore" sx={{ mt: 2 }}>
          Browse Courses
        </Button>
      </Container>
    );
  }

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

  const totalLessons = sections.reduce((sum, s) => sum + s.lessons.length, 0);

  return (
    <Box>
      {/* Hero Section */}
      <Box sx={{ bgcolor: 'grey.900', color: 'white', py: 6 }}>
        <Container maxWidth="lg">
          <Grid container spacing={4}>
            <Grid size={{ xs: 12, md: 8 }}>
              <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
                <Chip
                  label={course.category.name}
                  size="small"
                  sx={{ bgcolor: 'primary.main', color: 'white' }}
                />
                {course.isBestseller && (
                  <Chip
                    label="Bestseller"
                    size="small"
                    sx={{ bgcolor: '#FBBF24', color: 'grey.900' }}
                  />
                )}
                {course.isNew && (
                  <Chip
                    label="New"
                    size="small"
                    sx={{ bgcolor: '#10B981', color: 'white' }}
                  />
                )}
              </Box>

              <Typography variant="h3" fontWeight={700} gutterBottom>
                {course.title}
              </Typography>

              <Typography variant="h6" sx={{ mb: 3, fontWeight: 400, opacity: 0.9 }}>
                {course.shortDescription}
              </Typography>

              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                  <Typography variant="body1" fontWeight={600} color="warning.light">
                    {course.rating}
                  </Typography>
                  <Rating value={course.rating} precision={0.1} size="small" readOnly sx={{ '& .MuiRating-iconFilled': { color: '#FBBF24' } }} />
                  <Typography variant="body2" sx={{ opacity: 0.8 }}>
                    ({course.totalRatings.toLocaleString()} ratings)
                  </Typography>
                </Box>
                <Typography variant="body2" sx={{ opacity: 0.8 }}>
                  {course.totalStudents.toLocaleString()} students
                </Typography>
              </Box>

              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
                <Avatar src={course.teacher.avatar} sx={{ width: 40, height: 40 }} />
                <Box>
                  <Typography variant="body2" sx={{ opacity: 0.7 }}>
                    Created by
                  </Typography>
                  <Typography variant="body1" fontWeight={600}>
                    {course.teacher.name}
                  </Typography>
                </Box>
              </Box>

              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3, opacity: 0.8 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                  <UpdateIcon fontSize="small" />
                  <Typography variant="body2">
                    Updated {new Date(course.lastUpdated).toLocaleDateString()}
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                  <LanguageIcon fontSize="small" />
                  <Typography variant="body2">{course.language}</Typography>
                </Box>
              </Box>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Main Content */}
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Grid container spacing={4}>
          {/* Left Content */}
          <Grid size={{ xs: 12, md: 8 }}>
            {/* Tabs */}
            <Tabs
              value={tabValue}
              onChange={(_, value) => setTabValue(value)}
              sx={{ borderBottom: 1, borderColor: 'divider' }}
            >
              <Tab label="Overview" />
              <Tab label="Curriculum" />
              <Tab label="Reviews" />
              <Tab label="Instructor" />
            </Tabs>

            {/* Overview Tab */}
            <TabPanel value={tabValue} index={0}>
              <Typography variant="h5" fontWeight={600} gutterBottom>
                What you'll learn
              </Typography>
              <Grid container spacing={2} sx={{ mb: 4 }}>
                {course.objectives.map((objective, index) => (
                  <Grid size={{ xs: 12, sm: 6 }} key={index}>
                    <Box sx={{ display: 'flex', gap: 1.5 }}>
                      <CheckIcon color="success" sx={{ mt: 0.25 }} />
                      <Typography variant="body2">{objective}</Typography>
                    </Box>
                  </Grid>
                ))}
              </Grid>

              <Typography variant="h5" fontWeight={600} gutterBottom>
                Requirements
              </Typography>
              <List dense sx={{ mb: 4 }}>
                {course.requirements.map((req, index) => (
                  <ListItem key={index} sx={{ px: 0 }}>
                    <ListItemIcon sx={{ minWidth: 28 }}>
                      <Box sx={{ width: 6, height: 6, borderRadius: '50%', bgcolor: 'text.primary' }} />
                    </ListItemIcon>
                    <ListItemText primary={req} />
                  </ListItem>
                ))}
              </List>

              <Typography variant="h5" fontWeight={600} gutterBottom>
                Description
              </Typography>
              <Typography
                variant="body1"
                color="text.secondary"
                sx={{ whiteSpace: 'pre-line' }}
              >
                {course.description}
              </Typography>
            </TabPanel>

            {/* Curriculum Tab */}
            <TabPanel value={tabValue} index={1}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Typography variant="h5" fontWeight={600}>
                  Course Content
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {sections.length} sections • {totalLessons} lessons • {formatDuration(course.duration)} total
                </Typography>
              </Box>

              {sections.map((section, sectionIndex) => (
                <Accordion key={section.id} defaultExpanded={sectionIndex === 0}>
                  <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '100%', pr: 2 }}>
                      <Typography fontWeight={600}>
                        Section {section.order}: {section.title}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {section.lessons.length} lessons
                      </Typography>
                    </Box>
                  </AccordionSummary>
                  <AccordionDetails sx={{ p: 0 }}>
                    <List dense>
                      {section.lessons.map((lesson) => {
                        const Icon = lessonTypeIcons[lesson.type];
                        return (
                          <ListItem
                            key={lesson.id}
                            sx={{
                              py: 1.5,
                              px: 3,
                              borderTop: '1px solid',
                              borderColor: 'grey.100',
                            }}
                          >
                            <ListItemIcon sx={{ minWidth: 36 }}>
                              <Icon fontSize="small" color={lesson.isFreePreview ? 'primary' : 'action'} />
                            </ListItemIcon>
                            <ListItemText
                              primary={lesson.title}
                              secondary={lesson.description}
                              slotProps={{
                                primary: { variant: 'body2' },
                                secondary: { variant: 'caption' },
                              }}
                            />
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                              {lesson.isFreePreview && (
                                <Chip label="Preview" size="small" color="primary" variant="outlined" />
                              )}
                              <Typography variant="caption" color="text.secondary">
                                {formatDuration(lesson.duration)}
                              </Typography>
                              {!lesson.isFreePreview && !isEnrolled && (
                                <LockIcon fontSize="small" sx={{ color: 'grey.400' }} />
                              )}
                            </Box>
                          </ListItem>
                        );
                      })}
                    </List>
                  </AccordionDetails>
                </Accordion>
              ))}
            </TabPanel>

            {/* Reviews Tab */}
            <TabPanel value={tabValue} index={2}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 4, mb: 4 }}>
                <Box sx={{ textAlign: 'center' }}>
                  <Typography variant="h2" fontWeight={700} color="warning.dark">
                    {course.rating}
                  </Typography>
                  <Rating value={course.rating} precision={0.1} readOnly />
                  <Typography variant="body2" color="text.secondary">
                    {course.totalRatings.toLocaleString()} ratings
                  </Typography>
                </Box>
              </Box>

              <Divider sx={{ mb: 3 }} />

              {courseReviews.map((review) => (
                <Box key={review.id} sx={{ mb: 4 }}>
                  <Box sx={{ display: 'flex', gap: 2 }}>
                    <Avatar src={review.userAvatar} sx={{ width: 48, height: 48 }}>
                      {review.userName[0]}
                    </Avatar>
                    <Box sx={{ flex: 1 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                        <Typography variant="subtitle2" fontWeight={600}>
                          {review.userName}
                        </Typography>
                        <Rating value={review.rating} size="small" readOnly />
                      </Box>
                      <Typography variant="caption" color="text.secondary" sx={{ mb: 1, display: 'block' }}>
                        {new Date(review.createdAt).toLocaleDateString()}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {review.comment}
                      </Typography>
                      {review.teacherResponse && (
                        <Box sx={{ mt: 2, ml: 3, p: 2, bgcolor: 'grey.50', borderRadius: 2 }}>
                          <Typography variant="caption" color="primary" fontWeight={600}>
                            Instructor Response
                          </Typography>
                          <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                            {review.teacherResponse}
                          </Typography>
                        </Box>
                      )}
                    </Box>
                  </Box>
                </Box>
              ))}
            </TabPanel>

            {/* Instructor Tab */}
            <TabPanel value={tabValue} index={3}>
              <Box sx={{ display: 'flex', gap: 3 }}>
                <Avatar
                  src={course.teacher.avatar}
                  sx={{ width: 100, height: 100 }}
                />
                <Box>
                  <Typography variant="h5" fontWeight={600} gutterBottom>
                    {course.teacher.name}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    {course.teacher.expertise.join(', ')}
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 3, my: 2 }}>
                    <Box>
                      <Typography variant="h6" fontWeight={600}>
                        {course.teacher.rating}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        Rating
                      </Typography>
                    </Box>
                    <Box>
                      <Typography variant="h6" fontWeight={600}>
                        {(course.teacher.totalStudents / 1000).toFixed(0)}K
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        Students
                      </Typography>
                    </Box>
                    <Box>
                      <Typography variant="h6" fontWeight={600}>
                        {course.teacher.totalCourses}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        Courses
                      </Typography>
                    </Box>
                  </Box>
                  <Typography variant="body2" color="text.secondary">
                    {course.teacher.bio}
                  </Typography>
                </Box>
              </Box>
            </TabPanel>
          </Grid>

          {/* Sidebar - Course Card */}
          <Grid size={{ xs: 12, md: 4 }}>
            <Card sx={{ position: 'sticky', top: 80 }}>
              <Box
                component="img"
                src={course.thumbnail}
                sx={{ width: '100%', aspectRatio: '16/9', objectFit: 'cover' }}
              />
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 1, mb: 2 }}>
                  <Typography variant="h4" fontWeight={700}>
                    {formatPrice(course.price, course.currency)}
                  </Typography>
                  {course.originalPrice && (
                    <Typography variant="body1" color="text.secondary" sx={{ textDecoration: 'line-through' }}>
                      {formatPrice(course.originalPrice, course.currency)}
                    </Typography>
                  )}
                  {course.originalPrice && (
                    <Chip
                      label={`${Math.round((1 - course.price / course.originalPrice) * 100)}% off`}
                      size="small"
                      color="error"
                    />
                  )}
                </Box>

                {isEnrolled ? (
                  <Button
                    component={Link}
                    to={`/learn/${course.slug}`}
                    variant="contained"
                    fullWidth
                    size="large"
                    startIcon={<PlayIcon />}
                    sx={{ mb: 2 }}
                  >
                    Go to Course
                  </Button>
                ) : (
                  <>
                    <Button
                      variant="contained"
                      fullWidth
                      size="large"
                      startIcon={<CartIcon />}
                      sx={{ mb: 1 }}
                      onClick={() => navigate('/cart')}
                    >
                      {course.price === 0 ? 'Enroll Now - Free' : 'Add to Cart'}
                    </Button>
                    {course.price > 0 && (
                      <Button
                        variant="outlined"
                        fullWidth
                        size="large"
                        sx={{ mb: 2 }}
                        onClick={handleBuyNow}
                      >
                        Buy Now
                      </Button>
                    )}
                  </>
                )}

                <Box sx={{ display: 'flex', gap: 1, mb: 3 }}>
                  <IconButton
                    sx={{ flex: 1, border: 1, borderColor: 'grey.300', borderRadius: 2 }}
                    onClick={handleAddToWishlist}
                  >
                    {isWishlisted ? <FavoriteIcon color="error" /> : <FavoriteBorderIcon />}
                  </IconButton>
                  <IconButton
                    sx={{ flex: 1, border: 1, borderColor: 'grey.300', borderRadius: 2 }}
                    onClick={handleShare}
                  >
                    <ShareIcon />
                  </IconButton>
                </Box>

                <Typography variant="subtitle2" fontWeight={600} gutterBottom>
                  This course includes:
                </Typography>
                <List dense>
                  <ListItem sx={{ px: 0 }}>
                    <ListItemIcon sx={{ minWidth: 36 }}>
                      <VideoIcon fontSize="small" />
                    </ListItemIcon>
                    <ListItemText primary={`${formatDuration(course.duration)} on-demand video`} />
                  </ListItem>
                  <ListItem sx={{ px: 0 }}>
                    <ListItemIcon sx={{ minWidth: 36 }}>
                      <LessonsIcon fontSize="small" />
                    </ListItemIcon>
                    <ListItemText primary={`${course.totalLessons} lessons`} />
                  </ListItem>
                  <ListItem sx={{ px: 0 }}>
                    <ListItemIcon sx={{ minWidth: 36 }}>
                      <TimeIcon fontSize="small" />
                    </ListItemIcon>
                    <ListItemText primary="Full lifetime access" />
                  </ListItem>
                  <ListItem sx={{ px: 0 }}>
                    <ListItemIcon sx={{ minWidth: 36 }}>
                      <PeopleIcon fontSize="small" />
                    </ListItemIcon>
                    <ListItemText primary="Access on mobile and TV" />
                  </ListItem>
                  {course.hasCertificate && (
                    <ListItem sx={{ px: 0 }}>
                      <ListItemIcon sx={{ minWidth: 36 }}>
                        <CheckIcon fontSize="small" color="success" />
                      </ListItemIcon>
                      <ListItemText primary="Certificate of completion" />
                    </ListItem>
                  )}
                </List>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Container>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={() => setSnackbarOpen(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={() => setSnackbarOpen(false)} severity="success" sx={{ width: '100%' }}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
}
