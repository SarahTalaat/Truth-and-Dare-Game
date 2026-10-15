import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  Trophy, 
  HelpCircle, 
  Flame, 
  Gamepad2, 
  Sparkles, 
  Forward, 
  TrendingUp, 
  Award,
  CheckCircle2,
  Share2
} from 'lucide-react';
import { useGame } from '../context/GameContext';
import { soundManager } from '../utils/sound';

export interface StatsProps {
  variant?: 'full' | 'compact' | 'card';
  title?: string;
  showShare?: boolean;
  className?: string;
}

export const Stats: React.FC<StatsProps> = ({
  variant = 'full',
  title = 'Gameplay Statistics',
  showShare = true,
  className = '',
}) => {
  const { stats, profile, gameHistory, playSound } = useGame();
  const [activeView, setActiveView] = useState<'overview' | 'breakdown'>('overview');
  const [copied, setCopied] = useState(false);

  // Derived values from GameProvider state
  const gamesPlayed = stats.gamesFinished ?? 0;
  const totalTruths = stats.truthsAnswered ?? 0;
  const totalDares = stats.daresCompleted ?? 0;
  const totalPrompts = stats.totalPromptsPlayed ?? (totalTruths + totalDares + (stats.skips ?? 0));
  const totalSkips = stats.skips ?? 0;

  // Ratios & calculations
  const totalDecisions = totalTruths + totalDares;
  const truthPercentage = totalDecisions > 0 ? Math.round((totalTruths / totalDecisions) * 100) : 50;
  const darePercentage = totalDecisions > 0 ? 100 - truthPercentage : 50;
  const completionRate = (totalDecisions + totalSkips) > 0 
    ? Math.round((totalDecisions / (totalDecisions + totalSkips)) * 100) 
    : 100;

  // Determine player persona
  let persona = { title: 'The Balanced Partier', emoji: '⚖️', color: '#753BDB', desc: 'Equal parts honesty and fearlessness' };
  if (totalTruths > totalDares * 1.4 && totalTruths >= 5) {
    persona = { title: 'The Truth Teller', emoji: '💡', color: '#F04491', desc: 'Brave enough to spill every intimate secret' };
  } else if (totalDares > totalTruths * 1.4 && totalDares >= 5) {
    persona = { title: 'The Daredevil', emoji: '🔥', color: '#FF7139', desc: 'Ready for any wild physical challenge thrown down' };
  } else if (gamesPlayed >= 5) {
    persona = { title: 'Party Legend', emoji: '👑', color: '#FFD447', desc: 'The backbone of every squad hangout' };
  }

  const handleShareStats = () => {
    playSound('sparkle');
    const shareText = `📊 My Playful Stats:
🎮 ${gamesPlayed} Games Played
💡 ${totalTruths} Truths Confessed
🔥 ${totalDares} Dares Crushed
🔥 ${profile.streakDays} Day Streak
Persona: ${persona.title} ${persona.emoji}
"PLAY NICE? NEVER. 😈"`;

    if (navigator.clipboard) {
      navigator.clipboard.writeText(shareText).then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2200);
      });
    }
  };

  if (variant === 'compact') {
    return (
      <div className={`grid grid-cols-3 gap-2.5 ${className}`}>
        <div className="p-3 rounded-2xl bg-white border border-[#EAE1F0] text-center shadow-xs">
          <div className="text-[10px] font-heading font-black uppercase tracking-wider text-[#753BDB] flex items-center justify-center gap-1 mb-1">
            <Gamepad2 className="w-3 h-3" />
            <span>Games</span>
          </div>
          <div className="font-heading font-black text-2xl text-[#302044] tabular-nums">
            {gamesPlayed}
          </div>
        </div>

        <div className="p-3 rounded-2xl bg-white border border-[#EAE1F0] text-center shadow-xs">
          <div className="text-[10px] font-heading font-black uppercase tracking-wider text-[#F04491] flex items-center justify-center gap-1 mb-1">
            <HelpCircle className="w-3 h-3" />
            <span>Truths</span>
          </div>
          <div className="font-heading font-black text-2xl text-[#302044] tabular-nums">
            {totalTruths}
          </div>
        </div>

        <div className="p-3 rounded-2xl bg-white border border-[#EAE1F0] text-center shadow-xs">
          <div className="text-[10px] font-heading font-black uppercase tracking-wider text-[#FF7139] flex items-center justify-center gap-1 mb-1">
            <Flame className="w-3 h-3" />
            <span>Dares</span>
          </div>
          <div className="font-heading font-black text-2xl text-[#302044] tabular-nums">
            {totalDares}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Header with Title and Mode Toggle */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-[#753BDB]/15 text-[#753BDB] flex items-center justify-center">
            <Trophy className="w-4 h-4" />
          </div>
          <h3 className="font-heading font-black text-sm text-[#302044]">
            {title}
          </h3>
        </div>

        <div className="flex items-center gap-1 bg-[#F2EAFE] p-1 rounded-full border border-[#EAE1F0]">
          <button
            type="button"
            onClick={() => {
              playSound('tap');
              setActiveView('overview');
            }}
            className={`px-2.5 py-1 rounded-full text-[10px] font-heading font-extrabold transition-all ${
              activeView === 'overview'
                ? 'bg-white text-[#753BDB] shadow-xs'
                : 'text-[#796D87] hover:text-[#302044]'
            }`}
          >
            Core Stats
          </button>
          <button
            type="button"
            onClick={() => {
              playSound('tap');
              setActiveView('breakdown');
            }}
            className={`px-2.5 py-1 rounded-full text-[10px] font-heading font-extrabold transition-all ${
              activeView === 'breakdown'
                ? 'bg-white text-[#753BDB] shadow-xs'
                : 'text-[#796D87] hover:text-[#302044]'
            }`}
          >
            Playstyle Ratio
          </button>
        </div>
      </div>

      {/* The 3 Core Required Metrics Tracked from GameProvider State */}
      <div className="grid grid-cols-3 gap-2.5">
        {/* Metric 1: Games Played */}
        <motion.div
          whileHover={{ y: -2 }}
          className="p-3.5 sm:p-4 rounded-3xl bg-white border border-[#EAE1F0] shadow-card text-center relative overflow-hidden"
        >
          <div className="w-8 h-8 mx-auto mb-2 rounded-2xl bg-[#753BDB]/10 text-[#753BDB] flex items-center justify-center">
            <Gamepad2 className="w-4 h-4" />
          </div>
          <div className="font-heading font-black text-2xl sm:text-3xl text-[#302044] tabular-nums tracking-tight">
            {gamesPlayed}
          </div>
          <div className="text-[11px] font-heading font-bold text-[#796D87] mt-0.5">
            Games Played
          </div>
        </motion.div>

        {/* Metric 2: Total Truths Answered */}
        <motion.div
          whileHover={{ y: -2 }}
          className="p-3.5 sm:p-4 rounded-3xl bg-white border border-[#EAE1F0] shadow-card text-center relative overflow-hidden"
        >
          <div className="w-8 h-8 mx-auto mb-2 rounded-2xl bg-[#F04491]/10 text-[#F04491] flex items-center justify-center">
            <HelpCircle className="w-4 h-4" />
          </div>
          <div className="font-heading font-black text-2xl sm:text-3xl text-[#F04491] tabular-nums tracking-tight">
            {totalTruths}
          </div>
          <div className="text-[11px] font-heading font-bold text-[#796D87] mt-0.5">
            Total Truths
          </div>
        </motion.div>

        {/* Metric 3: Total Dares Completed */}
        <motion.div
          whileHover={{ y: -2 }}
          className="p-3.5 sm:p-4 rounded-3xl bg-white border border-[#EAE1F0] shadow-card text-center relative overflow-hidden"
        >
          <div className="w-8 h-8 mx-auto mb-2 rounded-2xl bg-[#FF7139]/10 text-[#FF7139] flex items-center justify-center">
            <Flame className="w-4 h-4" />
          </div>
          <div className="font-heading font-black text-2xl sm:text-3xl text-[#FF7139] tabular-nums tracking-tight">
            {totalDares}
          </div>
          <div className="text-[11px] font-heading font-bold text-[#796D87] mt-0.5">
            Total Dares
          </div>
        </motion.div>
      </div>

      {/* Overview View: Persona & Additional Metrics */}
      {activeView === 'overview' && (
        <div className="space-y-3">
          {/* Persona Card */}
          <div className="p-4 rounded-3xl bg-gradient-to-r from-[#F2EAFE] via-white to-[#FFF9F5] border border-[#753BDB]/20 shadow-xs flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-white border border-[#EAE1F0] flex items-center justify-center text-2xl shadow-xs">
                {persona.emoji}
              </div>
              <div>
                <div className="text-[10px] font-heading font-black uppercase tracking-wider text-[#753BDB]">
                  Assigned Playstyle
                </div>
                <div className="font-heading font-black text-sm sm:text-base text-[#302044]">
                  {persona.title}
                </div>
                <p className="text-[11px] text-[#796D87] leading-tight mt-0.5">
                  {persona.desc}
                </p>
              </div>
            </div>

            {showShare && (
              <button
                type="button"
                onClick={handleShareStats}
                className="px-3 py-1.5 rounded-full bg-white border border-[#EAE1F0] hover:bg-[#F2EAFE] text-[#753BDB] text-xs font-heading font-bold flex items-center gap-1 shadow-xs transition-colors shrink-0"
              >
                {copied ? (
                  <>
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#36B77A]" />
                    <span className="text-[#36B77A]">Copied!</span>
                  </>
                ) : (
                  <>
                    <Share2 className="w-3.5 h-3.5" />
                    <span>Share</span>
                  </>
                )}
              </button>
            )}
          </div>

          {/* Secondary Details: Total Prompts, Skips, Completion */}
          <div className="grid grid-cols-3 gap-2 text-left">
            <div className="p-3 rounded-2xl bg-white border border-[#EAE1F0] shadow-xs">
              <div className="text-[10px] font-bold text-[#796D87] uppercase tracking-wider">
                Cards Drawn
              </div>
              <div className="font-heading font-black text-lg text-[#302044] tabular-nums mt-0.5">
                {totalPrompts}
              </div>
            </div>

            <div className="p-3 rounded-2xl bg-white border border-[#EAE1F0] shadow-xs">
              <div className="text-[10px] font-bold text-[#796D87] uppercase tracking-wider">
                Skips Used
              </div>
              <div className="font-heading font-black text-lg text-[#796D87] tabular-nums mt-0.5">
                {totalSkips}
              </div>
            </div>

            <div className="p-3 rounded-2xl bg-white border border-[#EAE1F0] shadow-xs">
              <div className="text-[10px] font-bold text-[#796D87] uppercase tracking-wider">
                Completion
              </div>
              <div className="font-heading font-black text-lg text-[#36B77A] tabular-nums mt-0.5">
                {completionRate}%
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Breakdown View: Truth vs Dare Ratio Bar */}
      {activeView === 'breakdown' && (
        <div className="p-4 rounded-3xl bg-white border border-[#EAE1F0] shadow-card space-y-3">
          <div className="flex items-center justify-between text-xs font-heading font-bold">
            <span className="text-[#F04491] flex items-center gap-1">
              <span>Truths</span>
              <span className="font-black">({truthPercentage}%)</span>
            </span>
            <span className="text-[#FF7139] flex items-center gap-1">
              <span className="font-black">({darePercentage}%)</span>
              <span>Dares</span>
            </span>
          </div>

          {/* Ratio bar */}
          <div className="w-full h-3 rounded-full bg-[#EAE1F0] overflow-hidden flex shadow-inner">
            <div
              className="h-full bg-gradient-to-r from-[#753BDB] to-[#F04491] transition-all duration-500"
              style={{ width: `${truthPercentage}%` }}
              title={`Truths: ${truthPercentage}%`}
            />
            <div
              className="h-full bg-gradient-to-r from-[#FF7139] to-[#FFD447] transition-all duration-500"
              style={{ width: `${darePercentage}%` }}
              title={`Dares: ${darePercentage}%`}
            />
          </div>

          <div className="flex items-center justify-between text-[11px] text-[#796D87]">
            <span>{totalTruths} truths answered</span>
            <span>{totalDares} dares faced</span>
          </div>

          <div className="pt-2 border-t border-[#EAE1F0] text-[11px] text-[#796D87] leading-relaxed">
            💡 {totalTruths >= totalDares 
              ? 'You lean towards honesty and self-reflection!' 
              : 'You are an action-oriented adrenaline chaser!'}
          </div>
        </div>
      )}
    </div>
  );
};
