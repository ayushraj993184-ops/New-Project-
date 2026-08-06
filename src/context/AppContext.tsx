import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  User,
  UserRole,
  RoomCategory,
  RoomInstanceStatus,
  RoomStatus,
  Amenity,
  PromoCode,
  Booking,
  StaffAuditLog,
  FAQItem,
  HotelConfig,
} from '../types';
import {
  initialHotelConfig,
  initialUsers,
  initialAmenities,
  initialRoomCategories,
  initialRoomInstances,
  initialPromoCodes,
  initialBookings,
  initialAuditLogs,
  initialFAQs,
} from '../data/initialData';

interface AppContextType {
  // State
  hotelConfig: HotelConfig;
  users: User[];
  currentUser: User | null;
  roomCategories: RoomCategory[];
  roomInstances: RoomInstanceStatus[];
  amenities: Amenity[];
  promoCodes: PromoCode[];
  bookings: Booking[];
  auditLogs: StaffAuditLog[];
  faqs: FAQItem[];
  activeView: 'home' | 'rooms' | 'gallery' | 'faqs' | 'my-bookings' | 'admin';
  adminTab: string;

  // Active Modals & Selected Items
  isLoginModalOpen: boolean;
  isBookingModalOpen: boolean;
  selectedCategoryForBooking: RoomCategory | null;
  invoiceModalBooking: Booking | null;
  welcomeUser: User | null;
  showWelcomeModal: boolean;

  // Actions
  setActiveView: (view: 'home' | 'rooms' | 'gallery' | 'faqs' | 'my-bookings' | 'admin') => void;
  setAdminTab: (tab: string) => void;
  setIsLoginModalOpen: (open: boolean) => void;
  setIsBookingModalOpen: (open: boolean) => void;
  setSelectedCategoryForBooking: (category: RoomCategory | null) => void;
  setInvoiceModalBooking: (booking: Booking | null) => void;
  setShowWelcomeModal: (show: boolean) => void;
  triggerWelcomeAnimation: (user?: User) => void;

  // Auth
  login: (usernameOrEmail: string) => { success: boolean; role?: UserRole; message: string };
  logout: () => void;
  switchRoleDemo: (role: UserRole) => void;

  // Audit Logs
  logStaffAction: (category: StaffAuditLog['actionCategory'], details: string) => void;

  // Room Management
  addRoomCategory: (category: Omit<RoomCategory, 'id'>) => void;
  updateRoomCategory: (id: string, updated: Partial<RoomCategory>) => void;
  deleteRoomCategory: (id: string) => void;
  updateRoomInstanceStatus: (roomNumber: string, status: RoomStatus) => void;

  // Amenities
  addAmenity: (amenity: Omit<Amenity, 'id'>) => void;
  updateAmenity: (id: string, updated: Partial<Amenity>) => void;
  deleteAmenity: (id: string) => void;

  // Promo Codes
  addPromoCode: (code: Omit<PromoCode, 'id' | 'usageCount'>) => void;
  updatePromoCode: (id: string, updated: Partial<PromoCode>) => void;
  deletePromoCode: (id: string) => void;
  validatePromoCode: (codeStr: string, totalAmount: number) => { valid: boolean; promo?: PromoCode; discount: number; message: string };

  // Bookings
  createBooking: (bookingData: Omit<Booking, 'id' | 'createdAt'>) => Booking;
  updateBookingStatus: (id: string, status: Booking['bookingStatus'], roomNumber?: string) => void;

  // FAQs & Policies
  addFAQ: (faq: Omit<FAQItem, 'id'>) => void;
  updateFAQ: (id: string, updated: Partial<FAQItem>) => void;
  deleteFAQ: (id: string) => void;

  // Hotel Settings
  updateHotelConfig: (config: Partial<HotelConfig>) => void;

  // Staff User Management
  addStaffUser: (user: Omit<User, 'id' | 'createdAt'>) => void;
  deleteStaffUser: (userId: string) => void;

  // Reset Data
  resetToDefaultData: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Helper to read localStorage safely
  const getStored = <T,>(key: string, fallback: T): T => {
    try {
      const item = localStorage.getItem(`kgh_${key}`);
      return item ? JSON.parse(item) : fallback;
    } catch (e) {
      console.error(e);
      return fallback;
    }
  };

  const setStored = <T,>(key: string, value: T) => {
    try {
      localStorage.setItem(`kgh_${key}`, JSON.stringify(value));
    } catch (e) {
      console.error(e);
    }
  };

  const [hotelConfig, setHotelConfigState] = useState<HotelConfig>(() => getStored('hotelConfig', initialHotelConfig));
  const [users, setUsersState] = useState<User[]>(() => getStored('users', initialUsers));
  const [currentUser, setCurrentUserState] = useState<User | null>(() => getStored('currentUser', initialUsers[3])); // Default Amit Raj (guest)
  const [roomCategories, setRoomCategoriesState] = useState<RoomCategory[]>(() => getStored('roomCategories', initialRoomCategories));
  const [roomInstances, setRoomInstancesState] = useState<RoomInstanceStatus[]>(() => getStored('roomInstances', initialRoomInstances));
  const [amenities, setAmenitiesState] = useState<Amenity[]>(() => getStored('amenities', initialAmenities));
  const [promoCodes, setPromoCodesState] = useState<PromoCode[]>(() => getStored('promoCodes', initialPromoCodes));
  const [bookings, setBookingsState] = useState<Booking[]>(() => getStored('bookings', initialBookings));
  const [auditLogs, setAuditLogsState] = useState<StaffAuditLog[]>(() => getStored('auditLogs', initialAuditLogs));
  const [faqs, setFaqsState] = useState<FAQItem[]>(() => getStored('faqs', initialFAQs));

  const [activeView, setActiveView] = useState<'home' | 'rooms' | 'gallery' | 'faqs' | 'my-bookings' | 'admin'>('home');
  const [adminTab, setAdminTab] = useState<string>('availability');

  const [isLoginModalOpen, setIsLoginModalOpen] = useState<boolean>(false);
  const [isBookingModalOpen, setIsBookingModalOpen] = useState<boolean>(false);
  const [selectedCategoryForBooking, setSelectedCategoryForBooking] = useState<RoomCategory | null>(null);
  const [invoiceModalBooking, setInvoiceModalBooking] = useState<Booking | null>(null);
  const [welcomeUser, setWelcomeUser] = useState<User | null>(null);
  const [showWelcomeModal, setShowWelcomeModal] = useState<boolean>(false);

  const triggerWelcomeAnimation = (user?: User) => {
    const target = user || currentUser;
    if (target) {
      setWelcomeUser(target);
      setShowWelcomeModal(true);
    }
  };

  // Sync state to localStorage
  useEffect(() => setStored('hotelConfig', hotelConfig), [hotelConfig]);
  useEffect(() => setStored('users', users), [users]);
  useEffect(() => setStored('currentUser', currentUser), [currentUser]);
  useEffect(() => setStored('roomCategories', roomCategories), [roomCategories]);
  useEffect(() => setStored('roomInstances', roomInstances), [roomInstances]);
  useEffect(() => setStored('amenities', amenities), [amenities]);
  useEffect(() => setStored('promoCodes', promoCodes), [promoCodes]);
  useEffect(() => setStored('bookings', bookings), [bookings]);
  useEffect(() => setStored('auditLogs', auditLogs), [auditLogs]);
  useEffect(() => setStored('faqs', faqs), [faqs]);

  // Audit Log helper
  const logStaffAction = (category: StaffAuditLog['actionCategory'], details: string) => {
    const staffName = currentUser ? currentUser.name : 'System';
    const staffRole = currentUser ? currentUser.role : 'sub_admin';
    const newLog: StaffAuditLog = {
      id: `log-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      timestamp: new Date().toISOString(),
      staffName,
      staffRole,
      actionCategory: category,
      details,
    };
    setAuditLogsState((prev) => [newLog, ...prev]);
  };

  // Auth: Unified Login
  const login = (usernameOrEmail: string) => {
    const query = usernameOrEmail.trim().toLowerCase();
    const found = users.find(
      (u) => u.username.toLowerCase() === query || u.email.toLowerCase() === query
    );

    if (found) {
      setCurrentUserState(found);
      setIsLoginModalOpen(false);
      setWelcomeUser(found);
      setShowWelcomeModal(true);
      logStaffAction('Staff Config', `User "${found.name}" (${found.role}) logged in successfully.`);

      if (found.role === 'super_admin' || found.role === 'admin' || found.role === 'sub_admin') {
        setActiveView('admin');
        if (found.role === 'sub_admin') {
          setAdminTab('availability');
        } else if (found.role === 'admin') {
          setAdminTab('bookings');
        } else {
          setAdminTab('availability');
        }
        return {
          success: true,
          role: found.role,
          message: `Welcome back, ${found.name}! Redirected to ${found.role.replace('_', ' ').toUpperCase()} Dashboard.`,
        };
      } else {
        setActiveView('home');
        return {
          success: true,
          role: found.role,
          message: `Logged in as Customer (${found.name}).`,
        };
      }
    }

    // Auto-create standard customer if non-admin login entered
    const newGuestUser: User = {
      id: `user-guest-${Date.now()}`,
      name: usernameOrEmail.split('@')[0] || 'Valued Guest',
      email: usernameOrEmail.includes('@') ? usernameOrEmail : `${usernameOrEmail}@guest.com`,
      username: usernameOrEmail.toLowerCase(),
      role: 'customer',
      createdAt: new Date().toISOString(),
    };
    setUsersState((prev) => [...prev, newGuestUser]);
    setCurrentUserState(newGuestUser);
    setIsLoginModalOpen(false);
    setWelcomeUser(newGuestUser);
    setShowWelcomeModal(true);
    return {
      success: true,
      role: 'customer',
      message: `Welcome! Created customer account for ${newGuestUser.name}.`,
    };
  };

  const logout = () => {
    if (currentUser) {
      logStaffAction('Staff Config', `User "${currentUser.name}" logged out.`);
    }
    setCurrentUserState(null);
    setWelcomeUser(null);
    setShowWelcomeModal(false);
    setActiveView('home');
  };

  const switchRoleDemo = (role: UserRole) => {
    const target = users.find((u) => u.role === role);
    if (target) {
      setCurrentUserState(target);
      setWelcomeUser(target);
      setShowWelcomeModal(true);
      if (role !== 'customer') {
        setActiveView('admin');
        setAdminTab(role === 'sub_admin' ? 'availability' : 'bookings');
      } else {
        setActiveView('home');
      }
      logStaffAction('Staff Config', `Switched demo role to ${role} (${target.name})`);
    }
  };

  // Room CRUD
  const addRoomCategory = (categoryData: Omit<RoomCategory, 'id'>) => {
    const id = `cat-${Date.now()}`;
    const newCategory: RoomCategory = { ...categoryData, id };
    setRoomCategoriesState((prev) => [...prev, newCategory]);

    // Instantiate room instances
    const newInstances: RoomInstanceStatus[] = categoryData.roomNumbers.map((num) => ({
      roomNumber: num,
      categoryId: id,
      status: 'Available',
    }));
    setRoomInstancesState((prev) => [...prev, ...newInstances]);

    logStaffAction('Room Management', `Created new room category: "${newCategory.title}" with rooms (${newCategory.roomNumbers.join(', ')})`);
  };

  const updateRoomCategory = (id: string, updated: Partial<RoomCategory>) => {
    setRoomCategoriesState((prev) =>
      prev.map((cat) => (cat.id === id ? { ...cat, ...updated } : cat))
    );
    logStaffAction('Room Management', `Updated room category ID "${id}"`);
  };

  const deleteRoomCategory = (id: string) => {
    const target = roomCategories.find((c) => c.id === id);
    setRoomCategoriesState((prev) => prev.filter((cat) => cat.id !== id));
    setRoomInstancesState((prev) => prev.filter((inst) => inst.categoryId !== id));
    logStaffAction('Room Management', `Deleted room category: "${target?.title || id}"`);
  };

  const updateRoomInstanceStatus = (roomNumber: string, status: RoomStatus) => {
    const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const staffName = currentUser?.name || 'Staff';

    setRoomInstancesState((prev) =>
      prev.map((inst) =>
        inst.roomNumber === roomNumber
          ? { ...inst, status, lastUpdatedBy: staffName, lastUpdatedAt: timestamp }
          : inst
      )
    );

    const targetInst = roomInstances.find((i) => i.roomNumber === roomNumber);
    if (targetInst) {
      logStaffAction(
        'Room Management',
        `Updated Room #${roomNumber} live availability status to "${status}"`
      );
    }
  };

  // Amenities
  const addAmenity = (amenityData: Omit<Amenity, 'id'>) => {
    const newAmenity: Amenity = { ...amenityData, id: `amenity-${Date.now()}` };
    setAmenitiesState((prev) => [...prev, newAmenity]);
    logStaffAction('Amenity Change', `Added amenity: "${newAmenity.name}"`);
  };

  const updateAmenity = (id: string, updated: Partial<Amenity>) => {
    setAmenitiesState((prev) =>
      prev.map((a) => (a.id === id ? { ...a, ...updated } : a))
    );
    logStaffAction('Amenity Change', `Updated amenity ID "${id}"`);
  };

  const deleteAmenity = (id: string) => {
    const target = amenities.find((a) => a.id === id);
    setAmenitiesState((prev) => prev.filter((a) => a.id !== id));
    logStaffAction('Amenity Change', `Deleted amenity: "${target?.name || id}"`);
  };

  // Promo Codes
  const addPromoCode = (codeData: Omit<PromoCode, 'id' | 'usageCount'>) => {
    const newPromo: PromoCode = {
      ...codeData,
      id: `promo-${Date.now()}`,
      usageCount: 0,
      code: codeData.code.toUpperCase().trim(),
    };
    setPromoCodesState((prev) => [...prev, newPromo]);
    logStaffAction('Promo Code', `Created promo code "${newPromo.code}"`);
  };

  const updatePromoCode = (id: string, updated: Partial<PromoCode>) => {
    setPromoCodesState((prev) =>
      prev.map((p) => (p.id === id ? { ...p, ...updated } : p))
    );
    logStaffAction('Promo Code', `Updated promo code ID "${id}"`);
  };

  const deletePromoCode = (id: string) => {
    const target = promoCodes.find((p) => p.id === id);
    setPromoCodesState((prev) => prev.filter((p) => p.id !== id));
    logStaffAction('Promo Code', `Deleted promo code: "${target?.code || id}"`);
  };

  const validatePromoCode = (codeStr: string, totalAmount: number) => {
    const clean = codeStr.trim().toUpperCase();
    const found = promoCodes.find((p) => p.code === clean && p.isActive);

    if (!found) {
      return { valid: false, discount: 0, message: 'Invalid or inactive promo code.' };
    }

    if (totalAmount < found.minBookingAmount) {
      return {
        valid: false,
        discount: 0,
        message: `Minimum booking total of ₹${found.minBookingAmount} required for ${found.code}.`,
      };
    }

    let discount = 0;
    if (found.discountType === 'flat') {
      discount = found.discountValue;
    } else {
      discount = Math.round((totalAmount * found.discountValue) / 100);
    }

    return {
      valid: true,
      promo: found,
      discount,
      message: `Coupon applied! You save ₹${discount}.`,
    };
  };

  // Bookings
  const createBooking = (bookingData: Omit<Booking, 'id' | 'createdAt'>) => {
    const id = `KGH-BKG-${Math.floor(1000 + Math.random() * 9000)}`;
    const newBooking: Booking = {
      ...bookingData,
      id,
      createdAt: new Date().toISOString(),
    };

    setBookingsState((prev) => [newBooking, ...prev]);

    // Increment promo usage if applied
    if (bookingData.promoCodeApplied) {
      const p = promoCodes.find((pc) => pc.code === bookingData.promoCodeApplied);
      if (p) {
        updatePromoCode(p.id, { usageCount: p.usageCount + 1 });
      }
    }

    logStaffAction(
      'Booking Action',
      `New Booking #${id} created for guest "${bookingData.guestName}" (${bookingData.categoryTitle})`
    );

    return newBooking;
  };

  const updateBookingStatus = (id: string, status: Booking['bookingStatus'], roomNumber?: string) => {
    setBookingsState((prev) =>
      prev.map((b) =>
        b.id === id
          ? {
              ...b,
              bookingStatus: status,
              roomNumberAssigned: roomNumber || b.roomNumberAssigned,
            }
          : b
      )
    );

    // If checked in or assigned room, update room instance
    if (roomNumber && (status === 'Checked-In' || status === 'Confirmed')) {
      updateRoomInstanceStatus(roomNumber, 'Occupied');
    }

    logStaffAction('Booking Action', `Booking #${id} status updated to "${status}"${roomNumber ? ` (Room ${roomNumber})` : ''}`);
  };

  // FAQs
  const addFAQ = (faqData: Omit<FAQItem, 'id'>) => {
    const newFAQ: FAQItem = { ...faqData, id: `faq-${Date.now()}` };
    setFaqsState((prev) => [...prev, newFAQ]);
    logStaffAction('System Setting', `Added FAQ question: "${newFAQ.question}"`);
  };

  const updateFAQ = (id: string, updated: Partial<FAQItem>) => {
    setFaqsState((prev) => prev.map((f) => (f.id === id ? { ...f, ...updated } : f)));
    logStaffAction('System Setting', `Updated FAQ ID "${id}"`);
  };

  const deleteFAQ = (id: string) => {
    const target = faqs.find((f) => f.id === id);
    setFaqsState((prev) => prev.filter((f) => f.id !== id));
    logStaffAction('System Setting', `Deleted FAQ: "${target?.question || id}"`);
  };

  // Hotel Config
  const updateHotelConfig = (config: Partial<HotelConfig>) => {
    setHotelConfigState((prev) => ({ ...prev, ...config }));
    logStaffAction('System Setting', `Updated Hotel Details & Peak Season rules.`);
  };

  // Staff User Management
  const addStaffUser = (userData: Omit<User, 'id' | 'createdAt'>) => {
    const newUser: User = {
      ...userData,
      id: `user-${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    setUsersState((prev) => [...prev, newUser]);
    logStaffAction('Staff Config', `Created new staff account: ${newUser.name} (${newUser.role})`);
  };

  const deleteStaffUser = (userId: string) => {
    const target = users.find((u) => u.id === userId);
    setUsersState((prev) => prev.filter((u) => u.id !== userId));
    logStaffAction('Staff Config', `Deleted staff account: ${target?.name || userId}`);
  };

  // Reset to Default
  const resetToDefaultData = () => {
    setHotelConfigState(initialHotelConfig);
    setUsersState(initialUsers);
    setCurrentUserState(initialUsers[3]);
    setRoomCategoriesState(initialRoomCategories);
    setRoomInstancesState(initialRoomInstances);
    setAmenitiesState(initialAmenities);
    setPromoCodesState(initialPromoCodes);
    setBookingsState(initialBookings);
    setAuditLogsState(initialAuditLogs);
    setFaqsState(initialFAQs);
    localStorage.clear();
    logStaffAction('System Setting', 'Reset system state to default factory seeds.');
  };

  return (
    <AppContext.Provider
      value={{
        hotelConfig,
        users,
        currentUser,
        roomCategories,
        roomInstances,
        amenities,
        promoCodes,
        bookings,
        auditLogs,
        faqs,
        activeView,
        adminTab,
        isLoginModalOpen,
        isBookingModalOpen,
        selectedCategoryForBooking,
        invoiceModalBooking,
        welcomeUser,
        showWelcomeModal,
        setActiveView,
        setAdminTab,
        setIsLoginModalOpen,
        setIsBookingModalOpen,
        setSelectedCategoryForBooking,
        setInvoiceModalBooking,
        setShowWelcomeModal,
        triggerWelcomeAnimation,
        login,
        logout,
        switchRoleDemo,
        logStaffAction,
        addRoomCategory,
        updateRoomCategory,
        deleteRoomCategory,
        updateRoomInstanceStatus,
        addAmenity,
        updateAmenity,
        deleteAmenity,
        addPromoCode,
        updatePromoCode,
        deletePromoCode,
        validatePromoCode,
        createBooking,
        updateBookingStatus,
        addFAQ,
        updateFAQ,
        deleteFAQ,
        updateHotelConfig,
        addStaffUser,
        deleteStaffUser,
        resetToDefaultData,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
