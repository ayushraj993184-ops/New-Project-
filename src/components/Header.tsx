import React from 'react';
import { useApp } from '../context/AppContext';
import { sanitizeHttpUrl } from '../utils/bookingUtils';
import {
  Calendar,
  Hotel,
  LogOut,
  MapPin,
  Menu,
  ShieldCheck,
  Sparkles,
  User as UserIcon,
  X,
} from 'lucide-react';

export const Header: React.FC = () => {
  const {
    hotelConfig,
    currentUser,
    activeView,
    setActiveView,
    setIsLoginModalOpen,
    logout,
    triggerWelcomeAnimation,
  } = useApp();

  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);
  const safeTravelUrl = sanitizeHttpUrl(hotelConfig.googleTravelUrl);

  const handleMobileNav = (view: typeof activeView) => {
    setActiveView(view);
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 bg-[#050505]/90 backdrop-blur-md border-b border-white/10 text-gray-200">
      {/* Top Announcement Bar for Peak Season */}
      {hotelConfig.isPeakSeasonActive && (
        <div className="bg-[#0A0A0A] px-4 py-1.5 text-xs text-[#D4AF37] border-b border-white/10 flex items-center justify-between">
          <div className="max-w-7xl mx-auto w-full flex items-center justify-between gap-4">
            <span className="flex items-center gap-1.5 font-medium">
              <Sparkles className="w-3.5 h-3.5 text-[#D4AF37] animate-pulse shrink-0" />
              <span>
                <strong>{hotelConfig.peakSeasonName}:</strong> Peak season room rates are active.
              </span>
            </span>
            {safeTravelUrl && (
              <a
                href={safeTravelUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="hidden sm:flex items-center gap-1 hover:underline text-[#D4AF37] font-semibold shrink-0"
              >
                <MapPin className="w-3 h-3" /> View on Google Travel
              </a>
            )}
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        {/* Brand Logo */}
        <button
          onClick={() => setActiveView('home')}
          className="flex items-center gap-3 group text-left focus:outline-none"
        >
          <div className="w-11 h-11 rounded-xl bg-[#0A0A0A] border border-[#D4AF37]/50 p-0.5 shadow-lg group-hover:scale-105 transition-transform flex items-center justify-center">
            <Hotel className="w-6 h-6 text-[#D4AF37]" />
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight text-white flex items-center gap-2 font-serif italic">
              {hotelConfig.hotelName}
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#D4AF37]/10 text-[#D4AF37] border border-[#D4AF37]/30 font-sans not-italic uppercase tracking-wider">
                Gaya
              </span>
            </h1>
            <p className="text-xs text-gray-400 line-clamp-1">{hotelConfig.tagline}</p>
          </div>
        </button>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-1 bg-[#0A0A0A] p-1.5 rounded-xl border border-white/10">
          <button
            onClick={() => setActiveView('home')}
            className={`px-4 py-2 rounded-lg text-xs uppercase tracking-widest font-semibold transition-colors ${
              activeView === 'home'
                ? 'bg-white/10 text-white border border-white/20'
                : 'text-gray-400 hover:text-white hover:bg-white/5'
            }`}
          >
            Home
          </button>
          <button
            onClick={() => setActiveView('rooms')}
            className={`px-4 py-2 rounded-lg text-xs uppercase tracking-widest font-semibold transition-colors ${
              activeView === 'rooms'
                ? 'bg-white/10 text-white border border-white/20'
                : 'text-gray-400 hover:text-white hover:bg-white/5'
            }`}
          >
            Rooms & Pricing
          </button>
          <button
            onClick={() => setActiveView('gallery')}
            className={`px-4 py-2 rounded-lg text-xs uppercase tracking-widest font-semibold transition-colors ${
              activeView === 'gallery'
                ? 'bg-white/10 text-white border border-white/20'
                : 'text-gray-400 hover:text-white hover:bg-white/5'
            }`}
          >
            Gallery
          </button>
          <button
            onClick={() => setActiveView('faqs')}
            className={`px-4 py-2 rounded-lg text-xs uppercase tracking-widest font-semibold transition-colors ${
              activeView === 'faqs'
                ? 'bg-white/10 text-white border border-white/20'
                : 'text-gray-400 hover:text-white hover:bg-white/5'
            }`}
          >
            Policies & FAQs
          </button>
          {currentUser && currentUser.role === 'customer' && (
            <button
              onClick={() => setActiveView('my-bookings')}
              className={`px-4 py-2 rounded-lg text-xs uppercase tracking-widest font-semibold transition-colors flex items-center gap-1.5 ${
                activeView === 'my-bookings'
                  ? 'bg-[#D4AF37]/20 text-[#D4AF37] border border-[#D4AF37]/40'
                  : 'text-gray-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <Calendar className="w-4 h-4 text-[#D4AF37]" />
              My Bookings
            </button>
          )}
          {currentUser && currentUser.role !== 'customer' && (
            <button
              onClick={() => setActiveView('admin')}
              className={`px-4 py-2 rounded-lg text-xs uppercase tracking-widest font-semibold transition-colors flex items-center gap-1.5 ${
                activeView === 'admin'
                  ? 'bg-[#D4AF37] text-black shadow-md font-bold'
                  : 'text-[#D4AF37] hover:bg-[#D4AF37]/10'
              }`}
            >
              <ShieldCheck className="w-4 h-4" />
              Admin Panel
            </button>
          )}
        </nav>

        {/* User Account & Sign-In Control */}
        <div className="hidden lg:flex items-center gap-3">
          {currentUser ? (
            <div className="bg-[#0A0A0A] border border-white/10 p-1.5 rounded-xl flex items-center gap-2">
              <button
                onClick={() => triggerWelcomeAnimation()}
                title="View Welcome & Booking Summary"
                className="w-8 h-8 rounded-lg bg-[#D4AF37]/20 hover:bg-[#D4AF37]/40 text-[#D4AF37] flex items-center justify-center font-bold text-xs uppercase border border-[#D4AF37]/30 transition-all cursor-pointer shadow-sm hover:scale-105"
              >
                {currentUser.name.charAt(0)}
              </button>
              <button
                onClick={() => triggerWelcomeAnimation()}
                title="View Welcome & Booking Summary"
                className="text-left pr-2 cursor-pointer hover:opacity-80 transition-opacity"
              >
                <div className="text-xs font-medium text-white line-clamp-1 flex items-center gap-1">
                  <span>{currentUser.name}</span>
                  <Sparkles className="w-3 h-3 text-[#D4AF37]" />
                </div>
                <div className="text-[10px] text-[#D4AF37] font-mono capitalize">
                  {currentUser.role.replace('_', ' ')}
                </div>
              </button>
              <button
                onClick={logout}
                title="Sign Out"
                className="p-1.5 text-gray-400 hover:text-red-400 hover:bg-red-950/40 rounded-lg transition-colors cursor-pointer"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <button
              onClick={() => setIsLoginModalOpen(true)}
              className="px-5 py-2.5 rounded-xl bg-[#D4AF37] hover:bg-white text-black font-bold text-xs uppercase tracking-widest shadow-lg transition-all flex items-center gap-2 cursor-pointer"
            >
              <UserIcon className="w-4 h-4" />
              Sign In
            </button>
          )}
        </div>

        {/* Mobile menu trigger */}
        <div className="flex md:hidden items-center gap-2">
          {!currentUser && (
            <button
              onClick={() => setIsLoginModalOpen(true)}
              className="px-3 py-1.5 rounded-lg bg-amber-500 text-zinc-950 text-xs font-bold"
            >
              Sign In
            </button>
          )}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label={mobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
            className="p-2 rounded-lg bg-zinc-900 text-zinc-300 hover:text-white"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-zinc-950 border-b border-zinc-800 px-4 py-4 space-y-3">
          <nav className="flex flex-col space-y-2">
            <button
              onClick={() => handleMobileNav('home')}
              className="text-left py-2 text-sm text-zinc-200 border-b border-zinc-900"
            >
              Home
            </button>
            <button
              onClick={() => handleMobileNav('rooms')}
              className="text-left py-2 text-sm text-zinc-200 border-b border-zinc-900"
            >
              Rooms & Dynamic Pricing
            </button>
            <button
              onClick={() => handleMobileNav('gallery')}
              className="text-left py-2 text-sm text-zinc-200 border-b border-zinc-900"
            >
              Gallery & Google Travel Map
            </button>
            <button
              onClick={() => handleMobileNav('faqs')}
              className="text-left py-2 text-sm text-zinc-200 border-b border-zinc-900"
            >
              FAQs & Hotel Policies
            </button>
            {currentUser?.role === 'customer' && (
              <button
                onClick={() => handleMobileNav('my-bookings')}
                className="text-left py-2 text-sm text-amber-400 font-semibold"
              >
                My Active Bookings
              </button>
            )}
            {currentUser && currentUser.role !== 'customer' && (
              <button
                onClick={() => handleMobileNav('admin')}
                className="text-left py-2 text-sm text-amber-400 font-semibold flex items-center gap-2"
              >
                <ShieldCheck className="w-4 h-4" /> Admin Panel ({currentUser.role.replace('_', ' ')})
              </button>
            )}
          </nav>

          {currentUser && (
            <div className="pt-3 border-t border-zinc-800 flex items-center justify-between">
              <button
                onClick={() => {
                  triggerWelcomeAnimation();
                  setMobileMenuOpen(false);
                }}
                className="text-left"
              >
                <div className="text-xs font-semibold text-white">{currentUser.name}</div>
                <div className="text-[10px] text-amber-400 font-mono capitalize">
                  {currentUser.role.replace('_', ' ')}
                </div>
              </button>
              <button
                onClick={() => {
                  logout();
                  setMobileMenuOpen(false);
                }}
                className="px-3 py-1.5 rounded-lg bg-red-950/50 text-red-300 border border-red-800/50 text-xs font-semibold flex items-center gap-1.5"
              >
                <LogOut className="w-3.5 h-3.5" /> Sign Out
              </button>
            </div>
          )}
        </div>
      )}
    </header>
  );
};
