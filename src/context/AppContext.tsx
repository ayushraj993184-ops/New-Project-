import React, { createContext, useContext, useEffect, useState } from 'react';
import {
  ActiveView,
  AdminTab,
  Amenity,
  Booking,
  FAQItem,
  HotelConfig,
  PromoCode,
  RoomBedFilter,
  RoomCategory,
  RoomClimateFilter,
  RoomInstanceStatus,
  RoomStatus,
  StaffAuditLog,
  User,
  UserRole,
} from '../types';
import {
  initialAmenities,
  initialAuditLogs,
  initialBookings,
  initialFAQs,
  initialHotelConfig,
  initialPromoCodes,
  initialRoomCategories,
  initialRoomInstances,
  initialUsers,
} from '../data/initialData';
import {
  calculateStayNights,
  evaluatePromoCode,
  findAvailableRoomForBooking,
  generateBookingId,
  isRoomBookedForDates,
  type PromoEvaluationResult,
} from '../utils/bookingUtils';

const STORAGE_KEYS = [
  'hotelConfig',
  'users',
  'currentUser',
  'roomCategories',
  'roomInstances',
  'amenities',
  'promoCodes',
  'bookings',
  'auditLogs',
  'faqs',
] as const;

export type CreateBookingInput = Omit<Booking, 'id' | 'createdAt' | 'roomNumberAssigned'> & {
  roomNumberAssigned?: string;
};

export interface CreateBookingResult {
  success: boolean;
  booking?: Booking;
  message: string;
}

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
  activeView: ActiveView;
  adminTab: AdminTab;
  roomClimateFilter: RoomClimateFilter;
  roomBedFilter: RoomBedFilter;

  // Active Modals & Selected Items
  isLoginModalOpen: boolean;
  isBookingModalOpen: boolean;
  selectedCategoryForBooking: RoomCategory | null;
  invoiceModalBooking: Booking | null;
  welcomeUser: User | null;
  showWelcomeModal: boolean;

  // Navigation & Filters
  setActiveView: (view: ActiveView) => void;
  setAdminTab: (tab: AdminTab) => void;
  setRoomClimateFilter: (filter: RoomClimateFilter) => void;
  setRoomBedFilter: (filter: RoomBedFilter) => void;
  setIsLoginModalOpen: (open: boolean) => void;
  setIsBookingModalOpen: (open: boolean) => void;
  setSelectedCategoryForBooking: (category: RoomCategory | null) => void;
  setInvoiceModalBooking: (booking: Booking | null) => void;
  setShowWelcomeModal: (show: boolean) => void;
  triggerWelcomeAnimation: (user?: User) => void;

  // Auth
  login: (usernameOrEmail: string, password: string) => { success: boolean; role?: UserRole; message: string };
  registerCustomer: (data: {
    name: string;
    email: string;
    phone: string;
    password: string;
  }) => { success: boolean; message: string };
  logout: () => void;

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
  validatePromoCode: (codeStr: string, totalAmount: number) => PromoEvaluationResult;

  // Bookings
  createBooking: (bookingData: CreateBookingInput) => CreateBookingResult;
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

function getStored<T>(key: string, fallback: T): T {
  try {
    const item = localStorage.getItem(`kgh_${key}`);
    return item ? (JSON.parse(item) as T) : fallback;
  } catch (e) {
    console.error(`Failed to parse localStorage key kgh_${key}`, e);
    return fallback;
  }
}

function setStored<T>(key: string, value: T) {
  try {
    localStorage.setItem(`kgh_${key}`, JSON.stringify(value));
  } catch (e) {
    console.error(`Failed to write localStorage key kgh_${key}`, e);
  }
}

function createAuditEntry(
  actor: User | null,
  category: StaffAuditLog['actionCategory'],
  details: string
): StaffAuditLog {
  return {
    id: `log-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
    timestamp: new Date().toISOString(),
    staffName: actor ? actor.name : 'Guest / System',
    staffRole: actor ? actor.role : 'customer',
    actionCategory: category,
    details,
  };
}

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [hotelConfig, setHotelConfigState] = useState<HotelConfig>(() =>
    getStored('hotelConfig', initialHotelConfig)
  );
  const [users, setUsersState] = useState<User[]>(() => getStored('users', initialUsers));
  const [currentUser, setCurrentUserState] = useState<User | null>(() =>
    getStored<User | null>('currentUser', null)
  );
  const [roomCategories, setRoomCategoriesState] = useState<RoomCategory[]>(() =>
    getStored('roomCategories', initialRoomCategories)
  );
  const [roomInstances, setRoomInstancesState] = useState<RoomInstanceStatus[]>(() =>
    getStored('roomInstances', initialRoomInstances)
  );
  const [amenities, setAmenitiesState] = useState<Amenity[]>(() =>
    getStored('amenities', initialAmenities)
  );
  const [promoCodes, setPromoCodesState] = useState<PromoCode[]>(() =>
    getStored('promoCodes', initialPromoCodes)
  );
  const [bookings, setBookingsState] = useState<Booking[]>(() =>
    getStored('bookings', initialBookings)
  );
  const [auditLogs, setAuditLogsState] = useState<StaffAuditLog[]>(() =>
    getStored('auditLogs', initialAuditLogs)
  );
  const [faqs, setFaqsState] = useState<FAQItem[]>(() => getStored('faqs', initialFAQs));

  const [activeView, setActiveView] = useState<ActiveView>('home');
  const [adminTab, setAdminTab] = useState<AdminTab>('availability');
  const [roomClimateFilter, setRoomClimateFilter] = useState<RoomClimateFilter>('all');
  const [roomBedFilter, setRoomBedFilter] = useState<RoomBedFilter>('all');

  const [isLoginModalOpen, setIsLoginModalOpen] = useState<boolean>(false);
  const [isBookingModalOpen, setIsBookingModalOpen] = useState<boolean>(false);
  const [selectedCategoryForBooking, setSelectedCategoryForBooking] = useState<RoomCategory | null>(
    null
  );
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

  const appendAuditLog = (
    actor: User | null,
    category: StaffAuditLog['actionCategory'],
    details: string
  ) => {
    const newLog = createAuditEntry(actor, category, details);
    setAuditLogsState((prev) => [newLog, ...prev]);
  };

  const logStaffAction = (category: StaffAuditLog['actionCategory'], details: string) => {
    appendAuditLog(currentUser, category, details);
  };

  const login = (usernameOrEmail: string, password: string) => {
    const query = usernameOrEmail.trim().toLowerCase();
    if (!query) {
      return { success: false, message: 'Please enter your username or email address.' };
    }

    const found = users.find(
      (u) => u.username.toLowerCase() === query || u.email.toLowerCase() === query
    );

    if (!found) {
      return {
        success: false,
        message: 'No account found with that username or email. Register as a new guest if needed.',
      };
    }

    if (found.password && password !== found.password) {
      return {
        success: false,
        message: 'Incorrect password. Please check your credentials and try again.',
      };
    }

    setCurrentUserState(found);
    setWelcomeUser(found);
    setShowWelcomeModal(true);
    appendAuditLog(found, 'Staff Config', `User "${found.name}" (${found.role}) signed in.`);

    if (found.role === 'super_admin' || found.role === 'admin' || found.role === 'sub_admin') {
      setActiveView('admin');
      setAdminTab(found.role === 'admin' ? 'bookings' : 'availability');
      return {
        success: true,
        role: found.role,
        message: `Welcome back, ${found.name}! Redirecting to ${found.role.replace('_', ' ').toUpperCase()} Console.`,
      };
    }

    setActiveView('home');
    return {
      success: true,
      role: found.role,
      message: `Signed in as ${found.name}.`,
    };
  };

  const registerCustomer = ({
    name,
    email,
    phone,
    password,
  }: {
    name: string;
    email: string;
    phone: string;
    password: string;
  }) => {
    const cleanEmail = email.trim().toLowerCase();
    const cleanName = name.trim();
    if (!cleanName || !cleanEmail || !password.trim()) {
      return { success: false, message: 'Name, email, and password are required.' };
    }

    const exists = users.some(
      (u) => u.email.toLowerCase() === cleanEmail || u.username.toLowerCase() === cleanEmail
    );
    if (exists) {
      return {
        success: false,
        message: 'An account with that email already exists. Please sign in instead.',
      };
    }

    const newGuestUser: User = {
      id: `user-guest-${Date.now()}`,
      name: cleanName,
      email: cleanEmail,
      username: cleanEmail,
      password,
      phone: phone.trim() || undefined,
      role: 'customer',
      createdAt: new Date().toISOString(),
    };

    setUsersState((prev) => [...prev, newGuestUser]);
    setCurrentUserState(newGuestUser);
    setWelcomeUser(newGuestUser);
    setShowWelcomeModal(true);
    setActiveView('home');
    appendAuditLog(newGuestUser, 'Staff Config', `New guest registered: "${newGuestUser.name}".`);

    return {
      success: true,
      message: `Account created! Welcome, ${newGuestUser.name}.`,
    };
  };

  const logout = () => {
    if (currentUser) {
      appendAuditLog(currentUser, 'Staff Config', `User "${currentUser.name}" signed out.`);
    }
    setCurrentUserState(null);
    setWelcomeUser(null);
    setShowWelcomeModal(false);
    setActiveView((prev) => (prev === 'admin' || prev === 'my-bookings' ? 'home' : prev));
  };

  const addRoomCategory = (categoryData: Omit<RoomCategory, 'id'>) => {
    const id = `cat-${Date.now()}`;
    const uniqueRoomNums = Array.from(new Set(categoryData.roomNumbers.map((n) => n.trim()).filter(Boolean)));
    const newCategory: RoomCategory = { ...categoryData, roomNumbers: uniqueRoomNums, id };
    setRoomCategoriesState((prev) => [...prev, newCategory]);

    const newInstances: RoomInstanceStatus[] = uniqueRoomNums.map((num) => ({
      roomNumber: num,
      categoryId: id,
      status: 'Available',
    }));
    setRoomInstancesState((prev) => [...prev, ...newInstances]);

    logStaffAction(
      'Room Management',
      `Created room category "${newCategory.title}" with rooms (${uniqueRoomNums.join(', ')})`
    );
  };

  const updateRoomCategory = (id: string, updated: Partial<RoomCategory>) => {
    const normalizedNumbers = updated.roomNumbers
      ? Array.from(new Set(updated.roomNumbers.map((n) => n.trim()).filter(Boolean)))
      : undefined;

    setRoomCategoriesState((prev) =>
      prev.map((cat) =>
        cat.id === id
          ? { ...cat, ...updated, ...(normalizedNumbers ? { roomNumbers: normalizedNumbers } : {}) }
          : cat
      )
    );

    if (normalizedNumbers) {
      setRoomInstancesState((prev) => {
        const otherInstances = prev.filter((inst) => inst.categoryId !== id);
        const existingForCat = prev.filter((inst) => inst.categoryId === id);
        const syncedForCat: RoomInstanceStatus[] = normalizedNumbers.map((roomNumber) => {
          const existing = existingForCat.find((inst) => inst.roomNumber === roomNumber);
          return existing || { roomNumber, categoryId: id, status: 'Available' };
        });
        return [...otherInstances, ...syncedForCat];
      });
    }

    const target = roomCategories.find((c) => c.id === id);
    logStaffAction('Room Management', `Updated room category "${updated.title || target?.title || id}"`);
  };

  const deleteRoomCategory = (id: string) => {
    const target = roomCategories.find((c) => c.id === id);
    setRoomCategoriesState((prev) => prev.filter((cat) => cat.id !== id));
    setRoomInstancesState((prev) => prev.filter((inst) => inst.categoryId !== id));
    logStaffAction('Room Management', `Deleted room category "${target?.title || id}"`);
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

    logStaffAction(
      'Room Management',
      `Updated Room #${roomNumber} live availability status to "${status}"`
    );
  };

  const addAmenity = (amenityData: Omit<Amenity, 'id'>) => {
    const newAmenity: Amenity = { ...amenityData, id: `amenity-${Date.now()}` };
    setAmenitiesState((prev) => [...prev, newAmenity]);
    logStaffAction('Amenity Change', `Added amenity "${newAmenity.name}"`);
  };

  const updateAmenity = (id: string, updated: Partial<Amenity>) => {
    const target = amenities.find((a) => a.id === id);
    setAmenitiesState((prev) => prev.map((a) => (a.id === id ? { ...a, ...updated } : a)));
    logStaffAction('Amenity Change', `Updated amenity "${updated.name || target?.name || id}"`);
  };

  const deleteAmenity = (id: string) => {
    const target = amenities.find((a) => a.id === id);
    setAmenitiesState((prev) => prev.filter((a) => a.id !== id));
    setRoomCategoriesState((prev) =>
      prev.map((cat) => ({
        ...cat,
        amenityIds: cat.amenityIds.filter((aid) => aid !== id),
      }))
    );
    logStaffAction('Amenity Change', `Deleted amenity "${target?.name || id}"`);
  };

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
    setPromoCodesState((prev) => prev.map((p) => (p.id === id ? { ...p, ...updated } : p)));
    const target = promoCodes.find((p) => p.id === id);
    logStaffAction('Promo Code', `Updated promo code "${target?.code || id}"`);
  };

  const deletePromoCode = (id: string) => {
    const target = promoCodes.find((p) => p.id === id);
    setPromoCodesState((prev) => prev.filter((p) => p.id !== id));
    logStaffAction('Promo Code', `Deleted promo code "${target?.code || id}"`);
  };

  const validatePromoCode = (codeStr: string, totalAmount: number) =>
    evaluatePromoCode(promoCodes, codeStr, totalAmount);

  const createBooking = (bookingData: CreateBookingInput): CreateBookingResult => {
    const nights = calculateStayNights(bookingData.checkInDate, bookingData.checkOutDate);
    if (nights < 1) {
      return {
        success: false,
        message: 'Check-out date must be at least 1 night after check-in date.',
      };
    }

    const category = roomCategories.find((c) => c.id === bookingData.categoryId);
    if (!category) {
      return { success: false, message: 'Selected room category no longer exists.' };
    }

    let assignedRoom = bookingData.roomNumberAssigned;
    if (assignedRoom) {
      const inst = roomInstances.find((r) => r.roomNumber === assignedRoom);
      const occupied =
        (inst && inst.status !== 'Available') ||
        isRoomBookedForDates(assignedRoom, bookingData.checkInDate, bookingData.checkOutDate, bookings);
      if (occupied) {
        assignedRoom = undefined;
      }
    }

    if (!assignedRoom) {
      assignedRoom = findAvailableRoomForBooking(
        category,
        roomInstances,
        bookings,
        bookingData.checkInDate,
        bookingData.checkOutDate
      );
    }

    if (!assignedRoom) {
      return {
        success: false,
        message: 'No rooms in this category are available for your selected dates.',
      };
    }

    const id = generateBookingId(bookings);
    const newBooking: Booking = {
      ...bookingData,
      id,
      roomNumberAssigned: assignedRoom,
      stayDurationDays: nights,
      createdAt: new Date().toISOString(),
    };

    setBookingsState((prev) => [newBooking, ...prev]);

    if (bookingData.promoCodeApplied) {
      setPromoCodesState((prev) =>
        prev.map((pc) =>
          pc.code === bookingData.promoCodeApplied
            ? { ...pc, usageCount: pc.usageCount + 1 }
            : pc
        )
      );
    }

    const targetStatus: RoomStatus =
      newBooking.bookingStatus === 'Checked-In' ? 'Occupied' : 'Reserved';
    const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const staffName = currentUser?.name || 'Online Portal';
    setRoomInstancesState((prev) =>
      prev.map((inst) =>
        inst.roomNumber === assignedRoom
          ? { ...inst, status: targetStatus, lastUpdatedBy: staffName, lastUpdatedAt: timestamp }
          : inst
      )
    );

    logStaffAction(
      'Booking Action',
      `New Booking #${id} created for "${bookingData.guestName}" (${bookingData.categoryTitle}, Room #${assignedRoom})`
    );

    return { success: true, booking: newBooking, message: 'Booking confirmed!' };
  };

  const updateBookingStatus = (
    id: string,
    status: Booking['bookingStatus'],
    roomNumber?: string
  ) => {
    const existing = bookings.find((b) => b.id === id);
    if (!existing) return;

    const previousRoom = existing.roomNumberAssigned;
    const assignedRoom = roomNumber !== undefined ? roomNumber || undefined : previousRoom;

    const updatedBookings = bookings.map((b) =>
      b.id === id
        ? {
            ...b,
            bookingStatus: status,
            roomNumberAssigned: assignedRoom,
          }
        : b
    );
    setBookingsState(updatedBookings);

    const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const staffName = currentUser?.name || 'Staff';

    const roomHasOtherActiveBooking = (rm: string) =>
      updatedBookings.some(
        (b) =>
          b.id !== id &&
          b.roomNumberAssigned === rm &&
          (b.bookingStatus === 'Confirmed' || b.bookingStatus === 'Checked-In')
      );

    setRoomInstancesState((prev) =>
      prev.map((inst) => {
        if (previousRoom && previousRoom !== assignedRoom && inst.roomNumber === previousRoom) {
          if (!roomHasOtherActiveBooking(previousRoom)) {
            return { ...inst, status: 'Available', lastUpdatedBy: staffName, lastUpdatedAt: timestamp };
          }
        }
        if (assignedRoom && inst.roomNumber === assignedRoom) {
          if (status === 'Checked-In') {
            return { ...inst, status: 'Occupied', lastUpdatedBy: staffName, lastUpdatedAt: timestamp };
          }
          if (status === 'Confirmed') {
            return { ...inst, status: 'Reserved', lastUpdatedBy: staffName, lastUpdatedAt: timestamp };
          }
          if (status === 'Checked-Out' && !roomHasOtherActiveBooking(assignedRoom)) {
            return {
              ...inst,
              status: 'Cleaning/Maintenance',
              lastUpdatedBy: staffName,
              lastUpdatedAt: timestamp,
            };
          }
          if (status === 'Cancelled' && !roomHasOtherActiveBooking(assignedRoom)) {
            return { ...inst, status: 'Available', lastUpdatedBy: staffName, lastUpdatedAt: timestamp };
          }
        }
        return inst;
      })
    );

    logStaffAction(
      'Booking Action',
      `Booking #${id} status updated to "${status}"${assignedRoom ? ` (Room #${assignedRoom})` : ''}`
    );
  };

  const addFAQ = (faqData: Omit<FAQItem, 'id'>) => {
    const newFAQ: FAQItem = { ...faqData, id: `faq-${Date.now()}` };
    setFaqsState((prev) => [...prev, newFAQ]);
    logStaffAction('System Setting', `Added FAQ: "${newFAQ.question}"`);
  };

  const updateFAQ = (id: string, updated: Partial<FAQItem>) => {
    setFaqsState((prev) => prev.map((f) => (f.id === id ? { ...f, ...updated } : f)));
    logStaffAction('System Setting', `Updated FAQ "${updated.question || id}"`);
  };

  const deleteFAQ = (id: string) => {
    const target = faqs.find((f) => f.id === id);
    setFaqsState((prev) => prev.filter((f) => f.id !== id));
    logStaffAction('System Setting', `Deleted FAQ: "${target?.question || id}"`);
  };

  const updateHotelConfig = (config: Partial<HotelConfig>) => {
    setHotelConfigState((prev) => ({ ...prev, ...config }));
    logStaffAction('System Setting', 'Updated Hotel Details & Seasonal Configuration.');
  };

  const addStaffUser = (userData: Omit<User, 'id' | 'createdAt'>) => {
    const newUser: User = {
      ...userData,
      id: `user-${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    setUsersState((prev) => [...prev, newUser]);
    logStaffAction('Staff Config', `Created user account: ${newUser.name} (${newUser.role})`);
  };

  const deleteStaffUser = (userId: string) => {
    const target = users.find((u) => u.id === userId);
    if (!target || target.role === 'super_admin' || target.id === currentUser?.id) return;
    setUsersState((prev) => prev.filter((u) => u.id !== userId));
    logStaffAction('Staff Config', `Deleted user account: ${target.name}`);
  };

  const resetToDefaultData = () => {
    STORAGE_KEYS.forEach((key) => {
      localStorage.removeItem(`kgh_${key}`);
    });
    const nextActor = currentUser?.role === 'super_admin' ? initialUsers[0] : null;
    setHotelConfigState(initialHotelConfig);
    setUsersState(initialUsers);
    setCurrentUserState(nextActor);
    setRoomCategoriesState(initialRoomCategories);
    setRoomInstancesState(initialRoomInstances);
    setAmenitiesState(initialAmenities);
    setPromoCodesState(initialPromoCodes);
    setBookingsState(initialBookings);
    setFaqsState(initialFAQs);
    setAuditLogsState([
      createAuditEntry(nextActor, 'System Setting', 'Reset system state to default seeds.'),
      ...initialAuditLogs,
    ]);
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
        roomClimateFilter,
        roomBedFilter,
        isLoginModalOpen,
        isBookingModalOpen,
        selectedCategoryForBooking,
        invoiceModalBooking,
        welcomeUser,
        showWelcomeModal,
        setActiveView,
        setAdminTab,
        setRoomClimateFilter,
        setRoomBedFilter,
        setIsLoginModalOpen,
        setIsBookingModalOpen,
        setSelectedCategoryForBooking,
        setInvoiceModalBooking,
        setShowWelcomeModal,
        triggerWelcomeAnimation,
        login,
        registerCustomer,
        logout,
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
