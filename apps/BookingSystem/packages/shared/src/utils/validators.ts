export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const isValidPhone = (phone: string, countryCode: string): boolean => {
  const cleanPhone = phone.replace(/\D/g, '');

  const phonePatterns: Record<string, RegExp> = {
    '+966': /^5\d{8}$/, // Saudi Arabia: starts with 5, 9 digits
    '+971': /^5\d{8}$/, // UAE: starts with 5, 9 digits
    '+965': /^\d{8}$/, // Kuwait: 8 digits
    '+973': /^\d{8}$/, // Bahrain: 8 digits
    '+968': /^\d{8}$/, // Oman: 8 digits
    '+974': /^\d{8}$/, // Qatar: 8 digits
  };

  const pattern = phonePatterns[countryCode];
  return pattern ? pattern.test(cleanPhone) : cleanPhone.length >= 7;
};

export const isValidPassword = (password: string): {
  isValid: boolean;
  errors: string[];
} => {
  const errors: string[] = [];

  if (password.length < 8) {
    errors.push('Password must be at least 8 characters');
  }

  if (!/[A-Z]/.test(password)) {
    errors.push('Password must contain at least one uppercase letter');
  }

  if (!/[a-z]/.test(password)) {
    errors.push('Password must contain at least one lowercase letter');
  }

  if (!/\d/.test(password)) {
    errors.push('Password must contain at least one number');
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};

export const isValidIBAN = (iban: string): boolean => {
  const cleanIBAN = iban.replace(/\s/g, '').toUpperCase();

  // Basic length check for GCC countries
  const ibanLengths: Record<string, number> = {
    SA: 24, // Saudi Arabia
    AE: 23, // UAE
    KW: 30, // Kuwait
    BH: 22, // Bahrain
    OM: 23, // Oman
    QA: 29, // Qatar
  };

  const countryCode = cleanIBAN.substring(0, 2);
  const expectedLength = ibanLengths[countryCode];

  if (!expectedLength) {
    return false;
  }

  if (cleanIBAN.length !== expectedLength) {
    return false;
  }

  // Check if IBAN contains only alphanumeric characters
  if (!/^[A-Z0-9]+$/.test(cleanIBAN)) {
    return false;
  }

  return true;
};

export const isValidDate = (dateString: string): boolean => {
  const date = new Date(dateString);
  return date instanceof Date && !isNaN(date.getTime());
};

export const isDateInPast = (dateString: string): boolean => {
  const date = new Date(dateString);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return date < today;
};

export const isDateInFuture = (dateString: string): boolean => {
  const date = new Date(dateString);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return date >= today;
};

export const isValidDateRange = (checkIn: string, checkOut: string): boolean => {
  const checkInDate = new Date(checkIn);
  const checkOutDate = new Date(checkOut);
  return checkOutDate > checkInDate;
};

export const isValidGuestCount = (
  adults: number,
  children: number,
  infants: number,
  maxGuests: number
): boolean => {
  return adults >= 1 && adults + children <= maxGuests && infants <= 2;
};

export const sanitizeInput = (input: string): string => {
  return input
    .trim()
    .replace(/[<>]/g, '') // Remove < and >
    .replace(/javascript:/gi, '') // Remove javascript: protocol
    .replace(/on\w+=/gi, ''); // Remove event handlers
};

export const validateBookingDates = (
  checkIn: string,
  checkOut: string,
  minStay: number,
  maxStay?: number,
  advanceNotice: number = 0
): {
  isValid: boolean;
  error?: string;
} => {
  const checkInDate = new Date(checkIn);
  const checkOutDate = new Date(checkOut);
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // Check if check-in is in the past
  const minCheckIn = new Date(today);
  minCheckIn.setDate(minCheckIn.getDate() + advanceNotice);

  if (checkInDate < minCheckIn) {
    return {
      isValid: false,
      error: advanceNotice > 0
        ? `Check-in must be at least ${advanceNotice} day(s) from now`
        : 'Check-in cannot be in the past',
    };
  }

  // Check if check-out is after check-in
  if (checkOutDate <= checkInDate) {
    return {
      isValid: false,
      error: 'Check-out must be after check-in',
    };
  }

  // Calculate nights
  const nights = Math.ceil(
    (checkOutDate.getTime() - checkInDate.getTime()) / (1000 * 60 * 60 * 24)
  );

  // Check minimum stay
  if (nights < minStay) {
    return {
      isValid: false,
      error: `Minimum stay is ${minStay} night(s)`,
    };
  }

  // Check maximum stay
  if (maxStay && nights > maxStay) {
    return {
      isValid: false,
      error: `Maximum stay is ${maxStay} night(s)`,
    };
  }

  return { isValid: true };
};
