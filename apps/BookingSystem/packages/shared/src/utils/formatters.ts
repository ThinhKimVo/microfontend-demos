import { format, formatDistance, parseISO } from 'date-fns';
import { ar, enUS } from 'date-fns/locale';
import { Currency } from '../types';

const locales = {
  en: enUS,
  ar: ar,
};

export const formatCurrency = (
  amount: number,
  currency: Currency,
  locale: 'en' | 'ar' = 'en'
): string => {
  const currencySymbols: Record<Currency, { en: string; ar: string }> = {
    SAR: { en: 'SAR', ar: 'ر.س' },
    AED: { en: 'AED', ar: 'د.إ' },
    KWD: { en: 'KWD', ar: 'د.ك' },
    BHD: { en: 'BHD', ar: 'د.ب' },
    OMR: { en: 'OMR', ar: 'ر.ع' },
    QAR: { en: 'QAR', ar: 'ر.ق' },
  };

  const formatter = new Intl.NumberFormat(locale === 'ar' ? 'ar-SA' : 'en-US', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  });

  const symbol = currencySymbols[currency][locale];
  const formattedAmount = formatter.format(amount);

  return locale === 'ar' ? `${formattedAmount} ${symbol}` : `${symbol} ${formattedAmount}`;
};

export const formatDate = (
  date: string | Date,
  formatStr: string = 'PP',
  locale: 'en' | 'ar' = 'en'
): string => {
  const dateObj = typeof date === 'string' ? parseISO(date) : date;
  return format(dateObj, formatStr, { locale: locales[locale] });
};

export const formatDateRange = (
  checkIn: string | Date,
  checkOut: string | Date,
  locale: 'en' | 'ar' = 'en'
): string => {
  const checkInDate = typeof checkIn === 'string' ? parseISO(checkIn) : checkIn;
  const checkOutDate = typeof checkOut === 'string' ? parseISO(checkOut) : checkOut;

  const checkInFormatted = format(checkInDate, 'MMM d', { locale: locales[locale] });
  const checkOutFormatted = format(checkOutDate, 'MMM d, yyyy', { locale: locales[locale] });

  return `${checkInFormatted} - ${checkOutFormatted}`;
};

export const formatRelativeTime = (
  date: string | Date,
  locale: 'en' | 'ar' = 'en'
): string => {
  const dateObj = typeof date === 'string' ? parseISO(date) : date;
  return formatDistance(dateObj, new Date(), {
    addSuffix: true,
    locale: locales[locale],
  });
};

export const formatNights = (nights: number, locale: 'en' | 'ar' = 'en'): string => {
  if (locale === 'ar') {
    if (nights === 1) return 'ليلة واحدة';
    if (nights === 2) return 'ليلتان';
    if (nights >= 3 && nights <= 10) return `${nights} ليالٍ`;
    return `${nights} ليلة`;
  }
  return nights === 1 ? '1 night' : `${nights} nights`;
};

export const formatGuests = (
  adults: number,
  children: number,
  infants: number,
  locale: 'en' | 'ar' = 'en'
): string => {
  const parts: string[] = [];

  if (locale === 'ar') {
    if (adults > 0) {
      parts.push(adults === 1 ? 'بالغ واحد' : `${adults} بالغين`);
    }
    if (children > 0) {
      parts.push(children === 1 ? 'طفل واحد' : `${children} أطفال`);
    }
    if (infants > 0) {
      parts.push(infants === 1 ? 'رضيع واحد' : `${infants} رضع`);
    }
    return parts.join('، ');
  }

  if (adults > 0) {
    parts.push(adults === 1 ? '1 adult' : `${adults} adults`);
  }
  if (children > 0) {
    parts.push(children === 1 ? '1 child' : `${children} children`);
  }
  if (infants > 0) {
    parts.push(infants === 1 ? '1 infant' : `${infants} infants`);
  }

  return parts.join(', ');
};

export const formatPhoneNumber = (phone: string, countryCode: string): string => {
  const cleanPhone = phone.replace(/\D/g, '');

  if (countryCode === '+966' && cleanPhone.length === 9) {
    return `${countryCode} ${cleanPhone.slice(0, 2)} ${cleanPhone.slice(2, 5)} ${cleanPhone.slice(5)}`;
  }

  if (countryCode === '+971' && cleanPhone.length === 9) {
    return `${countryCode} ${cleanPhone.slice(0, 2)} ${cleanPhone.slice(2, 5)} ${cleanPhone.slice(5)}`;
  }

  return `${countryCode} ${cleanPhone}`;
};

export const formatRating = (rating: number): string => {
  return rating.toFixed(2);
};

export const formatPercentage = (value: number): string => {
  return `${Math.round(value)}%`;
};

export const calculateNights = (checkIn: string | Date, checkOut: string | Date): number => {
  const checkInDate = typeof checkIn === 'string' ? parseISO(checkIn) : checkIn;
  const checkOutDate = typeof checkOut === 'string' ? parseISO(checkOut) : checkOut;

  const diffTime = checkOutDate.getTime() - checkInDate.getTime();
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
};
