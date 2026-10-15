import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  RotateCw, 
  Check, 
  Flame, 
  Trophy, 
  Home, 
  HelpCircle, 
  Dices,
  Forward, 
  Timer as TimerIcon,
  Pause, 
  Play, 
  Lightbulb, 
  Share2, 
  BookmarkCheck, 
  Settings, 
  Sparkles,
  ShieldAlert,
  ShieldCheck,
  ArrowRight,
  Copy,
  CheckCircle2,
  Users,
  Eye,
  Crown,
  Heart
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { useGame } from '../context/GameContext';
import { CATEGORIES } from '../data/categories';
import { ConfirmModal } from '../components/ConfirmModal';
import { HeaderBar } from '../components/HeaderBar';
import { ReactionToolbar, triggerReaction } from '../components/ReactionEngine';
import { BrandCatchphrase } from '../components/BrandCatchphrase';
import { triggerCatchphrase } from '../components/CatchphraseToast';

export const GameScreen: React.FC = () => {
  const {
    session,
    selectGameChoice,
    rerollCurrentPrompt,
    completeCurrentPrompt,
    skipCurrentPrompt,
    exitGameSession,
    startNewGame,
    setCurrentScreen,
    saveSessionToHistory,
    playSound,
  } = useGame();

  const [showSkipConfirm, setShowSkipConfirm] = useState(false);
  const [showExitConfirm, setShowExitConfirm] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [isSavedToHistory, setIsSavedToHistory] = useState(false);
  const [isSpinningChoice, setIsSpinningChoice] = useState(false);
  const [showYourTurnNotice, setShowYourTurnNotice] = useState(true);
  const [hideNamesOnShare, setHideNamesOnShare] = useState(false);
  const [shareCopied, setShareCopied] = useState(false);
  const [showPlayAgainChoice, setShowPlayAgainChoice] = useState(false);

  // Timer states
  const [timeLeft, setTimeLeft] = useState<number>(30);
  const [isTimerRunning, setIsTimerRunning] = useState<boolean>(false);
  const [showHint, setShowHint] = useState<boolean>(false);
  const [uncomfortableNotice, setUncomfortableNotice] = useState(false);

  // Active game session
  useEffect(() => {
    if (session?.settings.timerEnabled) {
      setTimeLeft(session.settings.timerSeconds || 30);
      setIsTimerRunning(false);
    }
  }, [session?.activePrompt?.id, session?.settings.timerEnabled, session?.settings.timerSeconds]);

  // Flash "YOUR TURN 👀" briefly when turn advances
  useEffect(() => {
    setShowYourTurnNotice(true);
    const timer = setTimeout(() => {
      setShowYourTurnNotice(false);
    }, 1200);
    return () => clearTimeout(timer);
  }, [session?.currentPlayerIndex]);

  // Timer interval with cleanup
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (isTimerRunning && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            playSound('skip');
            setIsTimerRunning(false);
            triggerCatchphrase('uh_oh_playful');
            return 0;
          }
          if (prev <= 4) {
            playSound('tap');
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isTimerRunning, timeLeft, playSound]);

  if (!session) {
    return (
      <div className="min-h-screen bg-[#FFF9F5] text-[#302044] flex flex-col items-center justify-center p-6 text-center">
        <p className="mb-4 text-[#796D87]">No active party session found.</p>
        <button
          type="button"
          onClick={() => setCurrentScreen('main_tabs')}
          className="px-6 py-3 rounded-full bg-gradient-to-r from-[#753BDB] to-[#F04491] text-white font-heading font-black text-sm"
        >
          Go to Home
        </button>
      </div>
    );
  }

  const {
    settings,
    currentPlayerIndex,
    currentRound,
    activePrompt,
    step,
    chosenType,
    isCompleted,
  } = session;

  const currentPlayer = settings.players[currentPlayerIndex] || settings.players[0];
  const categoryInfo = CATEGORIES[settings.category] || CATEGORIES.friends;
  const isTruth = chosenType === 'truth';

  const totalRounds = settings.rounds;
  const progressPercent = totalRounds > 0 
    ? Math.min(100, Math.round(((currentRound - 1) / totalRounds) * 100))
    : 100;

  // Check skips remaining for current player
  const playerSkips = currentPlayer?.score?.skips || 0;
  const skipsRemaining = Math.max(0, settings.skipLimit - playerSkips);
  const canSkip = settings.skipLimit >= 99 || skipsRemaining > 0;

  const handleRandomChoice = () => {
    if (isSpinningChoice) return;
    setIsSpinningChoice(true);
    playSound('flip');

    setTimeout(() => {
      const randomType = Math.random() > 0.5 ? 'truth' : 'dare';
      selectGameChoice(randomType);
      setIsSpinningChoice(false);
    }, 600);
  };

  const handleSaveToHistory = () => {
    if (isSavedToHistory) return;
    playSound('sparkle');
    saveSessionToHistory();
    setIsSavedToHistory(true);
  };

  // Safe swap for uncomfortable prompt without penalty
  const handleUncomfortableSwap = () => {
    playSound('tap');
    rerollCurrentPrompt();
    setUncomfortableNotice(true);
    setTimeout(() => setUncomfortableNotice(false), 2600);
  };

  // ----------------------------------------------------
  // RESULTS & GRAND FINALE SCREEN
  // ----------------------------------------------------
  if (isCompleted) {
    const sortedByScore = [...settings.players].sort(
      (a, b) => (b.score.truths + b.score.dares) - (a.score.truths + a.score.dares)
    );
    const topPlayer = sortedByScore[0];
    const dareDevil = [...settings.players].sort((a, b) => b.score.dares - a.score.dares)[0];
    const truthMaster = [...settings.players].sort((a, b) => b.score.truths - a.score.truths)[0];

    const totalSessionTruths = settings.players.reduce((sum, p) => sum + p.score.truths, 0);
    const totalSessionDares = settings.players.reduce((sum, p) => sum + p.score.dares, 0);
    const totalSessionSkips = settings.players.reduce((sum, p) => sum + p.score.skips, 0);

    // Dynamic session achievements earned from actual gameplay
    const sessionAchievements = [];
    if (totalSessionDares >= 5) {
      sessionAchievements.push({ icon: '🔥', title: 'Daredevil Squad', desc: 'Crushed 5+ wild physical challenges' });
    }
    if (totalSessionTruths >= 5) {
      sessionAchievements.push({ icon: '💡', title: 'Deep Confessions', desc: 'Survive 5+ honest revelations' });
    }
    if (totalSessionSkips === 0) {
      sessionAchievements.push({ icon: '🎯', title: 'Zero Fear', desc: 'No one used a skip the entire match!' });
    }
    if (settings.surpriseRounds) {
      sessionAchievements.push({ icon: '🎲', title: 'Plot Twist Masters', desc: 'Conquered surprise bonus rounds' });
    }
    if (sessionAchievements.length === 0) {
      sessionAchievements.push({ icon: '👑', title: 'Brave Souls', desc: 'Completed every round in good party spirits' });
    }

    const handleNativeShare = async () => {
      playSound('sparkle');
      const shareText = `🎉 Playful Truth or Dare Recap!
🏆 Session MVP: ${hideNamesOnShare ? 'Anonymous Player' : topPlayer?.name}
📊 ${totalSessionTruths} Truths Confessed · ${totalSessionDares} Dares Crushed · ${currentRound} Rounds
"PLAY NICE? NEVER. 😈"`;

      if (navigator.share) {
        try {
          await navigator.share({
            title: 'Playful Party Game Recap',
            text: shareText,
          });
          return;
        } catch {
          // Fallback to modal
        }
      }
      setShowShareModal(true);
    };

    return (
      <div className="min-h-screen bg-[#FFF9F5] text-[#302044] p-5 max-w-lg mx-auto flex flex-col justify-between">
        <div className="text-center pt-2">
          {/* Confetti & Celebratory Mascot */}
          <div className="w-20 h-20 mx-auto mb-3 rounded-3xl bg-gradient-to-tr from-[#753BDB] via-[#F04491] to-[#FFD447] flex items-center justify-center text-4xl shadow-playful border-2 border-white">
            <span>🎉</span>
          </div>

          <h2 className="font-heading font-black text-3xl sm:text-4xl text-[#302044] mb-1 tracking-tight">
            THAT WAS ICONIC! 🎉
          </h2>
          <p className="text-xs text-[#796D87] mb-5">
            {currentRound} rounds completed in {categoryInfo.name} mode. Here’s the final party breakdown:
          </p>

          {/* MVP Spotlight Card */}
          {settings.enableScoring !== false ? (
            <div className="p-5 rounded-3xl bg-gradient-to-br from-[#753BDB] to-[#F04491] mb-5 shadow-playful text-center text-white relative border-2 border-white/50">
              <div className="text-4xl mb-1 drop-shadow-sm">{topPlayer?.avatar}</div>
              <div className="font-heading font-black text-2xl text-white">
                {topPlayer?.name}
              </div>
              <div className="text-xs text-[#FFD447] font-heading font-black uppercase tracking-wider mt-0.5">
                👑 Session MVP · {topPlayer ? topPlayer.score.truths + topPlayer.score.dares : 0} Challenges Won
              </div>
            </div>
          ) : (
            <div className="p-4 rounded-3xl bg-gradient-to-br from-[#753BDB] to-[#36B77A] mb-5 shadow-playful text-center text-white">
              <div className="text-3xl mb-1">🥂</div>
              <div className="font-heading font-black text-xl">
                Group Victory!
              </div>
              <p className="text-xs text-white/90">
                You all played with 100% honesty and fearless energy!
              </p>
            </div>
          )}

          {/* Player Highlights & Superlatives */}
          <div className="grid grid-cols-2 gap-2.5 mb-5 text-left">
            <div className="p-3.5 rounded-2xl bg-white border border-[#EAE1F0] shadow-xs">
              <div className="flex items-center gap-1.5 text-xs font-bold text-[#FF7139] mb-1">
                <Flame className="w-3.5 h-3.5" />
                <span>Daredevil</span>
              </div>
              <div className="text-sm font-heading font-black text-[#302044]">
                {dareDevil?.name}
              </div>
              <div className="text-[10px] text-[#796D87]">
                {dareDevil?.score.dares} dares faced
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-white border border-[#EAE1F0] shadow-xs">
              <div className="flex items-center gap-1.5 text-xs font-bold text-[#753BDB] mb-1">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Truth Master</span>
              </div>
              <div className="text-sm font-heading font-black text-[#302044]">
                {truthMaster?.name}
              </div>
              <div className="text-[10px] text-[#796D87]">
                {truthMaster?.score.truths} truths confessed
              </div>
            </div>
          </div>

          {/* Session Real Achievements */}
          <div className="mb-5 text-left">
            <h4 className="text-xs font-heading font-black uppercase tracking-wider text-[#796D87] mb-2 flex items-center gap-1.5">
              <Trophy className="w-3.5 h-3.5 text-[#FFD447]" />
              <span>Session Achievements Earned</span>
            </h4>
            <div className="space-y-1.5">
              {sessionAchievements.map((ach, idx) => (
                <div
                  key={`session-ach-${idx}`}
                  className="p-2.5 rounded-2xl bg-white border border-[#EAE1F0] flex items-center gap-2.5 text-xs shadow-xs"
                >
                  <span className="text-xl">{ach.icon}</span>
                  <div>
                    <span className="font-heading font-black text-[#302044] block">
                      {ach.title}
                    </span>
                    <span className="text-[10px] text-[#796D87]">{ach.desc}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Score breakdown list */}
          <div className="space-y-2 mb-5">
            {sortedByScore.map((p, idx) => (
              <div
                key={`score-row-${p.id}-${idx}`}
                className="flex items-center justify-between p-3 rounded-2xl bg-white border border-[#EAE1F0] text-xs shadow-xs"
              >
                <div className="flex items-center gap-2.5">
                  <span className="font-bold text-[#796D87] tabular-nums">#{idx + 1}</span>
                  <span className="text-xl">{p.avatar}</span>
                  <span className="font-heading font-bold text-[#302044] text-sm">{p.name}</span>
                </div>
                <div className="flex items-center gap-3 font-extrabold">
                  <span className="text-[#F04491]">{p.score.truths} Truths</span>
                  <span className="text-[#FF7139]">{p.score.dares} Dares</span>
                  <span className="text-[#796D87]">{p.score.skips} Skips</span>
                </div>
              </div>
            ))}
          </div>

          {/* Shareable Brand Catchphrase Card Watermark */}
          <div className="mb-5">
            <BrandCatchphrase variant="card" />
          </div>
        </div>

        {/* Results Action Buttons */}
        <div className="space-y-2.5 pb-2">
          {/* PLAY AGAIN Action */}
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => setShowPlayAgainChoice(true)}
              className="py-3.5 rounded-full bg-gradient-to-r from-[#753BDB] to-[#F04491] text-white font-heading font-black text-xs shadow-md flex items-center justify-center gap-2 active:scale-98 transition-transform"
            >
              <RotateCw className="w-4 h-4" />
              <span>PLAY AGAIN</span>
            </button>

            <button
              type="button"
              onClick={() => {
                playSound('tap');
                setCurrentScreen('setup');
              }}
              className="py-3.5 rounded-full bg-white border border-[#EAE1F0] hover:bg-[#F2EAFE] text-[#302044] font-heading font-bold text-xs flex items-center justify-center gap-2 active:scale-98 transition-colors shadow-xs"
            >
              <Settings className="w-4 h-4" />
              <span>Change Settings</span>
            </button>
          </div>

          {/* Save & Share */}
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={handleSaveToHistory}
              disabled={isSavedToHistory}
              className={`py-3.5 rounded-full text-xs font-heading font-bold flex items-center justify-center gap-1.5 transition-all ${
                isSavedToHistory
                  ? 'bg-[#36B77A]/15 text-[#36B77A] border border-[#36B77A]'
                  : 'bg-[#F2EAFE] text-[#753BDB] hover:bg-[#EAE1F0]'
              }`}
            >
              <BookmarkCheck className="w-4 h-4" />
              <span>{isSavedToHistory ? 'Saved to Library ✓' : 'Save Results'}</span>
            </button>

            <button
              type="button"
              onClick={handleNativeShare}
              className="py-3.5 rounded-full bg-white border border-[#EAE1F0] hover:bg-[#F2EAFE] text-[#302044] font-heading font-bold text-xs flex items-center justify-center gap-1.5 shadow-xs active:scale-98 transition-colors"
            >
              <Share2 className="w-4 h-4" />
              <span>Share Results</span>
            </button>
          </div>

          <button
            type="button"
            onClick={() => {
              playSound('tap');
              saveSessionToHistory();
              setCurrentScreen('main_tabs');
            }}
            className="w-full py-3 rounded-full text-[#796D87] hover:text-[#302044] font-heading font-bold text-xs flex items-center justify-center gap-1.5"
          >
            <Home className="w-4 h-4" />
            <span>Go Home</span>
          </button>
        </div>

        {/* Play Again Modal Choice: Same Setup vs Change Players */}
        <ConfirmModal
          isOpen={showPlayAgainChoice}
          title="Play Another Game?"
          description="Do you want to start immediately with the exact same squad & rules, or tweak players & packs?"
          confirmLabel="Restart with Same Setup"
          cancelLabel="Change Players & Packs"
          onConfirm={() => {
            setShowPlayAgainChoice(false);
            playSound('tap');
            startNewGame(settings);
          }}
          onCancel={() => {
            setShowPlayAgainChoice(false);
            setCurrentScreen('setup');
          }}
        />

        {/* Rich Share Card Modal */}
        <AnimatePresence>
          {showShareModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="w-full max-w-sm rounded-3xl bg-white p-5 shadow-2xl relative text-left"
              >
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-heading font-black text-sm text-[#302044]">
                    Shareable Game Card
                  </h4>
                  <button
                    type="button"
                    onClick={() => setShowShareModal(false)}
                    className="p-1 rounded-full text-[#796D87] hover:bg-[#F2EAFE]"
                  >
                    ✕
                  </button>
                </div>

                {/* Visual Share Card */}
                <div className="p-4 rounded-3xl bg-gradient-to-br from-[#753BDB] via-[#F04491] to-[#FF7139] text-white shadow-playful mb-4 relative overflow-hidden">
                  <div className="flex items-center justify-between text-xs mb-3">
                    <span className="font-heading font-black">Playful Party Game</span>
                    <span className="bg-white/20 px-2 py-0.5 rounded-full text-[10px]">
                      {new Date().toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                    </span>
                  </div>

                  <div className="text-center py-2">
                    <span className="text-4xl block mb-1">{topPlayer?.avatar}</span>
                    <div className="font-heading font-black text-xl">
                      {hideNamesOnShare ? 'Party MVP 👑' : `${topPlayer?.name} Won MVP!`}
                    </div>
                    <div className="text-xs text-[#FFD447] font-bold">
                      {categoryInfo.name} Mode · {currentRound} Rounds
                    </div>
                  </div>

                  <div className="mt-3 pt-3 border-t border-white/25 flex items-center justify-between text-[11px] font-bold">
                    <span>{totalSessionTruths} Truths · {totalSessionDares} Dares</span>
                    <span className="font-heading font-black uppercase text-[#FFD447]">
                      PLAY NICE? NEVER. 😈
                    </span>
                  </div>
                </div>

                {/* Privacy Toggle: Hide Player Names */}
                <div className="flex items-center justify-between p-2.5 rounded-2xl bg-[#FFF9F5] border border-[#EAE1F0] mb-4 text-xs">
                  <div>
                    <span className="font-bold text-[#302044] block">Privacy Protection</span>
                    <span className="text-[10px] text-[#796D87]">Hide real names before sharing online</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setHideNamesOnShare(!hideNamesOnShare)}
                    className={`w-9 h-5 rounded-full transition-colors relative p-0.5 ${
                      hideNamesOnShare ? 'bg-[#753BDB]' : 'bg-[#EAE1F0]'
                    }`}
                  >
                    <div
                      className={`w-4 h-4 rounded-full bg-white transition-transform ${
                        hideNamesOnShare ? 'translate-x-4' : 'translate-x-0'
                      }`}
                    />
                  </button>
                </div>

                {/* Copy Text Button */}
                <button
                  type="button"
                  onClick={() => {
                    const text = `🎉 Playful Truth or Dare Recap!
🏆 Session MVP: ${hideNamesOnShare ? 'Party MVP 👑' : topPlayer?.name}
📊 ${totalSessionTruths} Truths · ${totalSessionDares} Dares in ${categoryInfo.name} mode!
"PLAY NICE? NEVER. 😈"`;
                    navigator.clipboard?.writeText(text);
                    setShareCopied(true);
                    playSound('sparkle');
                    setTimeout(() => setShareCopied(false), 2000);
                  }}
                  className="w-full py-3 rounded-full bg-[#753BDB] text-white font-heading font-black text-xs flex items-center justify-center gap-1.5 shadow-md active:scale-98 transition-transform"
                >
                  {shareCopied ? (
                    <>
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Copied to Clipboard! ✓</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4" />
                      <span>Copy Recap Text</span>
                    </>
                  )}
                </button>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </div>
    );
  }

  // ----------------------------------------------------
  // ACTIVE GAMEPLAY SCREEN
  // ----------------------------------------------------
  return (
    <div className="min-h-screen bg-[#FFF9F5] text-[#302044] flex flex-col justify-between max-w-lg mx-auto">
      {/* Top Header */}
      <HeaderBar
        showBack
        onBack={() => setShowExitConfirm(true)}
        title={categoryInfo.name}
        rightAction={
          <div className="text-xs font-heading font-extrabold text-[#753BDB] bg-[#F2EAFE] px-3 py-1.5 rounded-full border border-[#EAE1F0] tabular-nums">
            {totalRounds > 0 ? `Round ${currentRound}/${totalRounds}` : `Round ${currentRound}`}
          </div>
        }
      />

      {/* Round Progress Bar */}
      {totalRounds > 0 && (
        <div className="w-full bg-[#EAE1F0] h-1.5">
          <div
            className="bg-gradient-to-r from-[#753BDB] via-[#F04491] to-[#FFD447] h-1.5 transition-all duration-300"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      )}

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col justify-between px-4 py-3">
        {/* Animated Turn Indicator Banner */}
        <div className="text-center pt-1 mb-2">
          <motion.div
            key={`player-banner-${currentPlayer.id}`}
            initial={{ scale: 0.85, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="inline-flex items-center gap-3 p-2 px-4 rounded-full bg-white border border-[#EAE1F0] shadow-sm mb-1"
          >
            <div className="text-2xl">{currentPlayer.avatar}</div>
            <div className="text-left">
              <span className="text-[10px] text-[#796D87] font-bold block flex items-center gap-1">
                <span>Current Turn</span>
                {showYourTurnNotice && (
                  <span className="text-[#FF7139] font-black animate-pulse">
                    · YOUR TURN 👀
                  </span>
                )}
              </span>
              <span className="font-heading font-black text-sm text-[#302044]">
                {currentPlayer.name}
              </span>
            </div>

            {settings.enableScoring !== false && (
              <div className="ml-2 pl-3 border-l border-[#EAE1F0] text-[10px] text-[#796D87]">
                Score: <strong className="text-[#753BDB]">{currentPlayer.score.truths + currentPlayer.score.dares}</strong>
              </div>
            )}
            <div className="pl-2 border-l border-[#EAE1F0] text-[10px] text-[#796D87]">
              Skips: <strong className="text-[#FF7139]">{settings.skipLimit >= 99 ? '♾️' : skipsRemaining}</strong>
            </div>
          </motion.div>
        </div>

        {/* STEP 1: CHOICE STATE (TRUTH vs DARE) */}
        {step === 'choice' && (
          <div className="my-auto py-4 flex flex-col items-center">
            <div className="text-center mb-6">
              <h4 className="font-heading font-black text-2xl text-[#302044] mb-1">
                Truth or Dare?
              </h4>
              <p className="text-xs text-[#796D87]">
                Choose your destiny or spin the lucky wheel
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4 w-full max-w-sm mb-5">
              {/* TRUTH BUTTON */}
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => selectGameChoice('truth')}
                className="h-48 rounded-3xl p-5 bg-gradient-to-br from-[#F04491] to-[#FF7139] shadow-playful flex flex-col justify-between text-left relative overflow-hidden text-white border-2 border-white/40 cursor-pointer"
              >
                <div className="w-10 h-10 rounded-2xl bg-black/20 flex items-center justify-center text-white shadow-xs">
                  <HelpCircle className="w-6 h-6" />
                </div>
                <div>
                  <span className="font-heading font-black text-2xl tracking-wider block">
                    TRUTH
                  </span>
                  <span className="text-xs text-white/90 font-semibold">
                    Honest confession
                  </span>
                </div>
              </motion.button>

              {/* DARE BUTTON */}
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => selectGameChoice('dare')}
                className="h-48 rounded-3xl p-5 bg-gradient-to-br from-[#FF7139] to-[#FFD447] shadow-playful flex flex-col justify-between text-left relative overflow-hidden text-[#302044] border-2 border-white/40 cursor-pointer"
              >
                <div className="w-10 h-10 rounded-2xl bg-black/20 flex items-center justify-center text-[#302044] shadow-xs">
                  <Flame className="w-6 h-6" />
                </div>
                <div>
                  <span className="font-heading font-black text-2xl tracking-wider block">
                    DARE
                  </span>
                  <span className="text-xs text-[#302044]/90 font-bold">
                    Take the challenge
                  </span>
                </div>
              </motion.button>
            </div>

            {/* Random Coin Flip Button */}
            <button
              type="button"
              onClick={handleRandomChoice}
              disabled={isSpinningChoice}
              className="py-3 px-6 rounded-full bg-white border border-[#EAE1F0] hover:border-[#753BDB] text-[#302044] font-heading font-extrabold text-xs flex items-center gap-2 active:scale-95 transition-all shadow-sm cursor-pointer"
            >
              <Dices className={`w-4 h-4 text-[#753BDB] ${isSpinningChoice ? 'animate-spin' : ''}`} />
              <span>{isSpinningChoice ? 'Flipping Coin...' : 'Random Destiny Flip 🎲'}</span>
            </button>
          </div>
        )}

        {/* STEP 2: REVEALED CARD STATE */}
        {step === 'revealed' && activePrompt && (
          <div className="my-auto py-2 flex flex-col items-center">
            {/* Optional Timer Countdown Bar */}
            {settings.timerEnabled && (
              <div className="flex items-center gap-3 mb-3 p-2 px-4 rounded-full bg-white border border-[#EAE1F0] shadow-sm">
                <TimerIcon className="w-4 h-4 text-[#FF7139]" />
                <span className="font-heading font-extrabold text-xs text-[#302044] tabular-nums">
                  {timeLeft}s remaining
                </span>
                <button
                  type="button"
                  onClick={() => setIsTimerRunning(!isTimerRunning)}
                  className="p-1 rounded-full bg-[#F2EAFE] text-[#753BDB] hover:bg-[#EAE1F0]"
                  title={isTimerRunning ? 'Pause timer' : 'Start timer'}
                >
                  {isTimerRunning ? <Pause className="w-3 h-3" /> : <Play className="w-3 h-3" />}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setTimeLeft(settings.timerSeconds || 30);
                    setIsTimerRunning(false);
                  }}
                  className="p-1 rounded-full bg-[#FFF9F5] text-[#796D87] hover:text-[#302044]"
                  title="Reset timer"
                >
                  <RotateCw className="w-3 h-3" />
                </button>
              </div>
            )}

            {/* Tactile 3D-Style Card Flip Animation */}
            <AnimatePresence mode="wait">
              <motion.div
                key={`card-prompt-${activePrompt.id}`}
                initial={{ rotateY: 90, opacity: 0, scale: 0.95 }}
                animate={{ rotateY: 0, opacity: 1, scale: 1 }}
                exit={{ rotateY: -90, opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.3 }}
                className={`w-full max-w-sm rounded-3xl p-6 sm:p-7 shadow-playful relative overflow-hidden border-2 border-white/60 text-left ${
                  isTruth
                    ? 'bg-gradient-to-br from-[#F04491] via-[#F04491] to-[#FF7139] text-white'
                    : 'bg-gradient-to-br from-[#FF7139] via-[#FF7139] to-[#FFD447] text-[#302044]'
                }`}
              >
                {/* Header inside card */}
                <div className="flex items-center justify-between mb-5">
                  <div className="flex items-center gap-2">
                    <span
                      className={`font-heading font-black text-xs tracking-wider uppercase px-3 py-1 rounded-full ${
                        isTruth ? 'bg-black/25 text-white' : 'bg-black/20 text-[#302044]'
                      }`}
                    >
                      {activePrompt.type.toUpperCase()}
                    </span>
                    <span
                      className={`text-[10px] font-heading font-black uppercase px-2.5 py-0.5 rounded-full ${
                        isTruth ? 'bg-white/20 text-white' : 'bg-white/40 text-[#302044]'
                      }`}
                    >
                      {activePrompt.intensity}
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5">
                    {/* Hint Button */}
                    <button
                      type="button"
                      onClick={() => setShowHint(!showHint)}
                      className={`p-2 rounded-full transition-colors ${
                        isTruth ? 'bg-black/20 text-white' : 'bg-black/15 text-[#302044]'
                      }`}
                      title="Reveal Hint"
                    >
                      <Lightbulb className="w-4 h-4" />
                    </button>

                    {/* Swap Prompt Button */}
                    <button
                      type="button"
                      onClick={rerollCurrentPrompt}
                      className={`p-2 rounded-full transition-colors ${
                        isTruth ? 'bg-black/20 text-white' : 'bg-black/15 text-[#302044]'
                      }`}
                      title="Swap for another prompt"
                    >
                      <RotateCw className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Prompt Text */}
                <div className="min-h-[130px] flex items-center justify-center text-center px-1">
                  <p className="font-heading font-black text-xl sm:text-2xl leading-relaxed">
                    "{activePrompt.text}"
                  </p>
                </div>

                {/* Optional Hint Dropdown */}
                {showHint && (
                  <div
                    className={`mt-4 p-3 rounded-2xl text-xs font-semibold ${
                      isTruth ? 'bg-black/30 text-white' : 'bg-black/15 text-[#302044]'
                    }`}
                  >
                    💡 Hint: Take a deep breath! Answer with the first funny or honest thought that comes to mind.
                  </div>
                )}

                {/* Card footer details */}
                <div
                  className={`mt-5 pt-3 border-t flex items-center justify-between text-[11px] font-bold ${
                    isTruth ? 'border-white/20 text-white/80' : 'border-black/10 text-[#302044]/80'
                  }`}
                >
                  <span>{categoryInfo.name}</span>
                  <span>Pass or swap anytime</span>
                </div>
              </motion.div>
            </AnimatePresence>

            {/* "This makes me uncomfortable" Safe Button */}
            <div className="mt-2 text-center">
              {uncomfortableNotice ? (
                <span className="text-[11px] font-bold text-[#36B77A] bg-white px-3 py-1 rounded-full border border-[#36B77A]/30">
                  ✓ Prompt safely replaced. Zero judgment! 💕
                </span>
              ) : (
                <button
                  type="button"
                  onClick={handleUncomfortableSwap}
                  className="text-[11px] font-bold text-[#796D87] hover:text-[#302044] hover:underline flex items-center justify-center gap-1 mx-auto"
                >
                  <ShieldCheck className="w-3.5 h-3.5 text-[#36B77A]" />
                  <span>This makes me uncomfortable · Swap safely</span>
                </button>
              )}
            </div>
          </div>
        )}

        {/* Action Controls when Card is Revealed */}
        {step === 'revealed' && (
          <div className="space-y-3 pt-2">
            {/* Live Reaction toolbar for party friends */}
            <ReactionToolbar />

            <div className="grid grid-cols-2 gap-3">
              {/* Skip Button */}
              <button
                type="button"
                onClick={() => {
                  if (canSkip) {
                    setShowSkipConfirm(true);
                  } else {
                    playSound('skip');
                  }
                }}
                disabled={!canSkip}
                className={`py-4 px-4 rounded-full font-heading font-bold text-xs flex items-center justify-center gap-1.5 transition-all shadow-sm ${
                  canSkip
                    ? 'bg-white border border-[#EAE1F0] text-[#302044] hover:bg-[#F2EAFE]'
                    : 'bg-[#EAE1F0] text-[#796D87] opacity-60 cursor-not-allowed'
                }`}
              >
                <Forward className="w-4 h-4 text-[#796D87]" />
                <span>
                  {settings.skipLimit >= 99
                    ? 'Skip (Unlimited)'
                    : canSkip
                    ? `Skip (${skipsRemaining} Left)`
                    : 'No Skips Left'}
                </span>
              </button>

              {/* Done / Completed Button */}
              <button
                type="button"
                onClick={() => {
                  triggerReaction('you_did_it');
                  triggerCatchphrase('yay');
                  completeCurrentPrompt();
                }}
                className="py-4 px-4 rounded-full bg-gradient-to-r from-[#753BDB] to-[#F04491] text-white font-heading font-black text-sm shadow-playful flex items-center justify-center gap-2 active:scale-98 transition-transform cursor-pointer"
              >
                <Check className="w-5 h-5 stroke-[3]" />
                <span>Challenge Done!</span>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Confirmation Dialogs */}
      <ConfirmModal
        isOpen={showSkipConfirm}
        title="Skip this challenge?"
        description={`You have ${skipsRemaining} skips remaining. Everyone is free to pass any prompt they feel uncomfortable with.`}
        confirmLabel="Confirm Skip"
        cancelLabel="Keep Playing"
        onConfirm={() => {
          setShowSkipConfirm(false);
          skipCurrentPrompt();
        }}
        onCancel={() => setShowSkipConfirm(false)}
      />

      <ConfirmModal
        isOpen={showExitConfirm}
        title="Leave current game?"
        description="Your game progress and scores will be concluded and saved to your session history."
        confirmLabel="Leave Game"
        cancelLabel="Stay in Game"
        isDestructive
        onConfirm={() => {
          setShowExitConfirm(false);
          exitGameSession();
        }}
        onCancel={() => setShowExitConfirm(false)}
      />
    </div>
  );
};
