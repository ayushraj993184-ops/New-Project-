import React from 'react';
import { useApp } from '../context/AppContext';
import { RoomCategory, RoomStatus } from '../types';
import { DynamicIcon } from './DynamicIcon';
import {
  Users,
  CheckCircle,
  AlertCircle,
  Clock,
  Sparkles,
  BedDouble,
  AirVent,
  ChevronRight,
  ShieldCheck,
} from 'lucide-react';

interface RoomCardProps {
  category: RoomCategory;
  onBookNow: (category: RoomCategory) => void;
}

export const RoomCard: React.FC<RoomCardProps> = ({ category, onBookNow }) => {
  const { hotelConfig, amenities, roomInstances } = useApp();

  // Find live status across room numbers for this category
  const categoryInstances = roomInstances.filter((inst) => inst.categoryId === category.id);
  const availableCount = categoryInstances.filter((inst) => inst.status === 'Available').length;
  const totalCount = categoryInstances.length;

  // Derive status badge
  const status: RoomStatus =
    availableCount > 0 ? 'Available' : category.liveStatus || 'Occupied';

  const getStatusBadge = (st: RoomStatus) => {
    switch (st) {
      case 'Available':
        return {
          label: `Available (${availableCount}/${totalCount} Rooms Free)`,
          bg: 'bg-emerald-950/80 text-emerald-300 border-emerald-500/40',
          dot: 'bg-emerald-400',
        };
      case 'Occupied':
        return {
          label: 'Occupied',
          bg: 'bg-rose-950/80 text-rose-300 border-rose-500/40',
          dot: 'bg-rose-400',
        };
      case 'Cleaning/Maintenance':
        return {
          label: 'Housekeeping / Cleaning',
          bg: 'bg-amber-950/80 text-amber-300 border-amber-500/40',
          dot: 'bg-amber-400',
        };
      case 'Reserved':
        return {
          label: 'Reserved for Guest',
          bg: 'bg-blue-950/80 text-blue-300 border-blue-500/40',
          dot: 'bg-blue-400',
        };
      default:
        return {
          label: 'Check Staff Status',
          bg: 'bg-zinc-800 text-zinc-300 border-zinc-700',
          dot: 'bg-zinc-400',
        };
    }
  };

  const statusStyle = getStatusBadge(status);

  // Price calculation
  const currentPrice = hotelConfig.isPeakSeasonActive
    ? category.basePricePeakSeason
    : category.basePriceOffSeason;

  // Get associated amenity details
  const categoryAmenities = amenities.filter(
    (a) => a.isGlobal || category.amenityIds.includes(a.id)
  );

  return (
    <div className="group bg-[#0A0A0A] border border-white/10 rounded-2xl overflow-hidden hover:border-[#D4AF37]/50 transition-all duration-300 shadow-xl flex flex-col h-full">
      {/* Card Image Banner & Badges */}
      <div className="relative h-56 w-full overflow-hidden bg-[#050505]">
        <img
          src={category.imageUrl}
          alt={category.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A] via-[#0A0A0A]/30 to-transparent" />

        {/* Live Staff-Controlled Availability Indicator Badge */}
        <div className="absolute top-3 left-3">
          <div
            className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full border text-[10px] uppercase font-bold tracking-wider backdrop-blur-md shadow-md ${statusStyle.bg}`}
          >
            <span className={`w-2 h-2 rounded-full animate-pulse ${statusStyle.dot}`} />
            <span>{statusStyle.label}</span>
          </div>
        </div>

        {/* Climate & Bed Spec Badges */}
        <div className="absolute top-3 right-3 flex items-center gap-1.5">
          <span className="px-2.5 py-1 rounded-lg bg-[#050505]/80 text-[#D4AF37] border border-[#D4AF37]/30 text-[10px] font-bold tracking-widest uppercase backdrop-blur-md">
            {category.type}
          </span>
          <span className="px-2.5 py-1 rounded-lg bg-[#050505]/80 text-gray-300 border border-white/10 text-[10px] font-semibold uppercase backdrop-blur-md">
            {category.bedType}
          </span>
        </div>

        {/* Price Tag Overlay */}
        <div className="absolute bottom-3 left-3 right-3 flex items-end justify-between">
          <div>
            <div className="text-[10px] uppercase font-bold tracking-widest text-gray-400">
              {hotelConfig.isPeakSeasonActive ? 'Peak Season Rate' : 'Off-Season Rate'}
            </div>
            <div className="flex items-baseline gap-1 text-white">
              <span className="text-2xl font-extrabold text-[#D4AF37]">₹{currentPrice}</span>
              <span className="text-xs text-gray-400 font-medium">/ night</span>
            </div>
          </div>
          {hotelConfig.isPeakSeasonActive && (
            <span className="text-[10px] text-[#D4AF37] bg-[#050505]/90 border border-[#D4AF37]/30 px-2 py-0.5 rounded font-mono">
              Base: ₹{category.basePriceOffSeason}
            </span>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <h3 className="text-xl font-serif italic text-white group-hover:text-[#D4AF37] transition-colors">
              {category.title}
            </h3>
            <span className="text-[10px] uppercase tracking-wider text-gray-400 flex items-center gap-1 bg-[#050505] px-2 py-1 rounded border border-white/10">
              <Users className="w-3.5 h-3.5 text-[#D4AF37]" /> Max {category.maxCapacity}
            </span>
          </div>

          <p className="text-xs text-gray-400 line-clamp-2 leading-relaxed mb-3">
            {category.description}
          </p>

          {/* Room Numbers Tag */}
          <div className="flex items-center gap-2 mb-3 text-xs text-gray-400">
            <span className="font-semibold text-gray-300 text-[11px] uppercase tracking-wider">Rooms:</span>
            <div className="flex flex-wrap gap-1">
              {category.roomNumbers.map((num) => {
                const inst = categoryInstances.find((i) => i.roomNumber === num);
                const isAvail = inst?.status === 'Available';
                return (
                  <span
                    key={num}
                    title={`Room ${num}: ${inst?.status || 'Unknown'}`}
                    className={`px-1.5 py-0.5 rounded text-[10px] font-mono border ${
                      isAvail
                        ? 'bg-emerald-950/60 text-emerald-300 border-emerald-700/50'
                        : 'bg-[#050505] text-gray-600 border-white/10 line-through'
                    }`}
                  >
                    #{num}
                  </span>
                );
              })}
            </div>
          </div>

          {/* Amenities Grid */}
          <div className="pt-2 border-t border-white/10">
            <div className="text-[10px] text-gray-400 uppercase tracking-widest font-bold mb-2">
              Key Amenities Included:
            </div>
            <div className="grid grid-cols-2 gap-1.5">
              {categoryAmenities.slice(0, 4).map((a) => (
                <div key={a.id} className="flex items-center gap-1.5 text-xs text-gray-300">
                  <DynamicIcon name={a.iconName} className="w-3.5 h-3.5 text-[#D4AF37] shrink-0" />
                  <span className="line-clamp-1">{a.name}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* CTA Button */}
        <div className="pt-3 border-t border-white/10">
          <button
            onClick={() => onBookNow(category)}
            disabled={availableCount === 0}
            className={`w-full py-3 rounded-xl font-bold text-xs uppercase tracking-widest transition-all flex items-center justify-center gap-2 ${
              availableCount > 0
                ? 'bg-[#D4AF37] hover:bg-white text-black shadow-lg shadow-[#D4AF37]/10 cursor-pointer'
                : 'bg-zinc-900 text-gray-600 cursor-not-allowed border border-white/10'
            }`}
          >
            {availableCount > 0 ? (
              <>
                <span>Reserve Room</span>
                <ChevronRight className="w-4 h-4" />
              </>
            ) : (
              <span>Currently Fully Occupied</span>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
