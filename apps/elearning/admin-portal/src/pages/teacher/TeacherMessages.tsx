import { useState } from 'react';
import {
  Box,
  Typography,
  Card,
  TextField,
  Button,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Avatar,
  Divider,
  Badge,
  InputAdornment,
  IconButton,
  Chip,
  Menu,
  MenuItem,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import {
  Search as SearchIcon,
  Send as SendIcon,
  AttachFile as AttachIcon,
  MoreVert as MoreIcon,
  PushPin as PinIcon,
  Delete as DeleteIcon,
  MarkEmailRead as ReadIcon,
  ArrowBack as ArrowBackIcon,
} from '@mui/icons-material';

// Mock data for messages
const mockStudents = [
  { id: '1', name: 'John Smith', avatar: '', course: 'React Masterclass', unread: 2, isOnline: true },
  { id: '2', name: 'Emma Wilson', avatar: '', course: 'JavaScript Basics', unread: 0, isOnline: false },
  { id: '3', name: 'Michael Brown', avatar: '', course: 'React Masterclass', unread: 1, isOnline: true },
  { id: '4', name: 'Sarah Davis', avatar: '', course: 'Node.js Course', unread: 0, isOnline: false },
  { id: '5', name: 'James Johnson', avatar: '', course: 'React Masterclass', unread: 0, isOnline: true },
];

const mockMessages = [
  { id: '1', senderId: '1', content: 'Hi, I have a question about the React hooks lesson.', createdAt: '2024-01-15T10:30:00Z' },
  { id: '2', senderId: 'me', content: 'Sure, what would you like to know?', createdAt: '2024-01-15T10:35:00Z' },
  { id: '3', senderId: '1', content: 'I\'m confused about the useEffect cleanup function. When should I use it?', createdAt: '2024-01-15T10:40:00Z' },
  { id: '4', senderId: 'me', content: 'Great question! The cleanup function is used to prevent memory leaks. You should use it when your effect sets up a subscription, timer, or any other resource that needs to be cleaned up when the component unmounts.', createdAt: '2024-01-15T10:45:00Z' },
  { id: '5', senderId: '1', content: 'That makes sense! Thank you for the explanation.', createdAt: '2024-01-15T10:50:00Z' },
];

export default function TeacherMessages() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [selectedStudent, setSelectedStudent] = useState<string | null>(mockStudents[0].id);
  const [newMessage, setNewMessage] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [showChat, setShowChat] = useState(!isMobile);

  const handleSelectStudent = (id: string) => {
    setSelectedStudent(id);
    if (isMobile) setShowChat(true);
  };

  const handleBackToList = () => {
    setShowChat(false);
  };

  const filteredStudents = mockStudents.filter(s =>
    s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.course.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const student = mockStudents.find(s => s.id === selectedStudent);

  const handleSend = () => {
    if (!newMessage.trim()) return;
    // In real app, this would send the message
    setNewMessage('');
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  return (
    <Box>
      <Typography variant="h4" fontWeight={700} sx={{ mb: 3 }}>Messages</Typography>

      <Box sx={{ height: 'calc(100vh - 200px)', display: 'flex', gap: { xs: 0, md: 2 } }}>
        {/* Student List */}
        <Card
          sx={{
            width: { xs: '100%', md: 360 },
            flexShrink: 0,
            display: isMobile && showChat ? 'none' : 'flex',
            flexDirection: 'column',
          }}
        >
          <Box sx={{ p: 2 }}>
            <TextField
              fullWidth
              size="small"
              placeholder="Search students or courses..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              slotProps={{
                input: {
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon fontSize="small" />
                    </InputAdornment>
                  ),
                },
              }}
            />
          </Box>

          <Divider />

          <List sx={{ flex: 1, overflow: 'auto' }}>
            {filteredStudents.map((s) => (
              <ListItem
                key={s.id}
                component="div"
                onClick={() => handleSelectStudent(s.id)}
                sx={{
                  cursor: 'pointer',
                  bgcolor: selectedStudent === s.id ? 'primary.light' : 'transparent',
                  '&:hover': { bgcolor: 'grey.50' },
                }}
              >
                <ListItemAvatar>
                  <Badge
                    overlap="circular"
                    anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                    variant="dot"
                    color={s.isOnline ? 'success' : 'default'}
                  >
                    <Avatar src={s.avatar}>{s.name[0]}</Avatar>
                  </Badge>
                </ListItemAvatar>
                <ListItemText
                  primary={
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Typography variant="subtitle2" fontWeight={600}>
                        {s.name}
                      </Typography>
                      {s.unread > 0 && (
                        <Chip
                          label={s.unread}
                          size="small"
                          color="primary"
                          sx={{ height: 20, minWidth: 20 }}
                        />
                      )}
                    </Box>
                  }
                  secondary={
                    <Typography variant="body2" color="text.secondary">
                      {s.course}
                    </Typography>
                  }
                />
              </ListItem>
            ))}
          </List>
        </Card>

        {/* Chat Area */}
        {student ? (
          <Card
            sx={{
              flex: 1,
              display: isMobile && !showChat ? 'none' : 'flex',
              flexDirection: 'column',
            }}
          >
            {/* Chat Header */}
            <Box
              sx={{
                p: 2,
                borderBottom: '1px solid',
                borderColor: 'grey.200',
                display: 'flex',
                alignItems: 'center',
              }}
            >
              {isMobile && (
                <IconButton onClick={handleBackToList} sx={{ mr: 1 }}>
                  <ArrowBackIcon />
                </IconButton>
              )}
              <Badge
                overlap="circular"
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                variant="dot"
                color={student.isOnline ? 'success' : 'default'}
              >
                <Avatar src={student.avatar} sx={{ mr: 2 }}>
                  {student.name[0]}
                </Avatar>
              </Badge>
              <Box sx={{ flex: 1 }}>
                <Typography variant="subtitle1" fontWeight={600}>
                  {student.name}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {student.course} {student.isOnline && '• Online'}
                </Typography>
              </Box>
              <IconButton onClick={(e) => setAnchorEl(e.currentTarget)}>
                <MoreIcon />
              </IconButton>
              <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleMenuClose}
              >
                <MenuItem onClick={handleMenuClose}>
                  <PinIcon fontSize="small" sx={{ mr: 1 }} /> Pin Conversation
                </MenuItem>
                <MenuItem onClick={handleMenuClose}>
                  <ReadIcon fontSize="small" sx={{ mr: 1 }} /> Mark as Read
                </MenuItem>
                <MenuItem onClick={handleMenuClose} sx={{ color: 'error.main' }}>
                  <DeleteIcon fontSize="small" sx={{ mr: 1 }} /> Delete Conversation
                </MenuItem>
              </Menu>
            </Box>

            {/* Messages */}
            <Box sx={{ flex: 1, overflow: 'auto', p: 2, bgcolor: 'grey.50' }}>
              {mockMessages.map((message) => {
                const isMe = message.senderId === 'me';
                return (
                  <Box
                    key={message.id}
                    sx={{
                      display: 'flex',
                      justifyContent: isMe ? 'flex-end' : 'flex-start',
                      mb: 2,
                    }}
                  >
                    {!isMe && (
                      <Avatar sx={{ width: 32, height: 32, mr: 1 }}>
                        {student.name[0]}
                      </Avatar>
                    )}
                    <Box
                      sx={{
                        maxWidth: '70%',
                        p: 2,
                        borderRadius: 2,
                        bgcolor: isMe ? 'primary.main' : 'white',
                        color: isMe ? 'white' : 'text.primary',
                        boxShadow: 1,
                      }}
                    >
                      <Typography variant="body2">{message.content}</Typography>
                      <Typography
                        variant="caption"
                        sx={{
                          display: 'block',
                          mt: 0.5,
                          opacity: 0.7,
                          textAlign: 'right',
                        }}
                      >
                        {new Date(message.createdAt).toLocaleTimeString([], {
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </Typography>
                    </Box>
                  </Box>
                );
              })}
            </Box>

            {/* Quick Replies */}
            <Box sx={{ px: 2, py: 1, borderTop: '1px solid', borderColor: 'grey.200', display: { xs: 'none', sm: 'block' } }}>
              <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                <Chip
                  label="Thank you for your question!"
                  size="small"
                  variant="outlined"
                  onClick={() => setNewMessage('Thank you for your question!')}
                  sx={{ cursor: 'pointer' }}
                />
                <Chip
                  label="Please check the lesson notes"
                  size="small"
                  variant="outlined"
                  onClick={() => setNewMessage('Please check the lesson notes for more details.')}
                  sx={{ cursor: 'pointer' }}
                />
                <Chip
                  label="I'll get back to you soon"
                  size="small"
                  variant="outlined"
                  onClick={() => setNewMessage("I'll review this and get back to you soon.")}
                  sx={{ cursor: 'pointer' }}
                />
              </Box>
            </Box>

            {/* Input Area */}
            <Box
              sx={{
                p: 2,
                borderTop: '1px solid',
                borderColor: 'grey.200',
                display: 'flex',
                alignItems: 'center',
                gap: 1,
              }}
            >
              <IconButton>
                <AttachIcon />
              </IconButton>
              <TextField
                fullWidth
                size="small"
                placeholder="Type a message..."
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === 'Enter') handleSend();
                }}
                multiline
                maxRows={3}
              />
              <Button
                variant="contained"
                onClick={handleSend}
                disabled={!newMessage.trim()}
                sx={{ minWidth: { xs: 44, md: 'auto' } }}
              >
                {isMobile ? <SendIcon /> : <>Send<SendIcon sx={{ ml: 1 }} /></>}
              </Button>
            </Box>
          </Card>
        ) : !isMobile ? (
          <Card
            sx={{
              flex: 1,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Typography color="text.secondary">
              Select a student to start messaging
            </Typography>
          </Card>
        ) : null}
      </Box>
    </Box>
  );
}
