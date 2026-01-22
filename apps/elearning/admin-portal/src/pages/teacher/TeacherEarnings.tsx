import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
} from '@mui/material';
import { BarChart } from '@mui/x-charts/BarChart';
import { teacherDashboardStats, transactions, payouts, revenueData } from '../../data/mockData';

export default function TeacherEarnings() {
  const myTransactions = transactions.filter(t => t.teacherId === 'teacher-001');
  const myPayouts = payouts.filter(p => p.teacherId === 'teacher-001');

  return (
    <Box>
      <Typography variant="h4" fontWeight={700} sx={{ mb: 3 }}>
        Earnings
      </Typography>

      <Grid container spacing={3}>
        {/* Stats */}
        <Grid size={{ xs: 12, md: 4 }}>
          <Card>
            <CardContent>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                Total Revenue
              </Typography>
              <Typography variant="h4" fontWeight={700}>
                ${teacherDashboardStats.totalRevenue.toLocaleString()}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid size={{ xs: 12, md: 4 }}>
          <Card>
            <CardContent>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                This Month
              </Typography>
              <Typography variant="h4" fontWeight={700}>
                ${teacherDashboardStats.monthlyRevenue.toLocaleString()}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid size={{ xs: 12, md: 4 }}>
          <Card sx={{ bgcolor: 'primary.main', color: 'white' }}>
            <CardContent>
              <Typography variant="body2" sx={{ opacity: 0.8 }} gutterBottom>
                Available for Withdrawal
              </Typography>
              <Typography variant="h4" fontWeight={700}>
                ${teacherDashboardStats.pendingPayout.toLocaleString()}
              </Typography>
              <Button
                variant="contained"
                sx={{ mt: 2, bgcolor: 'white', color: 'primary.main', '&:hover': { bgcolor: 'grey.100' } }}
              >
                Request Payout
              </Button>
            </CardContent>
          </Card>
        </Grid>

        {/* Chart */}
        <Grid size={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" fontWeight={600} gutterBottom>
                Revenue History
              </Typography>
              <BarChart
                xAxis={[{ scaleType: 'band', data: revenueData.map(d => d.month) }]}
                series={[{ data: revenueData.map(d => d.revenue), color: '#2563EB' }]}
                height={300}
              />
            </CardContent>
          </Card>
        </Grid>

        {/* Recent Transactions */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Card>
            <CardContent>
              <Typography variant="h6" fontWeight={600} gutterBottom>
                Recent Transactions
              </Typography>
              <TableContainer>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>Date</TableCell>
                      <TableCell>Course</TableCell>
                      <TableCell align="right">Amount</TableCell>
                      <TableCell align="right">Your Share</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {myTransactions.slice(0, 5).map((txn) => (
                      <TableRow key={txn.id}>
                        <TableCell>{new Date(txn.createdAt).toLocaleDateString()}</TableCell>
                        <TableCell>{txn.courseName.slice(0, 20)}...</TableCell>
                        <TableCell align="right">${txn.amount}</TableCell>
                        <TableCell align="right">${txn.teacherEarning}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>
          </Card>
        </Grid>

        {/* Payout History */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Card>
            <CardContent>
              <Typography variant="h6" fontWeight={600} gutterBottom>
                Payout History
              </Typography>
              <TableContainer>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>Date</TableCell>
                      <TableCell>Method</TableCell>
                      <TableCell align="right">Amount</TableCell>
                      <TableCell>Status</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {myPayouts.map((payout) => (
                      <TableRow key={payout.id}>
                        <TableCell>{new Date(payout.requestedAt).toLocaleDateString()}</TableCell>
                        <TableCell>{payout.method}</TableCell>
                        <TableCell align="right">${payout.amount.toLocaleString()}</TableCell>
                        <TableCell>
                          <Chip
                            label={payout.status}
                            size="small"
                            color={payout.status === 'completed' ? 'success' : payout.status === 'pending' ? 'warning' : 'info'}
                          />
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
