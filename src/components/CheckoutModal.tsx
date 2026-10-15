import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, CheckCircle2, ShieldCheck, CreditCard, Sparkles } from 'lucide-react';
import { useGame } from '../context/GameContext';
import { Pack } from '../types/game';

interface CheckoutModalProps {
  isOpen: boolean;
  pack: Pack | null;
  onClose: () => void;
  onSuccess: () => void;
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({
  isOpen,
  pack,
  onClose,
  onSuccess,
}) => {
  const { playSound } = useGame();
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  if (!isOpen || !pack) return null;

  const handlePay = () => {
    playSound('tap');
    setIsProcessing(true);

    setTimeout(() => {
      setIsProcessing(false);
      setIsSuccess(true);
      playSound('complete');
      playSound('sparkle');
      setTimeout(() => {
        setIsSuccess(false);
        onSuccess();
      }, 1000);
    }, 1200);
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
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Simulated Demo Checkout</span>
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

          {isSuccess ? (
            <div className="py-8 text-center">
              <div className="w-16 h-16 mx-auto mb-3 rounded-full bg-[#36B77A]/15 text-[#36B77A] flex items-center justify-center">
                <CheckCircle2 className="w-10 h-10" />
              </div>
              <h3 className="font-heading font-extrabold text-xl text-[#302044] mb-1">
                Pack Unlocked!
              </h3>
              <p className="text-xs text-[#796D87]">
                "{pack.title}" is now added to your Library and ready to play.
              </p>
            </div>
          ) : (
            <>
              <h3 className="font-heading font-extrabold text-xl text-[#302044] mb-1">
                Order Summary
              </h3>
              <p className="text-xs text-[#796D87] mb-4">
                No real payments or credit cards required. This is a prototype checkout.
              </p>

              {/* Pack row */}
              <div className="p-3.5 rounded-2xl bg-[#FFF9F5] border border-[#EAE1F0] flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div
                    className={`w-10 h-10 rounded-xl bg-gradient-to-tr ${pack.coverGradient} flex items-center justify-center text-white text-lg`}
                  >
                    {pack.coverSticker || '🎉'}
                  </div>
                  <div>
                    <h4 className="font-heading font-bold text-sm text-[#302044]">
                      {pack.title}
                    </h4>
                    <span className="text-[11px] text-[#796D87]">
                      {pack.promptCount} Prompts · By {pack.creator.name}
                    </span>
                  </div>
                </div>
                <div className="font-heading font-extrabold text-base text-[#753BDB]">
                  {pack.price || '$2.99'}
                </div>
              </div>

              {/* Demo Payment Method Placeholder */}
              <div className="p-3 rounded-2xl bg-[#F2EAFE]/60 border border-[#EAE1F0] flex items-center gap-3 mb-6">
                <div className="p-2 rounded-xl bg-white text-[#753BDB] shadow-sm">
                  <CreditCard className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-bold text-[#302044]">Demo Test Card</div>
                  <div className="text-[10px] text-[#796D87]">•••• 4242 · Sandbox Mode</div>
                </div>
              </div>

              {/* Pay Button */}
              <button
                onClick={handlePay}
                disabled={isProcessing}
                className="w-full py-4 rounded-full bg-gradient-to-r from-[#753BDB] to-[#F04491] text-white font-heading font-extrabold text-sm shadow-md flex items-center justify-center gap-2 active:scale-98 transition-transform disabled:opacity-60"
              >
                {isProcessing ? (
                  <span>Unlocking Pack...</span>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 text-[#FFD447]" />
                    <span>Confirm Free Demo Unlock ({pack.price || '$2.99'})</span>
                  </>
                )}
              </button>
            </>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
