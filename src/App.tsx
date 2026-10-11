import { useState, useEffect } from 'react';
import { useProgress } from './hooks/useProgress';
import { useSound } from './hooks/useSound';
import { HomeScreen } from './components/screens/HomeScreen';
import { LevelMapScreen } from './components/screens/LevelMapScreen';
import { PlayScreen } from './components/screens/PlayScreen';
import { LevelCompleteScreen } from './components/screens/LevelCompleteScreen';
import { ParentPanel } from './components/screens/ParentPanel';
import { LEVEL_CONFIGS } from './logic/levels';

export type ScreenState = 'home' | 'map' | 'play' | 'complete';

export function App() {
  const {
    state,
    completeLevel,
    recordMistake,
    resetProgress,
    setSoundMuted,
    toggleLargeText,
    setCurrentLevel,
  } = useProgress();

  const {
    isMuted,
    toggleMute,
    playTick,
    playWhistle,
    playChuff,
    playBoing,
    playFanfare,
  } = useSound(state.soundMuted);

  const [currentScreen, setCurrentScreen] = useState<ScreenState>(() => {
    if (typeof window !== 'undefined') {
      const param = new URLSearchParams(window.location.search).get('screen');
      if (param === 'play' || param === 'map' || param === 'complete') return param as ScreenState;
    }
    return 'home';
  });
  const [activeLevelId, setActiveLevelId] = useState<number>(() => {
    if (typeof window !== 'undefined') {
      const lvl = parseInt(new URLSearchParams(window.location.search).get('level') || '', 10);
      if (lvl >= 1 && lvl <= 10) return lvl;
    }
    return state.currentLevel || 1;
  });
  const [lastLevelStars, setLastLevelStars] = useState<number>(3);
  const [showParentPanel, setShowParentPanel] = useState<boolean>(false);

  // Sync mute state with progress
  const handleToggleMute = () => {
    toggleMute();
    setSoundMuted(!isMuted);
  };

  // Sync large text CSS class on body
  useEffect(() => {
    if (state.largeText) {
      document.body.classList.add('large-text');
    } else {
      document.body.classList.remove('large-text');
    }
  }, [state.largeText]);

  // Total stars calculated across all completed levels
  const totalStars = Object.values(state.levels).reduce(
    (sum, lvl) => sum + (lvl.stars || 0),
    0
  );

  const handleStartLevel = (lvlId: number) => {
    setActiveLevelId(lvlId);
    setCurrentLevel(lvlId);
    setCurrentScreen('play');
  };

  const handleLevelComplete = (lvlId: number, starsEarned: number) => {
    completeLevel(lvlId, starsEarned);
    setLastLevelStars(starsEarned);
    playFanfare();
    setCurrentScreen('complete');
  };

  const currentLevelConfig = LEVEL_CONFIGS[activeLevelId] || LEVEL_CONFIGS[1];

  return (
    <div className="min-h-screen bg-[#8EDBFF] text-[#1B2A49] font-display antialiased">
      {currentScreen === 'home' && (
        <HomeScreen
          onPlay={() => handleStartLevel(state.currentLevel || 1)}
          onOpenMap={() => setCurrentScreen('map')}
          onOpenParentPanel={() => setShowParentPanel(true)}
          isMuted={isMuted}
          onToggleMute={handleToggleMute}
          onToggleTextSize={toggleLargeText}
          totalStars={totalStars}
        />
      )}

      {currentScreen === 'map' && (
        <LevelMapScreen
          levelsProgress={state.levels}
          onSelectLevel={(lvlId) => handleStartLevel(lvlId)}
          onBackToHome={() => setCurrentScreen('home')}
        />
      )}

      {currentScreen === 'play' && (
        <PlayScreen
          key={activeLevelId}
          levelId={activeLevelId}
          onLevelComplete={handleLevelComplete}
          onPause={() => setCurrentScreen('map')}
          onRecordMistake={recordMistake}
          isMuted={isMuted}
          onToggleMute={handleToggleMute}
          onToggleTextSize={toggleLargeText}
          totalStars={totalStars}
          showDigitalBubble={state.showDigitalBubble}
          playTick={playTick}
          playWhistle={playWhistle}
          playChuff={playChuff}
          playBoing={playBoing}
        />
      )}

      {currentScreen === 'complete' && (
        <LevelCompleteScreen
          levelId={activeLevelId}
          levelName={currentLevelConfig.name}
          starsEarned={lastLevelStars}
          locomotiveStyle={currentLevelConfig.locomotiveStyle}
          onNextLevel={() => {
            const nextLvl = Math.min(10, activeLevelId + 1);
            handleStartLevel(nextLvl);
          }}
          onReplay={() => handleStartLevel(activeLevelId)}
          onBackToMap={() => setCurrentScreen('map')}
        />
      )}

      {/* Parent / Teacher Modal */}
      {showParentPanel && (
        <ParentPanel
          levelsProgress={state.levels}
          mistakeHistory={state.mistakeHistory}
          onResetProgress={() => {
            resetProgress();
            setActiveLevelId(1);
          }}
          onClose={() => setShowParentPanel(false)}
        />
      )}
    </div>
  );
}

export default App;
