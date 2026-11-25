import React, { useMemo, useState } from 'react';
import { useApp } from '../context/AppContext';
import { RoomCategory } from '../types';
import {
  addDaysToDateStr,
  calculateBookingPricing,
  calculateStayNights,
  evaluatePromoCode,
  findAvailableRoomForBooking,
  getLocalDateStr,
  isValidPhoneNumber,
} from '../utils/bookingUtils';
import {
  Calendar,
  CheckCircle2,
  CreditCard,
  ShieldAlert,
  Tag,
  User,
  X,
} from 'lucide-react';

interface BookingModalProps {
  category: RoomCategory;
  onClose: () => void;
}

export const BookingModal: React.FC<BookingModalProps> = ({ category, onClose }) => {
  const {
    hotelConfig,
    currentUser,
    roomInstances,
    bookings,
    promoCodes,
    createBooking,
    setInvoiceModalBooking,
  } = useApp();

  const todayStr = getLocalDateStr();
  const tomorrowStr = addDaysToDateStr(todayStr, 1);

  const [guestName, setGuestName] = useState(currentUser?.name || '');
  const [guestEmail, setGuestEmail] = useState(currentUser?.email || '');
  const [guestPhone, setGuestPhone] = useState(currentUser?.phone || '');
  const [idType, setIdType] = useState<'Aadhaar Card' | 'Voter ID' | 'School/College ID card'>(
    currentUser?.idType || 'Aadhaar Card'
  );
  const [idNumber, setIdNumber] = useState(currentUser?.idNumber || '');
  const [checkInDate, setCheckInDate] = useState(todayStr);
  const [checkOutDate, setCheckOutDate] = useState(tomorrowStr);
  const [guestCount, setGuestCount] = useState(1);
  const [paymentOption, setPaymentOption] = useState<'Paid Online' | 'Pay at Hotel'>('Pay at Hotel');

  const [promoCodeInput, setPromoCodeInput] = useState('');
  const [appliedPromoCode, setAppliedPromoCode] = useState<string | null>(null);
  const [promoError, setPromoError] = useState('');
  const [formError, setFormError] = useState('');

  const stayDuration = calculateStayNights(checkInDate, checkOutDate);
  const isDateRangeValid = checkInDate >= todayStr && stayDuration >= 1;

  const basePricing = useMemo(
    () =>
      calculateBookingPricing(
        category,
        hotelConfig.isPeakSeasonActive,
        Math.max(1, stayDuration),
        0
      ),
    [category, hotelConfig.isPeakSeasonActive, stayDuration]
  );

  const activePromoEval = useMemo(() => {
    if (!appliedPromoCode) return null;
    return evaluatePromoCode(promoCodes, appliedPromoCode, basePricing.subtotal, todayStr);
  }, [appliedPromoCode, promoCodes, basePricing.subtotal, todayStr]);

  const promoDiscount = activePromoEval?.valid ? activePromoEval.discount : 0;

  const pricing = useMemo(
    () =>
      calculateBookingPricing(
        category,
        hotelConfig.isPeakSeasonActive,
        Math.max(1, stayDuration),
        promoDiscount
      ),
    [category, hotelConfig.isPeakSeasonActive, stayDuration, promoDiscount]
  );

  const availableRoomForDates = useMemo(() => {
    if (!isDateRangeValid) return undefined;
    return findAvailableRoomForBooking(
      category,
      roomInstances,
      bookings,
      checkInDate,
      checkOutDate
    );
  }, [category, roomInstances, bookings, checkInDate, checkOutDate, isDateRangeValid]);

  const handleCheckInChange = (nextCheckIn: string) => {
    setCheckInDate(nextCheckIn);
    if (checkOutDate <= nextCheckIn) {
      setCheckOutDate(addDaysToDateStr(nextCheckIn, 1));
    }
    setFormError('');
  };

  const handleApplyPromo = () => {
    setPromoError('');
    if (!promoCodeInput.trim()) return;

    const res = evaluatePromoCode(promoCodes, promoCodeInput, basePricing.subtotal, todayStr);
    if (res.valid && res.promo) {
      setAppliedPromoCode(res.promo.code);
    } else {
      setPromoError(res.message);
      setAppliedPromoCode(null);
    }
  };

  const handleRemovePromo = () => {
    setAppliedPromoCode(null);
    setPromoCodeInput('');
    setPromoError('');
  };

  const handleSubmitBooking = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');

    if (!guestName.trim() || !guestPhone.trim() || !idNumber.trim()) {
      setFormError('Please fill in all required guest information fields.');
      return;
    }

    if (!isValidPhoneNumber(guestPhone)) {
      setFormError('Please enter a valid 10-digit mobile number.');
      return;
    }

    if (!isDateRangeValid) {
      setFormError('Check-out date must be at least 1 night after check-in (from today onwards).');
      return;
    }

    if (!availableRoomForDates) {
      setFormError('No rooms in this category are available for your selected dates.');
      return;
    }

    const result = createBooking({
      userId: currentUser?.id,
      guestName: guestName.trim(),
      guestEmail: guestEmail.trim() || `${guestPhone.replace(/\D/g, '')}@guest.example`,
      guestPhone: guestPhone.trim(),
      idType,
      idNumber: idNumber.trim(),
      categoryId: category.id,
      categoryTitle: category.title,
      roomNumberAssigned: availableRoomForDates,
      checkInDate,
      checkOutDate,
      stayDurationDays: stayDuration,
      guestCount,
      basePricePerNight: pricing.basePriceNight,
      seasonalSurchargePerNight: pricing.surchargeNight,
      subtotal: pricing.subtotal,
      promoCodeApplied: activePromoEval?.valid ? activePromoEval.promo?.code : undefined,
      promoDiscount: pricing.promoDiscount,
      taxAmount: pricing.taxAmount,
      totalAmount: pricing.totalAmount,
      bookingStatus: 'Confirmed',
      paymentStatus: paymentOption,
      notes: `Booked via Kumar Guest House portal. ID: ${idType} (${idNumber.trim()}).`,
    });

    if (!result.success || !result.booking) {
      setFormError(result.message);
      return;
    }

    onClose();
    setInvoiceModalBooking(result.booking);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-3xl bg-zinc-950 border border-zinc-800 rounded-2xl shadow-2xl overflow-hidden my-8 text-white">
        {/* Modal Header */}
        <div className="bg-zinc-900 px-6 py-4 border-b border-zinc-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Calendar className="w-5 h-5 text-amber-400" />
            <h2 className="text-lg font-bold text-white">
              Reserve Room: <span className="text-amber-400">{category.title}</span>
            </h2>
          </div>
          <button
            onClick={onClose}
            aria-label="Close booking dialog"
            className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body Form */}
        <form onSubmit={handleSubmitBooking} className="p-6 space-y-6">
          {formError && (
            <div className="p-3 rounded-xl bg-rose-950/80 border border-rose-800/60 text-xs text-rose-200 flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-rose-400 shrink-0" />
              <span>{formError}</span>
            </div>
          )}

          <div className="grid md:grid-cols-2 gap-6">
            {/* Left Column: Guest Inputs */}
            <div className="space-y-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-amber-400 flex items-center gap-1.5 border-b border-zinc-800 pb-2">
                <User className="w-4 h-4" /> Guest Information
              </h3>

              <div>
                <label className="block text-xs font-medium text-zinc-300 mb-1">
                  Full Booking Name <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={guestName}
                  onChange={(e) => setGuestName(e.target.value)}
                  placeholder="e.g. Priya Sharma"
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-zinc-300 mb-1">
                    Phone Number <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="tel"
                    required
                    value={guestPhone}
                    onChange={(e) => setGuestPhone(e.target.value)}
                    placeholder="10-digit mobile"
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none focus:border-amber-500 font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-zinc-300 mb-1">Email Address</label>
                  <input
                    type="email"
                    value={guestEmail}
                    onChange={(e) => setGuestEmail(e.target.value)}
                    placeholder="guest@example.com"
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              {/* ID Type & ID Number Requirement */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-zinc-300 mb-1">
                    ID Document Type <span className="text-red-400">*</span>
                  </label>
                  <select
                    value={idType}
                    onChange={(e) =>
                      setIdType(e.target.value as 'Aadhaar Card' | 'Voter ID' | 'School/College ID card')
                    }
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none focus:border-amber-500"
                  >
                    <option value="Aadhaar Card">Aadhaar Card</option>
                    <option value="Voter ID">Voter ID</option>
                    <option value="School/College ID card">School/College ID card</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-zinc-300 mb-1">
                    ID Number / Ref <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={idNumber}
                    onChange={(e) => setIdNumber(e.target.value)}
                    placeholder="e.g. XXXX-XXXX-0001"
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none focus:border-amber-500 font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-zinc-300 mb-1">Check-in Date</label>
                  <input
                    type="date"
                    required
                    min={todayStr}
                    value={checkInDate}
                    onChange={(e) => handleCheckInChange(e.target.value)}
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none focus:border-amber-500 font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-zinc-300 mb-1">Check-out Date</label>
                  <input
                    type="date"
                    required
                    min={addDaysToDateStr(checkInDate, 1)}
                    value={checkOutDate}
                    onChange={(e) => {
                      setCheckOutDate(e.target.value);
                      setFormError('');
                    }}
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none focus:border-amber-500 font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-zinc-300 mb-1">Guest Count</label>
                  <select
                    value={guestCount}
                    onChange={(e) => setGuestCount(Number(e.target.value))}
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none focus:border-amber-500"
                  >
                    {[...Array(category.maxCapacity)].map((_, i) => (
                      <option key={i + 1} value={i + 1}>
                        {i + 1} Guest{i > 0 ? 's' : ''}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-zinc-300 mb-1">Payment Method</label>
                  <select
                    value={paymentOption}
                    onChange={(e) =>
                      setPaymentOption(e.target.value as 'Paid Online' | 'Pay at Hotel')
                    }
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none focus:border-amber-500"
                  >
                    <option value="Pay at Hotel">Pay Cash/UPI at Hotel</option>
                    <option value="Paid Online">Instant Online Payment (Demo)</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Right Column: Pricing & Discounts */}
            <div className="space-y-4 bg-zinc-900/60 p-4 rounded-xl border border-zinc-800/80 flex flex-col justify-between">
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-amber-400 flex items-center justify-between border-b border-zinc-800 pb-2 mb-3">
                  <span className="flex items-center gap-1.5">
                    <CreditCard className="w-4 h-4" /> Booking Cost Breakdown
                  </span>
                  <span className="text-zinc-400 font-mono text-[11px]">
                    {Math.max(1, stayDuration)} Night(s)
                  </span>
                </h3>

                {/* Room Allocation Preview */}
                <div className="mb-3 px-3 py-2 rounded-lg bg-zinc-950 border border-zinc-800 text-[11px] font-mono flex items-center justify-between">
                  <span className="text-zinc-400">Room Allocation:</span>
                  {availableRoomForDates ? (
                    <span className="text-emerald-400 font-bold">Room #{availableRoomForDates} Ready</span>
                  ) : (
                    <span className="text-rose-400 font-bold">Unavailable for selected dates</span>
                  )}
                </div>

                {/* Promo Code Input Engine */}
                <div className="mb-4">
                  <label className="block text-[11px] font-semibold text-zinc-400 mb-1 flex items-center gap-1">
                    <Tag className="w-3.5 h-3.5 text-amber-400" /> Apply Coupon / Promo Code
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={promoCodeInput}
                      onChange={(e) => setPromoCodeInput(e.target.value)}
                      placeholder="e.g. WELCOME100 or FESTIVE15"
                      className="flex-1 bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-1.5 text-xs text-white uppercase font-mono focus:outline-none focus:border-amber-500"
                    />
                    {appliedPromoCode ? (
                      <button
                        type="button"
                        onClick={handleRemovePromo}
                        className="px-3 py-1.5 bg-red-950 text-red-300 border border-red-800/60 rounded-lg text-xs font-medium hover:bg-red-900/60"
                      >
                        Remove
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={handleApplyPromo}
                        className="px-3 py-1.5 bg-amber-500 text-zinc-950 font-bold rounded-lg text-xs hover:bg-amber-400 cursor-pointer"
                      >
                        Apply
                      </button>
                    )}
                  </div>
                  {activePromoEval?.valid && (
                    <p className="text-[11px] text-emerald-400 mt-1 flex items-center gap-1 font-medium">
                      <CheckCircle2 className="w-3.5 h-3.5" /> {activePromoEval.message}
                    </p>
                  )}
                  {(promoError || (activePromoEval && !activePromoEval.valid)) && (
                    <p className="text-[11px] text-rose-400 mt-1 flex items-center gap-1">
                      <ShieldAlert className="w-3.5 h-3.5 shrink-0" />{' '}
                      {activePromoEval && !activePromoEval.valid
                        ? activePromoEval.message
                        : promoError}
                    </p>
                  )}
                </div>

                {/* Detailed Math List */}
                <div className="space-y-2 text-xs text-zinc-300 font-mono pt-2">
                  <div className="flex justify-between">
                    <span>
                      Base Rate ({Math.max(1, stayDuration)} night x ₹{pricing.basePriceNight})
                    </span>
                    <span>₹{pricing.basePriceNight * Math.max(1, stayDuration)}</span>
                  </div>

                  {hotelConfig.isPeakSeasonActive && pricing.surchargeNight > 0 && (
                    <div className="flex justify-between text-amber-400">
                      <span>Peak Season Rate (+₹{pricing.surchargeNight}/night)</span>
                      <span>+₹{pricing.surchargeNight * Math.max(1, stayDuration)}</span>
                    </div>
                  )}

                  {pricing.promoDiscount > 0 && (
                    <div className="flex justify-between text-emerald-400">
                      <span>Promo Coupon Discount ({activePromoEval?.promo?.code})</span>
                      <span>-₹{pricing.promoDiscount}</span>
                    </div>
                  )}

                  <div className="flex justify-between text-zinc-400">
                    <span>GST &amp; Service Charge (5%)</span>
                    <span>+₹{pricing.taxAmount}</span>
                  </div>

                  <div className="border-t border-zinc-800 pt-2 flex justify-between text-sm font-bold text-white">
                    <span>Total Amount Payable</span>
                    <span className="text-amber-400 text-lg">₹{pricing.totalAmount}</span>
                  </div>
                </div>
              </div>

              {/* Submit Buttons */}
              <div className="pt-4 border-t border-zinc-800">
                <button
                  type="submit"
                  disabled={!isDateRangeValid || !availableRoomForDates}
                  className={`w-full py-3.5 rounded-xl font-extrabold text-sm transition-all flex items-center justify-center gap-2 ${
                    isDateRangeValid && availableRoomForDates
                      ? 'bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-zinc-950 shadow-xl shadow-amber-500/20 cursor-pointer'
                      : 'bg-zinc-800 text-zinc-500 cursor-not-allowed'
                  }`}
                >
                  <CheckCircle2 className="w-5 h-5" />
                  <span>Confirm Booking &amp; Generate PDF Receipt</span>
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
