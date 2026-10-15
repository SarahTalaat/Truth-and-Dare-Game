import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  X, 
  Lock, 
  Unlock, 
  Heart, 
  Play, 
  Sparkles, 
  Star, 
  Users, 
  Globe, 
  Layers, 
  Eye, 
  Share2, 
  Flag, 
  ChevronRight,
  HelpCircle,
  Flame
} from 'lucide-react';
import { useGame } from '../context/GameContext';
import { CATEGORIES } from '../data/categories';
import { CheckoutModal } from './CheckoutModal';
import { CreatorProfileModal } from './CreatorProfileModal';
import { ShareModal } from './ShareModal';
import { ReportModal } from './ReportModal';

export const PackDetailModal: React.FC = () => {
  const {
    selectedPackDetailId,
    setSelectedPackDetailId,
    packs,
    profile,
    toggleFavoritePack,
    unlockPack,
    startNewGame,
    playSound,
  } = useGame();

  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [showCheckout, setShowCheckout] = useState(false);
  const [showCreatorProfile, setShowCreatorProfile] = useState(false);
  const [showShare, setShowShare] = useState(false);
  const [reportTarget, setReportTarget] = useState<{ title: string; type: 'pack' | 'review' } | null>(null);

  if (!selectedPackDetailId) return null;

  const pack = packs.find(p => p.id === selectedPackDetailId);
  if (!pack) return null;

  const isFavorite = profile.favoritePackIds.includes(pack.id);
  const categoryInfo = CATEGORIES[pack.category] || CATEGORIES.friends;

  const handleClose = () => {
    playSound('tap');
    setSelectedPackDetailId(null);
  };

  const handlePlayNow = () => {
    playSound('tap');
    setSelectedPackDetailId(null);
    startNewGame({
      category: pack.category,
      selectedPackIds: [pack.id],
    });
  };

  const handleGetPack = () => {
    if (!pack.isPremium) {
      unlockPack(pack.id);
    } else {
      setShowCheckout(true);
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-[#302044]/60 backdrop-blur-sm">
        <motion.div
          initial={{ opacity: 0, y: 100 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 100 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className="w-full max-w-md bg-white border-t sm:border border-[#EAE1F0] rounded-t-3xl sm:rounded-3xl p-6 shadow-2xl relative max-h-[92vh] overflow-y-auto no-scrollbar"
        >
          {/* Top handle bar */}
          <div className="w-10 h-1.5 bg-[#EAE1F0] rounded-full mx-auto mb-4 sm:hidden" />

          {/* Header Controls */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <button
                onClick={() => toggleFavoritePack(pack.id)}
                className={`p-2 rounded-full transition-colors ${
                  isFavorite
                    ? 'bg-[#F04491]/15 text-[#F04491]'
                    : 'bg-[#F2EAFE] text-[#796D87] hover:text-[#302044]'
                }`}
                aria-label={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
              >
                <Heart className="w-5 h-5" fill={isFavorite ? '#F04491' : 'none'} />
              </button>

              <button
                onClick={() => setShowShare(true)}
                className="p-2 rounded-full bg-[#F2EAFE] text-[#796D87] hover:text-[#302044]"
                aria-label="Share pack"
              >
                <Share2 className="w-5 h-5" />
              </button>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setReportTarget({ title: pack.title, type: 'pack' })}
                className="p-2 rounded-full bg-[#F2EAFE] text-[#796D87] hover:text-[#E95757]"
                aria-label="Report pack"
              >
                <Flag className="w-4 h-4" />
              </button>

              <button
                onClick={handleClose}
                className="p-2 rounded-full bg-[#F2EAFE] text-[#796D87] hover:text-[#302044]"
                aria-label="Close"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Pack Banner Cover */}
          <div
            className={`w-full rounded-3xl p-6 mb-5 bg-gradient-to-tr ${pack.coverGradient} shadow-playful relative overflow-hidden text-white`}
          >
            <div className="flex items-center justify-between mb-4">
              <div className="text-3xl bg-white/20 backdrop-blur-md p-2 rounded-2xl">
                {pack.coverSticker || '🎉'}
              </div>
              <div className="flex items-center gap-1.5 text-xs text-white font-bold bg-black/25 backdrop-blur-md px-3 py-1 rounded-full">
                {pack.isUnlocked ? (
                  <>
                    <Unlock className="w-3.5 h-3.5 text-[#FFD447]" />
                    <span>Unlocked</span>
                  </>
                ) : (
                  <>
                    <Lock className="w-3.5 h-3.5 text-white" />
                    <span>{pack.price || 'Premium'}</span>
                  </>
                )}
              </div>
            </div>

            <h2 className="font-heading font-black text-2xl mb-1 text-white">
              {pack.title}
            </h2>

            <div className="flex items-center gap-2 text-xs text-white/90 font-bold">
              <span>{categoryInfo.name}</span>
              <span>·</span>
              <span>{pack.promptCount} Cards</span>
              <span>·</span>
              <span className="flex items-center gap-1">
                <Star className="w-3.5 h-3.5 fill-[#FFD447] text-[#FFD447]" />
                {pack.rating} ({pack.reviewsCount})
              </span>
            </div>
          </div>

          {/* Creator Pill Card */}
          <div
            onClick={() => setShowCreatorProfile(true)}
            className="p-3.5 rounded-2xl bg-[#FFF9F5] border border-[#EAE1F0] hover:border-[#753BDB] cursor-pointer flex items-center justify-between mb-5 transition-all"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#753BDB] to-[#F04491] flex items-center justify-center text-xl text-white shadow-sm">
                {pack.creator.avatar}
              </div>
              <div>
                <div className="text-[10px] font-bold uppercase tracking-wider text-[#796D87]">
                  Pack Creator
                </div>
                <div className="font-heading font-extrabold text-sm text-[#302044]">
                  {pack.creator.name}
                </div>
              </div>
            </div>
            <div className="flex items-center gap-1 text-xs font-bold text-[#753BDB]">
              <span>Profile</span>
              <ChevronRight className="w-4 h-4" />
            </div>
          </div>

          {/* Metadata Specs Grid */}
          <div className="grid grid-cols-3 gap-2 text-center mb-5">
            <div className="p-2.5 rounded-2xl bg-[#F2EAFE]/60 border border-[#EAE1F0]">
              <Users className="w-4 h-4 mx-auto mb-1 text-[#753BDB]" />
              <div className="text-[10px] text-[#796D87]">Players</div>
              <div className="font-heading font-bold text-xs text-[#302044]">
                {pack.minPlayers || 2}-{pack.maxPlayers || 12}
              </div>
            </div>
            <div className="p-2.5 rounded-2xl bg-[#F2EAFE]/60 border border-[#EAE1F0]">
              <Globe className="w-4 h-4 mx-auto mb-1 text-[#48BDEB]" />
              <div className="text-[10px] text-[#796D87]">Language</div>
              <div className="font-heading font-bold text-xs text-[#302044]">
                {pack.language || 'English'}
              </div>
            </div>
            <div className="p-2.5 rounded-2xl bg-[#F2EAFE]/60 border border-[#EAE1F0]">
              <Layers className="w-4 h-4 mx-auto mb-1 text-[#FF7139]" />
              <div className="text-[10px] text-[#796D87]">Total Prompts</div>
              <div className="font-heading font-bold text-xs text-[#302044]">
                {pack.promptCount}
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="mb-5">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#796D87] mb-1.5">
              About This Pack
            </h4>
            <p className="text-xs text-[#302044] leading-relaxed">
              {pack.description}
            </p>
          </div>

          {/* Preview Questions Collapsible Section */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-[#796D87]">
                Sample Cards
              </h4>
              <button
                onClick={() => {
                  playSound('tap');
                  setIsPreviewOpen(!isPreviewOpen);
                }}
                className="text-xs font-bold text-[#753BDB] flex items-center gap-1"
              >
                <Eye className="w-3.5 h-3.5" />
                <span>{isPreviewOpen ? 'Hide Preview' : 'Preview Cards'}</span>
              </button>
            </div>

            {isPreviewOpen ? (
              <div className="space-y-2">
                {pack.samplePrompts.map((sp, idx) => (
                  <div
                    key={idx}
                    className="p-3.5 rounded-2xl bg-[#FFF9F5] border border-[#EAE1F0] text-xs text-[#302044] leading-relaxed"
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <span
                        className={`font-black px-2 py-0.5 rounded-lg text-[10px] uppercase tracking-wider ${
                          sp.type === 'truth'
                            ? 'bg-[#F04491]/15 text-[#F04491]'
                            : 'bg-[#FF7139]/15 text-[#FF7139]'
                        }`}
                      >
                        {sp.type}
                      </span>
                      {sp.hint && (
                        <span className="text-[10px] text-[#796D87] italic">
                          Hint available
                        </span>
                      )}
                    </div>
                    <p className="font-semibold">"{sp.text}"</p>
                    {sp.hint && (
                      <p className="text-[11px] text-[#796D87] mt-1 bg-[#F2EAFE] p-1.5 rounded-lg">
                        💡 {sp.hint}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div
                onClick={() => {
                  playSound('tap');
                  setIsPreviewOpen(true);
                }}
                className="p-3 rounded-2xl bg-[#FFF9F5] border border-[#EAE1F0] text-center cursor-pointer hover:bg-[#F2EAFE]/40"
              >
                <span className="text-xs font-bold text-[#753BDB]">
                  Tap to preview sample truth & dare cards ({pack.samplePrompts.length})
                </span>
              </div>
            )}
          </div>

          {/* User Reviews */}
          {pack.reviews && pack.reviews.length > 0 && (
            <div className="mb-6">
              <h4 className="text-xs font-bold uppercase tracking-wider text-[#796D87] mb-2.5">
                Player Reviews ({pack.reviews.length})
              </h4>
              <div className="space-y-2">
                {pack.reviews.map(rev => (
                  <div
                    key={rev.id}
                    className="p-3 rounded-2xl bg-[#FFF9F5] border border-[#EAE1F0] text-xs"
                  >
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center gap-2">
                        <span>{rev.userAvatar}</span>
                        <span className="font-bold text-[#302044]">{rev.userName}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="flex items-center text-[#FFD447]">
                          {Array.from({ length: rev.rating }).map((_, i) => (
                            <Star key={i} className="w-3 h-3 fill-[#FFD447]" />
                          ))}
                        </div>
                        <button
                          onClick={() => setReportTarget({ title: rev.comment, type: 'review' })}
                          className="text-[#796D87] hover:text-[#E95757]"
                          title="Report review"
                        >
                          <Flag className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                    <p className="text-[#796D87]">{rev.comment}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Primary Action Buttons */}
          <div className="pt-2">
            {pack.isUnlocked ? (
              <button
                onClick={handlePlayNow}
                className="w-full py-4 rounded-full bg-gradient-to-r from-[#753BDB] to-[#F04491] text-white font-heading font-extrabold text-sm shadow-playful flex items-center justify-center gap-2 active:scale-98 transition-transform"
              >
                <Play className="w-4 h-4 fill-white" />
                <span>Start Playing with this Pack</span>
              </button>
            ) : (
              <button
                onClick={handleGetPack}
                className="w-full py-4 rounded-full bg-gradient-to-r from-[#FF7139] to-[#FFD447] text-[#302044] font-heading font-black text-sm shadow-md flex items-center justify-center gap-2 active:scale-98 transition-transform"
              >
                <Unlock className="w-4 h-4" />
                <span>Get Pack · {pack.price || 'Free Demo Unlock'}</span>
              </button>
            )}
          </div>
        </motion.div>
      </div>

      {/* Nested Modals */}
      <CheckoutModal
        isOpen={showCheckout}
        pack={pack}
        onClose={() => setShowCheckout(false)}
        onSuccess={() => {
          unlockPack(pack.id);
          setShowCheckout(false);
        }}
      />

      <CreatorProfileModal
        isOpen={showCreatorProfile}
        creator={pack.creator}
        onClose={() => setShowCreatorProfile(false)}
        onSelectPack={id => {
          setSelectedPackDetailId(id);
        }}
      />

      <ShareModal
        isOpen={showShare}
        title={pack.title}
        text={pack.description}
        onClose={() => setShowShare(false)}
      />

      <ReportModal
        isOpen={!!reportTarget}
        targetTitle={reportTarget?.title || ''}
        targetType={reportTarget?.type || 'pack'}
        onClose={() => setReportTarget(null)}
      />
    </AnimatePresence>
  );
};
