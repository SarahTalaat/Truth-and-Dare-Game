import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, Eye, EyeOff, Check, ShieldCheck, ArrowRight, UserCheck } from 'lucide-react';
import { useGame } from '../context/GameContext';

export const WelcomeAuthScreen: React.FC = () => {
  const { setCurrentScreen, updateProfile, playSound } = useGame();

  const [mode, setMode] = useState<'welcome' | 'login' | 'signup'>('welcome');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [ageConfirmed, setAgeConfirmed] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showLegalModal, setShowLegalModal] = useState<'terms' | 'privacy' | null>(null);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    if (mode === 'signup' && !name.trim()) {
      newErrors.name = 'Please enter your name or nickname';
    }
    if (!email.trim() || !email.includes('@')) {
      newErrors.email = 'Please enter a valid email address';
    }
    if (!password || password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    if (mode === 'signup' && !ageConfirmed) {
      newErrors.age = 'You must confirm your age to continue';
    }
    if (mode === 'signup' && !termsAccepted) {
      newErrors.terms = 'Please accept the Terms of Service & Privacy Policy';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    playSound('complete');
    updateProfile({
      nickname: name.trim() || email.split('@')[0] || 'PartyPlayer',
      email: email.trim(),
      role: 'user',
      onboardingCompleted: true,
    });
    setCurrentScreen('main_tabs');
  };

  const handleContinueAsGuest = () => {
    playSound('tap');
    updateProfile({
      role: 'guest',
      onboardingCompleted: true,
    });
    setCurrentScreen('main_tabs');
  };

  return (
    <div className="min-h-screen bg-[#FFF9F5] text-[#302044] flex flex-col justify-between p-6 max-w-lg mx-auto">
      {/* Brand Header */}
      <div className="text-center pt-4">
        <div className="w-14 h-14 mx-auto mb-3 rounded-2xl bg-gradient-to-tr from-[#753BDB] to-[#F04491] flex items-center justify-center text-white shadow-playful">
          <Sparkles className="w-7 h-7 text-[#FFD447]" />
        </div>
        <h1 className="font-heading font-black text-3xl text-[#302044] tracking-tight">
          Playful
        </h1>
        <p className="text-xs text-[#796D87] font-semibold mt-1">
          Honest truths. Wild dares. Zero awkward silences.
        </p>
      </div>

      {/* Main Mode View */}
      <div className="my-auto py-4">
        {mode === 'welcome' && (
          <div className="space-y-4">
            <div className="p-5 rounded-3xl bg-white border border-[#EAE1F0] shadow-card text-center mb-6">
              <span className="text-3xl block mb-2">🎉</span>
              <h3 className="font-heading font-extrabold text-lg text-[#302044] mb-1">
                Welcome to the Party!
              </h3>
              <p className="text-xs text-[#796D87] leading-relaxed">
                Join millions playing the most colorful Truth or Dare game. No mandatory signup required.
              </p>
            </div>

            <button
              onClick={() => {
                playSound('tap');
                setMode('signup');
              }}
              className="w-full py-4 rounded-full bg-gradient-to-r from-[#753BDB] to-[#F04491] text-white font-heading font-extrabold text-sm shadow-playful flex items-center justify-center gap-2 active:scale-98 transition-transform"
            >
              <span>Create Free Account</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={() => {
                playSound('tap');
                setMode('login');
              }}
              className="w-full py-3.5 rounded-full bg-white border border-[#EAE1F0] hover:bg-[#F2EAFE] text-[#302044] font-heading font-bold text-sm shadow-sm active:scale-98 transition-colors"
            >
              <span>I Already Have an Account</span>
            </button>

            <div className="relative py-2 text-center">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-[#EAE1F0]" />
              </div>
              <span className="relative bg-[#FFF9F5] px-3 text-[11px] font-bold text-[#796D87]">
                or
              </span>
            </div>

            <button
              onClick={handleContinueAsGuest}
              className="w-full py-3.5 rounded-full bg-[#F2EAFE] hover:bg-[#EAE1F0] text-[#753BDB] font-heading font-extrabold text-sm flex items-center justify-center gap-2 active:scale-98 transition-colors"
            >
              <UserCheck className="w-4 h-4" />
              <span>Continue as Guest (Instant Play)</span>
            </button>
          </div>
        )}

        {(mode === 'login' || mode === 'signup') && (
          <form onSubmit={handleFormSubmit} className="p-6 rounded-3xl bg-white border border-[#EAE1F0] shadow-card space-y-4 text-left">
            <div className="flex items-center justify-between mb-1">
              <h3 className="font-heading font-black text-xl text-[#302044]">
                {mode === 'signup' ? 'Create Account' : 'Welcome Back'}
              </h3>
              <button
                type="button"
                onClick={() => {
                  playSound('tap');
                  setMode('welcome');
                }}
                className="text-xs font-bold text-[#753BDB] hover:underline"
              >
                Back
              </button>
            </div>

            {mode === 'signup' && (
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#796D87] mb-1">
                  Name / Nickname
                </label>
                <input
                  type="text"
                  placeholder="e.g., Alex, PartyQueen"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  className={`w-full px-3.5 py-2.5 rounded-xl border text-xs text-[#302044] focus:outline-none ${
                    errors.name ? 'border-[#E95757] bg-[#E95757]/5' : 'border-[#EAE1F0] bg-[#FFF9F5] focus:border-[#753BDB]'
                  }`}
                />
                {errors.name && <p className="text-[10px] text-[#E95757] font-bold mt-1">{errors.name}</p>}
              </div>
            )}

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#796D87] mb-1">
                Email Address
              </label>
              <input
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={e => setEmail(e.target.value)}
                className={`w-full px-3.5 py-2.5 rounded-xl border text-xs text-[#302044] focus:outline-none ${
                  errors.email ? 'border-[#E95757] bg-[#E95757]/5' : 'border-[#EAE1F0] bg-[#FFF9F5] focus:border-[#753BDB]'
                }`}
              />
              {errors.email && <p className="text-[10px] text-[#E95757] font-bold mt-1">{errors.email}</p>}
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#796D87] mb-1">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="At least 6 characters"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  className={`w-full pl-3.5 pr-10 py-2.5 rounded-xl border text-xs text-[#302044] focus:outline-none ${
                    errors.password ? 'border-[#E95757] bg-[#E95757]/5' : 'border-[#EAE1F0] bg-[#FFF9F5] focus:border-[#753BDB]'
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#796D87] hover:text-[#302044]"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {errors.password && <p className="text-[10px] text-[#E95757] font-bold mt-1">{errors.password}</p>}
            </div>

            {mode === 'signup' && (
              <div className="space-y-2 pt-1 text-xs">
                <label className="flex items-start gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={ageConfirmed}
                    onChange={e => setAgeConfirmed(e.target.checked)}
                    className="mt-0.5 accent-[#753BDB] rounded"
                  />
                  <span className="text-[#796D87]">
                    I confirm I am at least 13 years old (or 18+ for adult content).
                  </span>
                </label>
                {errors.age && <p className="text-[10px] text-[#E95757] font-bold">{errors.age}</p>}

                <label className="flex items-start gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={termsAccepted}
                    onChange={e => setTermsAccepted(e.target.checked)}
                    className="mt-0.5 accent-[#753BDB] rounded"
                  />
                  <span className="text-[#796D87]">
                    I agree to the{' '}
                    <button
                      type="button"
                      onClick={() => setShowLegalModal('terms')}
                      className="text-[#753BDB] font-bold underline"
                    >
                      Terms of Service
                    </button>{' '}
                    and{' '}
                    <button
                      type="button"
                      onClick={() => setShowLegalModal('privacy')}
                      className="text-[#753BDB] font-bold underline"
                    >
                      Privacy Policy
                    </button>
                    .
                  </span>
                </label>
                {errors.terms && <p className="text-[10px] text-[#E95757] font-bold">{errors.terms}</p>}
              </div>
            )}

            <button
              type="submit"
              className="w-full py-4 rounded-full bg-gradient-to-r from-[#753BDB] to-[#F04491] text-white font-heading font-extrabold text-sm shadow-playful flex items-center justify-center gap-2 active:scale-98 transition-transform mt-2"
            >
              <span>{mode === 'signup' ? 'Sign Up & Play' : 'Log In & Play'}</span>
              <Check className="w-4 h-4" />
            </button>

            <div className="text-center pt-2">
              <button
                type="button"
                onClick={() => setMode(mode === 'signup' ? 'login' : 'signup')}
                className="text-xs font-bold text-[#753BDB] hover:underline"
              >
                {mode === 'signup' ? 'Already have an account? Log In' : 'Need an account? Sign Up'}
              </button>
            </div>
          </form>
        )}
      </div>

      {/* Guest bypass bottom notice */}
      <div className="text-center text-xs text-[#796D87] pb-2">
        <span className="flex items-center justify-center gap-1.5 font-bold">
          <ShieldCheck className="w-3.5 h-3.5 text-[#36B77A]" />
          <span>Local storage only · No external tracking</span>
        </span>
      </div>

      {/* Terms & Privacy Modal */}
      {showLegalModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#302044]/60 backdrop-blur-sm">
          <div className="w-full max-w-sm bg-white rounded-3xl p-6 shadow-2xl text-left max-h-[80vh] overflow-y-auto no-scrollbar">
            <h3 className="font-heading font-extrabold text-lg text-[#302044] mb-2">
              {showLegalModal === 'terms' ? 'Terms of Service' : 'Privacy Policy'}
            </h3>
            <p className="text-xs text-[#796D87] leading-relaxed mb-4">
              {showLegalModal === 'terms'
                ? 'Playful is a party prototype created for social entertainment among consenting players. Players may skip any prompt without judgment or penalty. Respect player boundaries and keep all party experiences safe and voluntary.'
                : 'Playful stores your game statistics, player names, and custom packs locally on your device. We do not transmit or sell personal confessions or answers to any external databases.'}
            </p>
            <button
              onClick={() => setShowLegalModal(null)}
              className="w-full py-2.5 rounded-full bg-[#753BDB] text-white font-heading font-bold text-xs"
            >
              I Understand
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
