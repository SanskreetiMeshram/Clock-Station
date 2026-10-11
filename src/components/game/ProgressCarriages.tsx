import React from 'react';

export interface ProgressCarriagesProps {
  total: number;
  currentIndex: number;
  starsPerQuestion: number[]; // e.g. [3, 2, 0, ...]
  className?: string;
}

export const ProgressCarriages: React.FC<ProgressCarriagesProps> = ({
  total,
  currentIndex,
  starsPerQuestion,
  className = '',
}) => {
  return (
    <div
      className={`inline-flex items-center gap-1.5 p-1.5 bg-white/80 rounded-2xl border-2 border-[#1B2A49] shadow-chunky-sm ${className}`}
      role="progressbar"
      aria-label={`Question progress: ${currentIndex + 1} of ${total}`}
      aria-valuenow={currentIndex + 1}
      aria-valuemin={1}
      aria-valuemax={total}
    >
      {/* Mini Train Locomotive Head */}
      <div className="flex items-center justify-center w-7 h-6 bg-[#FF5A5F] rounded-lg border-2 border-[#1B2A49] text-xs font-bold text-white shadow-sm">
        🚂
      </div>

      {/* Progress Carriages */}
      {Array.from({ length: total }, (_, i) => {
        const isCompleted = i < currentIndex;
        const isCurrent = i === currentIndex;
        const stars = starsPerQuestion[i] || 0;

        let bgClass = 'bg-slate-200 border-slate-400 text-slate-500';
        if (isCompleted) {
          bgClass = stars > 0
            ? 'bg-[#3DDC84] border-[#1B2A49] text-white'
            : 'bg-[#FBBF24] border-[#1B2A49] text-[#1B2A49]';
        } else if (isCurrent) {
          bgClass = 'bg-[#FFD23F] border-[#1B2A49] ring-2 ring-amber-400 animate-pulse text-[#1B2A49]';
        }

        return (
          <div
            key={i}
            className={`flex items-center justify-center w-6 h-6 rounded-md border-2 text-[11px] font-black transition-all ${bgClass}`}
            title={`Carriage ${i + 1}`}
          >
            {isCompleted ? (stars > 0 ? '★' : '✓') : i + 1}
          </div>
        );
      })}
    </div>
  );
};
