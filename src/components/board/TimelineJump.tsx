import React from 'react';
import type { ClockTime } from '../../types/game';
import { formatDigital } from '../../logic/clockMath';

export interface TimelineJumpProps {
  departure?: ClockTime;
  arrival?: ClockTime;
  durationMinutes: number;
  direction?: 'forward' | 'backward';
  legBreakdownText?: string;
  className?: string;
}

export const TimelineJump: React.FC<TimelineJumpProps> = ({
  departure,
  arrival,
  durationMinutes,
  direction = 'forward',
  legBreakdownText,
  className = '',
}) => {
  const isBackward = direction === 'backward';
  const rawLabel =
    durationMinutes >= 60 && durationMinutes % 60 === 0
      ? `${durationMinutes / 60} hour`
      : durationMinutes >= 60
      ? `${Math.floor(durationMinutes / 60)}h ${durationMinutes % 60}m`
      : `${durationMinutes} min`;

  const durLabel = legBreakdownText
    ? legBreakdownText
    : isBackward
    ? `-${rawLabel}`
    : `+${rawLabel}`;

  const leftText = !isBackward && departure ? formatDigital(departure) : '??:??';
  const rightText = isBackward && arrival ? formatDigital(arrival) : '??:??';

  return (
    <div className={`p-3 bg-amber-50 rounded-2xl border-2 border-amber-400 shadow-md ${className}`}>
      <div className="text-xs font-bold text-amber-900 mb-1 flex items-center justify-between">
        <span>⏱️ Timeline Helper:</span>
        <span className="text-amber-700">
          {durLabel} {isBackward ? 'backward' : 'forward'}
        </span>
      </div>

      <svg viewBox="0 0 320 80" className="w-full h-auto overflow-visible">
        {/* Timeline Baseline */}
        <line x1="30" y1="55" x2="290" y2="55" stroke="#1B2A49" strokeWidth="4" strokeLinecap="round" />

        {/* Left Departure Mark */}
        <circle cx="60" cy="55" r="7" fill="#3A86FF" stroke="#1B2A49" strokeWidth="3" />
        <text x="60" y="74" textAnchor="middle" fill="#1B2A49" fontSize="13" fontWeight="bold">
          {leftText}
        </text>

        {/* Animated Jump Arc */}
        <path
          d="M 60 50 Q 160 5 260 50"
          fill="none"
          stroke="#F59E0B"
          strokeWidth="4"
          strokeDasharray="6 4"
          className="animate-pulse"
        />
        {/* Arrow head matching jump direction */}
        {isBackward ? (
          <polygon points="65,42 55,50 68,53" fill="#F59E0B" />
        ) : (
          <polygon points="255,42 265,50 252,53" fill="#F59E0B" />
        )}

        {/* Arc Label Badge */}
        <rect x="115" y="6" width="90" height="22" rx="6" fill="#FFD23F" stroke="#1B2A49" strokeWidth="2" />
        <text x="160" y="21" textAnchor="middle" fill="#1B2A49" fontSize="10.5" fontWeight="bold">
          {durLabel}
        </text>

        {/* Right Arrival Mark */}
        <circle cx="260" cy="55" r="7" fill="#10B981" stroke="#1B2A49" strokeWidth="3" />
        <text x="260" y="74" textAnchor="middle" fill="#10B981" fontSize="13" fontWeight="bold">
          {rightText}
        </text>
      </svg>
    </div>
  );
};
