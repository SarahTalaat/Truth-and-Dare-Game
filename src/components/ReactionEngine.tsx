import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, Heart, Flame, Laugh, Star, Zap } from 'lucide-react';
import confetti from 'canvas-confetti';
import { soundManager } from '../utils/sound';

export type ReactionType = 
  | 'yay' 
  | 'wow' 
  | 'no_way' 
  | 'hahaha' 
  | 'plot_twist' 
  | 'you_did_it' 
  | 'one_more_round'
  | 'play_nice_never'
  | 'uh_oh'
  | 'one_more';

export interface ReactionConfig {
  id: ReactionType;
  label: string;
  emoji: string;
  color: string;
  gradient: string;
  soundType: 'cheer' | 'surprise' | 'giggle' | 'drumroll' | 'fail' | 'sparkle' | 'catchphrase' | 'uhoh' | 'onemore';
  particles: string[];
}

export const REACTIONS: Record<ReactionType, ReactionConfig> = {
  play_nice_never: {
    id: 'play_nice_never',
    label: 'PLAY NICE? NEVER. 😈',
    emoji: '😈',
    color: '#753BDB',
    gradient: 'from-[#753BDB] via-[#F04491] to-[#FF7139]',
    soundType: 'catchphrase',
    particles: ['👑', '✨', '😈']
  },
  uh_oh: {
    id: 'uh_oh',
    label: 'UH-OH… PLAYFUL!',
    emoji: '🤭',
    color: '#FF7139',
    gradient: 'from-[#FF7139] to-[#FFD447]',
    soundType: 'uhoh',
    particles: ['🔥', '👀', '🤭']
  },
  yay: {
    id: 'yay',
    label: 'YAAAAAY!',
    emoji: '🥳',
    color: '#753BDB',
    gradient: 'from-[#753BDB] to-[#F04491]',
    soundType: 'cheer',
    particles: ['🎉', '⭐', '✨']
  },
  wow: {
    id: 'wow',
    label: 'WOOOOW!',
    emoji: '🤩',
    color: '#48BDEB',
    gradient: 'from-[#48BDEB] to-[#753BDB]',
    soundType: 'surprise',
    particles: ['✨', '💫', '🌟']
  },
  no_way: {
    id: 'no_way',
    label: 'NO WAYYYY!',
    emoji: '😱',
    color: '#FF7139',
    gradient: 'from-[#FF7139] to-[#F04491]',
    soundType: 'surprise',
    particles: ['🔥', '💥', '👀']
  },
  one_more: {
    id: 'one_more',
    label: 'ONE MORE? OBVIOUSLY!',
    emoji: '😏',
    color: '#36B77A',
    gradient: 'from-[#36B77A] via-[#48BDEB] to-[#753BDB]',
    soundType: 'onemore',
    particles: ['🔄', '🥂', '💖']
  },
  hahaha: {
    id: 'hahaha',
    label: 'HAHAHA!',
    emoji: '🤣',
    color: '#FFD447',
    gradient: 'from-[#FF7139] to-[#FFD447]',
    soundType: 'giggle',
    particles: ['😂', '💀', '🤣']
  },
  plot_twist: {
    id: 'plot_twist',
    label: 'PLOT TWIST!',
    emoji: '🌀',
    color: '#F04491',
    gradient: 'from-[#753BDB] via-[#48BDEB] to-[#F04491]',
    soundType: 'drumroll',
    particles: ['⚡', '🍿', '🤯']
  },
  you_did_it: {
    id: 'you_did_it',
    label: 'YOU DID IT!',
    emoji: '🏆',
    color: '#36B77A',
    gradient: 'from-[#36B77A] to-[#48BDEB]',
    soundType: 'cheer',
    particles: ['👑', '⭐', '🎊']
  },
  one_more_round: {
    id: 'one_more_round',
    label: 'ONE MORE ROUND?',
    emoji: '🔄',
    color: '#753BDB',
    gradient: 'from-[#FF7139] via-[#FFD447] to-[#F04491]',
    soundType: 'sparkle',
    particles: ['🎲', '🥂', '💖']
  }
};

interface ActiveReaction {
  id: string;
  type: ReactionType;
  x: number;
  y: number;
}

interface ReactionEngineProps {
  soundEnabled?: boolean;
  hapticEnabled?: boolean;
  reducedMotion?: boolean;
}

// Global emitter event so any screen can trigger reactions effortlessly
export const triggerReaction = (type: ReactionType) => {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('playful-reaction', { detail: { type } }));
  }
};

export const ReactionEngine: React.FC<ReactionEngineProps> = ({
  soundEnabled = true,
  hapticEnabled = true,
  reducedMotion = false,
}) => {
  const [activeReactions, setActiveReactions] = useState<ActiveReaction[]>([]);

  useEffect(() => {
    const handleEvent = (e: Event) => {
      const customEvent = e as CustomEvent<{ type: ReactionType }>;
      const type = customEvent.detail.type;
      const config = REACTIONS[type] || REACTIONS.yay;

      // Sound play
      if (soundEnabled) {
        switch (config.soundType) {
          case 'cheer':
            soundManager.playCheer(true);
            break;
          case 'giggle':
            soundManager.playGiggle(true);
            break;
          case 'surprise':
            soundManager.playSurprisePop(true);
            break;
          case 'drumroll':
            soundManager.playDrumroll(true);
            break;
          case 'sparkle':
            soundManager.playSparkle(true);
            break;
          case 'catchphrase':
            soundManager.playCatchphraseReveal(true);
            break;
          case 'uhoh':
            soundManager.playUhOhPlayful(true);
            break;
          case 'onemore':
            soundManager.playOneMoreObviously(true);
            break;
        }
      }

      if (hapticEnabled) {
        soundManager.triggerHaptic(true);
      }

      // Confetti burst for big reactions
      if (!reducedMotion && (type === 'yay' || type === 'you_did_it' || type === 'play_nice_never')) {
        confetti({
          particleCount: 50,
          spread: 65,
          origin: { y: 0.55 },
          colors: ['#753BDB', '#F04491', '#FF7139', '#FFD447', '#48BDEB']
        });
      }

      const id = `${Date.now()}-${Math.random()}`;
      const randomX = (Math.random() - 0.5) * 60; // slight offset
      const newReaction: ActiveReaction = { id, type, x: randomX, y: 0 };

      setActiveReactions(prev => [...prev.slice(-2), newReaction]); // at most 3 concurrently

      setTimeout(() => {
        setActiveReactions(prev => prev.filter(r => r.id !== id));
      }, 1600);
    };

    window.addEventListener('playful-reaction', handleEvent);
    return () => window.removeEventListener('playful-reaction', handleEvent);
  }, [soundEnabled, hapticEnabled, reducedMotion]);

  return (
    <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden flex items-center justify-center">
      <AnimatePresence>
        {activeReactions.map(r => {
          const cfg = REACTIONS[r.type];
          return (
            <motion.div
              key={r.id}
              initial={reducedMotion ? { opacity: 0 } : { scale: 0.3, y: 40, opacity: 0 }}
              animate={reducedMotion ? { opacity: 1 } : { scale: 1.15, y: -40, opacity: 1 }}
              exit={{ scale: 0.8, y: -100, opacity: 0 }}
              transition={{ duration: 0.4, type: 'spring', damping: 12 }}
              style={{ transform: `translateX(${r.x}px)` }}
              className="absolute flex flex-col items-center select-none"
            >
              <div
                className={`px-6 py-3 rounded-full bg-gradient-to-r ${cfg.gradient} text-white font-heading font-black text-xl sm:text-2xl shadow-2xl flex items-center gap-2 border-2 border-white/60`}
              >
                <span className="text-3xl">{cfg.emoji}</span>
                <span className="tracking-wide drop-shadow-sm">{cfg.label}</span>
              </div>

              {/* Floating ambient particle stickers */}
              {!reducedMotion && (
                <div className="flex gap-4 mt-2 text-2xl animate-pulse">
                  {cfg.particles.map((p, idx) => (
                    <span key={`reaction-${r.id}-particle-${idx}-${p}`} style={{ animationDelay: `${idx * 0.1}s` }}>
                      {p}
                    </span>
                  ))}
                </div>
              )}
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
};

// Replay reaction toolbar widget that can be placed on the Game screen for party players
export const ReactionToolbar: React.FC = () => {
  const quickReactions: ReactionType[] = ['play_nice_never', 'yay', 'uh_oh', 'wow', 'no_way'];

  return (
    <div className="flex items-center justify-center gap-1.5 py-1.5 px-3 bg-white/95 backdrop-blur-md rounded-full border border-[#EAE1F0] shadow-sm max-w-fit mx-auto">
      <span className="text-[10px] font-heading font-black text-[#796D87] uppercase tracking-wider pl-1 pr-0.5">
        Catchphrases:
      </span>
      {quickReactions.map(r => {
        const cfg = REACTIONS[r];
        return (
          <button
            key={`quick-react-btn-${r}`}
            type="button"
            onClick={() => triggerReaction(r)}
            className="w-8 h-8 rounded-full hover:scale-125 active:scale-90 transition-transform flex items-center justify-center text-lg hover:bg-[#F2EAFE]"
            title={cfg.label}
            aria-label={cfg.label}
          >
            {cfg.emoji}
          </button>
        );
      })}
    </div>
  );
};
