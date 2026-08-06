import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { RoomCard } from './components/RoomCard';
import { LocationGallery } from './components/LocationGallery';
import { FAQSection } from './components/FAQSection';
import { MyBookingsView } from './components/MyBookingsView';
import { Footer } from './components/Footer';
import { AdminDashboard } from './components/admin/AdminDashboard';
import { BookingModal } from './components/BookingModal';
import { InvoiceModal } from './components/InvoiceModal';
import { UnifiedLoginModal } from './components/UnifiedLoginModal';
import { WelcomeAnimationModal } from './components/WelcomeAnimationModal';
import { RoomCategory } from './types';
import { BedDouble, Sparkles, Filter, Search, MapPin } from 'lucide-react';

const MainContent: React.FC = () => {
  const {
    activeView,
    setActiveView,
    roomCategories,
    selectedCategoryForBooking,
    setSelectedCategoryForBooking,
    isBookingModalOpen,
    setIsBookingModalOpen,
    invoiceModalBooking,
    setInvoiceModalBooking,
    isLoginModalOpen,
    setIsLoginModalOpen,
    hotelConfig,
  } = useApp();

  const [filterClimate, setFilterClimate] = React.useState<'all' | 'AC' | 'Non-AC'>('all');
  const [filterBed, setFilterBed] = React.useState<'all' | 'Single Bed' | 'Double Bed'>('all');

  const filteredCategories = roomCategories.filter((cat) => {
    if (!cat.isVisible) return false;
    if (filterClimate !== 'all' && cat.type !== filterClimate) return false;
    if (filterBed !== 'all' && !cat.bedType.includes(filterBed)) return false;
    return true;
  });

  const handleBookNow = (category: RoomCategory) => {
    setSelectedCategoryForBooking(category);
    setIsBookingModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-[#050505] text-gray-200 flex flex-col font-sans selection:bg-[#D4AF37] selection:text-black">
      <Header />

      <main className="flex-1">
        {activeView === 'home' && (
          <>
            <Hero />

            {/* Featured Dynamic Rooms & Categories Section */}
            <section className="py-16 bg-[#050505] border-b border-white/10">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                  <div>
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#D4AF37]/10 border border-[#D4AF37]/30 text-[#D4AF37] text-[10px] font-bold uppercase tracking-widest mb-2">
                      <BedDouble className="w-3.5 h-3.5" />
                      <span>STAFF-CONTROLLED ROOM CATEGORIES</span>
                    </div>
                    <h2 className="text-3xl sm:text-4xl font-serif italic text-white">
                      Room Categories & Live Pricing
                    </h2>
                    <p className="text-xs text-gray-400 mt-1 max-w-xl">
                      Rates, specs, amenities, and live availability statuses are managed in real-time by hotel staff.
                    </p>
                  </div>

                  {/* Filter Controls */}
                  <div className="flex flex-wrap items-center gap-2 bg-[#0A0A0A] p-1.5 rounded-xl border border-white/10">
                    <button
                      onClick={() => setFilterClimate('all')}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-colors ${
                        filterClimate === 'all'
                          ? 'bg-[#D4AF37] text-black font-extrabold'
                          : 'text-gray-400 hover:text-white'
                      }`}
                    >
                      All
                    </button>
                    <button
                      onClick={() => setFilterClimate('AC')}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-colors ${
                        filterClimate === 'AC'
                          ? 'bg-[#D4AF37] text-black font-extrabold'
                          : 'text-gray-400 hover:text-white'
                      }`}
                    >
                      AC Rooms
                    </button>
                    <button
                      onClick={() => setFilterClimate('Non-AC')}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-colors ${
                        filterClimate === 'Non-AC'
                          ? 'bg-[#D4AF37] text-black font-extrabold'
                          : 'text-gray-400 hover:text-white'
                      }`}
                    >
                      Non-AC Rooms
                    </button>
                  </div>
                </div>

                {/* Rooms Grid */}
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
                  {filteredCategories.map((category) => (
                    <RoomCard
                      key={category.id}
                      category={category}
                      onBookNow={handleBookNow}
                    />
                  ))}
                </div>
              </div>
            </section>

            <LocationGallery />
            <FAQSection />
          </>
        )}

        {activeView === 'rooms' && (
          <section className="py-12 bg-[#050505]">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
              <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-white/10 pb-6">
                <div>
                  <h1 className="text-3xl sm:text-4xl font-serif italic text-white">All Rooms & Rates</h1>
                  <p className="text-xs text-gray-400 mt-1">
                    Select your preferred accommodation with live availability indicators.
                  </p>
                </div>

                {/* Filters */}
                <div className="flex flex-wrap items-center gap-3">
                  <div className="flex items-center gap-1 bg-[#0A0A0A] p-1 rounded-xl border border-white/10">
                    <button
                      onClick={() => setFilterClimate('all')}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider ${
                        filterClimate === 'all' ? 'bg-[#D4AF37] text-black' : 'text-gray-400'
                      }`}
                    >
                      All Climate
                    </button>
                    <button
                      onClick={() => setFilterClimate('AC')}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider ${
                        filterClimate === 'AC' ? 'bg-[#D4AF37] text-black' : 'text-gray-400'
                      }`}
                    >
                      AC Only
                    </button>
                    <button
                      onClick={() => setFilterClimate('Non-AC')}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider ${
                        filterClimate === 'Non-AC' ? 'bg-[#D4AF37] text-black' : 'text-gray-400'
                      }`}
                    >
                      Non-AC
                    </button>
                  </div>

                  <div className="flex items-center gap-1 bg-[#0A0A0A] p-1 rounded-xl border border-white/10">
                    <button
                      onClick={() => setFilterBed('all')}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider ${
                        filterBed === 'all' ? 'bg-[#D4AF37] text-black' : 'text-gray-400'
                      }`}
                    >
                      All Beds
                    </button>
                    <button
                      onClick={() => setFilterBed('Single Bed')}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider ${
                        filterBed === 'Single Bed' ? 'bg-[#D4AF37] text-black' : 'text-gray-400'
                      }`}
                    >
                      Single Bed
                    </button>
                    <button
                      onClick={() => setFilterBed('Double Bed')}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider ${
                        filterBed === 'Double Bed' ? 'bg-[#D4AF37] text-black' : 'text-gray-400'
                      }`}
                    >
                      Double Bed
                    </button>
                  </div>
                </div>
              </div>

              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredCategories.map((category) => (
                  <RoomCard key={category.id} category={category} onBookNow={handleBookNow} />
                ))}
              </div>
            </div>
          </section>
        )}

        {activeView === 'gallery' && <LocationGallery />}
        {activeView === 'faqs' && <FAQSection />}
        {activeView === 'my-bookings' && <MyBookingsView />}
        {activeView === 'admin' && <AdminDashboard />}
      </main>

      <Footer />

      {/* Global Modals */}
      <WelcomeAnimationModal />

      {isLoginModalOpen && (
        <UnifiedLoginModal onClose={() => setIsLoginModalOpen(false)} />
      )}

      {isBookingModalOpen && selectedCategoryForBooking && (
        <BookingModal
          category={selectedCategoryForBooking}
          onClose={() => {
            setIsBookingModalOpen(false);
            setSelectedCategoryForBooking(null);
          }}
        />
      )}

      {invoiceModalBooking && (
        <InvoiceModal
          booking={invoiceModalBooking}
          onClose={() => setInvoiceModalBooking(null)}
        />
      )}
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainContent />
    </AppProvider>
  );
}
