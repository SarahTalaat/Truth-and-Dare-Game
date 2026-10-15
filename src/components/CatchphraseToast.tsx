import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { soundManager } from '../utils/sound';
import { useGame } from '../context/GameContext';
import confetti from 'canvas-confetti';

export type CatchphraseId =
  | 'play_nice_never'
  | 'uh_oh_playful'
  | 'yay'
  | 'wow'
  | 'no_way'
  | 'one_more_obviously';

export interface CatchphraseDef {
  id: CatchphraseId;
  phrase: string;
  face: string;
  secondaryEmoji: string;
  gradient: string;
  textColor: string;
  borderColor: string;
  soundMethod: 'catchphrase' | 'uhoh' | 'cheer' | 'surprise' | 'onemore';
  vibe: string;
}

export const CATCHPHRASES: Record<CatchphraseId, CatchphraseDef> = {
  play_nice_never: {
    id: 'play_nice_never',
    phrase: 'PLAY NICE? NEVER. 😈',
    face: '😈',
    secondaryEmoji: '👑',
    gradient: 'from-[#753BDB] via-[#F04491] to-[#FF7139]',
    textColor: 'text-white',
    borderColor: 'border-white/40',
    soundMethod: 'catchphrase',
    vibe: 'Signature chaos!',
  },
  uh_oh_playful: {
    id: 'uh_oh_playful',
    phrase: 'UH-OH… PLAYFUL!',
    face: '🤭',
    secondaryEmoji: '🔥',
    gradient: 'from-[#FF7139] to-[#FFD447]',
    textColor: 'text-[#302044]',
    borderColor: 'border-[#FF7139]/30',
    soundMethod: 'uhoh',
    vibe: 'Someone is in the hot seat!',
  },
  yay: {
    id: 'yay',
    phrase: 'YAAAAAY!',
    face: '🥳',
    secondaryEmoji: '🎉',
    gradient: 'from-[#753BDB] to-[#F04491]',
    textColor: 'text-white',
    borderColor: 'border-white/30',
    soundMethod: 'cheer',
    vibe: 'Challenge crushed!',
  },
  wow: {
    id: 'wow',
    phrase: 'WOOOOW!',
    face: '🤩',
    secondaryEmoji: '✨',
    gradient: 'from-[#48BDEB] via-[#753BDB] to-[#F04491]',
    textColor: 'text-white',
    borderColor: 'border-[#48BDEB]/40',
    soundMethod: 'surprise',
    vibe: 'Did they really confess that?!',
  },
  no_way: {
    id: 'no_way',
    phrase: 'NO WAYYYY!',
    face: '😱',
    secondaryEmoji: '💥',
    gradient: 'from-[#FF7139] to-[#F04491]',
    textColor: 'text-white',
    borderColor: 'border-[#FF7139]/40',
    soundMethod: 'surprise',
    vibe: 'The room was not ready!',
  },
  one_more_obviously: {
    id: 'one_more_obviously',
    phrase: 'ONE MORE? OBVIOUSLY!',
    face: '😏',
    secondaryEmoji: '🔄',
    gradient: 'from-[#36B77A] via-[#48BDEB] to-[#753BDB]',
    textColor: 'text-white',
    borderColor: 'border-white/30',
    soundMethod: 'onemore',
    vibe: 'Nobody quits while having this much fun!',
  },
};

export const triggerCatchphrase = (id: CatchphraseId) => {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('playful-catchphrase', { detail: { id } }));
  }
};

interface ActiveToast {
  instanceId: string;
  def: CatchphraseDef;
}

export const CatchphraseToast: React.FC = () => {
  const { profile } = useGame();
  const [activeToast, setActiveToast] = useState<ActiveToast | null>(null);

  useEffect(() => {
    const handleCatchphrase = (e: Event) => {
      const customEvent = e as CustomEvent<{ id: CatchphraseId }>;
      const id = customEvent.detail?.id || 'play_nice_never';
      const def = CATCHPHRASES[id] || CATCHPHRASES.play_nice_never;

      // Play matching audio
      if (profile.soundEnabled) {
        switch (def.soundMethod) {
          case 'catchphrase':
            soundManager.playCatchphraseReveal(true);
            break;
          case 'uhoh':
            soundManager.playUhOhPlayful(true);
            break;
          case 'cheer':
            soundManager.playCheer(true);
            break;
          case 'surprise':
            soundManager.playSurprisePop(true);
            break;
          case 'onemore':
            soundManager.playOneMoreObviously(true);
            break;
        }
      }

      soundManager.triggerHaptic(profile.hapticEnabled);

      if (id === 'play_nice_never' || id === 'yay') {
        confetti({
          particleCount: 35,
          spread: 60,
          origin: { y: 0.25 },
          colors: ['#753BDB', '#F04491', '#FF7139', '#FFD447', '#48BDEB'],
          disableForReducedMotion: true,
        });
      }

      const instanceId = `${Date.now()}-${Math.random()}`;
      setActiveToast({ instanceId, def });

      setTimeout(() => {
        setActiveToast((current) => (current?.instanceId === instanceId ? null : current));
      }, 2000);
    };

    window.addEventListener('playful-catchphrase', handleCatchphrase);
    return () => {
      window.removeEventListener('playful-catchphrase', handleCatchphrase);
    };
  }, [profile.soundEnabled, profile.hapticEnabled]);

  return (
    <div className="fixed top-4 left-0 right-0 z-50 pointer-events-none flex justify-center px-4 max-w-lg mx-auto">
      <AnimatePresence>
        {activeToast && (
          <motion.div
            key={activeToast.instanceId}
            initial={{ opacity: 0, y: -30, scale: 0.85, rotate: -2 }}
            animate={{
              opacity: 1,
              y: 0,
              scale: 1,
              rotate: 0,
              transition: { type: 'spring', damping: 15, stiffness: 350 },
            }}
            exit={{ opacity: 0, y: -20, scale: 0.9, transition: { duration: 0.2 } }}
            onClick={() => setActiveToast(null)}
            className={`pointer-events-auto cursor-pointer px-4 py-2.5 rounded-full bg-gradient-to-r ${activeToast.def.gradient} shadow-2xl border-2 ${activeToast.def.borderColor} flex items-center gap-3 backdrop-blur-md`}
          >
            {/* Mascot facial expression with unique motion */}
            <motion.div
              animate={{
                rotate: [0, -12, 12, -8, 8, 0],
                scale: [1, 1.25, 1],
              }}
              transition={{ duration: 0.7 }}
              className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-xs flex items-center justify-center text-2xl border border-white/40 shadow-xs shrink-0"
            >
              <span className="drop-shadow-xs">{activeToast.def.face}</span>
            </motion.div>

            {/* Catchphrase Text lockup */}
            <div className="text-left pr-1">
              <div
                className={`font-heading font-black text-sm sm:text-base tracking-tight ${activeToast.def.textColor} drop-shadow-xs leading-none`}
              >
                {activeToast.def.phrase}
              </div>
              <div className="text-[10px] font-bold text-white/90 leading-tight mt-0.5">
                {activeToast.def.vibe}
              </div>
            </div>

            <span className="text-lg animate-bounce pl-1">
              {activeToast.def.secondaryEmoji}
            </span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
