import React from 'react';
import { useApp } from '../context/AppContext';
import { Booking } from '../types';
import {
  Printer,
  Download,
  X,
  Hotel,
  CheckCircle2,
  Phone,
  Mail,
  MapPin,
  ShieldCheck,
  Award,
} from 'lucide-react';

interface InvoiceModalProps {
  booking: Booking;
  onClose: () => void;
}

export const InvoiceModal: React.FC<InvoiceModalProps> = ({ booking, onClose }) => {
  const { hotelConfig } = useApp();

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadJSON = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(booking, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `Invoice_${booking.id}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto print:p-0 print:bg-white print:text-black">
      <div className="relative w-full max-w-2xl bg-zinc-950 border border-zinc-800 rounded-2xl shadow-2xl overflow-hidden my-6 text-white print:border-0 print:shadow-none print:rounded-none print:text-black print:bg-white print:max-w-none">
        {/* Action Header bar (hidden on print) */}
        <div className="bg-zinc-900 px-6 py-3 border-b border-zinc-800 flex items-center justify-between print:hidden">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-400" />
            <h3 className="text-sm font-bold text-white">Booking Confirmation & Printable Invoice</h3>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="px-3 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-zinc-950 text-xs font-bold flex items-center gap-1.5 shadow cursor-pointer"
            >
              <Printer className="w-4 h-4" /> Print / Save PDF
            </button>
            <button
              onClick={handleDownloadJSON}
              className="px-3 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-medium flex items-center gap-1.5"
            >
              <Download className="w-4 h-4" /> Download Data
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Invoice Printable Sheet */}
        <div className="p-8 space-y-6 print:p-6 bg-zinc-950 print:bg-white text-zinc-100 print:text-zinc-900">
          {/* Header Brand Section */}
          <div className="flex justify-between items-start border-b border-zinc-800 print:border-zinc-300 pb-6">
            <div>
              <div className="flex items-center gap-2.5 mb-1">
                <div className="w-9 h-9 rounded-lg bg-amber-500 text-zinc-950 flex items-center justify-center font-bold">
                  <Hotel className="w-5 h-5" />
                </div>
                <h1 className="text-2xl font-black tracking-tight text-white print:text-black">
                  {hotelConfig.hotelName}
                </h1>
              </div>
              <p className="text-xs text-zinc-400 print:text-zinc-600 max-w-sm">
                {hotelConfig.address}
              </p>
              <p className="text-xs text-zinc-400 print:text-zinc-600 mt-1 flex items-center gap-3">
                <span>Email: {hotelConfig.email}</span>
                <span>Phone: {hotelConfig.phones.join(', ')}</span>
              </p>
            </div>

            <div className="text-right">
              <div className="inline-block px-3 py-1 rounded-full bg-emerald-950/80 text-emerald-400 border border-emerald-500/30 text-xs font-mono font-bold mb-2 print:border-emerald-700 print:text-emerald-800">
                INVOICE CONFIRMED
              </div>
              <div className="text-xs font-mono text-zinc-400 print:text-zinc-700">
                Invoice ID: <strong className="text-white print:text-black">{booking.id}</strong>
              </div>
              <div className="text-xs font-mono text-zinc-400 print:text-zinc-700">
                Date: {new Date(booking.createdAt).toLocaleDateString()}
              </div>
            </div>
          </div>

          {/* Guest & Stay Info Grid */}
          <div className="grid grid-cols-2 gap-6 bg-zinc-900/60 print:bg-zinc-100 p-4 rounded-xl border border-zinc-800/80 print:border-zinc-300 text-xs">
            <div className="space-y-1">
              <div className="font-bold text-amber-400 print:text-amber-700 uppercase tracking-wider text-[10px] mb-1">
                GUEST DETAILS
              </div>
              <div>
                <strong className="text-white print:text-black">Name:</strong> {booking.guestName}
              </div>
              <div>
                <strong className="text-white print:text-black">Phone:</strong> {booking.guestPhone}
              </div>
              <div>
                <strong className="text-white print:text-black">ID Document:</strong> {booking.idType} ({booking.idNumber})
              </div>
              <div>
                <strong className="text-white print:text-black">Payment:</strong>{' '}
                <span className="font-semibold text-emerald-400 print:text-emerald-700">{booking.paymentStatus}</span>
              </div>
            </div>

            <div className="space-y-1 text-right">
              <div className="font-bold text-amber-400 print:text-amber-700 uppercase tracking-wider text-[10px] mb-1">
                RESERVATION SPECIFICATION
              </div>
              <div>
                <strong className="text-white print:text-black">Room Category:</strong> {booking.categoryTitle}
              </div>
              <div>
                <strong className="text-white print:text-black">Assigned Room #:</strong> {booking.roomNumberAssigned || 'Allocated at Desk'}
              </div>
              <div>
                <strong className="text-white print:text-black">Check-In:</strong> {booking.checkInDate} ({hotelConfig.checkInTime})
              </div>
              <div>
                <strong className="text-white print:text-black">Check-Out:</strong> {booking.checkOutDate} ({hotelConfig.checkOutTime})
              </div>
            </div>
          </div>

          {/* Charges Table */}
          <div className="border border-zinc-800 print:border-zinc-300 rounded-xl overflow-hidden">
            <table className="w-full text-left text-xs">
              <thead className="bg-zinc-900 print:bg-zinc-200 text-zinc-300 print:text-zinc-800 font-semibold uppercase tracking-wider">
                <tr>
                  <th className="p-3">Description</th>
                  <th className="p-3 text-center">Rate/Night</th>
                  <th className="p-3 text-center">Duration</th>
                  <th className="p-3 text-right">Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800 print:divide-zinc-300 font-mono">
                <tr>
                  <td className="p-3">
                    <div className="font-semibold text-white print:text-black">{booking.categoryTitle} Accommodation</div>
                    <div className="text-[10px] text-zinc-400 print:text-zinc-600">Base Room Rate</div>
                  </td>
                  <td className="p-3 text-center">₹{booking.basePricePerNight}</td>
                  <td className="p-3 text-center">{booking.stayDurationDays} Night(s)</td>
                  <td className="p-3 text-right">₹{booking.basePricePerNight * booking.stayDurationDays}</td>
                </tr>

                {booking.seasonalSurchargePerNight > 0 && (
                  <tr>
                    <td className="p-3">
                      <div className="font-semibold text-amber-300 print:text-amber-800">Peak Season Pilgrimage Surcharge</div>
                      <div className="text-[10px] text-zinc-400 print:text-zinc-600">Pitrapaksha & Winter Season rate</div>
                    </td>
                    <td className="p-3 text-center">+₹{booking.seasonalSurchargePerNight}</td>
                    <td className="p-3 text-center">{booking.stayDurationDays} Night(s)</td>
                    <td className="p-3 text-right text-amber-300 print:text-amber-800">
                      +₹{booking.seasonalSurchargePerNight * booking.stayDurationDays}
                    </td>
                  </tr>
                )}

                {booking.promoDiscount > 0 && (
                  <tr>
                    <td className="p-3 text-emerald-400 print:text-emerald-700 font-semibold" colSpan={3}>
                      Promo Discount ({booking.promoCodeApplied})
                    </td>
                    <td className="p-3 text-right text-emerald-400 print:text-emerald-700 font-semibold">
                      -₹{booking.promoDiscount}
                    </td>
                  </tr>
                )}

                <tr>
                  <td className="p-3 text-zinc-400 print:text-zinc-600" colSpan={3}>
                    Applicable GST & Maintenance (5%)
                  </td>
                  <td className="p-3 text-right text-zinc-400 print:text-zinc-600">
                    +₹{booking.taxAmount}
                  </td>
                </tr>
              </tbody>
              <tfoot className="bg-zinc-900 print:bg-zinc-200 border-t border-zinc-800 print:border-zinc-300 font-bold">
                <tr>
                  <td className="p-3 text-white print:text-black text-sm" colSpan={3}>
                    TOTAL PAYABLE AMOUNT
                  </td>
                  <td className="p-3 text-right text-amber-400 print:text-amber-800 text-base font-extrabold font-mono">
                    ₹{booking.totalAmount}
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>

          {/* Footer Notes & Official Stamp */}
          <div className="flex justify-between items-end pt-4 border-t border-zinc-800 print:border-zinc-300">
            <div className="text-[10px] text-zinc-400 print:text-zinc-600 space-y-1 max-w-md">
              <div className="font-bold text-zinc-300 print:text-zinc-800 uppercase tracking-wider">
                Hotel Policy Notes:
              </div>
              <p>• Mandatory ID check at reception. Standard check-out is strictly 11:00 AM.</p>
              <p>• Contact us for any extension or query: {hotelConfig.email} | {hotelConfig.phones.join(', ')}</p>
            </div>

            {/* Stamp Stamp Placeholder */}
            <div className="text-center p-3 rounded-xl border border-dashed border-amber-500/40 print:border-amber-700 bg-amber-500/5">
              <div className="text-[10px] font-bold text-amber-400 print:text-amber-800 uppercase tracking-wider mb-1">
                KUMAR GUEST HOUSE
              </div>
              <div className="text-[9px] text-zinc-400 print:text-zinc-600">Authorized Desk Stamp</div>
              <div className="mt-2 text-xs font-mono font-bold text-emerald-400 print:text-emerald-700">
                [VERIFIED & RECORDED]
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
