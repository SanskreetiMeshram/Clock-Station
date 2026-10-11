import { describe, it, expect } from 'vitest';
import { diagnoseMistake } from '../diagnose';

describe('diagnoseMistake diagnostic engine', () => {
  it('identifies correct answers', () => {
    const diag = diagnoseMistake({ h: 3, m: 15 }, { h: 3, m: 15 });
    expect(diag.category).toBe('correct');
  });

  it('identifies swapped hands mistakes', () => {
    // Target is 3:00 (h=3, m=0 -> hour hand at 3, minute hand at 12).
    // Swapped: child set h=12, m=15 (short hand at 12, long hand at 3).
    const diag = diagnoseMistake({ h: 3, m: 0 }, { h: 12, m: 15 });
    expect(diag.category).toBe('hands_swapped');
    expect(diag.highlightHand).toBe('both');
  });

  it('identifies off-by-5 mistakes', () => {
    // Target is 4:20, answer is 4:25
    const diag1 = diagnoseMistake({ h: 4, m: 20 }, { h: 4, m: 25 });
    expect(diag1.category).toBe('off_by_five');
    expect(diag1.highlightHand).toBe('minute');

    // Target is 4:00, answer is 4:55
    const diag2 = diagnoseMistake({ h: 4, m: 0 }, { h: 4, m: 55 });
    expect(diag2.category).toBe('off_by_five');
  });

  it('identifies mirror mistake (e.g. 20 min vs 40 min)', () => {
    // Target is 4:20, child set 4:40
    const diag = diagnoseMistake({ h: 4, m: 20 }, { h: 4, m: 40 });
    expect(diag.category).toBe('mirror');
    expect(diag.highlightHand).toBe('minute');
  });

  it('identifies hour-off mistake when minute is correct', () => {
    const diag = diagnoseMistake({ h: 4, m: 15 }, { h: 5, m: 15 });
    expect(diag.category).toBe('hour_off');
    expect(diag.highlightHand).toBe('hour');
  });

  it('identifies minute-off mistake when hour is correct', () => {
    const diag = diagnoseMistake({ h: 4, m: 15 }, { h: 4, m: 50 });
    expect(diag.category).toBe('minute_off');
    expect(diag.highlightHand).toBe('minute');
  });

  it('provides half-past hint for :30 target', () => {
    const diag = diagnoseMistake({ h: 4, m: 30 }, { h: 4, m: 15 });
    expect(diag.showHalfSlice).toBe(true);
  });
});
