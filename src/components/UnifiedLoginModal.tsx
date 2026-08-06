import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  X,
  Hotel,
  User as UserIcon,
  KeyRound,
  ShieldCheck,
  CheckCircle2,
  Crown,
  Sparkles,
  ArrowRight,
} from 'lucide-react';

interface UnifiedLoginModalProps {
  onClose: () => void;
}

export const UnifiedLoginModal: React.FC<UnifiedLoginModalProps> = ({ onClose }) => {
  const { login, switchRoleDemo, setIsLoginModalOpen } = useApp();

  const [usernameOrEmail, setUsernameOrEmail] = useState('');
  const [password, setPassword] = useState('');
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFeedback(null);

    if (!usernameOrEmail.trim()) {
      setFeedback({ type: 'error', text: 'Please enter a valid username or email address.' });
      return;
    }

    const res = login(usernameOrEmail);
    if (res.success) {
      setFeedback({ type: 'success', text: res.message });
      setTimeout(() => {
        setIsLoginModalOpen(false);
      }, 600);
    }
  };

  const handleQuickDemoRole = (role: 'super_admin' | 'admin' | 'sub_admin' | 'customer') => {
    switchRoleDemo(role);
    setIsLoginModalOpen(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-md bg-zinc-950 border border-zinc-800 rounded-2xl shadow-2xl overflow-hidden my-8 text-white">
        {/* Modal Header */}
        <div className="bg-zinc-900 px-6 py-4 border-b border-zinc-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-amber-500/10 text-amber-400">
              <Hotel className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">Kumar Guest House Portal</h2>
              <p className="text-[11px] text-zinc-400">Unified Single Sign-In Gateway</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Form Content */}
        <div className="p-6 space-y-5">
          <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-300">
            <span className="font-bold flex items-center gap-1 mb-0.5">
              <ShieldCheck className="w-4 h-4 text-amber-400" /> Smart Multi-Role Gateway:
            </span>
            Standard users, staff (Sub-Admin), managers (Admin), or owner (Super Admin) log in from this exact form and get redirected automatically to their designated interface!
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-zinc-300 mb-1">
                Username or Email Address
              </label>
              <div className="relative">
                <UserIcon className="w-4 h-4 text-zinc-500 absolute left-3 top-3" />
                <input
                  type="text"
                  required
                  value={usernameOrEmail}
                  onChange={(e) => setUsernameOrEmail(e.target.value)}
                  placeholder="superadmin, manager, staff, or guest@gmail.com"
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-xl pl-9 pr-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-amber-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-zinc-300 mb-1">Password</label>
              <div className="relative">
                <KeyRound className="w-4 h-4 text-zinc-500 absolute left-3 top-3" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-xl pl-9 pr-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-amber-500 font-mono"
                />
              </div>
            </div>

            {feedback && (
              <div
                className={`p-3 rounded-xl text-xs font-medium flex items-center gap-2 ${
                  feedback.type === 'success'
                    ? 'bg-emerald-950/80 text-emerald-300 border border-emerald-800/60'
                    : 'bg-rose-950/80 text-rose-300 border border-rose-800/60'
                }`}
              >
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>{feedback.text}</span>
              </div>
            )}

            <button
              type="submit"
              className="w-full py-3 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-zinc-950 font-bold text-sm shadow-lg shadow-amber-500/20 transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>Sign In to Unified Portal</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* Quick Demo Credentials Panel */}
          <div className="pt-4 border-t border-zinc-800/80">
            <div className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider mb-2.5 flex items-center justify-between">
              <span>Quick Demo Role Switches (1-Click Test):</span>
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs">
              <button
                type="button"
                onClick={() => handleQuickDemoRole('super_admin')}
                className="p-2.5 bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 hover:border-amber-500/40 rounded-xl text-left transition-colors group cursor-pointer"
              >
                <div className="font-bold text-amber-400 text-xs flex items-center justify-between">
                  <span>Super Admin</span>
                  <Crown className="w-3.5 h-3.5" />
                </div>
                <div className="text-[10px] text-zinc-400 font-mono">superadmin / owner</div>
              </button>

              <button
                type="button"
                onClick={() => handleQuickDemoRole('admin')}
                className="p-2.5 bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 hover:border-amber-500/40 rounded-xl text-left transition-colors group cursor-pointer"
              >
                <div className="font-bold text-amber-400 text-xs flex items-center justify-between">
                  <span>Admin (Manager)</span>
                  <ShieldCheck className="w-3.5 h-3.5" />
                </div>
                <div className="text-[10px] text-zinc-400 font-mono">admin / manager</div>
              </button>

              <button
                type="button"
                onClick={() => handleQuickDemoRole('sub_admin')}
                className="p-2.5 bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 hover:border-amber-500/40 rounded-xl text-left transition-colors group cursor-pointer"
              >
                <div className="font-bold text-amber-400 text-xs flex items-center justify-between">
                  <span>Sub-Admin (Staff)</span>
                  <UserIcon className="w-3.5 h-3.5" />
                </div>
                <div className="text-[10px] text-zinc-400 font-mono">staff / frontdesk</div>
              </button>

              <button
                type="button"
                onClick={() => handleQuickDemoRole('customer')}
                className="p-2.5 bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 hover:border-amber-500/40 rounded-xl text-left transition-colors group cursor-pointer"
              >
                <div className="font-bold text-amber-400 text-xs flex items-center justify-between">
                  <span>Guest Customer</span>
                  <UserIcon className="w-3.5 h-3.5" />
                </div>
                <div className="text-[10px] text-zinc-400 font-mono">guest / Amit Raj</div>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
