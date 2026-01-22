import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  FormControl,
  Select,
  MenuItem,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material';
import { BarChart } from '@mui/x-charts/BarChart';
import { PieChart } from '@mui/x-charts/PieChart';
import { LineChart } from '@mui/x-charts/LineChart';
import { revenueData, courses } from '../../data/mockData';

export default function TeacherAnalytics() {
  const teacherCourses = courses.filter(c => c.teacherId === 'teacher-001');

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" fontWeight={700}>
          Analytics
        </Typography>
        <FormControl size="small" sx={{ minWidth: 150 }}>
          <Select defaultValue="7days">
            <MenuItem value="7days">Last 7 days</MenuItem>
            <MenuItem value="30days">Last 30 days</MenuItem>
            <MenuItem value="90days">Last 90 days</MenuItem>
          </Select>
        </FormControl>
      </Box>

      <Grid container spacing={3}>
        {/* Enrollment Trend */}
        <Grid size={{ xs: 12, md: 8 }}>
          <Card>
            <CardContent>
              <Typography variant="h6" fontWeight={600} gutterBottom>
                Enrollment Trend
              </Typography>
              <LineChart
                xAxis={[{ scaleType: 'band', data: revenueData.map(d => d.month) }]}
                series={[
                  { data: revenueData.map(d => d.enrollments), label: 'Enrollments', color: '#2563EB' },
                ]}
                height={300}
              />
            </CardContent>
          </Card>
        </Grid>

        {/* Course Distribution */}
        <Grid size={{ xs: 12, md: 4 }}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Typography variant="h6" fontWeight={600} gutterBottom>
                Students by Course
              </Typography>
              <PieChart
                series={[
                  {
                    data: teacherCourses.slice(0, 4).map((c, i) => ({
                      id: i,
                      value: c.totalStudents,
                      label: c.title.slice(0, 20),
                    })),
                  },
                ]}
                height={240}
              />
            </CardContent>
          </Card>
        </Grid>

        {/* Revenue by Course */}
        <Grid size={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" fontWeight={600} gutterBottom>
                Revenue by Course
              </Typography>
              <BarChart
                xAxis={[{ scaleType: 'band', data: teacherCourses.map(c => c.title.slice(0, 15) + '...') }]}
                series={[{ data: teacherCourses.map(c => c.totalRevenue), color: '#10B981' }]}
                height={300}
              />
            </CardContent>
          </Card>
        </Grid>

        {/* Course Performance Table */}
        <Grid size={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" fontWeight={600} gutterBottom>
                Course Performance
              </Typography>
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Course</TableCell>
                      <TableCell align="right">Students</TableCell>
                      <TableCell align="right">Revenue</TableCell>
                      <TableCell align="right">Rating</TableCell>
                      <TableCell align="right">Completion Rate</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {teacherCourses.map((course) => (
                      <TableRow key={course.id}>
                        <TableCell>{course.title}</TableCell>
                        <TableCell align="right">{course.totalStudents.toLocaleString()}</TableCell>
                        <TableCell align="right">${course.totalRevenue.toLocaleString()}</TableCell>
                        <TableCell align="right">{course.rating || '-'}</TableCell>
                        <TableCell align="right">72%</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}
