import { useState } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Button,
  Avatar,
  Tabs,
  Tab,
  Grid,
} from '@mui/material';
import { Check as ApproveIcon, Close as RejectIcon } from '@mui/icons-material';
import { payouts, adminDashboardStats } from '../../data/mockData';

export default function AdminPayouts() {
  const [tabValue, setTabValue] = useState(0);

  const filteredPayouts = payouts.filter(p => {
    if (tabValue === 1) return p.status === 'pending';
    if (tabValue === 2) return p.status === 'processing';
    if (tabValue === 3) return p.status === 'completed';
    return true;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'success';
      case 'pending': return 'warning';
      case 'processing': return 'info';
      case 'failed': return 'error';
      default: return 'default';
    }
  };

  return (
    <Box>
      <Typography variant="h4" fontWeight={700} sx={{ mb: 3 }}>Payouts</Typography>

      {/* Stats */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid size={{ xs: 6, md: 3 }}>
          <Card><CardContent><Typography variant="body2" color="text.secondary">Pending Payouts</Typography><Typography variant="h5" fontWeight={700} color="warning.main">${adminDashboardStats.pendingPayouts.toLocaleString()}</Typography></CardContent></Card>
        </Grid>
        <Grid size={{ xs: 6, md: 3 }}>
          <Card><CardContent><Typography variant="body2" color="text.secondary">Processing</Typography><Typography variant="h5" fontWeight={700}>${payouts.filter(p => p.status === 'processing').reduce((sum, p) => sum + p.amount, 0).toLocaleString()}</Typography></CardContent></Card>
        </Grid>
        <Grid size={{ xs: 6, md: 3 }}>
          <Card><CardContent><Typography variant="body2" color="text.secondary">Completed (Month)</Typography><Typography variant="h5" fontWeight={700} color="success.main">$78,450</Typography></CardContent></Card>
        </Grid>
        <Grid size={{ xs: 6, md: 3 }}>
          <Card><CardContent><Typography variant="body2" color="text.secondary">Total Paid (All Time)</Typography><Typography variant="h5" fontWeight={700}>$2.4M</Typography></CardContent></Card>
        </Grid>
      </Grid>

      <Card>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs value={tabValue} onChange={(_, v) => setTabValue(v)}>
            <Tab label={`All (${payouts.length})`} />
            <Tab label={`Pending (${payouts.filter(p => p.status === 'pending').length})`} />
            <Tab label={`Processing (${payouts.filter(p => p.status === 'processing').length})`} />
            <Tab label={`Completed (${payouts.filter(p => p.status === 'completed').length})`} />
          </Tabs>
        </Box>

        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Teacher</TableCell>
                <TableCell>Method</TableCell>
                <TableCell align="right">Amount</TableCell>
                <TableCell>Requested</TableCell>
                <TableCell>Processed</TableCell>
                <TableCell>Status</TableCell>
                <TableCell width={150}>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredPayouts.map(payout => (
                <TableRow key={payout.id} hover>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <Avatar>{payout.teacherName[0]}</Avatar>
                      <Typography variant="body2" fontWeight={600}>{payout.teacherName}</Typography>
                    </Box>
                  </TableCell>
                  <TableCell>{payout.method}</TableCell>
                  <TableCell align="right"><Typography variant="body2" fontWeight={600}>${payout.amount.toLocaleString()}</Typography></TableCell>
                  <TableCell>{new Date(payout.requestedAt).toLocaleDateString()}</TableCell>
                  <TableCell>{payout.processedAt ? new Date(payout.processedAt).toLocaleDateString() : '-'}</TableCell>
                  <TableCell><Chip label={payout.status} size="small" color={getStatusColor(payout.status) as any} /></TableCell>
                  <TableCell>
                    {payout.status === 'pending' && (
                      <Box sx={{ display: 'flex', gap: 1 }}>
                        <Button size="small" variant="contained" color="success" startIcon={<ApproveIcon />}>Approve</Button>
                        <Button size="small" variant="outlined" color="error" startIcon={<RejectIcon />}>Reject</Button>
                      </Box>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Card>
    </Box>
  );
}
