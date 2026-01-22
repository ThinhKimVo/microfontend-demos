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
  FormControl,
  Select,
  MenuItem,
  InputLabel,
  Grid,
  Button,
} from '@mui/material';
import { Search as SearchIcon, Download as DownloadIcon } from '@mui/icons-material';
import { transactions, adminDashboardStats } from '../../data/mockData';

export default function AdminTransactions() {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const filteredTransactions = transactions.filter(t => {
    const matchesSearch = t.userName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.courseName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || t.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'success';
      case 'pending': return 'warning';
      case 'refunded': return 'error';
      case 'failed': return 'error';
      default: return 'default';
    }
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" fontWeight={700}>Transactions</Typography>
        <Button variant="outlined" startIcon={<DownloadIcon />}>Export</Button>
      </Box>

      {/* Stats */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid size={{ xs: 6, md: 3 }}>
          <Card><CardContent><Typography variant="body2" color="text.secondary">Total Revenue</Typography><Typography variant="h5" fontWeight={700}>${(adminDashboardStats.totalRevenue / 1000000).toFixed(2)}M</Typography></CardContent></Card>
        </Grid>
        <Grid size={{ xs: 6, md: 3 }}>
          <Card><CardContent><Typography variant="body2" color="text.secondary">This Month</Typography><Typography variant="h5" fontWeight={700}>${adminDashboardStats.monthlyRevenue.toLocaleString()}</Typography></CardContent></Card>
        </Grid>
        <Grid size={{ xs: 6, md: 3 }}>
          <Card><CardContent><Typography variant="body2" color="text.secondary">Platform Fees</Typography><Typography variant="h5" fontWeight={700}>${(adminDashboardStats.totalRevenue * 0.3 / 1000000).toFixed(2)}M</Typography></CardContent></Card>
        </Grid>
        <Grid size={{ xs: 6, md: 3 }}>
          <Card><CardContent><Typography variant="body2" color="text.secondary">Refunds</Typography><Typography variant="h5" fontWeight={700}>$12,450</Typography></CardContent></Card>
        </Grid>
      </Grid>

      <Card>
        <CardContent sx={{ pb: 0 }}>
          <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
            <TextField
              size="small"
              placeholder="Search transactions..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              slotProps={{ input: { startAdornment: <InputAdornment position="start"><SearchIcon fontSize="small" /></InputAdornment> } }}
              sx={{ width: 300 }}
            />
            <FormControl size="small" sx={{ minWidth: 150 }}>
              <InputLabel>Status</InputLabel>
              <Select value={statusFilter} label="Status" onChange={(e) => setStatusFilter(e.target.value)}>
                <MenuItem value="all">All Status</MenuItem>
                <MenuItem value="completed">Completed</MenuItem>
                <MenuItem value="pending">Pending</MenuItem>
                <MenuItem value="refunded">Refunded</MenuItem>
              </Select>
            </FormControl>
          </Box>
        </CardContent>

        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Transaction ID</TableCell>
                <TableCell>Date</TableCell>
                <TableCell>User</TableCell>
                <TableCell>Course</TableCell>
                <TableCell>Teacher</TableCell>
                <TableCell align="right">Amount</TableCell>
                <TableCell align="right">Platform Fee</TableCell>
                <TableCell>Status</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredTransactions.map(txn => (
                <TableRow key={txn.id} hover>
                  <TableCell><Typography variant="body2" fontWeight={600}>#{txn.id}</Typography></TableCell>
                  <TableCell>{new Date(txn.createdAt).toLocaleDateString()}</TableCell>
                  <TableCell>{txn.userName}</TableCell>
                  <TableCell>{txn.courseName.slice(0, 25)}...</TableCell>
                  <TableCell>{txn.teacherName}</TableCell>
                  <TableCell align="right">${txn.amount}</TableCell>
                  <TableCell align="right">${txn.platformFee}</TableCell>
                  <TableCell><Chip label={txn.status} size="small" color={getStatusColor(txn.status) as any} /></TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Card>
    </Box>
  );
}
