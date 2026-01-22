import { Message, Conversation, MessageTemplate } from '../types';

export const mockConversations: Conversation[] = [
  {
    id: 'conv-001',
    propertyId: 'prop-001',
    propertyTitle: 'Luxury Villa with Private Pool in Al Olaya',
    propertyPhoto: 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=800',
    bookingId: 'book-001',
    participants: [
      {
        userId: 'user-001',
        name: 'Ahmed Al-Rashid',
        photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200',
        role: 'guest',
        isOnline: false,
        lastSeenAt: '2026-01-10T08:30:00Z',
      },
      {
        userId: 'user-003',
        name: 'Mohammed Al-Saud',
        photo: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200',
        role: 'host',
        isOnline: true,
      },
    ],
    lastMessage: {
      id: 'msg-005',
      conversationId: 'conv-001',
      senderId: 'user-003',
      senderName: 'Mohammed Al-Saud',
      content: 'Perfect! See you on the 20th. Safe travels!',
      messageType: 'text',
      isRead: true,
      readAt: '2026-01-10T09:00:00Z',
      createdAt: '2026-01-10T08:45:00Z',
    },
    unreadCount: 0,
    createdAt: '2026-01-05T14:30:00Z',
    updatedAt: '2026-01-10T08:45:00Z',
  },
  {
    id: 'conv-002',
    propertyId: 'prop-002',
    propertyTitle: 'Modern Apartment with Burj Khalifa View',
    propertyPhoto: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800',
    bookingId: 'book-002',
    participants: [
      {
        userId: 'user-001',
        name: 'Ahmed Al-Rashid',
        photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200',
        role: 'guest',
        isOnline: false,
      },
      {
        userId: 'user-002',
        name: 'Fatima Al-Maktoum',
        photo: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200',
        role: 'host',
        isOnline: true,
      },
    ],
    lastMessage: {
      id: 'msg-010',
      conversationId: 'conv-002',
      senderId: 'user-002',
      senderName: 'Fatima Al-Maktoum',
      content: 'Hi Ahmed! Thank you for your booking request. I\'d be happy to host you. Could you tell me a bit more about the occasion?',
      messageType: 'text',
      isRead: false,
      createdAt: '2026-01-10T10:15:00Z',
    },
    unreadCount: 1,
    createdAt: '2026-01-10T09:15:00Z',
    updatedAt: '2026-01-10T10:15:00Z',
  },
];

export const mockMessages: Message[] = [
  // Conversation 1 messages
  {
    id: 'msg-001',
    conversationId: 'conv-001',
    senderId: 'user-001',
    senderName: 'Ahmed Al-Rashid',
    content: 'Hi Mohammed! I just booked your villa for our family trip. Looking forward to it!',
    messageType: 'text',
    isRead: true,
    readAt: '2026-01-05T15:00:00Z',
    createdAt: '2026-01-05T14:35:00Z',
  },
  {
    id: 'msg-002',
    conversationId: 'conv-001',
    senderId: 'user-003',
    senderName: 'Mohammed Al-Saud',
    senderPhoto: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200',
    content: 'Welcome Ahmed! Thank you for booking. I\'m excited to host you and your family. Is there anything specific you need for your stay?',
    messageType: 'text',
    isRead: true,
    readAt: '2026-01-05T16:00:00Z',
    createdAt: '2026-01-05T15:30:00Z',
  },
  {
    id: 'msg-003',
    conversationId: 'conv-001',
    senderId: 'user-001',
    senderName: 'Ahmed Al-Rashid',
    content: 'Thanks! We have 2 young children (ages 4 and 6). Is the pool safe for kids?',
    messageType: 'text',
    isRead: true,
    readAt: '2026-01-05T17:00:00Z',
    createdAt: '2026-01-05T16:30:00Z',
  },
  {
    id: 'msg-004',
    conversationId: 'conv-001',
    senderId: 'user-003',
    senderName: 'Mohammed Al-Saud',
    senderPhoto: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200',
    content: 'Yes, absolutely! The pool has a shallow end perfect for children. I also have pool floats and life jackets available. I\'ll make sure they\'re ready for your arrival.',
    messageType: 'text',
    isRead: true,
    readAt: '2026-01-06T08:00:00Z',
    createdAt: '2026-01-05T18:00:00Z',
  },
  {
    id: 'msg-005',
    conversationId: 'conv-001',
    senderId: 'user-003',
    senderName: 'Mohammed Al-Saud',
    senderPhoto: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200',
    content: 'Perfect! See you on the 20th. Safe travels!',
    messageType: 'text',
    isRead: true,
    readAt: '2026-01-10T09:00:00Z',
    createdAt: '2026-01-10T08:45:00Z',
  },
  // Conversation 2 messages
  {
    id: 'msg-006',
    conversationId: 'conv-002',
    senderId: 'user-001',
    senderName: 'Ahmed Al-Rashid',
    content: 'Hi Fatima! I\'m interested in booking your apartment for February 10-15. We\'re celebrating our anniversary!',
    messageType: 'text',
    isRead: true,
    readAt: '2026-01-10T09:30:00Z',
    createdAt: '2026-01-10T09:15:00Z',
  },
  {
    id: 'msg-010',
    conversationId: 'conv-002',
    senderId: 'user-002',
    senderName: 'Fatima Al-Maktoum',
    senderPhoto: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200',
    content: 'Hi Ahmed! Thank you for your booking request. I\'d be happy to host you. Could you tell me a bit more about the occasion?',
    messageType: 'text',
    isRead: false,
    createdAt: '2026-01-10T10:15:00Z',
  },
];

export const mockMessageTemplates: MessageTemplate[] = [
  {
    id: 'tmpl-001',
    titleEn: 'Welcome Message',
    titleAr: 'رسالة الترحيب',
    contentEn: 'Welcome to our property! We hope you have a wonderful stay. If you need anything, please don\'t hesitate to reach out.',
    contentAr: 'مرحباً بك في عقارنا! نأمل أن تستمتع بإقامتك. إذا احتجت أي شيء، لا تتردد في التواصل معنا.',
    category: 'welcome',
  },
  {
    id: 'tmpl-002',
    titleEn: 'Check-in Instructions',
    titleAr: 'تعليمات تسجيل الوصول',
    contentEn: 'Here are your check-in instructions:\n\n1. Arrive at the property address\n2. Use the smart lock code: [CODE]\n3. The code is active from 3 PM on your check-in day\n\nWelcome!',
    contentAr: 'إليك تعليمات تسجيل الوصول:\n\n1. الوصول إلى عنوان العقار\n2. استخدم رمز القفل الذكي: [الرمز]\n3. الرمز نشط من الساعة 3 مساءً في يوم الوصول\n\nأهلاً بك!',
    category: 'check_in',
  },
  {
    id: 'tmpl-003',
    titleEn: 'Check-out Reminder',
    titleAr: 'تذكير بتسجيل المغادرة',
    contentEn: 'Hi! Just a friendly reminder that check-out is at [TIME]. Please leave the keys on the kitchen counter. Thank you for staying with us!',
    contentAr: 'مرحباً! مجرد تذكير ودي بأن تسجيل المغادرة في الساعة [الوقت]. يرجى ترك المفاتيح على طاولة المطبخ. شكراً لإقامتك معنا!',
    category: 'check_out',
  },
  {
    id: 'tmpl-004',
    titleEn: 'Directions',
    titleAr: 'الاتجاهات',
    contentEn: 'Here are directions to the property:\n\n[DIRECTIONS]\n\nIf you have any trouble finding us, please call or message.',
    contentAr: 'إليك الاتجاهات للعقار:\n\n[الاتجاهات]\n\nإذا واجهت صعوبة في إيجادنا، يرجى الاتصال أو المراسلة.',
    category: 'directions',
  },
];

export const getConversationsByUser = (userId: string): Conversation[] => {
  return mockConversations.filter((conv) =>
    conv.participants.some((p) => p.userId === userId)
  );
};

export const getMessagesByConversation = (conversationId: string): Message[] => {
  return mockMessages.filter((msg) => msg.conversationId === conversationId);
};

export const getConversationById = (id: string): Conversation | undefined => {
  return mockConversations.find((conv) => conv.id === id);
};

export const getUnreadCount = (userId: string): number => {
  return mockConversations
    .filter((conv) => conv.participants.some((p) => p.userId === userId))
    .reduce((total, conv) => {
      const lastMsg = conv.lastMessage;
      if (lastMsg && lastMsg.senderId !== userId && !lastMsg.isRead) {
        return total + 1;
      }
      return total;
    }, 0);
};
