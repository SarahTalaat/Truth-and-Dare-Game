import React from 'react';
import { ArrowLeft, Volume2, VolumeX, Sparkles } from 'lucide-react';
import { useGame } from '../context/GameContext';

interface HeaderBarProps {
  title?: string;
  showBack?: boolean;
  onBack?: () => void;
  showSoundToggle?: boolean;
  rightAction?: React.ReactNode;
}

export const HeaderBar: React.FC<HeaderBarProps> = ({
  title,
  showBack = false,
  onBack,
  showSoundToggle = true,
  rightAction,
}) => {
  const { profile, updateProfile, playSound } = useGame();

  const handleToggleSound = () => {
    const nextState = !profile.soundEnabled;
    updateProfile({ soundEnabled: nextState });
    if (nextState) {
      playSound('tap');
    }
  };

  return (
    <header className="sticky top-0 z-30 flex items-center justify-between h-14 px-4 bg-[#FFF9F5]/90 backdrop-blur-md border-b border-[#EAE1F0] max-w-lg mx-auto w-full">
      <div className="flex items-center gap-2">
        {showBack ? (
          <button
            onClick={() => {
              playSound('tap');
              if (onBack) onBack();
            }}
            className="flex items-center justify-center w-10 h-10 rounded-full bg-white border border-[#EAE1F0] text-[#302044] hover:bg-[#F2EAFE] active:scale-95 transition-all shadow-sm"
            aria-label="Go back"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
        ) : (
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-[#753BDB] to-[#F04491] flex items-center justify-center text-white shadow-md shadow-[#753BDB]/25">
              <Sparkles className="w-4 h-4 text-[#FFD447]" />
            </div>
            <span className="font-heading font-extrabold text-xl tracking-tight bg-gradient-to-r from-[#753BDB] to-[#F04491] bg-clip-text text-transparent">
              Playful
            </span>
          </div>
        )}

        {title && (
          <h1 className="font-heading font-bold text-base text-[#302044] ml-2 truncate max-w-[200px]">
            {title}
          </h1>
        )}
      </div>

      <div className="flex items-center gap-2">
        {rightAction}

        {showSoundToggle && (
          <button
            onClick={handleToggleSound}
            className="flex items-center justify-center w-10 h-10 rounded-full bg-white border border-[#EAE1F0] text-[#302044] hover:bg-[#F2EAFE] active:scale-95 transition-all shadow-sm"
            aria-label={profile.soundEnabled ? 'Mute sound' : 'Unmute sound'}
          >
            {profile.soundEnabled ? (
              <Volume2 className="w-4 h-4 text-[#753BDB]" />
            ) : (
              <VolumeX className="w-4 h-4 text-[#796D87]" />
            )}
          </button>
        )}
      </div>
    </header>
  );
};
