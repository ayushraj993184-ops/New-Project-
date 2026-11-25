import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { RoomCard } from './components/RoomCard';
import { LocationGallery } from './components/LocationGallery';
import { FAQSection } from './components/FAQSection';
import { MyBookingsView } from './components/MyBookingsView';
import { Footer } from './components/Footer';
import { BookingModal } from './components/BookingModal';
import { InvoiceModal } from './components/InvoiceModal';
import { UnifiedLoginModal } from './components/UnifiedLoginModal';
import { WelcomeAnimationModal } from './components/WelcomeAnimationModal';
import { RoomBedFilter, RoomCategory, RoomClimateFilter } from './types';
import { BedDouble } from 'lucide-react';

const AdminDashboard = React.lazy(() =>
  import('./components/admin/AdminDashboard').then((m) => ({ default: m.AdminDashboard }))
);

const CLIMATE_OPTIONS: { value: RoomClimateFilter; label: string }[] = [
  { value: 'all', label: 'All Climate' },
  { value: 'AC', label: 'AC Only' },
  { value: 'Non-AC', label: 'Non-AC' },
];

const BED_OPTIONS: { value: RoomBedFilter; label: string }[] = [
  { value: 'all', label: 'All Beds' },
  { value: 'Single Bed', label: 'Single Bed' },
  { value: 'Double Bed', label: 'Double Bed' },
  { value: 'Deluxe Family Bed', label: 'Family Suite' },
];

const MainContent: React.FC = () => {
  const {
    activeView,
    roomCategories,
    roomClimateFilter,
    setRoomClimateFilter,
    roomBedFilter,
    setRoomBedFilter,
    selectedCategoryForBooking,
    setSelectedCategoryForBooking,
    isBookingModalOpen,
    setIsBookingModalOpen,
    invoiceModalBooking,
    setInvoiceModalBooking,
    isLoginModalOpen,
    setIsLoginModalOpen,
  } = useApp();

  const [homeClimateFilter, setHomeClimateFilter] = React.useState<RoomClimateFilter>('all');

  const homeCategories = roomCategories.filter((cat) => {
    if (!cat.isVisible) return false;
    if (homeClimateFilter !== 'all' && cat.type !== homeClimateFilter) return false;
    return true;
  });

  const roomViewCategories = roomCategories.filter((cat) => {
    if (!cat.isVisible) return false;
    if (roomClimateFilter !== 'all' && cat.type !== roomClimateFilter) return false;
    if (roomBedFilter !== 'all' && cat.bedType !== roomBedFilter) return false;
    return true;
  });

  const handleBookNow = (category: RoomCategory) => {
    setSelectedCategoryForBooking(category);
    setIsBookingModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-[#050505] text-gray-200 flex flex-col font-sans selection:bg-[#D4AF37] selection:text-black">
      <div className={invoiceModalBooking ? 'print:hidden flex flex-col flex-1' : 'flex flex-col flex-1'}>
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

                    {/* Home Filter Controls */}
                    <div className="flex flex-wrap items-center gap-2 bg-[#0A0A0A] p-1.5 rounded-xl border border-white/10">
                      {(['all', 'AC', 'Non-AC'] as RoomClimateFilter[]).map((opt) => (
                        <button
                          key={opt}
                          onClick={() => setHomeClimateFilter(opt)}
                          className={`px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-colors ${
                            homeClimateFilter === opt
                              ? 'bg-[#D4AF37] text-black font-extrabold'
                              : 'text-gray-400 hover:text-white'
                          }`}
                        >
                          {opt === 'all' ? 'All' : `${opt} Rooms`}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Rooms Grid */}
                  {homeCategories.length === 0 ? (
                    <div className="p-8 text-center bg-[#0A0A0A] border border-white/10 rounded-2xl text-sm text-gray-400">
                      No room categories match this filter.
                    </div>
                  ) : (
                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
                      {homeCategories.map((category) => (
                        <RoomCard key={category.id} category={category} onBookNow={handleBookNow} />
                      ))}
                    </div>
                  )}
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
                      {CLIMATE_OPTIONS.map((opt) => (
                        <button
                          key={opt.value}
                          onClick={() => setRoomClimateFilter(opt.value)}
                          className={`px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-colors ${
                            roomClimateFilter === opt.value
                              ? 'bg-[#D4AF37] text-black'
                              : 'text-gray-400 hover:text-white'
                          }`}
                        >
                          {opt.label}
                        </button>
                      ))}
                    </div>

                    <div className="flex flex-wrap items-center gap-1 bg-[#0A0A0A] p-1 rounded-xl border border-white/10">
                      {BED_OPTIONS.map((opt) => (
                        <button
                          key={opt.value}
                          onClick={() => setRoomBedFilter(opt.value)}
                          className={`px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-colors ${
                            roomBedFilter === opt.value
                              ? 'bg-[#D4AF37] text-black'
                              : 'text-gray-400 hover:text-white'
                          }`}
                        >
                          {opt.label}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {roomViewCategories.length === 0 ? (
                  <div className="p-10 text-center bg-[#0A0A0A] border border-white/10 rounded-2xl space-y-3">
                    <p className="text-sm text-gray-400">
                      No rooms match the selected climate and bed filters.
                    </p>
                    <button
                      onClick={() => {
                        setRoomClimateFilter('all');
                        setRoomBedFilter('all');
                      }}
                      className="px-4 py-2 rounded-xl bg-[#D4AF37] text-black text-xs font-bold uppercase tracking-wider"
                    >
                      Reset Filters
                    </button>
                  </div>
                ) : (
                  <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
                    {roomViewCategories.map((category) => (
                      <RoomCard key={category.id} category={category} onBookNow={handleBookNow} />
                    ))}
                  </div>
                )}
              </div>
            </section>
          )}

          {activeView === 'gallery' && <LocationGallery />}
          {activeView === 'faqs' && <FAQSection />}
          {activeView === 'my-bookings' && <MyBookingsView />}
          {activeView === 'admin' && (
            <React.Suspense
              fallback={
                <div className="max-w-7xl mx-auto px-4 py-16 text-center text-xs text-zinc-400">
                  Loading Management Console...
                </div>
              }
            >
              <AdminDashboard />
            </React.Suspense>
          )}
        </main>

        <Footer />
      </div>

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
