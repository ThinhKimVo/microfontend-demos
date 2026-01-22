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
  TextField,
  Button,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Divider,
} from '@mui/material';
import { Send as SendIcon } from '@mui/icons-material';
import { supportTickets } from '../../data/mockData';

export default function AdminSupport() {
  const [tabValue, setTabValue] = useState(0);
  const [selectedTicket, setSelectedTicket] = useState<typeof supportTickets[0] | null>(supportTickets[0]);
  const [reply, setReply] = useState('');

  const filteredTickets = supportTickets.filter(t => {
    if (tabValue === 1) return t.status === 'open';
    if (tabValue === 2) return t.status === 'in_progress';
    if (tabValue === 3) return t.status === 'resolved';
    return true;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'open': return 'error';
      case 'in_progress': return 'warning';
      case 'resolved': return 'success';
      case 'closed': return 'default';
      default: return 'default';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'error';
      case 'high': return 'warning';
      case 'medium': return 'info';
      case 'low': return 'default';
      default: return 'default';
    }
  };

  return (
    <Box>
      <Typography variant="h4" fontWeight={700} sx={{ mb: 3 }}>Support Tickets</Typography>

      <Grid container spacing={3}>
        {/* Ticket List */}
        <Grid size={{ xs: 12, md: 5 }}>
          <Card>
            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
              <Tabs value={tabValue} onChange={(_, v) => setTabValue(v)}>
                <Tab label={`All (${supportTickets.length})`} />
                <Tab label={`Open (${supportTickets.filter(t => t.status === 'open').length})`} />
                <Tab label={`In Progress (${supportTickets.filter(t => t.status === 'in_progress').length})`} />
              </Tabs>
            </Box>
            <List>
              {filteredTickets.map((ticket, index) => (
                <Box key={ticket.id}>
                  <ListItem
                    component="div"
                    onClick={() => setSelectedTicket(ticket)}
                    sx={{
                      cursor: 'pointer',
                      bgcolor: selectedTicket?.id === ticket.id ? 'primary.light' : 'transparent',
                      '&:hover': { bgcolor: 'grey.50' },
                    }}
                  >
                    <ListItemAvatar>
                      <Avatar>{ticket.userName[0]}</Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary={
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Typography variant="body2" fontWeight={600}>{ticket.subject}</Typography>
                          <Chip label={ticket.priority} size="small" color={getPriorityColor(ticket.priority) as any} sx={{ height: 20 }} />
                        </Box>
                      }
                      secondary={
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 0.5 }}>
                          <Typography variant="caption">{ticket.userName}</Typography>
                          <Typography variant="caption">{new Date(ticket.createdAt).toLocaleDateString()}</Typography>
                        </Box>
                      }
                    />
                  </ListItem>
                  {index < filteredTickets.length - 1 && <Divider />}
                </Box>
              ))}
            </List>
          </Card>
        </Grid>

        {/* Ticket Detail */}
        <Grid size={{ xs: 12, md: 7 }}>
          {selectedTicket ? (
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 3 }}>
                  <Box>
                    <Typography variant="h6" fontWeight={600}>{selectedTicket.subject}</Typography>
                    <Box sx={{ display: 'flex', gap: 1, mt: 1 }}>
                      <Chip label={selectedTicket.status} size="small" color={getStatusColor(selectedTicket.status) as any} />
                      <Chip label={selectedTicket.priority} size="small" color={getPriorityColor(selectedTicket.priority) as any} />
                      <Chip label={selectedTicket.category} size="small" variant="outlined" />
                    </Box>
                  </Box>
                </Box>

                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
                  <Avatar>{selectedTicket.userName[0]}</Avatar>
                  <Box>
                    <Typography variant="body2" fontWeight={600}>{selectedTicket.userName}</Typography>
                    <Typography variant="caption" color="text.secondary">{selectedTicket.userEmail}</Typography>
                  </Box>
                  <Typography variant="caption" color="text.secondary" sx={{ ml: 'auto' }}>
                    {new Date(selectedTicket.createdAt).toLocaleString()}
                  </Typography>
                </Box>

                <Box sx={{ p: 2, bgcolor: 'grey.50', borderRadius: 2, mb: 3 }}>
                  <Typography variant="body2">{selectedTicket.description}</Typography>
                </Box>

                <Divider sx={{ my: 3 }} />

                <Typography variant="subtitle2" fontWeight={600} gutterBottom>Reply</Typography>
                <TextField
                  fullWidth
                  multiline
                  rows={4}
                  value={reply}
                  onChange={(e) => setReply(e.target.value)}
                  placeholder="Write your response..."
                  sx={{ mb: 2 }}
                />
                <Box sx={{ display: 'flex', gap: 1, justifyContent: 'flex-end' }}>
                  <Button variant="outlined">Mark as Resolved</Button>
                  <Button variant="contained" startIcon={<SendIcon />}>Send Reply</Button>
                </Box>
              </CardContent>
            </Card>
          ) : (
            <Card sx={{ height: 400, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Typography color="text.secondary">Select a ticket to view details</Typography>
            </Card>
          )}
        </Grid>
      </Grid>
    </Box>
  );
}
