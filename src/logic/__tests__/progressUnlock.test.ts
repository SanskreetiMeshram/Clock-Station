import { describe, it, expect, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useProgress } from '../../hooks/useProgress';

describe('useProgress all levels unlocked', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('all 10 levels are unlocked by default', () => {
    const { result } = renderHook(() => useProgress());

    for (let lvl = 1; lvl <= 10; lvl++) {
      expect(result.current.state.levels[lvl]?.unlocked).toBe(true);
    }
  });

  it('unlocks all levels even if previous localStorage had them locked', () => {
    // Simulate legacy stored progress with levels 2-10 locked
    const legacyState = {
      currentLevel: 1,
      levels: {
        1: { levelId: 1, unlocked: true, completed: true, stars: 3, bestAccuracy: 100, attemptsCount: 1 },
        2: { levelId: 2, unlocked: false, completed: false, stars: 0, bestAccuracy: 0, attemptsCount: 0 },
        3: { levelId: 3, unlocked: false, completed: false, stars: 0, bestAccuracy: 0, attemptsCount: 0 },
      },
      mistakeHistory: [],
      soundMuted: false,
      largeText: false,
      showDigitalBubble: true,
    };
    localStorage.setItem('clock_station_progress_v1', JSON.stringify(legacyState));

    const { result } = renderHook(() => useProgress());

    for (let lvl = 1; lvl <= 10; lvl++) {
      expect(result.current.state.levels[lvl]?.unlocked).toBe(true);
    }
    // Completed state and stars from level 1 should be preserved
    expect(result.current.state.levels[1]?.completed).toBe(true);
    expect(result.current.state.levels[1]?.stars).toBe(3);
  });

  it('unlockAllLevels explicitly guarantees all levels 1..10 are unlocked', () => {
    const { result } = renderHook(() => useProgress());

    act(() => {
      result.current.unlockAllLevels();
    });

    for (let lvl = 1; lvl <= 10; lvl++) {
      expect(result.current.state.levels[lvl]?.unlocked).toBe(true);
    }
  });
});
