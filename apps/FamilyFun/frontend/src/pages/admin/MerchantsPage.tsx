import React, { useState } from 'react';
import {
  Box,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  IconButton,
  TextField,
  InputAdornment,
  Menu,
  MenuItem,
  TablePagination,
  Avatar,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Divider,
  FormControl,
  InputLabel,
  Select,
} from '@mui/material';
import Grid from '@mui/material/Grid2';
import SearchIcon from '@mui/icons-material/Search';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import EditIcon from '@mui/icons-material/Edit';
import BlockIcon from '@mui/icons-material/Block';
import VisibilityIcon from '@mui/icons-material/Visibility';
import EmailIcon from '@mui/icons-material/Email';
import { format } from 'date-fns';
import StatusChip from '../../components/StatusChip';
import { mockMerchants } from '../../data/mockData';
import type { SubscriptionStatus } from '../../types';

const MerchantsPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedMerchant, setSelectedMerchant] = useState<typeof mockMerchants[0] | null>(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [statusFilter, setStatusFilter] = useState<SubscriptionStatus | 'all'>('all');

  const filteredMerchants = mockMerchants.filter((merchant) => {
    const matchesSearch =
      merchant.companyName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      merchant.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || merchant.subscriptionStatus === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>, merchant: typeof mockMerchants[0]) => {
    setAnchorEl(event.currentTarget);
    setSelectedMerchant(merchant);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const openDetails = (merchant: typeof mockMerchants[0]) => {
    setSelectedMerchant(merchant);
    setDetailsOpen(true);
    handleMenuClose();
  };

  return (
    <Box>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" fontWeight={700} gutterBottom>
          Merchants
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Manage merchant accounts and subscriptions
        </Typography>
      </Box>

      <Paper>
        <Box sx={{ p: 2, display: 'flex', gap: 2, flexWrap: 'wrap' }}>
          <TextField
            placeholder="Search merchants..."
            size="small"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon color="action" />
                </InputAdornment>
              ),
            }}
            sx={{ width: 300 }}
          />
          <FormControl size="small" sx={{ minWidth: 150 }}>
            <InputLabel>Status</InputLabel>
            <Select
              value={statusFilter}
              label="Status"
              onChange={(e) => setStatusFilter(e.target.value as SubscriptionStatus | 'all')}
            >
              <MenuItem value="all">All Status</MenuItem>
              <MenuItem value="trial">Trial</MenuItem>
              <MenuItem value="active">Active</MenuItem>
              <MenuItem value="expired">Expired</MenuItem>
              <MenuItem value="cancelled">Cancelled</MenuItem>
            </Select>
          </FormControl>
        </Box>

        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Merchant</TableCell>
                <TableCell>Contact</TableCell>
                <TableCell>Events</TableCell>
                <TableCell>Subscription</TableCell>
                <TableCell>Joined</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredMerchants
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((merchant) => (
                  <TableRow key={merchant.id} hover>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Avatar sx={{ bgcolor: 'primary.main' }}>
                          {merchant.companyName.charAt(0)}
                        </Avatar>
                        <Box>
                          <Typography variant="body2" fontWeight={600}>
                            {merchant.companyName}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {merchant.email}
                          </Typography>
                        </Box>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">{merchant.contactPerson}</Typography>
                      <Typography variant="caption" color="text.secondary">
                        {merchant.phone}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">{merchant.eventsCount}</Typography>
                    </TableCell>
                    <TableCell>
                      <StatusChip status={merchant.subscriptionStatus} />
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">
                        {format(new Date(merchant.createdAt), 'MMM d, yyyy')}
                      </Typography>
                    </TableCell>
                    <TableCell align="right">
                      <IconButton
                        size="small"
                        onClick={(e) => handleMenuOpen(e, merchant)}
                      >
                        <MoreVertIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </TableContainer>

        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={filteredMerchants.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={(_, newPage) => setPage(newPage)}
          onRowsPerPageChange={(e) => {
            setRowsPerPage(parseInt(e.target.value, 10));
            setPage(0);
          }}
        />
      </Paper>

      {/* Actions Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        <MenuItem onClick={() => selectedMerchant && openDetails(selectedMerchant)}>
          <VisibilityIcon sx={{ mr: 1.5, fontSize: 20 }} /> View Details
        </MenuItem>
        <MenuItem onClick={handleMenuClose}>
          <EditIcon sx={{ mr: 1.5, fontSize: 20 }} /> Edit
        </MenuItem>
        <MenuItem onClick={handleMenuClose}>
          <EmailIcon sx={{ mr: 1.5, fontSize: 20 }} /> Send Email
        </MenuItem>
        <Divider />
        <MenuItem onClick={handleMenuClose} sx={{ color: 'error.main' }}>
          <BlockIcon sx={{ mr: 1.5, fontSize: 20 }} /> Suspend Account
        </MenuItem>
      </Menu>

      {/* Details Dialog */}
      <Dialog
        open={detailsOpen}
        onClose={() => setDetailsOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        {selectedMerchant && (
          <>
            <DialogTitle>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Avatar sx={{ bgcolor: 'primary.main', width: 48, height: 48 }}>
                  {selectedMerchant.companyName.charAt(0)}
                </Avatar>
                <Box>
                  <Typography variant="h6">{selectedMerchant.companyName}</Typography>
                  <StatusChip status={selectedMerchant.subscriptionStatus} size="small" />
                </Box>
              </Box>
            </DialogTitle>
            <DialogContent>
              <Grid container spacing={2} sx={{ mt: 1 }}>
                <Grid size={{ xs: 6 }}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Contact Person
                  </Typography>
                  <Typography variant="body1">{selectedMerchant.contactPerson}</Typography>
                </Grid>
                <Grid size={{ xs: 6 }}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Phone
                  </Typography>
                  <Typography variant="body1">{selectedMerchant.phone}</Typography>
                </Grid>
                <Grid size={{ xs: 12 }}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Email
                  </Typography>
                  <Typography variant="body1">{selectedMerchant.email}</Typography>
                </Grid>
                <Grid size={{ xs: 6 }}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Total Events
                  </Typography>
                  <Typography variant="body1">{selectedMerchant.eventsCount}</Typography>
                </Grid>
                <Grid size={{ xs: 6 }}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Member Since
                  </Typography>
                  <Typography variant="body1">
                    {format(new Date(selectedMerchant.createdAt), 'MMMM d, yyyy')}
                  </Typography>
                </Grid>
                <Grid size={{ xs: 12 }}>
                  <Divider sx={{ my: 1 }} />
                </Grid>
                <Grid size={{ xs: 6 }}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Trial End Date
                  </Typography>
                  <Typography variant="body1">
                    {format(new Date(selectedMerchant.trialEndDate), 'MMMM d, yyyy')}
                  </Typography>
                </Grid>
                {selectedMerchant.subscriptionEndDate && (
                  <Grid size={{ xs: 6 }}>
                    <Typography variant="subtitle2" color="text.secondary">
                      Subscription End
                    </Typography>
                    <Typography variant="body1">
                      {format(new Date(selectedMerchant.subscriptionEndDate), 'MMMM d, yyyy')}
                    </Typography>
                  </Grid>
                )}
              </Grid>

              <Box sx={{ mt: 3 }}>
                <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                  Override Subscription Status
                </Typography>
                <FormControl fullWidth size="small">
                  <Select
                    value={selectedMerchant.subscriptionStatus}
                  >
                    <MenuItem value="trial">Trial</MenuItem>
                    <MenuItem value="active">Active</MenuItem>
                    <MenuItem value="expired">Expired</MenuItem>
                    <MenuItem value="cancelled">Cancelled</MenuItem>
                  </Select>
                </FormControl>
              </Box>
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setDetailsOpen(false)}>Close</Button>
              <Button variant="contained">Save Changes</Button>
            </DialogActions>
          </>
        )}
      </Dialog>
    </Box>
  );
};

export default MerchantsPage;
