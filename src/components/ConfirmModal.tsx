import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { AlertCircle } from 'lucide-react';
import { useGame } from '../context/GameContext';

interface ConfirmModalProps {
  isOpen: boolean;
  title: string;
  description: string;
  confirmLabel: string;
  cancelLabel?: string;
  isDestructive?: boolean;
  icon?: React.ReactNode;
  onConfirm: () => void;
  onCancel: () => void;
}

export const ConfirmModal: React.FC<ConfirmModalProps> = ({
  isOpen,
  title,
  description,
  confirmLabel,
  cancelLabel = 'Cancel',
  isDestructive = false,
  icon,
  onConfirm,
  onCancel,
}) => {
  const { playSound } = useGame();

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#302044]/50 backdrop-blur-sm">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            className="w-full max-w-sm bg-white border border-[#EAE1F0] rounded-3xl p-6 shadow-2xl text-center"
          >
            <div className="w-12 h-12 mx-auto mb-4 rounded-2xl bg-[#F2EAFE] flex items-center justify-center text-[#753BDB]">
              {icon || (
                <AlertCircle
                  className={`w-6 h-6 ${
                    isDestructive ? 'text-[#E95757]' : 'text-[#753BDB]'
                  }`}
                />
              )}
            </div>

            <h3 className="font-heading font-extrabold text-lg text-[#302044] mb-2">
              {title}
            </h3>
            <p className="text-sm text-[#796D87] mb-6 leading-relaxed">
              {description}
            </p>

            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => {
                  playSound('tap');
                  onCancel();
                }}
                className="w-full py-3 px-4 rounded-full bg-[#F2EAFE] hover:bg-[#EAE1F0] text-[#302044] font-bold text-sm active:scale-98 transition-all"
              >
                {cancelLabel}
              </button>

              <button
                type="button"
                onClick={() => {
                  playSound('tap');
                  onConfirm();
                }}
                className={`w-full py-3 px-4 rounded-full text-white font-extrabold text-sm active:scale-98 transition-all ${
                  isDestructive
                    ? 'bg-[#E95757] hover:bg-[#d64545]'
                    : 'bg-gradient-to-r from-[#753BDB] to-[#F04491]'
                }`}
              >
                {confirmLabel}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
