import { Currency } from './user.types';

export type PropertyType =
  | 'apartment'
  | 'villa'
  | 'chalet'
  | 'traditional_house'
  | 'studio'
  | 'penthouse'
  | 'farm_stay'
  | 'desert_camp'
  | 'beach_house'
  | 'townhouse'
  | 'compound_unit';

export type ListingType = 'entire_place' | 'private_room' | 'shared_room';

export type PropertyStatus = 'draft' | 'pending_review' | 'active' | 'inactive' | 'suspended';

export type CancellationPolicy = 'flexible' | 'moderate' | 'strict' | 'super_strict';

export type BedType = 'king' | 'queen' | 'double' | 'single' | 'sofa_bed' | 'bunk_bed' | 'floor_mattress';

export interface PropertyLocation {
  country: string;
  city: string;
  neighborhood: string;
  streetAddress: string;
  buildingNumber?: string;
  floorNumber?: number;
  latitude: number;
  longitude: number;
  directionsEn?: string;
  directionsAr?: string;
}

export interface PropertyPhoto {
  id: string;
  url: string;
  thumbnailUrl?: string;
  captionEn?: string;
  captionAr?: string;
  roomType?: string;
  order: number;
}

export interface PropertyPricing {
  currency: Currency;
  basePrice: number;
  weekendPrice?: number;
  cleaningFee?: number;
  serviceFee?: number;
  securityDeposit?: number;
  extraGuestFee?: number;
  extraGuestAfter?: number;
  weeklyDiscountPercent?: number;
  monthlyDiscountPercent?: number;
  minPrice?: number;
  maxPrice?: number;
}

export interface Bedroom {
  id: string;
  nameEn: string;
  nameAr: string;
  beds: {
    type: BedType;
    count: number;
  }[];
}

export interface HouseRules {
  checkInTimeStart: string;
  checkInTimeEnd: string;
  checkOutTime: string;
  selfCheckIn: boolean;
  selfCheckInType?: 'lockbox' | 'keypad' | 'smart_lock' | 'building_staff';
  smokingAllowed: boolean;
  petsAllowed: boolean;
  eventsAllowed: boolean;
  quietHoursStart?: string;
  quietHoursEnd?: string;
  maxGuests: number;
  familyOnly: boolean;
  additionalRulesEn?: string;
  additionalRulesAr?: string;
}

export interface PropertyAvailability {
  minStay: number;
  maxStay?: number;
  advanceNotice: number;
  preparationTime: number;
  availabilityWindow: number;
}

export interface Property {
  id: string;
  hostId: string;
  titleEn: string;
  titleAr: string;
  descriptionEn: string;
  descriptionAr: string;
  propertyType: PropertyType;
  listingType: ListingType;
  location: PropertyLocation;
  bedrooms: number;
  bedroomDetails: Bedroom[];
  beds: number;
  bathrooms: number;
  maxGuests: number;
  sizeSqm?: number;
  amenities: string[];
  photos: PropertyPhoto[];
  pricing: PropertyPricing;
  houseRules: HouseRules;
  availability: PropertyAvailability;
  instantBook: boolean;
  familyOnly: boolean;
  femaleOnly: boolean;
  cancellationPolicy: CancellationPolicy;
  status: PropertyStatus;
  rating?: number;
  reviewCount?: number;
  viewCount?: number;
  createdAt: string;
  updatedAt: string;
  publishedAt?: string;
}

export interface PropertyCalendarDate {
  date: string;
  isAvailable: boolean;
  priceOverride?: number;
  minStayOverride?: number;
  note?: string;
  bookingId?: string;
}

export interface PropertySearchFilters {
  location?: string;
  checkIn?: string;
  checkOut?: string;
  adults?: number;
  children?: number;
  infants?: number;
  minPrice?: number;
  maxPrice?: number;
  propertyTypes?: PropertyType[];
  listingTypes?: ListingType[];
  bedrooms?: number;
  bathrooms?: number;
  amenities?: string[];
  instantBook?: boolean;
  familyOnly?: boolean;
  femaleOnly?: boolean;
  superhostOnly?: boolean;
  cancellationPolicy?: CancellationPolicy[];
}

export interface PropertySortOption {
  field: 'relevance' | 'price_asc' | 'price_desc' | 'rating' | 'distance' | 'newest';
  label: string;
}

export const AMENITIES = [
  'wifi',
  'air_conditioning',
  'heating',
  'tv',
  'kitchen',
  'washer',
  'dryer',
  'free_parking',
  'pool',
  'hot_tub',
  'ev_charger',
  'gym',
  'dedicated_workspace',
  'outdoor_dining',
  'bbq_grill',
  'fire_pit',
  'indoor_fireplace',
  'breakfast_included',
  'smoking_allowed',
  'pets_allowed',
  'prayer_mat',
  'quran',
  'qibla_direction',
  'bidet',
  'halal_kitchen',
  'security_cameras',
  'smoke_alarm',
  'carbon_monoxide_alarm',
  'fire_extinguisher',
  'first_aid_kit',
  'elevator',
  'wheelchair_accessible',
] as const;

export type Amenity = (typeof AMENITIES)[number];
