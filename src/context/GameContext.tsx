import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  GameSettings, 
  Player, 
  PromptItem, 
  Pack, 
  UserProfile, 
  UserStats, 
  PromptType, 
  CategoryId, 
  IntensityLevel,
  GameSessionHistory
} from '../types/game';
import { INITIAL_PROMPTS, INITIAL_PACKS, DAILY_CHALLENGES } from '../data/prompts';
import { soundManager } from '../utils/sound';
import confetti from 'canvas-confetti';

interface GameSessionState {
  isActive: boolean;
  settings: GameSettings;
  currentPlayerIndex: number;
  currentRound: number;
  activePrompt: PromptItem | null;
  step: 'choice' | 'revealed';
  chosenType: PromptType | null;
  history: PromptItem[];
  isCompleted: boolean;
}

interface GameContextType {
  // Navigation / views
  activeTab: 'home' | 'explore' | 'create' | 'library' | 'profile';
  setActiveTab: (tab: 'home' | 'explore' | 'create' | 'library' | 'profile') => void;
  currentScreen: 'onboarding' | 'welcome_auth' | 'main_tabs' | 'setup' | 'game';
  setCurrentScreen: (screen: 'onboarding' | 'welcome_auth' | 'main_tabs' | 'setup' | 'game') => void;
  selectedExploreCategory: CategoryId | null;
  setSelectedExploreCategory: (cat: CategoryId | null) => void;
  selectedPackDetailId: string | null;
  setSelectedPackDetailId: (id: string | null) => void;

  // Profile & stats
  profile: UserProfile;
  stats: UserStats;
  updateProfile: (updates: Partial<UserProfile>) => void;
  resetAllData: () => void;

  // Packs & Custom Prompts
  packs: Pack[];
  customPrompts: PromptItem[];
  allPrompts: PromptItem[];
  toggleFavoritePack: (packId: string) => void;
  unlockPack: (packId: string) => void;
  createPack: (title: string, description: string, category: CategoryId, truths: string[], dares: string[]) => void;
  deletePack: (packId: string) => void;
  toggleFollowCreator: (creatorId: string) => void;

  // Game History (Prompt 6 & 11)
  gameHistory: GameSessionHistory[];
  saveSessionToHistory: () => void;
  deleteHistoryItem: (id: string) => void;
  clearAllHistory: () => void;

  // Game setup & session
  gameSettings: GameSettings;
  setGameSettings: React.Dispatch<React.SetStateAction<GameSettings>>;
  session: GameSessionState | null;
  startNewGame: (customSettings?: Partial<GameSettings>) => void;
  selectGameChoice: (type: PromptType) => void;
  rerollCurrentPrompt: () => void;
  completeCurrentPrompt: () => void;
  skipCurrentPrompt: () => void;
  exitGameSession: () => void;

  // Daily challenge
  todayChallenge: typeof DAILY_CHALLENGES[0];
  isDailyCompletedToday: boolean;
  completeDaily: () => void;

  // Audio / feedback helpers
  playSound: (type: 'tap' | 'flip' | 'complete' | 'skip' | 'sparkle' | 'truth_reveal' | 'dare_reveal') => void;
}

const DEFAULT_PLAYERS: Player[] = [
  { id: 'p1', name: 'Alex', avatar: '🦊', color: '#753BDB', score: { truths: 0, dares: 0, skips: 0 } },
  { id: 'p2', name: 'Jordan', avatar: '🐱', color: '#F04491', score: { truths: 0, dares: 0, skips: 0 } },
  { id: 'p3', name: 'Taylor', avatar: '🐼', color: '#FF7139', score: { truths: 0, dares: 0, skips: 0 } },
  { id: 'p4', name: 'Morgan', avatar: '🦁', color: '#48BDEB', score: { truths: 0, dares: 0, skips: 0 } },
];

const DEFAULT_SETTINGS: GameSettings = {
  category: 'friends',
  mode: 'mixed',
  intensity: 'chill',
  rounds: 10,
  timerEnabled: false,
  timerSeconds: 30,
  skipLimit: 3,
  randomPlayerOrder: false,
  adultContentEnabled: false,
  selectedPackIds: ['pack-classic'],
  players: DEFAULT_PLAYERS,
};

const DEFAULT_PROFILE: UserProfile = {
  id: 'usr-1',
  nickname: 'PartyStar',
  email: 'partystar@playful.app',
  avatar: '🦊',
  role: 'user',
  onboardingCompleted: true,
  soundEnabled: true,
  soundVolume: 0.8,
  hapticEnabled: true,
  theme: 'light',
  notificationsEnabled: true,
  language: 'English',
  adultContentEnabled: false,
  blockedCreatorIds: [],
  streakDays: 3,
  lastStreakDate: new Date().toISOString().slice(0, 10),
  favoritePackIds: ['pack-classic'],
  purchasedPackIds: ['pack-classic'],
  completedDailyDate: '',
};

const DEFAULT_STATS: UserStats = {
  totalPromptsPlayed: 18,
  truthsAnswered: 10,
  daresCompleted: 8,
  skips: 2,
  gamesFinished: 3,
};

const INITIAL_HISTORY: GameSessionHistory[] = [
  {
    id: 'hist-1',
    date: 'Yesterday at 9:30 PM',
    category: 'party',
    mode: 'Mixed',
    intensity: 'funny',
    totalRounds: 10,
    completedTruths: 6,
    completedDares: 4,
    totalSkips: 1,
    mvpPlayerName: 'Alex',
    mvpPlayerAvatar: '🦊',
    players: [
      { name: 'Alex', avatar: '🦊', truths: 3, dares: 3, skips: 0 },
      { name: 'Jordan', avatar: '🐱', truths: 2, dares: 1, skips: 1 },
      { name: 'Taylor', avatar: '🐼', truths: 1, dares: 0, skips: 0 },
    ]
  }
];

const GameContext = createContext<GameContextType | undefined>(undefined);

export const GameProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Navigation State
  const [activeTab, setActiveTab] = useState<'home' | 'explore' | 'create' | 'library' | 'profile'>('home');
  const [currentScreen, setCurrentScreen] = useState<'onboarding' | 'welcome_auth' | 'main_tabs' | 'setup' | 'game'>('main_tabs');
  const [selectedExploreCategory, setSelectedExploreCategory] = useState<CategoryId | null>(null);
  const [selectedPackDetailId, setSelectedPackDetailId] = useState<string | null>(null);

  // Persistence: Profile & Stats
  const [profile, setProfile] = useState<UserProfile>(() => {
    try {
      const saved = localStorage.getItem('playful_profile_v2');
      return saved ? JSON.parse(saved) : DEFAULT_PROFILE;
    } catch {
      return DEFAULT_PROFILE;
    }
  });

  const [stats, setStats] = useState<UserStats>(() => {
    try {
      const saved = localStorage.getItem('playful_stats_v2');
      return saved ? JSON.parse(saved) : DEFAULT_STATS;
    } catch {
      return DEFAULT_STATS;
    }
  });

  // Packs & Custom Prompts
  const [packs, setPacks] = useState<Pack[]>(() => {
    try {
      const saved = localStorage.getItem('playful_packs_v2');
      if (!saved) return INITIAL_PACKS;
      const parsed = JSON.parse(saved);
      const seen = new Set<string>();
      const unique = parsed.filter((p: Pack) => {
        if (!p?.id || seen.has(p.id)) return false;
        seen.add(p.id);
        return true;
      });
      return unique.length > 0 ? unique : INITIAL_PACKS;
    } catch {
      return INITIAL_PACKS;
    }
  });

  const [customPrompts, setCustomPrompts] = useState<PromptItem[]>(() => {
    try {
      const saved = localStorage.getItem('playful_custom_prompts_v2');
      if (!saved) return [];
      const parsed = JSON.parse(saved);
      const seen = new Set<string>();
      return parsed.filter((p: PromptItem) => {
        if (!p?.id || seen.has(p.id)) return false;
        seen.add(p.id);
        return true;
      });
    } catch {
      return [];
    }
  });

  // Game History
  const [gameHistory, setGameHistory] = useState<GameSessionHistory[]>(() => {
    try {
      const saved = localStorage.getItem('playful_history_v2');
      if (!saved) return INITIAL_HISTORY;
      const parsed = JSON.parse(saved);
      const seen = new Set<string>();
      const unique = parsed.filter((h: GameSessionHistory) => {
        if (!h?.id || seen.has(h.id)) return false;
        seen.add(h.id);
        return true;
      });
      return unique.length > 0 ? unique : INITIAL_HISTORY;
    } catch {
      return INITIAL_HISTORY;
    }
  });

  // Game Settings & Active Session
  const [gameSettings, setGameSettings] = useState<GameSettings>(DEFAULT_SETTINGS);
  const [session, setSession] = useState<GameSessionState | null>(null);

  // Volume synchronization
  useEffect(() => {
    soundManager.setVolume(profile.soundVolume ?? 0.8);
  }, [profile.soundVolume]);

  // Sync to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('playful_profile_v2', JSON.stringify(profile));
    } catch {}
  }, [profile]);

  useEffect(() => {
    try {
      localStorage.setItem('playful_stats_v2', JSON.stringify(stats));
    } catch {}
  }, [stats]);

  useEffect(() => {
    try {
      localStorage.setItem('playful_packs_v2', JSON.stringify(packs));
    } catch {}
  }, [packs]);

  useEffect(() => {
    try {
      localStorage.setItem('playful_custom_prompts_v2', JSON.stringify(customPrompts));
    } catch {}
  }, [customPrompts]);

  useEffect(() => {
    try {
      localStorage.setItem('playful_history_v2', JSON.stringify(gameHistory));
    } catch {}
  }, [gameHistory]);

  const allPrompts = [...INITIAL_PROMPTS, ...customPrompts];

  // Daily Challenge Logic
  const todayDateStr = new Date().toISOString().slice(0, 10);
  const dateHash = todayDateStr.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const todayChallenge = DAILY_CHALLENGES[dateHash % DAILY_CHALLENGES.length];
  const isDailyCompletedToday = profile.completedDailyDate === todayDateStr;

  const playSound = (type: 'tap' | 'flip' | 'complete' | 'skip' | 'sparkle' | 'truth_reveal' | 'dare_reveal') => {
    if (!profile.soundEnabled) return;
    switch (type) {
      case 'tap':
        soundManager.playTap(true);
        break;
      case 'flip':
        soundManager.playCardFlip(true);
        break;
      case 'truth_reveal':
        soundManager.playTruthReveal(true);
        break;
      case 'dare_reveal':
        soundManager.playDareReveal(true);
        break;
      case 'complete':
        soundManager.playComplete(true);
        break;
      case 'skip':
        soundManager.playSkip(true);
        break;
      case 'sparkle':
        soundManager.playSparkle(true);
        break;
    }
    if (profile.hapticEnabled) {
      soundManager.triggerHaptic(true);
    }
  };

  const updateProfile = (updates: Partial<UserProfile>) => {
    setProfile(prev => ({ ...prev, ...updates }));
  };

  const completeDaily = () => {
    if (isDailyCompletedToday) return;
    playSound('complete');
    playSound('sparkle');
    confetti({
      particleCount: 60,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#753BDB', '#F04491', '#FF7139', '#FFD447', '#48BDEB']
    });

    setProfile(prev => {
      const newStreak = prev.streakDays + 1;
      return {
        ...prev,
        streakDays: newStreak,
        completedDailyDate: todayDateStr,
        lastStreakDate: todayDateStr
      };
    });

    setStats(prev => ({
      ...prev,
      totalPromptsPlayed: prev.totalPromptsPlayed + 1,
      [todayChallenge.type === 'truth' ? 'truthsAnswered' : 'daresCompleted']:
        prev[todayChallenge.type === 'truth' ? 'truthsAnswered' : 'daresCompleted'] + 1
    }));
  };

  const toggleFavoritePack = (packId: string) => {
    playSound('tap');
    setProfile(prev => {
      const exists = prev.favoritePackIds.includes(packId);
      return {
        ...prev,
        favoritePackIds: exists
          ? prev.favoritePackIds.filter(id => id !== packId)
          : [...prev.favoritePackIds, packId]
      };
    });
  };

  const unlockPack = (packId: string) => {
    playSound('sparkle');
    confetti({
      particleCount: 50,
      spread: 60,
      origin: { y: 0.7 },
      colors: ['#FFD447', '#FF7139', '#F04491']
    });
    setPacks(prev =>
      prev.map(p => (p.id === packId ? { ...p, isUnlocked: true } : p))
    );
    setProfile(prev => ({
      ...prev,
      purchasedPackIds: prev.purchasedPackIds.includes(packId)
        ? prev.purchasedPackIds
        : [...prev.purchasedPackIds, packId]
    }));
  };

  const toggleFollowCreator = (creatorId: string) => {
    playSound('tap');
    setPacks(prev =>
      prev.map(p => {
        if (p.creator.id === creatorId) {
          const nextFollowed = !p.creator.isFollowed;
          return {
            ...p,
            creator: {
              ...p.creator,
              isFollowed: nextFollowed,
              followersCount: nextFollowed
                ? p.creator.followersCount + 1
                : p.creator.followersCount - 1
            }
          };
        }
        return p;
      })
    );
  };

  const createPack = (
    title: string,
    description: string,
    category: CategoryId,
    truths: string[],
    dares: string[]
  ) => {
    const newPackId = `custom-pack-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
    const newCustomPrompts: PromptItem[] = [
      ...truths.map((t, i) => ({
        id: `${newPackId}-t-${i}`,
        category,
        type: 'truth' as const,
        intensity: 'chill' as IntensityLevel,
        text: t,
        packId: newPackId,
        isCustom: true
      })),
      ...dares.map((d, i) => ({
        id: `${newPackId}-d-${i}`,
        category,
        type: 'dare' as const,
        intensity: 'spicy' as IntensityLevel,
        text: d,
        packId: newPackId,
        isCustom: true
      }))
    ];

    const newPack: Pack = {
      id: newPackId,
      title,
      description,
      category,
      icon: 'Sparkles',
      creator: {
        id: profile.id,
        name: profile.nickname,
        avatar: profile.avatar,
        bio: 'Playful community creator crafting bespoke truth or dare party decks.',
        followersCount: 1,
        isFollowed: false,
      },
      promptCount: truths.length + dares.length,
      isPremium: false,
      isUnlocked: true,
      isCustom: true,
      rating: 5.0,
      reviewsCount: 1,
      coverGradient: 'from-[#753BDB] via-[#F04491] to-[#FFD447]',
      coverSticker: '🎉',
      samplePrompts: [
        ...(truths[0] ? [{ type: 'truth' as const, text: truths[0] }] : []),
        ...(dares[0] ? [{ type: 'dare' as const, text: dares[0] }] : [])
      ]
    };

    setCustomPrompts(prev => [...prev, ...newCustomPrompts]);
    setPacks(prev => [newPack, ...prev]);
    playSound('sparkle');
    confetti({
      particleCount: 50,
      spread: 55,
      origin: { y: 0.65 },
      colors: ['#753BDB', '#F04491', '#48BDEB']
    });
  };

  const deletePack = (packId: string) => {
    playSound('tap');
    setPacks(prev => prev.filter(p => p.id !== packId));
    setCustomPrompts(prev => prev.filter(p => p.packId !== packId));
  };

  const saveSessionToHistory = () => {
    if (!session) return;
    const sorted = [...session.settings.players].sort(
      (a, b) => (b.score.truths + b.score.dares) - (a.score.truths + a.score.dares)
    );
    const top = sorted[0];

    const totalT = session.settings.players.reduce((sum, p) => sum + p.score.truths, 0);
    const totalD = session.settings.players.reduce((sum, p) => sum + p.score.dares, 0);
    const totalS = session.settings.players.reduce((sum, p) => sum + p.score.skips, 0);

    const historyItem: GameSessionHistory = {
      id: `hist-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      date: new Date().toLocaleDateString(undefined, {
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      }),
      category: session.settings.category,
      mode: session.settings.mode,
      intensity: session.settings.intensity,
      totalRounds: session.currentRound,
      completedTruths: totalT,
      completedDares: totalD,
      totalSkips: totalS,
      mvpPlayerName: top?.name || 'Party MVP',
      mvpPlayerAvatar: top?.avatar || '🦊',
      players: session.settings.players.map(p => ({
        name: p.name,
        avatar: p.avatar,
        truths: p.score.truths,
        dares: p.score.dares,
        skips: p.score.skips
      }))
    };

    setGameHistory(prev => [historyItem, ...prev]);
  };

  const deleteHistoryItem = (id: string) => {
    playSound('skip');
    setGameHistory(prev => prev.filter(h => h.id !== id));
  };

  const clearAllHistory = () => {
    playSound('skip');
    setGameHistory([]);
  };

  const resetAllData = () => {
    playSound('skip');
    setProfile(DEFAULT_PROFILE);
    setStats(DEFAULT_STATS);
    setPacks(INITIAL_PACKS);
    setCustomPrompts([]);
    setGameHistory([]);
    setSession(null);
    localStorage.clear();
  };

  const getRandomPrompt = (
    type: PromptType,
    category: CategoryId,
    intensity: IntensityLevel,
    excludeIds: string[] = []
  ): PromptItem => {
    // 1. Determine active pack IDs from current session or fallback
    const activePackIds = session?.settings.selectedPackIds || gameSettings.selectedPackIds || [];
    const isAdultAllowed = session?.settings.adultContentEnabled ?? gameSettings.adultContentEnabled;

    // Filter candidate prompts respecting adult content boundaries
    let baseCandidates = allPrompts.filter(p => {
      if (!isAdultAllowed && (p.category === 'adults' || p.tags?.includes('18+') || p.tags?.includes('spicy_adult'))) {
        return false;
      }
      return true;
    });

    // 2. Filter by active selected packs if specified
    if (activePackIds.length > 0) {
      const packCandidates = baseCandidates.filter(p => p.packId && activePackIds.includes(p.packId));
      if (packCandidates.length > 0) {
        baseCandidates = packCandidates;
      }
    }

    // 3. Match type, category, intensity, and non-exhausted
    let pool = baseCandidates.filter(
      p => p.type === type && p.category === category && p.intensity === intensity && !excludeIds.includes(p.id)
    );

    // 4. Fallback: match type and category without strict intensity
    if (pool.length === 0) {
      pool = baseCandidates.filter(
        p => p.type === type && p.category === category && !excludeIds.includes(p.id)
      );
    }

    // 5. Fallback: match type across all candidate packs without strict category
    if (pool.length === 0) {
      pool = baseCandidates.filter(p => p.type === type && !excludeIds.includes(p.id));
    }

    // 6. If all prompts in this session have been exhausted, recycle the entire pool
    if (pool.length === 0) {
      pool = baseCandidates.filter(p => p.type === type);
    }

    // Ultimate fallback
    if (pool.length === 0) {
      pool = INITIAL_PROMPTS.filter(p => p.type === type);
    }

    const randomIndex = Math.floor(Math.random() * pool.length);
    return pool[randomIndex] || INITIAL_PROMPTS[0];
  };

  const startNewGame = (customSettings?: Partial<GameSettings>) => {
    const finalSettings = {
      ...gameSettings,
      ...customSettings,
      players: (customSettings?.players || gameSettings.players).map(p => ({
        ...p,
        score: { truths: 0, dares: 0, skips: 0 }
      }))
    };

    setGameSettings(finalSettings);
    playSound('tap');

    const initialType = finalSettings.mode === 'mixed' ? null : finalSettings.mode;
    const initialPrompt = initialType
      ? getRandomPrompt(initialType, finalSettings.category, finalSettings.intensity, [])
      : null;

    setSession({
      isActive: true,
      settings: finalSettings,
      currentPlayerIndex: 0,
      currentRound: 1,
      activePrompt: initialPrompt,
      step: finalSettings.mode === 'mixed' ? 'choice' : 'revealed',
      chosenType: initialType,
      history: initialPrompt ? [initialPrompt] : [],
      isCompleted: false
    });

    if (initialType) {
      setTimeout(() => {
        playSound(initialType === 'truth' ? 'truth_reveal' : 'dare_reveal');
      }, 150);
    }

    setCurrentScreen('game');
  };

  const selectGameChoice = (type: PromptType) => {
    if (!session) return;
    playSound(type === 'truth' ? 'truth_reveal' : 'dare_reveal');
    const excludeIds = session.history.map(h => h.id);
    const prompt = getRandomPrompt(
      type,
      session.settings.category,
      session.settings.intensity,
      excludeIds
    );

    setSession(prev => {
      if (!prev) return null;
      return {
        ...prev,
        step: 'revealed',
        chosenType: type,
        activePrompt: prompt,
        history: [...prev.history, prompt]
      };
    });
  };

  const rerollCurrentPrompt = () => {
    if (!session || !session.chosenType) return;
    playSound(session.chosenType === 'truth' ? 'truth_reveal' : 'dare_reveal');
    const excludeIds = session.history.map(h => h.id);
    const newPrompt = getRandomPrompt(
      session.chosenType,
      session.settings.category,
      session.settings.intensity,
      excludeIds
    );

    setSession(prev => {
      if (!prev) return null;
      return {
        ...prev,
        activePrompt: newPrompt,
        history: [...prev.history, newPrompt]
      };
    });
  };

  const advanceTurn = (wasCompleted: boolean) => {
    if (!session) return;
    const { currentPlayerIndex, currentRound, settings } = session;

    const updatedPlayers = settings.players.map((p, idx) => {
      if (idx !== currentPlayerIndex) return p;
      if (wasCompleted) {
        return {
          ...p,
          score: {
            ...p.score,
            truths: session.chosenType === 'truth' ? p.score.truths + 1 : p.score.truths,
            dares: session.chosenType === 'dare' ? p.score.dares + 1 : p.score.dares,
          }
        };
      } else {
        return {
          ...p,
          score: {
            ...p.score,
            skips: p.score.skips + 1
          }
        };
      }
    });

    const nextPlayerIndex = (currentPlayerIndex + 1) % settings.players.length;
    const isNewRound = nextPlayerIndex === 0;
    const nextRound = isNewRound ? currentRound + 1 : currentRound;

    const isGameFinished = settings.rounds > 0 && isNewRound && currentRound >= settings.rounds;

    if (isGameFinished) {
      playSound('complete');
      playSound('sparkle');
      confetti({
        particleCount: 100,
        spread: 90,
        origin: { y: 0.5 },
        colors: ['#753BDB', '#F04491', '#FF7139', '#FFD447', '#48BDEB']
      });

      setStats(prev => ({
        ...prev,
        gamesFinished: prev.gamesFinished + 1
      }));

      setSession(prev => {
        if (!prev) return null;
        return {
          ...prev,
          isCompleted: true,
          settings: { ...prev.settings, players: updatedPlayers }
        };
      });
      return;
    }

    const nextType = settings.mode === 'mixed' ? null : settings.mode;
    const excludeIds = session.history.map(h => h.id);
    const nextPrompt = nextType
      ? getRandomPrompt(nextType, settings.category, settings.intensity, excludeIds)
      : null;

    setSession(prev => {
      if (!prev) return null;
      return {
        ...prev,
        settings: { ...prev.settings, players: updatedPlayers },
        currentPlayerIndex: nextPlayerIndex,
        currentRound: nextRound,
        step: settings.mode === 'mixed' ? 'choice' : 'revealed',
        chosenType: nextType,
        activePrompt: nextPrompt,
        history: nextPrompt ? [...prev.history, nextPrompt] : prev.history
      };
    });

    if (nextType) {
      setTimeout(() => {
        playSound(nextType === 'truth' ? 'truth_reveal' : 'dare_reveal');
      }, 150);
    }
  };

  const completeCurrentPrompt = () => {
    if (!session) return;
    playSound('complete');
    confetti({
      particleCount: 40,
      spread: 50,
      origin: { y: 0.65 },
      colors: ['#753BDB', '#F04491', '#FFD447']
    });

    setStats(prev => ({
      ...prev,
      totalPromptsPlayed: prev.totalPromptsPlayed + 1,
      [session.chosenType === 'truth' ? 'truthsAnswered' : 'daresCompleted']:
        prev[session.chosenType === 'truth' ? 'truthsAnswered' : 'daresCompleted'] + 1
    }));

    advanceTurn(true);
  };

  const skipCurrentPrompt = () => {
    if (!session) return;
    playSound('skip');

    setStats(prev => ({
      ...prev,
      totalPromptsPlayed: prev.totalPromptsPlayed + 1,
      skips: prev.skips + 1
    }));

    advanceTurn(false);
  };

  const exitGameSession = () => {
    playSound('tap');
    saveSessionToHistory();
    setSession(null);
    setCurrentScreen('main_tabs');
  };

  return (
    <GameContext.Provider
      value={{
        activeTab,
        setActiveTab,
        currentScreen,
        setCurrentScreen,
        selectedExploreCategory,
        setSelectedExploreCategory,
        selectedPackDetailId,
        setSelectedPackDetailId,
        profile,
        stats,
        updateProfile,
        resetAllData,
        packs,
        customPrompts,
        allPrompts,
        toggleFavoritePack,
        unlockPack,
        createPack,
        deletePack,
        toggleFollowCreator,
        gameHistory,
        saveSessionToHistory,
        deleteHistoryItem,
        clearAllHistory,
        gameSettings,
        setGameSettings,
        session,
        startNewGame,
        selectGameChoice,
        rerollCurrentPrompt,
        completeCurrentPrompt,
        skipCurrentPrompt,
        exitGameSession,
        todayChallenge,
        isDailyCompletedToday,
        completeDaily,
        playSound,
      }}
    >
      {children}
    </GameContext.Provider>
  );
};

export const useGame = () => {
  const context = useContext(GameContext);
  if (!context) {
    throw new Error('useGame must be used within a GameProvider');
  }
  return context;
};
