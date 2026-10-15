import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, HelpCircle, Flame, Users, ArrowRight, Check } from 'lucide-react';
import { useGame } from '../context/GameContext';
import { BrandCatchphrase } from '../components/BrandCatchphrase';

export const OnboardingScreen: React.FC = () => {
  const { setCurrentScreen, playSound, updateProfile } = useGame();
  const [currentSlide, setCurrentSlide] = useState(0);

  const SLIDES = [
    {
      title: 'Real Truths',
      subtitle: 'Skip the small talk',
      description: 'Break the ice with hilarious confessions, intimate secrets, and thoughtful questions that reveal what your friends really think.',
      badge: 'TRUTH',
      gradient: 'from-[#F04491] to-[#FF7139]',
      icon: <HelpCircle className="w-12 h-12 text-white" />,
      sticker: '💖'
    },
    {
      title: 'Wild Dares',
      subtitle: 'Turn up the energy',
      description: 'Step up to unhinged physical challenges, runway struts, goofy impersonations, and room-wide laughter.',
      badge: 'DARE',
      gradient: 'from-[#FF7139] to-[#FFD447]',
      icon: <Flame className="w-12 h-12 text-[#302044]" />,
      sticker: '🔥'
    },
    {
      title: 'Party Your Way',
      subtitle: 'Custom decks & timers',
      description: 'Play with 2 to 20 friends, dial the spice level from Chill to Spicy, create your own custom decks, and never get bored.',
      badge: 'PARTY',
      gradient: 'from-[#753BDB] to-[#F04491]',
      icon: <Users className="w-12 h-12 text-white" />,
      sticker: '🎉'
    }
  ];

  const handleNext = () => {
    playSound('tap');
    if (currentSlide < SLIDES.length - 1) {
      setCurrentSlide(prev => prev + 1);
    } else {
      handleComplete();
    }
  };

  const handleSkip = () => {
    playSound('tap');
    handleComplete();
  };

  const handleComplete = () => {
    updateProfile({ onboardingCompleted: true });
    setCurrentScreen('welcome_auth');
  };

  const slide = SLIDES[currentSlide];

  return (
    <div className="min-h-screen bg-[#FFF9F5] text-[#302044] flex flex-col justify-between p-6 max-w-lg mx-auto">
      {/* Top Bar with Brand, Signature Catchphrase & Skip */}
      <div className="flex items-center justify-between pt-2">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-[#753BDB] to-[#F04491] flex items-center justify-center text-white shadow-sm">
            <Sparkles className="w-4 h-4 text-[#FFD447]" />
          </div>
          <span className="font-heading font-black text-xl text-[#753BDB]">
            Playful
          </span>
        </div>

        <div className="flex items-center gap-2">
          <BrandCatchphrase variant="badge" />
          <button
            onClick={handleSkip}
            className="text-xs font-bold text-[#796D87] hover:text-[#302044] py-1.5 px-3 rounded-full hover:bg-[#F2EAFE] transition-colors"
          >
            Skip
          </button>
        </div>
      </div>

      {/* Slide Visual Presentation */}
      <div className="my-auto py-6 flex flex-col items-center text-center">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentSlide}
            initial={{ opacity: 0, scale: 0.9, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: -15 }}
            transition={{ duration: 0.25 }}
            className="flex flex-col items-center"
          >
            {/* Visual Illustrated Card */}
            <div
              className={`w-64 h-64 rounded-3xl p-6 bg-gradient-to-br ${slide.gradient} shadow-playful flex flex-col items-center justify-between mb-8 relative border border-white/40`}
            >
              <div className="self-start px-3 py-1 rounded-full bg-black/20 text-white font-heading font-extrabold text-xs tracking-wider">
                {slide.badge}
              </div>

              <div className="text-6xl my-auto animate-bounce">
                {slide.sticker}
              </div>

              <div className="w-14 h-14 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center">
                {slide.icon}
              </div>
            </div>

            {/* Slide Title & Text */}
            <span className="text-xs font-extrabold uppercase tracking-widest text-[#753BDB] mb-1">
              {slide.subtitle}
            </span>
            <h2 className="font-heading font-black text-3xl text-[#302044] mb-3 leading-tight">
              {slide.title}
            </h2>
            <p className="text-sm text-[#796D87] max-w-xs mx-auto leading-relaxed">
              {slide.description}
            </p>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Bottom Controls: Indicators + Actions */}
      <div className="pb-4 space-y-5">
        {/* Step dots */}
        <div className="flex items-center justify-center gap-2">
          {SLIDES.map((_, i) => (
            <button
              key={`onboarding-dot-${i}`}
              onClick={() => {
                playSound('tap');
                setCurrentSlide(i);
              }}
              className={`h-2.5 rounded-full transition-all ${
                currentSlide === i
                  ? 'w-7 bg-[#753BDB]'
                  : 'w-2.5 bg-[#EAE1F0] hover:bg-[#796D87]/40'
              }`}
              aria-label={`Slide ${i + 1}`}
            />
          ))}
        </div>

        {/* Next / Get Started Pill Button */}
        <button
          onClick={handleNext}
          className="w-full py-4 rounded-full bg-gradient-to-r from-[#753BDB] via-[#F04491] to-[#FF7139] text-white font-heading font-extrabold text-base shadow-playful flex items-center justify-center gap-2 active:scale-98 transition-transform"
        >
          <span>{currentSlide === SLIDES.length - 1 ? 'Get Started' : 'Next'}</span>
          <ArrowRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};
