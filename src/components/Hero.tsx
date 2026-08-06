import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  Sparkles,
  MapPin,
  Calendar,
  Users,
  AirVent,
  Search,
  ShieldCheck,
  Zap,
  Flame,
  Award,
  ChevronRight,
  CheckCircle2,
} from 'lucide-react';

export const Hero: React.FC = () => {
  const { hotelConfig, setActiveView, setSelectedCategoryForBooking, roomCategories } = useApp();

  const [filterType, setFilterType] = useState<string>('all');
  const [filterBed, setFilterBed] = useState<string>('all');

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setActiveView('rooms');
  };

  return (
    <section className="relative bg-[#050505] text-white overflow-hidden py-12 md:py-16 border-b border-white/10">
      {/* Background Subtle Gradient & Grid Accent */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-white/5 via-[#050505] to-[#050505] pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-12 gap-8 items-center">
          {/* Main Hero Copy */}
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[#D4AF37] text-[10px] font-bold uppercase tracking-widest backdrop-blur-sm">
              <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" />
              <span>GAYA'S TRUSTED HOSPITALITY FOR PILGRIMS & FAMILIES</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-serif italic tracking-tight text-white leading-[1.15]">
              Elegance meets comfort at <br />
              <span className="gold-gradient-text not-italic font-bold">
                {hotelConfig.hotelName}
              </span>
            </h1>

            <p className="text-sm sm:text-base text-gray-400 max-w-2xl leading-relaxed">
              Serene, hygienic, and affordable stay options equipped with 24/7 power backup, instant hot geysers, high-speed Wi-Fi, and live staff-controlled room availability.
            </p>

            {/* Feature Highlights Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-1">
              <div className="bg-[#0A0A0A] border border-white/10 p-3.5 rounded-xl flex items-center gap-3">
                <div className="p-2 rounded-lg bg-[#D4AF37]/10 text-[#D4AF37]">
                  <Zap className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-bold text-white">24/7 Power</div>
                  <div className="text-[10px] text-gray-400">Generator Backup</div>
                </div>
              </div>

              <div className="bg-[#0A0A0A] border border-white/10 p-3.5 rounded-xl flex items-center gap-3">
                <div className="p-2 rounded-lg bg-[#D4AF37]/10 text-[#D4AF37]">
                  <Flame className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-bold text-white">Hot Geyser</div>
                  <div className="text-[10px] text-gray-400">Attached Bathrooms</div>
                </div>
              </div>

              <div className="bg-[#0A0A0A] border border-white/10 p-3.5 rounded-xl flex items-center gap-3 col-span-2 sm:col-span-1">
                <div className="p-2 rounded-lg bg-[#D4AF37]/10 text-[#D4AF37]">
                  <MapPin className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-bold text-white">Prime Location</div>
                  <div className="text-[10px] text-gray-400">Near Temple</div>
                </div>
              </div>
            </div>

            {/* Quick Action Buttons */}
            <div className="flex flex-wrap items-center gap-4 pt-2">
              <button
                onClick={() => setActiveView('rooms')}
                className="px-6 py-3.5 rounded-xl bg-[#D4AF37] hover:bg-white text-black font-bold text-xs uppercase tracking-widest transition-all flex items-center gap-2 cursor-pointer group shadow-lg shadow-[#D4AF37]/10"
              >
                <span>View Rooms & Availability</span>
                <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>

              <a
                href={hotelConfig.googleTravelUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-6 py-3.5 rounded-xl bg-[#0A0A0A] hover:bg-white/5 text-gray-200 border border-white/10 text-xs uppercase tracking-widest font-semibold transition-colors flex items-center gap-2"
              >
                <MapPin className="w-4 h-4 text-[#D4AF37]" />
                <span>Google Travel Map</span>
              </a>
            </div>
          </div>

          {/* Quick Search & Booking Filter Box */}
          <div className="lg:col-span-5">
            <div className="bg-[#0A0A0A] border border-white/10 rounded-2xl p-6 shadow-2xl backdrop-blur-sm relative">
              <div className="flex items-center justify-between pb-4 mb-4 border-b border-white/10">
                <h3 className="font-bold text-white flex items-center gap-2 font-serif text-lg">
                  <Search className="w-5 h-5 text-[#D4AF37]" />
                  <span>Check Live Availability</span>
                </h3>
                <span className="text-[10px] uppercase tracking-wider text-[#D4AF37] bg-[#D4AF37]/10 px-2.5 py-1 rounded-full border border-[#D4AF37]/30 font-mono">
                  Real-time
                </span>
              </div>

              <form onSubmit={handleSearchSubmit} className="space-y-4">
                <div>
                  <label className="block text-[10px] font-bold text-gray-400 mb-1.5 uppercase tracking-widest">
                    Climate Preference
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    <button
                      type="button"
                      onClick={() => setFilterType('all')}
                      className={`py-2 px-3 rounded-lg text-xs font-semibold border transition-colors ${
                        filterType === 'all'
                          ? 'bg-[#D4AF37] text-black border-[#D4AF37]'
                          : 'bg-[#050505] text-gray-400 border-white/10 hover:text-white'
                      }`}
                    >
                      All Types
                    </button>
                    <button
                      type="button"
                      onClick={() => setFilterType('AC')}
                      className={`py-2 px-3 rounded-lg text-xs font-semibold border transition-colors ${
                        filterType === 'AC'
                          ? 'bg-[#D4AF37] text-black border-[#D4AF37]'
                          : 'bg-[#050505] text-gray-400 border-white/10 hover:text-white'
                      }`}
                    >
                      AC Rooms
                    </button>
                    <button
                      type="button"
                      onClick={() => setFilterType('Non-AC')}
                      className={`py-2 px-3 rounded-lg text-xs font-semibold border transition-colors ${
                        filterType === 'Non-AC'
                          ? 'bg-[#D4AF37] text-black border-[#D4AF37]'
                          : 'bg-[#050505] text-gray-400 border-white/10 hover:text-white'
                      }`}
                    >
                      Non-AC
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-gray-400 mb-1.5 uppercase tracking-widest">
                    Bed Specification
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setFilterBed('Single Bed')}
                      className={`py-2 px-3 rounded-lg text-xs font-semibold border transition-colors ${
                        filterBed === 'Single Bed'
                          ? 'bg-[#D4AF37] text-black border-[#D4AF37]'
                          : 'bg-[#050505] text-gray-400 border-white/10 hover:text-white'
                      }`}
                    >
                      Single Bed
                    </button>
                    <button
                      type="button"
                      onClick={() => setFilterBed('Double Bed')}
                      className={`py-2 px-3 rounded-lg text-xs font-semibold border transition-colors ${
                        filterBed === 'Double Bed'
                          ? 'bg-[#D4AF37] text-black border-[#D4AF37]'
                          : 'bg-[#050505] text-gray-400 border-white/10 hover:text-white'
                      }`}
                    >
                      Double Bed
                    </button>
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-[#050505] border border-white/10 text-xs text-gray-300 space-y-1.5">
                  <div className="font-semibold text-[#D4AF37] flex items-center gap-1.5 text-xs">
                    <CheckCircle2 className="w-4 h-4" /> Direct Booking Standard Rates:
                  </div>
                  <ul className="list-disc list-inside space-y-1 text-gray-400 font-mono text-[11px]">
                    <li>Non AC Single Bed: ₹900 – ₹1000</li>
                    <li>Non AC Double Bed: ₹1100 – ₹1400</li>
                    <li>AC Double Bed: ₹1500 – ₹2200</li>
                  </ul>
                </div>

                <button
                  type="submit"
                  className="w-full py-3 rounded-xl bg-[#D4AF37] hover:bg-white text-black font-bold text-xs uppercase tracking-widest transition-all flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-[#D4AF37]/10"
                >
                  <Search className="w-4 h-4" />
                  <span>Search Live Rooms</span>
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
