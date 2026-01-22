export type UserRole = 'guest' | 'host' | 'admin';

export type VerificationStatus = 'none' | 'pending' | 'verified' | 'rejected';

export type IdDocumentType = 'national_id' | 'iqama' | 'passport';

export type Currency = 'SAR' | 'AED' | 'KWD' | 'BHD' | 'OMR' | 'QAR';

export type Language = 'en' | 'ar';

export type UserStatus = 'active' | 'suspended' | 'deleted';

export interface User {
  id: string;
  email: string;
  phone: string;
  phoneCountryCode: string;
  firstNameEn: string;
  lastNameEn: string;
  firstNameAr: string;
  lastNameAr: string;
  profilePhotoUrl?: string;
  profileImage?: string;
  dateOfBirth?: string;
  nationality?: string;
  preferredLanguage: Language;
  preferredCurrency: Currency;
  idVerificationStatus: VerificationStatus;
  idDocumentType?: IdDocumentType;
  isHost: boolean;
  isGuest: boolean;
  createdAt: string;
  updatedAt: string;
  lastLoginAt?: string;
  status: UserStatus;
}

export interface Host extends User {
  isHost: true;
  aboutEn?: string;
  aboutAr?: string;
  languagesSpoken: string[];
  responseRate: number;
  responseTime: string;
  isSuperhost: boolean;
  hostingSince: string;
  totalReviews: number;
  averageRating: number;
  verificationBadges: string[];
  bankAccount?: BankAccount;
  tourismLicenseNumber?: string;
  tourismLicenseVerified: boolean;
  profileImage?: string;
  totalListings?: number;
  businessName?: string;
}

export interface BankAccount {
  bankName: string;
  accountHolderName: string;
  iban: string;
  currency: Currency;
  isVerified: boolean;
}

export interface GuestProfile {
  user: User;
  totalTrips: number;
  memberSince: string;
  reviewsReceived: number;
  averageRating?: number;
}
