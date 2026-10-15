import { PromptItem, Pack, Creator } from '../types/game';

export const CREATORS: Record<string, Creator> = {
  maya: {
    id: 'creator-maya',
    name: 'Maya Lin',
    avatar: '🦊',
    bio: 'Party curator & comedian. Designing viral games for unforgettable living room memories.',
    followersCount: 14200,
    isFollowed: true,
  },
  leo: {
    id: 'creator-leo',
    name: 'Leo Vance',
    avatar: '🦁',
    bio: 'Late night conversation host. Obsessed with deep questions and hilarious social experiments.',
    followersCount: 8900,
    isFollowed: false,
  },
  cupid: {
    id: 'creator-cupid',
    name: 'Cupid Club',
    avatar: '🐱',
    bio: 'Relationship coaches & hopeless romantics crafting sparks for couples worldwide.',
    followersCount: 23100,
    isFollowed: true,
  },
  family: {
    id: 'creator-family',
    name: 'Sunny Family Play',
    avatar: '🐼',
    bio: 'All-ages family fun creators. 100% wholesome, silly, and safe for all generations.',
    followersCount: 11400,
    isFollowed: false,
  }
};

export const INITIAL_PACKS: Pack[] = [
  {
    id: 'pack-classic',
    title: 'Classic Icebreakers',
    description: 'The definitive kickoff collection. Fun, approachable questions and light dares to get everyone laughing without pressure.',
    category: 'icebreakers',
    icon: 'Compass',
    creator: CREATORS.maya,
    promptCount: 40,
    isPremium: false,
    isUnlocked: true,
    rating: 4.9,
    reviewsCount: 312,
    isTrending: true,
    coverGradient: 'from-[#48BDEB] to-[#753BDB]',
    coverSticker: '🎉',
    minPlayers: 2,
    maxPlayers: 12,
    language: 'English',
    samplePrompts: [
      { type: 'truth', text: 'What is the most ridiculous purchase you made in the last 6 months?', hint: 'Think late-night online shopping impulse!' },
      { type: 'dare', text: 'Give a 45-second dramatic movie trailer voiceover about the person sitting across from you.', hint: 'Use your deepest, most serious cinema voice.' },
      { type: 'truth', text: 'What is a popular trend that you secretly think is completely overrated?' }
    ],
    reviews: [
      { id: 'r1', userName: 'Sarah K.', userAvatar: '🐱', rating: 5, date: '2 days ago', comment: 'Broke the ice immediately at our new apartment housewarming!' },
      { id: 'r2', userName: 'Devon M.', userAvatar: '🐼', rating: 5, date: '1 week ago', comment: 'Super witty questions, zero awkwardness.' }
    ]
  },
  {
    id: 'pack-wild-night',
    title: 'Wild Night Out',
    description: 'High energy party dares, bold confessions, and riotous challenges for unforgettable late evenings.',
    category: 'party',
    icon: 'Sparkles',
    creator: CREATORS.maya,
    promptCount: 45,
    isPremium: false,
    isUnlocked: true,
    rating: 4.8,
    reviewsCount: 284,
    isTrending: true,
    coverGradient: 'from-[#FF7139] via-[#FFD447] to-[#F04491]',
    coverSticker: '🔥',
    minPlayers: 3,
    maxPlayers: 16,
    language: 'English',
    samplePrompts: [
      { type: 'dare', text: 'Do your best runway model walk across the living room and strike a high-fashion pose.', hint: 'Commit 100% to the facial expression!' },
      { type: 'truth', text: 'Have you ever lied about your age, name, or job to seem cooler at a party?', hint: 'Spill the alias!' },
      { type: 'dare', text: 'Sing the chorus of a 2000s pop anthem using only animal sounds.' }
    ],
    reviews: [
      { id: 'r3', userName: 'Marcus T.', userAvatar: '🦁', rating: 5, date: '3 days ago', comment: 'Our Friday game night was tears-of-laughter level fun.' }
    ]
  },
  {
    id: 'pack-couples-heat',
    title: 'Romantic Sparks',
    description: 'Flirty secrets, intimate truths, and playful dares crafted for couples wanting to draw closer.',
    category: 'couples',
    icon: 'Heart',
    creator: CREATORS.cupid,
    promptCount: 38,
    isPremium: true,
    price: '$2.99',
    isUnlocked: false,
    rating: 4.9,
    reviewsCount: 418,
    isNew: true,
    coverGradient: 'from-[#F04491] to-[#FF7139]',
    coverSticker: '💖',
    minPlayers: 2,
    maxPlayers: 4,
    language: 'English',
    samplePrompts: [
      { type: 'truth', text: 'What was the exact moment you realized you had real feelings for your partner?', hint: 'Don’t skip the tiny details!' },
      { type: 'dare', text: 'Maintain uninterrupted eye contact with your partner for 30 seconds without smiling.', hint: 'Blinking is allowed, laughing is not!' }
    ],
    reviews: [
      { id: 'r4', userName: 'Elena & Jay', userAvatar: '🦄', rating: 5, date: 'Yesterday', comment: 'Made our date night so meaningful and playful.' }
    ]
  },
  {
    id: 'pack-adults-after-dark',
    title: 'After Dark Confessions',
    description: 'Spicy late-night honesty and daring group challenges for adults (18+). Bold, cheeky, and non-explicit.',
    category: 'adults',
    icon: 'Flame',
    creator: CREATORS.leo,
    promptCount: 42,
    isPremium: true,
    price: '$3.99',
    isUnlocked: false,
    rating: 4.7,
    reviewsCount: 195,
    isTrending: true,
    coverGradient: 'from-[#753BDB] via-[#48BDEB] to-[#F04491]',
    coverSticker: '🌙',
    minPlayers: 2,
    maxPlayers: 10,
    language: 'English',
    samplePrompts: [
      { type: 'truth', text: 'What is the boldest romantic move you ever made that actually paid off?', hint: 'Confidence is key.' },
      { type: 'dare', text: 'Let the player on your right choose a harmless flirty nickname you must respond to for 3 rounds.' }
    ]
  },
  {
    id: 'pack-family-fiesta',
    title: 'Wholesome Family Hour',
    description: 'G-rated hilarity, silly physical challenges, and heartwarming stories for all generations.',
    category: 'family',
    icon: 'Smile',
    creator: CREATORS.family,
    promptCount: 36,
    isPremium: false,
    isUnlocked: true,
    rating: 4.9,
    reviewsCount: 154,
    coverGradient: 'from-[#FF7139] to-[#FFD447]',
    coverSticker: '🌈',
    minPlayers: 2,
    maxPlayers: 20,
    language: 'English',
    samplePrompts: [
      { type: 'dare', text: 'Speak like a friendly robot for the next two rounds of the game!', hint: 'Beep boop!' },
      { type: 'truth', text: 'If you could have any superhero power for family chores, what would it be?' }
    ]
  },
  {
    id: 'pack-funny-chaos',
    title: 'Unhinged Comedy Club',
    description: 'Absurd hypothetical debates, goofy impersonations, and laughing fits that will make your stomach hurt.',
    category: 'funny',
    icon: 'Laugh',
    creator: CREATORS.maya,
    promptCount: 34,
    isPremium: false,
    isUnlocked: true,
    rating: 4.8,
    reviewsCount: 201,
    coverGradient: 'from-[#FF7139] to-[#FFD447]',
    coverSticker: '⚡',
    minPlayers: 2,
    maxPlayers: 14,
    language: 'English',
    samplePrompts: [
      { type: 'dare', text: 'Do an infomercial trying to sell the object immediately to your left for 45 seconds.', hint: 'Use cheesy marketing catchphrases!' },
      { type: 'truth', text: 'What is the funniest misunderstanding you’ve ever had in a text conversation?' }
    ]
  },
  {
    id: 'pack-deep-talk',
    title: 'Late Night Vulnerability',
    description: 'Soulful questions, deep reflections, and meaningful connections designed to turn surface-level talk into unforgettable bonding.',
    category: 'deep_talk',
    icon: 'Moon',
    creator: CREATORS.leo,
    promptCount: 48,
    isPremium: false,
    isUnlocked: true,
    rating: 4.9,
    reviewsCount: 382,
    isTrending: true,
    coverGradient: 'from-[#48BDEB] to-[#753BDB]',
    coverSticker: '🌙',
    minPlayers: 2,
    maxPlayers: 8,
    language: 'English',
    samplePrompts: [
      { type: 'truth', text: 'What is an emotional life lesson you had to learn the hard way that made you who you are today?', hint: 'Think about a pivotal turning point in your life.' },
      { type: 'truth', text: 'What is something you wish people understood about you without you having to explain it?' },
      { type: 'dare', text: 'Look someone in the circle in the eyes and share what you think their greatest unrecognized strength is.' }
    ],
    reviews: [
      { id: 'r5', userName: 'Maya C.', userAvatar: '🦊', rating: 5, date: '3 days ago', comment: 'Brought our friend group closer than we have been in years.' }
    ]
  }
];

export const INITIAL_PROMPTS: PromptItem[] = [
  // --- FRIENDS ---
  { id: 'f-1', category: 'friends', type: 'truth', intensity: 'chill', text: 'What is the most ridiculous purchase you made in the last 6 months?', hint: 'Don’t be shy, we all buy silly things.' },
  { id: 'f-2', category: 'friends', type: 'truth', intensity: 'chill', text: 'If you could swap lives with anyone in this room for 24 hours, who would it be and why?' },
  { id: 'f-3', category: 'friends', type: 'dare', intensity: 'chill', text: 'Give a 45-second dramatic movie trailer voiceover about the person sitting across from you.' },
  { id: 'f-4', category: 'friends', type: 'truth', intensity: 'funny', text: 'Who in this group would you trust least to babysit your pet for a weekend?' },
  { id: 'f-5', category: 'friends', type: 'dare', intensity: 'funny', text: 'Let the player on your right draw a fake mustache or beauty mark on your face with an eyebrow pencil or washable marker.' },
  { id: 'f-6', category: 'friends', type: 'truth', intensity: 'spicy', text: 'What was your honest first impression of the person sitting across from you?' },
  { id: 'f-7', category: 'friends', type: 'dare', intensity: 'spicy', text: 'Show the group the last three photos in your camera roll without skipping.' },

  // --- COUPLES ---
  { id: 'cp-1', category: 'couples', type: 'truth', intensity: 'chill', text: 'What was the exact moment you realized you had real feelings for your partner?' },
  { id: 'cp-2', category: 'couples', type: 'dare', intensity: 'chill', text: 'Give your partner a sincere 60-second appreciation speech highlighting three things you love.' },
  { id: 'cp-3', category: 'couples', type: 'truth', intensity: 'funny', text: 'What is the funniest or weirdest pet name you have ever secretly considered calling your partner?' },
  { id: 'cp-4', category: 'couples', type: 'dare', intensity: 'funny', text: 'Slow dance together for 45 seconds while humming your own imaginary soundtrack.' },
  { id: 'cp-5', category: 'couples', type: 'truth', intensity: 'spicy', text: 'What outfit or look on your partner drives you absolutely crazy in the best way?' },
  { id: 'cp-6', category: 'couples', type: 'dare', intensity: 'spicy', text: 'Whisper your top romantic secret or wish into your partner’s ear.' },

  // --- PARTY ---
  { id: 'p-1', category: 'party', type: 'dare', intensity: 'chill', text: 'Do your best runway model walk across the living room and strike a high-fashion pose.' },
  { id: 'p-2', category: 'party', type: 'truth', intensity: 'chill', text: 'What is the most embarrassing song currently saved in your liked songs?' },
  { id: 'p-3', category: 'party', type: 'dare', intensity: 'funny', text: 'Impersonate a famous celebrity or movie character until someone in the room guesses correctly.' },
  { id: 'p-4', category: 'party', type: 'truth', intensity: 'funny', text: 'What is the worst fashion trend you fully participated in with pride?' },
  { id: 'p-5', category: 'party', type: 'dare', intensity: 'spicy', text: 'Show everyone your most unhinged dance move with 100% committed energy for 20 seconds.' },
  { id: 'p-6', category: 'party', type: 'truth', intensity: 'spicy', text: 'Have you ever lied about your age, name, or job to seem cooler at a party?' },

  // --- DEEP TALK ---
  { id: 'dt-1', category: 'deep_talk', type: 'truth', intensity: 'chill', text: 'What is an emotional life lesson you had to learn the hard way that made you who you are today?', hint: 'Think about a pivotal turning point in your life.' },
  { id: 'dt-2', category: 'deep_talk', type: 'truth', intensity: 'chill', text: 'What is something you wish people understood about you without you having to explain it?', hint: 'Something quiet or subtle about how you move through the world.' },
  { id: 'dt-3', category: 'deep_talk', type: 'dare', intensity: 'chill', text: 'Share one genuine, vulnerable insecurity you used to hide, and tell the group how you overcome it.', hint: 'Real courage is being honest with friends.' },
  { id: 'dt-4', category: 'deep_talk', type: 'truth', intensity: 'funny', text: 'If your inner inner monologue was broadcast on a podcast right now, what would listeners hear?', hint: 'The real unfiltered brain chatter.' },
  { id: 'dt-5', category: 'deep_talk', type: 'dare', intensity: 'funny', text: 'Give a 30-second passionate TED talk arguing why something completely trivial is actually deeply profound.', hint: 'For example: the existential sadness of a dropped ice cream cone.' },
  { id: 'dt-6', category: 'deep_talk', type: 'truth', intensity: 'spicy', text: 'Who in your past do you still owe an unsaid apology or unsaid thank you to, and why haven’t you said it?', hint: 'Speak from the heart.' },
  { id: 'dt-7', category: 'deep_talk', type: 'dare', intensity: 'spicy', text: 'Look someone in the circle in the eyes and share what you think their greatest unrecognized strength is.', hint: 'No jokes, pure genuine appreciation.' },

  // --- FAMILY ---
  { id: 'fam-1', category: 'family', type: 'truth', intensity: 'chill', text: 'What is your favorite family holiday tradition or meal of the year?' },
  { id: 'fam-2', category: 'family', type: 'dare', intensity: 'chill', text: 'Talk like a friendly robot for the next two rounds of the game!' },
  { id: 'fam-3', category: 'family', type: 'truth', intensity: 'funny', text: 'If you could have any superhero power for family chores, what would it be?' },
  { id: 'fam-4', category: 'family', type: 'dare', intensity: 'funny', text: 'Do your best impression of your favorite animal, including sounds and movements.' },

  // --- ICEBREAKERS ---
  { id: 'ice-1', category: 'icebreakers', type: 'truth', intensity: 'chill', text: 'What childhood hobby or dream do you wish you had held on to as an adult?' },
  { id: 'ice-2', category: 'icebreakers', type: 'dare', intensity: 'chill', text: 'High-five every person in the room while saying one genuine compliment to each.' },
  { id: 'ice-3', category: 'icebreakers', type: 'truth', intensity: 'funny', text: 'What is a movie everyone claims to love that you secretly think is boring?' },

  // --- ADULTS 18+ ---
  { id: 'ad-1', category: 'adults', type: 'truth', intensity: 'chill', text: 'What is the most daring romantic text you have sent and immediately turned your phone over?' },
  { id: 'ad-2', category: 'adults', type: 'dare', intensity: 'funny', text: 'Call someone not in this room and tell them you just won an imaginary award for being attractive.' },
  { id: 'ad-3', category: 'adults', type: 'truth', intensity: 'spicy', text: 'What is a spicy relationship rule you used to have that you completely abandoned?' },
  { id: 'ad-4', category: 'adults', type: 'dare', intensity: 'spicy', text: 'Maintain eye contact with the player of your choice for 20 seconds with flirty intensity.' },

  // --- FUNNY ---
  { id: 'fn-1', category: 'funny', type: 'dare', intensity: 'chill', text: 'Speak only in rhymes for your next 3 turns.' },
  { id: 'fn-2', category: 'funny', type: 'truth', intensity: 'funny', text: 'What is the weirdest thing you did when nobody was looking?' },
  { id: 'fn-3', category: 'funny', type: 'dare', intensity: 'funny', text: 'Do your best impression of a vacuum cleaner trying its absolute hardest.' },
  { id: 'fn-4', category: 'funny', type: 'dare', intensity: 'spicy', text: 'Re-enact a dramatic soap opera breakup scene with an empty chair.' }
];

export const DAILY_CHALLENGES = [
  {
    id: 'daily-1',
    type: 'truth' as const,
    category: 'icebreakers' as const,
    intensity: 'chill' as const,
    text: 'What is one weird skill or talent you have that almost nobody knows about?'
  },
  {
    id: 'daily-2',
    type: 'dare' as const,
    category: 'funny' as const,
    intensity: 'chill' as const,
    text: 'Send a voicemail to a close friend telling them an absurd fictional breaking news headline with a straight face.'
  },
  {
    id: 'daily-3',
    type: 'truth' as const,
    category: 'friends' as const,
    intensity: 'spicy' as const,
    text: 'What is something you used to be very insecure about, but now you actually appreciate in yourself?'
  }
];
