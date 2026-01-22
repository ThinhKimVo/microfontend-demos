import { useState } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  Tabs,
  Tab,
  Avatar,
  Chip,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Rating,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
} from '@mui/material';
import { Check as ApproveIcon, Close as RejectIcon, Visibility as ViewIcon } from '@mui/icons-material';
import { teachers, teacherApplications } from '../../data/mockData';

export default function AdminTeachers() {
  const [tabValue, setTabValue] = useState(0);
  const [selectedApp, setSelectedApp] = useState<typeof teacherApplications[0] | null>(null);
  const [selectedTeacher, setSelectedTeacher] = useState<typeof teachers[0] | null>(null);
  const [rejectDialogOpen, setRejectDialogOpen] = useState(false);
  const [detailsDialogOpen, setDetailsDialogOpen] = useState(false);
  const [teacherDetailsOpen, setTeacherDetailsOpen] = useState(false);

  const pendingApplications = teacherApplications.filter(a => a.status === 'pending');

  return (
    <Box>
      <Typography variant="h4" fontWeight={700} sx={{ mb: 3 }}>Teachers</Typography>

      <Tabs value={tabValue} onChange={(_, v) => setTabValue(v)} sx={{ mb: 3 }}>
        <Tab label={`Active Teachers (${teachers.length})`} />
        <Tab label={`Pending Applications (${pendingApplications.length})`} />
      </Tabs>

      {tabValue === 0 && (
        <Card>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Teacher</TableCell>
                  <TableCell>Courses</TableCell>
                  <TableCell>Students</TableCell>
                  <TableCell>Revenue</TableCell>
                  <TableCell>Rating</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell width={100}>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {teachers.map(teacher => (
                  <TableRow key={teacher.id} hover>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Avatar src={teacher.avatar}>{teacher.firstName[0]}</Avatar>
                        <Box>
                          <Typography variant="body2" fontWeight={600}>{teacher.firstName} {teacher.lastName}</Typography>
                          <Typography variant="caption" color="text.secondary">{teacher.email}</Typography>
                        </Box>
                      </Box>
                    </TableCell>
                    <TableCell>{teacher.totalCourses}</TableCell>
                    <TableCell>{teacher.totalStudents.toLocaleString()}</TableCell>
                    <TableCell>${teacher.totalRevenue.toLocaleString()}</TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                        <Rating value={teacher.rating} size="small" readOnly precision={0.1} />
                        <Typography variant="caption">({teacher.rating})</Typography>
                      </Box>
                    </TableCell>
                    <TableCell><Chip label={teacher.status} size="small" color="success" /></TableCell>
                    <TableCell>
                      <Button
                        size="small"
                        startIcon={<ViewIcon />}
                        onClick={() => { setSelectedTeacher(teacher); setTeacherDetailsOpen(true); }}
                      >
                        View
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Card>
      )}

      {tabValue === 1 && (
        <Grid container spacing={3}>
          {pendingApplications.map(app => (
            <Grid size={{ xs: 12, md: 6 }} key={app.id}>
              <Card>
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                    <Avatar sx={{ width: 56, height: 56 }}>{app.name[0]}</Avatar>
                    <Box sx={{ flex: 1 }}>
                      <Typography variant="h6" fontWeight={600}>{app.name}</Typography>
                      <Typography variant="body2" color="text.secondary">{app.email}</Typography>
                    </Box>
                    <Chip label="Pending" color="warning" />
                  </Box>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>{app.bio}</Typography>
                  <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mb: 2 }}>
                    {app.expertise.map(exp => <Chip key={exp} label={exp} size="small" variant="outlined" />)}
                  </Box>
                  <Typography variant="caption" color="text.secondary">Applied: {new Date(app.appliedAt).toLocaleDateString()}</Typography>
                  <Box sx={{ display: 'flex', gap: 1, mt: 2 }}>
                    <Button variant="contained" color="success" startIcon={<ApproveIcon />} onClick={() => setSelectedApp(app)}>
                      Approve
                    </Button>
                    <Button variant="outlined" color="error" startIcon={<RejectIcon />} onClick={() => { setSelectedApp(app); setRejectDialogOpen(true); }}>
                      Reject
                    </Button>
                    <Button variant="outlined" startIcon={<ViewIcon />} onClick={() => { setSelectedApp(app); setDetailsDialogOpen(true); }}>Details</Button>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      <Dialog open={rejectDialogOpen} onClose={() => setRejectDialogOpen(false)}>
        <DialogTitle>Reject Application</DialogTitle>
        <DialogContent>
          <Typography variant="body2" sx={{ mb: 2 }}>Please provide a reason for rejection:</Typography>
          <TextField fullWidth multiline rows={3} placeholder="Reason for rejection..." />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setRejectDialogOpen(false)}>Cancel</Button>
          <Button variant="contained" color="error" onClick={() => setRejectDialogOpen(false)}>Reject</Button>
        </DialogActions>
      </Dialog>

      {/* Application Details Dialog */}
      <Dialog open={detailsDialogOpen} onClose={() => setDetailsDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Application Details</DialogTitle>
        <DialogContent>
          {selectedApp && (
            <Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
                <Avatar sx={{ width: 64, height: 64 }}>{selectedApp.name[0]}</Avatar>
                <Box>
                  <Typography variant="h6" fontWeight={600}>{selectedApp.name}</Typography>
                  <Typography variant="body2" color="text.secondary">{selectedApp.email}</Typography>
                </Box>
              </Box>

              <Typography variant="subtitle2" fontWeight={600} gutterBottom>Bio</Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>{selectedApp.bio}</Typography>

              <Typography variant="subtitle2" fontWeight={600} gutterBottom>Expertise</Typography>
              <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mb: 2 }}>
                {selectedApp.expertise.map(exp => <Chip key={exp} label={exp} size="small" />)}
              </Box>

              <Typography variant="subtitle2" fontWeight={600} gutterBottom>Qualifications</Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                {'Masters in Computer Science, 10+ years teaching experience'}
              </Typography>

              <Typography variant="subtitle2" fontWeight={600} gutterBottom>Portfolio/Website</Typography>
              <Typography variant="body2" color="primary" sx={{ mb: 2 }}>
                {'https://portfolio.example.com'}
              </Typography>

              <Typography variant="subtitle2" fontWeight={600} gutterBottom>Applied On</Typography>
              <Typography variant="body2" color="text.secondary">
                {new Date(selectedApp.appliedAt).toLocaleDateString('en-US', {
                  weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
                })}
              </Typography>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDetailsDialogOpen(false)}>Close</Button>
          <Button variant="contained" color="success" startIcon={<ApproveIcon />} onClick={() => setDetailsDialogOpen(false)}>
            Approve
          </Button>
        </DialogActions>
      </Dialog>

      {/* Teacher Details Dialog */}
      <Dialog open={teacherDetailsOpen} onClose={() => setTeacherDetailsOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Teacher Details</DialogTitle>
        <DialogContent>
          {selectedTeacher && (
            <Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
                <Avatar src={selectedTeacher.avatar} sx={{ width: 80, height: 80 }}>
                  {selectedTeacher.firstName[0]}
                </Avatar>
                <Box>
                  <Typography variant="h6" fontWeight={600}>
                    {selectedTeacher.firstName} {selectedTeacher.lastName}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">{selectedTeacher.email}</Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mt: 0.5 }}>
                    <Rating value={selectedTeacher.rating} size="small" readOnly precision={0.1} />
                    <Typography variant="caption">({selectedTeacher.rating})</Typography>
                  </Box>
                </Box>
              </Box>

              <Grid container spacing={2} sx={{ mb: 3 }}>
                <Grid size={4}>
                  <Card variant="outlined">
                    <CardContent sx={{ textAlign: 'center', py: 2 }}>
                      <Typography variant="h5" fontWeight={700} color="primary">{selectedTeacher.totalCourses}</Typography>
                      <Typography variant="caption" color="text.secondary">Courses</Typography>
                    </CardContent>
                  </Card>
                </Grid>
                <Grid size={4}>
                  <Card variant="outlined">
                    <CardContent sx={{ textAlign: 'center', py: 2 }}>
                      <Typography variant="h5" fontWeight={700} color="primary">{selectedTeacher.totalStudents.toLocaleString()}</Typography>
                      <Typography variant="caption" color="text.secondary">Students</Typography>
                    </CardContent>
                  </Card>
                </Grid>
                <Grid size={4}>
                  <Card variant="outlined">
                    <CardContent sx={{ textAlign: 'center', py: 2 }}>
                      <Typography variant="h5" fontWeight={700} color="success.main">${selectedTeacher.totalRevenue.toLocaleString()}</Typography>
                      <Typography variant="caption" color="text.secondary">Revenue</Typography>
                    </CardContent>
                  </Card>
                </Grid>
              </Grid>

              <Typography variant="subtitle2" fontWeight={600} gutterBottom>Bio</Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>{selectedTeacher.bio}</Typography>

              <Typography variant="subtitle2" fontWeight={600} gutterBottom>Expertise</Typography>
              <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mb: 2 }}>
                {selectedTeacher.expertise.map(exp => <Chip key={exp} label={exp} size="small" />)}
              </Box>

              <Typography variant="subtitle2" fontWeight={600} gutterBottom>Account Status</Typography>
              <Chip label={selectedTeacher.status} color="success" size="small" />
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setTeacherDetailsOpen(false)}>Close</Button>
          <Button variant="outlined" color="error">Suspend Account</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
