import { Currency, PropertyType, CancellationPolicy } from '../types';

export const CURRENCIES: Currency[] = ['SAR', 'AED', 'KWD', 'BHD', 'OMR', 'QAR'];

export const CURRENCY_INFO: Record<Currency, { symbol: string; symbolAr: string; name: string; nameAr: string; decimals: number }> = {
  SAR: { symbol: 'SAR', symbolAr: 'ر.س', name: 'Saudi Riyal', nameAr: 'ريال سعودي', decimals: 2 },
  AED: { symbol: 'AED', symbolAr: 'د.إ', name: 'UAE Dirham', nameAr: 'درهم إماراتي', decimals: 2 },
  KWD: { symbol: 'KWD', symbolAr: 'د.ك', name: 'Kuwaiti Dinar', nameAr: 'دينار كويتي', decimals: 3 },
  BHD: { symbol: 'BHD', symbolAr: 'د.ب', name: 'Bahraini Dinar', nameAr: 'دينار بحريني', decimals: 3 },
  OMR: { symbol: 'OMR', symbolAr: 'ر.ع', name: 'Omani Rial', nameAr: 'ريال عماني', decimals: 3 },
  QAR: { symbol: 'QAR', symbolAr: 'ر.ق', name: 'Qatari Riyal', nameAr: 'ريال قطري', decimals: 2 },
};

export const GCC_COUNTRIES = [
  { code: 'SA', name: 'Saudi Arabia', nameAr: 'المملكة العربية السعودية', currency: 'SAR' as Currency, phoneCode: '+966', vatRate: 15 },
  { code: 'AE', name: 'United Arab Emirates', nameAr: 'الإمارات العربية المتحدة', currency: 'AED' as Currency, phoneCode: '+971', vatRate: 5 },
  { code: 'KW', name: 'Kuwait', nameAr: 'الكويت', currency: 'KWD' as Currency, phoneCode: '+965', vatRate: 0 },
  { code: 'BH', name: 'Bahrain', nameAr: 'البحرين', currency: 'BHD' as Currency, phoneCode: '+973', vatRate: 10 },
  { code: 'OM', name: 'Oman', nameAr: 'عمان', currency: 'OMR' as Currency, phoneCode: '+968', vatRate: 5 },
  { code: 'QA', name: 'Qatar', nameAr: 'قطر', currency: 'QAR' as Currency, phoneCode: '+974', vatRate: 0 },
];

export const PROPERTY_TYPES: { type: PropertyType; nameEn: string; nameAr: string }[] = [
  { type: 'apartment', nameEn: 'Apartment', nameAr: 'شقة' },
  { type: 'villa', nameEn: 'Villa', nameAr: 'فيلا' },
  { type: 'chalet', nameEn: 'Chalet', nameAr: 'شاليه' },
  { type: 'traditional_house', nameEn: 'Traditional House', nameAr: 'بيت تقليدي' },
  { type: 'studio', nameEn: 'Studio', nameAr: 'استوديو' },
  { type: 'penthouse', nameEn: 'Penthouse', nameAr: 'بنتهاوس' },
  { type: 'farm_stay', nameEn: 'Farm Stay', nameAr: 'مزرعة' },
  { type: 'desert_camp', nameEn: 'Desert Camp', nameAr: 'مخيم صحراوي' },
  { type: 'beach_house', nameEn: 'Beach House', nameAr: 'بيت على الشاطئ' },
  { type: 'townhouse', nameEn: 'Townhouse', nameAr: 'تاون هاوس' },
  { type: 'compound_unit', nameEn: 'Compound Unit', nameAr: 'وحدة في كمباوند' },
];

export const CANCELLATION_POLICY_INFO: Record<CancellationPolicy, {
  nameEn: string;
  nameAr: string;
  descEn: string;
  descAr: string;
  refundPercent: number;
  deadlineDays: number;
}> = {
  flexible: {
    nameEn: 'Flexible',
    nameAr: 'مرنة',
    descEn: 'Full refund if cancelled 24 hours before check-in',
    descAr: 'استرداد كامل إذا تم الإلغاء قبل 24 ساعة من تسجيل الوصول',
    refundPercent: 100,
    deadlineDays: 1,
  },
  moderate: {
    nameEn: 'Moderate',
    nameAr: 'معتدلة',
    descEn: 'Full refund if cancelled 5 days before check-in',
    descAr: 'استرداد كامل إذا تم الإلغاء قبل 5 أيام من تسجيل الوصول',
    refundPercent: 100,
    deadlineDays: 5,
  },
  strict: {
    nameEn: 'Strict',
    nameAr: 'صارمة',
    descEn: '50% refund if cancelled 7 days before check-in',
    descAr: 'استرداد 50٪ إذا تم الإلغاء قبل 7 أيام من تسجيل الوصول',
    refundPercent: 50,
    deadlineDays: 7,
  },
  super_strict: {
    nameEn: 'Super Strict',
    nameAr: 'صارمة جداً',
    descEn: 'No refund unless cancelled 30 days before check-in',
    descAr: 'لا استرداد إلا إذا تم الإلغاء قبل 30 يوماً من تسجيل الوصول',
    refundPercent: 0,
    deadlineDays: 30,
  },
};

export const SERVICE_FEE_GUEST_PERCENT = 7.5;
export const SERVICE_FEE_HOST_PERCENT = 5;

export const MIN_PASSWORD_LENGTH = 8;
export const MAX_PHOTOS_PER_LISTING = 50;
export const MIN_PHOTOS_PER_LISTING = 5;
export const MAX_REVIEW_CHARS = 1000;
export const MIN_REVIEW_CHARS = 50;
export const REVIEW_WINDOW_DAYS = 14;

export const CHECK_IN_TIMES = [
  '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00', '20:00', '21:00', '22:00', '23:00',
];

export const CHECK_OUT_TIMES = [
  '06:00', '07:00', '08:00', '09:00', '10:00', '11:00', '12:00', '13:00', '14:00',
];

export const ARRIVAL_TIME_OPTIONS = [
  { value: '08:00', labelEn: '8:00 AM - 10:00 AM', labelAr: '8:00 ص - 10:00 ص' },
  { value: '10:00', labelEn: '10:00 AM - 12:00 PM', labelAr: '10:00 ص - 12:00 م' },
  { value: '12:00', labelEn: '12:00 PM - 2:00 PM', labelAr: '12:00 م - 2:00 م' },
  { value: '14:00', labelEn: '2:00 PM - 4:00 PM', labelAr: '2:00 م - 4:00 م' },
  { value: '16:00', labelEn: '4:00 PM - 6:00 PM', labelAr: '4:00 م - 6:00 م' },
  { value: '18:00', labelEn: '6:00 PM - 8:00 PM', labelAr: '6:00 م - 8:00 م' },
  { value: '20:00', labelEn: '8:00 PM - 10:00 PM', labelAr: '8:00 م - 10:00 م' },
  { value: '22:00', labelEn: 'After 10:00 PM', labelAr: 'بعد 10:00 م' },
];

export const POPULAR_CITIES = [
  { city: 'Riyadh', country: 'SA', nameAr: 'الرياض' },
  { city: 'Jeddah', country: 'SA', nameAr: 'جدة' },
  { city: 'Dubai', country: 'AE', nameAr: 'دبي' },
  { city: 'Abu Dhabi', country: 'AE', nameAr: 'أبوظبي' },
  { city: 'Makkah', country: 'SA', nameAr: 'مكة المكرمة' },
  { city: 'Medina', country: 'SA', nameAr: 'المدينة المنورة' },
  { city: 'AlUla', country: 'SA', nameAr: 'العلا' },
  { city: 'Kuwait City', country: 'KW', nameAr: 'مدينة الكويت' },
  { city: 'Doha', country: 'QA', nameAr: 'الدوحة' },
  { city: 'Manama', country: 'BH', nameAr: 'المنامة' },
  { city: 'Muscat', country: 'OM', nameAr: 'مسقط' },
];

// Simplified exports for form components
export const CANCELLATION_POLICIES = [
  { value: 'flexible', labelEn: 'Flexible', labelAr: 'مرنة', descriptionEn: 'Full refund 24 hours before check-in', descriptionAr: 'استرداد كامل قبل 24 ساعة' },
  { value: 'moderate', labelEn: 'Moderate', labelAr: 'معتدلة', descriptionEn: 'Full refund 5 days before check-in', descriptionAr: 'استرداد كامل قبل 5 أيام' },
  { value: 'strict', labelEn: 'Strict', labelAr: 'صارمة', descriptionEn: '50% refund 7 days before check-in', descriptionAr: 'استرداد 50% قبل 7 أيام' },
  { value: 'super_strict', labelEn: 'Super Strict', labelAr: 'صارمة جداً', descriptionEn: 'No refund unless 30 days before', descriptionAr: 'لا استرداد إلا قبل 30 يوم' },
];
