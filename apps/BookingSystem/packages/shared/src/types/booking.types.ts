import { Currency } from './user.types';
import { CancellationPolicy } from './property.types';

export type BookingStatus =
  | 'pending'
  | 'confirmed'
  | 'cancelled'
  | 'cancelled_by_guest'
  | 'cancelled_by_host'
  | 'completed'
  | 'no_show'
  | 'rejected';

export type BookingType = 'instant' | 'request';

export type PayoutStatus = 'pending' | 'processing' | 'completed' | 'failed';

export interface BookingPricing {
  nightlyRate: number;
  nights: number;
  subtotal: number;
  cleaningFee: number;
  serviceFeeGuest: number;
  serviceFeeHost: number;
  vatAmount: number;
  vatRate: number;
  totalPrice: number;
  currency: Currency;
  hostPayout: number;
}

export interface Booking {
  id: string;
  bookingReference: string;
  propertyId: string;
  propertyTitle: string;
  propertyPhoto: string;
  guestId: string;
  guestName: string;
  guestPhoto?: string;
  hostId: string;
  hostName: string;
  checkInDate: string;
  checkOutDate: string;
  // Aliases for convenience
  checkIn?: string;
  checkOut?: string;
  adults: number;
  children: number;
  infants: number;
  guests?: number;
  status: BookingStatus;
  bookingType: BookingType;
  pricing: BookingPricing;
  specialRequests?: string;
  arrivalTime?: string;
  cancellationPolicy: CancellationPolicy;
  createdAt: string;
  confirmedAt?: string;
  cancelledAt?: string;
  cancellationReason?: string;
  checkInInstructions?: string;
  exactAddress?: string;
  hostPayoutStatus: PayoutStatus;
  hostPayoutDate?: string;
}

export interface BookingRequest {
  propertyId: string;
  checkInDate: string;
  checkOutDate: string;
  adults: number;
  children: number;
  infants: number;
  specialRequests?: string;
  arrivalTime?: string;
}

export interface BookingModification {
  bookingId: string;
  newCheckInDate?: string;
  newCheckOutDate?: string;
  newGuestCount?: {
    adults: number;
    children: number;
    infants: number;
  };
  reason: string;
}

export interface CancellationPolicyDetails {
  type: CancellationPolicy;
  titleEn: string;
  titleAr: string;
  descriptionEn: string;
  descriptionAr: string;
  refundPercentage: number;
  deadlineDays: number;
}

export const CANCELLATION_POLICIES: CancellationPolicyDetails[] = [
  {
    type: 'flexible',
    titleEn: 'Flexible',
    titleAr: 'مرن',
    descriptionEn: 'Full refund if cancelled 24 hours before check-in',
    descriptionAr: 'استرداد كامل إذا تم الإلغاء قبل 24 ساعة من تسجيل الوصول',
    refundPercentage: 100,
    deadlineDays: 1,
  },
  {
    type: 'moderate',
    titleEn: 'Moderate',
    titleAr: 'معتدل',
    descriptionEn: 'Full refund if cancelled 5 days before check-in',
    descriptionAr: 'استرداد كامل إذا تم الإلغاء قبل 5 أيام من تسجيل الوصول',
    refundPercentage: 100,
    deadlineDays: 5,
  },
  {
    type: 'strict',
    titleEn: 'Strict',
    titleAr: 'صارم',
    descriptionEn: '50% refund if cancelled 7 days before check-in',
    descriptionAr: 'استرداد 50٪ إذا تم الإلغاء قبل 7 أيام من تسجيل الوصول',
    refundPercentage: 50,
    deadlineDays: 7,
  },
  {
    type: 'super_strict',
    titleEn: 'Super Strict',
    titleAr: 'صارم جداً',
    descriptionEn: 'No refund unless cancelled 30 days before check-in',
    descriptionAr: 'لا استرداد إلا إذا تم الإلغاء قبل 30 يوماً من تسجيل الوصول',
    refundPercentage: 0,
    deadlineDays: 30,
  },
];
