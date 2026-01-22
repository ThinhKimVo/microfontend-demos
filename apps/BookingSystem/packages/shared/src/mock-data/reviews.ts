import { Review, ReviewSummary } from '../types';

export const mockReviews: Review[] = [
  {
    id: 'rev-001',
    bookingId: 'book-003',
    propertyId: 'prop-004',
    reviewerId: 'user-001',
    reviewerName: 'Ahmed Al-Rashid',
    reviewerPhoto: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200',
    revieweeId: 'user-002',
    reviewerType: 'guest',
    ratings: {
      overall: 5,
      cleanliness: 5,
      accuracy: 5,
      communication: 5,
      location: 5,
      checkIn: 5,
      value: 4,
    },
    content: 'Amazing stay! The views of JBR beach were stunning, and the apartment was exactly as described. Fatima was very responsive and helpful throughout our stay. Would definitely recommend!',
    response: 'Thank you so much for your kind words, Ahmed! It was a pleasure hosting you. You were a wonderful guest, and we hope to see you again soon!',
    responseAt: '2025-12-28T10:00:00Z',
    status: 'published',
    createdAt: '2025-12-26T14:00:00Z',
    publishedAt: '2025-12-26T14:30:00Z',
  },
  {
    id: 'rev-002',
    bookingId: 'book-004',
    propertyId: 'prop-003',
    reviewerId: 'user-001',
    reviewerName: 'Ahmed Al-Rashid',
    reviewerPhoto: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200',
    revieweeId: 'user-003',
    reviewerType: 'guest',
    ratings: {
      overall: 5,
      cleanliness: 5,
      accuracy: 5,
      communication: 5,
      location: 5,
      checkIn: 5,
      value: 5,
    },
    content: 'An unforgettable experience! The desert camp was magical - the traditional dinner, stargazing, and the hospitality were beyond our expectations. Mohammed and his team made us feel like royalty. A must-visit!',
    photos: [
      'https://images.unsplash.com/photo-1504851149312-7a075b496cc7?w=400',
      'https://images.unsplash.com/photo-1498889444388-e67ea62c464b?w=400',
    ],
    response: 'Thank you Ahmed for this wonderful review! We are so happy that you and your family enjoyed the AlUla experience. The traditional dinner was specially prepared for you. Looking forward to hosting you again!',
    responseAt: '2025-11-20T11:00:00Z',
    status: 'published',
    createdAt: '2025-11-18T16:00:00Z',
    publishedAt: '2025-11-18T16:30:00Z',
  },
  {
    id: 'rev-003',
    bookingId: 'book-006',
    propertyId: 'prop-001',
    reviewerId: 'user-004',
    reviewerName: 'Sarah Johnson',
    reviewerPhoto: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200',
    revieweeId: 'user-003',
    reviewerType: 'guest',
    ratings: {
      overall: 5,
      cleanliness: 5,
      accuracy: 5,
      communication: 5,
      location: 4,
      checkIn: 5,
      value: 5,
    },
    content: 'What a beautiful villa! The pool was perfect for our family, and the kids loved it. Everything was spotlessly clean and well-maintained. The location is convenient for exploring Riyadh.',
    status: 'published',
    createdAt: '2025-09-20T10:00:00Z',
    publishedAt: '2025-09-20T10:30:00Z',
  },
  {
    id: 'rev-004',
    bookingId: 'book-007',
    propertyId: 'prop-002',
    reviewerId: 'user-005',
    reviewerName: 'Omar Hassan',
    reviewerPhoto: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200',
    revieweeId: 'user-002',
    reviewerType: 'guest',
    ratings: {
      overall: 4,
      cleanliness: 5,
      accuracy: 4,
      communication: 5,
      location: 5,
      checkIn: 4,
      value: 4,
    },
    content: 'Great location in Downtown Dubai. The Burj Khalifa view was amazing, especially at night. The apartment was clean and modern. Only minor issue was the check-in instructions could have been clearer.',
    privateFeedback: 'Consider adding more detailed photos of the building entrance for easier navigation.',
    response: 'Thank you for your feedback, Omar! We appreciate you staying with us and have updated our check-in instructions based on your suggestion. Hope to host you again!',
    responseAt: '2025-08-18T09:00:00Z',
    status: 'published',
    createdAt: '2025-08-15T11:00:00Z',
    publishedAt: '2025-08-15T11:30:00Z',
  },
  {
    id: 'rev-005',
    bookingId: 'book-008',
    propertyId: 'prop-005',
    reviewerId: 'user-006',
    reviewerName: 'Layla Al-Thani',
    reviewerPhoto: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200',
    revieweeId: 'user-003',
    reviewerType: 'guest',
    ratings: {
      overall: 5,
      cleanliness: 5,
      accuracy: 5,
      communication: 5,
      location: 5,
      checkIn: 5,
      value: 5,
    },
    content: 'A truly authentic experience in historic Jeddah! The traditional house has been beautifully restored while maintaining its heritage charm. The rooftop terrace has amazing views of Al-Balad. Highly recommend!',
    photos: [
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=400',
    ],
    status: 'published',
    createdAt: '2025-07-25T14:00:00Z',
    publishedAt: '2025-07-25T14:30:00Z',
  },
];

export const mockReviewSummaries: Record<string, ReviewSummary> = {
  'prop-001': {
    totalReviews: 127,
    averageRating: 4.92,
    ratingDistribution: { 5: 110, 4: 12, 3: 4, 2: 1, 1: 0 },
    categoryAverages: {
      cleanliness: 4.95,
      accuracy: 4.90,
      communication: 4.95,
      location: 4.85,
      checkIn: 4.92,
      value: 4.88,
    },
  },
  'prop-002': {
    totalReviews: 89,
    averageRating: 4.88,
    ratingDistribution: { 5: 72, 4: 14, 3: 2, 2: 1, 1: 0 },
    categoryAverages: {
      cleanliness: 4.92,
      accuracy: 4.85,
      communication: 4.90,
      location: 4.95,
      checkIn: 4.82,
      value: 4.80,
    },
  },
  'prop-003': {
    totalReviews: 45,
    averageRating: 4.96,
    ratingDistribution: { 5: 43, 4: 2, 3: 0, 2: 0, 1: 0 },
    categoryAverages: {
      cleanliness: 4.98,
      accuracy: 4.95,
      communication: 4.98,
      location: 4.92,
      checkIn: 4.95,
      value: 4.96,
    },
  },
  'prop-004': {
    totalReviews: 234,
    averageRating: 4.75,
    ratingDistribution: { 5: 180, 4: 40, 3: 10, 2: 3, 1: 1 },
    categoryAverages: {
      cleanliness: 4.80,
      accuracy: 4.72,
      communication: 4.78,
      location: 4.90,
      checkIn: 4.70,
      value: 4.68,
    },
  },
  'prop-005': {
    totalReviews: 67,
    averageRating: 4.94,
    ratingDistribution: { 5: 62, 4: 4, 3: 1, 2: 0, 1: 0 },
    categoryAverages: {
      cleanliness: 4.95,
      accuracy: 4.92,
      communication: 4.96,
      location: 4.98,
      checkIn: 4.90,
      value: 4.92,
    },
  },
  'prop-006': {
    totalReviews: 156,
    averageRating: 4.82,
    ratingDistribution: { 5: 125, 4: 24, 3: 5, 2: 2, 1: 0 },
    categoryAverages: {
      cleanliness: 4.85,
      accuracy: 4.80,
      communication: 4.85,
      location: 4.88,
      checkIn: 4.78,
      value: 4.80,
    },
  },
};

export const getReviewsByProperty = (propertyId: string): Review[] => {
  return mockReviews.filter((review) => review.propertyId === propertyId);
};

export const getReviewsByHost = (hostId: string): Review[] => {
  return mockReviews.filter((review) => review.revieweeId === hostId);
};

export const getReviewsByGuest = (guestId: string): Review[] => {
  return mockReviews.filter((review) => review.reviewerId === guestId);
};

export const getReviewSummary = (propertyId: string): ReviewSummary | undefined => {
  return mockReviewSummaries[propertyId];
};
