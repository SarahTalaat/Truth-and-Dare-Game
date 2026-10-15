import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, Volume2, RotateCcw } from 'lucide-react';
import confetti from 'canvas-confetti';
import { soundManager } from '../utils/sound';
import { useGame } from '../context/GameContext';

export interface BrandCatchphraseProps {
  variant?: 'hero' | 'compact' | 'card' | 'badge';
  autoAnimateOnMount?: boolean;
  onReplay?: () => void;
  className?: string;
}

export const BrandCatchphrase: React.FC<BrandCatchphraseProps> = ({
  variant = 'hero',
  autoAnimateOnMount = true,
  onReplay,
  className = '',
}) => {
  const { profile } = useGame();
  // Animation phase: 'idle' | 'asking' ('PLAY NICE?') | 'pause' | 'revealed' ('NEVERRRR! 😈')
  const [phase, setPhase] = useState<'idle' | 'asking' | 'pause' | 'revealed'>('idle');
  const [isPlaying, setIsPlaying] = useState(false);

  const runSequence = () => {
    setIsPlaying(true);
    setPhase('asking');

    if (profile.soundEnabled) {
      soundManager.playQuestionTone(true);
    }
    soundManager.triggerHaptic(profile.hapticEnabled);

    // Pause dramatically
    const pauseTimer = setTimeout(() => {
      setPhase('pause');
    }, 600);

    // Reveal "NEVERRRR! 😈"
    const revealTimer = setTimeout(() => {
      setPhase('revealed');
      if (profile.soundEnabled) {
        soundManager.playNeverReveal(true);
      }
      soundManager.triggerHaptic(profile.hapticEnabled);

      // Colorful confetti burst matching Playful palette
      confetti({
        particleCount: 55,
        spread: 75,
        origin: { y: 0.6 },
        colors: ['#753BDB', '#F04491', '#FF7139', '#FFD447', '#48BDEB'],
        disableForReducedMotion: true,
      });

      // Dispatch custom event for achievement tracking
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('playful-slogan-tapped'));
      }

      if (onReplay) {
        onReplay();
      }

      // Finish sequence after display
      setTimeout(() => {
        setIsPlaying(false);
      }, 2400);
    }, 1250);

    return () => {
      clearTimeout(pauseTimer);
      clearTimeout(revealTimer);
    };
  };

  useEffect(() => {
    if (autoAnimateOnMount) {
      const initialDelay = setTimeout(() => {
        runSequence();
      }, 400);
      return () => clearTimeout(initialDelay);
    } else {
      setPhase('revealed');
    }
  }, [autoAnimateOnMount]);

  const handleTap = () => {
    runSequence();
  };

  // Compact variant for header or small cards
  if (variant === 'compact' || variant === 'badge') {
    return (
      <motion.button
        type="button"
        whileHover={{ scale: 1.04 }}
        whileTap={{ scale: 0.95 }}
        onClick={handleTap}
        className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gradient-to-r from-[#753BDB]/10 via-[#F04491]/10 to-[#FF7139]/10 border border-[#753BDB]/25 text-[#302044] cursor-pointer transition-all ${className}`}
        title="Tap the signature catchphrase!"
        aria-label="Play Nice? Never. Tap to replay animation"
      >
        <span className="text-base animate-bounce">
          {phase === 'asking' ? '🦊' : phase === 'pause' ? '🤔' : '😈'}
        </span>
        <span className="font-heading font-black text-xs tracking-tight">
          {phase === 'asking' ? (
            <span className="text-[#753BDB]">PLAY NICE?</span>
          ) : phase === 'pause' ? (
            <span className="text-[#796D87] tracking-widest">...</span>
          ) : (
            <span className="bg-gradient-to-r from-[#753BDB] via-[#F04491] to-[#FF7139] bg-clip-text text-transparent">
              PLAY NICE? NEVER. 😈
            </span>
          )}
        </span>
      </motion.button>
    );
  }

  // Card watermark variant for recap / share
  if (variant === 'card') {
    return (
      <div
        onClick={handleTap}
        className={`p-3 rounded-2xl bg-gradient-to-r from-[#753BDB]/10 to-[#F04491]/10 border border-[#753BDB]/20 flex items-center justify-between cursor-pointer select-none ${className}`}
      >
        <div className="flex items-center gap-2">
          <span className="text-2xl">😈</span>
          <div>
            <div className="font-heading font-black text-xs uppercase tracking-wider text-[#753BDB]">
              Playful Signature
            </div>
            <div className="font-heading font-black text-sm text-[#302044] tracking-tight">
              “PLAY NICE? NEVER.”
            </div>
          </div>
        </div>
        <div className="text-[10px] font-bold text-[#796D87] bg-white px-2.5 py-1 rounded-full border border-[#EAE1F0] shadow-xs flex items-center gap-1">
          <RotateCcw className="w-3 h-3 text-[#753BDB]" />
          <span>Replay</span>
        </div>
      </div>
    );
  }

  // Hero interactive showcase (HomeScreen, Splash, Modals)
  return (
    <div className={`relative ${className}`}>
      <motion.div
        whileHover={{ scale: 1.01 }}
        whileTap={{ scale: 0.98 }}
        onClick={handleTap}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            handleTap();
          }
        }}
        className="w-full p-4 sm:p-5 rounded-3xl bg-gradient-to-r from-[#753BDB]/15 via-[#F04491]/10 to-[#FFD447]/15 border-2 border-[#753BDB]/30 shadow-card cursor-pointer select-none transition-all hover:border-[#753BDB]/60 overflow-hidden relative group"
        aria-label="Interactive Playful Brand Slogan: Play Nice? Never. Tap to animate."
      >
        {/* Subtle decorative background glow */}
        <div className="absolute -right-8 -top-8 w-28 h-28 bg-[#FFD447]/20 rounded-full blur-2xl pointer-events-none" />
        <div className="absolute -left-8 -bottom-8 w-28 h-28 bg-[#F04491]/20 rounded-full blur-2xl pointer-events-none" />

        <div className="flex items-center justify-between gap-3 relative z-10">
          {/* Left: Mascot with facial expressions */}
          <div className="flex items-center gap-3.5">
            <div className="relative">
              <motion.div
                animate={
                  phase === 'asking'
                    ? { rotate: [-8, 8, -6], scale: [1, 1.1, 1.05] }
                    : phase === 'pause'
                    ? { y: [0, -3, 0], scale: 1 }
                    : { rotate: [0, -12, 12, -8, 8, 0], scale: [1, 1.25, 1.15, 1] }
                }
                transition={{ duration: phase === 'revealed' ? 0.7 : 0.4 }}
                className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-gradient-to-tr from-[#753BDB] to-[#F04491] flex items-center justify-center text-3xl sm:text-4xl shadow-playful border-2 border-white text-white shrink-0"
              >
                {phase === 'asking' && (
                  <span className="drop-shadow-sm" role="img" aria-label="Curious Mascot">
                    🦊
                  </span>
                )}
                {phase === 'pause' && (
                  <span className="drop-shadow-sm" role="img" aria-label="Thinking Mascot">
                    🤔
                  </span>
                )}
                {(phase === 'revealed' || phase === 'idle') && (
                  <span className="drop-shadow-sm" role="img" aria-label="Cheeky Mascot">
                    😈
                  </span>
                )}
              </motion.div>

              {/* Expression accessory badge */}
              <motion.span
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 1.5, repeat: Infinity }}
                className="absolute -top-2 -right-1 text-sm bg-white rounded-full px-1 shadow-sm border border-[#EAE1F0]"
              >
                {phase === 'asking' ? '❓' : phase === 'pause' ? '🤫' : '✨'}
              </motion.span>
            </div>

            {/* Middle: Signature Catchphrase Typography */}
            <div className="text-left">
              <div className="text-[11px] font-heading font-black uppercase tracking-widest text-[#753BDB] flex items-center gap-1 mb-0.5">
                <Sparkles className="w-3 h-3 text-[#FFD447]" />
                <span>The Playful Signature</span>
              </div>

              <div className="min-h-[32px] flex items-center">
                <AnimatePresence mode="wait">
                  {phase === 'asking' && (
                    <motion.div
                      key="asking"
                      initial={{ opacity: 0, y: 6, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -6 }}
                      transition={{ duration: 0.2 }}
                      className="font-heading font-black text-xl sm:text-2xl text-[#302044] tracking-tight flex items-center gap-1.5"
                    >
                      <span>PLAY NICE?</span>
                      <span className="text-lg">👀</span>
                    </motion.div>
                  )}

                  {phase === 'pause' && (
                    <motion.div
                      key="pause"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="flex items-center gap-1.5 py-1"
                    >
                      <span className="w-2 h-2 rounded-full bg-[#753BDB] animate-bounce" />
                      <span className="w-2 h-2 rounded-full bg-[#F04491] animate-bounce [animation-delay:0.15s]" />
                      <span className="w-2 h-2 rounded-full bg-[#FF7139] animate-bounce [animation-delay:0.3s]" />
                    </motion.div>
                  )}

                  {(phase === 'revealed' || phase === 'idle') && (
                    <motion.div
                      key="revealed"
                      initial={{ opacity: 0, scale: 0.85, y: 4 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      transition={{ type: 'spring', stiffness: 450, damping: 20 }}
                      className="flex items-center flex-wrap gap-1 sm:gap-1.5"
                    >
                      <span className="font-heading font-black text-base sm:text-lg text-[#796D87] line-through decoration-[#F04491] decoration-2">
                        PLAY NICE?
                      </span>
                      <motion.span
                        animate={{
                          scale: [1, 1.15, 1],
                          rotate: [0, -3, 3, 0],
                        }}
                        transition={{ duration: 0.6 }}
                        className="font-heading font-black text-xl sm:text-2xl bg-gradient-to-r from-[#F04491] via-[#FF7139] to-[#753BDB] bg-clip-text text-transparent drop-shadow-sm"
                      >
                        NEVERRRR!
                      </motion.span>
                      <span className="text-2xl animate-spin [animation-iteration-count:1]">
                        😈
                      </span>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <div className="text-[11px] text-[#796D87] font-medium mt-0.5 flex items-center gap-1">
                <span>Tap slogan to replay cheer & confetti</span>
                <span className="text-xs">🎉</span>
              </div>
            </div>
          </div>

          {/* Right: Replay Action Pill */}
          <div className="shrink-0 flex flex-col items-end gap-1">
            <div className="px-3 py-1.5 rounded-full bg-white text-[#753BDB] font-heading font-extrabold text-xs shadow-xs border border-[#EAE1F0] flex items-center gap-1 group-hover:bg-[#F2EAFE] transition-colors">
              <RotateCcw className={`w-3.5 h-3.5 ${isPlaying ? 'animate-spin' : ''}`} />
              <span className="hidden sm:inline">Replay</span>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
