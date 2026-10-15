import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Trophy, 
  Award, 
  Sparkles, 
  Flame, 
  HelpCircle, 
  Lock, 
  Check, 
  Share2, 
  ChevronRight,
  X,
  Star,
  Gamepad2,
  Crown
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { useGame } from '../context/GameContext';
import { soundManager } from '../utils/sound';

export type BadgeRarity = 'common' | 'rare' | 'epic' | 'legendary';

export interface MilestoneBadge {
  id: string;
  title: string;
  description: string;
  icon: string;
  category: 'truths' | 'dares' | 'games' | 'streaks' | 'special';
  rarity: BadgeRarity;
  progress: number;
  maxProgress: number;
  unlocked: boolean;
  unlockedHint?: string;
  perk?: string;
}

export interface AchievementsModuleProps {
  variant?: 'full' | 'compact' | 'preview';
  title?: string;
  maxPreviewCount?: number;
  className?: string;
}

export const AchievementsModule: React.FC<AchievementsModuleProps> = ({
  variant = 'full',
  title = 'Milestone Badges',
  maxPreviewCount = 4,
  className = '',
}) => {
  const { stats, profile, packs, playSound } = useGame();
  const [selectedBadge, setSelectedBadge] = useState<MilestoneBadge | null>(null);
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [hasSloganTapped, setHasSloganTapped] = useState<boolean>(() => {
    try {
      return localStorage.getItem('playful_slogan_tapped') === 'true';
    } catch {
      return false;
    }
  });

  // Listen for brand slogan tap
  useEffect(() => {
    const handleSloganTap = () => {
      setHasSloganTapped(true);
      try {
        localStorage.setItem('playful_slogan_tapped', 'true');
      } catch {}
    };

    window.addEventListener('playful-slogan-tapped', handleSloganTap);
    return () => {
      window.removeEventListener('playful-slogan-tapped', handleSloganTap);
    };
  }, []);

  const customPacksCreated = packs.filter((p) => !!p.isCustom).length;
  const followedCreatorsCount = 3; // simulated default follower network

  // Compute all milestone badges from GameProvider state
  const badges: MilestoneBadge[] = useMemo(() => {
    const games = stats.gamesFinished ?? 0;
    const truths = stats.truthsAnswered ?? 0;
    const dares = stats.daresCompleted ?? 0;
    const streak = profile.streakDays ?? 1;

    return [
      {
        id: 'badge-first-game',
        title: 'Party Starter',
        description: 'Complete your first full game session with friends',
        icon: '🎉',
        category: 'games',
        rarity: 'common',
        progress: Math.min(games, 1),
        maxProgress: 1,
        unlocked: games >= 1,
        unlockedHint: 'Play 1 game to the final round',
        perk: 'Unlocks Party Host crown',
      },
      {
        id: 'badge-marathon-squad',
        title: 'Marathon Squad',
        description: 'Complete 5 full game sessions',
        icon: '🥂',
        category: 'games',
        rarity: 'rare',
        progress: Math.min(games, 5),
        maxProgress: 5,
        unlocked: games >= 5,
        unlockedHint: 'Finish 5 entire games',
        perk: '+50 Party XP',
      },
      {
        id: 'badge-party-royalty',
        title: 'Party Royalty',
        description: 'Complete 10 entire game sessions',
        icon: '👑',
        category: 'games',
        rarity: 'epic',
        progress: Math.min(games, 10),
        maxProgress: 10,
        unlocked: games >= 10,
        unlockedHint: 'Reach 10 completed games',
        perk: 'Exclusive Gold Avatar ring',
      },
      {
        id: 'badge-truth-seeker',
        title: 'Truth Teller',
        description: 'Confess 5 honest truths in gameplay',
        icon: '💡',
        category: 'truths',
        rarity: 'common',
        progress: Math.min(truths, 5),
        maxProgress: 5,
        unlocked: truths >= 5,
        unlockedHint: 'Answer 5 truth prompts',
        perk: 'Truth Master badge',
      },
      {
        id: 'badge-confession-master',
        title: 'Confession Royalty',
        description: 'Answer 15 honest truths without hesitation',
        icon: '🔮',
        category: 'truths',
        rarity: 'rare',
        progress: Math.min(truths, 15),
        maxProgress: 15,
        unlocked: truths >= 15,
        unlockedHint: 'Answer 15 truth prompts',
        perk: 'Crystal Aura title',
      },
      {
        id: 'badge-deep-soul',
        title: 'Deep Soul',
        description: 'Survive 30 intimate, vulnerable confessions',
        icon: '💖',
        category: 'truths',
        rarity: 'epic',
        progress: Math.min(truths, 30),
        maxProgress: 30,
        unlocked: truths >= 30,
        unlockedHint: 'Answer 30 truth cards',
        perk: 'Legendary Deep Talk deck access',
      },
      {
        id: 'badge-daredevil',
        title: 'Daredevil',
        description: 'Step up and crush 5 hilarious dares',
        icon: '🔥',
        category: 'dares',
        rarity: 'common',
        progress: Math.min(dares, 5),
        maxProgress: 5,
        unlocked: dares >= 5,
        unlockedHint: 'Complete 5 dare challenges',
        perk: 'Fire aura animation',
      },
      {
        id: 'badge-untamed-wild',
        title: 'Untamed Beast',
        description: 'Power through 15 high-energy dares',
        icon: '🦁',
        category: 'dares',
        rarity: 'rare',
        progress: Math.min(dares, 15),
        maxProgress: 15,
        unlocked: dares >= 15,
        unlockedHint: 'Complete 15 dares',
        perk: 'Spicy Dare Boost',
      },
      {
        id: 'badge-untouchable-legend',
        title: 'Untouchable Legend',
        description: 'Conquer 30 wild dares without flinching',
        icon: '⚡',
        category: 'dares',
        rarity: 'epic',
        progress: Math.min(dares, 30),
        maxProgress: 30,
        unlocked: dares >= 30,
        unlockedHint: 'Complete 30 dares',
        perk: 'Untouchable Champion flair',
      },
      {
        id: 'badge-streak-flame',
        title: 'Streak Flame',
        description: 'Build a consecutive 3-day play streak',
        icon: '⚡',
        category: 'streaks',
        rarity: 'common',
        progress: Math.min(streak, 3),
        maxProgress: 3,
        unlocked: streak >= 3,
        unlockedHint: 'Open and play 3 days in a row',
        perk: 'Flame multiplier badge',
      },
      {
        id: 'badge-streak-god',
        title: 'Daily Devotee',
        description: 'Keep the fire burning for 7 consecutive days',
        icon: '🌟',
        category: 'streaks',
        rarity: 'rare',
        progress: Math.min(streak, 7),
        maxProgress: 7,
        unlocked: streak >= 7,
        unlockedHint: 'Play 7 days in a row',
        perk: 'Rainbow streak badge',
      },
      {
        id: 'badge-deck-architect',
        title: 'Deck Architect',
        description: 'Create and publish your first custom party pack',
        icon: '🎨',
        category: 'special',
        rarity: 'common',
        progress: Math.min(customPacksCreated, 1),
        maxProgress: 1,
        unlocked: customPacksCreated >= 1,
        unlockedHint: 'Create 1 custom deck in Deck Builder',
        perk: 'Creator Spotlight',
      },
      {
        id: 'badge-play-nice-never',
        title: 'PLAY NICE? NEVER!',
        description: 'Discovered and tapped the signature brand slogan',
        icon: '😈',
        category: 'special',
        rarity: 'rare',
        progress: hasSloganTapped ? 1 : 0,
        maxProgress: 1,
        unlocked: hasSloganTapped,
        unlockedHint: 'Tap the animated “PLAY NICE? NEVER. 😈” slogan',
        perk: 'Cheeky Mischief Maker tag',
      },
      {
        id: 'badge-no-fear',
        title: 'Zero Skips Club',
        description: 'Finish an entire match without skipping a single prompt',
        icon: '🎯',
        category: 'special',
        rarity: 'legendary',
        progress: (stats.skips === 0 && games >= 1) ? 1 : 0,
        maxProgress: 1,
        unlocked: stats.skips === 0 && games >= 1,
        unlockedHint: 'Play a game from start to finish without passing',
        perk: 'Diamond Shield badge',
      },
    ];
  }, [stats, profile.streakDays, packs, hasSloganTapped]);

  const unlockedCount = badges.filter((b) => b.unlocked).length;
  const totalCount = badges.length;
  const progressPercent = Math.round((unlockedCount / totalCount) * 100);

  const filteredBadges = useMemo(() => {
    if (activeCategory === 'all') return badges;
    return badges.filter((b) => b.category === activeCategory);
  }, [badges, activeCategory]);

  const handleBadgeClick = (badge: MilestoneBadge) => {
    playSound(badge.unlocked ? 'sparkle' : 'tap');
    setSelectedBadge(badge);

    if (badge.unlocked) {
      confetti({
        particleCount: 30,
        spread: 50,
        origin: { y: 0.6 },
        colors: ['#753BDB', '#F04491', '#FFD447'],
        disableForReducedMotion: true,
      });
    }
  };

  const getRarityBadgeStyle = (rarity: BadgeRarity) => {
    switch (rarity) {
      case 'legendary':
        return 'text-[#FF7139] bg-[#FF7139]/15 border-[#FF7139]/30';
      case 'epic':
        return 'text-[#753BDB] bg-[#753BDB]/15 border-[#753BDB]/30';
      case 'rare':
        return 'text-[#48BDEB] bg-[#48BDEB]/15 border-[#48BDEB]/30';
      default:
        return 'text-[#796D87] bg-black/5 border-black/10';
    }
  };

  // Preview variant (for HomeScreen summary)
  if (variant === 'preview') {
    return (
      <div className={`space-y-3 ${className}`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Trophy className="w-4 h-4 text-[#FF7139]" />
            <h3 className="font-heading font-black text-sm text-[#302044]">
              {title}
            </h3>
          </div>
          <span className="text-[11px] text-[#796D87] font-bold">
            {unlockedCount} of {totalCount} Unlocked ({progressPercent}%)
          </span>
        </div>

        <div className="grid grid-cols-2 gap-2.5">
          {badges.slice(0, maxPreviewCount).map((badge, idx) => (
            <motion.div
              key={`badge-preview-${badge.id}-${idx}`}
              whileHover={{ y: -2 }}
              onClick={() => handleBadgeClick(badge)}
              className={`p-3 rounded-2xl border text-left cursor-pointer transition-all ${
                badge.unlocked
                  ? 'bg-white border-[#36B77A]/40 shadow-xs hover:border-[#36B77A]'
                  : 'bg-[#FFF9F5] border-[#EAE1F0] opacity-80 hover:opacity-100'
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="text-2xl drop-shadow-xs">{badge.icon}</span>
                {badge.unlocked ? (
                  <span className="text-[9px] font-heading font-black uppercase tracking-wider text-[#36B77A] bg-[#36B77A]/15 px-2 py-0.5 rounded-full">
                    Unlocked
                  </span>
                ) : (
                  <span className="text-[9px] font-bold text-[#796D87] tabular-nums">
                    {badge.progress}/{badge.maxProgress}
                  </span>
                )}
              </div>
              <div className="font-heading font-black text-xs text-[#302044] truncate">
                {badge.title}
              </div>
              <div className="text-[10px] text-[#796D87] line-clamp-1 mt-0.5">
                {badge.description}
              </div>

              {/* Progress Bar */}
              <div className="w-full bg-[#EAE1F0] h-1.5 rounded-full mt-2 overflow-hidden">
                <div
                  className={`h-full transition-all duration-300 ${
                    badge.unlocked ? 'bg-[#36B77A]' : 'bg-[#753BDB]'
                  }`}
                  style={{ width: `${(badge.progress / badge.maxProgress) * 100}%` }}
                />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    );
  }

  // Full module variant (ProfileScreen, modal, or dedicated tab)
  return (
    <div className={`space-y-4 ${className}`}>
      {/* Milestone Header with Progress */}
      <div className="p-4 sm:p-5 rounded-3xl bg-gradient-to-r from-[#753BDB]/15 via-[#F04491]/10 to-[#FFD447]/15 border border-[#753BDB]/25 shadow-card">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-[#753BDB] to-[#F04491] flex items-center justify-center text-white text-xl shadow-xs">
              <Award className="w-5 h-5 text-[#FFD447]" />
            </div>
            <div>
              <h3 className="font-heading font-black text-base text-[#302044]">
                {title}
              </h3>
              <p className="text-xs text-[#796D87]">
                Milestones awarded for games, truths, dares & chaos
              </p>
            </div>
          </div>

          <div className="text-right">
            <div className="font-heading font-black text-xl text-[#753BDB] tabular-nums">
              {unlockedCount} / {totalCount}
            </div>
            <div className="text-[10px] text-[#796D87] font-bold uppercase tracking-wider">
              {progressPercent}% Complete
            </div>
          </div>
        </div>

        {/* Global Progress Bar */}
        <div className="w-full h-2 rounded-full bg-white/60 overflow-hidden mt-3 shadow-inner">
          <div
            className="h-full bg-gradient-to-r from-[#753BDB] via-[#F04491] to-[#FF7139] transition-all duration-500 rounded-full"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      {/* Category Pills Filter */}
      <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-1 text-xs">
        {[
          { id: 'all', label: 'All Badges' },
          { id: 'games', label: '🎮 Games' },
          { id: 'truths', label: '💡 Truths' },
          { id: 'dares', label: '🔥 Dares' },
          { id: 'streaks', label: '⚡ Streaks' },
          { id: 'special', label: '✨ Special' },
        ].map((cat) => (
          <button
            key={`ach-cat-${cat.id}`}
            type="button"
            onClick={() => {
              playSound('tap');
              setActiveCategory(cat.id);
            }}
            className={`px-3 py-1.5 rounded-full font-heading font-bold whitespace-nowrap transition-all ${
              activeCategory === cat.id
                ? 'bg-[#753BDB] text-white shadow-xs'
                : 'bg-white text-[#796D87] border border-[#EAE1F0] hover:text-[#302044]'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Badges Grid */}
      <div className="grid grid-cols-2 gap-3">
        {filteredBadges.map((badge) => (
          <motion.div
            key={`badge-card-${badge.id}`}
            whileHover={{ y: -2 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => handleBadgeClick(badge)}
            className={`p-3.5 rounded-3xl border text-left cursor-pointer transition-all flex flex-col justify-between ${
              badge.unlocked
                ? 'bg-white border-[#36B77A]/40 shadow-card hover:border-[#36B77A]'
                : 'bg-[#FFF9F5] border-[#EAE1F0] opacity-85 hover:opacity-100 shadow-xs'
            }`}
          >
            <div>
              <div className="flex items-start justify-between gap-1 mb-2">
                <div
                  className={`w-12 h-12 rounded-2xl flex items-center justify-center text-2xl shadow-xs ${
                    badge.unlocked
                      ? 'bg-gradient-to-tr from-[#753BDB]/15 to-[#F04491]/15 text-white'
                      : 'bg-black/5 grayscale'
                  }`}
                >
                  <span className="drop-shadow-xs">{badge.icon}</span>
                </div>

                <div className="flex flex-col items-end gap-1">
                  <span
                    className={`text-[9px] font-heading font-black uppercase tracking-wider px-2 py-0.5 rounded-full border ${getRarityBadgeStyle(
                      badge.rarity
                    )}`}
                  >
                    {badge.rarity}
                  </span>
                  {badge.unlocked ? (
                    <span className="text-[10px] font-extrabold text-[#36B77A] flex items-center gap-0.5">
                      <Check className="w-3 h-3 stroke-[3]" />
                      <span>Unlocked</span>
                    </span>
                  ) : (
                    <span className="text-[10px] font-bold text-[#796D87] flex items-center gap-0.5">
                      <Lock className="w-2.5 h-2.5" />
                      <span>
                        {badge.progress}/{badge.maxProgress}
                      </span>
                    </span>
                  )}
                </div>
              </div>

              <div className="font-heading font-black text-xs sm:text-sm text-[#302044]">
                {badge.title}
              </div>
              <p className="text-[11px] text-[#796D87] line-clamp-2 mt-0.5 leading-snug">
                {badge.description}
              </p>
            </div>

            {/* Bottom Progress Bar */}
            <div className="mt-3 pt-2 border-t border-[#EAE1F0]">
              <div className="w-full bg-[#EAE1F0] h-1.5 rounded-full overflow-hidden">
                <div
                  className={`h-full transition-all duration-300 ${
                    badge.unlocked
                      ? 'bg-[#36B77A]'
                      : 'bg-gradient-to-r from-[#753BDB] to-[#F04491]'
                  }`}
                  style={{
                    width: `${Math.min(
                      100,
                      Math.round((badge.progress / badge.maxProgress) * 100)
                    )}%`,
                  }}
                />
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Badge Detail Modal */}
      <AnimatePresence>
        {selectedBadge && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 10 }}
              className="w-full max-w-sm rounded-3xl bg-white p-6 shadow-2xl text-center relative border border-[#EAE1F0]"
            >
              <button
                type="button"
                onClick={() => setSelectedBadge(null)}
                className="absolute top-4 right-4 p-2 rounded-full text-[#796D87] hover:bg-[#F2EAFE] hover:text-[#302044] transition-colors"
                aria-label="Close modal"
              >
                <X className="w-4 h-4" />
              </button>

              {/* Large Badge Graphic */}
              <div
                className={`w-20 h-20 mx-auto rounded-3xl flex items-center justify-center text-4xl shadow-playful mb-4 border-2 ${
                  selectedBadge.unlocked
                    ? 'bg-gradient-to-tr from-[#753BDB] to-[#F04491] text-white border-white'
                    : 'bg-[#F2EAFE] text-[#796D87] border-[#EAE1F0] grayscale'
                }`}
              >
                <span>{selectedBadge.icon}</span>
              </div>

              <div
                className={`inline-block text-[10px] font-heading font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full border mb-1.5 ${getRarityBadgeStyle(
                  selectedBadge.rarity
                )}`}
              >
                {selectedBadge.rarity} Milestone
              </div>

              <h4 className="font-heading font-black text-xl text-[#302044] mb-1">
                {selectedBadge.title}
              </h4>
              <p className="text-xs text-[#796D87] mb-4 max-w-xs mx-auto">
                {selectedBadge.description}
              </p>

              {/* Progress Box */}
              <div className="p-3.5 rounded-2xl bg-[#FFF9F5] border border-[#EAE1F0] mb-4 text-left">
                <div className="flex items-center justify-between text-xs font-heading font-bold mb-1.5">
                  <span className="text-[#302044]">Milestone Progress</span>
                  <span className="text-[#753BDB] tabular-nums font-black">
                    {selectedBadge.progress} / {selectedBadge.maxProgress} (
                    {Math.round(
                      (selectedBadge.progress / selectedBadge.maxProgress) * 100
                    )}
                    %)
                  </span>
                </div>
                <div className="w-full h-2 rounded-full bg-[#EAE1F0] overflow-hidden mb-2">
                  <div
                    className={`h-full transition-all ${
                      selectedBadge.unlocked ? 'bg-[#36B77A]' : 'bg-[#753BDB]'
                    }`}
                    style={{
                      width: `${Math.min(
                        100,
                        Math.round(
                          (selectedBadge.progress / selectedBadge.maxProgress) * 100
                        )
                      )}%`,
                    }}
                  />
                </div>
                <div className="text-[11px] text-[#796D87]">
                  {selectedBadge.unlocked
                    ? '🎉 Goal Achieved! Badge permanently added to your profile trophy cabinet.'
                    : `🎯 How to unlock: ${selectedBadge.unlockedHint || selectedBadge.description}`}
                </div>
              </div>

              {selectedBadge.perk && (
                <div className="text-xs font-heading font-bold text-[#753BDB] bg-[#F2EAFE] py-2 px-3 rounded-xl mb-4 flex items-center justify-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-[#FFD447]" />
                  <span>Reward: {selectedBadge.perk}</span>
                </div>
              )}

              <button
                type="button"
                onClick={() => setSelectedBadge(null)}
                className="w-full py-3 rounded-full bg-gradient-to-r from-[#753BDB] to-[#F04491] text-white font-heading font-bold text-xs shadow-md active:scale-98 transition-transform"
              >
                Awesome!
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
