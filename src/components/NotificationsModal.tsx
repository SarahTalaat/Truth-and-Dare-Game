import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Bell, Flame, Sparkles, CheckCheck } from 'lucide-react';
import { useGame } from '../context/GameContext';

interface NotificationsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const NotificationsModal: React.FC<NotificationsModalProps> = ({
  isOpen,
  onClose,
}) => {
  const { playSound, profile } = useGame();

  const NOTIFICATIONS = [
    {
      id: 'n1',
      title: 'Daily Streak Active!',
      desc: `You’re on a ${profile.streakDays}-day streak. Play today’s challenge to keep your flame burning!`,
      time: 'Today',
      icon: <Flame className="w-4 h-4 text-[#FF7139]" />,
      bg: 'bg-[#FF7139]/10'
    },
    {
      id: 'n2',
      title: 'New Pack: After Dark Confessions',
      desc: 'Late night spicy truths & wild dares for adults (18+) just dropped in the Marketplace.',
      time: 'Yesterday',
      icon: <Sparkles className="w-4 h-4 text-[#753BDB]" />,
      bg: 'bg-[#F2EAFE]'
    },
    {
      id: 'n3',
      title: 'Weekend Game Night Reminder',
      desc: 'Invite your friends over and try the new unhinged party challenge decks!',
      time: '3d ago',
      icon: <Bell className="w-4 h-4 text-[#48BDEB]" />,
      bg: 'bg-[#48BDEB]/10'
    }
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#302044]/60 backdrop-blur-sm">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="w-full max-w-sm bg-white border border-[#EAE1F0] rounded-3xl p-6 shadow-2xl relative text-left"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-xl bg-[#F2EAFE] text-[#753BDB]">
                  <Bell className="w-4 h-4" />
                </div>
                <h3 className="font-heading font-extrabold text-base text-[#302044]">
                  Activity & Alerts
                </h3>
              </div>
              <button
                type="button"
                onClick={() => {
                  playSound('tap');
                  onClose();
                }}
                className="p-1 rounded-full bg-[#F2EAFE] text-[#796D87] hover:text-[#302044]"
                aria-label="Close"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-2.5 mb-5">
              {NOTIFICATIONS.map(n => (
                <div
                  key={`notif-item-${n.id}`}
                  className="p-3 rounded-2xl bg-[#FFF9F5] border border-[#EAE1F0] flex items-start gap-3"
                >
                  <div className={`p-2 rounded-xl shrink-0 ${n.bg}`}>
                    {n.icon}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-0.5">
                      <h4 className="font-heading font-bold text-xs text-[#302044]">
                        {n.title}
                      </h4>
                      <span className="text-[10px] text-[#796D87]">{n.time}</span>
                    </div>
                    <p className="text-[11px] text-[#796D87] leading-relaxed">
                      {n.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <button
              type="button"
              onClick={() => {
                playSound('tap');
                onClose();
              }}
              className="w-full py-3 rounded-full bg-[#753BDB] text-white font-heading font-bold text-xs shadow-md active:scale-98 transition-transform"
            >
              Mark All Read
            </button>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
