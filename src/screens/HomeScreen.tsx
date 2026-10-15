import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Play, 
  Flame, 
  Sparkles, 
  ChevronRight, 
  CheckCircle2, 
  Heart, 
  Users, 
  Smile, 
  Compass, 
  Laugh, 
  PlusCircle, 
  Bell, 
  HelpCircle, 
  Star,
  Zap,
  ArrowRight,
  Shuffle,
  Trophy,
  History,
  RotateCw,
  Moon,
  ShieldAlert,
  Sparkle,
  Dices
} from 'lucide-react';
import { useGame } from '../context/GameContext';
import { CATEGORIES, CATEGORY_LIST } from '../data/categories';
import { CategoryId, Pack, Creator, Achievement } from '../types/game';
import { DailyChallengeModal } from '../components/DailyChallengeModal';
import { NotificationsModal } from '../components/NotificationsModal';
import { CreatorProfileModal } from '../components/CreatorProfileModal';
import { PartyLobbyModal } from '../components/PartyLobbyModal';
import { MascotPip } from '../components/MascotPip';
import { triggerReaction } from '../components/ReactionEngine';
import { PackDetailModal } from '../components/PackDetailModal';
import { BrandCatchphrase } from '../components/BrandCatchphrase';
import { Stats } from '../components/Stats';
import { AchievementsModule } from '../components/AchievementsModule';
import { CREATORS } from '../data/prompts';

export const HomeScreen: React.FC = () => {
  const {
    profile,
    stats,
    packs,
    session,
    gameHistory,
    setCurrentScreen,
    setActiveTab,
    startNewGame,
    isDailyCompletedToday,
    todayChallenge,
    setSelectedPackDetailId,
    playSound,
  } = useGame();

  const [showDailyModal, setShowDailyModal] = useState(false);
  const [showNotificationsModal, setShowNotificationsModal] = useState(false);
  const [showPartyLobby, setShowPartyLobby] = useState(false);
  const [selectedCreator, setSelectedCreator] = useState<Creator | null>(null);
  const [showSurpriseModal, setShowSurpriseModal] = useState(false);
  const [surpriseData, setSurpriseData] = useState<{
    category: CategoryId;
    mode: 'truth' | 'dare' | 'mixed';
    label: string;
    description: string;
  } | null>(null);

  const handleStartQuickGame = () => {
    playSound('tap');
    triggerReaction('yay');
    startNewGame({ category: 'party', mode: 'mixed' });
  };

  const handleStartMode = (mode: 'truth' | 'dare') => {
    playSound(mode === 'truth' ? 'truth_reveal' : 'dare_reveal');
    startNewGame({ mode });
  };

  const handleSelectCategory = (categoryId: CategoryId) => {
    playSound('tap');
    startNewGame({ category: categoryId });
  };

  const handleSurpriseMe = () => {
    playSound('flip');
    const categories: CategoryId[] = ['friends', 'couples', 'party', 'deep_talk', 'family', 'adults', 'funny'];
    const modes: ('truth' | 'dare' | 'mixed')[] = ['truth', 'dare', 'mixed'];
    
    const randomCategory = categories[Math.floor(Math.random() * categories.length)];
    const randomMode = modes[Math.floor(Math.random() * modes.length)];
    const catInfo = CATEGORIES[randomCategory];

    setSurpriseData({
      category: randomCategory,
      mode: randomMode,
      label: `${catInfo.name} · ${randomMode.toUpperCase()} MODE`,
      description: catInfo.tagline,
    });
    setShowSurpriseModal(true);
    triggerReaction('plot_twist');
  };

  const getCategoryIcon = (iconName: string) => {
    switch (iconName) {
      case 'Users': return <Users className="w-5 h-5 text-white" />;
      case 'Heart': return <Heart className="w-5 h-5 text-white" />;
      case 'Sparkles': return <Sparkles className="w-5 h-5 text-white" />;
      case 'Smile': return <Smile className="w-5 h-5 text-white" />;
      case 'Compass': return <Compass className="w-5 h-5 text-white" />;
      case 'Flame': return <Flame className="w-5 h-5 text-white" />;
      case 'Laugh': return <Laugh className="w-5 h-5 text-white" />;
      case 'Moon': return <Moon className="w-5 h-5 text-white" />;
      default: return <Sparkles className="w-5 h-5 text-white" />;
    }
  };

  const trendingPacks = packs.slice(0, 4);

  return (
    <div className="min-h-screen bg-[#FFF9F5] text-[#302044] pb-24 max-w-lg mx-auto px-4 pt-3 select-none">
      {/* Top Header Bar: Avatar, Greeting, Streak & Bell */}
      <header className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              playSound('tap');
              setActiveTab('profile');
              setCurrentScreen('main_tabs');
            }}
            className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-[#753BDB] to-[#F04491] flex items-center justify-center text-2xl shadow-sm border-2 border-white hover:scale-105 active:scale-95 transition-all"
            aria-label="View user profile"
            title="Profile"
          >
            {profile.avatar}
          </button>
          <div className="text-left">
            <div className="text-[11px] text-[#796D87] font-semibold flex items-center gap-1">
              <span>Welcome back,</span>
              <span className="inline-block animate-bounce">👋</span>
            </div>
            <h2 className="font-heading font-black text-lg text-[#302044] leading-tight">
              {profile.nickname}
            </h2>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Daily Streak Counter Pill */}
          <button
            onClick={() => {
              playSound('tap');
              setShowDailyModal(true);
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#FF7139]/15 text-xs font-heading font-black text-[#FF7139] border border-[#FF7139]/30 active:scale-95 transition-transform"
            aria-label={`Current streak: ${profile.streakDays} days`}
            title="Daily Streak"
          >
            <Flame className="w-4 h-4 fill-[#FF7139] text-[#FF7139] animate-pulse" />
            <span>{profile.streakDays}d</span>
          </button>

          {/* Notifications Bell */}
          <button
            onClick={() => {
              playSound('tap');
              setShowNotificationsModal(true);
            }}
            className="w-10 h-10 rounded-full bg-white border border-[#EAE1F0] flex items-center justify-center text-[#302044] hover:bg-[#F2EAFE] active:scale-95 transition-all shadow-sm relative"
            aria-label="View notifications"
            title="Notifications"
          >
            <Bell className="w-4 h-4" />
            <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-[#F04491] animate-ping" />
            <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-[#F04491]" />
          </button>
        </div>
      </header>

      {/* Hero Animated Card */}
      <section className="relative rounded-3xl p-6 mb-5 bg-gradient-to-br from-[#753BDB] via-[#F04491] to-[#48BDEB] shadow-playful text-white overflow-hidden border border-white/30">
        {/* Floating Background Stars & Bubbles */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {/* Bubbles */}
          <motion.div 
            animate={{ y: [0, -18, 0], x: [0, 8, 0], opacity: [0.3, 0.6, 0.3] }}
            transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
            className="absolute -top-3 -right-3 w-24 h-24 rounded-full bg-white/10 blur-sm"
          />
          <motion.div 
            animate={{ y: [0, 15, 0], x: [0, -10, 0], opacity: [0.2, 0.5, 0.2] }}
            transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
            className="absolute bottom-2 left-6 w-16 h-16 rounded-full bg-white/15 blur-sm"
          />
          {/* Floating Stars */}
          <motion.span 
            animate={{ rotate: [0, 20, 0], scale: [1, 1.2, 1] }}
            transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
            className="absolute top-4 right-16 text-lg opacity-80"
          >
            ⭐
          </motion.span>
          <motion.span 
            animate={{ rotate: [0, -25, 0], scale: [1, 1.3, 1] }}
            transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }}
            className="absolute bottom-14 right-8 text-base opacity-75"
          >
            ✨
          </motion.span>
          <motion.span 
            animate={{ y: [0, -6, 0] }}
            transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut', delay: 1.2 }}
            className="absolute top-12 left-32 text-xs opacity-70"
          >
            🌟
          </motion.span>
        </div>

        <div className="relative z-10 flex flex-col justify-between">
          <div className="flex items-start justify-between gap-3 mb-3">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/25 text-[11px] font-heading font-black text-[#FFD447] uppercase tracking-wider mb-2 border border-white/20">
                <Sparkles className="w-3.5 h-3.5" />
                <span>The Social Party Game</span>
              </div>

              <h1 className="font-heading font-black text-2xl sm:text-3xl mb-1.5 leading-tight text-white drop-shadow-sm">
                Bored? Let's make memories!
              </h1>
              <p className="text-xs text-white/95 max-w-[230px] leading-relaxed">
                Honest confessions, wild dares & laugh-out-loud moments for your squad.
              </p>
            </div>

            {/* Interactive Animated Mascot Pip */}
            <div className="shrink-0 pt-1">
              <MascotPip 
                size="md" 
                showSpeechBubble 
                message="Tap me! 🦊" 
              />
            </div>
          </div>

          {/* Main CTA: PLAY NOW */}
          <div className="mt-3">
            <button
              onClick={() => {
                playSound('tap');
                triggerReaction('yay');
                setCurrentScreen('setup');
              }}
              className="w-full py-4 px-6 rounded-full bg-white text-[#302044] font-heading font-black text-base shadow-xl flex items-center justify-center gap-2.5 active:scale-98 transition-all hover:bg-[#FFF9F5] border-2 border-white/80 cursor-pointer"
              aria-label="Play Now - Start a new game"
            >
              <div className="w-7 h-7 rounded-full bg-[#753BDB] text-white flex items-center justify-center shadow-xs">
                <Play className="w-4 h-4 fill-white ml-0.5" />
              </div>
              <span className="tracking-wide">PLAY NOW</span>
            </button>
          </div>
        </div>
      </section>

      {/* Brand Catchphrase Signature Showcase */}
      <section className="mb-5" aria-label="Brand Signature">
        <BrandCatchphrase variant="hero" />
      </section>

      {/* Continue Playing Banner (If active game session exists) */}
      {session?.isActive && !session.isCompleted && (
        <section className="mb-5">
          <div 
            onClick={() => {
              playSound('tap');
              setCurrentScreen('game');
            }}
            className="p-3.5 rounded-2xl bg-gradient-to-r from-[#753BDB]/15 via-[#F04491]/15 to-[#FF7139]/15 border-2 border-[#753BDB]/40 cursor-pointer flex items-center justify-between shadow-sm hover:border-[#753BDB] transition-all"
            role="button"
            aria-label="Continue playing current game"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#753BDB] text-white flex items-center justify-center font-bold text-lg shadow-xs">
                {session.settings.players[session.currentPlayerIndex]?.avatar || '🎮'}
              </div>
              <div>
                <div className="flex items-center gap-1.5 text-[10px] font-black uppercase text-[#753BDB]">
                  <span className="w-2 h-2 rounded-full bg-[#36B77A] animate-ping" />
                  <span>Game in progress</span>
                  <span>·</span>
                  <span>Round {session.currentRound}</span>
                </div>
                <div className="font-heading font-black text-xs text-[#302044]">
                  Turn: {session.settings.players[session.currentPlayerIndex]?.name || 'Player'}
                </div>
              </div>
            </div>

            <button 
              className="px-3.5 py-1.5 rounded-full bg-[#753BDB] text-white font-heading font-black text-xs shadow-xs flex items-center gap-1 hover:bg-[#602db8]"
            >
              <span>Resume</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </section>
      )}

      {/* 4 Action Strip: Quick Play, Create a Party, Truth Mode, Dare Mode, Surprise Me */}
      <section className="grid grid-cols-2 gap-2.5 mb-6" aria-label="Game Quick Actions">
        {/* Quick Play */}
        <button
          onClick={handleStartQuickGame}
          className="p-3.5 rounded-2xl bg-[#F2EAFE] border border-[#EAE1F0] hover:border-[#753BDB] flex items-center gap-3 active:scale-98 transition-all text-left shadow-xs"
          aria-label="Quick Play - 1-tap party game"
        >
          <div className="w-10 h-10 rounded-xl bg-[#753BDB] text-white flex items-center justify-center shrink-0 shadow-sm">
            <Zap className="w-5 h-5 fill-white text-white" />
          </div>
          <div>
            <div className="font-heading font-black text-sm text-[#302044]">Quick Play</div>
            <div className="text-[10px] text-[#796D87] font-semibold">1-tap party start</div>
          </div>
        </button>

        {/* Create a Party */}
        <button
          onClick={() => {
            playSound('tap');
            setShowPartyLobby(true);
          }}
          className="p-3.5 rounded-2xl bg-[#FFF9F5] border border-[#EAE1F0] hover:border-[#FF7139] flex items-center gap-3 active:scale-98 transition-all text-left shadow-xs"
          aria-label="Create a Party lobby"
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#FF7139] to-[#FFD447] text-[#302044] flex items-center justify-center shrink-0 shadow-sm">
            <Users className="w-5 h-5 text-[#302044]" />
          </div>
          <div>
            <div className="font-heading font-black text-sm text-[#302044]">Create a Party</div>
            <div className="text-[10px] text-[#796D87] font-semibold">Pass-the-phone</div>
          </div>
        </button>

        {/* Truth Mode */}
        <button
          onClick={() => handleStartMode('truth')}
          className="p-3.5 rounded-2xl bg-gradient-to-br from-[#F04491] to-[#FF7139] text-white shadow-xs flex items-center gap-3 active:scale-98 transition-transform text-left"
          aria-label="Truth Mode - Real confessions"
        >
          <div className="w-10 h-10 rounded-xl bg-black/20 flex items-center justify-center shrink-0 text-white">
            <HelpCircle className="w-5 h-5" />
          </div>
          <div>
            <div className="font-heading font-black text-sm uppercase tracking-wide">Truth Mode</div>
            <div className="text-[10px] text-white/90 font-semibold">Real confessions</div>
          </div>
        </button>

        {/* Dare Mode */}
        <button
          onClick={() => handleStartMode('dare')}
          className="p-3.5 rounded-2xl bg-gradient-to-br from-[#FF7139] to-[#FFD447] text-[#302044] shadow-xs flex items-center gap-3 active:scale-98 transition-transform text-left"
          aria-label="Dare Mode - Bold challenges"
        >
          <div className="w-10 h-10 rounded-xl bg-black/20 flex items-center justify-center shrink-0">
            <Flame className="w-5 h-5 text-[#302044] fill-[#302044]" />
          </div>
          <div>
            <div className="font-heading font-black text-sm uppercase tracking-wide">Dare Mode</div>
            <div className="text-[10px] text-[#302044]/90 font-bold">Wild challenges</div>
          </div>
        </button>
      </section>

      {/* Surprise Me Banner */}
      <section className="mb-6">
        <button
          onClick={handleSurpriseMe}
          className="w-full p-3.5 rounded-2xl bg-gradient-to-r from-[#48BDEB]/20 via-[#753BDB]/20 to-[#F04491]/20 border border-[#753BDB]/30 hover:border-[#753BDB] flex items-center justify-between text-left active:scale-98 transition-all shadow-xs"
          aria-label="Surprise Me - Random game generator"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#48BDEB] to-[#753BDB] text-white flex items-center justify-center shadow-xs">
              <Dices className="w-5 h-5" />
            </div>
            <div>
              <div className="font-heading font-black text-sm text-[#302044] flex items-center gap-1.5">
                <span>Surprise Me</span>
                <span className="text-[10px] bg-[#753BDB] text-white px-2 py-0.5 rounded-full font-bold">Random</span>
              </div>
              <div className="text-[10px] text-[#796D87]">Can't decide? Let fate choose your theme and rules!</div>
            </div>
          </div>

          <div className="p-1.5 rounded-full bg-white text-[#753BDB] shadow-xs">
            <ChevronRight className="w-4 h-4" />
          </div>
        </button>
      </section>

      {/* Categories Horizontal Showcase: Couples, Friends, Party, Deep Talk, Family, Spicy 18+ */}
      <section className="mb-6" aria-label="Game Categories">
        <div className="flex items-center justify-between mb-3">
          <div>
            <h3 className="font-heading font-black text-sm text-[#302044]">
              Choose Your Vibe
            </h3>
            <span className="text-[11px] text-[#796D87]">Tailored decks for every gathering</span>
          </div>
          <button
            onClick={() => {
              playSound('tap');
              setActiveTab('explore');
              setCurrentScreen('main_tabs');
            }}
            className="text-xs font-bold text-[#753BDB] flex items-center gap-1 hover:underline"
            aria-label="View all categories"
          >
            <span>All ({CATEGORY_LIST.length})</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="flex items-center gap-3 overflow-x-auto no-scrollbar pb-1">
          {CATEGORY_LIST.map((cat, idx) => (
            <button
              key={`home-cat-${cat.id}-${idx}`}
              onClick={() => handleSelectCategory(cat.id)}
              className={`w-36 h-32 p-3.5 rounded-3xl bg-gradient-to-br ${cat.gradient} text-white shrink-0 text-left shadow-sm flex flex-col justify-between active:scale-95 transition-all relative overflow-hidden border border-white/20`}
              aria-label={`Category ${cat.name}: ${cat.tagline}`}
            >
              <div className="flex items-center justify-between">
                <div className="w-9 h-9 rounded-xl bg-black/20 flex items-center justify-center">
                  {getCategoryIcon(cat.icon)}
                </div>
                {cat.isAdult && (
                  <span className="text-[9px] font-black uppercase tracking-wider bg-black/35 text-[#FFD447] px-2 py-0.5 rounded-full">
                    18+
                  </span>
                )}
              </div>
              <div>
                <div className="font-heading font-black text-sm text-white leading-tight">
                  {cat.name}
                </div>
                <div className="text-[10px] text-white/85 font-semibold truncate mt-0.5">
                  {cat.tagline}
                </div>
                <div className="text-[9px] text-white/70 font-bold mt-1">
                  {cat.totalPrompts} cards
                </div>
              </div>
            </button>
          ))}
        </div>
      </section>

      {/* Daily Fun Strip */}
      <section className="mb-6" aria-label="Today's Featured Challenge">
        <div className="flex items-center justify-between mb-2">
          <h3 className="font-heading font-black text-xs uppercase tracking-wider text-[#796D87] flex items-center gap-1.5">
            <Flame className="w-3.5 h-3.5 text-[#FF7139]" />
            <span>Daily Fun Challenge</span>
          </h3>
          <span className="text-[10px] text-[#796D87] font-semibold">Resets at midnight</span>
        </div>

        <div
          onClick={() => {
            playSound('tap');
            setShowDailyModal(true);
          }}
          className="p-4 rounded-3xl bg-white border border-[#EAE1F0] hover:border-[#753BDB]/40 cursor-pointer flex items-center justify-between gap-3 shadow-card transition-all"
          role="button"
          aria-label="Open today's challenge modal"
        >
          <div className="flex items-center gap-3">
            <div
              className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 ${
                isDailyCompletedToday
                  ? 'bg-[#36B77A]/15 text-[#36B77A]'
                  : 'bg-gradient-to-tr from-[#FF7139] to-[#FFD447] text-white shadow-sm'
              }`}
            >
              {isDailyCompletedToday ? (
                <CheckCircle2 className="w-6 h-6" />
              ) : (
                <Sparkles className="w-6 h-6 text-[#302044]" />
              )}
            </div>
            <div>
              <div className="flex items-center gap-2 text-[10px] text-[#796D87] font-bold uppercase mb-0.5">
                <span className="text-[#FF7139]">{todayChallenge.type}</span>
                <span>·</span>
                <span>{todayChallenge.intensity}</span>
                <span>·</span>
                <span className="text-[#36B77A]">{isDailyCompletedToday ? 'Completed' : 'Ready'}</span>
              </div>
              <p className="text-xs font-bold text-[#302044] line-clamp-1 max-w-[210px]">
                "{todayChallenge.text}"
              </p>
            </div>
          </div>

          <div className="p-2 rounded-full bg-[#F2EAFE] text-[#753BDB] shrink-0">
            <ChevronRight className="w-4 h-4" />
          </div>
        </div>
      </section>

      {/* Trending Packs Section */}
      <section className="mb-6" aria-label="Trending Decks">
        <div className="flex items-center justify-between mb-3">
          <div>
            <h3 className="font-heading font-black text-sm text-[#302044]">
              Trending Packs
            </h3>
            <span className="text-[11px] text-[#796D87]">Community favorites & creator specials</span>
          </div>
          <button
            onClick={() => {
              playSound('tap');
              setActiveTab('explore');
              setCurrentScreen('main_tabs');
            }}
            className="text-xs font-bold text-[#753BDB] flex items-center gap-1 hover:underline"
            aria-label="View all packs in marketplace"
          >
            <span>Explore All</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="space-y-2.5">
          {trendingPacks.map((pack, idx) => (
            <div
              key={`home-pack-${pack.id}-${idx}`}
              onClick={() => {
                playSound('tap');
                setSelectedPackDetailId(pack.id);
              }}
              className="p-3.5 rounded-3xl bg-white border border-[#EAE1F0] hover:border-[#753BDB] cursor-pointer flex items-center justify-between shadow-card transition-all"
              role="button"
              aria-label={`View pack: ${pack.title}`}
            >
              <div className="flex items-center gap-3">
                <div
                  className={`w-12 h-12 rounded-2xl bg-gradient-to-tr ${pack.coverGradient} flex items-center justify-center text-2xl text-white shadow-sm shrink-0`}
                >
                  {pack.coverSticker || '🎉'}
                </div>
                <div>
                  <h4 className="font-heading font-bold text-sm text-[#302044]">
                    {pack.title}
                  </h4>
                  <div className="flex items-center gap-2 text-[11px] text-[#796D87]">
                    <span>By {pack.creator.name}</span>
                    <span>·</span>
                    <span className="flex items-center gap-0.5 text-[#FF7139] font-bold">
                      <Star className="w-3 h-3 fill-[#FF7139]" />
                      {pack.rating}
                    </span>
                    <span>·</span>
                    <span>{pack.promptCount} cards</span>
                  </div>
                </div>
              </div>

              <span className="text-xs font-heading font-black text-[#753BDB] bg-[#F2EAFE] px-3.5 py-1.5 rounded-full shadow-xs">
                {pack.isUnlocked ? 'Play' : pack.price || 'Free'}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* Recently Played Section (With Empty State) */}
      <section className="mb-6" aria-label="Recently Played Sessions">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <History className="w-4 h-4 text-[#753BDB]" />
            <h3 className="font-heading font-black text-sm text-[#302044]">
              Recently Played
            </h3>
          </div>
          {gameHistory.length > 0 && (
            <button
              onClick={() => {
                playSound('tap');
                setActiveTab('library');
                setCurrentScreen('main_tabs');
              }}
              className="text-xs font-bold text-[#753BDB] hover:underline"
            >
              View History
            </button>
          )}
        </div>

        {gameHistory.length > 0 ? (
          <div className="space-y-2.5">
            {gameHistory.slice(0, 2).map((sessionHist, idx) => (
              <div
                key={`home-hist-${sessionHist.id}-${idx}`}
                className="p-3.5 rounded-2xl bg-white border border-[#EAE1F0] shadow-sm flex items-center justify-between"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#753BDB] to-[#F04491] flex items-center justify-center text-xl shadow-xs">
                    {sessionHist.mvpPlayerAvatar}
                  </div>
                  <div>
                    <div className="flex items-center gap-2 text-[10px] text-[#796D87] font-semibold">
                      <span className="capitalize font-bold text-[#753BDB]">{sessionHist.category}</span>
                      <span>·</span>
                      <span>{sessionHist.date}</span>
                    </div>
                    <div className="font-heading font-bold text-xs text-[#302044]">
                      MVP: {sessionHist.mvpPlayerName} ({sessionHist.completedTruths + sessionHist.completedDares} challenges)
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => {
                    playSound('tap');
                    startNewGame({ category: sessionHist.category });
                  }}
                  className="p-2 rounded-xl bg-[#F2EAFE] text-[#753BDB] hover:bg-[#EAE1F0] transition-colors"
                  title="Play this category again"
                  aria-label="Replay category"
                >
                  <RotateCw className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        ) : (
          /* Empty state for Recently Played */
          <div className="p-5 rounded-2xl bg-white border border-dashed border-[#EAE1F0] text-center">
            <span className="text-3xl mb-1 inline-block">🎲</span>
            <div className="font-heading font-bold text-xs text-[#302044] mb-1">
              No recent games yet
            </div>
            <p className="text-[11px] text-[#796D87] mb-3 max-w-xs mx-auto">
              Start your first session to keep track of MVPs, truth confessions, and wild dare records!
            </p>
            <button
              onClick={() => {
                playSound('tap');
                setCurrentScreen('setup');
              }}
              className="px-4 py-2 rounded-full bg-[#753BDB] text-white font-heading font-bold text-xs shadow-xs hover:bg-[#602db8] transition-colors"
            >
              Start First Game
            </button>
          </div>
        )}
      </section>

      {/* Stats Summary Component */}
      <section className="mb-6" aria-label="Game Stats Overview">
        <Stats variant="compact" title="Squad Party Stats" showShare={false} />
      </section>

      {/* Achievements Module Preview */}
      <section className="mb-6" aria-label="Player Achievements">
        <AchievementsModule variant="preview" title="Party Achievements" maxPreviewCount={4} />
      </section>

      {/* Featured Creators Section */}
      <section className="mb-6" aria-label="Featured Deck Creators">
        <h3 className="font-heading font-black text-sm text-[#302044] mb-3">
          Featured Creators
        </h3>

        <div className="grid grid-cols-2 gap-2.5">
          {Object.values(CREATORS).map((c, idx) => (
            <div
              key={`home-creator-${c.id}-${idx}`}
              onClick={() => {
                playSound('tap');
                setSelectedCreator(c);
              }}
              className="p-3 rounded-2xl bg-white border border-[#EAE1F0] hover:border-[#753BDB] cursor-pointer flex items-center gap-2.5 shadow-sm transition-all"
              role="button"
              aria-label={`View creator: ${c.name}`}
            >
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#753BDB] to-[#F04491] flex items-center justify-center text-xl text-white shadow-sm shrink-0">
                {c.avatar}
              </div>
              <div className="overflow-hidden">
                <h4 className="font-heading font-bold text-xs text-[#302044] truncate">
                  {c.name}
                </h4>
                <span className="text-[10px] text-[#796D87]">
                  {c.followersCount.toLocaleString()} followers
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Surprise Me Modal */}
      <AnimatePresence>
        {showSurpriseModal && surpriseData && (
          <motion.div
            key="home-surprise-modal-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#302044]/60 backdrop-blur-sm"
          >
            <motion.div
              key="home-surprise-modal-content"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="w-full max-w-sm bg-white rounded-3xl p-6 shadow-2xl text-center border border-[#EAE1F0]"
            >
              <div className="w-16 h-16 mx-auto mb-3 rounded-3xl bg-gradient-to-tr from-[#48BDEB] via-[#753BDB] to-[#F04491] flex items-center justify-center text-3xl shadow-playful">
                🎲
              </div>
              <span className="text-xs font-heading font-black uppercase text-[#753BDB] tracking-wider mb-1 block">
                Fate Has Decided!
              </span>
              <h3 className="font-heading font-black text-2xl text-[#302044] mb-1">
                {surpriseData.label}
              </h3>
              <p className="text-xs text-[#796D87] mb-6">
                "{surpriseData.description}"
              </p>

              <div className="space-y-2">
                <button
                  onClick={() => {
                    playSound('tap');
                    setShowSurpriseModal(false);
                    startNewGame({ category: surpriseData.category, mode: surpriseData.mode });
                  }}
                  className="w-full py-4 rounded-full bg-gradient-to-r from-[#753BDB] via-[#F04491] to-[#FF7139] text-white font-heading font-black text-sm shadow-playful active:scale-98 transition-transform"
                >
                  Let's Play This Now!
                </button>
                <button
                  onClick={handleSurpriseMe}
                  className="w-full py-3 rounded-full text-xs font-heading font-bold text-[#753BDB] hover:bg-[#F2EAFE] transition-colors"
                >
                  Spin Fate Again
                </button>
                <button
                  onClick={() => setShowSurpriseModal(false)}
                  className="w-full py-2 text-xs font-bold text-[#796D87] hover:text-[#302044]"
                >
                  Cancel
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Modals */}
      <DailyChallengeModal
        isOpen={showDailyModal}
        onClose={() => setShowDailyModal(false)}
      />

      <NotificationsModal
        isOpen={showNotificationsModal}
        onClose={() => setShowNotificationsModal(false)}
      />

      <PartyLobbyModal
        isOpen={showPartyLobby}
        onClose={() => setShowPartyLobby(false)}
      />

      <CreatorProfileModal
        isOpen={!!selectedCreator}
        creator={selectedCreator}
        onClose={() => setSelectedCreator(null)}
        onSelectPack={id => setSelectedPackDetailId(id)}
      />

      <PackDetailModal />
    </div>
  );
};
