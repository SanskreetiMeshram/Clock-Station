import React from 'react';
import { Volume2, VolumeX, Type, Pause, Star, Mic } from 'lucide-react';
import { ProgressCarriages } from './ProgressCarriages';

import type { DifficultyTier } from '../../types/game';

export interface TopBarProps {
  levelId: number;
  levelName: string;
  difficulty?: DifficultyTier;
  totalQuestions: number;
  currentQuestionIndex: number;
  starsPerQuestion: number[];
  totalStars: number;
  isMuted: boolean;
  onToggleMute: () => void;
  onToggleTextSize: () => void;
  onPause: () => void;
  onOpenVoiceSettings?: () => void;
  isElevenLabsConfigured?: boolean;
  className?: string;
}

const DIFFICULTY_BADGE_COLORS: Record<DifficultyTier, string> = {
  starter: 'bg-emerald-100 text-emerald-800 border-emerald-400',
  medium: 'bg-sky-100 text-sky-800 border-sky-400',
  hard: 'bg-purple-100 text-purple-800 border-purple-500',
  expert: 'bg-orange-100 text-orange-800 border-orange-500',
  master: 'bg-rose-100 text-rose-800 border-rose-500',
};

export const TopBar: React.FC<TopBarProps> = ({
  levelId,
  levelName,
  difficulty,
  totalQuestions,
  currentQuestionIndex,
  starsPerQuestion,
  totalStars,
  isMuted,
  onToggleMute,
  onToggleTextSize,
  onPause,
  onOpenVoiceSettings,
  isElevenLabsConfigured = false,
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
          <div className="flex items-center gap-1.5">
            <span className="text-[11px] font-black uppercase text-[#3A86FF] tracking-wider">
              Station {levelId}
            </span>
            {difficulty && (
              <span
                className={`text-[10px] font-black uppercase px-1.5 py-0.5 rounded-full border ${DIFFICULTY_BADGE_COLORS[difficulty]}`}
              >
                {difficulty}
              </span>
            )}
          </div>
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

        {/* Voice settings toggle */}
        {onOpenVoiceSettings && (
          <button
            type="button"
            onClick={onOpenVoiceSettings}
            className={`flex items-center justify-center gap-1 px-2.5 h-10 rounded-2xl border-2 border-[#1B2A49] font-bold shadow-chunky-sm active:translate-y-0.5 transition-colors ${
              isElevenLabsConfigured
                ? 'bg-violet-100 hover:bg-violet-200 text-violet-900'
                : 'bg-amber-50 hover:bg-amber-100 text-[#1B2A49]'
            }`}
            title={
              isElevenLabsConfigured
                ? 'ElevenLabs Realistic Voice active — click to customize'
                : 'Set up ElevenLabs Realistic Voice'
            }
            aria-label="Open voice settings"
          >
            <Mic className="w-4 h-4" />
            <span className="hidden md:inline text-xs font-black">Voice</span>
            <span
              className={`w-2 h-2 rounded-full ${
                isElevenLabsConfigured ? 'bg-emerald-500' : 'bg-amber-400'
              }`}
            />
          </button>
        )}

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
