import { describe, it, expect } from 'vitest';
import {
  minuteAngle,
  hourAngle,
  angleFromPointer,
  angleToMinute,
  angleToHour,
  anglesToTime,
  addMinutes,
  isCorrect,
  shortestAngleDiff,
} from '../clockMath';

describe('clockMath core functions', () => {
  it('calculates correct minuteAngle', () => {
    expect(minuteAngle(0)).toBe(0);
    expect(minuteAngle(15)).toBe(90);
    expect(minuteAngle(30)).toBe(180);
    expect(minuteAngle(45)).toBe(270);
    expect(minuteAngle(59)).toBe(354);
    // Boundary wrapping
    expect(minuteAngle(60)).toBe(0);
    expect(minuteAngle(-15)).toBe(270);
  });

  it('calculates correct hourAngle', () => {
    expect(hourAngle(4, 30)).toBe(135);
    expect(hourAngle(12, 0)).toBe(0);
    expect(hourAngle(3, 0)).toBe(90);
    expect(hourAngle(6, 45)).toBe(202.5);
  });

  it('performs 720-case round-trip test: time -> angles -> time returns original', () => {
    for (let h = 1; h <= 12; h++) {
      for (let m = 0; m < 60; m++) {
        const ma = minuteAngle(m);
        const ha = hourAngle(h, m);
        const recovered = anglesToTime(ha, ma);
        expect(recovered.h).toBe(h);
        expect(recovered.m).toBe(m);
      }
    }
  });

  it('calculates angleFromPointer at compass points and diagonals with arbitrary clock center', () => {
    const cx = 250;
    const cy = 350;
    const r = 100;

    // 12 o'clock (0°)
    expect(angleFromPointer(cx, cy, cx, cy - r)).toBeCloseTo(0, 5);

    // 3 o'clock (90°)
    expect(angleFromPointer(cx, cy, cx + r, cy)).toBeCloseTo(90, 5);

    // 6 o'clock (180°)
    expect(angleFromPointer(cx, cy, cx, cy + r)).toBeCloseTo(180, 5);

    // 9 o'clock (270°)
    expect(angleFromPointer(cx, cy, cx - r, cy)).toBeCloseTo(270, 5);

    // Diagonals (1:30 -> 45°, 4:30 -> 135°, 7:30 -> 225°, 10:30 -> 315°)
    const diagDist = r / Math.SQRT2;
    expect(angleFromPointer(cx, cy, cx + diagDist, cy - diagDist)).toBeCloseTo(45, 4);
    expect(angleFromPointer(cx, cy, cx + diagDist, cy + diagDist)).toBeCloseTo(135, 4);
    expect(angleFromPointer(cx, cy, cx - diagDist, cy + diagDist)).toBeCloseTo(225, 4);
    expect(angleFromPointer(cx, cy, cx - diagDist, cy - diagDist)).toBeCloseTo(315, 4);
  });

  it('snaps angleToMinute correctly for step 5 and step 15', () => {
    // step 5: angle corresponding to minute 7 (42°) snaps to 5
    const angle7 = 7 * 6;
    expect(angleToMinute(angle7, 5)).toBe(5);

    // step 5: angle corresponding to minute 8 (48°) snaps to 10
    const angle8 = 8 * 6;
    expect(angleToMinute(angle8, 5)).toBe(10);

    // step 15: minute 58 (348°) snaps across boundary to 0
    const angle58 = 58 * 6;
    expect(angleToMinute(angle58, 15)).toBe(0);

    // step 15: minute 8 (48°) snaps to 15
    expect(angleToMinute(8 * 6, 15)).toBe(15);
    // step 15: minute 22 snaps to 15, minute 23 snaps to 30
    expect(angleToMinute(22 * 6, 15)).toBe(15);
    expect(angleToMinute(23 * 6, 15)).toBe(30);
  });

  it('converts angleToHour accurately', () => {
    expect(angleToHour(0)).toBe(12);
    expect(angleToHour(30)).toBe(1);
    expect(angleToHour(60)).toBe(2);
    expect(angleToHour(89)).toBe(3);
    expect(angleToHour(355)).toBe(12);
  });

  it('handles addMinutes with wrap-around cases', () => {
    // 4:30 + 45 = 5:15
    expect(addMinutes({ h: 4, m: 30 }, 45)).toEqual({ h: 5, m: 15, period: undefined });

    // 11:50 + 20 = 12:10
    expect(addMinutes({ h: 11, m: 50 }, 20)).toEqual({ h: 12, m: 10, period: undefined });

    // 12:30 + 90 = 2:00
    expect(addMinutes({ h: 12, m: 30 }, 90)).toEqual({ h: 2, m: 0, period: undefined });

    // 12-hour wrap around 12:00 + 720 min = 12:00
    expect(addMinutes({ h: 12, m: 0 }, 720)).toEqual({ h: 12, m: 0, period: undefined });
  });

  it('isCorrect treats 12:xx and 0:xx identically', () => {
    expect(isCorrect({ h: 12, m: 30 }, { h: 0, m: 30 })).toBe(true);
    expect(isCorrect({ h: 0, m: 15 }, { h: 12, m: 15 })).toBe(true);
    expect(isCorrect({ h: 5, m: 45 }, { h: 5, m: 45 })).toBe(true);
    expect(isCorrect({ h: 5, m: 45 }, { h: 6, m: 45 })).toBe(false);
    expect(isCorrect({ h: 5, m: 45 }, { h: 5, m: 40 })).toBe(false);
  });

  it('shortestAngleDiff computes signed minimal difference', () => {
    expect(shortestAngleDiff(10, 20)).toBe(10);
    expect(shortestAngleDiff(20, 10)).toBe(-10);
    expect(shortestAngleDiff(350, 10)).toBe(20);
    expect(shortestAngleDiff(10, 350)).toBe(-20);
    expect(shortestAngleDiff(0, 180)).toBe(-180);
  });
});
