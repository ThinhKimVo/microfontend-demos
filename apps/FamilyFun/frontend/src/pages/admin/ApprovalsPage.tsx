import React, { useState } from 'react';
import {
  Box,
  Typography,
  Paper,
  Grid,
  Button,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Divider,
  Card,
  CardMedia,
  CardContent,
  IconButton,
} from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import VisibilityIcon from '@mui/icons-material/Visibility';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import PersonIcon from '@mui/icons-material/Person';
import { format } from 'date-fns';
import { mockEvents } from '../../data/mockData';

const ApprovalsPage: React.FC = () => {
  const [selectedEvent, setSelectedEvent] = useState<typeof mockEvents[0] | null>(null);
  const [rejectDialogOpen, setRejectDialogOpen] = useState(false);
  const [rejectReason, setRejectReason] = useState('');
  const [previewOpen, setPreviewOpen] = useState(false);

  const pendingEvents = mockEvents.filter((e) => e.status === 'submitted');

  const handleApprove = (eventId: string) => {
    alert(`Event ${eventId} approved!`);
  };

  const handleReject = () => {
    if (selectedEvent) {
      alert(`Event ${selectedEvent.id} rejected. Reason: ${rejectReason}`);
      setRejectDialogOpen(false);
      setRejectReason('');
      setSelectedEvent(null);
    }
  };

  const openRejectDialog = (event: typeof mockEvents[0]) => {
    setSelectedEvent(event);
    setRejectDialogOpen(true);
  };

  const openPreview = (event: typeof mockEvents[0]) => {
    setSelectedEvent(event);
    setPreviewOpen(true);
  };

  return (
    <Box>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" fontWeight={700} gutterBottom>
          Pending Approvals
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Review and approve merchant event submissions
        </Typography>
      </Box>

      {pendingEvents.length === 0 ? (
        <Paper sx={{ p: 6, textAlign: 'center' }}>
          <CheckCircleIcon sx={{ fontSize: 64, color: 'success.main', mb: 2 }} />
          <Typography variant="h5" gutterBottom>
            All caught up!
          </Typography>
          <Typography variant="body1" color="text.secondary">
            There are no pending events to review.
          </Typography>
        </Paper>
      ) : (
        <Grid container spacing={3}>
          {pendingEvents.map((event) => (
            <Grid size={{ xs: 12, md: 6, lg: 4 }} key={event.id}>
              <Card>
                <CardMedia
                  component="img"
                  height="180"
                  image={event.imageUrl}
                  alt={event.title}
                />
                <CardContent>
                  <Box sx={{ display: 'flex', gap: 0.5, mb: 2 }}>
                    {event.isFree && (
                      <Chip label="Free" size="small" color="success" />
                    )}
                    {event.isSenFriendly && (
                      <Chip label="SEN" size="small" color="info" />
                    )}
                  </Box>

                  <Typography variant="h6" fontWeight={600} gutterBottom>
                    {event.title}
                  </Typography>

                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, mb: 2 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <CalendarTodayIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
                      <Typography variant="body2" color="text.secondary">
                        {format(new Date(event.date), 'MMM d, yyyy')}
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <LocationOnIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
                      <Typography variant="body2" color="text.secondary">
                        {event.district}
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <PersonIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
                      <Typography variant="body2" color="text.secondary">
                        Merchant #{event.merchantId}
                      </Typography>
                    </Box>
                  </Box>

                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{
                      display: '-webkit-box',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden',
                      mb: 2,
                    }}
                  >
                    {event.description}
                  </Typography>

                  <Divider sx={{ my: 2 }} />

                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <IconButton
                      onClick={() => openPreview(event)}
                      sx={{ bgcolor: 'action.hover' }}
                      size="small"
                    >
                      <VisibilityIcon />
                    </IconButton>
                    <Button
                      variant="outlined"
                      color="error"
                      size="small"
                      startIcon={<CancelIcon />}
                      onClick={() => openRejectDialog(event)}
                      sx={{ flex: 1 }}
                    >
                      Reject
                    </Button>
                    <Button
                      variant="contained"
                      color="success"
                      size="small"
                      startIcon={<CheckCircleIcon />}
                      onClick={() => handleApprove(event.id)}
                      sx={{ flex: 1 }}
                    >
                      Approve
                    </Button>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      {/* Reject Dialog */}
      <Dialog
        open={rejectDialogOpen}
        onClose={() => setRejectDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Reject Event</DialogTitle>
        <DialogContent>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Please provide a reason for rejecting this event. The merchant will be notified.
          </Typography>
          <TextField
            fullWidth
            multiline
            rows={4}
            label="Rejection Reason"
            value={rejectReason}
            onChange={(e) => setRejectReason(e.target.value)}
            placeholder="e.g., Missing required information, inappropriate content..."
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setRejectDialogOpen(false)}>Cancel</Button>
          <Button
            variant="contained"
            color="error"
            onClick={handleReject}
            disabled={!rejectReason.trim()}
          >
            Reject Event
          </Button>
        </DialogActions>
      </Dialog>

      {/* Preview Dialog */}
      <Dialog
        open={previewOpen}
        onClose={() => setPreviewOpen(false)}
        maxWidth="md"
        fullWidth
      >
        {selectedEvent && (
          <>
            <DialogTitle>{selectedEvent.title}</DialogTitle>
            <DialogContent>
              <Box sx={{ mb: 2 }}>
                <img
                  src={selectedEvent.imageUrl}
                  alt={selectedEvent.title}
                  style={{
                    width: '100%',
                    height: 300,
                    objectFit: 'cover',
                    borderRadius: 8,
                  }}
                />
              </Box>
              <Grid container spacing={2}>
                <Grid size={{ xs: 6 }}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Date
                  </Typography>
                  <Typography variant="body1">
                    {format(new Date(selectedEvent.date), 'MMMM d, yyyy')}
                  </Typography>
                </Grid>
                <Grid size={{ xs: 6 }}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Time
                  </Typography>
                  <Typography variant="body1" sx={{ textTransform: 'capitalize' }}>
                    {selectedEvent.timeSlot}
                  </Typography>
                </Grid>
                <Grid size={{ xs: 6 }}>
                  <Typography variant="subtitle2" color="text.secondary">
                    District
                  </Typography>
                  <Typography variant="body1">{selectedEvent.district}</Typography>
                </Grid>
                <Grid size={{ xs: 6 }}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Price
                  </Typography>
                  <Typography variant="body1">
                    {selectedEvent.isFree ? 'Free' : `HK$${selectedEvent.price}`}
                  </Typography>
                </Grid>
                <Grid size={{ xs: 12 }}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Address
                  </Typography>
                  <Typography variant="body1">{selectedEvent.address}</Typography>
                </Grid>
                <Grid size={{ xs: 12 }}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Age Groups
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap' }}>
                    {selectedEvent.ageGroup.map((age) => (
                      <Chip key={age} label={age} size="small" />
                    ))}
                  </Box>
                </Grid>
                <Grid size={{ xs: 12 }}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Description
                  </Typography>
                  <Typography variant="body1">{selectedEvent.description}</Typography>
                </Grid>
              </Grid>
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setPreviewOpen(false)}>Close</Button>
              <Button
                variant="outlined"
                color="error"
                onClick={() => {
                  setPreviewOpen(false);
                  openRejectDialog(selectedEvent);
                }}
              >
                Reject
              </Button>
              <Button
                variant="contained"
                color="success"
                onClick={() => {
                  handleApprove(selectedEvent.id);
                  setPreviewOpen(false);
                }}
              >
                Approve
              </Button>
            </DialogActions>
          </>
        )}
      </Dialog>
    </Box>
  );
};

export default ApprovalsPage;
