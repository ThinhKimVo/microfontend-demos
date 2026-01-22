export interface Event {
  id: string;
  title: string;
  titleTC?: string;
  description: string;
  descriptionTC?: string;
  imageUrl: string;
  date: string;
  endDate?: string;
  timeSlot: 'morning' | 'afternoon' | 'evening';
  district: string;
  address: string;
  ageGroup: string[];
  price: number;
  isFree: boolean;
  isSenFriendly: boolean;
  isSubsidized: boolean;
  isFeatured: boolean;
  isTouristFriendly: boolean;
  merchantId: string;
  status: EventStatus;
  createdAt: string;
  updatedAt: string;
  viewCount: number;
  latitude?: number;
  longitude?: number;
  externalUrl?: string;
}

export type EventStatus = 'draft' | 'submitted' | 'approved' | 'rejected';

export interface Merchant {
  id: string;
  email: string;
  companyName: string;
  contactPerson: string;
  phone: string;
  subscriptionStatus: SubscriptionStatus;
  subscriptionStartDate?: string;
  subscriptionEndDate?: string;
  trialEndDate: string;
  createdAt: string;
  eventsCount: number;
}

export type SubscriptionStatus = 'trial' | 'active' | 'expired' | 'cancelled';

export interface User {
  id: string;
  email: string;
  role: 'merchant' | 'admin';
  merchantId?: string;
}

export interface FilterOptions {
  date?: string;
  timeSlot?: 'morning' | 'afternoon' | 'evening' | '';
  district?: string;
  ageGroup?: string;
  priceType?: 'free' | 'paid' | '';
  isSenFriendly?: boolean;
}

export interface Analytics {
  totalEvents: number;
  totalPageViews: number;
  topEvents: Event[];
  totalMerchants: number;
  pendingApprovals: number;
}

export const DISTRICTS = [
  'Central & Western',
  'Eastern',
  'Southern',
  'Wan Chai',
  'Kowloon City',
  'Kwun Tong',
  'Sham Shui Po',
  'Wong Tai Sin',
  'Yau Tsim Mong',
  'Islands',
  'Kwai Tsing',
  'North',
  'Sai Kung',
  'Sha Tin',
  'Tai Po',
  'Tsuen Wan',
  'Tuen Mun',
  'Yuen Long',
];

export const AGE_GROUPS = [
  '0-2 years',
  '3-5 years',
  '6-8 years',
  '9-12 years',
  '13+ years',
  'All ages',
];

export const TIME_SLOTS = [
  { value: 'morning', label: 'Morning (6AM-12PM)' },
  { value: 'afternoon', label: 'Afternoon (12PM-6PM)' },
  { value: 'evening', label: 'Evening (6PM-12AM)' },
];
