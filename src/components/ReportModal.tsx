import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Flag, CheckCircle2, AlertTriangle } from 'lucide-react';
import { useGame } from '../context/GameContext';

interface ReportModalProps {
  isOpen: boolean;
  targetTitle: string;
  targetType: 'pack' | 'question' | 'review' | 'creator';
  onClose: () => void;
}

export const ReportModal: React.FC<ReportModalProps> = ({
  isOpen,
  targetTitle,
  targetType,
  onClose,
}) => {
  const { playSound } = useGame();
  const [reason, setReason] = useState('inappropriate');
  const [details, setDetails] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    playSound('tap');
    setIsSubmitted(true);
    setTimeout(() => {
      setIsSubmitted(false);
      onClose();
    }, 1500);
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
            <div className="flex items-center gap-1.5 text-xs font-bold text-[#E95757] bg-[#E95757]/10 px-2.5 py-1 rounded-full">
              <Flag className="w-3.5 h-3.5" />
              <span>Report Content</span>
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

          {isSubmitted ? (
            <div className="py-6 text-center">
              <div className="w-14 h-14 mx-auto mb-3 rounded-full bg-[#36B77A]/15 text-[#36B77A] flex items-center justify-center">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h3 className="font-heading font-extrabold text-lg text-[#302044] mb-1">
                Report Received
              </h3>
              <p className="text-xs text-[#796D87]">
                Thank you for keeping Playful friendly and safe. Our moderation system will review this.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <h3 className="font-heading font-extrabold text-base text-[#302044] mb-1">
                  Report {targetType}:
                </h3>
                <p className="text-xs text-[#796D87] font-semibold truncate">
                  "{targetTitle}"
                </p>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#796D87] mb-2">
                  Select Reason
                </label>
                <div className="space-y-1.5 text-xs">
                  {[
                    { id: 'inappropriate', label: 'Offensive or explicit content' },
                    { id: 'harassment', label: 'Harassment or personal attack' },
                    { id: 'spam', label: 'Spam or misleading information' },
                    { id: 'unsafe', label: 'Unsafe or dangerous challenge' }
                  ].map(opt => (
                    <label
                      key={opt.id}
                      className={`flex items-center gap-2.5 p-2.5 rounded-xl border cursor-pointer transition-colors ${
                        reason === opt.id
                          ? 'bg-[#F2EAFE] border-[#753BDB] text-[#753BDB] font-bold'
                          : 'bg-[#FFF9F5] border-[#EAE1F0] text-[#302044]'
                      }`}
                    >
                      <input
                        type="radio"
                        name="reason"
                        value={opt.id}
                        checked={reason === opt.id}
                        onChange={() => setReason(opt.id)}
                        className="accent-[#753BDB]"
                      />
                      <span>{opt.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#796D87] mb-1.5">
                  Additional Details (Optional)
                </label>
                <textarea
                  rows={2}
                  placeholder="Tell us what felt uncomfortable or wrong..."
                  value={details}
                  onChange={e => setDetails(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-[#FFF9F5] border border-[#EAE1F0] text-xs text-[#302044] placeholder-[#796D87]/60 focus:outline-none focus:border-[#753BDB] resize-none"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3.5 rounded-full bg-gradient-to-r from-[#E95757] to-[#FF7139] text-white font-heading font-extrabold text-sm shadow-md active:scale-98 transition-transform"
              >
                Submit Report
              </button>
            </form>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
