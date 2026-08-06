import React from 'react';
import { useApp } from '../context/AppContext';
import {
  Hotel,
  MapPin,
  Mail,
  Phone,
  AlertCircle,
  ExternalLink,
  ShieldCheck,
  Heart,
} from 'lucide-react';

export const Footer: React.FC = () => {
  const { hotelConfig, setActiveView, setIsLoginModalOpen } = useApp();

  return (
    <footer className="bg-[#050505] text-gray-400 border-t border-white/10 pt-12 pb-8 text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
          {/* Column 1: Brand info */}
          <div className="md:col-span-5 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#0A0A0A] border border-[#D4AF37] text-[#D4AF37] flex items-center justify-center font-bold">
                <Hotel className="w-5 h-5" />
              </div>
              <span className="text-xl font-serif italic font-bold text-white">{hotelConfig.hotelName}</span>
            </div>
            <p className="text-gray-400 leading-relaxed pr-4">{hotelConfig.aboutText}</p>
            <div className="flex items-center gap-2 pt-1">
              <a
                href={hotelConfig.googleTravelUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-3.5 py-1.5 rounded-lg bg-[#D4AF37]/10 hover:bg-[#D4AF37]/20 text-[#D4AF37] border border-[#D4AF37]/30 text-xs font-semibold inline-flex items-center gap-1.5 transition-colors uppercase tracking-wider"
              >
                <MapPin className="w-3.5 h-3.5" /> Google Travel <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div className="md:col-span-3 space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-widest">Quick Navigation</h4>
            <ul className="space-y-2 text-gray-400 text-xs">
              <li>
                <button onClick={() => setActiveView('home')} className="hover:text-[#D4AF37] transition-colors">
                  Home Overview
                </button>
              </li>
              <li>
                <button onClick={() => setActiveView('rooms')} className="hover:text-[#D4AF37] transition-colors">
                  Rooms & Dynamic Pricing
                </button>
              </li>
              <li>
                <button onClick={() => setActiveView('gallery')} className="hover:text-[#D4AF37] transition-colors">
                  Photo Gallery & Location
                </button>
              </li>
              <li>
                <button onClick={() => setActiveView('faqs')} className="hover:text-[#D4AF37] transition-colors">
                  Hotel Policies & FAQs
                </button>
              </li>
              <li>
                <button onClick={() => setIsLoginModalOpen(true)} className="hover:text-[#D4AF37] transition-colors">
                  Unified Sign In
                </button>
              </li>
            </ul>
          </div>

          {/* Column 3: Contact & Disclaimer */}
          <div className="md:col-span-4 space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-widest">Direct Inquiries</h4>
            <div className="space-y-2 text-gray-300">
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-[#D4AF37] shrink-0" />
                <a href={`mailto:${hotelConfig.email}`} className="text-[#D4AF37] hover:underline font-mono">
                  {hotelConfig.email}
                </a>
              </div>

              <div className="flex items-start gap-2">
                <Phone className="w-4 h-4 text-[#D4AF37] shrink-0 mt-0.5" />
                <div>
                  <div className="text-[#D4AF37] font-mono font-bold">{hotelConfig.phones.join(' / ')}</div>
                </div>
              </div>

              <div className="p-2.5 rounded-xl bg-[#0A0A0A] border border-white/10 text-[11px] text-gray-400 flex items-start gap-2 mt-2">
                <AlertCircle className="w-4 h-4 text-[#D4AF37] shrink-0 mt-0.5" />
                <span>
                  <strong>Note:</strong> {hotelConfig.phoneDisclaimer}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-gray-500">
          <div>© {new Date().getFullYear()} {hotelConfig.hotelName}. All Rights Reserved.</div>
          <div className="flex items-center gap-2 text-[11px]">
            <span>Gaya Pilgrimage & Tourist Hospitality Services</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
