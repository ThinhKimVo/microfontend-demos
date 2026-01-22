import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
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
  Chip,
  TextField,
  InputAdornment,
  Menu,
  MenuItem,
  Tabs,
  Tab,
  TablePagination,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import SearchIcon from '@mui/icons-material/Search';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import VisibilityIcon from '@mui/icons-material/Visibility';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import { format } from 'date-fns';
import StatusChip from '../../components/StatusChip';
import { mockEvents } from '../../data/mockData';
import type { EventStatus } from '../../types';

const MerchantEventsPage: React.FC = () => {
  const navigate = useNavigate();
  const [tabValue, setTabValue] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedEventId, setSelectedEventId] = useState<string | null>(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const statusFilters: (EventStatus | 'all')[] = ['all', 'draft', 'submitted', 'approved', 'rejected'];
  const currentFilter = statusFilters[tabValue];

  const filteredEvents = mockEvents.filter((event) => {
    const matchesSearch =
      event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      event.district.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = currentFilter === 'all' || event.status === currentFilter;
    return matchesSearch && matchesStatus;
  });

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>, eventId: string) => {
    setAnchorEl(event.currentTarget);
    setSelectedEventId(eventId);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedEventId(null);
  };

  const getStatusCount = (status: EventStatus | 'all') => {
    if (status === 'all') return mockEvents.length;
    return mockEvents.filter((e) => e.status === status).length;
  };

  return (
    <Box>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          mb: 4,
        }}
      >
        <Box>
          <Typography variant="h4" fontWeight={700} gutterBottom>
            My Events
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Manage and track your submitted events
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          component={Link}
          to="/merchant/submit"
        >
          Submit Event
        </Button>
      </Box>

      <Paper>
        {/* Tabs */}
        <Tabs
          value={tabValue}
          onChange={(_, val) => {
            setTabValue(val);
            setPage(0);
          }}
          sx={{ borderBottom: 1, borderColor: 'divider', px: 2 }}
        >
          {statusFilters.map((status) => (
            <Tab
              key={status}
              label={
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <span>{status.charAt(0).toUpperCase() + status.slice(1)}</span>
                  <Chip
                    label={getStatusCount(status)}
                    size="small"
                    sx={{ height: 20, fontSize: '0.7rem' }}
                  />
                </Box>
              }
            />
          ))}
        </Tabs>

        {/* Search */}
        <Box sx={{ p: 2 }}>
          <TextField
            placeholder="Search events..."
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
        </Box>

        {/* Table */}
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Event</TableCell>
                <TableCell>Date</TableCell>
                <TableCell>District</TableCell>
                <TableCell>Price</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Views</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredEvents
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((event) => (
                  <TableRow key={event.id} hover>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Box
                          sx={{
                            width: 60,
                            height: 45,
                            borderRadius: 1,
                            overflow: 'hidden',
                            flexShrink: 0,
                          }}
                        >
                          <img
                            src={event.imageUrl}
                            alt={event.title}
                            style={{
                              width: '100%',
                              height: '100%',
                              objectFit: 'cover',
                            }}
                          />
                        </Box>
                        <Box>
                          <Typography variant="body2" fontWeight={600}>
                            {event.title}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {event.ageGroup.slice(0, 2).join(', ')}
                          </Typography>
                        </Box>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">
                        {format(new Date(event.date), 'MMM d, yyyy')}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">{event.district}</Typography>
                    </TableCell>
                    <TableCell>
                      <Typography
                        variant="body2"
                        color={event.isFree ? 'success.main' : 'text.primary'}
                        fontWeight={500}
                      >
                        {event.isFree ? 'Free' : `HK$${event.price}`}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <StatusChip status={event.status} />
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">{event.viewCount.toLocaleString()}</Typography>
                    </TableCell>
                    <TableCell align="right">
                      <IconButton
                        size="small"
                        onClick={(e) => handleMenuOpen(e, event.id)}
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
          count={filteredEvents.length}
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
        <MenuItem onClick={() => {
          if (selectedEventId) {
            navigate(`/events/${selectedEventId}`);
          }
          handleMenuClose();
        }}>
          <VisibilityIcon sx={{ mr: 1.5, fontSize: 20 }} /> View
        </MenuItem>
        <MenuItem onClick={() => {
          if (selectedEventId) {
            navigate(`/merchant/submit?edit=${selectedEventId}`);
          }
          handleMenuClose();
        }}>
          <EditIcon sx={{ mr: 1.5, fontSize: 20 }} /> Edit
        </MenuItem>
        <MenuItem onClick={() => {
          if (selectedEventId) {
            navigate(`/merchant/submit?duplicate=${selectedEventId}`);
          }
          handleMenuClose();
        }}>
          <ContentCopyIcon sx={{ mr: 1.5, fontSize: 20 }} /> Duplicate
        </MenuItem>
        <MenuItem onClick={() => {
          if (selectedEventId) {
            alert(`Delete event ${selectedEventId}? This action cannot be undone.`);
          }
          handleMenuClose();
        }} sx={{ color: 'error.main' }}>
          <DeleteIcon sx={{ mr: 1.5, fontSize: 20 }} /> Delete
        </MenuItem>
      </Menu>
    </Box>
  );
};

export default MerchantEventsPage;
