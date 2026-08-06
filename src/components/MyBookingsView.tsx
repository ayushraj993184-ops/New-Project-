import React from 'react';
import { useApp } from '../context/AppContext';
import {
  Calendar,
  Printer,
  Clock,
  CheckCircle2,
  XCircle,
  FileText,
  Building,
  User,
  ArrowRight,
} from 'lucide-react';

export const MyBookingsView: React.FC = () => {
  const { currentUser, bookings, setInvoiceModalBooking, setActiveView, setIsLoginModalOpen } = useApp();

  if (!currentUser) {
    return (
      <div className="max-w-xl mx-auto my-16 p-8 bg-zinc-900 border border-zinc-800 rounded-2xl text-center space-y-4 text-white">
        <User className="w-12 h-12 text-amber-400 mx-auto" />
        <h2 className="text-xl font-bold">Sign In to View Your Reservations</h2>
        <p className="text-xs text-zinc-400">
          Sign in to access active room bookings and generate PDF receipts.
        </p>
        <button
          onClick={() => setIsLoginModalOpen(true)}
          className="px-6 py-2.5 rounded-xl bg-amber-500 text-zinc-950 font-bold text-xs"
        >
          Sign In Now
        </button>
      </div>
    );
  }

  const myBookings = bookings.filter(
    (b) => b.userId === currentUser.id || b.guestEmail.toLowerCase() === currentUser.email.toLowerCase()
  );

  return (
    <div className="max-w-5xl mx-auto px-4 py-10 space-y-8 text-white">
      {/* Reservation List */}
      <div className="space-y-4">
        <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <Calendar className="w-5 h-5 text-amber-400" />
            <span>My Active & Past Reservations</span>
          </h3>
          <span className="text-xs font-mono text-zinc-400">{myBookings.length} Total Bookings</span>
        </div>

        {myBookings.length === 0 ? (
          <div className="p-8 bg-zinc-900 border border-zinc-800 rounded-2xl text-center space-y-3">
            <p className="text-sm text-zinc-400">No active bookings found for your account.</p>
            <button
              onClick={() => setActiveView('rooms')}
              className="px-5 py-2.5 rounded-xl bg-amber-500 text-zinc-950 font-bold text-xs"
            >
              Browse Rooms & Book Now
            </button>
          </div>
        ) : (
          <div className="grid gap-4">
            {myBookings.map((b) => (
              <div
                key={b.id}
                className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5 hover:border-amber-500/30 transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-white text-base">{b.categoryTitle}</span>
                    <span
                      className={`px-2.5 py-0.5 rounded text-[10px] font-mono font-bold ${
                        b.bookingStatus === 'Confirmed' || b.bookingStatus === 'Checked-In'
                          ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                          : 'bg-zinc-800 text-zinc-400'
                      }`}
                    >
                      {b.bookingStatus}
                    </span>
                  </div>
                  <div className="text-xs text-zinc-400 flex flex-wrap items-center gap-3">
                    <span>ID: <strong className="text-zinc-200 font-mono">{b.id}</strong></span>
                    <span>Check-in: <strong className="text-zinc-200 font-mono">{b.checkInDate}</strong></span>
                    <span>Check-out: <strong className="text-zinc-200 font-mono">{b.checkOutDate}</strong></span>
                    <span>Room #: <strong className="text-amber-400 font-mono">{b.roomNumberAssigned || 'Allocated at Desk'}</strong></span>
                  </div>
                </div>

                <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end border-t sm:border-t-0 pt-3 sm:pt-0 border-zinc-800">
                  <div className="text-right">
                    <div className="text-[10px] text-zinc-400">Total Paid</div>
                    <div className="text-lg font-black text-amber-400 font-mono">₹{b.totalAmount}</div>
                  </div>

                  <button
                    onClick={() => setInvoiceModalBooking(b)}
                    className="px-4 py-2.5 rounded-xl bg-amber-500/15 hover:bg-amber-500/25 text-amber-400 border border-amber-500/30 text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <FileText className="w-4 h-4" />
                    <span>View / Print Receipt</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
