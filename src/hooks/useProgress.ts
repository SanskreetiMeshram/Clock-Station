import { useState, useEffect, useCallback } from 'react';
import type { UserProgressState, MistakeRecord, MistakeCategory, ClockTime } from '../types/game';

const STORAGE_KEY = 'clock_station_progress_v1';

const DEFAULT_STATE: UserProgressState = {
  currentLevel: 1,
  levels: {
    1: { levelId: 1, unlocked: true, completed: false, stars: 0, bestAccuracy: 0, attemptsCount: 0 },
    2: { levelId: 2, unlocked: false, completed: false, stars: 0, bestAccuracy: 0, attemptsCount: 0 },
    3: { levelId: 3, unlocked: false, completed: false, stars: 0, bestAccuracy: 0, attemptsCount: 0 },
    4: { levelId: 4, unlocked: false, completed: false, stars: 0, bestAccuracy: 0, attemptsCount: 0 },
    5: { levelId: 5, unlocked: false, completed: false, stars: 0, bestAccuracy: 0, attemptsCount: 0 },
    6: { levelId: 6, unlocked: false, completed: false, stars: 0, bestAccuracy: 0, attemptsCount: 0 },
    7: { levelId: 7, unlocked: false, completed: false, stars: 0, bestAccuracy: 0, attemptsCount: 0 },
    8: { levelId: 8, unlocked: false, completed: false, stars: 0, bestAccuracy: 0, attemptsCount: 0 },
    9: { levelId: 9, unlocked: false, completed: false, stars: 0, bestAccuracy: 0, attemptsCount: 0 },
    10: { levelId: 10, unlocked: false, completed: false, stars: 0, bestAccuracy: 0, attemptsCount: 0 },
  },
  mistakeHistory: [],
  soundMuted: false,
  largeText: false,
  showDigitalBubble: true,
};

function loadStoredState(): UserProgressState {
  if (typeof window === 'undefined') return DEFAULT_STATE;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_STATE;
    const parsed = JSON.parse(raw);
    return {
      ...DEFAULT_STATE,
      ...parsed,
      levels: {
        ...DEFAULT_STATE.levels,
        ...(parsed.levels || {}),
      },
    };
  } catch {
    return DEFAULT_STATE;
  }
}

export function useProgress() {
  const [state, setState] = useState<UserProgressState>(loadStoredState);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {
      // Storage quota or disabled
    }
  }, [state]);

  const completeLevel = useCallback((levelId: number, stars: number) => {
    setState((prev) => {
      const nextLevelId = levelId + 1;
      const prevLvl = prev.levels[levelId] || {
        levelId,
        unlocked: true,
        completed: false,
        stars: 0,
        bestAccuracy: 0,
        attemptsCount: 0,
      };

      const updatedLevel = {
        ...prevLvl,
        completed: true,
        stars: Math.max(prevLvl.stars, stars),
        attemptsCount: prevLvl.attemptsCount + 1,
      };

      const newLevels = {
        ...prev.levels,
        [levelId]: updatedLevel,
      };

      // Unlock next level if stars >= 1 and next level exists
      if (stars >= 1 && nextLevelId <= 10) {
        newLevels[nextLevelId] = {
          ...(newLevels[nextLevelId] || {
            levelId: nextLevelId,
            completed: false,
            stars: 0,
            bestAccuracy: 0,
            attemptsCount: 0,
          }),
          unlocked: true,
        };
      }

      return {
        ...prev,
        currentLevel: nextLevelId <= 10 ? nextLevelId : levelId,
        levels: newLevels,
      };
    });
  }, []);

  const recordMistake = useCallback(
    (levelId: number, category: MistakeCategory, target: ClockTime, answer: ClockTime) => {
      const record: MistakeRecord = {
        levelId,
        category,
        target,
        answer,
        timestamp: Date.now(),
      };
      setState((prev) => ({
        ...prev,
        mistakeHistory: [record, ...prev.mistakeHistory].slice(0, 100), // Keep last 100
      }));
    },
    []
  );

  const resetProgress = useCallback(() => {
    setState(DEFAULT_STATE);
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {}
  }, []);

  const setSoundMuted = useCallback((muted: boolean) => {
    setState((prev) => ({ ...prev, soundMuted: muted }));
  }, []);

  const toggleLargeText = useCallback(() => {
    setState((prev) => ({ ...prev, largeText: !prev.largeText }));
  }, []);

  const toggleDigitalBubble = useCallback(() => {
    setState((prev) => ({ ...prev, showDigitalBubble: !prev.showDigitalBubble }));
  }, []);

  const setCurrentLevel = useCallback((lvl: number) => {
    setState((prev) => ({ ...prev, currentLevel: lvl }));
  }, []);

  return {
    state,
    completeLevel,
    recordMistake,
    resetProgress,
    setSoundMuted,
    toggleLargeText,
    toggleDigitalBubble,
    setCurrentLevel,
  };
}
