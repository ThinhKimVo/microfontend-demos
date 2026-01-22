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
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material';
import {
  People as UsersIcon,
  School as CoursesIcon,
  AttachMoney as RevenueIcon,
  Assignment as EnrollmentIcon,
  TrendingUp as TrendingUpIcon,
  ArrowForward as ArrowForwardIcon,
  Warning as WarningIcon,
} from '@mui/icons-material';
import { BarChart } from '@mui/x-charts/BarChart';
import { adminDashboardStats, revenueData, teacherApplications, transactions } from '../../data/mockData';

export default function AdminDashboard() {
  const stats = [
    { title: 'Total Users', value: adminDashboardStats.totalUsers.toLocaleString(), icon: UsersIcon, color: '#2563EB', change: '+15%' },
    { title: 'Total Courses', value: adminDashboardStats.totalCourses.toLocaleString(), icon: CoursesIcon, color: '#10B981', change: '+8%' },
    { title: 'Total Revenue', value: `$${(adminDashboardStats.totalRevenue / 1000000).toFixed(1)}M`, icon: RevenueIcon, color: '#7C3AED', change: '+22%' },
    { title: 'Enrollments', value: adminDashboardStats.totalEnrollments.toLocaleString(), icon: EnrollmentIcon, color: '#F59E0B', change: '+18%' },
  ];

  return (
    <Box>
      <Typography variant="h4" fontWeight={700} sx={{ mb: 3, fontSize: { xs: '1.5rem', md: '2.125rem' } }}>
        Admin Dashboard
      </Typography>

      {/* Stats */}
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
                    <Typography variant="h4" fontWeight={700} sx={{ fontSize: { xs: '1.5rem', md: '2.125rem' } }}>
                      {stat.value}
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mt: 0.5 }}>
                      <TrendingUpIcon sx={{ fontSize: 16, color: 'success.main' }} />
                      <Typography variant="caption" color="success.main">
                        {stat.change} this month
                      </Typography>
                    </Box>
                  </Box>
                  <Box sx={{ width: 44, height: 44, borderRadius: 2, bgcolor: `${stat.color}15`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <stat.icon sx={{ fontSize: 22, color: stat.color }} />
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Alerts */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid size={{ xs: 12, md: 4 }}>
          <Card sx={{ bgcolor: 'warning.light', borderLeft: '4px solid', borderColor: 'warning.main', height: '100%' }}>
            <CardContent sx={{ display: 'flex', alignItems: 'center', gap: 2, minHeight: 72 }}>
              <WarningIcon color="warning" sx={{ flexShrink: 0 }} />
              <Box sx={{ flex: 1, minWidth: 0 }}>
                <Typography variant="subtitle2" fontWeight={600}>{adminDashboardStats.pendingApprovals} Pending Approvals</Typography>
                <Typography variant="caption" sx={{ display: 'block' }} noWrap>Courses and teachers waiting for review</Typography>
              </Box>
              <Button component={Link} to="/admin/courses" size="small" sx={{ flexShrink: 0 }}>View</Button>
            </CardContent>
          </Card>
        </Grid>
        <Grid size={{ xs: 12, md: 4 }}>
          <Card sx={{ bgcolor: 'info.light', borderLeft: '4px solid', borderColor: 'info.main', height: '100%' }}>
            <CardContent sx={{ display: 'flex', alignItems: 'center', gap: 2, minHeight: 72 }}>
              <WarningIcon color="info" sx={{ flexShrink: 0 }} />
              <Box sx={{ flex: 1, minWidth: 0 }}>
                <Typography variant="subtitle2" fontWeight={600}>${adminDashboardStats.pendingPayouts.toLocaleString()} Pending Payouts</Typography>
                <Typography variant="caption" sx={{ display: 'block' }} noWrap>Teacher payout requests</Typography>
              </Box>
              <Button component={Link} to="/admin/payouts" size="small" sx={{ flexShrink: 0 }}>View</Button>
            </CardContent>
          </Card>
        </Grid>
        <Grid size={{ xs: 12, md: 4 }}>
          <Card sx={{ bgcolor: 'error.light', borderLeft: '4px solid', borderColor: 'error.main', height: '100%' }}>
            <CardContent sx={{ display: 'flex', alignItems: 'center', gap: 2, minHeight: 72 }}>
              <WarningIcon color="error" sx={{ flexShrink: 0 }} />
              <Box sx={{ flex: 1, minWidth: 0 }}>
                <Typography variant="subtitle2" fontWeight={600}>{adminDashboardStats.activeTickets} Active Tickets</Typography>
                <Typography variant="caption" sx={{ display: 'block' }} noWrap>Support requests needing attention</Typography>
              </Box>
              <Button component={Link} to="/admin/support" size="small" sx={{ flexShrink: 0 }}>View</Button>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Grid container spacing={3}>
        {/* Revenue Chart */}
        <Grid size={{ xs: 12, md: 8 }}>
          <Card>
            <CardContent>
              <Typography variant="h6" fontWeight={600} gutterBottom>Revenue Overview</Typography>
              <BarChart
                xAxis={[{ scaleType: 'band', data: revenueData.map(d => d.month) }]}
                series={[{ data: revenueData.map(d => d.revenue), label: 'Revenue ($)', color: '#2563EB' }]}
                height={300}
              />
            </CardContent>
          </Card>
        </Grid>

        {/* Pending Applications */}
        <Grid size={{ xs: 12, md: 4 }}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6" fontWeight={600}>Teacher Applications</Typography>
                <Button component={Link} to="/admin/teachers" size="small" endIcon={<ArrowForwardIcon />}>View All</Button>
              </Box>
              {teacherApplications.filter(a => a.status === 'pending').map(app => (
                <Box key={app.id} sx={{ display: 'flex', alignItems: 'center', gap: 2, py: 1.5, borderBottom: '1px solid', borderColor: 'grey.100' }}>
                  <Avatar>{app.name[0]}</Avatar>
                  <Box sx={{ flex: 1 }}>
                    <Typography variant="body2" fontWeight={600}>{app.name}</Typography>
                    <Typography variant="caption" color="text.secondary">{app.expertise.slice(0, 2).join(', ')}</Typography>
                  </Box>
                  <Chip label="Pending" size="small" color="warning" />
                </Box>
              ))}
            </CardContent>
          </Card>
        </Grid>

        {/* Recent Transactions */}
        <Grid size={12}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6" fontWeight={600}>Recent Transactions</Typography>
                <Button component={Link} to="/admin/transactions" size="small" endIcon={<ArrowForwardIcon />}>View All</Button>
              </Box>
              <TableContainer sx={{ overflowX: 'auto' }}>
                <Table size="small" sx={{ minWidth: 600 }}>
                  <TableHead>
                    <TableRow>
                      <TableCell>Date</TableCell>
                      <TableCell>User</TableCell>
                      <TableCell>Course</TableCell>
                      <TableCell align="right">Amount</TableCell>
                      <TableCell>Status</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {transactions.slice(0, 5).map(txn => (
                      <TableRow key={txn.id}>
                        <TableCell>{new Date(txn.createdAt).toLocaleDateString()}</TableCell>
                        <TableCell>{txn.userName}</TableCell>
                        <TableCell>{txn.courseName.slice(0, 25)}...</TableCell>
                        <TableCell align="right">${txn.amount}</TableCell>
                        <TableCell>
                          <Chip label={txn.status} size="small" color={txn.status === 'completed' ? 'success' : txn.status === 'refunded' ? 'error' : 'default'} />
                        </TableCell>
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
