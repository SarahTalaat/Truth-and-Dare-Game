import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X } from 'lucide-react';
import { useGame } from '../context/GameContext';

interface AvatarPickerModalProps {
  isOpen: boolean;
  currentAvatar: string;
  onSelect: (avatar: string) => void;
  onClose: () => void;
}

export const AVATAR_OPTIONS = [
  '🦊', '🐱', '🐼', '🦁', '🦄', '🐯', 
  '🐨', '🐸', '🦉', '🐙', '🥑', '⚡', 
  '🔥', '🍕', '🚀', '⭐', '🌈', '💎'
];

export const AvatarPickerModal: React.FC<AvatarPickerModalProps> = ({
  isOpen,
  currentAvatar,
  onSelect,
  onClose,
}) => {
  const { playSound } = useGame();

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#302044]/50 backdrop-blur-sm">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="w-full max-w-sm bg-white border border-[#EAE1F0] rounded-3xl p-6 shadow-2xl relative"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-heading font-extrabold text-lg text-[#302044]">
              Choose Avatar
            </h3>
            <button
              onClick={() => {
                playSound('tap');
                onClose();
              }}
              className="p-1 rounded-full bg-[#F2EAFE] text-[#796D87] hover:text-[#302044]"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="grid grid-cols-6 gap-2.5 py-2">
            {AVATAR_OPTIONS.map(av => {
              const isSelected = av === currentAvatar;
              return (
                <button
                  key={av}
                  onClick={() => {
                    playSound('tap');
                    onSelect(av);
                    onClose();
                  }}
                  className={`w-11 h-11 text-2xl rounded-2xl flex items-center justify-center transition-all ${
                    isSelected
                      ? 'bg-gradient-to-tr from-[#753BDB] to-[#F04491] ring-2 ring-[#FFD447] scale-110 shadow-md text-white'
                      : 'bg-[#F2EAFE]/60 hover:bg-[#F2EAFE] active:scale-95'
                  }`}
                >
                  {av}
                </button>
              );
            })}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
