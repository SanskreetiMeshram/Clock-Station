import React from 'react';
import { Volume2, VolumeX, Type, Pause, Star } from 'lucide-react';
import { ProgressCarriages } from './ProgressCarriages';

export interface TopBarProps {
  levelId: number;
  levelName: string;
  totalQuestions: number;
  currentQuestionIndex: number;
  starsPerQuestion: number[];
  totalStars: number;
  isMuted: boolean;
  onToggleMute: () => void;
  onToggleTextSize: () => void;
  onPause: () => void;
  className?: string;
}

export const TopBar: React.FC<TopBarProps> = ({
  levelId,
  levelName,
  totalQuestions,
  currentQuestionIndex,
  starsPerQuestion,
  totalStars,
  isMuted,
  onToggleMute,
  onToggleTextSize,
  onPause,
  className = '',
}) => {
  return (
    <header
      className={`w-full max-w-5xl mx-auto flex flex-wrap items-center justify-between gap-3 p-3 bg-white/90 backdrop-blur-md rounded-3xl border-4 border-[#1B2A49] shadow-chunky ${className}`}
    >
      {/* Left: Level Badge & Name */}
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={onPause}
          className="flex items-center justify-center w-10 h-10 rounded-2xl bg-amber-100 hover:bg-amber-200 border-2 border-[#1B2A49] text-[#1B2A49] font-bold shadow-chunky-sm active:translate-y-0.5"
          title="Pause / Level Map"
          aria-label="Pause and open menu"
        >
          <Pause className="w-5 h-5 fill-current" />
        </button>

        <div>
          <span className="text-[11px] font-black uppercase text-[#3A86FF] tracking-wider block">
            Station {levelId}
          </span>
          <h1 className="text-base sm:text-lg font-black text-[#1B2A49] leading-tight">
            {levelName}
          </h1>
        </div>
      </div>

      {/* Middle: Progress Carriages */}
      <div className="order-3 sm:order-2 w-full sm:w-auto flex justify-center">
        <ProgressCarriages
          total={totalQuestions}
          currentIndex={currentQuestionIndex}
          starsPerQuestion={starsPerQuestion}
        />
      </div>

      {/* Right: Star Counter & Utility Controls */}
      <div className="order-2 sm:order-3 flex items-center gap-2">
        {/* Star counter */}
        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-2xl bg-amber-100 border-2 border-[#1B2A49] font-black text-amber-900 text-sm shadow-chunky-sm">
          <Star className="w-4 h-4 fill-[#F59E0B] text-[#B45309]" />
          <span>{totalStars}</span>
        </div>

        {/* Text size toggle */}
        <button
          type="button"
          onClick={onToggleTextSize}
          className="flex items-center justify-center w-10 h-10 rounded-2xl bg-sky-100 hover:bg-sky-200 border-2 border-[#1B2A49] text-[#1B2A49] font-bold shadow-chunky-sm active:translate-y-0.5"
          title="Toggle Text Size"
          aria-label="Toggle text size"
        >
          <Type className="w-5 h-5" />
        </button>

        {/* Sound toggle */}
        <button
          type="button"
          onClick={onToggleMute}
          className={`flex items-center justify-center w-10 h-10 rounded-2xl border-2 border-[#1B2A49] font-bold shadow-chunky-sm active:translate-y-0.5 ${
            isMuted ? 'bg-red-100 text-red-600' : 'bg-emerald-100 text-emerald-700'
          }`}
          title={isMuted ? 'Unmute' : 'Mute'}
          aria-label={isMuted ? 'Unmute sounds' : 'Mute sounds'}
        >
          {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
        </button>
      </div>
    </header>
  );
};
