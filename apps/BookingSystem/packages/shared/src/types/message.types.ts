export type MessageType = 'text' | 'image' | 'system' | 'booking_request' | 'booking_confirmed' | 'booking_cancelled';

export interface Message {
  id: string;
  conversationId: string;
  senderId: string;
  senderName: string;
  senderPhoto?: string;
  content: string;
  messageType: MessageType;
  attachmentUrl?: string;
  isRead: boolean;
  readAt?: string;
  createdAt: string;
}

export interface Conversation {
  id: string;
  propertyId: string;
  propertyTitle: string;
  propertyPhoto: string;
  bookingId?: string;
  participants: ConversationParticipant[];
  lastMessage?: Message;
  unreadCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface ConversationParticipant {
  userId: string;
  name: string;
  photo?: string;
  role: 'guest' | 'host';
  isOnline?: boolean;
  lastSeenAt?: string;
}

export interface MessageTemplate {
  id: string;
  titleEn: string;
  titleAr: string;
  contentEn: string;
  contentAr: string;
  category: 'check_in' | 'check_out' | 'welcome' | 'directions' | 'custom';
}

export interface SendMessageRequest {
  conversationId: string;
  content: string;
  messageType?: MessageType;
  attachmentUrl?: string;
}

export interface StartConversationRequest {
  propertyId: string;
  recipientId: string;
  initialMessage: string;
  bookingId?: string;
}
