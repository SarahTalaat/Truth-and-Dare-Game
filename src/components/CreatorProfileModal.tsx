import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Users, Star, Layers, Check, UserPlus } from 'lucide-react';
import { useGame } from '../context/GameContext';
import { Creator, Pack } from '../types/game';

interface CreatorProfileModalProps {
  isOpen: boolean;
  creator: Creator | null;
  onClose: () => void;
  onSelectPack: (packId: string) => void;
}

export const CreatorProfileModal: React.FC<CreatorProfileModalProps> = ({
  isOpen,
  creator,
  onClose,
  onSelectPack,
}) => {
  const { packs, playSound, toggleFollowCreator } = useGame();

  if (!isOpen || !creator) return null;

  const creatorPacks = packs.filter(p => p.creator.id === creator.id);

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#302044]/60 backdrop-blur-sm">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="w-full max-w-sm bg-white border border-[#EAE1F0] rounded-3xl p-6 shadow-2xl relative text-left max-h-[85vh] overflow-y-auto no-scrollbar"
        >
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-bold text-[#796D87]">Creator Profile</span>
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

          {/* Profile Header */}
          <div className="flex items-center gap-3.5 mb-4">
            <div className="w-16 h-16 rounded-3xl bg-gradient-to-tr from-[#753BDB] to-[#F04491] flex items-center justify-center text-3xl text-white shadow-md">
              {creator.avatar}
            </div>
            <div>
              <h3 className="font-heading font-extrabold text-xl text-[#302044]">
                {creator.name}
              </h3>
              <div className="flex items-center gap-2 text-xs text-[#796D87] mt-0.5">
                <span className="flex items-center gap-1 font-bold text-[#753BDB]">
                  <Users className="w-3.5 h-3.5" />
                  {creator.followersCount.toLocaleString()} followers
                </span>
              </div>
            </div>
          </div>

          <p className="text-xs text-[#796D87] leading-relaxed mb-4">
            {creator.bio}
          </p>

          {/* Follow Button */}
          <button
            onClick={() => {
              toggleFollowCreator(creator.id);
            }}
            className={`w-full py-2.5 px-4 rounded-full font-heading font-bold text-xs flex items-center justify-center gap-1.5 transition-all mb-5 ${
              creator.isFollowed
                ? 'bg-[#F2EAFE] text-[#753BDB] border border-[#753BDB]/20'
                : 'bg-[#753BDB] text-white shadow-sm'
            }`}
          >
            {creator.isFollowed ? (
              <>
                <Check className="w-4 h-4 text-[#753BDB]" />
                <span>Following</span>
              </>
            ) : (
              <>
                <UserPlus className="w-4 h-4" />
                <span>Follow Creator</span>
              </>
            )}
          </button>

          {/* Published Packs */}
          <div>
            <h4 className="font-heading font-bold text-xs uppercase tracking-wider text-[#796D87] mb-2 flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5 text-[#753BDB]" />
              <span>Published Packs ({creatorPacks.length})</span>
            </h4>

            <div className="space-y-2">
              {creatorPacks.map(pack => (
                <div
                  key={pack.id}
                  onClick={() => {
                    onClose();
                    onSelectPack(pack.id);
                  }}
                  className="p-3 rounded-2xl bg-[#FFF9F5] border border-[#EAE1F0] hover:border-[#753BDB]/40 cursor-pointer flex items-center justify-between transition-colors"
                >
                  <div className="flex items-center gap-2.5">
                    <div
                      className={`w-9 h-9 rounded-xl bg-gradient-to-tr ${pack.coverGradient} flex items-center justify-center text-white text-base shadow-sm`}
                    >
                      {pack.coverSticker || '🎉'}
                    </div>
                    <div>
                      <h5 className="font-heading font-bold text-xs text-[#302044]">
                        {pack.title}
                      </h5>
                      <span className="text-[10px] text-[#796D87]">
                        {pack.promptCount} cards · {pack.isPremium ? pack.price : 'Free'}
                      </span>
                    </div>
                  </div>

                  <span className="text-xs text-[#753BDB] font-extrabold">View →</span>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
