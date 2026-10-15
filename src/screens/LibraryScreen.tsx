import React, { useState } from 'react';
import { 
  Heart, 
  Layers, 
  ShoppingBag, 
  History, 
  RotateCw, 
  Trash2, 
  Play, 
  Sparkles, 
  Calendar, 
  Users, 
  Check, 
  Search 
} from 'lucide-react';
import { useGame } from '../context/GameContext';
import { HeaderBar } from '../components/HeaderBar';
import { PackDetailModal } from '../components/PackDetailModal';
import { ConfirmModal } from '../components/ConfirmModal';
import { Stats } from '../components/Stats';

export const LibraryScreen: React.FC = () => {
  const {
    packs,
    profile,
    gameHistory,
    deleteHistoryItem,
    clearAllHistory,
    startNewGame,
    setSelectedPackDetailId,
    playSound,
    setCurrentScreen,
  } = useGame();

  const [activeTab, setActiveTab] = useState<'favorites' | 'my_packs' | 'purchased' | 'history'>('favorites');
  const [searchQuery, setSearchQuery] = useState('');
  const [historyToDeleteId, setHistoryToDeleteId] = useState<string | null>(null);
  const [showClearHistoryConfirm, setShowClearHistoryConfirm] = useState(false);
  const [restoreNotice, setRestoreNotice] = useState<string | null>(null);

  const favoritePacks = packs.filter(p => profile.favoritePackIds.includes(p.id));
  const customPacks = packs.filter(p => !!p.isCustom);
  const purchasedPacks = packs.filter(p => p.isPremium && p.isUnlocked);

  const handleRestorePurchases = () => {
    playSound('sparkle');
    setRestoreNotice('All demo unlocked packs have been restored locally!');
    setTimeout(() => setRestoreNotice(null), 3000);
  };

  return (
    <div className="min-h-screen bg-[#FFF9F5] text-[#302044] pb-24 max-w-lg mx-auto">
      <HeaderBar title="My Library" showSoundToggle />

      <div className="px-4 py-3 space-y-4 text-left">
        {/* Restore demo notification */}
        {restoreNotice && (
          <div className="p-3 rounded-2xl bg-[#36B77A]/15 border border-[#36B77A] text-xs font-bold text-[#36B77A] text-center flex items-center justify-center gap-2">
            <Check className="w-4 h-4" />
            <span>{restoreNotice}</span>
          </div>
        )}

        {/* 4 Tabs: Favorites, My Packs, Purchased, History */}
        <div className="grid grid-cols-4 gap-1 p-1 bg-white rounded-full border border-[#EAE1F0] shadow-sm text-center">
          {[
            { id: 'favorites', label: 'Favorites', icon: Heart },
            { id: 'my_packs', label: 'My Packs', icon: Layers },
            { id: 'purchased', label: 'Purchased', icon: ShoppingBag },
            { id: 'history', label: 'History', icon: History },
          ].map(tab => {
            const Icon = tab.icon;
            const isSelected = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => {
                  playSound('tap');
                  setActiveTab(tab.id as typeof activeTab);
                }}
                className={`py-2 px-1 rounded-full text-[11px] font-heading font-extrabold flex flex-col items-center justify-center gap-0.5 transition-all ${
                  isSelected
                    ? 'bg-gradient-to-r from-[#753BDB] to-[#F04491] text-white shadow-sm'
                    : 'text-[#796D87] hover:text-[#302044]'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* TAB 1: FAVORITES */}
        {activeTab === 'favorites' && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-[#796D87]">
                Saved Favorites ({favoritePacks.length})
              </span>
            </div>

            {favoritePacks.length === 0 ? (
              <div className="text-center py-12 px-4 rounded-3xl bg-white border border-[#EAE1F0] shadow-card">
                <Heart className="w-8 h-8 mx-auto mb-2 text-[#F04491]" />
                <h5 className="font-heading font-extrabold text-sm text-[#302044] mb-1">
                  No favorite decks yet
                </h5>
                <p className="text-xs text-[#796D87] mb-4">
                  Tap the heart icon on any deck in Explore to add it to your quick collection!
                </p>
                <button
                  onClick={() => setCurrentScreen('main_tabs')}
                  className="py-2.5 px-5 rounded-full bg-[#753BDB] text-white font-heading font-bold text-xs"
                >
                  Explore Decks
                </button>
              </div>
            ) : (
              favoritePacks.map((pack, idx) => (
                <div
                  key={`fav-pack-${pack.id}-${idx}`}
                  onClick={() => {
                    playSound('tap');
                    setSelectedPackDetailId(pack.id);
                  }}
                  className="p-3.5 rounded-3xl bg-white border border-[#EAE1F0] hover:border-[#753BDB] cursor-pointer shadow-card flex items-center justify-between"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-12 h-12 rounded-2xl bg-gradient-to-tr ${pack.coverGradient} flex items-center justify-center text-2xl text-white shadow-sm`}
                    >
                      {pack.coverSticker || '🎉'}
                    </div>
                    <div>
                      <h5 className="font-heading font-bold text-sm text-[#302044]">
                        {pack.title}
                      </h5>
                      <span className="text-[11px] text-[#796D87]">
                        {pack.promptCount} cards · By {pack.creator.name}
                      </span>
                    </div>
                  </div>

                  <span className="text-xs font-bold text-[#753BDB]">Play →</span>
                </div>
              ))
            )}
          </div>
        )}

        {/* TAB 2: MY PACKS */}
        {activeTab === 'my_packs' && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-[#796D87]">
                Custom Decks ({customPacks.length})
              </span>
            </div>

            {customPacks.length === 0 ? (
              <div className="text-center py-12 px-4 rounded-3xl bg-white border border-[#EAE1F0] shadow-card">
                <Layers className="w-8 h-8 mx-auto mb-2 text-[#753BDB]" />
                <h5 className="font-heading font-extrabold text-sm text-[#302044] mb-1">
                  No custom decks created
                </h5>
                <p className="text-xs text-[#796D87] mb-4">
                  Build custom truth questions and wild dares customized with your own friends' inside jokes!
                </p>
              </div>
            ) : (
              customPacks.map((pack, idx) => (
                <div
                  key={`custom-pack-${pack.id}-${idx}`}
                  onClick={() => {
                    playSound('tap');
                    setSelectedPackDetailId(pack.id);
                  }}
                  className="p-3.5 rounded-3xl bg-white border border-[#EAE1F0] hover:border-[#753BDB] cursor-pointer shadow-card flex items-center justify-between"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-12 h-12 rounded-2xl bg-gradient-to-tr ${pack.coverGradient} flex items-center justify-center text-2xl text-white shadow-sm`}
                    >
                      {pack.coverSticker || '🎉'}
                    </div>
                    <div>
                      <h5 className="font-heading font-bold text-sm text-[#302044]">
                        {pack.title}
                      </h5>
                      <span className="text-[11px] text-[#796D87]">
                        {pack.promptCount} cards · Custom Created
                      </span>
                    </div>
                  </div>

                  <span className="text-xs font-bold text-[#753BDB]">Play →</span>
                </div>
              ))
            )}
          </div>
        )}

        {/* TAB 3: PURCHASED PACKS & STORE */}
        {activeTab === 'purchased' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-[#796D87]">
                Unlocked Premium Packs ({purchasedPacks.length})
              </span>
              <button
                onClick={handleRestorePurchases}
                className="text-[11px] font-bold text-[#753BDB] hover:underline"
              >
                Restore Purchases
              </button>
            </div>

            {purchasedPacks.length === 0 ? (
              <div className="text-center py-12 px-4 rounded-3xl bg-white border border-[#EAE1F0] shadow-card">
                <ShoppingBag className="w-8 h-8 mx-auto mb-2 text-[#FF7139]" />
                <h5 className="font-heading font-extrabold text-sm text-[#302044] mb-1">
                  No premium decks unlocked yet
                </h5>
                <p className="text-xs text-[#796D87] mb-4">
                  Check out the Marketplace to unlock premium decks with our free demo checkout!
                </p>
              </div>
            ) : (
              purchasedPacks.map((pack, idx) => (
                <div
                  key={`purchased-pack-${pack.id}-${idx}`}
                  onClick={() => {
                    playSound('tap');
                    setSelectedPackDetailId(pack.id);
                  }}
                  className="p-3.5 rounded-3xl bg-white border border-[#EAE1F0] hover:border-[#753BDB] cursor-pointer shadow-card flex items-center justify-between"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-12 h-12 rounded-2xl bg-gradient-to-tr ${pack.coverGradient} flex items-center justify-center text-2xl text-white shadow-sm`}
                    >
                      {pack.coverSticker || '🎉'}
                    </div>
                    <div>
                      <h5 className="font-heading font-bold text-sm text-[#302044]">
                        {pack.title}
                      </h5>
                      <span className="text-[11px] text-[#36B77A] font-bold">
                        ✓ Unlocked ({pack.price || 'Free Demo'})
                      </span>
                    </div>
                  </div>

                  <span className="text-xs font-bold text-[#753BDB]">Play →</span>
                </div>
              ))
            )}
          </div>
        )}

        {/* TAB 4: SESSION HISTORY (Prompt 6) */}
        {activeTab === 'history' && (
          <div className="space-y-3">
            {/* Core Stats Overview */}
            <Stats variant="compact" title="Gameplay Milestones" showShare={false} className="mb-2" />

            <div className="flex items-center justify-between pt-1">
              <span className="text-xs font-bold uppercase tracking-wider text-[#796D87]">
                Game Sessions ({gameHistory.length})
              </span>
              {gameHistory.length > 0 && (
                <button
                  onClick={() => setShowClearHistoryConfirm(true)}
                  className="text-[11px] font-bold text-[#E95757] hover:underline"
                >
                  Clear History
                </button>
              )}
            </div>

            {gameHistory.length === 0 ? (
              <div className="text-center py-12 px-4 rounded-3xl bg-white border border-[#EAE1F0] shadow-card">
                <History className="w-8 h-8 mx-auto mb-2 text-[#796D87]" />
                <h5 className="font-heading font-extrabold text-sm text-[#302044] mb-1">
                  No games played yet
                </h5>
                <p className="text-xs text-[#796D87] mb-4">
                  Complete a game of Truth or Dare to save your session highlights and scores here!
                </p>
                <button
                  onClick={() => setCurrentScreen('setup')}
                  className="py-2.5 px-5 rounded-full bg-[#753BDB] text-white font-heading font-bold text-xs"
                >
                  Start New Game
                </button>
              </div>
            ) : (
              gameHistory.map((session, idx) => (
                <div
                  key={`lib-hist-${session.id}-${idx}`}
                  className="p-4 rounded-3xl bg-white border border-[#EAE1F0] shadow-card"
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2 text-xs font-bold text-[#302044]">
                      <Calendar className="w-3.5 h-3.5 text-[#753BDB]" />
                      <span>{session.date}</span>
                      <span>·</span>
                      <span className="capitalize text-[#753BDB]">{session.category}</span>
                    </div>

                    <button
                      onClick={() => setHistoryToDeleteId(session.id)}
                      className="p-1 text-[#796D87] hover:text-[#E95757]"
                      title="Delete session"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div className="flex items-center gap-2 mb-3 text-xs text-[#796D87]">
                    <span>MVP: {session.mvpPlayerAvatar} <strong>{session.mvpPlayerName}</strong></span>
                    <span>·</span>
                    <span>{session.completedTruths}T / {session.completedDares}D</span>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-[#EAE1F0]">
                    <div className="flex items-center gap-1.5">
                      {session.players.slice(0, 4).map((p, i) => (
                        <span key={`lib-p-${session.id}-${p.name}-${i}`} className="text-base" title={p.name}>
                          {p.avatar}
                        </span>
                      ))}
                    </div>

                    <button
                      onClick={() => {
                        playSound('tap');
                        startNewGame({ category: session.category });
                      }}
                      className="py-1.5 px-3 rounded-full bg-[#F2EAFE] text-[#753BDB] font-heading font-extrabold text-[11px] flex items-center gap-1 hover:bg-[#EAE1F0]"
                    >
                      <RotateCw className="w-3 h-3" />
                      <span>Replay Mode</span>
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>

      <PackDetailModal />

      {/* Delete Single History Item Modal */}
      <ConfirmModal
        isOpen={!!historyToDeleteId}
        title="Delete session history?"
        description="This will remove this game recap from your library history."
        confirmLabel="Delete"
        isDestructive
        onConfirm={() => {
          if (historyToDeleteId) {
            deleteHistoryItem(historyToDeleteId);
            setHistoryToDeleteId(null);
          }
        }}
        onCancel={() => setHistoryToDeleteId(null)}
      />

      {/* Clear All History Modal */}
      <ConfirmModal
        isOpen={showClearHistoryConfirm}
        title="Clear entire game history?"
        description="All recorded game recaps and scores will be removed."
        confirmLabel="Clear All"
        isDestructive
        onConfirm={() => {
          clearAllHistory();
          setShowClearHistoryConfirm(false);
        }}
        onCancel={() => setShowClearHistoryConfirm(false)}
      />
    </div>
  );
};
