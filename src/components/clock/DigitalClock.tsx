import React from 'react';
import type { ClockTime } from '../../types/game';
import { formatDigital } from '../../logic/clockMath';

export interface DigitalClockProps {
  time: ClockTime;
  mode?: '12h' | '24h';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  showLabels?: boolean;
}

export const DigitalClock: React.FC<DigitalClockProps> = ({
  time,
  mode = '12h',
  size = 'md',
  className = '',
  showLabels = true,
}) => {
  const sizeClasses = {
    sm: 'text-2xl px-3 py-1.5 min-w-[120px]',
    md: 'text-4xl px-5 py-2.5 min-w-[180px]',
    lg: 'text-6xl px-8 py-4 min-w-[260px]',
  }[size];

  const displayH =
    mode === '24h'
      ? ((time.h % 12) + (time.period === 'PM' ? 12 : 0))
          .toString()
          .padStart(2, '0')
      : time.h.toString().padStart(2, ' ');

  return (
    <div className={`inline-flex flex-col items-center select-none ${className}`}>
      <div
        className={`bg-[#1B2A49] text-[#FFD23F] font-mono font-bold rounded-2xl border-4 border-[#FF9F1C] shadow-board flex items-center justify-center tracking-widest ${sizeClasses}`}
        role="timer"
        aria-label={`Digital time: ${formatDigital(time, mode)}`}
      >
        <div className="flex items-baseline gap-1">
          <span className="text-[#93C5FD]">{displayH}</span>
          <span className="text-[#FFD23F] animate-pulse">:</span>
          <span className="text-[#FF5A5F]">{time.m.toString().padStart(2, '0')}</span>
        </div>
      </div>

      {showLabels && (
        <div className="flex justify-between w-full px-4 text-xs font-bold text-[#1B2A49] uppercase tracking-wider mt-1 opacity-80">
          <span className="text-[#3A86FF]">{mode === '24h' ? '24h Hr' : 'Hour'}</span>
          <span className="text-[#FF5A5F]">Min</span>
        </div>
      )}
    </div>
  );
};
