import { Currency } from './user.types';

export type PaymentMethod = 'card' | 'mada' | 'apple_pay' | 'stc_pay' | 'tabby' | 'tamara' | 'bank_transfer';

export type PaymentStatus = 'pending' | 'authorized' | 'captured' | 'failed' | 'refunded' | 'partially_refunded';

export type CardBrand = 'visa' | 'mastercard' | 'amex' | 'mada';

export interface Payment {
  id: string;
  bookingId: string;
  userId: string;
  amount: number;
  currency: Currency;
  paymentMethod: PaymentMethod;
  paymentGateway: string;
  gatewayTransactionId: string;
  status: PaymentStatus;
  cardLastFour?: string;
  cardBrand?: CardBrand;
  createdAt: string;
  capturedAt?: string;
  refundedAt?: string;
  refundAmount?: number;
}

export interface SavedPaymentMethod {
  id: string;
  userId: string;
  type: PaymentMethod;
  cardBrand?: CardBrand;
  cardLastFour?: string;
  cardExpiryMonth?: number;
  cardExpiryYear?: number;
  isDefault: boolean;
  createdAt: string;
}

export interface PaymentRequest {
  bookingId: string;
  amount: number;
  currency: Currency;
  paymentMethodId?: string;
  newCard?: {
    number: string;
    expiryMonth: number;
    expiryYear: number;
    cvv: string;
    holderName: string;
    saveCard: boolean;
  };
  paymentMethod: PaymentMethod;
}

export interface RefundRequest {
  paymentId: string;
  amount: number;
  reason: string;
}

export interface HostPayout {
  id: string;
  hostId: string;
  bookingId: string;
  amount: number;
  currency: Currency;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  bankAccountId: string;
  scheduledDate: string;
  completedAt?: string;
  failureReason?: string;
  transactionReference?: string;
}

export interface EarningsSummary {
  totalEarnings: number;
  pendingPayouts: number;
  completedPayouts: number;
  currentMonthEarnings: number;
  yearToDateEarnings: number;
  currency: Currency;
}

export interface Transaction {
  id: string;
  type: 'booking_payment' | 'payout' | 'refund' | 'adjustment';
  amount: number;
  currency: Currency;
  description: string;
  bookingId?: string;
  bookingReference?: string;
  status: string;
  createdAt: string;
}
