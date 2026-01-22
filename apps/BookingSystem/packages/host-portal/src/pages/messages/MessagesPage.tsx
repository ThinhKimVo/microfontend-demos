import React, { useState } from 'react';
import {
  Box,
  Typography,
  Paper,
  Grid2 as Grid,
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
  Chip,
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
  const { host } = useAuth();
  const { language } = useLocale();

  const [selectedConversation, setSelectedConversation] = useState<string | null>(
    isMobile ? null : mockConversations[0]?.id || null
  );
  const [newMessage, setNewMessage] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  const conversations = mockConversations;
  const getGuestParticipant = (conv: typeof mockConversations[0]) =>
    conv.participants.find(p => p.role === 'guest');
  const filteredConversations = conversations.filter((conv) => {
    const guest = getGuestParticipant(conv);
    return guest?.name.toLowerCase().includes(searchQuery.toLowerCase());
  });

  const selectedConv = conversations.find((c) => c.id === selectedConversation);
  const messages = selectedConversation
    ? mockMessages.filter((m) => m.conversationId === selectedConversation)
    : [];

  const handleSendMessage = () => {
    if (!newMessage.trim()) return;
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
          {t('messages:title')}
        </Typography>
        <TextField
          fullWidth
          size="small"
          placeholder={t('messages:searchPlaceholder')}
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
              {t('messages:noConversations')}
            </Typography>
          </Box>
        ) : (
          filteredConversations.map((conv) => {
            const guest = getGuestParticipant(conv);
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
                    <Avatar src={guest?.photo}>
                      {guest?.name.charAt(0)}
                    </Avatar>
                  </Badge>
                </ListItemAvatar>
                <ListItemText
                  primary={
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Typography variant="subtitle2" fontWeight={conv.unreadCount > 0 ? 600 : 400}>
                        {guest?.name}
                      </Typography>
                      <Chip size="small" label={t('host:messages.guest')} sx={{ height: 20, fontSize: '0.65rem' }} />
                    </Box>
                  }
                  secondary={
                    <Box>
                      <Typography variant="caption" color="text.secondary" display="block">
                        {conv.propertyTitle}
                      </Typography>
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
                    </Box>
                  }
                />
                <Typography variant="caption" color="text.secondary">
                  {formatDate(conv.updatedAt, 'PP', language)}
                </Typography>
              </ListItem>
            );
          })
        )}
      </List>
    </Paper>
  );

  const ChatArea = () => {
    const selectedGuest = selectedConv ? getGuestParticipant(selectedConv) : null;
    return (
    <Paper sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      {selectedConv ? (
        <>
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
            <Avatar src={selectedGuest?.photo}>
              {selectedGuest?.name.charAt(0)}
            </Avatar>
            <Box sx={{ flex: 1 }}>
              <Typography variant="subtitle1" fontWeight={600}>
                {selectedGuest?.name}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {selectedConv.propertyTitle}
              </Typography>
            </Box>
            <IconButton>
              <MoreVert />
            </IconButton>
          </Box>

          <Box sx={{ flex: 1, overflow: 'auto', p: 2 }}>
            {messages.map((message) => {
              const isOwn = message.senderId === host?.id;
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

          <Box
            sx={{
              p: 2,
              borderTop: '1px solid',
              borderColor: 'divider',
            }}
          >
            <TextField
              fullWidth
              placeholder={t('messages:typePlaceholder')}
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
            {t('messages:selectConversation')}
          </Typography>
        </Box>
      )}
    </Paper>
  );
  };

  if (isMobile) {
    return (
      <Box sx={{ height: 'calc(100vh - 140px)' }}>
        {selectedConversation ? <ChatArea /> : <ConversationList />}
      </Box>
    );
  }

  return (
    <Box>
      <Typography variant="h4" fontWeight={600} sx={{ mb: 4 }}>
        {t('host:navigation.messages')}
      </Typography>
      <Grid container spacing={3} sx={{ height: 'calc(100vh - 220px)' }}>
        <Grid size={{ xs: 12, md: 4 }} sx={{ height: '100%' }}>
          <ConversationList />
        </Grid>
        <Grid size={{ xs: 12, md: 8 }} sx={{ height: '100%' }}>
          <ChatArea />
        </Grid>
      </Grid>
    </Box>
  );
};

export default MessagesPage;
