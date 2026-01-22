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
  Avatar,
  Chip,
  LinearProgress,
  IconButton,
  Menu,
  MenuItem,
  FormControl,
  Select,
  InputLabel,
} from '@mui/material';
import {
  Search as SearchIcon,
  MoreVert as MoreIcon,
  Email as EmailIcon,
} from '@mui/icons-material';
import { enrollments, courses } from '../../data/mockData';

export default function TeacherStudents() {
  const [searchQuery, setSearchQuery] = useState('');
  const [courseFilter, setCourseFilter] = useState('all');
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const teacherCourses = courses.filter(c => c.teacherId === 'teacher-001');
  const filteredEnrollments = enrollments.filter(e => {
    const matchesSearch = e.studentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      e.studentEmail.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCourse = courseFilter === 'all' || e.courseId === courseFilter;
    return matchesSearch && matchesCourse;
  });

  return (
    <Box>
      <Typography variant="h4" fontWeight={700} sx={{ mb: 3 }}>
        Students
      </Typography>

      <Card>
        <CardContent sx={{ pb: 0 }}>
          <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
            <TextField
              size="small"
              placeholder="Search students..."
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
            <FormControl size="small" sx={{ minWidth: 200 }}>
              <InputLabel>Filter by Course</InputLabel>
              <Select
                value={courseFilter}
                label="Filter by Course"
                onChange={(e) => setCourseFilter(e.target.value)}
              >
                <MenuItem value="all">All Courses</MenuItem>
                {teacherCourses.map(c => (
                  <MenuItem key={c.id} value={c.id}>{c.title}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>
        </CardContent>

        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Student</TableCell>
                <TableCell>Course</TableCell>
                <TableCell>Progress</TableCell>
                <TableCell>Enrolled</TableCell>
                <TableCell>Status</TableCell>
                <TableCell width={60}></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredEnrollments.map((enrollment) => (
                <TableRow key={enrollment.id} hover>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <Avatar sx={{ width: 36, height: 36 }}>
                        {enrollment.studentName[0]}
                      </Avatar>
                      <Box>
                        <Typography variant="body2" fontWeight={600}>
                          {enrollment.studentName}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {enrollment.studentEmail}
                        </Typography>
                      </Box>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2">{enrollment.courseName}</Typography>
                  </TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <LinearProgress
                        variant="determinate"
                        value={enrollment.progress}
                        sx={{ width: 100, height: 6, borderRadius: 3 }}
                      />
                      <Typography variant="caption">{enrollment.progress}%</Typography>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2">
                      {new Date(enrollment.enrolledAt).toLocaleDateString()}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={enrollment.status}
                      size="small"
                      color={enrollment.status === 'completed' ? 'success' : 'default'}
                    />
                  </TableCell>
                  <TableCell>
                    <IconButton size="small" onClick={(e) => setAnchorEl(e.currentTarget)}>
                      <MoreIcon fontSize="small" />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Card>

      <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={() => setAnchorEl(null)}>
        <MenuItem onClick={() => setAnchorEl(null)}>
          <EmailIcon fontSize="small" sx={{ mr: 1 }} /> Send Message
        </MenuItem>
        <MenuItem onClick={() => setAnchorEl(null)}>View Details</MenuItem>
      </Menu>
    </Box>
  );
}
