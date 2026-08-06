import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useApp } from '../context/AppContext';
import {
  X,
  Hotel,
  Sparkles,
  Calendar,
  BedDouble,
  CreditCard,
  UserCheck,
  Crown,
  ShieldCheck,
  CheckCircle2,
  ArrowRight,
  MapPin,
  Clock,
  Briefcase,
  Users,
  Building2,
  FileText,
} from 'lucide-react';
import { User, Booking } from '../types';

export const WelcomeAnimationModal: React.FC = () => {
  const {
    welcomeUser,
    showWelcomeModal,
    setShowWelcomeModal,
    bookings,
    setActiveView,
    setInvoiceModalBooking,
    roomCategories,
  } = useApp();

  const [timeLeft, setTimeLeft] = useState(8);
  const [isPaused, setIsPaused] = useState(false);

  // Auto dismiss after 8 seconds
  useEffect(() => {
    if (!showWelcomeModal || isPaused) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          setShowWelcomeModal(false);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [showWelcomeModal, isPaused, setShowWelcomeModal]);

  // Reset timer when modal opens
  useEffect(() => {
    if (showWelcomeModal) {
      setTimeLeft(8);
      setIsPaused(false);
    }
  }, [showWelcomeModal]);

  if (!showWelcomeModal || !welcomeUser) {
    return null;
  }

  // Time of day greeting
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 17) return 'Good Afternoon';
    return 'Good Evening';
  };

  // Role info helpers
  const getRoleBadge = (role: User['role']) => {
    switch (role) {
      case 'super_admin':
        return {
          title: 'Owner / Super Admin',
          icon: Crown,
          bg: 'bg-amber-500/10 text-amber-400 border-amber-500/30',
        };
      case 'admin':
        return {
          title: 'Hotel Manager',
          icon: ShieldCheck,
          bg: 'bg-amber-500/10 text-amber-400 border-amber-500/30',
        };
      case 'sub_admin':
        return {
          title: 'Front Desk Staff',
          icon: UserCheck,
          bg: 'bg-blue-500/10 text-blue-400 border-blue-500/30',
        };
      case 'customer':
      default:
        return {
          title: 'Valued Guest',
          icon: Sparkles,
          bg: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
        };
    }
  };

  const roleInfo = getRoleBadge(welcomeUser.role);
  const RoleIcon = roleInfo.icon;

  // Find upcoming booking for customer
  const userBookings = bookings.filter((b) => {
    if (b.bookingStatus === 'Cancelled') return false;
    const isMatchingUser =
      (b.userId && b.userId === welcomeUser.id) ||
      (welcomeUser.email && b.guestEmail?.toLowerCase() === welcomeUser.email.toLowerCase()) ||
      (welcomeUser.name && b.guestName?.toLowerCase() === welcomeUser.name.toLowerCase());
    return isMatchingUser;
  });

  // Pick active or upcoming booking
  const upcomingBooking = userBookings.length > 0 ? userBookings[0] : null;

  // Operational stats for staff/admin
  const isStaff = welcomeUser.role !== 'customer';
  const activeCheckIns = bookings.filter((b) => b.bookingStatus === 'Checked-In').length;
  const confirmedBookings = bookings.filter((b) => b.bookingStatus === 'Confirmed').length;

  const handleOpenInvoice = (b: Booking) => {
    setInvoiceModalBooking(b);
    setShowWelcomeModal(false);
  };

  const handleBrowseRooms = () => {
    setActiveView('rooms');
    setShowWelcomeModal(false);
  };

  const handleOpenAdmin = () => {
    setActiveView('admin');
    setShowWelcomeModal(false);
  };

  return (
    <AnimatePresence>
      {showWelcomeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop Blur */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowWelcomeModal(false)}
            className="absolute inset-0 bg-black/80 backdrop-blur-md"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 25 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: -20 }}
            transition={{ type: 'spring', damping: 26, stiffness: 320 }}
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
            className="relative w-full max-w-lg bg-[#0A0A0A] border border-amber-500/30 rounded-3xl shadow-2xl overflow-hidden text-white my-8 z-10"
          >
            {/* Top Accent Gradient Line */}
            <div className="h-1.5 w-full bg-gradient-to-r from-amber-600 via-amber-400 to-amber-600" />

            {/* Modal Header */}
            <div className="p-6 pb-4 flex items-start justify-between border-b border-white/10">
              <div className="flex items-center gap-3">
                <motion.div
                  initial={{ rotate: -10, scale: 0.8 }}
                  animate={{ rotate: 0, scale: 1 }}
                  transition={{ type: 'spring', stiffness: 200 }}
                  className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-400 flex items-center justify-center shadow-inner"
                >
                  <Hotel className="w-6 h-6" />
                </motion.div>
                <div>
                  <div className="text-[10px] uppercase font-mono font-bold tracking-widest text-amber-400 flex items-center gap-1">
                    <Sparkles className="w-3 h-3" />
                    <span>KUMAR GUEST HOUSE</span>
                  </div>
                  <h2 className="text-xl font-bold text-white tracking-tight">
                    Welcome Back Portal
                  </h2>
                </div>
              </div>

              <button
                onClick={() => setShowWelcomeModal(false)}
                className="p-2 rounded-xl text-gray-400 hover:text-white hover:bg-white/10 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Body Content */}
            <div className="p-6 space-y-6">
              {/* Personalized Greeting Card */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="p-4 rounded-2xl bg-gradient-to-br from-amber-950/30 via-zinc-900 to-zinc-950 border border-amber-500/20 flex items-center justify-between gap-4"
              >
                <div className="space-y-1">
                  <div className="text-xs font-medium text-gray-400">
                    {getGreeting()},
                  </div>
                  <h3 className="text-2xl font-black text-white tracking-tight">
                    {welcomeUser.name}
                  </h3>
                  <div className="flex items-center gap-2 pt-1">
                    <span
                      className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold border ${roleInfo.bg}`}
                    >
                      <RoleIcon className="w-3 h-3" />
                      <span>{roleInfo.title}</span>
                    </span>
                    <span className="text-[10px] text-gray-500 font-mono">
                      {welcomeUser.email}
                    </span>
                  </div>
                </div>

                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-amber-400 to-amber-600 text-black font-extrabold text-lg flex items-center justify-center shadow-lg shadow-amber-500/20 border-2 border-amber-300 shrink-0">
                  {welcomeUser.name.charAt(0).toUpperCase()}
                </div>
              </motion.div>

              {/* Upcoming Booking or Operations Summary */}
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="space-y-3"
              >
                <div className="flex items-center justify-between text-xs font-bold text-gray-400 uppercase tracking-wider">
                  <span>{isStaff ? 'Operations Overview' : 'Upcoming Stay Summary'}</span>
                  <span className="text-[10px] text-amber-400 font-mono">
                    {isStaff ? 'Staff Portal' : userBookings.length > 0 ? `${userBookings.length} Booking(s)` : 'No Stay'}
                  </span>
                </div>

                {!isStaff && upcomingBooking ? (
                  /* Customer Upcoming Reservation Summary Card */
                  <div className="p-4 rounded-2xl bg-zinc-900/90 border border-white/10 hover:border-amber-500/40 transition-all space-y-3">
                    <div className="flex items-start justify-between gap-2 border-b border-white/10 pb-3">
                      <div>
                        <div className="text-[10px] text-amber-400 font-mono font-bold">
                          RESERVATION #{upcomingBooking.id}
                        </div>
                        <div className="text-base font-bold text-white mt-0.5 flex items-center gap-2">
                          <span>{upcomingBooking.categoryTitle}</span>
                          {upcomingBooking.roomNumberAssigned && (
                            <span className="px-2 py-0.5 text-[10px] font-mono bg-amber-500/10 text-amber-300 border border-amber-500/30 rounded-md">
                              Room {upcomingBooking.roomNumberAssigned}
                            </span>
                          )}
                        </div>
                      </div>

                      <span
                        className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                          upcomingBooking.bookingStatus === 'Confirmed'
                            ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                            : upcomingBooking.bookingStatus === 'Checked-In'
                            ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                            : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                        }`}
                      >
                        {upcomingBooking.bookingStatus}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-3 text-xs text-gray-300 font-mono">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-amber-400 shrink-0" />
                        <div>
                          <div className="text-[10px] text-gray-500">Dates</div>
                          <div>
                            {upcomingBooking.checkInDate} ➔ {upcomingBooking.checkOutDate}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <Users className="w-4 h-4 text-amber-400 shrink-0" />
                        <div>
                          <div className="text-[10px] text-gray-500">Guests & Duration</div>
                          <div>
                            {upcomingBooking.guestCount} Guest(s) • {upcomingBooking.stayDurationDays} Night(s)
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <CreditCard className="w-4 h-4 text-amber-400 shrink-0" />
                        <div>
                          <div className="text-[10px] text-gray-500">Payment Status</div>
                          <div>{upcomingBooking.paymentStatus}</div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <FileText className="w-4 h-4 text-amber-400 shrink-0" />
                        <div>
                          <div className="text-[10px] text-gray-500">Total Payable</div>
                          <div className="text-amber-400 font-bold">
                            ₹{upcomingBooking.totalAmount.toLocaleString()}
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="pt-2 border-t border-white/5 flex items-center justify-between">
                      <span className="text-[10px] text-gray-400">
                        Check-in time: 12:00 PM • Vishnupad Temple Gate
                      </span>
                      <button
                        onClick={() => handleOpenInvoice(upcomingBooking)}
                        className="text-xs text-amber-400 hover:text-amber-300 font-bold flex items-center gap-1 cursor-pointer"
                      >
                        <span>View Invoice</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ) : !isStaff ? (
                  /* Customer No Upcoming Booking Card */
                  <div className="p-4 rounded-2xl bg-zinc-900/80 border border-white/10 text-center space-y-3">
                    <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center mx-auto border border-amber-500/20">
                      <BedDouble className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-white">No Active Reservations</h4>
                      <p className="text-xs text-gray-400 mt-1 max-w-sm mx-auto">
                        Planning a pilgrimage or visit to Gaya? Book your comfortable stay near Vishnupad Temple today.
                      </p>
                    </div>
                    <button
                      onClick={handleBrowseRooms}
                      className="px-4 py-2 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 text-amber-300 text-xs font-bold transition-all inline-flex items-center gap-1.5 cursor-pointer"
                    >
                      <BedDouble className="w-3.5 h-3.5" />
                      <span>Browse Rooms & Rates</span>
                    </button>
                  </div>
                ) : (
                  /* Staff / Admin Operational Overview Card */
                  <div className="p-4 rounded-2xl bg-zinc-900/80 border border-white/10 space-y-3">
                    <div className="grid grid-cols-2 gap-3 text-xs">
                      <div className="p-3 bg-zinc-950 rounded-xl border border-zinc-800">
                        <div className="text-[10px] text-gray-400 font-mono uppercase">
                          Active Check-Ins
                        </div>
                        <div className="text-2xl font-black text-emerald-400 font-mono mt-1">
                          {activeCheckIns} <span className="text-xs text-gray-500 font-sans">rooms</span>
                        </div>
                      </div>

                      <div className="p-3 bg-zinc-950 rounded-xl border border-zinc-800">
                        <div className="text-[10px] text-gray-400 font-mono uppercase">
                          Confirmed Upcoming
                        </div>
                        <div className="text-2xl font-black text-amber-400 font-mono mt-1">
                          {confirmedBookings} <span className="text-xs text-gray-500 font-sans">guests</span>
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={handleOpenAdmin}
                      className="w-full py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-black text-xs font-bold flex items-center justify-center gap-2 transition-colors cursor-pointer"
                    >
                      <Briefcase className="w-4 h-4" />
                      <span>Go to Staff & Admin Console</span>
                    </button>
                  </div>
                )}
              </motion.div>
            </div>

            {/* Modal Footer & Auto-Dismiss Bar */}
            <div className="px-6 py-4 bg-zinc-950 border-t border-white/10 flex items-center justify-between gap-4">
              <div className="text-[11px] text-gray-500 flex items-center gap-1.5 font-mono">
                <Clock className="w-3.5 h-3.5 text-amber-400/80" />
                <span>
                  {isPaused ? 'Auto-dismiss paused' : `Closing in ${timeLeft}s`}
                </span>
              </div>

              <button
                onClick={() => setShowWelcomeModal(false)}
                className="px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-black text-xs font-bold transition-colors cursor-pointer flex items-center gap-1"
              >
                <span>Continue to Site</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Auto Dismiss Progress Bar */}
            <div className="w-full bg-zinc-800 h-1 overflow-hidden">
              <motion.div
                key={showWelcomeModal ? 'active' : 'inactive'}
                initial={{ width: '100%' }}
                animate={{ width: isPaused ? `${(timeLeft / 8) * 100}%` : '0%' }}
                transition={{ duration: isPaused ? 0.2 : timeLeft, ease: 'linear' }}
                className="h-full bg-gradient-to-r from-amber-500 to-amber-300"
              />
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
