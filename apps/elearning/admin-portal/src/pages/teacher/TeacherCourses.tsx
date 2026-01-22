import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Box,
  Typography,
  Button,
  Card,
  CardContent,
  Grid,
  Tabs,
  Tab,
  Chip,
  IconButton,
  Menu,
  MenuItem,
  TextField,
  InputAdornment,
  Snackbar,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
} from '@mui/material';
import {
  Add as AddIcon,
  MoreVert as MoreIcon,
  Search as SearchIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Visibility as ViewIcon,
  People as StudentsIcon,
  Star as StarIcon,
} from '@mui/icons-material';
import { courses } from '../../data/mockData';
import { useAuth } from '../../App';
import { Teacher } from '../../data/types';

export default function TeacherCourses() {
  const { user } = useAuth();
  const teacher = user as Teacher;
  const [tabValue, setTabValue] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedCourse, setSelectedCourse] = useState<string | null>(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  const myCourses = courses.filter(c => c.teacherId === teacher?.id);
  const filteredCourses = myCourses.filter(c => {
    if (tabValue === 1) return c.status === 'published';
    if (tabValue === 2) return c.status === 'draft';
    if (tabValue === 3) return c.status === 'pending';
    return true;
  }).filter(c => c.title.toLowerCase().includes(searchQuery.toLowerCase()));

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>, courseId: string) => {
    setAnchorEl(event.currentTarget);
    setSelectedCourse(courseId);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handlePreview = (courseId?: string) => {
    const id = courseId || selectedCourse;
    const course = courses.find(c => c.id === id);
    if (course) {
      // Open course preview in student portal (new tab) using slug
      window.open(`http://localhost:3001/course/${course.slug}`, '_blank');
    }
    handleMenuClose();
  };

  const handleDeleteClick = () => {
    setDeleteDialogOpen(true);
    setAnchorEl(null);
  };

  const handleDeleteConfirm = () => {
    const course = courses.find(c => c.id === selectedCourse);
    setSnackbarMessage(`Course "${course?.title}" has been deleted`);
    setSnackbarOpen(true);
    setDeleteDialogOpen(false);
    setSelectedCourse(null);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'published': return 'success';
      case 'draft': return 'default';
      case 'pending': return 'warning';
      case 'rejected': return 'error';
      default: return 'default';
    }
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" fontWeight={700}>
          My Courses
        </Typography>
        <Button
          component={Link}
          to="/teacher/courses/new"
          variant="contained"
          startIcon={<AddIcon />}
        >
          Create Course
        </Button>
      </Box>

      <Card sx={{ mb: 3 }}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs value={tabValue} onChange={(_, v) => setTabValue(v)}>
            <Tab label={`All (${myCourses.length})`} />
            <Tab label={`Published (${myCourses.filter(c => c.status === 'published').length})`} />
            <Tab label={`Draft (${myCourses.filter(c => c.status === 'draft').length})`} />
            <Tab label={`Pending (${myCourses.filter(c => c.status === 'pending').length})`} />
          </Tabs>
        </Box>
        <CardContent sx={{ pb: 2 }}>
          <TextField
            size="small"
            placeholder="Search courses..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            slotProps={{
              input: {
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon fontSize="small" />
                  </InputAdornment>
                ),
              },
            }}
            sx={{ width: 300 }}
          />
        </CardContent>
      </Card>

      <Grid container spacing={3}>
        {filteredCourses.map((course) => (
          <Grid size={{ xs: 12, sm: 6, lg: 4 }} key={course.id}>
            <Card>
              <Box sx={{ position: 'relative' }}>
                <Box
                  component="img"
                  src={course.thumbnail}
                  sx={{ width: '100%', height: 160, objectFit: 'cover' }}
                />
                <IconButton
                  size="small"
                  onClick={(e) => handleMenuOpen(e, course.id)}
                  sx={{
                    position: 'absolute',
                    top: 8,
                    right: 8,
                    bgcolor: 'white',
                    '&:hover': { bgcolor: 'grey.100' },
                  }}
                >
                  <MoreIcon fontSize="small" />
                </IconButton>
              </Box>
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
                  <Chip
                    label={course.status}
                    size="small"
                    color={getStatusColor(course.status) as any}
                  />
                  <Typography variant="body2" fontWeight={600}>
                    ${course.price}
                  </Typography>
                </Box>
                <Typography variant="subtitle1" fontWeight={600} sx={{ mb: 1 }}>
                  {course.title}
                </Typography>
                <Box sx={{ display: 'flex', gap: 3, mb: 2 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                    <StudentsIcon sx={{ fontSize: 16, color: 'grey.500' }} />
                    <Typography variant="caption" color="text.secondary">
                      {course.totalStudents.toLocaleString()}
                    </Typography>
                  </Box>
                  {course.rating > 0 && (
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                      <StarIcon sx={{ fontSize: 16, color: '#FBBF24' }} />
                      <Typography variant="caption" color="text.secondary">
                        {course.rating} ({course.totalRatings})
                      </Typography>
                    </Box>
                  )}
                </Box>
                <Box sx={{ display: 'flex', gap: 1 }}>
                  <Button
                    component={Link}
                    to={`/teacher/courses/${course.id}/edit`}
                    variant="outlined"
                    size="small"
                    startIcon={<EditIcon />}
                    fullWidth
                  >
                    Edit
                  </Button>
                  <Button
                    variant="outlined"
                    size="small"
                    startIcon={<ViewIcon />}
                    fullWidth
                    onClick={() => handlePreview(course.id)}
                  >
                    Preview
                  </Button>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {filteredCourses.length === 0 && (
        <Card sx={{ textAlign: 'center', py: 8 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              No courses found
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              Create your first course to start teaching
            </Typography>
            <Button
              component={Link}
              to="/teacher/courses/new"
              variant="contained"
              startIcon={<AddIcon />}
            >
              Create Course
            </Button>
          </CardContent>
        </Card>
      )}

      <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleMenuClose}>
        <MenuItem component={Link} to={`/teacher/courses/${selectedCourse}/edit`}>
          <EditIcon fontSize="small" sx={{ mr: 1 }} /> Edit Course
        </MenuItem>
        <MenuItem onClick={() => handlePreview()}>
          <ViewIcon fontSize="small" sx={{ mr: 1 }} /> Preview
        </MenuItem>
        <MenuItem onClick={handleDeleteClick} sx={{ color: 'error.main' }}>
          <DeleteIcon fontSize="small" sx={{ mr: 1 }} /> Delete
        </MenuItem>
      </Menu>

      <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
        <DialogTitle>Delete Course</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this course? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
          <Button color="error" variant="contained" onClick={handleDeleteConfirm}>Delete</Button>
        </DialogActions>
      </Dialog>

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
