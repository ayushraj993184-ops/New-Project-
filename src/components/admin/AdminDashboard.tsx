import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  UserRole,
  RoomStatus,
  RoomCategory,
  Amenity,
  PromoCode,
  FAQItem,
  User,
} from '../../types';
import { DynamicIcon } from '../DynamicIcon';
import {
  ShieldCheck,
  Crown,
  Users,
  Grid,
  Calendar,
  BedDouble,
  Sparkles,
  Plus,
  Edit2,
  Trash2,
  Tag,
  HelpCircle,
  Settings,
  History,
  CheckCircle2,
  AlertCircle,
  FileText,
  Clock,
  Eye,
  X,
  Search,
  Zap,
  Flame,
  RotateCcw,
} from 'lucide-react';

export const AdminDashboard: React.FC = () => {
  const {
    currentUser,
    hotelConfig,
    updateHotelConfig,
    users,
    addStaffUser,
    deleteStaffUser,
    roomCategories,
    addRoomCategory,
    updateRoomCategory,
    deleteRoomCategory,
    roomInstances,
    updateRoomInstanceStatus,
    amenities,
    addAmenity,
    updateAmenity,
    deleteAmenity,
    promoCodes,
    addPromoCode,
    updatePromoCode,
    deletePromoCode,
    bookings,
    updateBookingStatus,
    setInvoiceModalBooking,
    faqs,
    addFAQ,
    updateFAQ,
    deleteFAQ,
    auditLogs,
    resetToDefaultData,
    adminTab,
    setAdminTab,
  } = useApp();

  const role = currentUser?.role || 'customer';

  // Permission checks
  const isSuperAdmin = role === 'super_admin';
  const isAdmin = role === 'admin' || isSuperAdmin;
  const isSubAdmin = role === 'sub_admin' || isAdmin;

  // Modals / Form State inside Admin
  const [showAddRoomModal, setShowAddRoomModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState<RoomCategory | null>(null);

  const [showAddAmenityModal, setShowAddAmenityModal] = useState(false);
  const [showAddPromoModal, setShowAddPromoModal] = useState(false);
  const [showAddFAQModal, setShowAddFAQModal] = useState(false);
  const [showAddStaffModal, setShowAddStaffModal] = useState(false);

  // New Category Form State
  const [newCatTitle, setNewCatTitle] = useState('');
  const [newCatType, setNewCatType] = useState<'AC' | 'Non-AC'>('AC');
  const [newCatBed, setNewCatBed] = useState<'Single Bed' | 'Double Bed' | 'Deluxe Family Bed'>('Double Bed');
  const [newCatPriceOff, setNewCatPriceOff] = useState(1200);
  const [newCatPricePeak, setNewCatPricePeak] = useState(1600);
  const [newCatDesc, setNewCatDesc] = useState('');
  const [newCatCapacity, setNewCatCapacity] = useState(2);
  const [newCatImage, setNewCatImage] = useState('https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=800&q=80');
  const [newCatRooms, setNewCatRooms] = useState('401, 402, 403');
  const [newCatAmenities, setNewCatAmenities] = useState<string[]>([]);

  // New Amenity Form State
  const [newAmenityName, setNewAmenityName] = useState('');
  const [newAmenityIcon, setNewAmenityIcon] = useState('Sparkles');
  const [newAmenityDesc, setNewAmenityDesc] = useState('');
  const [newAmenityGlobal, setNewAmenityGlobal] = useState(false);

  // New Promo Code Form State
  const [newPromoCode, setNewPromoCode] = useState('');
  const [newPromoType, setNewPromoType] = useState<'flat' | 'percentage'>('flat');
  const [newPromoVal, setNewPromoVal] = useState(150);
  const [newPromoMin, setNewPromoMin] = useState(1000);
  const [newPromoExpiry, setNewPromoExpiry] = useState('2026-12-31');

  // New FAQ Form State
  const [newFAQQuestion, setNewFAQQuestion] = useState('');
  const [newFAQAnswer, setNewFAQAnswer] = useState('');
  const [newFAQCategory, setNewFAQCategory] = useState<'Check-In/Out' | 'Pricing & Booking' | 'Amenities' | 'Policies'>('Pricing & Booking');

  // New Staff Form State
  const [newStaffName, setNewStaffName] = useState('');
  const [newStaffUsername, setNewStaffUsername] = useState('');
  const [newStaffEmail, setNewStaffEmail] = useState('');
  const [newStaffRole, setNewStaffRole] = useState<UserRole>('sub_admin');

  // Handlers
  const handleSaveCategory = (e: React.FormEvent) => {
    e.preventDefault();
    const roomNumsArr = newCatRooms.split(',').map((s) => s.trim()).filter(Boolean);

    if (editingCategory) {
      updateRoomCategory(editingCategory.id, {
        title: newCatTitle,
        type: newCatType,
        bedType: newCatBed,
        basePriceOffSeason: Number(newCatPriceOff),
        basePricePeakSeason: Number(newCatPricePeak),
        description: newCatDesc,
        maxCapacity: Number(newCatCapacity),
        imageUrl: newCatImage,
        roomNumbers: roomNumsArr,
        amenityIds: newCatAmenities,
      });
      setEditingCategory(null);
    } else {
      addRoomCategory({
        title: newCatTitle,
        type: newCatType,
        bedType: newCatBed,
        basePriceOffSeason: Number(newCatPriceOff),
        basePricePeakSeason: Number(newCatPricePeak),
        description: newCatDesc,
        maxCapacity: Number(newCatCapacity),
        imageUrl: newCatImage,
        roomNumbers: roomNumsArr,
        amenityIds: newCatAmenities,
        liveStatus: 'Available',
        isVisible: true,
      });
    }
    setShowAddRoomModal(false);
  };

  const handleSaveAmenity = (e: React.FormEvent) => {
    e.preventDefault();
    addAmenity({
      name: newAmenityName,
      iconName: newAmenityIcon,
      description: newAmenityDesc,
      isGlobal: newAmenityGlobal,
    });
    setNewAmenityName('');
    setShowAddAmenityModal(false);
  };

  const handleSavePromo = (e: React.FormEvent) => {
    e.preventDefault();
    addPromoCode({
      code: newPromoCode,
      discountType: newPromoType,
      discountValue: Number(newPromoVal),
      minBookingAmount: Number(newPromoMin),
      expiryDate: newPromoExpiry,
      isActive: true,
    });
    setNewPromoCode('');
    setShowAddPromoModal(false);
  };

  const handleSaveFAQ = (e: React.FormEvent) => {
    e.preventDefault();
    addFAQ({
      question: newFAQQuestion,
      answer: newFAQAnswer,
      category: newFAQCategory,
      isPublished: true,
    });
    setNewFAQQuestion('');
    setNewFAQAnswer('');
    setShowAddFAQModal(false);
  };

  const handleSaveStaff = (e: React.FormEvent) => {
    e.preventDefault();
    addStaffUser({
      name: newStaffName,
      username: newStaffUsername,
      email: newStaffEmail,
      role: newStaffRole,
    });
    setNewStaffName('');
    setNewStaffUsername('');
    setNewStaffEmail('');
    setShowAddStaffModal(false);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 text-white">
      {/* Top Banner Header */}
      <div className="p-6 rounded-2xl bg-zinc-900 border border-zinc-800 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-md bg-amber-500/20 text-amber-400 border border-amber-500/30 text-xs font-mono font-bold uppercase tracking-wider">
              ROLE: {role.replace('_', ' ')}
            </span>
            <span className="text-xs text-zinc-400">• Logged as {currentUser?.name}</span>
          </div>
          <h1 className="text-2xl font-extrabold text-white flex items-center gap-2">
            <ShieldCheck className="w-6 h-6 text-amber-400" />
            <span>Kumar Guest House Management System</span>
          </h1>
        </div>

        <div className="flex items-center gap-3">
          {/* Peak Season Surcharge Toggle Quick Action */}
          {isSuperAdmin && (
            <button
              onClick={() =>
                updateHotelConfig({ isPeakSeasonActive: !hotelConfig.isPeakSeasonActive })
              }
              className={`px-4 py-2 rounded-xl text-xs font-bold border transition-colors flex items-center gap-1.5 ${
                hotelConfig.isPeakSeasonActive
                  ? 'bg-amber-500/20 text-amber-300 border-amber-500/50'
                  : 'bg-zinc-800 text-zinc-400 border-zinc-700'
              }`}
            >
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span>Peak Season Surcharge: {hotelConfig.isPeakSeasonActive ? 'ACTIVE (+₹300)' : 'OFF'}</span>
            </button>
          )}

          {isSuperAdmin && (
            <button
              onClick={resetToDefaultData}
              title="Reset System State to Default Factory Seeds"
              className="px-3 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-300 border border-zinc-700 text-xs font-medium flex items-center gap-1.5"
            >
              <RotateCcw className="w-3.5 h-3.5 text-amber-400" /> Reset Seeds
            </button>
          )}
        </div>
      </div>

      {/* Admin Sub-Navigation Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-zinc-800">
        <button
          onClick={() => setAdminTab('availability')}
          className={`px-4 py-2.5 rounded-xl text-xs font-bold whitespace-nowrap transition-colors flex items-center gap-2 ${
            adminTab === 'availability'
              ? 'bg-amber-500 text-zinc-950 shadow-md shadow-amber-500/20'
              : 'bg-zinc-900 text-zinc-400 hover:text-white border border-zinc-800'
          }`}
        >
          <Grid className="w-4 h-4" /> Live Room Status Control
        </button>

        <button
          onClick={() => setAdminTab('bookings')}
          className={`px-4 py-2.5 rounded-xl text-xs font-bold whitespace-nowrap transition-colors flex items-center gap-2 ${
            adminTab === 'bookings'
              ? 'bg-amber-500 text-zinc-950 shadow-md shadow-amber-500/20'
              : 'bg-zinc-900 text-zinc-400 hover:text-white border border-zinc-800'
          }`}
        >
          <Calendar className="w-4 h-4" /> Bookings & Invoices ({bookings.length})
        </button>

        {isSuperAdmin && (
          <button
            onClick={() => setAdminTab('categories')}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold whitespace-nowrap transition-colors flex items-center gap-2 ${
              adminTab === 'categories'
                ? 'bg-amber-500 text-zinc-950 shadow-md shadow-amber-500/20'
                : 'bg-zinc-900 text-zinc-400 hover:text-white border border-zinc-800'
            }`}
          >
            <BedDouble className="w-4 h-4" /> Room Categories & Pricing
          </button>
        )}

        {isSuperAdmin && (
          <button
            onClick={() => setAdminTab('amenities')}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold whitespace-nowrap transition-colors flex items-center gap-2 ${
              adminTab === 'amenities'
                ? 'bg-amber-500 text-zinc-950 shadow-md shadow-amber-500/20'
                : 'bg-zinc-900 text-zinc-400 hover:text-white border border-zinc-800'
            }`}
          >
            <Sparkles className="w-4 h-4" /> Amenities Management
          </button>
        )}

        {isSuperAdmin && (
          <button
            onClick={() => setAdminTab('promos')}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold whitespace-nowrap transition-colors flex items-center gap-2 ${
              adminTab === 'promos'
                ? 'bg-amber-500 text-zinc-950 shadow-md shadow-amber-500/20'
                : 'bg-zinc-900 text-zinc-400 hover:text-white border border-zinc-800'
            }`}
          >
            <Tag className="w-4 h-4" /> Promo Codes ({promoCodes.length})
          </button>
        )}

        {isSuperAdmin && (
          <button
            onClick={() => setAdminTab('faqs')}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold whitespace-nowrap transition-colors flex items-center gap-2 ${
              adminTab === 'faqs'
                ? 'bg-amber-500 text-zinc-950 shadow-md shadow-amber-500/20'
                : 'bg-zinc-900 text-zinc-400 hover:text-white border border-zinc-800'
            }`}
          >
            <HelpCircle className="w-4 h-4" /> FAQs & Policies
          </button>
        )}

        {isSuperAdmin && (
          <button
            onClick={() => setAdminTab('staff')}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold whitespace-nowrap transition-colors flex items-center gap-2 ${
              adminTab === 'staff'
                ? 'bg-amber-500 text-zinc-950 shadow-md shadow-amber-500/20'
                : 'bg-zinc-900 text-zinc-400 hover:text-white border border-zinc-800'
            }`}
          >
            <Users className="w-4 h-4" /> Staff & Roles ({users.length})
          </button>
        )}

        {isSuperAdmin && (
          <button
            onClick={() => setAdminTab('audit')}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold whitespace-nowrap transition-colors flex items-center gap-2 ${
              adminTab === 'audit'
                ? 'bg-amber-500 text-zinc-950 shadow-md shadow-amber-500/20'
                : 'bg-zinc-900 text-zinc-400 hover:text-white border border-zinc-800'
            }`}
          >
            <History className="w-4 h-4" /> Audit Logs
          </button>
        )}

        {isSuperAdmin && (
          <button
            onClick={() => setAdminTab('settings')}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold whitespace-nowrap transition-colors flex items-center gap-2 ${
              adminTab === 'settings'
                ? 'bg-amber-500 text-zinc-950 shadow-md shadow-amber-500/20'
                : 'bg-zinc-900 text-zinc-400 hover:text-white border border-zinc-800'
            }`}
          >
            <Settings className="w-4 h-4" /> Hotel Settings
          </button>
        )}
      </div>

      {/* TAB 1: LIVE ROOM AVAILABILITY INDICATORS */}
      {adminTab === 'availability' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-zinc-900 p-4 rounded-xl border border-zinc-800">
            <div>
              <h3 className="font-bold text-white text-base">Live Staff-Controlled Room Availability Indicators</h3>
              <p className="text-xs text-zinc-400">
                Staff & Admins can toggle room status directly. Real-time updates appear immediately on the customer portal.
              </p>
            </div>
            <div className="flex items-center gap-3 text-xs font-mono">
              <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-emerald-400" /> Available</span>
              <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-rose-400" /> Occupied</span>
              <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-amber-400" /> Maintenance</span>
              <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-blue-400" /> Reserved</span>
            </div>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {roomInstances.map((inst) => {
              const cat = roomCategories.find((c) => c.id === inst.categoryId);
              return (
                <div
                  key={inst.roomNumber}
                  className="p-4 bg-zinc-900 border border-zinc-800 rounded-2xl space-y-3 hover:border-amber-500/30 transition-all"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-xl font-extrabold text-white font-mono">Room #{inst.roomNumber}</span>
                      <div className="text-xs text-zinc-400">{cat?.title || 'Standard Category'}</div>
                    </div>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-bold font-mono border ${
                        inst.status === 'Available'
                          ? 'bg-emerald-950 text-emerald-300 border-emerald-700/50'
                          : inst.status === 'Occupied'
                          ? 'bg-rose-950 text-rose-300 border-rose-700/50'
                          : inst.status === 'Cleaning/Maintenance'
                          ? 'bg-amber-950 text-amber-300 border-amber-700/50'
                          : 'bg-blue-950 text-blue-300 border-blue-700/50'
                      }`}
                    >
                      {inst.status}
                    </span>
                  </div>

                  {inst.lastUpdatedBy && (
                    <div className="text-[10px] text-zinc-500 font-mono">
                      Updated by {inst.lastUpdatedBy} at {inst.lastUpdatedAt}
                    </div>
                  )}

                  {/* Toggle Controls */}
                  <div className="pt-2 border-t border-zinc-800 grid grid-cols-2 gap-1.5 text-xs font-medium">
                    <button
                      onClick={() => updateRoomInstanceStatus(inst.roomNumber, 'Available')}
                      className={`py-1.5 rounded-lg border text-[11px] transition-colors ${
                        inst.status === 'Available'
                          ? 'bg-emerald-500 text-zinc-950 font-bold border-emerald-400'
                          : 'bg-zinc-950 text-emerald-400 border-zinc-800 hover:bg-emerald-950'
                      }`}
                    >
                      Available
                    </button>

                    <button
                      onClick={() => updateRoomInstanceStatus(inst.roomNumber, 'Occupied')}
                      className={`py-1.5 rounded-lg border text-[11px] transition-colors ${
                        inst.status === 'Occupied'
                          ? 'bg-rose-500 text-zinc-950 font-bold border-rose-400'
                          : 'bg-zinc-950 text-rose-400 border-zinc-800 hover:bg-rose-950'
                      }`}
                    >
                      Occupied
                    </button>

                    <button
                      onClick={() => updateRoomInstanceStatus(inst.roomNumber, 'Cleaning/Maintenance')}
                      className={`py-1.5 rounded-lg border text-[11px] transition-colors ${
                        inst.status === 'Cleaning/Maintenance'
                          ? 'bg-amber-500 text-zinc-950 font-bold border-amber-400'
                          : 'bg-zinc-950 text-amber-400 border-zinc-800 hover:bg-amber-950'
                      }`}
                    >
                      Housekeeping
                    </button>

                    <button
                      onClick={() => updateRoomInstanceStatus(inst.roomNumber, 'Reserved')}
                      className={`py-1.5 rounded-lg border text-[11px] transition-colors ${
                        inst.status === 'Reserved'
                          ? 'bg-blue-500 text-zinc-950 font-bold border-blue-400'
                          : 'bg-zinc-950 text-blue-400 border-zinc-800 hover:bg-blue-950'
                      }`}
                    >
                      Reserved
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 2: BOOKINGS & INVOICES */}
      {adminTab === 'bookings' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-white text-base">Guest Reservations & Invoices</h3>
            <span className="text-xs text-zinc-400 font-mono">{bookings.length} Total Bookings</span>
          </div>

          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden shadow-xl">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-zinc-950 text-zinc-400 font-bold uppercase tracking-wider border-b border-zinc-800">
                  <tr>
                    <th className="p-3.5">Booking ID & Date</th>
                    <th className="p-3.5">Guest & Contact</th>
                    <th className="p-3.5">ID Proof</th>
                    <th className="p-3.5">Category & Room</th>
                    <th className="p-3.5">Stay Range</th>
                    <th className="p-3.5 text-right">Total Amount</th>
                    <th className="p-3.5 text-center">Status</th>
                    <th className="p-3.5 text-center">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-800/80 font-mono">
                  {bookings.map((b) => (
                    <tr key={b.id} className="hover:bg-zinc-800/40">
                      <td className="p-3.5">
                        <div className="font-bold text-amber-400">{b.id}</div>
                        <div className="text-[10px] text-zinc-500">
                          {new Date(b.createdAt).toLocaleDateString()}
                        </div>
                      </td>

                      <td className="p-3.5">
                        <div className="font-bold text-white font-sans">{b.guestName}</div>
                        <div className="text-[10px] text-zinc-400">{b.guestPhone}</div>
                      </td>

                      <td className="p-3.5">
                        <span className="text-zinc-300 font-sans">{b.idType}</span>
                        <div className="text-[10px] text-zinc-400">{b.idNumber}</div>
                      </td>

                      <td className="p-3.5">
                        <div className="font-semibold text-white font-sans">{b.categoryTitle}</div>
                        <div className="text-[10px] text-amber-300">Room #: {b.roomNumberAssigned || 'Desk Allocation'}</div>
                      </td>

                      <td className="p-3.5">
                        <div>{b.checkInDate} to {b.checkOutDate}</div>
                        <div className="text-[10px] text-zinc-400">{b.stayDurationDays} Night(s)</div>
                      </td>

                      <td className="p-3.5 text-right font-bold text-amber-400">
                        ₹{b.totalAmount}
                      </td>

                      <td className="p-3.5 text-center">
                        <select
                          value={b.bookingStatus}
                          onChange={(e) =>
                            updateBookingStatus(b.id, e.target.value as any)
                          }
                          className="bg-zinc-950 border border-zinc-800 rounded px-2 py-1 text-[11px] text-zinc-200 focus:outline-none focus:border-amber-500"
                        >
                          <option value="Confirmed">Confirmed</option>
                          <option value="Checked-In">Checked-In</option>
                          <option value="Checked-Out">Checked-Out</option>
                          <option value="Cancelled">Cancelled</option>
                        </select>
                      </td>

                      <td className="p-3.5 text-center">
                        <button
                          onClick={() => setInvoiceModalBooking(b)}
                          className="px-2.5 py-1.5 rounded-lg bg-amber-500/15 hover:bg-amber-500/25 text-amber-400 border border-amber-500/30 text-[11px] font-bold inline-flex items-center gap-1 cursor-pointer"
                        >
                          <FileText className="w-3.5 h-3.5" /> Invoice
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: DYNAMIC ROOM CATEGORIES & CARDS MANAGEMENT (Super Admin) */}
      {adminTab === 'categories' && isSuperAdmin && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-bold text-white text-base">Dynamic Room Categories & Room Cards</h3>
              <p className="text-xs text-zinc-400">
                Create new tiers, update base & peak season pricing, specifications, amenities, and photos in real time.
              </p>
            </div>
            <button
              onClick={() => {
                setEditingCategory(null);
                setNewCatTitle('');
                setNewCatDesc('');
                setShowAddRoomModal(true);
              }}
              className="px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-zinc-950 text-xs font-bold flex items-center gap-1.5 shadow cursor-pointer"
            >
              <Plus className="w-4 h-4" /> Create Room Category
            </button>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {roomCategories.map((cat) => (
              <div
                key={cat.id}
                className="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden p-5 space-y-4 shadow-xl"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <img
                      src={cat.imageUrl}
                      alt={cat.title}
                      className="w-16 h-16 rounded-xl object-cover border border-zinc-800"
                    />
                    <div>
                      <h4 className="font-bold text-white text-base">{cat.title}</h4>
                      <div className="text-xs text-amber-400 font-mono">
                        Off-Season: ₹{cat.basePriceOffSeason} | Peak: ₹{cat.basePricePeakSeason}
                      </div>
                      <div className="text-[11px] text-zinc-400">
                        Specs: {cat.type} • {cat.bedType} • Max {cat.maxCapacity} Guests
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => {
                        setEditingCategory(cat);
                        setNewCatTitle(cat.title);
                        setNewCatType(cat.type);
                        setNewCatBed(cat.bedType);
                        setNewCatPriceOff(cat.basePriceOffSeason);
                        setNewCatPricePeak(cat.basePricePeakSeason);
                        setNewCatDesc(cat.description);
                        setNewCatCapacity(cat.maxCapacity);
                        setNewCatImage(cat.imageUrl);
                        setNewCatRooms(cat.roomNumbers.join(', '));
                        setNewCatAmenities(cat.amenityIds);
                        setShowAddRoomModal(true);
                      }}
                      className="p-2 text-amber-400 hover:bg-zinc-800 rounded-lg"
                      title="Edit Category"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => deleteRoomCategory(cat.id)}
                      className="p-2 text-rose-400 hover:bg-zinc-800 rounded-lg"
                      title="Delete Category"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <p className="text-xs text-zinc-400 line-clamp-2">{cat.description}</p>

                <div className="pt-2 border-t border-zinc-800 text-xs text-zinc-400 flex items-center justify-between">
                  <span>Rooms Allocated: <strong className="text-white font-mono">{cat.roomNumbers.join(', ')}</strong></span>
                  <span className="text-[10px] text-emerald-400 bg-emerald-950 border border-emerald-800 px-2 py-0.5 rounded">
                    LIVE ON SITE
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 4: DYNAMIC AMENITIES MANAGEMENT (Super Admin) */}
      {adminTab === 'amenities' && isSuperAdmin && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-bold text-white text-base">Dynamic Hotel Amenities Management</h3>
              <p className="text-xs text-zinc-400">
                Add, edit, or remove amenities (e.g. Free Wi-Fi, Geyser, Power Backup) and assign them to specific room tiers.
              </p>
            </div>
            <button
              onClick={() => setShowAddAmenityModal(true)}
              className="px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-zinc-950 text-xs font-bold flex items-center gap-1.5 shadow cursor-pointer"
            >
              <Plus className="w-4 h-4" /> Add New Amenity
            </button>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {amenities.map((a) => (
              <div
                key={a.id}
                className="p-4 bg-zinc-900 border border-zinc-800 rounded-2xl space-y-2 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <div className="p-2 rounded-lg bg-amber-500/10 text-amber-400">
                      <DynamicIcon name={a.iconName} className="w-5 h-5" />
                    </div>
                    <button
                      onClick={() => deleteAmenity(a.id)}
                      className="p-1 text-zinc-500 hover:text-rose-400"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                  <h4 className="font-bold text-white text-sm">{a.name}</h4>
                  <p className="text-xs text-zinc-400 mt-1 line-clamp-2">{a.description}</p>
                </div>

                <div className="pt-2 border-t border-zinc-800 text-[10px] text-amber-400 font-mono">
                  {a.isGlobal ? 'Global Across All Rooms' : 'Tier Assigned'}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 5: INSTANT COUPON / PROMO CODE ENGINE (Super Admin) */}
      {adminTab === 'promos' && isSuperAdmin && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-bold text-white text-base">Instant Coupon & Promo Code Engine</h3>
              <p className="text-xs text-zinc-400">
                Create festive discounts or seasonal coupons that apply dynamically during customer booking checkout.
              </p>
            </div>
            <button
              onClick={() => setShowAddPromoModal(true)}
              className="px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-zinc-950 text-xs font-bold flex items-center gap-1.5 shadow cursor-pointer"
            >
              <Plus className="w-4 h-4" /> Create Promo Code
            </button>
          </div>

          <div className="grid sm:grid-cols-3 gap-4">
            {promoCodes.map((p) => (
              <div
                key={p.id}
                className="p-4 bg-zinc-900 border border-zinc-800 rounded-2xl space-y-3 relative overflow-hidden"
              >
                <div className="flex items-center justify-between">
                  <span className="font-mono font-extrabold text-amber-400 text-lg tracking-wider">
                    {p.code}
                  </span>
                  <button
                    onClick={() => deletePromoCode(p.id)}
                    className="text-zinc-500 hover:text-rose-400"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                <div className="text-xs text-zinc-300 font-mono space-y-1">
                  <div>
                    Discount:{' '}
                    <strong>
                      {p.discountType === 'flat' ? `₹${p.discountValue} OFF` : `${p.discountValue}% OFF`}
                    </strong>
                  </div>
                  <div>Min Booking Amount: ₹{p.minBookingAmount}</div>
                  <div>Total Times Used: {p.usageCount}</div>
                  <div>Expires: {p.expiryDate}</div>
                </div>

                <div className="pt-2 border-t border-zinc-800 flex items-center justify-between text-xs">
                  <span className={p.isActive ? 'text-emerald-400 font-bold' : 'text-zinc-500'}>
                    {p.isActive ? 'ACTIVE' : 'INACTIVE'}
                  </span>
                  <button
                    onClick={() => updatePromoCode(p.id, { isActive: !p.isActive })}
                    className="text-[11px] text-amber-400 underline"
                  >
                    Toggle Active
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 7: FAQS & POLICIES (Super Admin) */}
      {adminTab === 'faqs' && isSuperAdmin && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-bold text-white text-base">Dynamic FAQ & Policy Management</h3>
              <p className="text-xs text-zinc-400">
                Add, edit, or remove published FAQs and rules shown on the public website.
              </p>
            </div>
            <button
              onClick={() => setShowAddFAQModal(true)}
              className="px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-zinc-950 text-xs font-bold flex items-center gap-1.5 shadow cursor-pointer"
            >
              <Plus className="w-4 h-4" /> Add FAQ
            </button>
          </div>

          <div className="grid gap-3">
            {faqs.map((f) => (
              <div
                key={f.id}
                className="p-4 bg-zinc-900 border border-zinc-800 rounded-2xl flex items-start justify-between gap-4"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-zinc-950 text-amber-400 border border-zinc-800">
                      {f.category}
                    </span>
                    <h4 className="font-bold text-white text-sm">{f.question}</h4>
                  </div>
                  <p className="text-xs text-zinc-400">{f.answer}</p>
                </div>

                <button
                  onClick={() => deleteFAQ(f.id)}
                  className="text-zinc-500 hover:text-rose-400 p-1"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 8: STAFF & ROLES (Super Admin) */}
      {adminTab === 'staff' && isSuperAdmin && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-bold text-white text-base">Multi-Tier Staff & Role Management</h3>
              <p className="text-xs text-zinc-400">
                Super Admin can provision new Manager (Admin) or Front Desk Staff (Sub-Admin) credentials.
              </p>
            </div>
            <button
              onClick={() => setShowAddStaffModal(true)}
              className="px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-zinc-950 text-xs font-bold flex items-center gap-1.5 shadow cursor-pointer"
            >
              <Plus className="w-4 h-4" /> Provision Staff Account
            </button>
          </div>

          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden">
            <table className="w-full text-left text-xs">
              <thead className="bg-zinc-950 text-zinc-400 font-bold uppercase border-b border-zinc-800">
                <tr>
                  <th className="p-3.5">Name</th>
                  <th className="p-3.5">Username</th>
                  <th className="p-3.5">Email</th>
                  <th className="p-3.5">Role</th>
                  <th className="p-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800 font-mono">
                {users.map((u) => (
                  <tr key={u.id} className="hover:bg-zinc-800/40">
                    <td className="p-3.5 font-sans font-bold text-white">{u.name}</td>
                    <td className="p-3.5 text-amber-400">{u.username}</td>
                    <td className="p-3.5 text-zinc-400">{u.email}</td>
                    <td className="p-3.5 font-sans">
                      <span className="px-2 py-0.5 rounded bg-amber-500/10 text-amber-300 border border-amber-500/20 text-[10px]">
                        {u.role.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="p-3.5 text-right">
                      {u.role !== 'super_admin' && (
                        <button
                          onClick={() => deleteStaffUser(u.id)}
                          className="p-1.5 text-rose-400 hover:bg-rose-950/40 rounded"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 9: STAFF ACTIVITY AUDIT LOGS (Super Admin) */}
      {adminTab === 'audit' && isSuperAdmin && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-white text-base">Staff Activity Audit Log Trail</h3>
            <span className="text-xs text-zinc-400 font-mono">{auditLogs.length} Total Audit Records</span>
          </div>

          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden">
            <div className="p-4 bg-zinc-950 border-b border-zinc-800 text-xs text-zinc-400">
              Tracks all actions taken by Admins and Sub-Admins (status updates, booking modifications, pricing rules) for accountability.
            </div>

            <div className="divide-y divide-zinc-800/80 font-mono text-xs">
              {auditLogs.map((log) => (
                <div key={log.id} className="p-3.5 hover:bg-zinc-800/30 flex items-start gap-4">
                  <div className="w-32 shrink-0 text-zinc-500 text-[10px]">
                    {new Date(log.timestamp).toLocaleString()}
                  </div>
                  <div className="w-28 shrink-0 font-bold text-amber-400 font-sans">
                    {log.staffName}
                  </div>
                  <div className="w-24 shrink-0 text-[10px] text-zinc-400 uppercase">
                    {log.actionCategory}
                  </div>
                  <div className="text-zinc-200 font-sans flex-1">{log.details}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 10: HOTEL SETTINGS (Super Admin) */}
      {adminTab === 'settings' && isSuperAdmin && (
        <div className="space-y-6">
          <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-2xl space-y-4">
            <h3 className="font-bold text-white text-base">General Hotel Settings & Contact Channels</h3>

            <div className="grid md:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="block text-zinc-400 mb-1">Hotel Display Name</label>
                <input
                  type="text"
                  value={hotelConfig.hotelName}
                  onChange={(e) => updateHotelConfig({ hotelName: e.target.value })}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-white"
                />
              </div>

              <div>
                <label className="block text-zinc-400 mb-1">Contact Email</label>
                <input
                  type="email"
                  value={hotelConfig.email}
                  onChange={(e) => updateHotelConfig({ email: e.target.value })}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-white"
                />
              </div>

              <div>
                <label className="block text-zinc-400 mb-1">Google Travel Direct URL</label>
                <input
                  type="url"
                  value={hotelConfig.googleTravelUrl}
                  onChange={(e) => updateHotelConfig({ googleTravelUrl: e.target.value })}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-white font-mono"
                />
              </div>

              <div>
                <label className="block text-zinc-400 mb-1">Contact Phone Numbers (Comma Separated)</label>
                <input
                  type="text"
                  value={hotelConfig.phones.join(', ')}
                  onChange={(e) =>
                    updateHotelConfig({
                      phones: e.target.value.split(',').map((s) => s.trim()),
                    })
                  }
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-white font-mono"
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: ADD/EDIT ROOM CATEGORY */}
      {showAddRoomModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
          <div className="w-full max-w-xl bg-zinc-950 border border-zinc-800 rounded-2xl p-6 text-white space-y-4">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
              <h3 className="font-bold text-white text-base">
                {editingCategory ? 'Edit Room Category' : 'Create New Room Category'}
              </h3>
              <button onClick={() => setShowAddRoomModal(false)} className="text-zinc-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveCategory} className="space-y-4 text-xs">
              <div>
                <label className="block text-zinc-400 mb-1">Category Title</label>
                <input
                  type="text"
                  required
                  value={newCatTitle}
                  onChange={(e) => setNewCatTitle(e.target.value)}
                  placeholder="e.g. Non AC Double Bed"
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-2 text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-zinc-400 mb-1">Climate Specification</label>
                  <select
                    value={newCatType}
                    onChange={(e) => setNewCatType(e.target.value as any)}
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-2 text-white"
                  >
                    <option value="AC">AC Room</option>
                    <option value="Non-AC">Non-AC Room</option>
                  </select>
                </div>

                <div>
                  <label className="block text-zinc-400 mb-1">Bed Specification</label>
                  <select
                    value={newCatBed}
                    onChange={(e) => setNewCatBed(e.target.value as any)}
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-2 text-white"
                  >
                    <option value="Single Bed">Single Bed</option>
                    <option value="Double Bed">Double Bed</option>
                    <option value="Deluxe Family Bed">Deluxe Family Bed</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-zinc-400 mb-1">Base Price Off-Season (₹)</label>
                  <input
                    type="number"
                    required
                    value={newCatPriceOff}
                    onChange={(e) => setNewCatPriceOff(Number(e.target.value))}
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-2 text-white font-mono"
                  />
                </div>

                <div>
                  <label className="block text-zinc-400 mb-1">Base Price Peak Season (₹)</label>
                  <input
                    type="number"
                    required
                    value={newCatPricePeak}
                    onChange={(e) => setNewCatPricePeak(Number(e.target.value))}
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-2 text-white font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-zinc-400 mb-1">Room Numbers List (Comma Separated)</label>
                <input
                  type="text"
                  required
                  value={newCatRooms}
                  onChange={(e) => setNewCatRooms(e.target.value)}
                  placeholder="101, 102, 103"
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-2 text-white font-mono"
                />
              </div>

              <div>
                <label className="block text-zinc-400 mb-1">Image URL</label>
                <input
                  type="url"
                  required
                  value={newCatImage}
                  onChange={(e) => setNewCatImage(e.target.value)}
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-2 text-white font-mono"
                />
              </div>

              <div>
                <label className="block text-zinc-400 mb-1">Description</label>
                <textarea
                  rows={2}
                  value={newCatDesc}
                  onChange={(e) => setNewCatDesc(e.target.value)}
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-2 text-white"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-amber-500 text-zinc-950 font-bold text-xs"
              >
                Save Room Category
              </button>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: ADD AMENITY */}
      {showAddAmenityModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="w-full max-w-md bg-zinc-950 border border-zinc-800 rounded-2xl p-6 text-white space-y-4">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
              <h3 className="font-bold text-white text-base">Add New Amenity</h3>
              <button onClick={() => setShowAddAmenityModal(false)} className="text-zinc-400">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveAmenity} className="space-y-4 text-xs">
              <div>
                <label className="block text-zinc-400 mb-1">Amenity Name</label>
                <input
                  type="text"
                  required
                  value={newAmenityName}
                  onChange={(e) => setNewAmenityName(e.target.value)}
                  placeholder="e.g. 24/7 Power Backup"
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-2 text-white"
                />
              </div>

              <div>
                <label className="block text-zinc-400 mb-1">Lucide Icon Key</label>
                <input
                  type="text"
                  value={newAmenityIcon}
                  onChange={(e) => setNewAmenityIcon(e.target.value)}
                  placeholder="Wifi, Zap, Flame, Tv, Car, Coffee, ShieldCheck"
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-2 text-white font-mono"
                />
              </div>

              <div>
                <label className="block text-zinc-400 mb-1">Description</label>
                <input
                  type="text"
                  value={newAmenityDesc}
                  onChange={(e) => setNewAmenityDesc(e.target.value)}
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-2 text-white"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-amber-500 text-zinc-950 font-bold text-xs"
              >
                Add Amenity
              </button>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: ADD PROMO */}
      {showAddPromoModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="w-full max-w-md bg-zinc-950 border border-zinc-800 rounded-2xl p-6 text-white space-y-4">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
              <h3 className="font-bold text-white text-base">Create Promo Code</h3>
              <button onClick={() => setShowAddPromoModal(false)} className="text-zinc-400">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSavePromo} className="space-y-4 text-xs">
              <div>
                <label className="block text-zinc-400 mb-1">Coupon Code String</label>
                <input
                  type="text"
                  required
                  value={newPromoCode}
                  onChange={(e) => setNewPromoCode(e.target.value)}
                  placeholder="e.g. PITRAPAKSHA200"
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-2 text-white font-mono uppercase"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-zinc-400 mb-1">Type</label>
                  <select
                    value={newPromoType}
                    onChange={(e) => setNewPromoType(e.target.value as any)}
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-2 text-white"
                  >
                    <option value="flat">Flat Amount (₹)</option>
                    <option value="percentage">Percentage (%)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-zinc-400 mb-1">Value</label>
                  <input
                    type="number"
                    required
                    value={newPromoVal}
                    onChange={(e) => setNewPromoVal(Number(e.target.value))}
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-2 text-white font-mono"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-amber-500 text-zinc-950 font-bold text-xs"
              >
                Save Promo Code
              </button>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: ADD FAQ */}
      {showAddFAQModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="w-full max-w-md bg-zinc-950 border border-zinc-800 rounded-2xl p-6 text-white space-y-4">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
              <h3 className="font-bold text-white text-base">Add FAQ Question</h3>
              <button onClick={() => setShowAddFAQModal(false)} className="text-zinc-400">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveFAQ} className="space-y-4 text-xs">
              <div>
                <label className="block text-zinc-400 mb-1">Question</label>
                <input
                  type="text"
                  required
                  value={newFAQQuestion}
                  onChange={(e) => setNewFAQQuestion(e.target.value)}
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-2 text-white"
                />
              </div>

              <div>
                <label className="block text-zinc-400 mb-1">Answer</label>
                <textarea
                  rows={3}
                  required
                  value={newFAQAnswer}
                  onChange={(e) => setNewFAQAnswer(e.target.value)}
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-2 text-white"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-amber-500 text-zinc-950 font-bold text-xs"
              >
                Save FAQ
              </button>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: ADD STAFF */}
      {showAddStaffModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="w-full max-w-md bg-zinc-950 border border-zinc-800 rounded-2xl p-6 text-white space-y-4">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
              <h3 className="font-bold text-white text-base">Provision Staff User Account</h3>
              <button onClick={() => setShowAddStaffModal(false)} className="text-zinc-400">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveStaff} className="space-y-4 text-xs">
              <div>
                <label className="block text-zinc-400 mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  value={newStaffName}
                  onChange={(e) => setNewStaffName(e.target.value)}
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-2 text-white"
                />
              </div>

              <div>
                <label className="block text-zinc-400 mb-1">Username</label>
                <input
                  type="text"
                  required
                  value={newStaffUsername}
                  onChange={(e) => setNewStaffUsername(e.target.value)}
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-2 text-white font-mono"
                />
              </div>

              <div>
                <label className="block text-zinc-400 mb-1">Email</label>
                <input
                  type="email"
                  required
                  value={newStaffEmail}
                  onChange={(e) => setNewStaffEmail(e.target.value)}
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-2 text-white font-mono"
                />
              </div>

              <div>
                <label className="block text-zinc-400 mb-1">Role Designation</label>
                <select
                  value={newStaffRole}
                  onChange={(e) => setNewStaffRole(e.target.value as any)}
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-2 text-white"
                >
                  <option value="sub_admin">Sub-Admin (Front Desk Staff)</option>
                  <option value="admin">Admin (Hotel Manager)</option>
                  <option value="super_admin">Super Admin (Owner)</option>
                </select>
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-amber-500 text-zinc-950 font-bold text-xs"
              >
                Create Staff Account
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
