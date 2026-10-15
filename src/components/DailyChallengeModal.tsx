import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Flame, CheckCircle2, Sparkles, Calendar } from 'lucide-react';
import { useGame } from '../context/GameContext';
import { CATEGORIES } from '../data/categories';
import { triggerCatchphrase } from './CatchphraseToast';

interface DailyChallengeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const DailyChallengeModal: React.FC<DailyChallengeModalProps> = ({
  isOpen,
  onClose,
}) => {
  const {
    todayChallenge,
    isDailyCompletedToday,
    completeDaily,
    profile,
    playSound,
  } = useGame();

  const categoryInfo = CATEGORIES[todayChallenge?.category || 'friends'] || CATEGORIES.friends;
  const isTruth = todayChallenge?.type === 'truth';

  const handleComplete = () => {
    completeDaily();
    triggerCatchphrase('yay');
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#302044]/60 backdrop-blur-sm">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="w-full max-w-sm bg-white border border-[#EAE1F0] rounded-3xl p-6 shadow-2xl relative text-center text-[#302044]"
          >
            {/* Close button */}
            <button
              onClick={() => {
                playSound('tap');
                onClose();
              }}
              className="absolute top-4 right-4 p-1 rounded-full bg-[#F2EAFE] text-[#796D87] hover:text-[#302044]"
              aria-label="Close"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Daily Streak Indicator */}
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FF7139]/15 text-xs font-heading font-extrabold text-[#FF7139] mb-4">
              <Flame className="w-3.5 h-3.5 fill-[#FF7139] text-[#FF7139]" />
              <span>{profile.streakDays} Day Streak!</span>
            </div>

            <h3 className="font-heading font-black text-xl text-[#302044] mb-1">
              Today’s Challenge
            </h3>
            <div className="flex items-center justify-center gap-2 text-xs text-[#796D87] mb-5">
              <Calendar className="w-3.5 h-3.5" />
              <span>
                {new Date().toLocaleDateString(undefined, {
                  weekday: 'short',
                  month: 'short',
                  day: 'numeric',
                })}
              </span>
              <span>·</span>
              <span>{categoryInfo.name}</span>
            </div>

            {/* Challenge Card */}
            <div
              className={`w-full rounded-3xl p-6 mb-5 text-left shadow-playful relative overflow-hidden ${
                isTruth
                  ? 'bg-gradient-to-br from-[#F04491] to-[#FF7139] text-white'
                  : 'bg-gradient-to-br from-[#FF7139] to-[#FFD447] text-[#302044]'
              }`}
            >
              <div className="flex items-center justify-between mb-3">
                <span className="font-heading font-black text-xs tracking-widest uppercase bg-black/20 px-2.5 py-1 rounded-full">
                  {todayChallenge.type.toUpperCase()}
                </span>
                <Sparkles className="w-4 h-4" />
              </div>

              <p className="font-heading font-black text-lg leading-relaxed">
                "{todayChallenge.text}"
              </p>
            </div>

            {/* Action button */}
            {isDailyCompletedToday ? (
              <div className="p-3.5 rounded-full bg-[#36B77A]/15 border border-[#36B77A]/30 flex items-center justify-center gap-2 text-xs font-heading font-extrabold text-[#36B77A]">
                <CheckCircle2 className="w-5 h-5 text-[#36B77A]" />
                <span>Completed for Today! (+1 Streak)</span>
              </div>
            ) : (
              <button
                onClick={handleComplete}
                className="w-full py-4 rounded-full bg-gradient-to-r from-[#753BDB] to-[#F04491] text-white font-heading font-black text-xs shadow-playful flex items-center justify-center gap-2 active:scale-98 transition-transform cursor-pointer"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>I Did It! (+1 Streak)</span>
              </button>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
