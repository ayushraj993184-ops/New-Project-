import type { Booking, PromoCode, RoomCategory, RoomInstanceStatus } from '../types';

/** Format a Date in the user's local timezone as YYYY-MM-DD. */
export function getLocalDateStr(date: Date = new Date()): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/** Parse a YYYY-MM-DD string in local time and add days, returning YYYY-MM-DD. */
export function addDaysToDateStr(dateStr: string, days: number): string {
  const [y, m, d] = dateStr.split('-').map(Number);
  if (!y || !m || !d) return getLocalDateStr();
  const dt = new Date(y, m - 1, d + days);
  return getLocalDateStr(dt);
}

/** Calculate stay nights between YYYY-MM-DD strings. Returns <= 0 when invalid. */
export function calculateStayNights(checkInDate: string, checkOutDate: string): number {
  const [y1, m1, d1] = checkInDate.split('-').map(Number);
  const [y2, m2, d2] = checkOutDate.split('-').map(Number);
  if (!y1 || !m1 || !d1 || !y2 || !m2 || !d2) return 0;
  const startUtc = Date.UTC(y1, m1 - 1, d1);
  const endUtc = Date.UTC(y2, m2 - 1, d2);
  return Math.round((endUtc - startUtc) / (1000 * 60 * 60 * 24));
}

/** Half-open date range overlap: [startA, endA) overlaps [startB, endB). */
export function datesOverlap(
  startA: string,
  endA: string,
  startB: string,
  endB: string
): boolean {
  return startA < endB && startB < endA;
}

/** Check whether a physical room already has an active overlapping booking. */
export function isRoomBookedForDates(
  roomNumber: string,
  checkInDate: string,
  checkOutDate: string,
  bookings: Booking[],
  excludeBookingId?: string
): boolean {
  return bookings.some(
    (b) =>
      b.id !== excludeBookingId &&
      b.roomNumberAssigned === roomNumber &&
      b.bookingStatus !== 'Cancelled' &&
      b.bookingStatus !== 'Checked-Out' &&
      datesOverlap(checkInDate, checkOutDate, b.checkInDate, b.checkOutDate)
  );
}

/**
 * Find the first available physical room in a category for the requested dates.
 * Respects both live room instance status and overlapping active bookings.
 */
export function findAvailableRoomForBooking(
  category: RoomCategory,
  roomInstances: RoomInstanceStatus[],
  bookings: Booking[],
  checkInDate: string,
  checkOutDate: string
): string | undefined {
  for (const roomNumber of category.roomNumbers) {
    const inst = roomInstances.find((r) => r.roomNumber === roomNumber);
    if (inst && inst.status !== 'Available') {
      continue;
    }
    if (!isRoomBookedForDates(roomNumber, checkInDate, checkOutDate, bookings)) {
      return roomNumber;
    }
  }
  return undefined;
}

export interface PromoEvaluationResult {
  valid: boolean;
  promo?: PromoCode;
  discount: number;
  message: string;
}

/** Validate a promo code against active status, expiry date, minimum spend, and subtotal cap. */
export function evaluatePromoCode(
  promoCodes: PromoCode[],
  codeStr: string,
  subtotal: number,
  todayStr: string = getLocalDateStr()
): PromoEvaluationResult {
  const clean = codeStr.trim().toUpperCase();
  if (!clean) {
    return { valid: false, discount: 0, message: 'Please enter a promo code.' };
  }

  const found = promoCodes.find((p) => p.code.toUpperCase() === clean);
  if (!found || !found.isActive) {
    return { valid: false, discount: 0, message: 'Invalid or inactive promo code.' };
  }

  if (found.expiryDate && found.expiryDate < todayStr) {
    return {
      valid: false,
      discount: 0,
      message: `Promo code ${found.code} expired on ${found.expiryDate}.`,
    };
  }

  if (subtotal < found.minBookingAmount) {
    return {
      valid: false,
      discount: 0,
      message: `Minimum booking subtotal of ₹${found.minBookingAmount} required for ${found.code}.`,
    };
  }

  const rawDiscount =
    found.discountType === 'flat'
      ? found.discountValue
      : Math.round((subtotal * found.discountValue) / 100);
  const discount = Math.max(0, Math.min(rawDiscount, subtotal));

  return {
    valid: true,
    promo: found,
    discount,
    message: `Coupon applied! You save ₹${discount}.`,
  };
}

export interface BookingPricingBreakdown {
  basePriceNight: number;
  surchargeNight: number;
  nightlyTotal: number;
  subtotal: number;
  promoDiscount: number;
  taxAmount: number;
  totalAmount: number;
}

/** Single source of truth for room pricing, seasonal rates, discount cap, and 5% GST. */
export function calculateBookingPricing(
  category: RoomCategory,
  isPeakSeasonActive: boolean,
  nights: number,
  rawPromoDiscount: number
): BookingPricingBreakdown {
  const safeNights = Math.max(0, nights);
  const basePriceNight = category.basePriceOffSeason;
  const surchargeNight = isPeakSeasonActive
    ? Math.max(0, category.basePricePeakSeason - category.basePriceOffSeason)
    : 0;
  const nightlyTotal = basePriceNight + surchargeNight;
  const subtotal = nightlyTotal * safeNights;
  const promoDiscount = Math.max(0, Math.min(rawPromoDiscount, subtotal));
  const discountableSubtotal = Math.max(0, subtotal - promoDiscount);
  const taxAmount = Math.round(discountableSubtotal * 0.05);
  const totalAmount = discountableSubtotal + taxAmount;

  return {
    basePriceNight,
    surchargeNight,
    nightlyTotal,
    subtotal,
    promoDiscount,
    taxAmount,
    totalAmount,
  };
}

/** Generate a unique booking ID that does not collide with existing records. */
export function generateBookingId(existingBookings: Booking[]): string {
  const existingIds = new Set(existingBookings.map((b) => b.id));
  for (let i = 0; i < 25; i++) {
    const candidate = `KGH-BKG-${Math.floor(1000 + Math.random() * 9000)}`;
    if (!existingIds.has(candidate)) {
      return candidate;
    }
  }
  return `KGH-BKG-${Date.now().toString().slice(-6)}`;
}

/** Allow only http/https URLs to prevent javascript: or data: href injection. */
export function sanitizeHttpUrl(url?: string): string | undefined {
  if (!url) return undefined;
  try {
    const parsed = new URL(url.trim());
    if (parsed.protocol === 'http:' || parsed.protocol === 'https:') {
      return parsed.href;
    }
  } catch {
    return undefined;
  }
  return undefined;
}

/** Validate a phone number contains 10 to 13 digits. */
export function isValidPhoneNumber(phone: string): boolean {
  const digits = phone.replace(/\D/g, '');
  return digits.length >= 10 && digits.length <= 13;
}
