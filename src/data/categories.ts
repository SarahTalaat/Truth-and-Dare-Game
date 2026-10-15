import { CategoryId, CategoryInfo } from '../types/game';

export const CATEGORIES: Record<CategoryId, CategoryInfo> = {
  friends: {
    id: 'friends',
    name: 'Friends',
    tagline: 'Inside jokes & unhinged chaos',
    description: 'Perfect for group hangs, road trips, and finding out what your best friends really think.',
    icon: 'Users',
    gradient: 'from-[#753BDB] to-[#F04491]', // Brand
    accentColor: '#753BDB',
    bgLight: '#F2EAFE',
    totalPrompts: 52,
    samplePrompt: 'Truth: Who in this room would survive the shortest amount of time in a zombie apocalypse?'
  },
  couples: {
    id: 'couples',
    name: 'Couples',
    tagline: 'Romance, butterflies & sweet secrets',
    description: 'Flirty questions, romantic dares, and spicy confessions designed for two lovers or double dates.',
    icon: 'Heart',
    gradient: 'from-[#F04491] to-[#FF7139]', // Truth
    accentColor: '#F04491',
    bgLight: 'rgba(240, 68, 145, 0.1)',
    totalPrompts: 48,
    samplePrompt: 'Dare: Whisper the sweetest compliment into your partner’s ear without laughing.'
  },
  party: {
    id: 'party',
    name: 'Party',
    tagline: 'High energy, loud laughs & wild dares',
    description: 'Turn any gathering into an unforgettable night. Physical challenges, hilarious impersonations, and room-wide dares.',
    icon: 'Sparkles',
    gradient: 'from-[#FF7139] via-[#FFD447] to-[#F04491]', // Party
    accentColor: '#FF7139',
    bgLight: 'rgba(255, 113, 57, 0.1)',
    totalPrompts: 60,
    samplePrompt: 'Dare: Do your best runway model walk across the room while giving high-fives.'
  },
  deep_talk: {
    id: 'deep_talk',
    name: 'Deep Talk',
    tagline: 'Heart-to-hearts & vulnerability',
    description: 'Soul-stirring questions, late-night philosophies, and meaningful conversations that forge deep bonds.',
    icon: 'Moon',
    gradient: 'from-[#48BDEB] to-[#753BDB]', // Deep Talk gradient
    accentColor: '#48BDEB',
    bgLight: 'rgba(72, 189, 235, 0.12)',
    totalPrompts: 48,
    samplePrompt: 'Truth: What is an emotional lesson you had to learn the hard way that changed who you are today?'
  },
  family: {
    id: 'family',
    name: 'Family',
    tagline: 'Wholesome, clean & all-ages fun',
    description: 'Lighthearted, giggly, and safe for all ages — from kids to grandparents at game nights and holiday dinners.',
    icon: 'Smile',
    gradient: 'from-[#FF7139] to-[#FFD447]', // Dare
    accentColor: '#FFD447',
    bgLight: 'rgba(255, 212, 71, 0.15)',
    totalPrompts: 45,
    samplePrompt: 'Dare: Speak in a friendly robot voice for the next two rounds!'
  },
  icebreakers: {
    id: 'icebreakers',
    name: 'Icebreakers',
    tagline: 'Zero awkwardness, pure connection',
    description: 'Breeze through new introductions, team outings, or first dates with clever low-pressure questions.',
    icon: 'Compass',
    gradient: 'from-[#48BDEB] to-[#753BDB]', // Dream
    accentColor: '#48BDEB',
    bgLight: 'rgba(72, 189, 235, 0.12)',
    totalPrompts: 40,
    samplePrompt: 'Truth: What is your most controversial opinion about a mainstream food?'
  },
  adults: {
    id: 'adults',
    name: 'Adults 18+',
    tagline: 'Spicy confessions & bold late-night dares',
    description: 'Unfiltered, cheeky, and daring prompts for grown-up parties and intimate gatherings. Adult-friendly yet non-explicit.',
    icon: 'Flame',
    gradient: 'from-[#753BDB] via-[#48BDEB] to-[#F04491]', // Playful
    accentColor: '#F04491',
    bgLight: '#F2EAFE',
    totalPrompts: 55,
    isAdult: true,
    samplePrompt: 'Dare: Let the person to your left text a spicy harmless emoji to your most recent chat.'
  },
  funny: {
    id: 'funny',
    name: 'Funny',
    tagline: 'Laugh-until-you-cry absurdity',
    description: 'Pure comedic gold, silly physical comedy, tongue twisters, and ridiculous hypothetical scenarios.',
    icon: 'Laugh',
    gradient: 'from-[#FF7139] to-[#FFD447]', // Dare
    accentColor: '#FF7139',
    bgLight: 'rgba(255, 113, 57, 0.1)',
    totalPrompts: 46,
    samplePrompt: 'Dare: Re-enact a dramatic soap opera breakup scene with an empty chair.'
  }
};

export const CATEGORY_LIST = Object.values(CATEGORIES);
