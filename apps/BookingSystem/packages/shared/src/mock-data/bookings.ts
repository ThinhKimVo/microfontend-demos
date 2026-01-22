import { Booking } from '../types';

export const mockBookings: Booking[] = [
  {
    id: 'book-001',
    bookingReference: 'STG-2026-001234',
    propertyId: 'prop-001',
    propertyTitle: 'Luxury Villa with Private Pool in Al Olaya',
    propertyPhoto: 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=800',
    guestId: 'user-001',
    guestName: 'Ahmed Al-Rashid',
    guestPhoto: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200',
    hostId: 'user-003',
    hostName: 'Mohammed Al-Saud',
    checkInDate: '2026-01-20',
    checkOutDate: '2026-01-24',
    adults: 4,
    children: 2,
    infants: 0,
    status: 'confirmed',
    bookingType: 'instant',
    pricing: {
      nightlyRate: 1500,
      nights: 4,
      subtotal: 6000,
      cleaningFee: 200,
      serviceFeeGuest: 450,
      serviceFeeHost: 300,
      vatAmount: 997.5,
      vatRate: 15,
      totalPrice: 7647.5,
      currency: 'SAR',
      hostPayout: 5900,
    },
    specialRequests: 'Early check-in if possible. We have young children.',
    arrivalTime: '16:00',
    cancellationPolicy: 'moderate',
    createdAt: '2026-01-05T14:30:00Z',
    confirmedAt: '2026-01-05T14:30:00Z',
    checkInInstructions: 'Use the smart lock code 1234# to enter. The code is active from 3pm on your check-in day.',
    exactAddress: '123 King Fahd Road, Villa 15, Al Olaya, Riyadh',
    hostPayoutStatus: 'pending',
  },
  {
    id: 'book-002',
    bookingReference: 'STG-2026-001235',
    propertyId: 'prop-002',
    propertyTitle: 'Modern Apartment with Burj Khalifa View',
    propertyPhoto: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800',
    guestId: 'user-001',
    guestName: 'Ahmed Al-Rashid',
    guestPhoto: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200',
    hostId: 'user-002',
    hostName: 'Fatima Al-Maktoum',
    checkInDate: '2026-02-10',
    checkOutDate: '2026-02-15',
    adults: 2,
    children: 0,
    infants: 0,
    status: 'pending',
    bookingType: 'request',
    pricing: {
      nightlyRate: 950,
      nights: 5,
      subtotal: 4750,
      cleaningFee: 150,
      serviceFeeGuest: 367.5,
      serviceFeeHost: 245,
      vatAmount: 263.375,
      vatRate: 5,
      totalPrice: 5530.875,
      currency: 'AED',
      hostPayout: 4655,
    },
    specialRequests: 'Celebrating our anniversary. Any special touches would be appreciated!',
    arrivalTime: '18:00',
    cancellationPolicy: 'flexible',
    createdAt: '2026-01-10T09:15:00Z',
    hostPayoutStatus: 'pending',
  },
  {
    id: 'book-003',
    bookingReference: 'STG-2025-009876',
    propertyId: 'prop-004',
    propertyTitle: 'Cozy Studio in JBR Beach',
    propertyPhoto: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800',
    guestId: 'user-001',
    guestName: 'Ahmed Al-Rashid',
    guestPhoto: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200',
    hostId: 'user-002',
    hostName: 'Fatima Al-Maktoum',
    checkInDate: '2025-12-20',
    checkOutDate: '2025-12-25',
    adults: 2,
    children: 0,
    infants: 0,
    status: 'completed',
    bookingType: 'instant',
    pricing: {
      nightlyRate: 450,
      nights: 5,
      subtotal: 2250,
      cleaningFee: 75,
      serviceFeeGuest: 174.375,
      serviceFeeHost: 116.25,
      vatAmount: 124.97,
      vatRate: 5,
      totalPrice: 2624.345,
      currency: 'AED',
      hostPayout: 2208.75,
    },
    cancellationPolicy: 'flexible',
    createdAt: '2025-12-01T10:00:00Z',
    confirmedAt: '2025-12-01T10:00:00Z',
    hostPayoutStatus: 'completed',
    hostPayoutDate: '2025-12-27T10:00:00Z',
  },
  {
    id: 'book-004',
    bookingReference: 'STG-2025-009500',
    propertyId: 'prop-003',
    propertyTitle: 'Desert Camp Experience in AlUla',
    propertyPhoto: 'https://images.unsplash.com/photo-1542401886-65d6c61db217?w=800',
    guestId: 'user-001',
    guestName: 'Ahmed Al-Rashid',
    guestPhoto: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200',
    hostId: 'user-003',
    hostName: 'Mohammed Al-Saud',
    checkInDate: '2025-11-15',
    checkOutDate: '2025-11-17',
    adults: 4,
    children: 2,
    infants: 0,
    status: 'completed',
    bookingType: 'request',
    pricing: {
      nightlyRate: 2500,
      nights: 2,
      subtotal: 5000,
      cleaningFee: 0,
      serviceFeeGuest: 375,
      serviceFeeHost: 250,
      vatAmount: 806.25,
      vatRate: 15,
      totalPrice: 6181.25,
      currency: 'SAR',
      hostPayout: 4750,
    },
    specialRequests: 'We would love a traditional dinner on our first night.',
    cancellationPolicy: 'strict',
    createdAt: '2025-10-20T08:00:00Z',
    confirmedAt: '2025-10-21T12:00:00Z',
    hostPayoutStatus: 'completed',
    hostPayoutDate: '2025-11-19T10:00:00Z',
  },
  {
    id: 'book-005',
    bookingReference: 'STG-2025-008000',
    propertyId: 'prop-001',
    propertyTitle: 'Luxury Villa with Private Pool in Al Olaya',
    propertyPhoto: 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=800',
    guestId: 'user-001',
    guestName: 'Ahmed Al-Rashid',
    guestPhoto: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200',
    hostId: 'user-003',
    hostName: 'Mohammed Al-Saud',
    checkInDate: '2025-10-10',
    checkOutDate: '2025-10-12',
    adults: 2,
    children: 0,
    infants: 0,
    status: 'cancelled_by_guest',
    bookingType: 'instant',
    pricing: {
      nightlyRate: 1500,
      nights: 2,
      subtotal: 3000,
      cleaningFee: 200,
      serviceFeeGuest: 240,
      serviceFeeHost: 160,
      vatAmount: 516,
      vatRate: 15,
      totalPrice: 3956,
      currency: 'SAR',
      hostPayout: 3040,
    },
    cancellationPolicy: 'moderate',
    createdAt: '2025-09-25T14:00:00Z',
    confirmedAt: '2025-09-25T14:00:00Z',
    cancelledAt: '2025-10-05T09:00:00Z',
    cancellationReason: 'Change of travel plans',
    hostPayoutStatus: 'pending',
  },
];

export const getBookingById = (id: string): Booking | undefined => {
  return mockBookings.find((booking) => booking.id === id);
};

export const getBookingByReference = (reference: string): Booking | undefined => {
  return mockBookings.find((booking) => booking.bookingReference === reference);
};

export const getBookingsByGuest = (guestId: string): Booking[] => {
  return mockBookings.filter((booking) => booking.guestId === guestId);
};

export const getBookingsByHost = (hostId: string): Booking[] => {
  return mockBookings.filter((booking) => booking.hostId === hostId);
};

export const getUpcomingBookings = (userId: string, isHost: boolean): Booking[] => {
  const today = new Date().toISOString().split('T')[0];
  return mockBookings.filter((booking) => {
    const isUserBooking = isHost ? booking.hostId === userId : booking.guestId === userId;
    return isUserBooking && booking.checkInDate >= today && booking.status === 'confirmed';
  });
};

export const getPastBookings = (userId: string, isHost: boolean): Booking[] => {
  const today = new Date().toISOString().split('T')[0];
  return mockBookings.filter((booking) => {
    const isUserBooking = isHost ? booking.hostId === userId : booking.guestId === userId;
    return isUserBooking && (booking.checkOutDate < today || booking.status === 'completed');
  });
};
