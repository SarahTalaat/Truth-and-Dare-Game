import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Play, 
  Plus, 
  Trash2, 
  Edit2, 
  ArrowUp, 
  ArrowDown, 
  Timer, 
  Forward, 
  Shuffle, 
  ShieldAlert, 
  RotateCcw, 
  Check, 
  Layers,
  Sparkles,
  Flame,
  HelpCircle,
  Users,
  Heart,
  Volume2,
  VolumeX,
  Vibrate,
  Eye,
  Dice5,
  Dices,
  AlertTriangle,
  Info,
  Calendar,
  X,
  Smile,
  Zap,
  Crown
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { useGame } from '../context/GameContext';
import { CATEGORIES } from '../data/categories';
import { CategoryId, IntensityLevel, Player, Pack } from '../types/game';
import { HeaderBar } from '../components/HeaderBar';
import { AvatarPickerModal, AVATAR_OPTIONS } from '../components/AvatarPickerModal';
import { ConfirmModal } from '../components/ConfirmModal';
import { triggerCatchphrase } from '../components/CatchphraseToast';
import { BrandCatchphrase } from '../components/BrandCatchphrase';

const FUNNY_NICKNAMES = [
  'Spicy Pickle',
  'Chaos Gremlin',
  'Captain Awkward',
  'Dancing Queen',
  'Drama Magnet',
  'Midnight Snacker',
  'The Overthinker',
  'Secret Agent',
  'Giggle Monster',
  'Couch Potato 2.0',
  'Sassy Fox',
  'Plot Twist',
  'Wildcard',
  'Party Animal',
  'Truth Slayer'
];

const STANDARD_BOUNDARIES = [
  'Pass allowed at any time with 0 penalty',
  'Safe & consensual party space',
  'No physical contact without consent',
  'Safe For Work (SFW)',
  'No romantic / exes questions',
  'Family-safe friendly vibe'
];

const AVAILABLE_HOUSE_RULES = [
  { id: 'double_dare', label: 'Double Dare Allowed', desc: 'Pass a dare to someone else with 2x stakes' },
  { id: 'penalty_pose', label: 'Penalty Pose on Skip', desc: 'Anyone who skips must strike a statue pose for 1 turn' },
  { id: 'pass_the_crown', label: 'Pass the Crown', desc: 'MVP player gets to wear the imaginary party crown' },
  { id: 'confession_tax', label: 'Confession Tax', desc: 'Pause > 10 seconds on truth = answer 2 truths!' },
  { id: 'playlist_dj', label: 'Winner Picks Music', desc: 'Session winner becomes the party DJ for the night' }
];

export const GameSetupScreen: React.FC = () => {
  const {
    gameSettings,
    setGameSettings,
    startNewGame,
    setCurrentScreen,
    packs,
    playSound,
    profile,
    updateProfile,
  } = useGame();

  // Mode Cards: Friends, Couples 💕, Party 🎉, Family, Custom
  const [selectedModeKey, setSelectedModeKey] = useState<'friends' | 'couples' | 'party' | 'family' | 'custom'>(
    gameSettings.category === 'couples' ? 'couples' :
    gameSettings.category === 'family' ? 'family' :
    gameSettings.category === 'party' ? 'party' :
    (gameSettings.customModeName ? 'custom' : 'friends')
  );

  const [category, setCategory] = useState<CategoryId>(gameSettings.category);
  const [mode, setMode] = useState<'truth' | 'dare' | 'mixed'>(gameSettings.mode);
  const [intensity, setIntensity] = useState<IntensityLevel>(gameSettings.intensity);
  const [rounds, setRounds] = useState<number>(gameSettings.rounds);
  const [timerEnabled, setTimerEnabled] = useState<boolean>(gameSettings.timerEnabled);
  const [timerSeconds, setTimerSeconds] = useState<number>(gameSettings.timerSeconds || 30);
  const [skipLimit, setSkipLimit] = useState<number>(gameSettings.skipLimit || 3);
  const [randomPlayerOrder, setRandomPlayerOrder] = useState<boolean>(gameSettings.randomPlayerOrder || false);
  const [adultContentEnabled, setAdultContentEnabled] = useState<boolean>(gameSettings.adultContentEnabled || false);
  const [teamMode, setTeamMode] = useState<boolean>(gameSettings.teamMode || false);
  const [surpriseRounds, setSurpriseRounds] = useState<boolean>(gameSettings.surpriseRounds ?? true);
  const [enableScoring, setEnableScoring] = useState<boolean>(gameSettings.enableScoring ?? true);
  const [selectedPackIds, setSelectedPackIds] = useState<string[]>(
    gameSettings.selectedPackIds?.length ? gameSettings.selectedPackIds : ['pack-classic']
  );
  const [players, setPlayers] = useState<Player[]>(gameSettings.players);
  const [boundaries, setBoundaries] = useState<string[]>(
    gameSettings.boundaries || [STANDARD_BOUNDARIES[0], STANDARD_BOUNDARIES[1]]
  );
  const [selectedHouseRules, setSelectedHouseRules] = useState<string[]>(
    gameSettings.houseRules || ['double_dare']
  );

  // Modals & UI States
  const [newPlayerName, setNewPlayerName] = useState('');
  const [editingPlayerId, setEditingPlayerId] = useState<string | null>(null);
  const [editingPlayerName, setEditingPlayerName] = useState('');
  const [avatarModalTargetPlayerId, setAvatarModalTargetPlayerId] = useState<string | null>(null);
  const [errorNotice, setErrorNotice] = useState<string | null>(null);
  const [customBoundaryInput, setCustomBoundaryInput] = useState('');
  const [showAgeWarningModal, setShowAgeWarningModal] = useState(false);
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [previewingPack, setPreviewingPack] = useState<Pack | null>(null);

  const PLAYER_COLORS = ['#753BDB', '#F04491', '#FF7139', '#FFD447', '#48BDEB', '#36B77A'];

  // Handle Mode Card Selection
  const handleSelectModeCard = (key: 'friends' | 'couples' | 'party' | 'family' | 'custom') => {
    playSound('tap');
    setSelectedModeKey(key);

    if (key === 'friends') {
      setCategory('friends');
      setIntensity('chill');
      setMode('mixed');
      setAdultContentEnabled(false);
    } else if (key === 'couples') {
      setCategory('couples');
      setIntensity('spicy');
      setMode('mixed');
      triggerCatchphrase('wow');
    } else if (key === 'party') {
      setCategory('party');
      setIntensity('funny');
      setMode('mixed');
      triggerCatchphrase('yay');
    } else if (key === 'family') {
      setCategory('family');
      setIntensity('chill');
      setMode('mixed');
      setAdultContentEnabled(false);
    } else if (key === 'custom') {
      setCategory('friends');
    }
  };

  // Add Player with validation
  const handleAddPlayer = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const clean = newPlayerName.trim();
    if (!clean) {
      setErrorNotice('Please type a player name or tap Nicknames!');
      setTimeout(() => setErrorNotice(null), 2500);
      return;
    }

    if (players.some(p => p.name.toLowerCase() === clean.toLowerCase())) {
      setErrorNotice('Player name already added! Use a nickname or add an initial.');
      setTimeout(() => setErrorNotice(null), 2500);
      return;
    }

    const randomAvatar = AVATAR_OPTIONS[Math.floor(Math.random() * AVATAR_OPTIONS.length)];
    const color = PLAYER_COLORS[players.length % PLAYER_COLORS.length];

    const newP: Player = {
      id: `p-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      name: clean,
      avatar: randomAvatar,
      color,
      score: { truths: 0, dares: 0, skips: 0 },
    };

    playSound('tap');
    setPlayers(prev => [...prev, newP]);
    setNewPlayerName('');
  };

  // Add random funny nickname suggestion
  const handleSuggestNickname = () => {
    playSound('tap');
    const unusedNames = FUNNY_NICKNAMES.filter(
      n => !players.some(p => p.name.toLowerCase() === n.toLowerCase())
    );
    const chosen = unusedNames.length > 0
      ? unusedNames[Math.floor(Math.random() * unusedNames.length)]
      : `Player ${players.length + 1}`;
    setNewPlayerName(chosen);
  };

  const handleRemovePlayer = (id: string) => {
    if (players.length <= 2) {
      setErrorNotice('At least 2 players are required to play Truth or Dare!');
      setTimeout(() => setErrorNotice(null), 2500);
      return;
    }
    playSound('skip');
    setPlayers(prev => prev.filter(p => p.id !== id));
  };

  const handleMovePlayer = (index: number, direction: 'up' | 'down') => {
    playSound('tap');
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= players.length) return;
    const reordered = [...players];
    const [moved] = reordered.splice(index, 1);
    reordered.splice(targetIndex, 0, moved);
    setPlayers(reordered);
  };

  const handleSavePlayerName = (id: string) => {
    if (!editingPlayerName.trim()) return;
    setPlayers(prev =>
      prev.map(p => (p.id === id ? { ...p, name: editingPlayerName.trim() } : p))
    );
    setEditingPlayerId(null);
    playSound('tap');
  };

  const handleRandomizeAvatar = (id: string) => {
    playSound('flip');
    const randomAvatar = AVATAR_OPTIONS[Math.floor(Math.random() * AVATAR_OPTIONS.length)];
    setPlayers(prev =>
      prev.map(p => (p.id === id ? { ...p, avatar: randomAvatar } : p))
    );
  };

  // Toggle pack selection
  const handleTogglePack = (packId: string) => {
    const pack = packs.find(p => p.id === packId);
    if (pack?.category === 'adults' && !adultContentEnabled && !selectedPackIds.includes(packId)) {
      setShowAgeWarningModal(true);
      return;
    }

    playSound('tap');
    setSelectedPackIds(prev =>
      prev.includes(packId)
        ? prev.length > 1
          ? prev.filter(id => id !== packId)
          : prev
        : [...prev, packId]
    );
  };

  // "Surprise Me 🎲" random pack picker
  const handleSurpriseMePacks = () => {
    playSound('sparkle');
    const safePacks = adultContentEnabled ? packs : packs.filter(p => p.category !== 'adults');
    const shuffled = [...safePacks].sort(() => Math.random() - 0.5);
    const count = Math.min(safePacks.length, Math.floor(Math.random() * 2) + 2);
    const pickedIds = shuffled.slice(0, count).map(p => p.id);
    setSelectedPackIds(pickedIds);
    triggerCatchphrase('wow');
  };

  // "MAKE IT CHAOTIC 🤪" auto randomizer
  const handleMakeItChaotic = () => {
    playSound('sparkle');
    confetti({
      particleCount: 50,
      spread: 70,
      origin: { y: 0.5 },
      colors: ['#753BDB', '#F04491', '#FF7139', '#FFD447']
    });

    setIntensity('spicy');
    setMode('mixed');
    setTimerEnabled(true);
    setTimerSeconds(20);
    setSkipLimit(1);
    setSurpriseRounds(true);
    setRandomPlayerOrder(true);
    triggerCatchphrase('uh_oh_playful');
  };

  // "DEALER'S CHOICE 🎲" safe balanced setup
  const handleDealersChoice = () => {
    playSound('sparkle');
    setIntensity('funny');
    setMode('mixed');
    setTimerEnabled(false);
    setSkipLimit(3);
    setRounds(10);
    setSurpriseRounds(true);
    triggerCatchphrase('yay');
  };

  // Adult content toggle with confirmation
  const handleToggleAdultContent = () => {
    if (!adultContentEnabled) {
      setShowAgeWarningModal(true);
    } else {
      setAdultContentEnabled(false);
      // Remove any adult packs if disabled
      setSelectedPackIds(prev => {
        const nonAdult = prev.filter(id => {
          const pack = packs.find(p => p.id === id);
          return pack?.category !== 'adults';
        });
        return nonAdult.length > 0 ? nonAdult : ['pack-classic'];
      });
      playSound('tap');
    }
  };

  // Toggle boundary chip
  const handleToggleBoundary = (b: string) => {
    playSound('tap');
    setBoundaries(prev =>
      prev.includes(b) ? prev.filter(item => item !== b) : [...prev, b]
    );
  };

  const handleAddCustomBoundary = (e: React.FormEvent) => {
    e.preventDefault();
    const clean = customBoundaryInput.trim();
    if (clean && !boundaries.includes(clean)) {
      setBoundaries(prev => [...prev, clean]);
      setCustomBoundaryInput('');
      playSound('tap');
    }
  };

  // Toggle house rules
  const handleToggleHouseRule = (id: string) => {
    playSound('tap');
    setSelectedHouseRules(prev =>
      prev.includes(id) ? prev.filter(r => r !== id) : [...prev, id]
    );
  };

  // Reset to default
  const handleResetSettings = () => {
    playSound('skip');
    setSelectedModeKey('friends');
    setCategory('friends');
    setMode('mixed');
    setIntensity('chill');
    setRounds(10);
    setTimerEnabled(false);
    setTimerSeconds(30);
    setSkipLimit(3);
    setRandomPlayerOrder(false);
    setAdultContentEnabled(false);
    setTeamMode(false);
    setSurpriseRounds(true);
    setEnableScoring(true);
    setSelectedPackIds(['pack-classic']);
    setBoundaries([STANDARD_BOUNDARIES[0], STANDARD_BOUNDARIES[1]]);
    setSelectedHouseRules(['double_dare']);
    setShowResetConfirm(false);
  };

  // START GAME: Validates and passes exact state
  const handleStartGame = () => {
    if (players.length < 2) {
      setErrorNotice('You need at least 2 players to start!');
      setTimeout(() => setErrorNotice(null), 3000);
      return;
    }

    if (selectedPackIds.length === 0) {
      setErrorNotice('Please select at least 1 prompt pack!');
      setTimeout(() => setErrorNotice(null), 3000);
      return;
    }

    playSound('tap');
    triggerCatchphrase('play_nice_never');

    startNewGame({
      category,
      mode,
      intensity,
      rounds,
      timerEnabled,
      timerSeconds,
      skipLimit,
      randomPlayerOrder,
      adultContentEnabled,
      selectedPackIds,
      players,
      boundaries,
      teamMode,
      houseRules: selectedHouseRules,
      surpriseRounds,
      enableScoring,
      customModeName: selectedModeKey === 'custom' ? 'Custom Chaos' : undefined
    });
  };

  // Live estimated duration
  const estimatedDuration = useMemo(() => {
    if (rounds === 0) return 'Endless Night 🌙';
    const mins = Math.max(5, Math.round(rounds * players.length * 0.8));
    return `~${mins} mins`;
  }, [rounds, players.length]);

  // Mascot funny reaction quote based on setup combos
  const mascotReaction = useMemo(() => {
    if (category === 'family' && intensity === 'spicy') {
      return "Spicy + Family? Uh-oh, Thanksgiving dinner just got awkward! 🦃🔥";
    }
    if (category === 'couples' && intensity === 'spicy') {
      return "Couples + Spicy? Sparks are about to fly! 🌶️❤️";
    }
    if (rounds === 0 && timerEnabled && timerSeconds <= 20) {
      return "Endless + 20s Speed Timer? High-stress chaos incoming! ⚡";
    }
    if (teamMode) {
      return "Team Mode active! Prepare for friendly trash talk and glory! 🏆";
    }
    if (intensity === 'spicy') {
      return "Spicy mode engaged. No secrets will remain safe tonight! 😈";
    }
    if (players.length >= 6) {
      return "Big party crew detected! Get ready for maximum room noise! 🥳";
    }
    return "Pip approves! Let's get this party rolling! 🦊";
  }, [category, intensity, rounds, timerEnabled, timerSeconds, teamMode, players.length]);

  return (
    <div className="min-h-screen bg-[#FFF9F5] text-[#302044] pb-32 max-w-lg mx-auto">
      {/* Header Bar with Back navigation and Reset */}
      <HeaderBar
        showBack
        onBack={() => {
          playSound('tap');
          setCurrentScreen('main_tabs');
        }}
        title="Game Setup"
        rightAction={
          <button
            type="button"
            onClick={() => setShowResetConfirm(true)}
            className="p-2 rounded-full text-[#796D87] hover:text-[#302044] hover:bg-[#F2EAFE] transition-colors"
            title="Reset to default settings"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        }
      />

      {/* Floating Error Notification Toast */}
      <AnimatePresence>
        {errorNotice && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="sticky top-14 z-40 mx-4 my-2 p-3 rounded-2xl bg-[#E95757] text-white text-xs font-heading font-black shadow-lg flex items-center justify-between gap-2"
          >
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 shrink-0" />
              <span>{errorNotice}</span>
            </div>
            <button type="button" onClick={() => setErrorNotice(null)} className="p-1">
              <X className="w-3.5 h-3.5" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="px-4 py-3 space-y-6 text-left">
        {/* Rotating Daily Theme Banner */}
        <div className="p-3.5 rounded-2xl bg-gradient-to-r from-[#753BDB]/15 via-[#F04491]/15 to-[#FF7139]/15 border border-[#753BDB]/30 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <span className="text-2xl">🔥</span>
            <div>
              <div className="text-[10px] font-heading font-black uppercase tracking-wider text-[#753BDB]">
                Daily Party Vibe
              </div>
              <div className="font-heading font-black text-xs text-[#302044]">
                Wild Dare Weekend · Bonus XP & laughs
              </div>
            </div>
          </div>
          <span className="text-[10px] font-bold text-[#FF7139] bg-white px-2 py-0.5 rounded-full border border-[#FF7139]/30">
            Active
          </span>
        </div>

        {/* 1. PLAYFUL MODE CARDS */}
        <section aria-label="Game Mode Cards">
          <div className="flex items-center justify-between mb-2.5">
            <h3 className="font-heading font-black text-sm text-[#302044] flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-[#753BDB]" />
              <span>Choose Your Party Vibe</span>
            </h3>
            <span className="text-[11px] text-[#796D87] font-bold">Step 1 of 4</span>
          </div>

          <div className="grid grid-cols-2 gap-2.5">
            {[
              {
                key: 'friends',
                title: 'Friends',
                badge: '🦊 Squad',
                gradient: 'from-[#753BDB] to-[#48BDEB]',
                desc: 'Classic banter, friendly roasts & secret revelations',
              },
              {
                key: 'couples',
                title: 'Couples 💕',
                badge: '💖 Sparks',
                gradient: 'from-[#F04491] to-[#FF7139]',
                desc: 'Flirty confessions, romantic heat & cute eye-contact dares',
              },
              {
                key: 'party',
                title: 'Party 🎉',
                badge: '🥳 Wild',
                gradient: 'from-[#FF7139] to-[#FFD447]',
                desc: 'High-energy room dares, runway struts & loud laughter',
              },
              {
                key: 'family',
                title: 'Family',
                badge: '🌻 Wholesome',
                gradient: 'from-[#36B77A] to-[#48BDEB]',
                desc: '100% wholesome fun safe for kids, parents & grandparents',
              },
            ].map(card => {
              const isSelected = selectedModeKey === card.key;
              return (
                <motion.div
                  key={`mode-card-${card.key}`}
                  whileHover={{ y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleSelectModeCard(card.key as any)}
                  className={`p-3.5 rounded-3xl border-2 text-left cursor-pointer transition-all relative overflow-hidden flex flex-col justify-between ${
                    isSelected
                      ? 'bg-white border-[#753BDB] shadow-playful ring-2 ring-[#753BDB]/20'
                      : 'bg-white/80 border-[#EAE1F0] hover:border-[#753BDB]/40'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-xs font-heading font-black">{card.badge}</span>
                      {isSelected && (
                        <div className="w-5 h-5 rounded-full bg-[#753BDB] text-white flex items-center justify-center">
                          <Check className="w-3 h-3 stroke-[3]" />
                        </div>
                      )}
                    </div>
                    <div className="font-heading font-black text-sm text-[#302044]">
                      {card.title}
                    </div>
                    <p className="text-[11px] text-[#796D87] line-clamp-2 mt-1 leading-snug">
                      {card.desc}
                    </p>
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* Custom Mode Card button */}
          <button
            type="button"
            onClick={() => handleSelectModeCard('custom')}
            className={`w-full mt-2.5 p-3 rounded-2xl border-2 flex items-center justify-between transition-all ${
              selectedModeKey === 'custom'
                ? 'bg-[#F2EAFE] border-[#753BDB] text-[#753BDB]'
                : 'bg-white border-[#EAE1F0] text-[#796D87] hover:text-[#302044]'
            }`}
          >
            <div className="flex items-center gap-2">
              <span className="text-lg">🎨</span>
              <span className="font-heading font-black text-xs text-[#302044]">
                Custom Party Builder · Customize every single rule & deck
              </span>
            </div>
            {selectedModeKey === 'custom' && <Check className="w-4 h-4 text-[#753BDB]" />}
          </button>
        </section>

        {/* 2. PLAYER ROSTER SECTION */}
        <section aria-label="Player Roster">
          <div className="flex items-center justify-between mb-2">
            <div>
              <h3 className="font-heading font-black text-sm text-[#302044] flex items-center gap-1.5">
                <Users className="w-4 h-4 text-[#F04491]" />
                <span>Player Roster ({players.length})</span>
              </h3>
              <p className="text-[11px] text-[#796D87]">
                “WHO'S READY TO EMBARRASS THEMSELVES? 😂”
              </p>
            </div>

            <button
              type="button"
              onClick={handleSuggestNickname}
              className="text-[11px] font-heading font-extrabold text-[#753BDB] bg-[#F2EAFE] px-2.5 py-1 rounded-full border border-[#753BDB]/20 hover:bg-[#EAE1F0] transition-colors flex items-center gap-1"
            >
              <span>🎲 Nickname</span>
            </button>
          </div>

          {/* Add Player Input Form */}
          <form onSubmit={handleAddPlayer} className="flex items-center gap-2 mb-3">
            <input
              type="text"
              placeholder="Enter player name or nickname..."
              value={newPlayerName}
              onChange={e => setNewPlayerName(e.target.value)}
              className="flex-1 px-4 py-2.5 rounded-full bg-white border border-[#EAE1F0] text-xs text-[#302044] placeholder-[#796D87]/60 focus:outline-none focus:border-[#753BDB] shadow-xs"
            />
            <button
              type="submit"
              className="py-2.5 px-4 rounded-full bg-[#753BDB] text-white font-heading font-black text-xs flex items-center gap-1 shadow-sm active:scale-95 transition-transform"
            >
              <Plus className="w-4 h-4" />
              <span>Add</span>
            </button>
          </form>

          {/* Player Cards List with Reorder and Avatar Options */}
          <div className="space-y-2">
            <AnimatePresence>
              {players.map((p, idx) => (
                <motion.div
                  key={`setup-player-${p.id}`}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className="p-3 rounded-2xl bg-white border border-[#EAE1F0] shadow-xs flex items-center justify-between gap-2"
                >
                  <div className="flex items-center gap-2.5 flex-1 min-w-0">
                    {/* Avatar with tap to pick or randomize */}
                    <div className="relative group shrink-0">
                      <button
                        type="button"
                        onClick={() => setAvatarModalTargetPlayerId(p.id)}
                        className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#753BDB]/15 to-[#F04491]/15 flex items-center justify-center text-xl border border-[#EAE1F0] hover:scale-105 transition-transform"
                        title="Change Avatar"
                      >
                        {p.avatar}
                      </button>
                      <button
                        type="button"
                        onClick={() => handleRandomizeAvatar(p.id)}
                        className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-white text-[#753BDB] border border-[#EAE1F0] flex items-center justify-center text-[9px] shadow-xs"
                        title="Random Avatar"
                      >
                        🎲
                      </button>
                    </div>

                    {/* Name / Editable Name */}
                    {editingPlayerId === p.id ? (
                      <div className="flex items-center gap-1 flex-1">
                        <input
                          type="text"
                          value={editingPlayerName}
                          onChange={e => setEditingPlayerName(e.target.value)}
                          className="px-2 py-1 rounded-md border border-[#753BDB] text-xs font-bold text-[#302044] w-28 focus:outline-none"
                          autoFocus
                          onKeyDown={e => {
                            if (e.key === 'Enter') handleSavePlayerName(p.id);
                          }}
                        />
                        <button
                          type="button"
                          onClick={() => handleSavePlayerName(p.id)}
                          className="p-1 rounded bg-[#36B77A] text-white"
                        >
                          <Check className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ) : (
                      <div className="truncate">
                        <div className="font-heading font-black text-xs text-[#302044] truncate">
                          {p.name}
                        </div>
                        <div className="text-[10px] text-[#796D87]">
                          Player #{idx + 1} {teamMode && (idx % 2 === 0 ? '· 🌸 Team Bubblegum' : '· 🔮 Team Grape')}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Actions: Edit name, Reorder up/down, Delete */}
                  <div className="flex items-center gap-1 shrink-0">
                    <button
                      type="button"
                      onClick={() => {
                        setEditingPlayerId(p.id);
                        setEditingPlayerName(p.name);
                      }}
                      className="p-1.5 rounded-lg text-[#796D87] hover:bg-[#F2EAFE] hover:text-[#302044]"
                      title="Edit Name"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>

                    <button
                      type="button"
                      onClick={() => handleMovePlayer(idx, 'up')}
                      disabled={idx === 0}
                      className="p-1.5 rounded-lg text-[#796D87] hover:bg-[#F2EAFE] disabled:opacity-30"
                      title="Move Up"
                    >
                      <ArrowUp className="w-3.5 h-3.5" />
                    </button>

                    <button
                      type="button"
                      onClick={() => handleMovePlayer(idx, 'down')}
                      disabled={idx === players.length - 1}
                      className="p-1.5 rounded-lg text-[#796D87] hover:bg-[#F2EAFE] disabled:opacity-30"
                      title="Move Down"
                    >
                      <ArrowDown className="w-3.5 h-3.5" />
                    </button>

                    <button
                      type="button"
                      onClick={() => handleRemovePlayer(p.id)}
                      className="p-1.5 rounded-lg text-[#796D87] hover:text-[#E95757] hover:bg-[#E95757]/10"
                      title="Remove Player"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {/* Team Mode Preview Visualizer if Team Mode is enabled */}
          {teamMode && (
            <div className="mt-3 grid grid-cols-2 gap-2 text-xs">
              <div className="p-3 rounded-2xl bg-[#F04491]/10 border border-[#F04491]/30">
                <div className="font-heading font-black text-[#F04491] mb-1">
                  🌸 Team Bubblegum
                </div>
                <div className="text-[11px] text-[#796D87]">
                  {players.filter((_, i) => i % 2 === 0).map(p => p.name).join(', ') || 'No players yet'}
                </div>
              </div>
              <div className="p-3 rounded-2xl bg-[#753BDB]/10 border border-[#753BDB]/30">
                <div className="font-heading font-black text-[#753BDB] mb-1">
                  🔮 Team Grape
                </div>
                <div className="text-[11px] text-[#796D87]">
                  {players.filter((_, i) => i % 2 !== 0).map(p => p.name).join(', ') || 'No players yet'}
                </div>
              </div>
            </div>
          )}
        </section>

        {/* 3. GAME SETTINGS: Mode, Intensity, Timer, Rounds, Rules */}
        <section aria-label="Game Rules and Controls" className="space-y-4">
          <h3 className="font-heading font-black text-sm text-[#302044] flex items-center gap-1.5">
            <Flame className="w-4 h-4 text-[#FF7139]" />
            <span>Game Rules & Settings</span>
          </h3>

          <div className="rounded-3xl bg-white border border-[#EAE1F0] shadow-card p-4 space-y-4">
            {/* Mode selection: Truth, Dare, Both */}
            <div>
              <span className="text-xs font-bold text-[#796D87] block mb-2">
                Challenge Mode
              </span>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: 'mixed', label: 'Both / Choice', icon: '✨' },
                  { id: 'truth', label: 'Truth Only', icon: '💖' },
                  { id: 'dare', label: 'Dare Only', icon: '🔥' },
                ].map(m => (
                  <button
                    key={`mode-btn-${m.id}`}
                    type="button"
                    onClick={() => {
                      playSound('tap');
                      setMode(m.id as any);
                    }}
                    className={`py-2 px-2.5 rounded-2xl text-xs font-heading font-black flex items-center justify-center gap-1.5 transition-all ${
                      mode === m.id
                        ? 'bg-[#753BDB] text-white shadow-xs'
                        : 'bg-[#FFF9F5] border border-[#EAE1F0] text-[#796D87] hover:text-[#302044]'
                    }`}
                  >
                    <span>{m.icon}</span>
                    <span>{m.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Intensity Level: Chill, Funny, Spicy */}
            <div>
              <span className="text-xs font-bold text-[#796D87] block mb-2">
                Spice Intensity
              </span>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: 'chill', label: 'Chill 🍃', desc: 'Mild & friendly' },
                  { id: 'funny', label: 'Funny 🎭', desc: 'Silly & goofy' },
                  { id: 'spicy', label: 'Spicy 🌶️', desc: 'Daring & bold' },
                ].map(int => (
                  <button
                    key={`intensity-btn-${int.id}`}
                    type="button"
                    onClick={() => {
                      playSound('tap');
                      setIntensity(int.id as any);
                    }}
                    className={`py-2.5 px-2 rounded-2xl text-xs font-heading font-black flex flex-col items-center justify-center gap-0.5 transition-all ${
                      intensity === int.id
                        ? 'bg-[#FF7139] text-white shadow-xs'
                        : 'bg-[#FFF9F5] border border-[#EAE1F0] text-[#796D87] hover:text-[#302044]'
                    }`}
                  >
                    <span>{int.label}</span>
                    <span className="text-[10px] opacity-80 font-normal">{int.desc}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Rounds Selector */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-[#796D87]">
                  Game Length (Rounds)
                </span>
                <span className="text-xs font-heading font-black text-[#753BDB]">
                  {rounds === 0 ? 'Endless Mode ♾️' : `${rounds} Rounds`}
                </span>
              </div>
              <div className="grid grid-cols-4 gap-2">
                {[
                  { r: 5, label: '5 (Quick)' },
                  { r: 10, label: '10 (Party)' },
                  { r: 20, label: '20 (Epic)' },
                  { r: 0, label: '♾️ Endless' },
                ].map(option => (
                  <button
                    key={`rounds-btn-${option.r}`}
                    type="button"
                    onClick={() => {
                      playSound('tap');
                      setRounds(option.r);
                    }}
                    className={`py-2 rounded-xl text-xs font-heading font-black transition-all ${
                      rounds === option.r
                        ? 'bg-[#302044] text-white shadow-xs'
                        : 'bg-[#FFF9F5] border border-[#EAE1F0] text-[#796D87]'
                    }`}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Countdown Timer Toggle & Slider */}
            <div className="pt-2 border-t border-[#EAE1F0]">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <Timer className="w-4 h-4 text-[#753BDB]" />
                  <span className="text-xs font-bold text-[#302044]">Turn Countdown Timer</span>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    playSound('tap');
                    setTimerEnabled(!timerEnabled);
                  }}
                  className={`w-11 h-6 rounded-full transition-colors relative p-0.5 ${
                    timerEnabled ? 'bg-[#753BDB]' : 'bg-[#EAE1F0]'
                  }`}
                >
                  <div
                    className={`w-5 h-5 rounded-full bg-white transition-transform shadow-xs ${
                      timerEnabled ? 'translate-x-5' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>

              {timerEnabled && (
                <div className="grid grid-cols-4 gap-2 mt-2">
                  {[15, 30, 45, 60].map(sec => (
                    <button
                      key={`timer-chip-${sec}`}
                      type="button"
                      onClick={() => {
                        playSound('tap');
                        setTimerSeconds(sec);
                      }}
                      className={`py-1.5 rounded-xl text-xs font-heading font-bold transition-all ${
                        timerSeconds === sec
                          ? 'bg-[#753BDB] text-white'
                          : 'bg-[#F2EAFE] text-[#753BDB]'
                      }`}
                    >
                      {sec}s
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Skips Allowed Limit */}
            <div className="pt-2 border-t border-[#EAE1F0]">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <Forward className="w-4 h-4 text-[#FF7139]" />
                  <span className="text-xs font-bold text-[#302044]">Skips Allowed per Player</span>
                </div>
                <span className="text-xs font-heading font-black text-[#FF7139]">
                  {skipLimit >= 99 ? 'Unlimited ♾️' : `${skipLimit} Skips`}
                </span>
              </div>
              <div className="grid grid-cols-4 gap-2">
                {[1, 2, 3, 99].map(limit => (
                  <button
                    key={`skips-btn-${limit}`}
                    type="button"
                    onClick={() => {
                      playSound('tap');
                      setSkipLimit(limit);
                    }}
                    className={`py-1.5 rounded-xl text-xs font-heading font-bold transition-all ${
                      skipLimit === limit
                        ? 'bg-[#FF7139] text-white'
                        : 'bg-[#FFF9F5] border border-[#EAE1F0] text-[#796D87]'
                    }`}
                  >
                    {limit >= 99 ? '♾️ Unlimited' : `${limit} Skips`}
                  </button>
                ))}
              </div>
            </div>

            {/* Toggles: Team Mode, Surprise Rounds, Random Order, Scoring */}
            <div className="pt-2 border-t border-[#EAE1F0] space-y-3">
              {/* Team Mode */}
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-xs font-bold text-[#302044]">Team Mode (Bubblegum vs Grape)</div>
                  <div className="text-[10px] text-[#796D87]">Players compete in two squads</div>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    playSound('tap');
                    setTeamMode(!teamMode);
                  }}
                  className={`w-11 h-6 rounded-full transition-colors relative p-0.5 ${
                    teamMode ? 'bg-[#F04491]' : 'bg-[#EAE1F0]'
                  }`}
                >
                  <div
                    className={`w-5 h-5 rounded-full bg-white transition-transform shadow-xs ${
                      teamMode ? 'translate-x-5' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>

              {/* Surprise Rounds */}
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-xs font-bold text-[#302044]">Surprise Rounds 🎲</div>
                  <div className="text-[10px] text-[#796D87]">Spontaneous room challenges & group dares</div>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    playSound('tap');
                    setSurpriseRounds(!surpriseRounds);
                  }}
                  className={`w-11 h-6 rounded-full transition-colors relative p-0.5 ${
                    surpriseRounds ? 'bg-[#753BDB]' : 'bg-[#EAE1F0]'
                  }`}
                >
                  <div
                    className={`w-5 h-5 rounded-full bg-white transition-transform shadow-xs ${
                      surpriseRounds ? 'translate-x-5' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>

              {/* Random Turn Order */}
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-xs font-bold text-[#302044]">Random Player Turn Order</div>
                  <div className="text-[10px] text-[#796D87]">Spotlight random player each turn</div>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    playSound('tap');
                    setRandomPlayerOrder(!randomPlayerOrder);
                  }}
                  className={`w-11 h-6 rounded-full transition-colors relative p-0.5 ${
                    randomPlayerOrder ? 'bg-[#753BDB]' : 'bg-[#EAE1F0]'
                  }`}
                >
                  <div
                    className={`w-5 h-5 rounded-full bg-white transition-transform shadow-xs ${
                      randomPlayerOrder ? 'translate-x-5' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>

              {/* 18+ Adult Content Toggle */}
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-xs font-bold text-[#302044] flex items-center gap-1">
                    <span>18+ Adult Content</span>
                    <span className="text-[9px] px-1.5 py-0.2 rounded bg-[#E95757]/15 text-[#E95757] font-black">
                      18+
                    </span>
                  </div>
                  <div className="text-[10px] text-[#796D87]">Enables spicy late-night decks</div>
                </div>
                <button
                  type="button"
                  onClick={handleToggleAdultContent}
                  className={`w-11 h-6 rounded-full transition-colors relative p-0.5 ${
                    adultContentEnabled ? 'bg-[#E95757]' : 'bg-[#EAE1F0]'
                  }`}
                >
                  <div
                    className={`w-5 h-5 rounded-full bg-white transition-transform shadow-xs ${
                      adultContentEnabled ? 'translate-x-5' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>
            </div>

            {/* Content Boundaries Chips */}
            <div className="pt-2 border-t border-[#EAE1F0]">
              <span className="text-xs font-bold text-[#796D87] block mb-2">
                Party Safety & Boundaries
              </span>
              <div className="flex flex-wrap gap-1.5 mb-2">
                {STANDARD_BOUNDARIES.map((b, i) => {
                  const isActive = boundaries.includes(b);
                  return (
                    <button
                      key={`boundary-chip-${i}`}
                      type="button"
                      onClick={() => handleToggleBoundary(b)}
                      className={`text-[11px] font-bold px-3 py-1.5 rounded-full border transition-all ${
                        isActive
                          ? 'bg-[#36B77A]/15 border-[#36B77A] text-[#36B77A]'
                          : 'bg-[#FFF9F5] border-[#EAE1F0] text-[#796D87]'
                      }`}
                    >
                      {isActive ? '✓ ' : '+ '} {b}
                    </button>
                  );
                })}
              </div>

              {/* Add Custom Boundary */}
              <form onSubmit={handleAddCustomBoundary} className="flex gap-2">
                <input
                  type="text"
                  placeholder="Add custom comfort boundary..."
                  value={customBoundaryInput}
                  onChange={e => setCustomBoundaryInput(e.target.value)}
                  className="flex-1 px-3 py-1.5 rounded-full bg-[#FFF9F5] border border-[#EAE1F0] text-xs text-[#302044] focus:outline-none focus:border-[#753BDB]"
                />
                <button
                  type="submit"
                  className="px-3 py-1.5 rounded-full bg-[#753BDB] text-white text-xs font-bold shrink-0"
                >
                  Add
                </button>
              </form>
            </div>

            {/* House Rules Chips */}
            <div className="pt-2 border-t border-[#EAE1F0]">
              <span className="text-xs font-bold text-[#796D87] block mb-2">
                Optional House Rules
              </span>
              <div className="space-y-1.5">
                {AVAILABLE_HOUSE_RULES.map(rule => {
                  const isChecked = selectedHouseRules.includes(rule.id);
                  return (
                    <div
                      key={`house-rule-${rule.id}`}
                      onClick={() => handleToggleHouseRule(rule.id)}
                      className={`p-2.5 rounded-2xl border text-xs cursor-pointer flex items-center justify-between transition-colors ${
                        isChecked
                          ? 'bg-[#F2EAFE] border-[#753BDB] text-[#753BDB] font-bold'
                          : 'bg-[#FFF9F5] border-[#EAE1F0] text-[#302044]'
                      }`}
                    >
                      <div>
                        <div>{rule.label}</div>
                        <div className="text-[10px] text-[#796D87] font-normal">{rule.desc}</div>
                      </div>
                      {isChecked && <Check className="w-4 h-4 text-[#753BDB]" />}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </section>

        {/* 4. PACK PARTY: Multi-pack selection */}
        <section aria-label="Pack Party Selection">
          <div className="flex items-center justify-between mb-2.5">
            <div>
              <h3 className="font-heading font-black text-sm text-[#302044] flex items-center gap-1.5">
                <Layers className="w-4 h-4 text-[#48BDEB]" />
                <span>Pack Party · Deck Selection</span>
              </h3>
              <p className="text-[11px] text-[#796D87]">
                Combine decks into one master party pool
              </p>
            </div>

            <button
              type="button"
              onClick={handleSurpriseMePacks}
              className="text-[11px] font-heading font-extrabold text-[#753BDB] bg-white px-3 py-1.5 rounded-full border border-[#753BDB]/30 shadow-xs hover:bg-[#F2EAFE] transition-all flex items-center gap-1"
            >
              <Dice5 className="w-3.5 h-3.5 text-[#FF7139]" />
              <span>Surprise Me 🎲</span>
            </button>
          </div>

          <div className="grid grid-cols-2 gap-2.5">
            {packs.map(pack => {
              const isSelected = selectedPackIds.includes(pack.id);
              const isAdult = pack.category === 'adults';
              if (isAdult && !adultContentEnabled) return null;

              return (
                <motion.div
                  key={`setup-pack-${pack.id}`}
                  whileHover={{ y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleTogglePack(pack.id)}
                  className={`p-3.5 rounded-3xl border-2 text-left cursor-pointer transition-all flex flex-col justify-between relative overflow-hidden ${
                    isSelected
                      ? 'bg-white border-[#753BDB] shadow-playful ring-2 ring-[#753BDB]/20'
                      : 'bg-white/80 border-[#EAE1F0] opacity-85 hover:opacity-100'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-[#753BDB] to-[#F04491] flex items-center justify-center text-white text-base shadow-xs">
                        {pack.coverSticker || '🎉'}
                      </div>
                      <div className="flex items-center gap-1">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setPreviewingPack(pack);
                          }}
                          className="p-1 rounded-full text-[#796D87] hover:bg-[#F2EAFE]"
                          title="Preview Prompts"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </button>
                        <div
                          className={`w-5 h-5 rounded-full border flex items-center justify-center transition-colors ${
                            isSelected
                              ? 'bg-[#753BDB] border-[#753BDB] text-white'
                              : 'border-[#EAE1F0] bg-white'
                          }`}
                        >
                          {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                        </div>
                      </div>
                    </div>

                    <div className="font-heading font-black text-xs sm:text-sm text-[#302044]">
                      {pack.title}
                    </div>
                    <p className="text-[10px] text-[#796D87] line-clamp-1 mt-0.5">
                      {pack.description}
                    </p>
                  </div>

                  <div className="mt-3 pt-2 border-t border-[#EAE1F0] flex items-center justify-between text-[10px] font-bold text-[#796D87]">
                    <span>{pack.promptCount || 20} Cards</span>
                    <span className="capitalize text-[#753BDB]">{pack.category}</span>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </section>

        {/* 5. SIGNATURE DELIGHT & LIVE SUMMARY BAR */}
        <section aria-label="Signature Delight Controls" className="space-y-3">
          <div className="grid grid-cols-2 gap-2.5">
            <button
              type="button"
              onClick={handleMakeItChaotic}
              className="py-3 px-3 rounded-2xl bg-gradient-to-r from-[#FF7139] to-[#FFD447] text-[#302044] font-heading font-black text-xs shadow-sm flex items-center justify-center gap-1.5 active:scale-95 transition-all cursor-pointer"
            >
              <span>MAKE IT CHAOTIC 🤪</span>
            </button>

            <button
              type="button"
              onClick={handleDealersChoice}
              className="py-3 px-3 rounded-2xl bg-gradient-to-r from-[#753BDB] to-[#48BDEB] text-white font-heading font-black text-xs shadow-sm flex items-center justify-center gap-1.5 active:scale-95 transition-all cursor-pointer"
            >
              <span>DEALER'S CHOICE 🎲</span>
            </button>
          </div>

          {/* Dynamic Live Party Summary Card */}
          <div className="p-4 rounded-3xl bg-gradient-to-r from-[#F2EAFE] via-white to-[#FFF9F5] border-2 border-[#753BDB]/30 shadow-card">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <span className="text-2xl">🦊</span>
                <span className="font-heading font-black text-xs uppercase tracking-wider text-[#753BDB]">
                  Live Party Status
                </span>
              </div>
              <span className="text-xs font-heading font-black text-[#FF7139] tabular-nums">
                {estimatedDuration}
              </span>
            </div>

            <div className="grid grid-cols-3 gap-2 text-center text-xs mb-3">
              <div className="p-2 rounded-xl bg-white border border-[#EAE1F0]">
                <div className="font-heading font-black text-base text-[#302044] tabular-nums">
                  {players.length}
                </div>
                <div className="text-[10px] text-[#796D87]">Players</div>
              </div>

              <div className="p-2 rounded-xl bg-white border border-[#EAE1F0]">
                <div className="font-heading font-black text-base text-[#753BDB] tabular-nums">
                  {selectedPackIds.length}
                </div>
                <div className="text-[10px] text-[#796D87]">Packs Pool</div>
              </div>

              <div className="p-2 rounded-xl bg-white border border-[#EAE1F0]">
                <div className="font-heading font-black text-base text-[#F04491] capitalize">
                  {intensity}
                </div>
                <div className="text-[10px] text-[#796D87]">Spice Level</div>
              </div>
            </div>

            <div className="text-xs font-bold text-[#796D87] bg-white p-2.5 rounded-2xl border border-[#EAE1F0] flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#FFD447] shrink-0" />
              <span>{mascotReaction}</span>
            </div>
          </div>
        </section>
      </div>

      {/* Sticky Bottom Action Bar with Big START GAME CTA */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-white/95 backdrop-blur-md border-t border-[#EAE1F0] z-40 max-w-lg mx-auto shadow-2xl">
        <button
          type="button"
          onClick={handleStartGame}
          className="w-full py-4 px-6 rounded-full bg-gradient-to-r from-[#753BDB] via-[#F04491] to-[#FF7139] text-white font-heading font-black text-base shadow-playful flex items-center justify-center gap-2 active:scale-98 transition-transform cursor-pointer hover:opacity-95"
          aria-label="Start Game"
        >
          <Play className="w-5 h-5 fill-white" />
          <span>START PARTY GAME NOW!</span>
        </button>
      </div>

      {/* Avatar Picker Modal */}
      <AvatarPickerModal
        isOpen={!!avatarModalTargetPlayerId}
        currentAvatar={players.find(p => p.id === avatarModalTargetPlayerId)?.avatar || '🦊'}
        onClose={() => setAvatarModalTargetPlayerId(null)}
        onSelect={(avatar: string) => {
          if (avatarModalTargetPlayerId) {
            setPlayers(prev =>
              prev.map(p =>
                p.id === avatarModalTargetPlayerId ? { ...p, avatar } : p
              )
            );
            setAvatarModalTargetPlayerId(null);
            playSound('tap');
          }
        }}
      />

      {/* Age Confirmation Modal for 18+ Content */}
      <ConfirmModal
        isOpen={showAgeWarningModal}
        title="Adult Content (18+)"
        description="Adult content includes spicy romantic questions and late-night party themes. Everyone in your party must be 18+ and consent to adult topics."
        confirmLabel="I am 18+ & Agree"
        cancelLabel="Keep Safe (PG-13)"
        onConfirm={() => {
          setAdultContentEnabled(true);
          setShowAgeWarningModal(false);
          playSound('sparkle');
        }}
        onCancel={() => {
          setShowAgeWarningModal(false);
          setAdultContentEnabled(false);
        }}
      />

      {/* Reset Confirmation Dialog */}
      <ConfirmModal
        isOpen={showResetConfirm}
        title="Reset Game Setup?"
        description="This will restore all mode, rules, timer, and pack settings to defaults."
        confirmLabel="Reset Setup"
        cancelLabel="Keep Changes"
        isDestructive
        onConfirm={handleResetSettings}
        onCancel={() => setShowResetConfirm(false)}
      />

      {/* Pack Preview Modal */}
      <AnimatePresence>
        {previewingPack && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-sm rounded-3xl bg-white p-5 shadow-2xl relative text-left"
            >
              <button
                type="button"
                onClick={() => setPreviewingPack(null)}
                className="absolute top-4 right-4 p-1.5 rounded-full text-[#796D87] hover:bg-[#F2EAFE]"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="flex items-center gap-3 mb-3">
                <span className="text-3xl">{previewingPack.coverSticker || '🎉'}</span>
                <div>
                  <h4 className="font-heading font-black text-base text-[#302044]">
                    {previewingPack.title}
                  </h4>
                  <div className="text-[11px] text-[#796D87]">
                    {previewingPack.promptCount} Cards · by {previewingPack.creator.name}
                  </div>
                </div>
              </div>

              <p className="text-xs text-[#796D87] mb-4">
                {previewingPack.description}
              </p>

              <div className="text-xs font-heading font-black text-[#302044] mb-2">
                Sample Prompts:
              </div>
              <div className="space-y-2 mb-4">
                {previewingPack.samplePrompts.slice(0, 3).map((sp, idx) => (
                  <div
                    key={`preview-sample-${idx}`}
                    className="p-2.5 rounded-xl bg-[#FFF9F5] border border-[#EAE1F0] text-xs"
                  >
                    <span className="font-heading font-black uppercase text-[10px] text-[#753BDB] mr-1">
                      [{sp.type}]:
                    </span>
                    <span>{sp.text}</span>
                  </div>
                ))}
              </div>

              <button
                type="button"
                onClick={() => {
                  handleTogglePack(previewingPack.id);
                  setPreviewingPack(null);
                }}
                className={`w-full py-3 rounded-full text-xs font-heading font-black shadow-md ${
                  selectedPackIds.includes(previewingPack.id)
                    ? 'bg-[#EAE1F0] text-[#302044]'
                    : 'bg-[#753BDB] text-white'
                }`}
              >
                {selectedPackIds.includes(previewingPack.id)
                  ? 'Remove from Party Pool'
                  : 'Add to Party Pool ✓'}
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
