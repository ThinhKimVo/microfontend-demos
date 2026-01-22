import React, { useState } from 'react';
import { Navigate } from 'react-router-dom';
import {
  Box,
  Container,
  Typography,
  Grid2 as Grid,
  Paper,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Avatar,
  TextField,
  IconButton,
  Divider,
  Badge,
  InputAdornment,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import {
  Send,
  Search,
  ArrowBack,
  MoreVert,
} from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import { mockConversations, mockMessages } from '@staygcc/shared/mock-data';
import { useAuth } from '../../contexts/AuthContext';
import { useLocale } from '../../contexts/LocaleContext';
import { formatDate } from '@staygcc/shared/utils';

const MessagesPage: React.FC = () => {
  const { t } = useTranslation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const { isAuthenticated, user } = useAuth();
  const { language } = useLocale();

  const [selectedConversation, setSelectedConversation] = useState<string | null>(
    isMobile ? null : mockConversations[0]?.id || null
  );
  const [newMessage, setNewMessage] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  const conversations = mockConversations;
  const getHostParticipant = (conv: typeof mockConversations[0]) =>
    conv.participants.find(p => p.role === 'host');
  const filteredConversations = conversations.filter((conv) => {
    const host = getHostParticipant(conv);
    return host?.name.toLowerCase().includes(searchQuery.toLowerCase());
  });

  const selectedConv = conversations.find((c) => c.id === selectedConversation);
  const messages = selectedConversation
    ? mockMessages.filter((m) => m.conversationId === selectedConversation)
    : [];

  const handleSendMessage = () => {
    if (!newMessage.trim()) return;
    // In a real app, this would send the message
    setNewMessage('');
  };

  const handleSelectConversation = (convId: string) => {
    setSelectedConversation(convId);
  };

  const handleBack = () => {
    setSelectedConversation(null);
  };

  const ConversationList = () => (
    <Paper sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <Box sx={{ p: 2 }}>
        <Typography variant="h6" fontWeight={600} gutterBottom>
          {t('common:messages.title')}
        </Typography>
        <TextField
          fullWidth
          size="small"
          placeholder={t('common:messages.searchPlaceholder')}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Search color="action" />
              </InputAdornment>
            ),
          }}
        />
      </Box>
      <Divider />
      <List sx={{ flex: 1, overflow: 'auto' }}>
        {filteredConversations.length === 0 ? (
          <Box sx={{ p: 4, textAlign: 'center' }}>
            <Typography variant="body2" color="text.secondary">
              {t('common:messages.noConversations')}
            </Typography>
          </Box>
        ) : (
          filteredConversations.map((conv) => {
            const host = getHostParticipant(conv);
            return (
              <ListItem
                key={conv.id}
                component="div"
                onClick={() => handleSelectConversation(conv.id)}
                sx={{
                  cursor: 'pointer',
                  backgroundColor:
                    selectedConversation === conv.id ? 'action.selected' : 'transparent',
                  '&:hover': {
                    backgroundColor: 'action.hover',
                  },
                }}
              >
                <ListItemAvatar>
                  <Badge
                    color="primary"
                    badgeContent={conv.unreadCount}
                    invisible={conv.unreadCount === 0}
                  >
                    <Avatar src={host?.photo}>
                      {host?.name.charAt(0)}
                    </Avatar>
                  </Badge>
                </ListItemAvatar>
                <ListItemText
                  primary={
                    <Typography variant="subtitle2" fontWeight={conv.unreadCount > 0 ? 600 : 400}>
                      {host?.name}
                    </Typography>
                  }
                  secondary={
                    <Box>
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap',
                        }}
                      >
                        {conv.lastMessage?.content}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {formatDate(conv.updatedAt, 'PP', language)}
                      </Typography>
                    </Box>
                  }
                />
              </ListItem>
            );
          })
        )}
      </List>
    </Paper>
  );

  const ChatArea = () => {
    const selectedHost = selectedConv ? getHostParticipant(selectedConv) : null;
    return (
    <Paper sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      {selectedConv ? (
        <>
          {/* Chat Header */}
          <Box
            sx={{
              p: 2,
              display: 'flex',
              alignItems: 'center',
              gap: 2,
              borderBottom: '1px solid',
              borderColor: 'divider',
            }}
          >
            {isMobile && (
              <IconButton onClick={handleBack}>
                <ArrowBack />
              </IconButton>
            )}
            <Avatar src={selectedHost?.photo}>
              {selectedHost?.name.charAt(0)}
            </Avatar>
            <Box sx={{ flex: 1 }}>
              <Typography variant="subtitle1" fontWeight={600}>
                {selectedHost?.name}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {selectedConv.propertyTitle}
              </Typography>
            </Box>
            <IconButton>
              <MoreVert />
            </IconButton>
          </Box>

          {/* Messages */}
          <Box sx={{ flex: 1, overflow: 'auto', p: 2 }}>
            {messages.map((message) => {
              const isOwn = message.senderId === user?.id;
              return (
                <Box
                  key={message.id}
                  sx={{
                    display: 'flex',
                    justifyContent: isOwn ? 'flex-end' : 'flex-start',
                    mb: 2,
                  }}
                >
                  <Box
                    sx={{
                      maxWidth: '70%',
                      backgroundColor: isOwn ? 'primary.main' : 'grey.100',
                      color: isOwn ? 'white' : 'text.primary',
                      borderRadius: 2,
                      px: 2,
                      py: 1,
                    }}
                  >
                    <Typography variant="body2">{message.content}</Typography>
                    <Typography
                      variant="caption"
                      sx={{
                        display: 'block',
                        textAlign: 'right',
                        mt: 0.5,
                        opacity: 0.7,
                      }}
                    >
                      {formatDate(message.createdAt, 'p', language)}
                    </Typography>
                  </Box>
                </Box>
              );
            })}
          </Box>

          {/* Message Input */}
          <Box
            sx={{
              p: 2,
              borderTop: '1px solid',
              borderColor: 'divider',
            }}
          >
            <TextField
              fullWidth
              placeholder={t('common:messages.typePlaceholder')}
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      color="primary"
                      onClick={handleSendMessage}
                      disabled={!newMessage.trim()}
                    >
                      <Send />
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
          </Box>
        </>
      ) : (
        <Box
          sx={{
            flex: 1,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Typography variant="body1" color="text.secondary">
            {t('common:messages.selectConversation')}
          </Typography>
        </Box>
      )}
    </Paper>
  );
  };

  // Mobile view: show either list or chat
  if (isMobile) {
    return (
      <Box sx={{ height: 'calc(100vh - 112px)' }}>
        {selectedConversation ? <ChatArea /> : <ConversationList />}
      </Box>
    );
  }

  // Desktop view: show both
  return (
    <Container maxWidth="lg" sx={{ py: 4, height: 'calc(100vh - 160px)' }}>
      <Grid container spacing={3} sx={{ height: '100%' }}>
        <Grid size={{ xs: 12, md: 4 }} sx={{ height: '100%' }}>
          <ConversationList />
        </Grid>
        <Grid size={{ xs: 12, md: 8 }} sx={{ height: '100%' }}>
          <ChatArea />
        </Grid>
      </Grid>
    </Container>
  );
};

export default MessagesPage;
