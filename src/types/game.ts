export type CategoryId = 
  | 'friends' 
  | 'couples' 
  | 'party' 
  | 'deep_talk'
  | 'family' 
  | 'icebreakers' 
  | 'adults' 
  | 'funny';

export type PromptType = 'truth' | 'dare';

export type IntensityLevel = 'chill' | 'funny' | 'spicy';

export interface PromptItem {
  id: string;
  category: CategoryId;
  type: PromptType;
  intensity: IntensityLevel;
  text: string;
  packId?: string;
  isCustom?: boolean;
  hint?: string;
  tags?: string[];
}

export interface Creator {
  id: string;
  name: string;
  avatar: string;
  bio: string;
  followersCount: number;
  isFollowed?: boolean;
}

export interface Review {
  id: string;
  userName: string;
  userAvatar: string;
  rating: number;
  date: string;
  comment: string;
  isReported?: boolean;
}

export interface Pack {
  id: string;
  title: string;
  description: string;
  category: CategoryId;
  icon: string;
  creator: Creator;
  promptCount: number;
  isPremium: boolean;
  price?: string;
  isUnlocked: boolean;
  rating: number;
  reviewsCount: number;
  isTrending?: boolean;
  isNew?: boolean;
  isCustom?: boolean;
  isDraft?: boolean;
  coverGradient: string;
  coverSticker?: string;
  minPlayers?: number;
  maxPlayers?: number;
  language?: string;
  samplePrompts: { type: PromptType; text: string; hint?: string }[];
  reviews?: Review[];
}

export interface Player {
  id: string;
  name: string;
  avatar: string;
  color: string;
  score: {
    truths: number;
    dares: number;
    skips: number;
  };
}

export interface GameSettings {
  category: CategoryId;
  mode: 'truth' | 'dare' | 'mixed';
  intensity: IntensityLevel;
  rounds: number; // 0 for endless
  timerEnabled: boolean;
  timerSeconds: number;
  skipLimit: number; // e.g. 2, 3, or 999 for unlimited
  randomPlayerOrder: boolean;
  adultContentEnabled: boolean;
  selectedPackIds: string[];
  players: Player[];
  boundaries?: string[];
  teamMode?: boolean;
  houseRules?: string[];
  surpriseRounds?: boolean;
  enableScoring?: boolean;
  customModeName?: string;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlocked: boolean;
  progress: number;
  maxProgress: number;
  category: string;
}

export interface GameSessionHistory {
  id: string;
  date: string;
  category: CategoryId;
  mode: string;
  intensity: IntensityLevel;
  totalRounds: number;
  completedTruths: number;
  completedDares: number;
  totalSkips: number;
  mvpPlayerName: string;
  mvpPlayerAvatar: string;
  players: {
    name: string;
    avatar: string;
    truths: number;
    dares: number;
    skips: number;
  }[];
}

export interface UserStats {
  totalPromptsPlayed: number;
  truthsAnswered: number;
  daresCompleted: number;
  skips: number;
  gamesFinished: number;
}

export interface UserProfile {
  id: string;
  nickname: string;
  email: string;
  avatar: string;
  role: 'guest' | 'user';
  onboardingCompleted: boolean;
  soundEnabled: boolean;
  soundVolume: number;
  hapticEnabled: boolean;
  theme: 'light' | 'dark';
  notificationsEnabled: boolean;
  language: string;
  adultContentEnabled: boolean;
  blockedCreatorIds: string[];
  streakDays: number;
  lastStreakDate: string;
  favoritePackIds: string[];
  purchasedPackIds: string[];
  completedDailyDate: string;
}

export interface CategoryInfo {
  id: CategoryId;
  name: string;
  tagline: string;
  description: string;
  icon: string;
  gradient: string;
  accentColor: string;
  bgLight: string;
  totalPrompts: number;
  samplePrompt: string;
  isAdult?: boolean;
}
