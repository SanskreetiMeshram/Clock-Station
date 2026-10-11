import type { ClockTime } from '../types/game';

/**
 * All hand angles are measured clockwise from 12 o'clock, in degrees, range [0, 360).
 */

/**
 * Returns minute hand angle in degrees [0, 360).
 * minuteAngle(m) = (m % 60) * 6
 */
export function minuteAngle(m: number): number {
  const normalizedM = ((m % 60) + 60) % 60;
  return normalizedM * 6;
}

/**
 * Returns hour hand angle in degrees [0, 360).
 * Hour hand creeps 0.5° per minute.
 * hourAngle(h, m) = ((h % 12) * 30) + (m * 0.5)
 */
export function hourAngle(h: number, m: number = 0): number {
  const normalizedH = ((h % 12) + 12) % 12;
  const normalizedM = ((m % 60) + 60) % 60;
  const angle = (normalizedH * 30) + (normalizedM * 0.5);
  return ((angle % 360) + 360) % 360;
}

/**
 * Calculates clockwise angle from 12 o'clock given clock center and pointer coordinates.
 * angleFromPointer(cx, cy, px, py) = (atan2(px - cx, -(py - cy)) * 180/π + 360) % 360
 */
export function angleFromPointer(cx: number, cy: number, px: number, py: number): number {
  const dx = px - cx;
  const dy = py - cy;
  // In screen coordinates: y points down, so -(py - cy) is positive upwards (12 o'clock)
  const rad = Math.atan2(dx, -dy);
  const deg = (rad * 180 / Math.PI + 360) % 360;
  return deg;
}

/**
 * Converts angle to minute [0..59], snapped to snapStep (1, 5, 15).
 */
export function angleToMinute(angle: number, snapStep: number = 1): number {
  const normAngle = ((angle % 360) + 360) % 360;
  const rawMinute = normAngle / 6;
  const snapped = Math.round(rawMinute / snapStep) * snapStep;
  return (Math.round(snapped) % 60 + 60) % 60;
}

/**
 * Converts angle to nearest hour [1..12].
 */
export function angleToHour(angle: number): number {
  const normAngle = ((angle % 360) + 360) % 360;
  const rawH = Math.round(normAngle / 30) % 12;
  return rawH === 0 ? 12 : rawH;
}

/**
 * Converts hour hand and minute hand angles back to exact ClockTime { h, m }.
 * Supports exact round-trip reconstruction for all 720 minutes of a 12-hour cycle.
 */
export function anglesToTime(hAngle: number, mAngle: number): ClockTime {
  const m = angleToMinute(mAngle, 1);
  const normH = ((hAngle % 360) + 360) % 360;
  let h = Math.floor(normH / 30);
  h = h === 0 ? 12 : h;
  return { h, m };
}

/**
 * Normalizes a time object so h is in 1..12 and m is in 0..59.
 */
export function normalizeTime(time: { h: number; m: number; period?: 'AM' | 'PM' }): ClockTime {
  let m = time.m;
  let extraHours = Math.floor(m / 60);
  m = ((m % 60) + 60) % 60;

  let totalH = time.h + extraHours;
  let h = ((totalH - 1) % 12 + 12) % 12 + 1;

  return {
    h,
    m,
    period: time.period,
  };
}

/**
 * Adds delta minutes to a given time, returning normalized time with period handling.
 */
export function addMinutes(
  time: ClockTime,
  delta: number
): ClockTime {
  // Normalize base hours to 0..11
  const baseH = time.h % 12;
  const totalMinutes = (baseH * 60) + time.m + delta;

  // Handle total minutes potentially negative or multi-hour
  const modDayMinutes = ((totalMinutes % (12 * 60)) + (12 * 60)) % (12 * 60);
  let h = Math.floor(modDayMinutes / 60);
  if (h === 0) h = 12;
  const m = modDayMinutes % 60;

  // Day period toggle if AM/PM was present
  let period = time.period;
  if (period) {
    const passed12s = Math.floor(totalMinutes / (12 * 60));
    if (Math.abs(passed12s) % 2 === 1) {
      period = period === 'AM' ? 'PM' : 'AM';
    }
  }

  return { h, m, period };
}

/**
 * Formats time as a friendly digital string e.g. "4:30" or "4:30 PM".
 */
export function formatDigital(
  time: ClockTime,
  mode: '12h' | '24h' = '12h',
  includePeriod: boolean = false
): string {
  const mStr = time.m.toString().padStart(2, '0');
  if (mode === '24h') {
    let h24 = time.h % 12;
    if (time.period === 'PM') h24 += 12;
    return `${h24.toString().padStart(2, '0')}:${mStr}`;
  }

  const base = `${time.h}:${mStr}`;
  if (includePeriod && time.period) {
    return `${base} ${time.period}`;
  }
  return base;
}

/**
 * Compares target time and user answer.
 * Exact equality of h (mod 12) and m.
 * 12:xx and 0:xx are treated identically.
 */
export function isCorrect(target: ClockTime, answer: ClockTime): boolean {
  const targetH = target.h % 12;
  const answerH = answer.h % 12;
  return targetH === answerH && target.m === answer.m;
}

/**
 * Calculates the shortest angular difference from angle a to angle b in degrees, in range [-180, 180).
 * Positive means clockwise rotation, negative means counter-clockwise.
 */
export function shortestAngleDiff(a: number, b: number): number {
  return ((b - a + 540) % 360) - 180;
}
