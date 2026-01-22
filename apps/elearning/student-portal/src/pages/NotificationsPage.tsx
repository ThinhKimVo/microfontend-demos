import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Box,
  Container,
  Typography,
  Card,
  CardContent,
  Button,
  IconButton,
  Divider,
  Menu,
  MenuItem,
} from '@mui/material';
import {
  MoreVert as MoreIcon,
  School as CourseIcon,
  Campaign as AnnouncementIcon,
  Grade as GradeIcon,
  Event as DeadlineIcon,
  Message as MessageIcon,
  Info as SystemIcon,
  DoneAll as MarkAllIcon,
  Delete as DeleteIcon,
} from '@mui/icons-material';
import { notifications } from '../data/mockData';
import { Notification } from '../data/types';

const typeIcons: Record<Notification['type'], React.ElementType> = {
  course: CourseIcon,
  announcement: AnnouncementIcon,
  grade: GradeIcon,
  deadline: DeadlineIcon,
  message: MessageIcon,
  system: SystemIcon,
};

const typeColors: Record<Notification['type'], string> = {
  course: '#2563EB',
  announcement: '#7C3AED',
  grade: '#10B981',
  deadline: '#F59E0B',
  message: '#0EA5E9',
  system: '#64748B',
};

export default function NotificationsPage() {
  const [notifs, setNotifs] = useState(notifications);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedNotif, setSelectedNotif] = useState<string | null>(null);

  const unreadCount = notifs.filter(n => !n.isRead).length;

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>, notifId: string) => {
    setAnchorEl(event.currentTarget);
    setSelectedNotif(notifId);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedNotif(null);
  };

  const markAsRead = (notifId: string) => {
    setNotifs(prev =>
      prev.map(n => (n.id === notifId ? { ...n, isRead: true } : n))
    );
    handleMenuClose();
  };

  const markAllAsRead = () => {
    setNotifs(prev => prev.map(n => ({ ...n, isRead: true })));
  };

  const deleteNotification = (notifId: string) => {
    setNotifs(prev => prev.filter(n => n.id !== notifId));
    handleMenuClose();
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor(diff / (1000 * 60));

    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    if (days < 7) return `${days}d ago`;
    return date.toLocaleDateString();
  };

  return (
    <Box sx={{ bgcolor: 'grey.50', minHeight: '100vh', py: 4 }}>
      <Container maxWidth="md">
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
          <Box>
            <Typography variant="h4" fontWeight={700} gutterBottom>
              Notifications
            </Typography>
            <Typography variant="body1" color="text.secondary">
              {unreadCount} unread notification{unreadCount !== 1 ? 's' : ''}
            </Typography>
          </Box>
          {unreadCount > 0 && (
            <Button
              variant="outlined"
              startIcon={<MarkAllIcon />}
              onClick={markAllAsRead}
            >
              Mark All as Read
            </Button>
          )}
        </Box>

        <Card>
          {notifs.length > 0 ? (
            notifs.map((notif, index) => {
              const Icon = typeIcons[notif.type];
              const color = typeColors[notif.type];

              return (
                <Box key={notif.id}>
                  <Box
                    sx={{
                      display: 'flex',
                      gap: 2,
                      p: 2,
                      bgcolor: notif.isRead ? 'transparent' : 'primary.light',
                      '&:hover': { bgcolor: 'grey.50' },
                      cursor: notif.link ? 'pointer' : 'default',
                    }}
                    component={notif.link ? Link : 'div'}
                    to={notif.link || ''}
                    style={{ textDecoration: 'none', color: 'inherit' }}
                  >
                    <Box
                      sx={{
                        width: 44,
                        height: 44,
                        borderRadius: 2,
                        bgcolor: `${color}15`,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0,
                      }}
                    >
                      <Icon sx={{ color, fontSize: 22 }} />
                    </Box>

                    <Box sx={{ flex: 1, minWidth: 0 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                        <Typography
                          variant="subtitle2"
                          fontWeight={notif.isRead ? 500 : 600}
                        >
                          {notif.title}
                        </Typography>
                        {!notif.isRead && (
                          <Box
                            sx={{
                              width: 8,
                              height: 8,
                              borderRadius: '50%',
                              bgcolor: 'primary.main',
                            }}
                          />
                        )}
                      </Box>
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap',
                        }}
                      >
                        {notif.message}
                      </Typography>
                      <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5 }}>
                        {formatDate(notif.createdAt)}
                      </Typography>
                    </Box>

                    <IconButton
                      size="small"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        handleMenuOpen(e, notif.id);
                      }}
                    >
                      <MoreIcon />
                    </IconButton>
                  </Box>
                  {index < notifs.length - 1 && <Divider />}
                </Box>
              );
            })
          ) : (
            <CardContent sx={{ textAlign: 'center', py: 8 }}>
              <Typography variant="h6" gutterBottom>
                No notifications
              </Typography>
              <Typography variant="body2" color="text.secondary">
                You're all caught up!
              </Typography>
            </CardContent>
          )}
        </Card>

        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleMenuClose}
        >
          <MenuItem onClick={() => selectedNotif && markAsRead(selectedNotif)}>
            Mark as read
          </MenuItem>
          <MenuItem
            onClick={() => selectedNotif && deleteNotification(selectedNotif)}
            sx={{ color: 'error.main' }}
          >
            <DeleteIcon fontSize="small" sx={{ mr: 1 }} />
            Delete
          </MenuItem>
        </Menu>
      </Container>
    </Box>
  );
}
