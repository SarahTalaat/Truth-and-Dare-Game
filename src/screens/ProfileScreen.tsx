import React, { useState } from 'react';
import { 
  User, 
  Settings, 
  Volume2, 
  VolumeX, 
  Vibrate, 
  Flame, 
  Heart, 
  Trophy, 
  Edit3, 
  RotateCcw,
  Sparkles,
  Check,
  Globe,
  Bell,
  ShieldCheck,
  ShieldAlert,
  HelpCircle,
  FileText,
  DollarSign,
  LogOut,
  Trash2,
  Lock,
  HeartHandshake
} from 'lucide-react';
import { useGame } from '../context/GameContext';
import { HeaderBar } from '../components/HeaderBar';
import { AvatarPickerModal } from '../components/AvatarPickerModal';
import { ConfirmModal } from '../components/ConfirmModal';
import { CREATORS } from '../data/prompts';
import { Stats } from '../components/Stats';
import { AchievementsModule } from '../components/AchievementsModule';
import { BrandCatchphrase } from '../components/BrandCatchphrase';

export const ProfileScreen: React.FC = () => {
  const {
    profile,
    stats,
    updateProfile,
    packs,
    resetAllData,
    playSound,
    setCurrentScreen,
  } = useGame();

  const [isEditingNickname, setIsEditingNickname] = useState(false);
  const [nicknameInput, setNicknameInput] = useState(profile.nickname);
  const [showAvatarPicker, setShowAvatarPicker] = useState(false);
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [showMonetizationModal, setShowMonetizationModal] = useState(false);
  const [showHelpModal, setShowHelpModal] = useState(false);
  const [showLegalModal, setShowLegalModal] = useState<'terms' | 'privacy' | null>(null);

  const favoritePacks = packs.filter(p => profile.favoritePackIds.includes(p.id));
  const customPacks = packs.filter(p => !!p.isCustom);

  const handleSaveNickname = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (nicknameInput.trim()) {
      updateProfile({ nickname: nicknameInput.trim() });
      setIsEditingNickname(false);
      playSound('tap');
    }
  };

  return (
    <div className="min-h-screen bg-[#FFF9F5] text-[#302044] pb-28 max-w-lg mx-auto">
      <HeaderBar title="Profile & Settings" showSoundToggle={false} />

      <div className="px-4 py-4 space-y-6 text-left">
        {/* Profile Card */}
        <div className="p-5 rounded-3xl bg-white border border-[#EAE1F0] shadow-card flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => {
                playSound('tap');
                setShowAvatarPicker(true);
              }}
              className="relative group"
            >
              <div className="w-16 h-16 rounded-3xl bg-gradient-to-tr from-[#753BDB] to-[#F04491] flex items-center justify-center text-3xl shadow-sm ring-2 ring-[#753BDB]/20 group-hover:scale-105 transition-transform text-white">
                {profile.avatar}
              </div>
              <div className="absolute -bottom-1 -right-1 p-1 rounded-full bg-[#FFD447] text-[#302044] shadow-sm">
                <Edit3 className="w-3 h-3" />
              </div>
            </button>

            <div>
              {isEditingNickname ? (
                <form onSubmit={handleSaveNickname} className="flex items-center gap-2">
                  <input
                    type="text"
                    value={nicknameInput}
                    onChange={e => setNicknameInput(e.target.value)}
                    className="px-2.5 py-1 rounded-lg border border-[#753BDB] text-sm font-bold text-[#302044] w-32 focus:outline-none"
                    autoFocus
                  />
                  <button
                    type="submit"
                    className="p-1.5 rounded-lg bg-[#36B77A] text-white"
                  >
                    <Check className="w-4 h-4" />
                  </button>
                </form>
              ) : (
                <div className="flex items-center gap-2">
                  <h3 className="font-heading font-black text-xl text-[#302044]">
                    {profile.nickname}
                  </h3>
                  <button
                    onClick={() => {
                      playSound('tap');
                      setIsEditingNickname(true);
                      setNicknameInput(profile.nickname);
                    }}
                    className="p-1 rounded-md text-[#796D87] hover:text-[#302044]"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}

              <div className="flex items-center gap-2 text-xs text-[#796D87] mt-0.5">
                <span className="flex items-center gap-1 text-[#FF7139] font-extrabold">
                  <Flame className="w-3.5 h-3.5 fill-[#FF7139]" />
                  {profile.streakDays} Day Streak
                </span>
                <span>·</span>
                <span className="capitalize">{profile.role || 'Guest'}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Brand Slogan Signature */}
        <section aria-label="Brand Signature">
          <BrandCatchphrase variant="hero" />
        </section>

        {/* Lifetime Activity Stats Component */}
        <section aria-label="Player Statistics">
          <Stats variant="full" title="Lifetime Gameplay Stats" />
        </section>

        {/* Milestones and Badges Module */}
        <section aria-label="Milestone Badges">
          <AchievementsModule variant="full" title="Trophy Cabinet & Badges" />
        </section>

        {/* Creator Earnings & Monetization (Simulation) */}
        <div
          onClick={() => setShowMonetizationModal(true)}
          className="p-4 rounded-3xl bg-gradient-to-r from-[#F2EAFE] to-[#FFF9F5] border border-[#753BDB]/20 cursor-pointer flex items-center justify-between shadow-sm hover:border-[#753BDB]"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#753BDB] text-white flex items-center justify-center">
              <DollarSign className="w-5 h-5" />
            </div>
            <div>
              <div className="font-heading font-black text-sm text-[#302044]">
                Creator Earnings & Charity
              </div>
              <span className="text-[11px] text-[#796D87]">
                Simulated payouts & community revenue sharing
              </span>
            </div>
          </div>
          <span className="text-xs font-bold text-[#753BDB]">View →</span>
        </div>

        {/* App Preferences */}
        <div>
          <h4 className="text-xs font-bold uppercase tracking-wider text-[#796D87] mb-2.5 flex items-center gap-1.5">
            <Settings className="w-3.5 h-3.5 text-[#796D87]" />
            <span>Preferences & Controls</span>
          </h4>

          <div className="rounded-3xl bg-white border border-[#EAE1F0] shadow-card divide-y divide-[#EAE1F0]">
            {/* Sound Toggle */}
            <div className="flex items-center justify-between p-4">
              <div className="flex items-center gap-3">
                {profile.soundEnabled ? (
                  <Volume2 className="w-5 h-5 text-[#753BDB]" />
                ) : (
                  <VolumeX className="w-5 h-5 text-[#796D87]" />
                )}
                <div>
                  <div className="text-xs font-bold text-[#302044]">Sound Effects</div>
                  <div className="text-[11px] text-[#796D87]">Card reveals, fanfare & timer beeps</div>
                </div>
              </div>
              <button
                onClick={() => {
                  const next = !profile.soundEnabled;
                  updateProfile({ soundEnabled: next });
                  if (next) playSound('tap');
                }}
                className={`w-11 h-6 rounded-full transition-colors relative p-1 ${
                  profile.soundEnabled ? 'bg-[#753BDB]' : 'bg-[#EAE1F0]'
                }`}
              >
                <div
                  className={`w-4 h-4 rounded-full bg-white transition-transform ${
                    profile.soundEnabled ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>

            {/* Sound Volume & Test Panel */}
            {profile.soundEnabled && (
              <div className="p-4 bg-[#FFF9F5] space-y-3">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-[#796D87]">Audio Volume</span>
                  <span className="font-bold text-[#753BDB] tabular-nums">
                    {Math.round((profile.soundVolume ?? 0.8) * 100)}%
                  </span>
                </div>
                <input
                  type="range"
                  min="0.1"
                  max="1.0"
                  step="0.05"
                  value={profile.soundVolume ?? 0.8}
                  onChange={e => updateProfile({ soundVolume: parseFloat(e.target.value) })}
                  className="w-full accent-[#753BDB] h-1.5 bg-[#EAE1F0] rounded-lg cursor-pointer"
                />

                <div className="pt-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#796D87] block mb-2">
                    Test Audio Cues
                  </span>
                  <div className="grid grid-cols-3 gap-2">
                    <button
                      onClick={() => playSound('truth_reveal')}
                      className="py-1.5 px-2 rounded-full bg-[#F04491]/15 text-[11px] font-bold text-[#F04491] active:scale-95 transition-all text-center"
                    >
                      Truth Reveal
                    </button>
                    <button
                      onClick={() => playSound('dare_reveal')}
                      className="py-1.5 px-2 rounded-full bg-[#FF7139]/15 text-[11px] font-bold text-[#FF7139] active:scale-95 transition-all text-center"
                    >
                      Dare Reveal
                    </button>
                    <button
                      onClick={() => playSound('complete')}
                      className="py-1.5 px-2 rounded-full bg-[#36B77A]/15 text-[11px] font-bold text-[#36B77A] active:scale-95 transition-all text-center"
                    >
                      Complete!
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Vibration */}
            <div className="flex items-center justify-between p-4">
              <div className="flex items-center gap-3">
                <Vibrate className="w-5 h-5 text-[#48BDEB]" />
                <div>
                  <div className="text-xs font-bold text-[#302044]">Haptic Vibration</div>
                  <div className="text-[11px] text-[#796D87]">Tactile button feedback</div>
                </div>
              </div>
              <button
                onClick={() => {
                  playSound('tap');
                  updateProfile({ hapticEnabled: !profile.hapticEnabled });
                }}
                className={`w-11 h-6 rounded-full transition-colors relative p-1 ${
                  profile.hapticEnabled ? 'bg-[#753BDB]' : 'bg-[#EAE1F0]'
                }`}
              >
                <div
                  className={`w-4 h-4 rounded-full bg-white transition-transform ${
                    profile.hapticEnabled ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>

            {/* Notifications */}
            <div className="flex items-center justify-between p-4">
              <div className="flex items-center gap-3">
                <Bell className="w-5 h-5 text-[#FF7139]" />
                <div>
                  <div className="text-xs font-bold text-[#302044]">Notifications</div>
                  <div className="text-[11px] text-[#796D87]">Daily challenge streaks & updates</div>
                </div>
              </div>
              <button
                onClick={() => {
                  playSound('tap');
                  updateProfile({ notificationsEnabled: !profile.notificationsEnabled });
                }}
                className={`w-11 h-6 rounded-full transition-colors relative p-1 ${
                  profile.notificationsEnabled ? 'bg-[#753BDB]' : 'bg-[#EAE1F0]'
                }`}
              >
                <div
                  className={`w-4 h-4 rounded-full bg-white transition-transform ${
                    profile.notificationsEnabled ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>

            {/* 18+ Content Filter */}
            <div className="flex items-center justify-between p-4">
              <div className="flex items-center gap-3">
                <ShieldAlert className="w-5 h-5 text-[#E95757]" />
                <div>
                  <div className="text-xs font-bold text-[#302044]">18+ Adult Content Filter</div>
                  <div className="text-[11px] text-[#796D87]">Allow spicy late-night decks</div>
                </div>
              </div>
              <button
                onClick={() => {
                  playSound('tap');
                  updateProfile({ adultContentEnabled: !profile.adultContentEnabled });
                }}
                className={`w-11 h-6 rounded-full transition-colors relative p-1 ${
                  profile.adultContentEnabled ? 'bg-[#E95757]' : 'bg-[#EAE1F0]'
                }`}
              >
                <div
                  className={`w-4 h-4 rounded-full bg-white transition-transform ${
                    profile.adultContentEnabled ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>

            {/* Language Selector */}
            <div className="flex items-center justify-between p-4">
              <div className="flex items-center gap-3">
                <Globe className="w-5 h-5 text-[#753BDB]" />
                <div>
                  <div className="text-xs font-bold text-[#302044]">Language</div>
                  <div className="text-[11px] text-[#796D87]">Active deck content language</div>
                </div>
              </div>
              <select
                value={profile.language || 'English'}
                onChange={e => updateProfile({ language: e.target.value })}
                className="px-3 py-1.5 rounded-full bg-[#FFF9F5] border border-[#EAE1F0] text-xs font-bold text-[#302044] focus:outline-none"
              >
                <option value="English">English</option>
                <option value="Spanish">Spanish</option>
                <option value="French">French</option>
                <option value="German">German</option>
              </select>
            </div>
          </div>
        </div>

        {/* Safety & Legal Links */}
        <div className="space-y-2">
          <button
            onClick={() => setShowHelpModal(true)}
            className="w-full p-3.5 rounded-2xl bg-white border border-[#EAE1F0] flex items-center justify-between text-xs font-bold text-[#302044] hover:bg-[#F2EAFE]"
          >
            <span className="flex items-center gap-2">
              <HelpCircle className="w-4 h-4 text-[#753BDB]" />
              <span>How to Play & Safety Guidelines</span>
            </span>
            <span className="text-[#796D87]">→</span>
          </button>

          <button
            onClick={() => setShowLegalModal('terms')}
            className="w-full p-3.5 rounded-2xl bg-white border border-[#EAE1F0] flex items-center justify-between text-xs font-bold text-[#302044] hover:bg-[#F2EAFE]"
          >
            <span className="flex items-center gap-2">
              <FileText className="w-4 h-4 text-[#796D87]" />
              <span>Terms of Service</span>
            </span>
            <span className="text-[#796D87]">→</span>
          </button>

          <button
            onClick={() => setShowLegalModal('privacy')}
            className="w-full p-3.5 rounded-2xl bg-white border border-[#EAE1F0] flex items-center justify-between text-xs font-bold text-[#302044] hover:bg-[#F2EAFE]"
          >
            <span className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-[#36B77A]" />
              <span>Privacy Policy</span>
            </span>
            <span className="text-[#796D87]">→</span>
          </button>
        </div>

        {/* Log Out & Reset Data */}
        <div className="space-y-2 pt-2">
          <button
            onClick={() => {
              playSound('tap');
              setCurrentScreen('welcome_auth');
            }}
            className="w-full py-3.5 rounded-full bg-white border border-[#EAE1F0] text-xs font-bold text-[#796D87] hover:text-[#302044] flex items-center justify-center gap-2"
          >
            <LogOut className="w-4 h-4" />
            <span>Switch Account / Re-enter as Guest</span>
          </button>

          <button
            onClick={() => setShowResetConfirm(true)}
            className="w-full py-3.5 rounded-full bg-[#E95757]/10 hover:bg-[#E95757]/15 text-xs font-bold text-[#E95757] flex items-center justify-center gap-2"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Reset Local Game Data</span>
          </button>
        </div>
      </div>

      {/* Avatar Picker Modal */}
      <AvatarPickerModal
        isOpen={showAvatarPicker}
        currentAvatar={profile.avatar}
        onSelect={avatar => updateProfile({ avatar })}
        onClose={() => setShowAvatarPicker(false)}
      />

      {/* Reset Confirmation */}
      <ConfirmModal
        isOpen={showResetConfirm}
        title="Reset all game data?"
        description="This will clear your local streak, custom packs, and game statistics. This action cannot be undone."
        confirmLabel="Reset Everything"
        isDestructive
        onConfirm={() => {
          setShowResetConfirm(false);
          resetAllData();
        }}
        onCancel={() => setShowResetConfirm(false)}
      />

      {/* Help FAQ Modal */}
      {showHelpModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#302044]/60 backdrop-blur-sm">
          <div className="w-full max-w-sm bg-white rounded-3xl p-6 shadow-2xl text-left max-h-[80vh] overflow-y-auto no-scrollbar">
            <h3 className="font-heading font-black text-lg text-[#302044] mb-2">
              Game Rules & Safety
            </h3>
            <div className="space-y-3 text-xs text-[#796D87] leading-relaxed mb-5">
              <p>
                <strong>1. Consent First:</strong> Everyone is free to skip any prompt without judgment or penalty. Respect personal boundaries.
              </p>
              <p>
                <strong>2. Safe Dares:</strong> Never perform dares that cause physical injury, damage property, or harm others.
              </p>
              <p>
                <strong>3. Complete Privacy:</strong> What happens in the party stays in the room. Playful never stores your verbal answers.
              </p>
            </div>
            <button
              onClick={() => setShowHelpModal(false)}
              className="w-full py-3 rounded-full bg-[#753BDB] text-white font-heading font-bold text-xs"
            >
              Got It
            </button>
          </div>
        </div>
      )}

      {/* Terms & Privacy Modal */}
      {showLegalModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#302044]/60 backdrop-blur-sm">
          <div className="w-full max-w-sm bg-white rounded-3xl p-6 shadow-2xl text-left max-h-[80vh] overflow-y-auto no-scrollbar">
            <h3 className="font-heading font-black text-lg text-[#302044] mb-2">
              {showLegalModal === 'terms' ? 'Terms of Service' : 'Privacy Policy'}
            </h3>
            <p className="text-xs text-[#796D87] leading-relaxed mb-5">
              {showLegalModal === 'terms'
                ? 'Playful is a party prototype created for social entertainment among consenting players. Players may skip any prompt without judgment or penalty. Respect player boundaries and keep all party experiences safe and voluntary.'
                : 'Playful stores your game statistics, player names, and custom packs locally on your device. We do not transmit or sell personal confessions or answers to any external databases.'}
            </p>
            <button
              onClick={() => setShowLegalModal(null)}
              className="w-full py-3 rounded-full bg-[#753BDB] text-white font-heading font-bold text-xs"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* Creator Earnings Simulation Modal (Prompt 12) */}
      {showMonetizationModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#302044]/60 backdrop-blur-sm">
          <div className="w-full max-w-sm bg-white rounded-3xl p-6 shadow-2xl text-left max-h-[85vh] overflow-y-auto no-scrollbar">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#36B77A]/15 text-[11px] font-bold text-[#36B77A] mb-3">
              <DollarSign className="w-3.5 h-3.5" />
              <span>Simulated Creator Dashboard</span>
            </div>

            <h3 className="font-heading font-black text-xl text-[#302044] mb-1">
              Community Revenue Sharing
            </h3>
            <p className="text-xs text-[#796D87] mb-4 leading-relaxed">
              In production, creator pack sales support independent game designers and charity partners.
            </p>

            <div className="p-4 rounded-2xl bg-[#FFF9F5] border border-[#EAE1F0] mb-4 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="text-[#796D87]">Simulated Creator Balance</span>
                <span className="font-heading font-extrabold text-base text-[#36B77A]">$148.50</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-[#796D87]">Charity Allocation (15%)</span>
                <span className="font-bold text-[#753BDB]">$22.28 to Doctors Without Borders</span>
              </div>
            </div>

            <button
              onClick={() => setShowMonetizationModal(false)}
              className="w-full py-3 rounded-full bg-[#753BDB] text-white font-heading font-bold text-xs"
            >
              Close Dashboard
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
