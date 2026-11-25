import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  AdminTab,
  Amenity,
  Booking,
  FAQItem,
  PromoCode,
  RoomCategory,
  UserRole,
} from '../../types';
import { getLocalDateStr } from '../../utils/bookingUtils';
import { DynamicIcon } from '../DynamicIcon';
import {
  AmenityModal,
  CategoryModal,
  FAQModal,
  PromoModal,
  StaffModal,
} from './AdminModals';
import { AdminSettingsTab } from './AdminSettingsTab';
import {
  BedDouble,
  Calendar,
  Edit2,
  Eye,
  EyeOff,
  FileText,
  Grid,
  HelpCircle,
  History,
  Lock,
  Plus,
  RotateCcw,
  Settings,
  ShieldCheck,
  Sparkles,
  Tag,
  Trash2,
  Users,
} from 'lucide-react';

const ROLE_WEIGHT: Record<UserRole, number> = {
  customer: 0,
  sub_admin: 1,
  admin: 2,
  super_admin: 3,
};

interface TabDef {
  id: AdminTab;
  label: string;
  icon: React.ElementType;
  minRole: 'sub_admin' | 'admin' | 'super_admin';
}

const ADMIN_TABS: TabDef[] = [
  { id: 'availability', label: 'Live Room Status Control', icon: Grid, minRole: 'sub_admin' },
  { id: 'bookings', label: 'Bookings & Invoices', icon: Calendar, minRole: 'sub_admin' },
  { id: 'categories', label: 'Room Categories & Pricing', icon: BedDouble, minRole: 'admin' },
  { id: 'amenities', label: 'Amenities Management', icon: Sparkles, minRole: 'admin' },
  { id: 'promos', label: 'Promo Codes', icon: Tag, minRole: 'admin' },
  { id: 'faqs', label: 'FAQs & Policies', icon: HelpCircle, minRole: 'admin' },
  { id: 'staff', label: 'Staff & Roles', icon: Users, minRole: 'super_admin' },
  { id: 'audit', label: 'Audit Logs', icon: History, minRole: 'super_admin' },
  { id: 'settings', label: 'Hotel Settings', icon: Settings, minRole: 'super_admin' },
];

export const AdminDashboard: React.FC = () => {
  const {
    currentUser,
    setIsLoginModalOpen,
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

  const [showRoomModal, setShowRoomModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState<RoomCategory | null>(null);

  const [showAmenityModal, setShowAmenityModal] = useState(false);
  const [editingAmenity, setEditingAmenity] = useState<Amenity | null>(null);

  const [showPromoModal, setShowPromoModal] = useState(false);
  const [editingPromo, setEditingPromo] = useState<PromoCode | null>(null);

  const [showFAQModal, setShowFAQModal] = useState(false);
  const [editingFAQ, setEditingFAQ] = useState<FAQItem | null>(null);

  const [showStaffModal, setShowStaffModal] = useState(false);
  const [confirmReset, setConfirmReset] = useState(false);

  if (!currentUser || currentUser.role === 'customer') {
    return (
      <div className="max-w-xl mx-auto my-16 p-8 bg-zinc-900 border border-zinc-800 rounded-2xl text-center space-y-4 text-white">
        <Lock className="w-12 h-12 text-amber-400 mx-auto" />
        <h2 className="text-xl font-bold">Staff &amp; Admin Access Required</h2>
        <p className="text-xs text-zinc-400">
          This management console is restricted to authorized front-desk staff, managers, and owners.
        </p>
        <button
          onClick={() => setIsLoginModalOpen(true)}
          className="px-6 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold text-xs cursor-pointer"
        >
          Sign In as Staff / Admin
        </button>
      </div>
    );
  }

  const role = currentUser.role;
  const userWeight = ROLE_WEIGHT[role];
  const isSuperAdmin = role === 'super_admin';
  const isAdmin = userWeight >= ROLE_WEIGHT.admin;

  const allowedTabs = ADMIN_TABS.filter((tab) => userWeight >= ROLE_WEIGHT[tab.minRole]);
  const activeTab: AdminTab = allowedTabs.some((t) => t.id === adminTab)
    ? adminTab
    : 'availability';

  const todayStr = getLocalDateStr();

  const getTabLabel = (tab: TabDef) => {
    if (tab.id === 'bookings') return `${tab.label} (${bookings.length})`;
    if (tab.id === 'promos') return `${tab.label} (${promoCodes.length})`;
    if (tab.id === 'staff') return `${tab.label} (${users.length})`;
    return tab.label;
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
            <span className="text-xs text-zinc-400">• Logged as {currentUser.name}</span>
          </div>
          <h1 className="text-2xl font-extrabold text-white flex items-center gap-2">
            <ShieldCheck className="w-6 h-6 text-amber-400" />
            <span>{hotelConfig.hotelName} Management System</span>
          </h1>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {isSuperAdmin && (
            <button
              onClick={() =>
                updateHotelConfig({ isPeakSeasonActive: !hotelConfig.isPeakSeasonActive })
              }
              className={`px-4 py-2 rounded-xl text-xs font-bold border transition-colors flex items-center gap-1.5 cursor-pointer ${
                hotelConfig.isPeakSeasonActive
                  ? 'bg-amber-500/20 text-amber-300 border-amber-500/50'
                  : 'bg-zinc-800 text-zinc-400 border-zinc-700'
              }`}
            >
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span>Peak Season Rates: {hotelConfig.isPeakSeasonActive ? 'ACTIVE' : 'OFF'}</span>
            </button>
          )}

          {isSuperAdmin && !confirmReset && (
            <button
              onClick={() => setConfirmReset(true)}
              title="Reset System State to Default Factory Seeds"
              className="px-3 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-300 border border-zinc-700 text-xs font-medium flex items-center gap-1.5 cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5 text-amber-400" /> Reset Seeds
            </button>
          )}

          {isSuperAdmin && confirmReset && (
            <div className="flex items-center gap-2 bg-rose-950/60 border border-rose-800 rounded-xl px-3 py-1.5 text-xs">
              <span className="text-rose-200">Reset all data?</span>
              <button
                onClick={() => {
                  resetToDefaultData();
                  setConfirmReset(false);
                }}
                className="px-2 py-1 rounded bg-rose-600 hover:bg-rose-500 text-white font-bold cursor-pointer"
              >
                Confirm
              </button>
              <button
                onClick={() => setConfirmReset(false)}
                className="px-2 py-1 rounded bg-zinc-800 text-zinc-300 cursor-pointer"
              >
                Cancel
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Admin Sub-Navigation Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-zinc-800">
        {allowedTabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setAdminTab(tab.id)}
              className={`px-4 py-2.5 rounded-xl text-xs font-bold whitespace-nowrap transition-colors flex items-center gap-2 cursor-pointer ${
                isActive
                  ? 'bg-amber-500 text-zinc-950 shadow-md shadow-amber-500/20'
                  : 'bg-zinc-900 text-zinc-400 hover:text-white border border-zinc-800'
              }`}
            >
              <Icon className="w-4 h-4" /> {getTabLabel(tab)}
            </button>
          );
        })}
      </div>

      {/* TAB 1: LIVE ROOM AVAILABILITY INDICATORS */}
      {activeTab === 'availability' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-zinc-900 p-4 rounded-xl border border-zinc-800">
            <div>
              <h3 className="font-bold text-white text-base">Live Staff-Controlled Room Availability</h3>
              <p className="text-xs text-zinc-400">
                Toggle physical room status directly. Updates reflect immediately on the public booking cards.
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-3 text-xs font-mono">
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" /> Available
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-400" /> Occupied
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-400" /> Maintenance
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-blue-400" /> Reserved
              </span>
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

                  <div className="pt-2 border-t border-zinc-800 grid grid-cols-2 gap-1.5 text-xs font-medium">
                    <button
                      onClick={() => updateRoomInstanceStatus(inst.roomNumber, 'Available')}
                      className={`py-1.5 rounded-lg border text-[11px] transition-colors cursor-pointer ${
                        inst.status === 'Available'
                          ? 'bg-emerald-500 text-zinc-950 font-bold border-emerald-400'
                          : 'bg-zinc-950 text-emerald-400 border-zinc-800 hover:bg-emerald-950'
                      }`}
                    >
                      Available
                    </button>

                    <button
                      onClick={() => updateRoomInstanceStatus(inst.roomNumber, 'Occupied')}
                      className={`py-1.5 rounded-lg border text-[11px] transition-colors cursor-pointer ${
                        inst.status === 'Occupied'
                          ? 'bg-rose-500 text-zinc-950 font-bold border-rose-400'
                          : 'bg-zinc-950 text-rose-400 border-zinc-800 hover:bg-rose-950'
                      }`}
                    >
                      Occupied
                    </button>

                    <button
                      onClick={() => updateRoomInstanceStatus(inst.roomNumber, 'Cleaning/Maintenance')}
                      className={`py-1.5 rounded-lg border text-[11px] transition-colors cursor-pointer ${
                        inst.status === 'Cleaning/Maintenance'
                          ? 'bg-amber-500 text-zinc-950 font-bold border-amber-400'
                          : 'bg-zinc-950 text-amber-400 border-zinc-800 hover:bg-amber-950'
                      }`}
                    >
                      Housekeeping
                    </button>

                    <button
                      onClick={() => updateRoomInstanceStatus(inst.roomNumber, 'Reserved')}
                      className={`py-1.5 rounded-lg border text-[11px] transition-colors cursor-pointer ${
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
      {activeTab === 'bookings' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-white text-base">Guest Reservations &amp; Invoices</h3>
            <span className="text-xs text-zinc-400 font-mono">{bookings.length} Total Bookings</span>
          </div>

          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden shadow-xl">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-zinc-950 text-zinc-400 font-bold uppercase tracking-wider border-b border-zinc-800">
                  <tr>
                    <th className="p-3.5">Booking ID &amp; Date</th>
                    <th className="p-3.5">Guest &amp; Contact</th>
                    <th className="p-3.5">ID Proof</th>
                    <th className="p-3.5">Category &amp; Room</th>
                    <th className="p-3.5">Stay Range</th>
                    <th className="p-3.5 text-right">Total Amount</th>
                    <th className="p-3.5 text-center">Status</th>
                    <th className="p-3.5 text-center">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-800/80 font-mono">
                  {bookings.map((b) => {
                    const cat = roomCategories.find((c) => c.id === b.categoryId);
                    const assignableRooms = cat?.roomNumbers || [];

                    return (
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

                        <td className="p-3.5 space-y-1">
                          <div className="font-semibold text-white font-sans">{b.categoryTitle}</div>
                          <select
                            value={b.roomNumberAssigned || ''}
                            onChange={(e) =>
                              updateBookingStatus(b.id, b.bookingStatus, e.target.value)
                            }
                            aria-label={`Assign room for ${b.id}`}
                            className="bg-zinc-950 border border-zinc-800 rounded px-2 py-0.5 text-[11px] text-amber-300 focus:outline-none focus:border-amber-500"
                          >
                            <option value="">Desk Allocation</option>
                            {assignableRooms.map((rm) => (
                              <option key={rm} value={rm}>
                                Room #{rm}
                              </option>
                            ))}
                          </select>
                        </td>

                        <td className="p-3.5">
                          <div>
                            {b.checkInDate} to {b.checkOutDate}
                          </div>
                          <div className="text-[10px] text-zinc-400">{b.stayDurationDays} Night(s)</div>
                        </td>

                        <td className="p-3.5 text-right font-bold text-amber-400">₹{b.totalAmount}</td>

                        <td className="p-3.5 text-center">
                          <select
                            value={b.bookingStatus}
                            onChange={(e) =>
                              updateBookingStatus(
                                b.id,
                                e.target.value as Booking['bookingStatus'],
                                b.roomNumberAssigned
                              )
                            }
                            aria-label={`Booking status for ${b.id}`}
                            className="bg-zinc-950 border border-zinc-800 rounded px-2 py-1 text-[11px] text-zinc-200 focus:outline-none focus:border-amber-500"
                          >
                            <option value="Pending">Pending</option>
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
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: DYNAMIC ROOM CATEGORIES & CARDS MANAGEMENT */}
      {activeTab === 'categories' && isAdmin && (
        <div className="space-y-6">
          <div className="flex items-center justify-between gap-4">
            <div>
              <h3 className="font-bold text-white text-base">Dynamic Room Categories &amp; Room Cards</h3>
              <p className="text-xs text-zinc-400">
                Create tiers, update off-season &amp; peak season pricing, amenities, room numbers, and visibility.
              </p>
            </div>
            <button
              onClick={() => {
                setEditingCategory(null);
                setShowRoomModal(true);
              }}
              className="px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-zinc-950 text-xs font-bold flex items-center gap-1.5 shadow cursor-pointer shrink-0"
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
                      onClick={() => updateRoomCategory(cat.id, { isVisible: !cat.isVisible })}
                      className="p-2 text-zinc-400 hover:text-amber-400 hover:bg-zinc-800 rounded-lg cursor-pointer"
                      title={cat.isVisible ? 'Hide from public site' : 'Show on public site'}
                    >
                      {cat.isVisible ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                    </button>
                    <button
                      onClick={() => {
                        setEditingCategory(cat);
                        setShowRoomModal(true);
                      }}
                      className="p-2 text-amber-400 hover:bg-zinc-800 rounded-lg cursor-pointer"
                      title="Edit Category"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => deleteRoomCategory(cat.id)}
                      className="p-2 text-rose-400 hover:bg-zinc-800 rounded-lg cursor-pointer"
                      title="Delete Category"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <p className="text-xs text-zinc-400 line-clamp-2">{cat.description}</p>

                <div className="pt-2 border-t border-zinc-800 text-xs text-zinc-400 flex items-center justify-between">
                  <span>
                    Rooms Allocated: <strong className="text-white font-mono">{cat.roomNumbers.join(', ')}</strong>
                  </span>
                  <span
                    className={`text-[10px] px-2 py-0.5 rounded border ${
                      cat.isVisible
                        ? 'text-emerald-400 bg-emerald-950 border-emerald-800'
                        : 'text-zinc-400 bg-zinc-950 border-zinc-700'
                    }`}
                  >
                    {cat.isVisible ? 'LIVE ON SITE' : 'HIDDEN'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 4: DYNAMIC AMENITIES MANAGEMENT */}
      {activeTab === 'amenities' && isAdmin && (
        <div className="space-y-6">
          <div className="flex items-center justify-between gap-4">
            <div>
              <h3 className="font-bold text-white text-base">Dynamic Hotel Amenities Management</h3>
              <p className="text-xs text-zinc-400">
                Add, edit, or remove amenities and mark them as global or tier-specific.
              </p>
            </div>
            <button
              onClick={() => {
                setEditingAmenity(null);
                setShowAmenityModal(true);
              }}
              className="px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-zinc-950 text-xs font-bold flex items-center gap-1.5 shadow cursor-pointer shrink-0"
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
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => {
                          setEditingAmenity(a);
                          setShowAmenityModal(true);
                        }}
                        aria-label={`Edit ${a.name}`}
                        className="p-1 text-zinc-400 hover:text-amber-400 cursor-pointer"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => deleteAmenity(a.id)}
                        aria-label={`Delete ${a.name}`}
                        className="p-1 text-zinc-500 hover:text-rose-400 cursor-pointer"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
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

      {/* TAB 5: INSTANT COUPON / PROMO CODE ENGINE */}
      {activeTab === 'promos' && isAdmin && (
        <div className="space-y-6">
          <div className="flex items-center justify-between gap-4">
            <div>
              <h3 className="font-bold text-white text-base">Instant Coupon &amp; Promo Code Engine</h3>
              <p className="text-xs text-zinc-400">
                Create or update festive discounts and minimum booking rules for checkout.
              </p>
            </div>
            <button
              onClick={() => {
                setEditingPromo(null);
                setShowPromoModal(true);
              }}
              className="px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-zinc-950 text-xs font-bold flex items-center gap-1.5 shadow cursor-pointer shrink-0"
            >
              <Plus className="w-4 h-4" /> Create Promo Code
            </button>
          </div>

          <div className="grid sm:grid-cols-3 gap-4">
            {promoCodes.map((p) => {
              const isExpired = Boolean(p.expiryDate && p.expiryDate < todayStr);
              return (
                <div
                  key={p.id}
                  className="p-4 bg-zinc-900 border border-zinc-800 rounded-2xl space-y-3 relative overflow-hidden"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono font-extrabold text-amber-400 text-lg tracking-wider">
                      {p.code}
                    </span>
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => {
                          setEditingPromo(p);
                          setShowPromoModal(true);
                        }}
                        aria-label={`Edit ${p.code}`}
                        className="p-1 text-zinc-400 hover:text-amber-400 cursor-pointer"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => deletePromoCode(p.id)}
                        aria-label={`Delete ${p.code}`}
                        className="p-1 text-zinc-500 hover:text-rose-400 cursor-pointer"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
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
                    <div className={isExpired ? 'text-rose-400 font-bold' : ''}>
                      Expires: {p.expiryDate} {isExpired ? '(EXPIRED)' : ''}
                    </div>
                  </div>

                  <div className="pt-2 border-t border-zinc-800 flex items-center justify-between text-xs">
                    <span className={p.isActive && !isExpired ? 'text-emerald-400 font-bold' : 'text-zinc-500'}>
                      {isExpired ? 'EXPIRED' : p.isActive ? 'ACTIVE' : 'INACTIVE'}
                    </span>
                    <button
                      onClick={() => updatePromoCode(p.id, { isActive: !p.isActive })}
                      className="text-[11px] text-amber-400 underline cursor-pointer"
                    >
                      Toggle Active
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 6: FAQS & POLICIES */}
      {activeTab === 'faqs' && isAdmin && (
        <div className="space-y-6">
          <div className="flex items-center justify-between gap-4">
            <div>
              <h3 className="font-bold text-white text-base">Dynamic FAQ &amp; Policy Management</h3>
              <p className="text-xs text-zinc-400">
                Add, edit, publish, or hide FAQs displayed on the public website.
              </p>
            </div>
            <button
              onClick={() => {
                setEditingFAQ(null);
                setShowFAQModal(true);
              }}
              className="px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-zinc-950 text-xs font-bold flex items-center gap-1.5 shadow cursor-pointer shrink-0"
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
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-zinc-950 text-amber-400 border border-zinc-800">
                      {f.category}
                    </span>
                    <span
                      className={`text-[10px] font-mono px-2 py-0.5 rounded border ${
                        f.isPublished
                          ? 'bg-emerald-950/60 text-emerald-300 border-emerald-800'
                          : 'bg-zinc-950 text-zinc-500 border-zinc-800'
                      }`}
                    >
                      {f.isPublished ? 'Published' : 'Hidden'}
                    </span>
                    <h4 className="font-bold text-white text-sm">{f.question}</h4>
                  </div>
                  <p className="text-xs text-zinc-400">{f.answer}</p>
                </div>

                <div className="flex items-center gap-1 shrink-0">
                  <button
                    onClick={() => updateFAQ(f.id, { isPublished: !f.isPublished })}
                    className="text-zinc-400 hover:text-amber-400 p-1.5 cursor-pointer"
                    title={f.isPublished ? 'Unpublish FAQ' : 'Publish FAQ'}
                  >
                    {f.isPublished ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                  </button>
                  <button
                    onClick={() => {
                      setEditingFAQ(f);
                      setShowFAQModal(true);
                    }}
                    className="text-zinc-400 hover:text-amber-400 p-1.5 cursor-pointer"
                    title="Edit FAQ"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => deleteFAQ(f.id)}
                    className="text-zinc-500 hover:text-rose-400 p-1.5 cursor-pointer"
                    title="Delete FAQ"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 7: STAFF & ROLES (Super Admin) */}
      {activeTab === 'staff' && isSuperAdmin && (
        <div className="space-y-6">
          <div className="flex items-center justify-between gap-4">
            <div>
              <h3 className="font-bold text-white text-base">Multi-Tier Staff &amp; Role Management</h3>
              <p className="text-xs text-zinc-400">
                Super Admin can provision Manager (Admin) or Front Desk Staff (Sub-Admin) credentials.
              </p>
            </div>
            <button
              onClick={() => setShowStaffModal(true)}
              className="px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-zinc-950 text-xs font-bold flex items-center gap-1.5 shadow cursor-pointer shrink-0"
            >
              <Plus className="w-4 h-4" /> Provision Staff Account
            </button>
          </div>

          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden">
            <div className="overflow-x-auto">
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
                        {u.role !== 'super_admin' && u.id !== currentUser.id && (
                          <button
                            onClick={() => deleteStaffUser(u.id)}
                            aria-label={`Delete ${u.name}`}
                            className="p-1.5 text-rose-400 hover:bg-rose-950/40 rounded cursor-pointer"
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
        </div>
      )}

      {/* TAB 8: STAFF ACTIVITY AUDIT LOGS (Super Admin) */}
      {activeTab === 'audit' && isSuperAdmin && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-white text-base">Staff Activity Audit Log Trail</h3>
            <span className="text-xs text-zinc-400 font-mono">{auditLogs.length} Total Audit Records</span>
          </div>

          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden">
            <div className="p-4 bg-zinc-950 border-b border-zinc-800 text-xs text-zinc-400">
              Tracks actions taken across room management, bookings, promotions, staff changes, and settings.
            </div>

            <div className="divide-y divide-zinc-800/80 font-mono text-xs">
              {auditLogs.map((log) => (
                <div key={log.id} className="p-3.5 hover:bg-zinc-800/30 flex flex-col sm:flex-row sm:items-start gap-2 sm:gap-4">
                  <div className="sm:w-36 shrink-0 text-zinc-500 text-[10px]">
                    {new Date(log.timestamp).toLocaleString()}
                  </div>
                  <div className="sm:w-36 shrink-0 font-bold text-amber-400 font-sans">
                    {log.staffName}
                  </div>
                  <div className="sm:w-32 shrink-0 text-[10px] text-zinc-400 uppercase">
                    {log.actionCategory}
                  </div>
                  <div className="text-zinc-200 font-sans flex-1">{log.details}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 9: HOTEL SETTINGS (Super Admin) */}
      {activeTab === 'settings' && isSuperAdmin && (
        <AdminSettingsTab hotelConfig={hotelConfig} onSaveConfig={updateHotelConfig} />
      )}

      {/* Modals */}
      <CategoryModal
        isOpen={showRoomModal}
        editingCategory={editingCategory}
        amenities={amenities}
        onClose={() => {
          setShowRoomModal(false);
          setEditingCategory(null);
        }}
        onSave={(data, existingId) => {
          if (existingId) {
            updateRoomCategory(existingId, data);
          } else {
            addRoomCategory(data);
          }
          setShowRoomModal(false);
          setEditingCategory(null);
        }}
      />

      <AmenityModal
        isOpen={showAmenityModal}
        editingAmenity={editingAmenity}
        onClose={() => {
          setShowAmenityModal(false);
          setEditingAmenity(null);
        }}
        onSave={(data, existingId) => {
          if (existingId) {
            updateAmenity(existingId, data);
          } else {
            addAmenity(data);
          }
          setShowAmenityModal(false);
          setEditingAmenity(null);
        }}
      />

      <PromoModal
        isOpen={showPromoModal}
        editingPromo={editingPromo}
        onClose={() => {
          setShowPromoModal(false);
          setEditingPromo(null);
        }}
        onSave={(data, existingId) => {
          if (existingId) {
            updatePromoCode(existingId, data);
          } else {
            addPromoCode(data);
          }
          setShowPromoModal(false);
          setEditingPromo(null);
        }}
      />

      <FAQModal
        isOpen={showFAQModal}
        editingFAQ={editingFAQ}
        onClose={() => {
          setShowFAQModal(false);
          setEditingFAQ(null);
        }}
        onSave={(data, existingId) => {
          if (existingId) {
            updateFAQ(existingId, data);
          } else {
            addFAQ(data);
          }
          setShowFAQModal(false);
          setEditingFAQ(null);
        }}
      />

      <StaffModal
        isOpen={showStaffModal}
        existingUsers={users}
        onClose={() => setShowStaffModal(false)}
        onSave={(data) => {
          addStaffUser(data);
          setShowStaffModal(false);
        }}
      />
    </div>
  );
};
