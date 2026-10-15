/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { GameProvider, useGame } from './context/GameContext';
import { OnboardingScreen } from './screens/OnboardingScreen';
import { WelcomeAuthScreen } from './screens/WelcomeAuthScreen';
import { HomeScreen } from './screens/HomeScreen';
import { ExploreScreen } from './screens/ExploreScreen';
import { CreatePackScreen } from './screens/CreatePackScreen';
import { LibraryScreen } from './screens/LibraryScreen';
import { ProfileScreen } from './screens/ProfileScreen';
import { GameSetupScreen } from './screens/GameSetupScreen';
import { GameScreen } from './screens/GameScreen';
import { BottomNav } from './components/BottomNav';
import { ReactionEngine } from './components/ReactionEngine';
import { LaunchSplash } from './components/LaunchSplash';
import { CatchphraseToast } from './components/CatchphraseToast';

const MainAppContent: React.FC = () => {
  const { currentScreen, activeTab, profile } = useGame();
  const [showSplash, setShowSplash] = useState(() => {
    try {
      // Show on launch unless already dismissed in this browser tab
      return !sessionStorage.getItem('playful_splash_dismissed');
    } catch {
      return true;
    }
  });

  useEffect(() => {
    const handleOpenSplash = () => {
      setShowSplash(true);
    };

    window.addEventListener('playful-open-splash', handleOpenSplash);
    return () => {
      window.removeEventListener('playful-open-splash', handleOpenSplash);
    };
  }, []);

  const handleDismissSplash = () => {
    setShowSplash(false);
    try {
      sessionStorage.setItem('playful_splash_dismissed', 'true');
    } catch {}
  };

  const renderScreen = () => {
    // 1. Initial Onboarding Flow (if not completed or explicitly chosen)
    if (currentScreen === 'onboarding') {
      return <OnboardingScreen />;
    }

    // 2. Welcome & Auth Flow
    if (currentScreen === 'welcome_auth') {
      return <WelcomeAuthScreen />;
    }

    // 3. Game Setup Flow
    if (currentScreen === 'setup') {
      return <GameSetupScreen />;
    }

    // 4. Active Gameplay Flow
    if (currentScreen === 'game') {
      return <GameScreen />;
    }

    // 5. Main 5-Tab Connected Flow
    switch (activeTab) {
      case 'home':
        return <HomeScreen />;
      case 'explore':
        return <ExploreScreen />;
      case 'create':
        return <CreatePackScreen />;
      case 'library':
        return <LibraryScreen />;
      case 'profile':
        return <ProfileScreen />;
      default:
        return <HomeScreen />;
    }
  };

  return (
    <div className="min-h-screen bg-[#F7EFE9] flex justify-center text-[#302044] font-sans selection:bg-[#F04491] selection:text-white">
      {/* Centered mobile viewport shell with subtle desk aura */}
      <div className="w-full max-w-lg min-h-screen bg-[#FFF9F5] shadow-2xl relative flex flex-col border-x border-[#EAE1F0]/60">
        {/* Animated Launch Splash with Mascot & Signature Catchphrase */}
        {showSplash && (
          <LaunchSplash onComplete={handleDismissSplash} />
        )}

        {renderScreen()}
        <BottomNav />
        <ReactionEngine 
          soundEnabled={profile.soundEnabled} 
          hapticEnabled={profile.hapticEnabled} 
        />
        <CatchphraseToast />
      </div>
    </div>
  );
};

export default function App() {
  return (
    <GameProvider>
      <MainAppContent />
    </GameProvider>
  );
}
