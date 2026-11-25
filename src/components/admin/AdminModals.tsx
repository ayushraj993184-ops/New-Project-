import React, { useEffect, useState } from 'react';
import {
  Amenity,
  FAQItem,
  PromoCode,
  RoomCategory,
  User,
  UserRole,
} from '../../types';
import { SUPPORTED_AMENITY_ICONS } from '../DynamicIcon';
import { X } from 'lucide-react';

interface CategoryModalProps {
  isOpen: boolean;
  editingCategory: RoomCategory | null;
  amenities: Amenity[];
  onClose: () => void;
  onSave: (data: Omit<RoomCategory, 'id'>, existingId?: string) => void;
}

export const CategoryModal: React.FC<CategoryModalProps> = ({
  isOpen,
  editingCategory,
  amenities,
  onClose,
  onSave,
}) => {
  const [title, setTitle] = useState('');
  const [type, setType] = useState<'AC' | 'Non-AC'>('AC');
  const [bedType, setBedType] = useState<'Single Bed' | 'Double Bed' | 'Deluxe Family Bed'>('Double Bed');
  const [priceOff, setPriceOff] = useState(1200);
  const [pricePeak, setPricePeak] = useState(1600);
  const [desc, setDesc] = useState('');
  const [capacity, setCapacity] = useState(2);
  const [imageUrl, setImageUrl] = useState(
    'https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=800&q=80'
  );
  const [roomsText, setRoomsText] = useState('401, 402');
  const [selectedAmenityIds, setSelectedAmenityIds] = useState<string[]>([]);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    if (!isOpen) return;
    if (editingCategory) {
      setTitle(editingCategory.title);
      setType(editingCategory.type);
      setBedType(editingCategory.bedType);
      setPriceOff(editingCategory.basePriceOffSeason);
      setPricePeak(editingCategory.basePricePeakSeason);
      setDesc(editingCategory.description);
      setCapacity(editingCategory.maxCapacity);
      setImageUrl(editingCategory.imageUrl);
      setRoomsText(editingCategory.roomNumbers.join(', '));
      setSelectedAmenityIds(editingCategory.amenityIds);
      setIsVisible(editingCategory.isVisible);
    } else {
      setTitle('');
      setType('AC');
      setBedType('Double Bed');
      setPriceOff(1200);
      setPricePeak(1600);
      setDesc('');
      setCapacity(2);
      setImageUrl(
        'https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=800&q=80'
      );
      setRoomsText('401, 402');
      setSelectedAmenityIds([]);
      setIsVisible(true);
    }
  }, [isOpen, editingCategory]);

  if (!isOpen) return null;

  const toggleAmenity = (id: string) => {
    setSelectedAmenityIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const roomNumbers = Array.from(
      new Set(
        roomsText
          .split(',')
          .map((s) => s.trim())
          .filter(Boolean)
      )
    );
    if (roomNumbers.length === 0) return;

    onSave(
      {
        title: title.trim(),
        type,
        bedType,
        basePriceOffSeason: Math.max(0, Number(priceOff)),
        basePricePeakSeason: Math.max(0, Number(pricePeak)),
        description: desc.trim(),
        maxCapacity: Math.max(1, Number(capacity)),
        imageUrl: imageUrl.trim(),
        roomNumbers,
        amenityIds: selectedAmenityIds,
        liveStatus: editingCategory?.liveStatus || 'Available',
        isVisible,
      },
      editingCategory?.id
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
      <div className="w-full max-w-xl bg-zinc-950 border border-zinc-800 rounded-2xl p-6 text-white space-y-4 my-8">
        <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
          <h3 className="font-bold text-white text-base">
            {editingCategory ? 'Edit Room Category' : 'Create New Room Category'}
          </h3>
          <button onClick={onClose} aria-label="Close category modal" className="text-zinc-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block text-zinc-400 mb-1">Category Title</label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Non AC Double Bed"
              className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-2 text-white"
            />
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-zinc-400 mb-1">Climate</label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value as 'AC' | 'Non-AC')}
                className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-2 text-white"
              >
                <option value="AC">AC Room</option>
                <option value="Non-AC">Non-AC Room</option>
              </select>
            </div>

            <div>
              <label className="block text-zinc-400 mb-1">Bed Type</label>
              <select
                value={bedType}
                onChange={(e) =>
                  setBedType(e.target.value as 'Single Bed' | 'Double Bed' | 'Deluxe Family Bed')
                }
                className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-2 text-white"
              >
                <option value="Single Bed">Single Bed</option>
                <option value="Double Bed">Double Bed</option>
                <option value="Deluxe Family Bed">Deluxe Family Bed</option>
              </select>
            </div>

            <div>
              <label className="block text-zinc-400 mb-1">Max Guests</label>
              <input
                type="number"
                min={1}
                max={10}
                required
                value={capacity}
                onChange={(e) => setCapacity(Number(e.target.value))}
                className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-2 text-white font-mono"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-zinc-400 mb-1">Off-Season Price (₹)</label>
              <input
                type="number"
                min={0}
                required
                value={priceOff}
                onChange={(e) => setPriceOff(Number(e.target.value))}
                className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-2 text-white font-mono"
              />
            </div>

            <div>
              <label className="block text-zinc-400 mb-1">Peak Season Price (₹)</label>
              <input
                type="number"
                min={0}
                required
                value={pricePeak}
                onChange={(e) => setPricePeak(Number(e.target.value))}
                className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-2 text-white font-mono"
              />
            </div>
          </div>

          <div>
            <label className="block text-zinc-400 mb-1">Room Numbers List (Comma Separated)</label>
            <input
              type="text"
              required
              value={roomsText}
              onChange={(e) => setRoomsText(e.target.value)}
              placeholder="101, 102, 103"
              className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-2 text-white font-mono"
            />
          </div>

          <div>
            <label className="block text-zinc-400 mb-1">Image URL</label>
            <input
              type="url"
              required
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-2 text-white font-mono"
            />
          </div>

          <div>
            <label className="block text-zinc-400 mb-1">Description</label>
            <textarea
              rows={2}
              value={desc}
              onChange={(e) => setDesc(e.target.value)}
              className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-2 text-white"
            />
          </div>

          <div>
            <label className="block text-zinc-400 mb-1.5">Tier-Specific Amenities</label>
            <div className="grid grid-cols-2 gap-1.5 max-h-32 overflow-y-auto bg-zinc-900 p-2.5 rounded-xl border border-zinc-800">
              {amenities.map((a) => (
                <label key={a.id} className="flex items-center gap-2 text-zinc-300 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={a.isGlobal || selectedAmenityIds.includes(a.id)}
                    disabled={a.isGlobal}
                    onChange={() => toggleAmenity(a.id)}
                    className="accent-amber-500"
                  />
                  <span className="line-clamp-1">
                    {a.name}
                    {a.isGlobal ? ' (Global)' : ''}
                  </span>
                </label>
              ))}
            </div>
          </div>

          <label className="flex items-center gap-2 text-zinc-300 cursor-pointer">
            <input
              type="checkbox"
              checked={isVisible}
              onChange={(e) => setIsVisible(e.target.checked)}
              className="accent-amber-500"
            />
            <span>Visible to customers on public website</span>
          </label>

          <button
            type="submit"
            className="w-full py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold text-xs cursor-pointer"
          >
            {editingCategory ? 'Update Room Category' : 'Create Room Category'}
          </button>
        </form>
      </div>
    </div>
  );
};

interface AmenityModalProps {
  isOpen: boolean;
  editingAmenity: Amenity | null;
  onClose: () => void;
  onSave: (data: Omit<Amenity, 'id'>, existingId?: string) => void;
}

export const AmenityModal: React.FC<AmenityModalProps> = ({
  isOpen,
  editingAmenity,
  onClose,
  onSave,
}) => {
  const [name, setName] = useState('');
  const [iconName, setIconName] = useState('Sparkles');
  const [description, setDescription] = useState('');
  const [isGlobal, setIsGlobal] = useState(false);

  useEffect(() => {
    if (!isOpen) return;
    if (editingAmenity) {
      setName(editingAmenity.name);
      setIconName(editingAmenity.iconName);
      setDescription(editingAmenity.description);
      setIsGlobal(editingAmenity.isGlobal);
    } else {
      setName('');
      setIconName('Sparkles');
      setDescription('');
      setIsGlobal(false);
    }
  }, [isOpen, editingAmenity]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(
      {
        name: name.trim(),
        iconName,
        description: description.trim(),
        isGlobal,
      },
      editingAmenity?.id
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="w-full max-w-md bg-zinc-950 border border-zinc-800 rounded-2xl p-6 text-white space-y-4">
        <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
          <h3 className="font-bold text-white text-base">
            {editingAmenity ? 'Edit Amenity' : 'Add New Amenity'}
          </h3>
          <button onClick={onClose} aria-label="Close amenity modal" className="text-zinc-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block text-zinc-400 mb-1">Amenity Name</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. 24/7 Power Backup"
              className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-2 text-white"
            />
          </div>

          <div>
            <label className="block text-zinc-400 mb-1">Icon</label>
            <select
              value={iconName}
              onChange={(e) => setIconName(e.target.value)}
              className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-2 text-white font-mono"
            >
              {Object.keys(SUPPORTED_AMENITY_ICONS).map((key) => (
                <option key={key} value={key}>
                  {key}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-zinc-400 mb-1">Description</label>
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Short amenity summary"
              className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-2 text-white"
            />
          </div>

          <label className="flex items-center gap-2 text-zinc-300 cursor-pointer">
            <input
              type="checkbox"
              checked={isGlobal}
              onChange={(e) => setIsGlobal(e.target.checked)}
              className="accent-amber-500"
            />
            <span>Global amenity (included in all room categories)</span>
          </label>

          <button
            type="submit"
            className="w-full py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold text-xs cursor-pointer"
          >
            {editingAmenity ? 'Save Changes' : 'Add Amenity'}
          </button>
        </form>
      </div>
    </div>
  );
};

interface PromoModalProps {
  isOpen: boolean;
  editingPromo: PromoCode | null;
  onClose: () => void;
  onSave: (data: Omit<PromoCode, 'id' | 'usageCount'>, existingId?: string) => void;
}

export const PromoModal: React.FC<PromoModalProps> = ({
  isOpen,
  editingPromo,
  onClose,
  onSave,
}) => {
  const [code, setCode] = useState('');
  const [discountType, setDiscountType] = useState<'flat' | 'percentage'>('flat');
  const [discountValue, setDiscountValue] = useState(150);
  const [minBookingAmount, setMinBookingAmount] = useState(1000);
  const [expiryDate, setExpiryDate] = useState('2027-12-31');
  const [isActive, setIsActive] = useState(true);

  useEffect(() => {
    if (!isOpen) return;
    if (editingPromo) {
      setCode(editingPromo.code);
      setDiscountType(editingPromo.discountType);
      setDiscountValue(editingPromo.discountValue);
      setMinBookingAmount(editingPromo.minBookingAmount);
      setExpiryDate(editingPromo.expiryDate);
      setIsActive(editingPromo.isActive);
    } else {
      setCode('');
      setDiscountType('flat');
      setDiscountValue(150);
      setMinBookingAmount(1000);
      setExpiryDate('2027-12-31');
      setIsActive(true);
    }
  }, [isOpen, editingPromo]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(
      {
        code: code.trim().toUpperCase(),
        discountType,
        discountValue: Math.max(1, Number(discountValue)),
        minBookingAmount: Math.max(0, Number(minBookingAmount)),
        expiryDate,
        isActive,
      },
      editingPromo?.id
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="w-full max-w-md bg-zinc-950 border border-zinc-800 rounded-2xl p-6 text-white space-y-4">
        <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
          <h3 className="font-bold text-white text-base">
            {editingPromo ? 'Edit Promo Code' : 'Create Promo Code'}
          </h3>
          <button onClick={onClose} aria-label="Close promo modal" className="text-zinc-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block text-zinc-400 mb-1">Coupon Code</label>
            <input
              type="text"
              required
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder="e.g. PITRAPAKSHA200"
              className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-2 text-white font-mono uppercase"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-zinc-400 mb-1">Discount Type</label>
              <select
                value={discountType}
                onChange={(e) => setDiscountType(e.target.value as 'flat' | 'percentage')}
                className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-2 text-white"
              >
                <option value="flat">Flat Amount (₹)</option>
                <option value="percentage">Percentage (%)</option>
              </select>
            </div>

            <div>
              <label className="block text-zinc-400 mb-1">
                Value ({discountType === 'flat' ? '₹' : '%'})
              </label>
              <input
                type="number"
                min={1}
                max={discountType === 'percentage' ? 100 : undefined}
                required
                value={discountValue}
                onChange={(e) => setDiscountValue(Number(e.target.value))}
                className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-2 text-white font-mono"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-zinc-400 mb-1">Min Booking Amount (₹)</label>
              <input
                type="number"
                min={0}
                required
                value={minBookingAmount}
                onChange={(e) => setMinBookingAmount(Number(e.target.value))}
                className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-2 text-white font-mono"
              />
            </div>

            <div>
              <label className="block text-zinc-400 mb-1">Expiry Date</label>
              <input
                type="date"
                required
                value={expiryDate}
                onChange={(e) => setExpiryDate(e.target.value)}
                className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-2 text-white font-mono"
              />
            </div>
          </div>

          <label className="flex items-center gap-2 text-zinc-300 cursor-pointer">
            <input
              type="checkbox"
              checked={isActive}
              onChange={(e) => setIsActive(e.target.checked)}
              className="accent-amber-500"
            />
            <span>Active immediately</span>
          </label>

          <button
            type="submit"
            className="w-full py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold text-xs cursor-pointer"
          >
            {editingPromo ? 'Save Promo Code' : 'Create Promo Code'}
          </button>
        </form>
      </div>
    </div>
  );
};

interface FAQModalProps {
  isOpen: boolean;
  editingFAQ: FAQItem | null;
  onClose: () => void;
  onSave: (data: Omit<FAQItem, 'id'>, existingId?: string) => void;
}

export const FAQModal: React.FC<FAQModalProps> = ({ isOpen, editingFAQ, onClose, onSave }) => {
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const [category, setCategory] = useState<FAQItem['category']>('Pricing & Booking');
  const [isPublished, setIsPublished] = useState(true);

  useEffect(() => {
    if (!isOpen) return;
    if (editingFAQ) {
      setQuestion(editingFAQ.question);
      setAnswer(editingFAQ.answer);
      setCategory(editingFAQ.category);
      setIsPublished(editingFAQ.isPublished);
    } else {
      setQuestion('');
      setAnswer('');
      setCategory('Pricing & Booking');
      setIsPublished(true);
    }
  }, [isOpen, editingFAQ]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(
      {
        question: question.trim(),
        answer: answer.trim(),
        category,
        isPublished,
      },
      editingFAQ?.id
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="w-full max-w-md bg-zinc-950 border border-zinc-800 rounded-2xl p-6 text-white space-y-4">
        <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
          <h3 className="font-bold text-white text-base">
            {editingFAQ ? 'Edit FAQ' : 'Add FAQ Question'}
          </h3>
          <button onClick={onClose} aria-label="Close FAQ modal" className="text-zinc-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block text-zinc-400 mb-1">Category</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value as FAQItem['category'])}
              className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-2 text-white"
            >
              <option value="Check-In/Out">Check-In/Out</option>
              <option value="Pricing & Booking">Pricing &amp; Booking</option>
              <option value="Amenities">Amenities</option>
              <option value="Policies">Policies</option>
            </select>
          </div>

          <div>
            <label className="block text-zinc-400 mb-1">Question</label>
            <input
              type="text"
              required
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-2 text-white"
            />
          </div>

          <div>
            <label className="block text-zinc-400 mb-1">Answer</label>
            <textarea
              rows={3}
              required
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-2 text-white"
            />
          </div>

          <label className="flex items-center gap-2 text-zinc-300 cursor-pointer">
            <input
              type="checkbox"
              checked={isPublished}
              onChange={(e) => setIsPublished(e.target.checked)}
              className="accent-amber-500"
            />
            <span>Publish immediately on public website</span>
          </label>

          <button
            type="submit"
            className="w-full py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold text-xs cursor-pointer"
          >
            {editingFAQ ? 'Save FAQ' : 'Add FAQ'}
          </button>
        </form>
      </div>
    </div>
  );
};

interface StaffModalProps {
  isOpen: boolean;
  existingUsers: User[];
  onClose: () => void;
  onSave: (data: Omit<User, 'id' | 'createdAt'>) => void;
}

export const StaffModal: React.FC<StaffModalProps> = ({
  isOpen,
  existingUsers,
  onClose,
  onSave,
}) => {
  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<UserRole>('sub_admin');
  const [error, setError] = useState('');

  useEffect(() => {
    if (!isOpen) return;
    setName('');
    setUsername('');
    setEmail('');
    setPhone('');
    setPassword('');
    setRole('sub_admin');
    setError('');
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const cleanUsername = username.trim().toLowerCase();
    const cleanEmail = email.trim().toLowerCase();
    const duplicate = existingUsers.some(
      (u) => u.username.toLowerCase() === cleanUsername || u.email.toLowerCase() === cleanEmail
    );
    if (duplicate) {
      setError('A user with that username or email already exists.');
      return;
    }

    onSave({
      name: name.trim(),
      username: cleanUsername,
      email: cleanEmail,
      phone: phone.trim() || undefined,
      password,
      role,
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="w-full max-w-md bg-zinc-950 border border-zinc-800 rounded-2xl p-6 text-white space-y-4">
        <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
          <h3 className="font-bold text-white text-base">Provision Staff User Account</h3>
          <button onClick={onClose} aria-label="Close staff modal" className="text-zinc-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">
          {error && (
            <div className="p-2.5 rounded-xl bg-rose-950/80 border border-rose-800 text-rose-300">
              {error}
            </div>
          )}

          <div>
            <label className="block text-zinc-400 mb-1">Full Name</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-2 text-white"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-zinc-400 mb-1">Username</label>
              <input
                type="text"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-2 text-white font-mono"
              />
            </div>

            <div>
              <label className="block text-zinc-400 mb-1">Phone</label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-2 text-white font-mono"
              />
            </div>
          </div>

          <div>
            <label className="block text-zinc-400 mb-1">Email</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-2 text-white font-mono"
            />
          </div>

          <div>
            <label className="block text-zinc-400 mb-1">Password</label>
            <input
              type="password"
              required
              minLength={4}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Minimum 4 characters"
              className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-2 text-white font-mono"
            />
          </div>

          <div>
            <label className="block text-zinc-400 mb-1">Role Designation</label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value as UserRole)}
              className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-2 text-white"
            >
              <option value="sub_admin">Sub-Admin (Front Desk Staff)</option>
              <option value="admin">Admin (Hotel Manager)</option>
              <option value="super_admin">Super Admin (Owner)</option>
            </select>
          </div>

          <button
            type="submit"
            className="w-full py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold text-xs cursor-pointer"
          >
            Create Staff Account
          </button>
        </form>
      </div>
    </div>
  );
};
