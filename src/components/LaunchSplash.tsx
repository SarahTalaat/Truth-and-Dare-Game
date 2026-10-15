import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, ArrowRight, RotateCcw, Volume2, VolumeX } from 'lucide-react';
import confetti from 'canvas-confetti';
import { soundManager } from '../utils/sound';
import { useGame } from '../context/GameContext';

interface LaunchSplashProps {
  onComplete: () => void;
  canDismiss?: boolean;
}

export const LaunchSplash: React.FC<LaunchSplashProps> = ({
  onComplete,
  canDismiss = true,
}) => {
  const { profile, updateProfile } = useGame();
  // Phase: 'curious' ("PLAY NICE?") -> 'pause' -> 'never' ("NEVERRRR! 😈")
  const [phase, setPhase] = useState<'curious' | 'pause' | 'never'>('curious');
  const [hasRevealed, setHasRevealed] = useState(false);

  const runSplashSequence = () => {
    setPhase('curious');
    if (profile.soundEnabled) {
      soundManager.playQuestionTone(true);
    }
    soundManager.triggerHaptic(profile.hapticEnabled);

    const timer1 = setTimeout(() => {
      setPhase('pause');
    }, 800);

    const timer2 = setTimeout(() => {
      setPhase('never');
      setHasRevealed(true);
      if (profile.soundEnabled) {
        soundManager.playNeverReveal(true);
      }
      soundManager.triggerHaptic(profile.hapticEnabled);

      confetti({
        particleCount: 90,
        spread: 85,
        origin: { y: 0.55 },
        colors: ['#753BDB', '#F04491', '#FF7139', '#FFD447', '#48BDEB'],
        disableForReducedMotion: true,
      });

      // Award achievement trigger
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('playful-slogan-tapped'));
      }
    }, 1600);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
    };
  };

  useEffect(() => {
    const cleanup = runSplashSequence();
    return cleanup;
  }, []);

  const handleReplay = (e: React.MouseEvent) => {
    e.stopPropagation();
    runSplashSequence();
  };

  const handleToggleSound = (e: React.MouseEvent) => {
    e.stopPropagation();
    updateProfile({ soundEnabled: !profile.soundEnabled });
    soundManager.playTap(true);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.3 }}
      onClick={() => {
        if (canDismiss && hasRevealed) {
          onComplete();
        }
      }}
      className="fixed inset-0 z-50 bg-[#FFF9F5] flex flex-col justify-between items-center p-6 text-center select-none overflow-hidden"
    >
      {/* Background Animated Gradient Blobs */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-30">
        <div className="absolute top-1/4 left-1/4 w-80 h-80 rounded-full bg-[#753BDB]/25 blur-3xl animate-pulse" />
        <div className="absolute bottom-1/3 right-1/4 w-80 h-80 rounded-full bg-[#F04491]/25 blur-3xl animate-pulse [animation-delay:1s]" />
        <div className="absolute top-1/2 right-1/3 w-60 h-60 rounded-full bg-[#FFD447]/30 blur-2xl animate-pulse [animation-delay:2s]" />
      </div>

      {/* Top Controls: Sound Toggle and Skip */}
      <div className="w-full max-w-md flex items-center justify-between z-10 pt-2">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-[#753BDB] to-[#F04491] flex items-center justify-center text-white shadow-sm font-heading font-black text-sm">
            P
          </div>
          <span className="font-heading font-black text-lg text-[#753BDB]">
            Playful
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleToggleSound}
            className="p-2 rounded-full bg-white border border-[#EAE1F0] text-[#302044] hover:bg-[#F2EAFE] shadow-sm transition-transform active:scale-95"
            aria-label={profile.soundEnabled ? 'Mute sound' : 'Unmute sound'}
          >
            {profile.soundEnabled ? (
              <Volume2 className="w-4 h-4 text-[#753BDB]" />
            ) : (
              <VolumeX className="w-4 h-4 text-[#796D87]" />
            )}
          </button>

          {canDismiss && hasRevealed && (
            <button
              type="button"
              onClick={onComplete}
              className="text-xs font-bold text-[#796D87] hover:text-[#302044] py-1.5 px-3 rounded-full hover:bg-[#F2EAFE] transition-colors"
            >
              Skip →
            </button>
          )}
        </div>
      </div>

      {/* Centerpiece: Mascot with facial expressions and the signature catchphrase */}
      <div className="my-auto flex flex-col items-center justify-center max-w-sm z-10">
        {/* Animated Mascot Head */}
        <div className="relative mb-6">
          <motion.div
            animate={
              phase === 'curious'
                ? { rotate: [-10, 8, -6], y: [0, -4, 0] }
                : phase === 'pause'
                ? { rotate: 0, scale: [1, 1.05, 1], y: [0, -2, 0] }
                : {
                    rotate: [0, -15, 15, -8, 8, 0],
                    scale: [1, 1.3, 1.15, 1.2],
                    y: [0, -10, 0],
                  }
            }
            transition={{ duration: phase === 'never' ? 0.8 : 0.6 }}
            className="w-32 h-32 rounded-3xl bg-gradient-to-tr from-[#753BDB] via-[#F04491] to-[#FF7139] flex items-center justify-center text-7xl shadow-playful border-4 border-white text-white relative cursor-pointer"
            onClick={handleReplay}
            title="Tap to replay mascot animation"
          >
            {/* Mascot Facial Expression */}
            <span className="drop-shadow-md select-none">
              {phase === 'curious' && '🦊'}
              {phase === 'pause' && '🤔'}
              {phase === 'never' && '😈'}
            </span>

            {/* Cheeky crown */}
            <span className="absolute -top-4 -right-3 text-3xl transform rotate-12 drop-shadow-sm">
              👑
            </span>
          </motion.div>

          {/* Speech bubble above mascot */}
          <AnimatePresence mode="wait">
            {phase === 'curious' && (
              <motion.div
                key="bubble-curious"
                initial={{ opacity: 0, scale: 0.8, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className="absolute -top-12 left-1/2 -translate-x-1/2 bg-white px-4 py-1.5 rounded-full border border-[#EAE1F0] shadow-md text-xs font-heading font-black text-[#753BDB] whitespace-nowrap flex items-center gap-1.5"
              >
                <span>Pip is asking...</span>
                <span>👀</span>
                <div className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-3 h-3 bg-white border-r border-b border-[#EAE1F0] rotate-45" />
              </motion.div>
            )}
            {phase === 'pause' && (
              <motion.div
                key="bubble-pause"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute -top-12 left-1/2 -translate-x-1/2 bg-white px-4 py-1.5 rounded-full border border-[#EAE1F0] shadow-md text-xs font-heading font-black text-[#796D87] whitespace-nowrap flex items-center gap-1"
              >
                <span>Wait for it</span>
                <span className="w-1.5 h-1.5 rounded-full bg-[#753BDB] animate-ping" />
                <div className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-3 h-3 bg-white border-r border-b border-[#EAE1F0] rotate-45" />
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Catchphrase Typography */}
        <div className="min-h-[110px] flex flex-col items-center justify-center">
          <AnimatePresence mode="wait">
            {phase === 'curious' && (
              <motion.div
                key="text-curious"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-1"
              >
                <div className="text-xs font-heading font-extrabold uppercase tracking-widest text-[#796D87]">
                  The Golden Rule
                </div>
                <h1 className="font-heading font-black text-4xl sm:text-5xl text-[#302044] tracking-tight">
                  PLAY NICE?
                </h1>
              </motion.div>
            )}

            {phase === 'pause' && (
              <motion.div
                key="text-pause"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex items-center gap-2 py-4"
              >
                <span className="w-3.5 h-3.5 rounded-full bg-[#753BDB] animate-bounce" />
                <span className="w-3.5 h-3.5 rounded-full bg-[#F04491] animate-bounce [animation-delay:0.15s]" />
                <span className="w-3.5 h-3.5 rounded-full bg-[#FF7139] animate-bounce [animation-delay:0.3s]" />
              </motion.div>
            )}

            {phase === 'never' && (
              <motion.div
                key="text-never"
                initial={{ opacity: 0, scale: 0.6, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ type: 'spring', damping: 14, stiffness: 350 }}
                className="space-y-1.5"
              >
                <div className="text-xs font-heading font-extrabold text-[#796D87] line-through decoration-[#F04491] decoration-2 uppercase tracking-widest">
                  PLAY NICE?
                </div>
                <div className="flex items-center justify-center gap-2">
                  <h1 className="font-heading font-black text-5xl sm:text-6xl bg-gradient-to-r from-[#F04491] via-[#FF7139] to-[#753BDB] bg-clip-text text-transparent tracking-tight drop-shadow-sm animate-pulse">
                    NEVERRRR!
                  </h1>
                  <span className="text-4xl animate-bounce">😈</span>
                </div>
                <p className="text-xs font-bold text-[#796D87] max-w-xs mx-auto">
                  Honest confessions, unhinged dares & unforgettable memories.
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Replay Pill */}
        {hasRevealed && (
          <motion.button
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            onClick={handleReplay}
            className="mt-4 px-3.5 py-1.5 rounded-full bg-white border border-[#EAE1F0] shadow-sm text-xs font-heading font-bold text-[#753BDB] flex items-center gap-1.5 hover:bg-[#F2EAFE] active:scale-95 transition-all"
          >
            <RotateCcw className="w-3 h-3" />
            <span>Tap to replay slogan</span>
            <span>✨</span>
          </motion.button>
        )}
      </div>

      {/* Bottom CTA to Enter App */}
      <div className="w-full max-w-md z-10 pb-4">
        <motion.button
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: hasRevealed ? 0.2 : 1.8 }}
          onClick={() => onComplete()}
          className="w-full py-4 px-6 rounded-full bg-gradient-to-r from-[#753BDB] via-[#F04491] to-[#FF7139] text-white font-heading font-black text-base shadow-playful flex items-center justify-center gap-2.5 active:scale-98 transition-all hover:opacity-95 cursor-pointer"
        >
          <span>LET'S PLAY! 🔥</span>
          <ArrowRight className="w-5 h-5 ml-1" />
        </motion.button>

        <p className="text-[11px] text-[#796D87] mt-3 font-semibold">
          Tap anywhere to dive straight in
        </p>
      </div>
    </motion.div>
  );
};
