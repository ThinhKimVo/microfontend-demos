import { Link } from 'react-router-dom';
import {
  Box,
  Container,
  Typography,
  Button,
  Grid,
  Card,
  CardContent,
  Avatar,
  Chip,
  InputBase,
  Paper,
  alpha,
  useTheme,
  useMediaQuery,
  Rating,
} from '@mui/material';
import {
  Search as SearchIcon,
  PlayCircle as PlayIcon,
  Groups as GroupsIcon,
  WorkspacePremium as CertificateIcon,
  Stars as StarsIcon,
  TrendingUp as TrendingIcon,
  ArrowForward as ArrowIcon,
  CheckCircle as CheckIcon,
} from '@mui/icons-material';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import CourseCard from '../components/common/CourseCard';
import CategoryCard from '../components/common/CategoryCard';
import { courses, categories, teachers } from '../data/mockData';

const stats = [
  { value: '50K+', label: 'Students', icon: GroupsIcon, color: '#2563EB' },
  { value: '1,000+', label: 'Courses', icon: PlayIcon, color: '#7C3AED' },
  { value: '200+', label: 'Instructors', icon: StarsIcon, color: '#F59E0B' },
  { value: '10K+', label: 'Certificates', icon: CertificateIcon, color: '#10B981' },
];

const features = [
  'Learn at your own pace',
  'Expert instructors',
  'Lifetime access',
  'Certificate of completion',
];

export default function HomePage() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');

  const featuredCourses = courses.filter(c => c.isFeatured);
  const popularCourses = [...courses].sort((a, b) => b.totalStudents - a.totalStudents).slice(0, 4);
  const topTeachers = teachers.slice(0, 4);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/explore?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  return (
    <Box>
      {/* Hero Section */}
      <Box
        sx={{
          bgcolor: 'grey.50',
          py: { xs: 6, sm: 8, md: 10, lg: 12 },
          borderBottom: '1px solid',
          borderColor: 'grey.200',
          position: 'relative',
          overflow: 'hidden',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            right: 0,
            width: '50%',
            height: '100%',
            bgcolor: alpha(theme.palette.primary.main, 0.03),
            borderRadius: '0 0 0 50%',
            display: { xs: 'none', md: 'block' },
          },
        }}
      >
        <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1, px: { xs: 3, sm: 4 } }}>
          <Grid container spacing={{ xs: 4, md: 6, lg: 8 }} alignItems="center">
            <Grid size={{ xs: 12, md: 6 }}>
              <Chip
                icon={<TrendingIcon sx={{ fontSize: 16 }} />}
                label="Trending in 2026"
                sx={{
                  bgcolor: alpha(theme.palette.primary.main, 0.1),
                  color: 'primary.main',
                  fontWeight: 600,
                  mb: 3,
                  px: 1,
                  '& .MuiChip-icon': { color: 'primary.main' },
                }}
              />
              <Typography
                variant="h1"
                sx={{ 
                  mb: 3, 
                  fontSize: { xs: '2rem', sm: '2.5rem', md: '3rem', lg: '3.5rem' },
                  lineHeight: 1.1,
                }}
              >
                Unlock Your{' '}
                <Box 
                  component="span" 
                  sx={{ 
                    color: 'primary.main',
                    position: 'relative',
                    '&::after': {
                      content: '""',
                      position: 'absolute',
                      bottom: 4,
                      left: 0,
                      width: '100%',
                      height: 8,
                      bgcolor: alpha(theme.palette.primary.main, 0.2),
                      zIndex: -1,
                      borderRadius: 1,
                    }
                  }}
                >
                  Potential
                </Box>
                {' '}with Online Learning
              </Typography>
              <Typography
                variant="h6"
                color="text.secondary"
                sx={{ 
                  mb: 4, 
                  fontWeight: 400, 
                  fontSize: { xs: '1rem', sm: '1.1rem', md: '1.25rem' },
                  lineHeight: 1.7,
                  maxWidth: 520,
                }}
              >
                Join thousands of learners and master new skills with courses taught by industry experts. Start your journey today.
              </Typography>

              {/* Features List */}
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, mb: 4 }}>
                {features.map((feature) => (
                  <Box 
                    key={feature}
                    sx={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      gap: 1,
                    }}
                  >
                    <CheckIcon sx={{ fontSize: 18, color: 'success.main' }} />
                    <Typography variant="body2" color="text.secondary" fontWeight={500}>
                      {feature}
                    </Typography>
                  </Box>
                ))}
              </Box>

              {/* Search Bar */}
              <Paper
                component="form"
                onSubmit={handleSearch}
                elevation={0}
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  p: { xs: 0.75, sm: 1 },
                  pl: { xs: 2, sm: 2.5 },
                  bgcolor: 'white',
                  border: '2px solid',
                  borderColor: 'grey.200',
                  borderRadius: 3,
                  maxWidth: 520,
                  boxShadow: '0 4px 20px rgba(0,0,0,0.06)',
                  transition: 'all 0.2s ease',
                  '&:hover': {
                    borderColor: 'grey.300',
                  },
                  '&:focus-within': {
                    borderColor: 'primary.main',
                    boxShadow: `0 0 0 4px ${alpha(theme.palette.primary.main, 0.1)}`,
                  },
                }}
              >
                <SearchIcon sx={{ color: 'grey.400', mr: 1.5, fontSize: 22 }} />
                <InputBase
                  placeholder={isMobile ? "Search courses..." : "What do you want to learn?"}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  sx={{ flex: 1, fontSize: { xs: '0.9rem', sm: '1rem' } }}
                />
                <Button 
                  type="submit" 
                  variant="contained" 
                  sx={{ 
                    px: { xs: 2, sm: 3 },
                    py: { xs: 1, sm: 1.25 },
                    borderRadius: 2,
                  }}
                >
                  Search
                </Button>
              </Paper>

              {/* Popular Tags */}
              <Box sx={{ mt: 3, display: 'flex', flexWrap: 'wrap', gap: 1, alignItems: 'center' }}>
                <Typography variant="body2" color="text.secondary" fontWeight={500}>
                  Popular:
                </Typography>
                {['React', 'Python', 'Machine Learning', 'UI/UX'].map((tag) => (
                  <Chip
                    key={tag}
                    label={tag}
                    size="small"
                    component={Link}
                    to={`/explore?q=${tag}`}
                    clickable
                    sx={{ 
                      bgcolor: 'white', 
                      border: '1px solid', 
                      borderColor: 'grey.200',
                      fontWeight: 500,
                      transition: 'all 0.2s ease',
                      '&:hover': {
                        borderColor: 'primary.main',
                        bgcolor: alpha(theme.palette.primary.main, 0.04),
                      }
                    }}
                  />
                ))}
              </Box>
            </Grid>

            <Grid size={{ xs: 12, md: 6 }}>
              <Box
                sx={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(2, 1fr)',
                  gap: { xs: 2, sm: 2.5, md: 3 },
                }}
              >
                {stats.map((stat, index) => (
                  <Card 
                    key={index} 
                    sx={{ 
                      textAlign: 'center',
                      border: '1px solid',
                      borderColor: 'grey.100',
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        transform: 'translateY(-4px)',
                        boxShadow: `0 12px 24px ${alpha(stat.color, 0.15)}`,
                        borderColor: alpha(stat.color, 0.3),
                      }
                    }}
                  >
                    <CardContent sx={{ py: { xs: 3, sm: 4 } }}>
                      <Box
                        sx={{
                          width: { xs: 48, sm: 56 },
                          height: { xs: 48, sm: 56 },
                          borderRadius: 3,
                          bgcolor: alpha(stat.color, 0.1),
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          mx: 'auto',
                          mb: 2,
                        }}
                      >
                        <stat.icon sx={{ fontSize: { xs: 26, sm: 30 }, color: stat.color }} />
                      </Box>
                      <Typography 
                        variant="h4" 
                        fontWeight={800}
                        sx={{ fontSize: { xs: '1.5rem', sm: '1.75rem', md: '2rem' } }}
                      >
                        {stat.value}
                      </Typography>
                      <Typography variant="body2" color="text.secondary" fontWeight={500}>
                        {stat.label}
                      </Typography>
                    </CardContent>
                  </Card>
                ))}
              </Box>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Categories Section */}
      <Container maxWidth="lg" sx={{ py: { xs: 6, sm: 8, md: 10 }, px: { xs: 3, sm: 4 } }}>
        <Box sx={{ textAlign: 'center', mb: { xs: 4, md: 6 } }}>
          <Chip 
            label="Browse by Category" 
            size="small"
            sx={{ 
              mb: 2, 
              bgcolor: alpha(theme.palette.secondary.main, 0.1), 
              color: 'secondary.main',
              fontWeight: 600,
            }} 
          />
          <Typography 
            variant="h2" 
            fontWeight={700} 
            gutterBottom 
            sx={{ fontSize: { xs: '1.75rem', sm: '2rem', md: '2.5rem' } }}
          >
            Explore Categories
          </Typography>
          <Typography 
            variant="body1" 
            color="text.secondary"
            sx={{ maxWidth: 500, mx: 'auto' }}
          >
            Browse our diverse range of course categories and find your perfect learning path
          </Typography>
        </Box>

        <Grid container spacing={{ xs: 2, sm: 2.5, md: 3 }}>
          {categories.map((category) => (
            <Grid size={{ xs: 6, sm: 4, md: 3 }} key={category.id}>
              <CategoryCard category={category} />
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* Featured Courses Section */}
      <Box sx={{ bgcolor: 'grey.50', py: { xs: 6, sm: 8, md: 10 } }}>
        <Container maxWidth="lg" sx={{ px: { xs: 3, sm: 4 } }}>
          <Box 
            sx={{ 
              display: 'flex', 
              flexDirection: { xs: 'column', sm: 'row' }, 
              justifyContent: 'space-between', 
              alignItems: { xs: 'flex-start', sm: 'center' }, 
              mb: { xs: 4, md: 5 }, 
              gap: 2 
            }}
          >
            <Box>
              <Chip 
                label="Editor's Choice" 
                size="small"
                sx={{ 
                  mb: 2, 
                  bgcolor: alpha(theme.palette.warning.main, 0.1), 
                  color: 'warning.dark',
                  fontWeight: 600,
                }} 
              />
              <Typography 
                variant="h2" 
                fontWeight={700} 
                gutterBottom 
                sx={{ fontSize: { xs: '1.75rem', sm: '2rem', md: '2.5rem' } }}
              >
                Featured Courses
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Hand-picked courses recommended for you
              </Typography>
            </Box>
            <Button 
              component={Link} 
              to="/explore" 
              variant="outlined"
              endIcon={<ArrowIcon />}
              sx={{ flexShrink: 0 }}
            >
              View All Courses
            </Button>
          </Box>

          <Grid container spacing={{ xs: 2, sm: 2.5, md: 3 }}>
            {featuredCourses.map((course) => (
              <Grid size={{ xs: 12, sm: 6, lg: 3 }} key={course.id}>
                <CourseCard course={course} />
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* Popular Courses Section */}
      <Container maxWidth="lg" sx={{ py: { xs: 6, sm: 8, md: 10 }, px: { xs: 3, sm: 4 } }}>
        <Box 
          sx={{ 
            display: 'flex', 
            flexDirection: { xs: 'column', sm: 'row' }, 
            justifyContent: 'space-between', 
            alignItems: { xs: 'flex-start', sm: 'center' }, 
            mb: { xs: 4, md: 5 }, 
            gap: 2 
          }}
        >
          <Box>
            <Chip 
              icon={<TrendingIcon sx={{ fontSize: 14 }} />}
              label="Trending Now" 
              size="small"
              sx={{ 
                mb: 2, 
                bgcolor: alpha(theme.palette.error.main, 0.1), 
                color: 'error.main',
                fontWeight: 600,
                '& .MuiChip-icon': { color: 'error.main' },
              }} 
            />
            <Typography 
              variant="h2" 
              fontWeight={700} 
              gutterBottom 
              sx={{ fontSize: { xs: '1.75rem', sm: '2rem', md: '2.5rem' } }}
            >
              Most Popular
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Courses loved by thousands of students
            </Typography>
          </Box>
          <Button 
            component={Link} 
            to="/explore?sort=popular" 
            variant="outlined"
            endIcon={<ArrowIcon />}
            sx={{ flexShrink: 0 }}
          >
            Browse Popular
          </Button>
        </Box>

        <Grid container spacing={{ xs: 2, sm: 2.5, md: 3 }}>
          {popularCourses.map((course) => (
            <Grid size={{ xs: 12, sm: 6, lg: 3 }} key={course.id}>
              <CourseCard course={course} />
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* Top Instructors Section */}
      <Box sx={{ bgcolor: 'grey.50', py: { xs: 6, sm: 8, md: 10 } }}>
        <Container maxWidth="lg" sx={{ px: { xs: 3, sm: 4 } }}>
          <Box sx={{ textAlign: 'center', mb: { xs: 4, md: 6 } }}>
            <Chip 
              label="Expert Instructors" 
              size="small"
              sx={{ 
                mb: 2, 
                bgcolor: alpha(theme.palette.success.main, 0.1), 
                color: 'success.main',
                fontWeight: 600,
              }} 
            />
            <Typography 
              variant="h2" 
              fontWeight={700} 
              gutterBottom 
              sx={{ fontSize: { xs: '1.75rem', sm: '2rem', md: '2.5rem' } }}
            >
              Learn from the Best
            </Typography>
            <Typography 
              variant="body1" 
              color="text.secondary"
              sx={{ maxWidth: 500, mx: 'auto' }}
            >
              Our top-rated instructors with proven expertise and real-world experience
            </Typography>
          </Box>

          <Grid container spacing={{ xs: 2, sm: 2.5, md: 3 }}>
            {topTeachers.map((teacher) => (
              <Grid size={{ xs: 6, sm: 6, md: 3 }} key={teacher.id}>
                <Card 
                  sx={{ 
                    textAlign: 'center',
                    height: '100%',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      transform: 'translateY(-6px)',
                    }
                  }}
                >
                  <CardContent sx={{ pt: { xs: 3, sm: 4 }, px: { xs: 2, sm: 3 } }}>
                    <Box
                      sx={{
                        position: 'relative',
                        display: 'inline-block',
                        mb: 2,
                      }}
                    >
                      <Avatar
                        src={teacher.avatar}
                        sx={{ 
                          width: { xs: 64, sm: 80 }, 
                          height: { xs: 64, sm: 80 }, 
                          mx: 'auto',
                          border: '3px solid',
                          borderColor: 'primary.light',
                        }}
                      />
                    </Box>
                    <Typography 
                      variant="h6" 
                      fontWeight={600} 
                      gutterBottom
                      sx={{ fontSize: { xs: '0.95rem', sm: '1.1rem' } }}
                    >
                      {teacher.name}
                    </Typography>
                    <Typography 
                      variant="body2" 
                      color="text.secondary" 
                      sx={{ 
                        mb: 2,
                        fontSize: { xs: '0.75rem', sm: '0.875rem' },
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden',
                      }}
                    >
                      {teacher.expertise.slice(0, 2).join(', ')}
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 0.5, mb: 2 }}>
                      <Rating value={teacher.rating} precision={0.1} size="small" readOnly />
                      <Typography variant="body2" fontWeight={600} color="warning.dark">
                        {teacher.rating}
                      </Typography>
                    </Box>
                    <Box 
                      sx={{ 
                        display: 'flex', 
                        justifyContent: 'center', 
                        gap: { xs: 2, sm: 3 },
                        pt: 2,
                        borderTop: '1px solid',
                        borderColor: 'grey.100',
                      }}
                    >
                      <Box>
                        <Typography variant="subtitle2" fontWeight={700} color="primary.main">
                          {(teacher.totalStudents / 1000).toFixed(0)}K
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          Students
                        </Typography>
                      </Box>
                      <Box>
                        <Typography variant="subtitle2" fontWeight={700} color="primary.main">
                          {teacher.totalCourses}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          Courses
                        </Typography>
                      </Box>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* CTA Section */}
      <Container maxWidth="lg" sx={{ py: { xs: 6, sm: 8, md: 10 }, px: { xs: 3, sm: 4 } }}>
        <Card
          sx={{
            p: { xs: 4, sm: 5, md: 8 },
            textAlign: 'center',
            bgcolor: 'primary.main',
            color: 'white',
            borderRadius: 4,
            position: 'relative',
            overflow: 'hidden',
            '&::before': {
              content: '""',
              position: 'absolute',
              top: -100,
              right: -100,
              width: 300,
              height: 300,
              borderRadius: '50%',
              bgcolor: alpha('#fff', 0.05),
            },
            '&::after': {
              content: '""',
              position: 'absolute',
              bottom: -80,
              left: -80,
              width: 200,
              height: 200,
              borderRadius: '50%',
              bgcolor: alpha('#fff', 0.05),
            },
          }}
        >
          <Box sx={{ position: 'relative', zIndex: 1 }}>
            <Typography 
              variant="h2" 
              fontWeight={800} 
              gutterBottom 
              sx={{ fontSize: { xs: '1.75rem', sm: '2rem', md: '2.75rem' } }}
            >
              Start Learning Today
            </Typography>
            <Typography 
              variant="h6" 
              sx={{ 
                mb: 4, 
                fontWeight: 400, 
                opacity: 0.9, 
                fontSize: { xs: '0.95rem', sm: '1rem', md: '1.25rem' },
                maxWidth: 500,
                mx: 'auto',
              }}
            >
              Join over 50,000 students and gain the skills you need to succeed in your career
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: 2, justifyContent: 'center' }}>
              <Button
                component={Link}
                to="/explore"
                variant="contained"
                size="large"
                endIcon={<ArrowIcon />}
                sx={{
                  bgcolor: 'white',
                  color: 'primary.main',
                  px: 4,
                  py: 1.5,
                  fontWeight: 600,
                  '&:hover': { 
                    bgcolor: 'grey.100',
                    transform: 'translateY(-2px)',
                  },
                }}
              >
                Browse Courses
              </Button>
              <Button
                component={Link}
                to="/register"
                variant="outlined"
                size="large"
                sx={{
                  borderColor: alpha('#fff', 0.5),
                  borderWidth: 2,
                  color: 'white',
                  px: 4,
                  py: 1.5,
                  fontWeight: 600,
                  '&:hover': { 
                    borderColor: 'white', 
                    bgcolor: alpha('#fff', 0.1),
                    borderWidth: 2,
                  },
                }}
              >
                Sign Up Free
              </Button>
            </Box>
          </Box>
        </Card>
      </Container>
    </Box>
  );
}
