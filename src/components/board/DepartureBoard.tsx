import React, { useState } from 'react';
import { Volume2 } from 'lucide-react';
import type { Question } from '../../types/game';
import { JourneyRibbon } from './JourneyRibbon';
import { TimelineJump } from './TimelineJump';

export interface DepartureBoardProps {
  question: Question;
  onReadAloud?: () => void;
  isSpeaking?: boolean;
  className?: string;
}

export const DepartureBoard: React.FC<DepartureBoardProps> = ({
  question,
  onReadAloud,
  isSpeaking = false,
  className = '',
}) => {
  const [showTimeline, setShowTimeline] = useState(false);

  const isJourney = question.type === 'journey_elapsed';

  return (
    <div
      key={question.id}
      className={`animate-flip bg-[#1B2A49] rounded-3xl border-4 border-[#FF9F1C] p-4 sm:p-5 shadow-board text-white flex flex-col justify-between ${className}`}
      role="region"
      aria-label="Train departure notice board"
    >
      {/* Top Header: Platform & Train Name */}
      <div className="flex items-center justify-between border-b-2 border-slate-700/80 pb-2 mb-3">
        <div className="flex items-center gap-2">
          <span className="bg-[#FF9F1C] text-[#1B2A49] font-black text-xs sm:text-sm px-2.5 py-1 rounded-lg uppercase tracking-wider">
            Platform 1
          </span>
          <span className="text-amber-300 font-bold text-sm sm:text-base tracking-wide uppercase">
            🚂 {question.trainName}
          </span>
        </div>

        {/* Read aloud button */}
        {onReadAloud && (
          <button
            type="button"
            onClick={onReadAloud}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold transition-all ${
              isSpeaking
                ? 'bg-amber-400 text-[#1B2A49] animate-pulse ring-2 ring-amber-300'
                : 'bg-slate-700/80 hover:bg-slate-600 text-amber-300 hover:text-white'
            }`}
            title="Read task aloud"
            aria-label="Read question text aloud"
          >
            <Volume2 className="w-4 h-4" />
            <span className="hidden sm:inline">Read aloud</span>
          </button>
        )}
      </div>

      {/* Main Task Prompt */}
      <div className="my-auto py-2">
        <h2 className="text-2xl sm:text-3xl font-extrabold text-[#FFD23F] tracking-wide leading-tight drop-shadow-sm font-display">
          {question.promptText}
        </h2>

        {/* Color-coded reminder labels for young learners */}
        <div className="flex items-center gap-3 mt-2 text-xs font-bold">
          <span className="flex items-center gap-1 text-[#93C5FD]">
            <span className="w-2.5 h-2.5 rounded-full bg-[#3A86FF] inline-block" />
            Short Blue Hand = Hour
          </span>
          <span className="flex items-center gap-1 text-[#FECDD3]">
            <span className="w-2.5 h-2.5 rounded-full bg-[#FF5A5F] inline-block" />
            Long Red Hand = Minute
          </span>
        </div>
      </div>

      {/* Journey Visualization for Levels 7 & 8 */}
      {isJourney && question.departureTime && question.durationMinutes && (
        <div className="mt-3 flex flex-col gap-2">
          <JourneyRibbon
            departure={question.departureTime}
            durationMinutes={question.durationMinutes}
          />

          {/* Toggleable Animated Number Line Helper */}
          <div className="flex items-center justify-between">
            <button
              type="button"
              onClick={() => setShowTimeline((prev) => !prev)}
              className="text-xs font-bold text-amber-300 hover:text-amber-200 underline decoration-dotted flex items-center gap-1 py-1"
            >
              <span>{showTimeline ? '▲ Hide Timeline' : '▼ Show me the timeline jump'}</span>
            </button>
          </div>

          {showTimeline && (
            <TimelineJump
              departure={question.departureTime}
              durationMinutes={question.durationMinutes}
            />
          )}
        </div>
      )}
    </div>
  );
};
