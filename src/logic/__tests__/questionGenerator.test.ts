import { describe, it, expect } from 'vitest';
import { addMinutes, isCorrect } from '../clockMath';
import { generateQuestionsForLevel } from '../questionGenerator';

describe('questionGenerator logic', () => {
  it('is deterministic with a fixed seed', () => {
    const run1 = generateQuestionsForLevel(2, 4242);
    const run2 = generateQuestionsForLevel(2, 4242);
    expect(run1).toEqual(run2);
  });

  it('generates Level 1 questions with m = 0 (whole hours)', () => {
    const questions = generateQuestionsForLevel(1, 101);
    expect(questions.length).toBe(6);
    questions.forEach((q) => {
      expect(q.targetTime.m).toBe(0);
      expect(q.targetTime.h).toBeGreaterThanOrEqual(1);
      expect(q.targetTime.h).toBeLessThanOrEqual(12);
      expect(q.clockMode).toBe('simple');
    });
  });

  it('generates Level 2 questions with m = 30 (half past)', () => {
    const questions = generateQuestionsForLevel(2, 202);
    expect(questions.length).toBe(6);
    questions.forEach((q) => {
      expect(q.targetTime.m).toBe(30);
      expect(q.targetTime.h).toBeGreaterThanOrEqual(1);
      expect(q.targetTime.h).toBeLessThanOrEqual(12);
      expect(q.clockMode).toBe('simple');
    });
  });

  it('generates Level 3 questions with m in [15, 45]', () => {
    const questions = generateQuestionsForLevel(3, 303);
    expect(questions.length).toBe(6);
    questions.forEach((q) => {
      expect([15, 45]).toContain(q.targetTime.m);
      expect(q.targetTime.h).toBeGreaterThanOrEqual(1);
      expect(q.targetTime.h).toBeLessThanOrEqual(12);
      expect(q.clockMode).toBe('simple');
    });
  });

  it('generates Level 4 questions at 5-minute increments', () => {
    const questions = generateQuestionsForLevel(4, 404);
    expect(questions.length).toBe(6);
    questions.forEach((q) => {
      expect(q.targetTime.m % 5).toBe(0);
      expect(q.clockMode).toBe('full');
    });
  });

  it('generates Level 5 questions with tricky non-5 minutes and distinct initial hands', () => {
    const questions = generateQuestionsForLevel(5, 505);
    expect(questions.length).toBe(6);
    questions.forEach((q) => {
      expect(q.targetTime.m).toBeGreaterThanOrEqual(1);
      expect(q.targetTime.m).toBeLessThanOrEqual(59);
      expect(q.targetTime.m % 5).not.toBe(0);
      expect(q.snapStep).toBe(1);
      expect(q.initialTime).toBeDefined();
      expect(isCorrect(q.targetTime, q.initialTime!)).toBe(false);
    });
    // Should include verbal "before/to" and "past" clues
    expect(questions.some((q) => /before|to/.test(q.promptText))).toBe(true);
    expect(questions.some((q) => /past/.test(q.promptText))).toBe(true);
  });

  it('generates Level 6 Read Mode questions with precision 1-min times and 4 unique close choices', () => {
    const questions = generateQuestionsForLevel(6, 606);
    expect(questions.length).toBe(6);
    questions.forEach((q) => {
      expect(q.type).toBe('read_clock');
      expect(q.snapStep).toBe(1);
      expect(q.targetTime.m % 5).not.toBe(0);
      expect(q.choices).toBeDefined();
      expect(q.choices?.length).toBe(4);
      const hasTarget = q.choices?.some(
        (c) => c.h % 12 === q.targetTime.h % 12 && c.m === q.targetTime.m
      );
      expect(hasTarget).toBe(true);
      const uniqueStrings = new Set(q.choices?.map((c) => `${c.h % 12}:${c.m}`));
      expect(uniqueStrings.size).toBe(4);
    });
  });

  it('generates Level 7 compound forward and reverse elapsed time questions', () => {
    const questions = generateQuestionsForLevel(7, 707);
    expect(questions.length).toBe(6);
    questions.forEach((q) => {
      expect(q.type).toBe('journey_elapsed');
      expect(q.durationMinutes).toBeGreaterThanOrEqual(60);
      expect(q.snapStep).toBe(5);
      expect(q.allowVisualHints).toBe(false);
      if (q.direction === 'backward') {
        expect(q.arrivalTime).toBeDefined();
        const expectedDep = addMinutes(q.arrivalTime!, -q.durationMinutes!);
        expect(isCorrect(expectedDep, q.targetTime)).toBe(true);
      } else {
        expect(q.departureTime).toBeDefined();
        const expectedArr = addMinutes(q.departureTime!, q.durationMinutes!);
        expect(isCorrect(expectedArr, q.targetTime)).toBe(true);
      }
    });
    expect(questions.some((q) => q.direction === 'backward')).toBe(true);
  });

  it('generates Level 8 hour-crossing expert elapsed questions with quarter dial and 1-min snap', () => {
    const questions = generateQuestionsForLevel(8, 808);
    expect(questions.length).toBe(6);
    questions.forEach((q) => {
      expect(q.type).toBe('journey_elapsed');
      expect(q.dialStyle).toBe('quarters');
      expect(q.snapStep).toBe(1);
      expect(q.allowVisualHints).toBe(false);
      expect(q.durationMinutes).toBeDefined();
      if (q.direction === 'backward') {
        expect(q.arrivalTime).toBeDefined();
        expect(q.targetTime.m + q.durationMinutes!).toBeGreaterThanOrEqual(60);
      } else {
        expect(q.departureTime).toBeDefined();
        expect(q.departureTime!.m + q.durationMinutes!).toBeGreaterThanOrEqual(60);
      }
    });
    expect(questions.some((q) => Boolean(q.legBreakdownText))).toBe(true);
    expect(questions.some((q) => q.direction === 'backward')).toBe(true);
  });

  it('generates Level 9 Twin Clocks with 24-hour boards, offset duration puzzles, and quarter-dial reads', () => {
    const questions = generateQuestionsForLevel(9, 909);
    expect(questions.length).toBe(6);
    questions.forEach((q) => {
      expect(q.dialStyle).toBe('quarters');
      expect(q.snapStep).toBe(1);
      expect(q.allowVisualHints).toBe(false);
    });
    expect(questions.some((q) => q.reference24h === true)).toBe(true);
    expect(questions.some((q) => q.type === 'twin_duration')).toBe(true);
    expect(questions.some((q) => q.type === 'read_clock')).toBe(true);
  });

  it('generates Level 10 Grand Station Master with 8 hard ticks_only challenges', () => {
    const questions = generateQuestionsForLevel(10, 1010);
    expect(questions.length).toBe(8);
    questions.forEach((q) => {
      expect(q.dialStyle).toBe('ticks_only');
      expect(q.snapStep).toBe(1);
      expect(q.allowVisualHints).toBe(false);
    });
    expect(questions.some((q) => q.reference24h === true)).toBe(true);
    expect(questions.some((q) => q.type === 'twin_duration')).toBe(true);
    expect(questions.some((q) => q.direction === 'backward')).toBe(true);
  });
});
