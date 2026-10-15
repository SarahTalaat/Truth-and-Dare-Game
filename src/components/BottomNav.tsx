import React from 'react';
import { Home, Compass, PlusCircle, BookOpen, User } from 'lucide-react';
import { useGame } from '../context/GameContext';

export const BottomNav: React.FC = () => {
  const { activeTab, setActiveTab, currentScreen, setCurrentScreen, playSound } = useGame();

  // Hide bottom nav during active gameplay or onboarding
  if (currentScreen === 'game' || currentScreen === 'onboarding' || currentScreen === 'welcome_auth') return null;

  const tabs = [
    { id: 'home' as const, label: 'Home', icon: Home },
    { id: 'explore' as const, label: 'Explore', icon: Compass },
    { id: 'create' as const, label: 'Create', icon: PlusCircle },
    { id: 'library' as const, label: 'Library', icon: BookOpen },
    { id: 'profile' as const, label: 'Profile', icon: User },
  ];

  const handleTabClick = (tabId: 'home' | 'explore' | 'create' | 'library' | 'profile') => {
    playSound('tap');
    setActiveTab(tabId);
    if (currentScreen !== 'main_tabs') {
      setCurrentScreen('main_tabs');
    }
  };

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-xl border-t border-[#EAE1F0] max-w-lg mx-auto shadow-playful"
      style={{ paddingBottom: 'max(0.5rem, env(safe-area-inset-bottom))' }}
      aria-label="Main Navigation"
    >
      <div className="grid grid-cols-5 items-center h-16 px-1">
        {tabs.map(tab => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id && currentScreen === 'main_tabs';

          return (
            <button
              key={tab.id}
              onClick={() => handleTabClick(tab.id)}
              className={`flex flex-col items-center justify-center min-h-[44px] min-w-[44px] py-1 transition-all ${
                isActive ? 'text-[#753BDB] scale-105' : 'text-[#796D87] hover:text-[#302044]'
              }`}
            >
              <div
                className={`p-1.5 rounded-full transition-all ${
                  isActive ? 'bg-[#F2EAFE] ring-1 ring-[#753BDB]/20 text-[#753BDB]' : ''
                }`}
              >
                <Icon className="w-5 h-5" strokeWidth={isActive ? 2.5 : 2} />
              </div>
              <span className={`text-[11px] font-bold tracking-tight mt-0.5 whitespace-nowrap ${isActive ? 'text-[#753BDB]' : 'text-[#796D87]'}`}>
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
