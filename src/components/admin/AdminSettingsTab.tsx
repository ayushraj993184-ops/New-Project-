import React, { useEffect, useState } from 'react';
import { HotelConfig } from '../../types';
import { sanitizeHttpUrl } from '../../utils/bookingUtils';
import { AlertCircle, CheckCircle2, Save } from 'lucide-react';

interface AdminSettingsTabProps {
  hotelConfig: HotelConfig;
  onSaveConfig: (config: Partial<HotelConfig>) => void;
}

export const AdminSettingsTab: React.FC<AdminSettingsTabProps> = ({
  hotelConfig,
  onSaveConfig,
}) => {
  const [hotelName, setHotelName] = useState(hotelConfig.hotelName);
  const [tagline, setTagline] = useState(hotelConfig.tagline);
  const [email, setEmail] = useState(hotelConfig.email);
  const [phonesText, setPhonesText] = useState(hotelConfig.phones.join(', '));
  const [phoneDisclaimer, setPhoneDisclaimer] = useState(hotelConfig.phoneDisclaimer);
  const [googleTravelUrl, setGoogleTravelUrl] = useState(hotelConfig.googleTravelUrl);
  const [address, setAddress] = useState(hotelConfig.address);
  const [landmark, setLandmark] = useState(hotelConfig.landmark);
  const [checkInTime, setCheckInTime] = useState(hotelConfig.checkInTime);
  const [checkOutTime, setCheckOutTime] = useState(hotelConfig.checkOutTime);
  const [peakSeasonName, setPeakSeasonName] = useState(hotelConfig.peakSeasonName);
  const [aboutText, setAboutText] = useState(hotelConfig.aboutText);
  const [policiesText, setPoliciesText] = useState(hotelConfig.policies.join('\n'));
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => {
    setHotelName(hotelConfig.hotelName);
    setTagline(hotelConfig.tagline);
    setEmail(hotelConfig.email);
    setPhonesText(hotelConfig.phones.join(', '));
    setPhoneDisclaimer(hotelConfig.phoneDisclaimer);
    setGoogleTravelUrl(hotelConfig.googleTravelUrl);
    setAddress(hotelConfig.address);
    setLandmark(hotelConfig.landmark);
    setCheckInTime(hotelConfig.checkInTime);
    setCheckOutTime(hotelConfig.checkOutTime);
    setPeakSeasonName(hotelConfig.peakSeasonName);
    setAboutText(hotelConfig.aboutText);
    setPoliciesText(hotelConfig.policies.join('\n'));
  }, [hotelConfig]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFeedback(null);

    if (googleTravelUrl.trim() && !sanitizeHttpUrl(googleTravelUrl)) {
      setFeedback({ type: 'error', text: 'Google Travel URL must begin with http:// or https://.' });
      return;
    }

    const phones = phonesText
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);
    const policies = policiesText
      .split('\n')
      .map((s) => s.trim())
      .filter(Boolean);

    onSaveConfig({
      hotelName: hotelName.trim(),
      tagline: tagline.trim(),
      email: email.trim(),
      phones,
      phoneDisclaimer: phoneDisclaimer.trim(),
      googleTravelUrl: googleTravelUrl.trim(),
      address: address.trim(),
      landmark: landmark.trim(),
      checkInTime: checkInTime.trim(),
      checkOutTime: checkOutTime.trim(),
      peakSeasonName: peakSeasonName.trim(),
      aboutText: aboutText.trim(),
      policies,
    });

    setFeedback({ type: 'success', text: 'Hotel settings saved successfully.' });
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-zinc-900 border border-zinc-800 p-6 rounded-2xl space-y-5"
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-zinc-800 pb-4">
        <div>
          <h3 className="font-bold text-white text-base">General Hotel Settings &amp; Contact Channels</h3>
          <p className="text-xs text-zinc-400">
            Edit property details, check-in timings, policies, and seasonal banners, then save.
          </p>
        </div>

        <button
          type="submit"
          className="px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold text-xs flex items-center gap-1.5 cursor-pointer self-start sm:self-auto"
        >
          <Save className="w-4 h-4" /> Save Hotel Settings
        </button>
      </div>

      {feedback && (
        <div
          className={`p-3 rounded-xl text-xs font-medium flex items-center gap-2 ${
            feedback.type === 'success'
              ? 'bg-emerald-950/80 text-emerald-300 border border-emerald-800'
              : 'bg-rose-950/80 text-rose-300 border border-rose-800'
          }`}
        >
          {feedback.type === 'success' ? (
            <CheckCircle2 className="w-4 h-4 shrink-0" />
          ) : (
            <AlertCircle className="w-4 h-4 shrink-0" />
          )}
          <span>{feedback.text}</span>
        </div>
      )}

      <div className="grid md:grid-cols-2 gap-4 text-xs">
        <div>
          <label className="block text-zinc-400 mb-1">Hotel Display Name</label>
          <input
            type="text"
            required
            value={hotelName}
            onChange={(e) => setHotelName(e.target.value)}
            className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-white"
          />
        </div>

        <div>
          <label className="block text-zinc-400 mb-1">Tagline</label>
          <input
            type="text"
            required
            value={tagline}
            onChange={(e) => setTagline(e.target.value)}
            className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-white"
          />
        </div>

        <div>
          <label className="block text-zinc-400 mb-1">Contact Email</label>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-white"
          />
        </div>

        <div>
          <label className="block text-zinc-400 mb-1">Contact Phone Numbers (Comma Separated)</label>
          <input
            type="text"
            value={phonesText}
            onChange={(e) => setPhonesText(e.target.value)}
            className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-white font-mono"
          />
        </div>

        <div>
          <label className="block text-zinc-400 mb-1">Google Travel Direct URL</label>
          <input
            type="url"
            value={googleTravelUrl}
            onChange={(e) => setGoogleTravelUrl(e.target.value)}
            className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-white font-mono"
          />
        </div>

        <div>
          <label className="block text-zinc-400 mb-1">Peak Season Banner Label</label>
          <input
            type="text"
            value={peakSeasonName}
            onChange={(e) => setPeakSeasonName(e.target.value)}
            className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-white"
          />
        </div>

        <div>
          <label className="block text-zinc-400 mb-1">Standard Check-In Time</label>
          <input
            type="text"
            value={checkInTime}
            onChange={(e) => setCheckInTime(e.target.value)}
            className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-white font-mono"
          />
        </div>

        <div>
          <label className="block text-zinc-400 mb-1">Standard Check-Out Time</label>
          <input
            type="text"
            value={checkOutTime}
            onChange={(e) => setCheckOutTime(e.target.value)}
            className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-white font-mono"
          />
        </div>

        <div>
          <label className="block text-zinc-400 mb-1">Physical Address</label>
          <input
            type="text"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-white"
          />
        </div>

        <div>
          <label className="block text-zinc-400 mb-1">Landmark</label>
          <input
            type="text"
            value={landmark}
            onChange={(e) => setLandmark(e.target.value)}
            className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-white"
          />
        </div>

        <div className="md:col-span-2">
          <label className="block text-zinc-400 mb-1">Phone Disclaimer</label>
          <input
            type="text"
            value={phoneDisclaimer}
            onChange={(e) => setPhoneDisclaimer(e.target.value)}
            className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-white"
          />
        </div>

        <div className="md:col-span-2">
          <label className="block text-zinc-400 mb-1">About Text</label>
          <textarea
            rows={2}
            value={aboutText}
            onChange={(e) => setAboutText(e.target.value)}
            className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-white"
          />
        </div>

        <div className="md:col-span-2">
          <label className="block text-zinc-400 mb-1">House Policies (One Policy Per Line)</label>
          <textarea
            rows={4}
            value={policiesText}
            onChange={(e) => setPoliciesText(e.target.value)}
            className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-white"
          />
        </div>
      </div>
    </form>
  );
};
