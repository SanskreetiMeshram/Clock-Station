import React from 'react';
import type { ClockTime } from '../../types/game';
import { formatDigital } from '../../logic/clockMath';

export interface JourneyRibbonProps {
  departure: ClockTime;
  durationMinutes: number;
  className?: string;
}

export const JourneyRibbon: React.FC<JourneyRibbonProps> = ({
  departure,
  durationMinutes,
  className = '',
}) => {
  const durationText =
    durationMinutes >= 60 && durationMinutes % 60 === 0
      ? `${durationMinutes / 60} hr`
      : durationMinutes >= 60
      ? `${Math.floor(durationMinutes / 60)}h ${durationMinutes % 60}m`
      : `${durationMinutes} min`;

  return (
    <div className={`flex items-center gap-2 py-2 px-3 bg-[#0F172A]/80 rounded-xl border border-amber-400/30 text-white ${className}`}>
      {/* Origin Station */}
      <div className="flex flex-col items-center">
        <span className="text-xs text-amber-300 font-bold uppercase">Depart</span>
        <div className="flex items-center gap-1 bg-[#1E293B] px-2 py-0.5 rounded border border-slate-600 font-mono text-sm font-bold text-sky-400">
          📍 {formatDigital(departure)}
        </div>
      </div>

      {/* Connecting Track with Duration Badge */}
      <div className="flex-1 flex flex-col items-center relative px-2">
        <span className="text-[11px] font-bold text-amber-400 bg-[#1E293B] px-2 py-0.5 rounded-full border border-amber-400/40 mb-1 z-10 animate-bounceSubtle">
          +{durationText} ⏱️
        </span>
        <div className="w-full flex items-center">
          <div className="h-1 w-full bg-gradient-to-r from-sky-400 via-amber-400 to-emerald-400 rounded-full" />
          <span className="text-emerald-400 text-xs -ml-1">▶</span>
        </div>
      </div>

      {/* Destination Station */}
      <div className="flex flex-col items-center">
        <span className="text-xs text-emerald-300 font-bold uppercase">Arrive</span>
        <div className="flex items-center gap-1 bg-[#1E293B] px-2 py-0.5 rounded border border-slate-600 font-mono text-sm font-bold text-emerald-400">
          🏁 ???
        </div>
      </div>
    </div>
  );
};
