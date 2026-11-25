export type UserRole = 'customer' | 'super_admin' | 'admin' | 'sub_admin';

export type ActiveView = 'home' | 'rooms' | 'gallery' | 'faqs' | 'my-bookings' | 'admin';

export type AdminTab =
  | 'availability'
  | 'bookings'
  | 'categories'
  | 'amenities'
  | 'promos'
  | 'faqs'
  | 'staff'
  | 'audit'
  | 'settings';

export type RoomClimateFilter = 'all' | 'AC' | 'Non-AC';
export type RoomBedFilter = 'all' | 'Single Bed' | 'Double Bed' | 'Deluxe Family Bed';

export interface User {
  id: string;
  name: string;
  email: string;
  username: string;
  /** Client-side demo passcode until backend authentication is wired up. */
  password?: string;
  role: UserRole;
  phone?: string;
  idType?: 'Aadhaar Card' | 'Voter ID' | 'School/College ID card';
  idNumber?: string;
  createdAt: string;
}

export type RoomStatus = 'Available' | 'Occupied' | 'Cleaning/Maintenance' | 'Reserved';

export interface Amenity {
  id: string;
  name: string;
  iconName: string; // Lucide icon key
  description: string;
  isGlobal: boolean; // if true, shown across all rooms
}

export interface RoomCategory {
  id: string;
  title: string; // e.g. "Non AC Single Bed", "AC Double Bed"
  type: 'AC' | 'Non-AC';
  bedType: 'Single Bed' | 'Double Bed' | 'Deluxe Family Bed';
  basePriceOffSeason: number; // e.g. 900
  basePricePeakSeason: number; // e.g. 1000
  description: string;
  maxCapacity: number;
  imageUrl: string;
  amenityIds: string[];
  roomNumbers: string[]; // e.g. ['101', '102', '103']
  liveStatus: RoomStatus; // Overall default live status
  isVisible: boolean;
}

export interface RoomInstanceStatus {
  roomNumber: string;
  categoryId: string;
  status: RoomStatus;
  lastUpdatedBy?: string;
  lastUpdatedAt?: string;
}

export interface PromoCode {
  id: string;
  code: string; // e.g. FESTIVE100
  discountType: 'flat' | 'percentage';
  discountValue: number; // e.g. 200 (flat ₹200) or 15 (15%)
  minBookingAmount: number;
  expiryDate: string;
  isActive: boolean;
  usageCount: number;
}

export interface Booking {
  id: string; // e.g. KGH-BKG-1092
  userId?: string;
  guestName: string;
  guestEmail: string;
  guestPhone: string;
  idType: 'Aadhaar Card' | 'Voter ID' | 'School/College ID card';
  idNumber: string;
  categoryId: string;
  categoryTitle: string;
  roomNumberAssigned?: string;
  checkInDate: string;
  checkOutDate: string;
  stayDurationDays: number;
  guestCount: number;
  basePricePerNight: number;
  seasonalSurchargePerNight: number;
  subtotal: number;
  promoCodeApplied?: string;
  promoDiscount: number;
  taxAmount: number;
  totalAmount: number;
  bookingStatus: 'Confirmed' | 'Checked-In' | 'Checked-Out' | 'Cancelled' | 'Pending';
  paymentStatus: 'Paid Online' | 'Pay at Hotel' | 'Advance Paid';
  createdAt: string;
  notes?: string;
}

export interface StaffAuditLog {
  id: string;
  timestamp: string;
  staffName: string;
  staffRole: UserRole;
  actionCategory: 'Room Management' | 'Booking Action' | 'Amenity Change' | 'Promo Code' | 'Staff Config' | 'System Setting';
  details: string;
}

export interface FAQItem {
  id: string;
  question: string;
  answer: string;
  category: 'Check-In/Out' | 'Pricing & Booking' | 'Amenities' | 'Policies';
  isPublished: boolean;
}

export interface HotelConfig {
  hotelName: string;
  tagline: string;
  email: string;
  phones: string[];
  phoneDisclaimer: string;
  googleTravelUrl: string;
  address: string;
  landmark: string;
  checkInTime: string; // e.g. "12:00 PM"
  checkOutTime: string; // e.g. "11:00 AM"
  isPeakSeasonActive: boolean;
  peakSeasonName: string; // e.g. "Pitrapaksha & Winter Dalai Lama Season"
  peakSeasonSurchargeFlat: number; // e.g. 300
  aboutText: string;
  policies: string[];
}
