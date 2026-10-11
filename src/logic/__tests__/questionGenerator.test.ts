import { describe, it, expect } from 'vitest';
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

  it('generates Level 5 questions with any minute 1..59', () => {
    const questions = generateQuestionsForLevel(5, 505);
    expect(questions.length).toBe(6);
    questions.forEach((q) => {
      expect(q.targetTime.m).toBeGreaterThanOrEqual(1);
      expect(q.targetTime.m).toBeLessThanOrEqual(59);
      expect(q.snapStep).toBe(1);
    });
  });

  it('generates Level 6 Read Mode questions with 4 unique choices containing targetTime', () => {
    const questions = generateQuestionsForLevel(6, 606);
    expect(questions.length).toBe(6);
    questions.forEach((q) => {
      expect(q.type).toBe('read_clock');
      expect(q.choices).toBeDefined();
      expect(q.choices?.length).toBe(4);
      // Ensure target time is in choices
      const hasTarget = q.choices?.some(
        c => (c.h % 12 === q.targetTime.h % 12) && c.m === q.targetTime.m
      );
      expect(hasTarget).toBe(true);
      // Ensure unique choices
      const uniqueStrings = new Set(q.choices?.map(c => `${c.h}:${c.m}`));
      expect(uniqueStrings.size).toBe(4);
    });
  });

  it('generates Level 7 elapsed time questions correctly', () => {
    const questions = generateQuestionsForLevel(7, 707);
    expect(questions.length).toBe(6);
    questions.forEach((q) => {
      expect(q.type).toBe('journey_elapsed');
      expect(q.departureTime).toBeDefined();
      expect(q.durationMinutes).toBeDefined();
      expect(q.durationMinutes! % 60).toBe(0); // whole hours
    });
  });

  it('generates Level 8 hour-crossing elapsed questions', () => {
    const questions = generateQuestionsForLevel(8, 808);
    expect(questions.length).toBe(6);
    questions.forEach((q) => {
      expect(q.type).toBe('journey_elapsed');
      expect(q.departureTime).toBeDefined();
      expect(q.durationMinutes).toBeDefined();
      // Departure minute + duration >= 60 (crossing the hour)
      expect(q.departureTime!.m + q.durationMinutes!).toBeGreaterThanOrEqual(60);
      expect(q.targetTime.h).toBeGreaterThanOrEqual(1);
      expect(q.targetTime.h).toBeLessThanOrEqual(12);
    });
  });

  it('generates Level 10 Grand Station Master with 8 mixed questions', () => {
    const questions = generateQuestionsForLevel(10, 1010);
    expect(questions.length).toBe(8);
  });
});
