import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { RoomCategory, Booking } from '../types';
import {
  X,
  Calendar,
  User,
  CreditCard,
  Phone,
  Mail,
  Users,
  CheckCircle2,
  Tag,
  Sparkles,
  Printer,
  ShieldAlert,
} from 'lucide-react';

interface BookingModalProps {
  category: RoomCategory;
  onClose: () => void;
}

export const BookingModal: React.FC<BookingModalProps> = ({ category, onClose }) => {
  const {
    hotelConfig,
    currentUser,
    validatePromoCode,
    createBooking,
    setInvoiceModalBooking,
  } = useApp();

  // Dates setup (default today to tomorrow)
  const todayStr = new Date().toISOString().split('T')[0];
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const tomorrowStr = tomorrow.toISOString().split('T')[0];

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

  // Coupon
  const [promoCodeInput, setPromoCodeInput] = useState('');
  const [appliedPromo, setAppliedPromo] = useState<{ code: string; discount: number; msg: string } | null>(null);
  const [promoError, setPromoError] = useState('');

  // Calculate stay duration in days
  const calculateDays = () => {
    const start = new Date(checkInDate);
    const end = new Date(checkOutDate);
    const diffTime = end.getTime() - start.getTime();
    const days = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return days > 0 ? days : 1;
  };

  const stayDuration = calculateDays();

  // Pricing math
  const basePriceNight = category.basePriceOffSeason;
  const surchargeNight = hotelConfig.isPeakSeasonActive ? category.basePricePeakSeason - category.basePriceOffSeason : 0;
  const nightlyTotal = basePriceNight + surchargeNight;
  const subtotal = nightlyTotal * stayDuration;

  // Promo discount
  const promoDiscount = appliedPromo ? appliedPromo.discount : 0;

  const discountableSubtotal = Math.max(0, subtotal - promoDiscount);
  const taxAmount = Math.round(discountableSubtotal * 0.05); // 5% GST
  const totalAmount = discountableSubtotal + taxAmount;

  const handleApplyPromo = () => {
    setPromoError('');
    if (!promoCodeInput.trim()) return;

    const res = validatePromoCode(promoCodeInput, subtotal);
    if (res.valid && res.promo) {
      setAppliedPromo({
        code: res.promo.code,
        discount: res.discount,
        msg: res.message,
      });
    } else {
      setPromoError(res.message);
      setAppliedPromo(null);
    }
  };

  const handleRemovePromo = () => {
    setAppliedPromo(null);
    setPromoCodeInput('');
    setPromoError('');
  };

  const handleSubmitBooking = (e: React.FormEvent) => {
    e.preventDefault();

    if (!guestName.trim() || !guestPhone.trim() || !idNumber.trim()) {
      alert('Please fill in all required guest information fields.');
      return;
    }

    const newBooking = createBooking({
      userId: currentUser?.id,
      guestName,
      guestEmail: guestEmail || `${guestPhone}@guest.com`,
      guestPhone,
      idType,
      idNumber,
      categoryId: category.id,
      categoryTitle: category.title,
      roomNumberAssigned: category.roomNumbers[0] || '101',
      checkInDate,
      checkOutDate,
      stayDurationDays: stayDuration,
      guestCount,
      basePricePerNight: basePriceNight,
      seasonalSurchargePerNight: surchargeNight,
      subtotal,
      promoCodeApplied: appliedPromo?.code,
      promoDiscount,
      taxAmount,
      totalAmount,
      bookingStatus: 'Confirmed',
      paymentStatus: paymentOption,
      notes: `Booked via Kumar Guest House portal. ID: ${idType} (${idNumber}).`,
    });

    onClose();
    // Auto-open Printable Receipt / Invoice Modal
    setInvoiceModalBooking(newBooking);
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
            className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body Form */}
        <form onSubmit={handleSubmitBooking} className="p-6 space-y-6">
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
                  placeholder="e.g. Amit Kumar Verma"
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
                    placeholder="guest@gmail.com"
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
                    placeholder="e.g. 4839-2019-9921"
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
                    value={checkInDate}
                    onChange={(e) => setCheckInDate(e.target.value)}
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none focus:border-amber-500 font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-zinc-300 mb-1">Check-out Date</label>
                  <input
                    type="date"
                    required
                    value={checkOutDate}
                    onChange={(e) => setCheckOutDate(e.target.value)}
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
                  <span className="text-zinc-400 font-mono text-[11px]">{stayDuration} Night(s)</span>
                </h3>

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
                    {appliedPromo ? (
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
                  {appliedPromo && (
                    <p className="text-[11px] text-emerald-400 mt-1 flex items-center gap-1 font-medium">
                      <CheckCircle2 className="w-3.5 h-3.5" /> {appliedPromo.msg}
                    </p>
                  )}
                  {promoError && (
                    <p className="text-[11px] text-rose-400 mt-1 flex items-center gap-1">
                      <ShieldAlert className="w-3.5 h-3.5" /> {promoError}
                    </p>
                  )}
                </div>

                {/* Detailed Math List */}
                <div className="space-y-2 text-xs text-zinc-300 font-mono pt-2">
                  <div className="flex justify-between">
                    <span>Base Rate ({stayDuration} night x ₹{basePriceNight})</span>
                    <span>₹{basePriceNight * stayDuration}</span>
                  </div>

                  {hotelConfig.isPeakSeasonActive && (
                    <div className="flex justify-between text-amber-400">
                      <span>Peak Season Surcharge (+₹{surchargeNight}/night)</span>
                      <span>+₹{surchargeNight * stayDuration}</span>
                    </div>
                  )}

                  {promoDiscount > 0 && (
                    <div className="flex justify-between text-emerald-400">
                      <span>Promo Coupon Discount ({appliedPromo?.code})</span>
                      <span>-₹{promoDiscount}</span>
                    </div>
                  )}

                  <div className="flex justify-between text-zinc-400">
                    <span>GST & Service Charge (5%)</span>
                    <span>+₹{taxAmount}</span>
                  </div>

                  <div className="border-t border-zinc-800 pt-2 flex justify-between text-sm font-bold text-white">
                    <span>Total Amount Payable</span>
                    <span className="text-amber-400 text-lg">₹{totalAmount}</span>
                  </div>
                </div>
              </div>

              {/* Submit Buttons */}
              <div className="pt-4 border-t border-zinc-800">
                <button
                  type="submit"
                  className="w-full py-3.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-zinc-950 font-extrabold text-sm shadow-xl shadow-amber-500/20 transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <CheckCircle2 className="w-5 h-5" />
                  <span>Confirm Booking & Generate PDF Receipt</span>
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
