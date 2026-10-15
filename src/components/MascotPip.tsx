import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles } from 'lucide-react';
import { soundManager } from '../utils/sound';
import { triggerReaction } from './ReactionEngine';
import { triggerCatchphrase, CatchphraseId } from './CatchphraseToast';

export interface MascotPipProps {
  mood?: 'happy' | 'excited' | 'daring' | 'surprised' | 'celebrating' | 'cheeky' | 'curious';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showSpeechBubble?: boolean;
  message?: string;
  allowCatchphraseTrigger?: boolean;
  className?: string;
}

export const MascotPip: React.FC<MascotPipProps> = ({
  mood = 'cheeky',
  size = 'md',
  showSpeechBubble = false,
  message = 'PLAY NICE? NEVER. 😈',
  allowCatchphraseTrigger = true,
  className = '',
}) => {
  const [isTapped, setIsTapped] = useState(false);
  const [currentMood, setCurrentMood] = useState(mood);
  const [bubbleMessage, setBubbleMessage] = useState(message);

  const sizeClasses = {
    sm: 'w-12 h-12 text-2xl',
    md: 'w-20 h-20 text-4xl',
    lg: 'w-28 h-28 text-5xl',
    xl: 'w-32 h-32 text-6xl',
  };

  const mascotEmojis: Record<string, string> = {
    happy: '🦊',
    excited: '🥳',
    daring: '😎',
    surprised: '😲',
    celebrating: '🎉',
    cheeky: '😈',
    curious: '🤔',
  };

  const handleTap = () => {
    setIsTapped(true);

    if (allowCatchphraseTrigger) {
      // Rotate through contextual catchphrases
      const catchphrases: { id: CatchphraseId; phrase: string; mood: typeof mood }[] = [
        { id: 'play_nice_never', phrase: 'PLAY NICE? NEVER. 😈', mood: 'cheeky' },
        { id: 'uh_oh_playful', phrase: 'UH-OH… PLAYFUL!', mood: 'curious' },
        { id: 'yay', phrase: 'YAAAAAY!', mood: 'excited' },
        { id: 'wow', phrase: 'WOOOOW!', mood: 'surprised' },
        { id: 'no_way', phrase: 'NO WAYYYY!', mood: 'daring' },
        { id: 'one_more_obviously', phrase: 'ONE MORE? OBVIOUSLY!', mood: 'celebrating' },
      ];

      const chosen = catchphrases[Math.floor(Math.random() * catchphrases.length)];
      setCurrentMood(chosen.mood);
      setBubbleMessage(chosen.phrase);
      triggerCatchphrase(chosen.id);

      // Also trigger achievement trigger
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('playful-slogan-tapped'));
      }
    } else {
      soundManager.playTap(true);
      triggerReaction('yay');
    }

    setTimeout(() => {
      setIsTapped(false);
      setCurrentMood(mood);
      setBubbleMessage(message);
    }, 2200);
  };

  return (
    <div className={`relative flex items-center justify-center select-none ${className}`}>
      {/* Speech Bubble */}
      {showSpeechBubble && (
        <AnimatePresence>
          <motion.div
            key={bubbleMessage}
            initial={{ opacity: 0, y: 10, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="absolute -top-12 left-1/2 -translate-x-1/2 bg-white px-3.5 py-1.5 rounded-full border border-[#EAE1F0] shadow-md text-xs font-heading font-extrabold text-[#753BDB] whitespace-nowrap flex items-center gap-1 z-20 pointer-events-none"
          >
            <Sparkles className="w-3.5 h-3.5 text-[#FFD447]" />
            <span>{bubbleMessage}</span>
            <div className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-3 h-3 bg-white border-r border-b border-[#EAE1F0] rotate-45" />
          </motion.div>
        </AnimatePresence>
      )}

      {/* Mascot Circle Character */}
      <motion.button
        type="button"
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.92 }}
        onClick={handleTap}
        className={`${sizeClasses[size]} rounded-3xl bg-gradient-to-tr from-[#753BDB] to-[#F04491] flex items-center justify-center shadow-playful relative border-2 border-white/60 cursor-pointer transition-transform`}
        aria-label="Pip the Playful Mascot"
        title="Tap Pip to unleash a catchphrase!"
      >
        {/* Floating party crown badge */}
        <span className="absolute -top-3 -right-2 text-xl transform rotate-12 drop-shadow-xs">
          👑
        </span>

        {/* Mascot Face */}
        <motion.span
          animate={
            isTapped
              ? { rotate: [0, -18, 18, -12, 12, 0], scale: [1, 1.25, 1.1, 1] }
              : { y: [0, -4, 0] }
          }
          transition={
            isTapped
              ? { duration: 0.7 }
              : { duration: 3, repeat: Infinity, ease: 'easeInOut' }
          }
          className="drop-shadow-md"
        >
          {mascotEmojis[currentMood] || '😈'}
        </motion.span>
      </motion.button>
    </div>
  );
};
