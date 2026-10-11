import { useState, useRef, useCallback, useEffect } from 'react';
import type { ClockTime, ClockMode } from '../types/game';
import { angleFromPointer, angleToMinute, angleToHour, addMinutes } from '../logic/clockMath';

export interface UseDraggableHandProps {
  handType: 'hour' | 'minute';
  time: ClockTime;
  mode: ClockMode;
  snapStep: 1 | 5 | 15;
  getCenter: () => { cx: number; cy: number };
  onChange?: (newTime: ClockTime) => void;
  onSnap?: () => void;
  disabled?: boolean;
}

export function useDraggableHand({
  handType,
  time,
  mode,
  snapStep,
  getCenter,
  onChange,
  onSnap,
  disabled = false,
}: UseDraggableHandProps) {
  const [isDragging, setIsDragging] = useState(false);
  const prevMinuteRef = useRef(time.m);
  const timeRef = useRef(time);
  useEffect(() => {
    timeRef.current = time;
  }, [time]);

  const handlePointerDown = useCallback(
    (e: React.PointerEvent<SVGElement>) => {
      if (disabled || e.button !== 0) return;
      e.stopPropagation();
      e.preventDefault();

      const target = e.currentTarget;
      try {
        target.setPointerCapture(e.pointerId);
      } catch {}

      setIsDragging(true);
      prevMinuteRef.current = timeRef.current.m;
    },
    [disabled]
  );

  const handlePointerMove = useCallback(
    (e: React.PointerEvent<SVGElement>) => {
      if (!isDragging || disabled) return;
      e.preventDefault();

      const { cx, cy } = getCenter();
      const pointerAngle = angleFromPointer(cx, cy, e.clientX, e.clientY);
      const currentTime = timeRef.current;

      if (handType === 'minute') {
        const newMinute = angleToMinute(pointerAngle, snapStep);
        if (newMinute !== currentTime.m) {
          let newHour = currentTime.h;

          if (mode === 'full') {
            // Check for 12-crossing (clockwise or counter-clockwise)
            if (currentTime.m >= 45 && newMinute <= 15) {
              // Clockwise crossing 12 -> increment hour
              newHour = (currentTime.h % 12) + 1;
            } else if (currentTime.m <= 15 && newMinute >= 45) {
              // Counter-clockwise crossing 12 -> decrement hour
              newHour = ((currentTime.h - 2 + 12) % 12) + 1;
            }
          }

          onChange?.({ h: newHour, m: newMinute });
          onSnap?.();
          prevMinuteRef.current = newMinute;
        }
      } else {
        // Hour hand dragging
        const newHour = angleToHour(pointerAngle);
        if (newHour !== currentTime.h) {
          onChange?.({ h: newHour, m: currentTime.m });
          onSnap?.();
        }
      }
    },
    [isDragging, disabled, getCenter, handType, snapStep, mode, onChange, onSnap]
  );

  const handlePointerUp = useCallback(
    (e: React.PointerEvent<SVGElement>) => {
      if (!isDragging) return;
      try {
        if (e.currentTarget.hasPointerCapture(e.pointerId)) {
          e.currentTarget.releasePointerCapture(e.pointerId);
        }
      } catch {}
      setIsDragging(false);
    },
    [isDragging]
  );

  const handleLostPointerCapture = useCallback(() => {
    setIsDragging(false);
  }, []);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<SVGElement>) => {
      if (disabled) return;
      const currentTime = timeRef.current;
      let handled = false;

      if (handType === 'minute') {
        let deltaMinutes = 0;
        if (e.key === 'ArrowRight' || e.key === 'ArrowUp') {
          deltaMinutes = snapStep;
          handled = true;
        } else if (e.key === 'ArrowLeft' || e.key === 'ArrowDown') {
          deltaMinutes = -snapStep;
          handled = true;
        } else if (e.key === 'PageUp') {
          deltaMinutes = snapStep * 5;
          handled = true;
        } else if (e.key === 'PageDown') {
          deltaMinutes = -snapStep * 5;
          handled = true;
        }

        if (handled) {
          e.preventDefault();
          const nextTime = addMinutes(currentTime, deltaMinutes);
          onChange?.({ h: nextTime.h, m: nextTime.m });
          onSnap?.();
        }
      } else {
        // Hour hand
        let deltaHours = 0;
        if (e.key === 'ArrowRight' || e.key === 'ArrowUp') {
          deltaHours = 1;
          handled = true;
        } else if (e.key === 'ArrowLeft' || e.key === 'ArrowDown') {
          deltaHours = -1;
          handled = true;
        } else if (e.key === 'PageUp') {
          deltaHours = 3;
          handled = true;
        } else if (e.key === 'PageDown') {
          deltaHours = -3;
          handled = true;
        }

        if (handled) {
          e.preventDefault();
          let newH = ((currentTime.h + deltaHours - 1 + 12) % 12) + 1;
          onChange?.({ h: newH, m: currentTime.m });
          onSnap?.();
        }
      }
    },
    [disabled, handType, snapStep, onChange, onSnap]
  );

  return {
    isDragging,
    listeners: {
      onPointerDown: handlePointerDown,
      onPointerMove: handlePointerMove,
      onPointerUp: handlePointerUp,
      onPointerCancel: handlePointerUp,
      onLostPointerCapture: handleLostPointerCapture,
      onKeyDown: handleKeyDown,
    },
  };
}
