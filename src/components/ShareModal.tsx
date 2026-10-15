import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Share2, Copy, Check, MessageSquare, Send } from 'lucide-react';
import { useGame } from '../context/GameContext';

interface ShareModalProps {
  isOpen: boolean;
  title: string;
  text: string;
  onClose: () => void;
}

export const ShareModal: React.FC<ShareModalProps> = ({
  isOpen,
  title,
  text,
  onClose,
}) => {
  const { playSound } = useGame();
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const handleCopy = () => {
    playSound('tap');
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(`${title} - ${text}\nPlay Truth or Dare with Playful!`);
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#302044]/60 backdrop-blur-sm">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="w-full max-w-sm bg-white border border-[#EAE1F0] rounded-3xl p-6 shadow-2xl relative text-left"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-1.5 text-xs font-bold text-[#753BDB] bg-[#F2EAFE] px-2.5 py-1 rounded-full">
              <Share2 className="w-3.5 h-3.5" />
              <span>Share With Friends</span>
            </div>
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

          <h3 className="font-heading font-extrabold text-lg text-[#302044] mb-1">
            {title}
          </h3>
          <p className="text-xs text-[#796D87] mb-4 leading-relaxed">
            "{text}"
          </p>

          {/* Share Channels */}
          <div className="grid grid-cols-3 gap-2.5 mb-4">
            <button
              onClick={handleCopy}
              className="p-3 rounded-2xl bg-[#FFF9F5] border border-[#EAE1F0] hover:border-[#753BDB] flex flex-col items-center justify-center gap-1.5 transition-colors"
            >
              <MessageSquare className="w-5 h-5 text-[#753BDB]" />
              <span className="text-[11px] font-bold text-[#302044]">Messages</span>
            </button>

            <button
              onClick={handleCopy}
              className="p-3 rounded-2xl bg-[#FFF9F5] border border-[#EAE1F0] hover:border-[#F04491] flex flex-col items-center justify-center gap-1.5 transition-colors"
            >
              <Send className="w-5 h-5 text-[#F04491]" />
              <span className="text-[11px] font-bold text-[#302044]">WhatsApp</span>
            </button>

            <button
              onClick={handleCopy}
              className="p-3 rounded-2xl bg-[#FFF9F5] border border-[#EAE1F0] hover:border-[#48BDEB] flex flex-col items-center justify-center gap-1.5 transition-colors"
            >
              <Copy className="w-5 h-5 text-[#48BDEB]" />
              <span className="text-[11px] font-bold text-[#302044]">
                {copied ? 'Copied!' : 'Copy'}
              </span>
            </button>
          </div>

          <button
            onClick={handleCopy}
            className="w-full py-3.5 rounded-full bg-gradient-to-r from-[#753BDB] to-[#F04491] text-white font-heading font-extrabold text-xs shadow-md flex items-center justify-center gap-2 active:scale-98 transition-transform"
          >
            {copied ? (
              <>
                <Check className="w-4 h-4" />
                <span>Link Copied to Clipboard!</span>
              </>
            ) : (
              <>
                <Copy className="w-4 h-4" />
                <span>Copy Shareable Card Link</span>
              </>
            )}
          </button>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
