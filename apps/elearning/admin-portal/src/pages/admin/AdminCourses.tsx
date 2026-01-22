import { useState } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  TextField,
  InputAdornment,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  IconButton,
  Menu,
  MenuItem,
  Tabs,
  Tab,
  Rating,
  FormControl,
  Select,
  InputLabel,
  Snackbar,
  Alert,
} from '@mui/material';
import {
  Search as SearchIcon,
  MoreVert as MoreIcon,
  Visibility as ViewIcon,
  Check as ApproveIcon,
  Star as FeatureIcon,
  Delete as DeleteIcon,
} from '@mui/icons-material';
import { courses, categories } from '../../data/mockData';

export default function AdminCourses() {
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [tabValue, setTabValue] = useState(0);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedCourseId, setSelectedCourseId] = useState<string | null>(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');

  const handleMenuClick = (e: React.MouseEvent<HTMLElement>, courseId: string) => {
    setAnchorEl(e.currentTarget);
    setSelectedCourseId(courseId);
  };

  const handleAction = (action: string) => {
    const course = courses.find(c => c.id === selectedCourseId);
    switch (action) {
      case 'view':
        setSnackbarMessage(`Viewing course: ${course?.title}`);
        break;
      case 'approve':
        setSnackbarMessage(`Course "${course?.title}" has been approved`);
        break;
      case 'feature':
        setSnackbarMessage(`Course "${course?.title}" is now featured`);
        break;
      case 'remove':
        setSnackbarMessage(`Course "${course?.title}" has been removed`);
        break;
    }
    setSnackbarOpen(true);
    setAnchorEl(null);
  };

  const filteredCourses = courses.filter(c => {
    const matchesSearch = c.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || c.categoryId === categoryFilter;
    const matchesStatus = tabValue === 0 ||
      (tabValue === 1 && c.status === 'published') ||
      (tabValue === 2 && c.status === 'pending') ||
      (tabValue === 3 && c.status === 'draft');
    return matchesSearch && matchesCategory && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'published': return 'success';
      case 'pending': return 'warning';
      case 'draft': return 'default';
      case 'rejected': return 'error';
      default: return 'default';
    }
  };

  return (
    <Box>
      <Typography variant="h4" fontWeight={700} sx={{ mb: 3 }}>Courses</Typography>

      <Card>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs value={tabValue} onChange={(_, v) => setTabValue(v)}>
            <Tab label={`All (${courses.length})`} />
            <Tab label={`Published (${courses.filter(c => c.status === 'published').length})`} />
            <Tab label={`Pending Review (${courses.filter(c => c.status === 'pending').length})`} />
            <Tab label={`Draft (${courses.filter(c => c.status === 'draft').length})`} />
          </Tabs>
        </Box>
        <CardContent sx={{ pb: 0 }}>
          <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
            <TextField
              size="small"
              placeholder="Search courses..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              slotProps={{ input: { startAdornment: <InputAdornment position="start"><SearchIcon fontSize="small" /></InputAdornment> } }}
              sx={{ width: 300 }}
            />
            <FormControl size="small" sx={{ minWidth: 180 }}>
              <InputLabel>Category</InputLabel>
              <Select value={categoryFilter} label="Category" onChange={(e) => setCategoryFilter(e.target.value)}>
                <MenuItem value="all">All Categories</MenuItem>
                {categories.map(cat => <MenuItem key={cat.id} value={cat.id}>{cat.name}</MenuItem>)}
              </Select>
            </FormControl>
          </Box>
        </CardContent>

        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Course</TableCell>
                <TableCell>Teacher</TableCell>
                <TableCell>Category</TableCell>
                <TableCell align="right">Price</TableCell>
                <TableCell align="right">Students</TableCell>
                <TableCell>Rating</TableCell>
                <TableCell>Status</TableCell>
                <TableCell width={60}></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredCourses.map(course => (
                <TableRow key={course.id} hover>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <Box component="img" src={course.thumbnail} sx={{ width: 60, height: 40, borderRadius: 1, objectFit: 'cover' }} />
                      <Box>
                        <Typography variant="body2" fontWeight={600}>{course.title}</Typography>
                        {course.isFeatured && <Chip label="Featured" size="small" color="primary" sx={{ mt: 0.5 }} />}
                      </Box>
                    </Box>
                  </TableCell>
                  <TableCell>{course.teacherName}</TableCell>
                  <TableCell>{course.categoryName}</TableCell>
                  <TableCell align="right">${course.price}</TableCell>
                  <TableCell align="right">{course.totalStudents.toLocaleString()}</TableCell>
                  <TableCell>
                    {course.rating > 0 ? (
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                        <Rating value={course.rating} size="small" readOnly precision={0.1} />
                        <Typography variant="caption">({course.rating})</Typography>
                      </Box>
                    ) : '-'}
                  </TableCell>
                  <TableCell><Chip label={course.status} size="small" color={getStatusColor(course.status) as any} /></TableCell>
                  <TableCell>
                    <IconButton size="small" onClick={(e) => handleMenuClick(e, course.id)}><MoreIcon fontSize="small" /></IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Card>

      <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={() => setAnchorEl(null)}>
        <MenuItem onClick={() => handleAction('view')}><ViewIcon fontSize="small" sx={{ mr: 1 }} /> View</MenuItem>
        <MenuItem onClick={() => handleAction('approve')}><ApproveIcon fontSize="small" sx={{ mr: 1 }} /> Approve</MenuItem>
        <MenuItem onClick={() => handleAction('feature')}><FeatureIcon fontSize="small" sx={{ mr: 1 }} /> Feature</MenuItem>
        <MenuItem onClick={() => handleAction('remove')} sx={{ color: 'error.main' }}><DeleteIcon fontSize="small" sx={{ mr: 1 }} /> Remove</MenuItem>
      </Menu>

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
