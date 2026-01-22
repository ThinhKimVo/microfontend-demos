import { useState, useRef } from 'react';
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
  Snackbar,
  Alert,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import {
  Search as SearchIcon,
  Send as SendIcon,
  AttachFile as AttachIcon,
  MoreVert as MoreIcon,
  ArrowBack as ArrowBackIcon,
} from '@mui/icons-material';
import { messages, teachers } from '../data/mockData';

export default function MessagesPage() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedConversation, setSelectedConversation] = useState<string | null>(
    messages.length > 0 ? messages[0].recipientId : null
  );
  const [newMessage, setNewMessage] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [showChat, setShowChat] = useState(!isMobile);

  const handleSelectConversation = (id: string) => {
    setSelectedConversation(id);
    if (isMobile) setShowChat(true);
  };

  const handleBackToList = () => {
    setShowChat(false);
  };

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleMenuAction = (action: string) => {
    setSnackbarMessage(`${action} action triggered`);
    setSnackbarOpen(true);
    handleMenuClose();
  };

  const handleAttachClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSnackbarMessage(`File "${file.name}" selected`);
      setSnackbarOpen(true);
    }
  };

  // Get unique conversations
  const conversations = teachers.slice(0, 5).map(teacher => {
    const teacherMessages = messages.filter(
      m => m.recipientId === teacher.id || m.senderId === teacher.id
    );
    const lastMessage = teacherMessages[teacherMessages.length - 1];
    const unreadCount = teacherMessages.filter(m => !m.isRead && m.senderId === teacher.id).length;

    return {
      id: teacher.id,
      name: teacher.name,
      avatar: teacher.avatar,
      lastMessage: lastMessage?.content || 'Start a conversation',
      lastMessageTime: lastMessage?.createdAt || new Date().toISOString(),
      unreadCount,
      isOnline: Math.random() > 0.5,
    };
  });

  const filteredConversations = conversations.filter(c =>
    c.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const selectedTeacher = teachers.find(t => t.id === selectedConversation);
  const conversationMessages = messages.filter(
    m => m.recipientId === selectedConversation || m.senderId === selectedConversation
  );

  const handleSend = () => {
    if (!newMessage.trim()) return;
    // In real app, this would send the message
    setNewMessage('');
  };

  return (
    <Box sx={{ height: { xs: 'calc(100vh - 140px)', md: 'calc(100vh - 200px)' }, display: 'flex' }}>
      {/* Conversations List */}
      <Card
        sx={{
          width: { xs: '100%', md: 360 },
          flexShrink: 0,
          display: isMobile && showChat ? 'none' : 'flex',
          flexDirection: 'column',
        }}
      >
        <Box sx={{ p: 2 }}>
          <Typography variant="h6" fontWeight={600} gutterBottom>
            Messages
          </Typography>
          <TextField
            fullWidth
            size="small"
            placeholder="Search conversations..."
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
          {filteredConversations.map((conversation) => (
            <ListItem
              key={conversation.id}
              component="div"
              onClick={() => handleSelectConversation(conversation.id)}
              sx={{
                cursor: 'pointer',
                bgcolor: selectedConversation === conversation.id ? 'primary.light' : 'transparent',
                '&:hover': { bgcolor: 'grey.50' },
              }}
            >
              <ListItemAvatar>
                <Badge
                  overlap="circular"
                  anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                  variant="dot"
                  color={conversation.isOnline ? 'success' : 'default'}
                >
                  <Avatar src={conversation.avatar}>{conversation.name[0]}</Avatar>
                </Badge>
              </ListItemAvatar>
              <ListItemText
                primary={
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography variant="subtitle2" fontWeight={600}>
                      {conversation.name}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {new Date(conversation.lastMessageTime).toLocaleDateString()}
                    </Typography>
                  </Box>
                }
                secondary={
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                        maxWidth: 180,
                      }}
                    >
                      {conversation.lastMessage}
                    </Typography>
                    {conversation.unreadCount > 0 && (
                      <Chip
                        label={conversation.unreadCount}
                        size="small"
                        color="primary"
                        sx={{ height: 20, minWidth: 20 }}
                      />
                    )}
                  </Box>
                }
              />
            </ListItem>
          ))}
        </List>
      </Card>

      {/* Chat Area */}
      <Box
        sx={{
          flex: 1,
          display: isMobile && !showChat ? 'none' : 'flex',
          flexDirection: 'column',
          ml: { xs: 0, md: 2 },
        }}
      >
        {selectedTeacher ? (
          <Card sx={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
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
              <Avatar src={selectedTeacher.avatar} sx={{ mr: 2 }}>
                {selectedTeacher.name[0]}
              </Avatar>
              <Box sx={{ flex: 1 }}>
                <Typography variant="subtitle1" fontWeight={600}>
                  {selectedTeacher.name}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {selectedTeacher.title}
                </Typography>
              </Box>
              <IconButton onClick={handleMenuOpen}>
                <MoreIcon />
              </IconButton>
              <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleMenuClose}
              >
                <MenuItem onClick={() => handleMenuAction('View profile')}>View Profile</MenuItem>
                <MenuItem onClick={() => handleMenuAction('Clear chat')}>Clear Chat</MenuItem>
                <MenuItem onClick={() => handleMenuAction('Block user')}>Block User</MenuItem>
              </Menu>
            </Box>

            {/* Messages */}
            <Box sx={{ flex: 1, overflow: 'auto', p: 2, bgcolor: 'grey.50' }}>
              {conversationMessages.map((message) => {
                const isMe = message.senderId !== selectedConversation;
                return (
                  <Box
                    key={message.id}
                    sx={{
                      display: 'flex',
                      justifyContent: isMe ? 'flex-end' : 'flex-start',
                      mb: 2,
                    }}
                  >
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
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileSelect}
                style={{ display: 'none' }}
              />
              <IconButton onClick={handleAttachClick}>
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
        ) : (
          <Card
            sx={{
              flex: 1,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Typography color="text.secondary">
              Select a conversation to start messaging
            </Typography>
          </Card>
        )}
      </Box>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={() => setSnackbarOpen(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={() => setSnackbarOpen(false)} severity="info" sx={{ width: '100%' }}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
}
