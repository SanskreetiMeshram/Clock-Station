import type { ClockTime, MistakeDiagnostic } from '../types/game';
import { isCorrect } from './clockMath';
import { strings } from '../strings/strings.en';

export function diagnoseMistake(
  target: ClockTime,
  answer: ClockTime,
  levelId: number = 1
): MistakeDiagnostic {
  if (isCorrect(target, answer)) {
    return {
      category: 'correct',
      message: strings.mascot.correctCelebration[0],
    };
  }

  const targetH = target.h % 12 || 12;
  const answerH = answer.h % 12 || 12;
  const targetM = target.m;
  const answerM = answer.m;

  // 1. Hands Swapped check:
  // e.g. target is 3:00 (h=3, m=0), answer is 12:15 (h=12, m=15)
  // or target is 4:20, answer is 4:20 swapped -> h=4 points at 4, m=20 points at 4
  const expectedSwappedH = Math.round(targetM / 5) % 12 || 12;
  const expectedSwappedM = (targetH * 5) % 60;
  const isSwapped =
    (answerH === expectedSwappedH && Math.abs(answerM - expectedSwappedM) <= 2) ||
    (answerH === Math.round(targetM / 5) && answerM === (targetH * 5) % 60);

  if (isSwapped && (targetH !== expectedSwappedH || targetM !== expectedSwappedM)) {
    return {
      category: 'hands_swapped',
      message: strings.hints.handsSwapped,
      highlightHand: 'both',
      showMultiplierHint: true,
    };
  }

  // 2. Off by 5 minutes:
  const minuteDiff = Math.abs(answerM - targetM);
  const isOffBy5 = minuteDiff === 5 || minuteDiff === 55;
  if (isOffBy5 && (answerH === targetH || Math.abs((answerH % 12) - (targetH % 12)) <= 1)) {
    return {
      category: 'off_by_five',
      message: strings.hints.offByFive,
      highlightHand: 'minute',
      showMultiplierHint: true,
    };
  }

  // 3. Mirror error (e.g. 20 min vs 40 min, 10 min vs 50 min):
  if (targetM > 0 && targetM < 60 && answerM === (60 - targetM) % 60) {
    return {
      category: 'mirror',
      message: strings.hints.mirrorError,
      highlightHand: 'minute',
      showMultiplierHint: true,
    };
  }

  // 4. Half past special hint:
  if (targetM === 30 && answerM !== 30) {
    return {
      category: 'minute_off',
      message: strings.hints.halfPast,
      highlightHand: 'minute',
      showHalfSlice: true,
    };
  }

  // 5. Quarter past / to special hint:
  if (targetM === 15 && answerM !== 15) {
    return {
      category: 'minute_off',
      message: strings.hints.quarterPast,
      highlightHand: 'minute',
      showQuarterSlice: true,
    };
  }
  if (targetM === 45 && answerM !== 45) {
    return {
      category: 'minute_off',
      message: strings.hints.quarterTo,
      highlightHand: 'minute',
      showQuarterSlice: true,
    };
  }

  // 6. Hour off (minute is correct, hour is wrong):
  if (answerM === targetM && answerH !== targetH) {
    return {
      category: 'hour_off',
      message: strings.hints.hourMistake,
      highlightHand: 'hour',
    };
  }

  // 7. Minute off (hour is correct, minute is wrong):
  if (answerH === targetH && answerM !== targetM) {
    return {
      category: 'minute_off',
      message: strings.hints.minuteMistake,
      highlightHand: 'minute',
      showMultiplierHint: true,
    };
  }

  // 8. Elapsed time error for levels 7 and 8:
  if (levelId === 7 || levelId === 8) {
    return {
      category: 'elapsed_calculation_error',
      message: levelId === 7 ? strings.hints.elapsedWhole : strings.hints.elapsedMinutes,
      highlightHand: 'both',
    };
  }

  // Generic fallback:
  return {
    category: 'unknown',
    message: strings.mascot.wrongAttempt1,
    highlightHand: 'both',
  };
}
