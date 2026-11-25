import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { sanitizeHttpUrl } from '../utils/bookingUtils';
import {
  AlertCircle,
  Camera,
  CheckCircle2,
  Compass,
  ExternalLink,
  Mail,
  MapPin,
  Navigation,
  Phone,
} from 'lucide-react';

export const LocationGallery: React.FC = () => {
  const { hotelConfig } = useApp();
  const [activeTab, setActiveTab] = useState<'all' | 'rooms' | 'exterior' | 'facilities'>('all');
  const safeTravelUrl = sanitizeHttpUrl(hotelConfig.googleTravelUrl);

  const galleryImages = [
    {
      id: '1',
      category: 'rooms',
      title: 'Deluxe AC Double Room',
      url: 'https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=800&q=80',
    },
    {
      id: '2',
      category: 'rooms',
      title: 'Super Premium Family Suite',
      url: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=800&q=80',
    },
    {
      id: '3',
      category: 'rooms',
      title: 'Budget Non-AC Single Room',
      url: 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?auto=format&fit=crop&w=800&q=80',
    },
    {
      id: '4',
      category: 'exterior',
      title: 'Kumar Guest House Reception & Lobby',
      url: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80',
    },
    {
      id: '5',
      category: 'facilities',
      title: '24/7 Power Backup & Hot Geyser Facility',
      url: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=800&q=80',
    },
    {
      id: '6',
      category: 'exterior',
      title: 'Secure Covered Parking & CCTV Area',
      url: 'https://images.unsplash.com/photo-1506521781263-d8422e82f27a?auto=format&fit=crop&w=800&q=80',
    },
  ];

  const filteredImages =
    activeTab === 'all' ? galleryImages : galleryImages.filter((img) => img.category === activeTab);

  return (
    <section className="bg-[#050505] text-white py-12 md:py-20 border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        {/* Section Title */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#D4AF37]/10 border border-[#D4AF37]/30 text-[#D4AF37] text-[10px] font-bold uppercase tracking-widest">
            <MapPin className="w-3.5 h-3.5" />
            <span>PRIME LOCATION &amp; PHOTO TOUR</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-serif italic text-white">
            Location, Contact &amp; Gallery
          </h2>
          <p className="text-sm text-gray-400">
            Conveniently situated near Vishnupad Temple and Gaya Railway Junction with 24/7 accessibility for pilgrims and tourists.
          </p>
        </div>

        {/* Contact Info & Google Travel Integration Block */}
        <div className="grid lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-5 bg-[#0A0A0A] border border-white/10 rounded-2xl p-6 shadow-xl space-y-6">
            <h3 className="text-lg font-serif italic text-white flex items-center gap-2 border-b border-white/10 pb-3">
              <Navigation className="w-5 h-5 text-[#D4AF37]" />
              <span>Contact &amp; Location Details</span>
            </h3>

            {/* Google Travel Direct CTA */}
            <div className="p-4 rounded-xl bg-[#050505] border border-[#D4AF37]/30 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold text-[#D4AF37] uppercase tracking-widest">
                  Official Google Listing
                </span>
                <span className="px-2 py-0.5 rounded bg-[#D4AF37]/20 text-[#D4AF37] text-[10px] font-mono">
                  GAYA, BIHAR
                </span>
              </div>
              <p className="text-xs text-gray-300 leading-relaxed">
                Explore real guest reviews, interactive map directions, street view, and verify location coordinates on Google Travel.
              </p>
              {safeTravelUrl && (
                <a
                  href={safeTravelUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-2.5 px-4 rounded-xl bg-[#D4AF37] hover:bg-white text-black font-bold text-xs uppercase tracking-widest shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span>View on Google Travel</span>
                  <ExternalLink className="w-4 h-4" />
                </a>
              )}
            </div>

            {/* Address & Landmark */}
            <div className="space-y-3 text-xs text-gray-300">
              <div className="flex items-start gap-3 p-3 bg-[#050505] rounded-xl border border-white/10">
                <MapPin className="w-5 h-5 text-[#D4AF37] shrink-0 mt-0.5" />
                <div>
                  <div className="font-semibold text-white mb-0.5">Physical Address</div>
                  <div className="text-gray-400 leading-relaxed">{hotelConfig.address}</div>
                  <div className="text-[11px] text-[#D4AF37] font-medium mt-1">
                    Landmark: {hotelConfig.landmark}
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 bg-[#050505] rounded-xl border border-white/10">
                <Mail className="w-5 h-5 text-[#D4AF37] shrink-0 mt-0.5" />
                <div>
                  <div className="font-semibold text-white mb-0.5">Contact Email</div>
                  <a
                    href={`mailto:${hotelConfig.email}`}
                    className="text-[#D4AF37] hover:underline font-mono text-xs"
                  >
                    {hotelConfig.email}
                  </a>
                </div>
              </div>

              {/* Contact Numbers with Clear Disclaimer */}
              <div className="p-3 bg-[#050505] rounded-xl border border-white/10 space-y-1.5">
                <div className="flex items-center gap-2 font-semibold text-white text-xs">
                  <Phone className="w-4 h-4 text-[#D4AF37]" />
                  <span>Contact Numbers</span>
                </div>
                <div className="text-[#D4AF37] font-mono font-bold text-sm tracking-wide">
                  {hotelConfig.phones.join('  |  ')}
                </div>
                <div className="p-2 rounded bg-red-950/30 border border-red-800/40 text-[11px] text-red-300 flex items-start gap-1.5 mt-2">
                  <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                  <span>
                    <strong>Disclaimer:</strong> {hotelConfig.phoneDisclaimer}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Interactive Map Integration Placeholder */}
          <div className="lg:col-span-7 bg-[#0A0A0A] border border-white/10 rounded-2xl overflow-hidden shadow-xl h-full flex flex-col justify-between">
            <div className="p-4 bg-[#0A0A0A] border-b border-white/10 flex items-center justify-between">
              <span className="font-serif italic text-base text-white flex items-center gap-2">
                <Compass className="w-4 h-4 text-[#D4AF37]" /> Google Maps &amp; Route Guide
              </span>
              <span className="text-xs text-gray-400 font-mono">Near Vishnupad Temple</span>
            </div>

            <div className="relative h-80 bg-[#050505] flex flex-col items-center justify-center p-6 text-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-[#D4AF37]/10 border border-[#D4AF37]/30 text-[#D4AF37] flex items-center justify-center">
                <MapPin className="w-8 h-8 animate-bounce" />
              </div>
              <div className="max-w-md">
                <h4 className="text-lg font-serif italic text-white mb-1">
                  {hotelConfig.hotelName}, Gaya, Bihar
                </h4>
                <p className="text-xs text-gray-400">
                  Walkable distance to sacred Vishnupad Temple ghats and 5 minutes drive from Gaya Railway Junction.
                </p>
              </div>
              {safeTravelUrl && (
                <a
                  href={safeTravelUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-5 py-2.5 rounded-xl bg-[#D4AF37] hover:bg-white text-black font-bold text-xs uppercase tracking-widest shadow-lg flex items-center gap-2 cursor-pointer"
                >
                  <span>Open Google Directions</span>
                  <ExternalLink className="w-4 h-4" />
                </a>
              )}
            </div>

            <div className="p-4 bg-[#050505] border-t border-white/10 grid grid-cols-2 gap-3 text-xs text-gray-400">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#D4AF37]" />
                <span>Railway Station: 1.8 km</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#D4AF37]" />
                <span>Vishnupad Temple: 800m</span>
              </div>
            </div>
          </div>
        </div>

        {/* Photo Gallery Section */}
        <div className="space-y-6 pt-6 border-t border-white/10">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <h3 className="text-xl font-serif italic text-white flex items-center gap-2">
                <Camera className="w-5 h-5 text-[#D4AF37]" />
                <span>Guest House Gallery</span>
              </h3>
              <p className="text-xs text-gray-400">
                High-resolution view of rooms, amenities, and guest house facilities.
              </p>
            </div>

            {/* Gallery Category Filter Tabs */}
            <div className="flex items-center gap-1.5 bg-[#0A0A0A] p-1 rounded-xl border border-white/10">
              {(['all', 'rooms', 'exterior', 'facilities'] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-colors ${
                    activeTab === tab
                      ? 'bg-[#D4AF37] text-black font-extrabold'
                      : 'text-gray-400 hover:text-white'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>

          {/* Gallery Grid */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredImages.map((img) => (
              <div
                key={img.id}
                className="group relative h-64 rounded-2xl overflow-hidden border border-white/10 bg-[#0A0A0A] shadow-xl"
              >
                <img
                  src={img.url}
                  alt={img.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-[#050505]/20 to-transparent opacity-80 group-hover:opacity-90 transition-opacity" />
                <div className="absolute bottom-4 left-4 right-4">
                  <span className="px-2 py-0.5 rounded bg-[#D4AF37]/20 text-[#D4AF37] border border-[#D4AF37]/30 text-[10px] font-mono uppercase tracking-wider">
                    {img.category}
                  </span>
                  <h4 className="text-sm font-serif italic text-white mt-1 group-hover:text-[#D4AF37] transition-colors">
                    {img.title}
                  </h4>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
