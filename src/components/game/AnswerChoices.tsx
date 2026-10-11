import React from 'react';
import type { ClockTime } from '../../types/game';
import { formatDigital } from '../../logic/clockMath';

export interface AnswerChoicesProps {
  choices: ClockTime[];
  selectedChoice: ClockTime | null;
  onSelect: (choice: ClockTime) => void;
  disabled?: boolean;
  className?: string;
}

export const AnswerChoices: React.FC<AnswerChoicesProps> = ({
  choices,
  selectedChoice,
  onSelect,
  disabled = false,
  className = '',
}) => {
  return (
    <div
      className={`grid grid-cols-2 gap-3 sm:gap-4 w-full max-w-md mx-auto ${className}`}
      role="radiogroup"
      aria-label="Digital time options"
    >
      {choices.map((choice, i) => {
        const isSelected =
          selectedChoice !== null &&
          selectedChoice.h % 12 === choice.h % 12 &&
          selectedChoice.m === choice.m;

        return (
          <button
            key={i}
            type="button"
            role="radio"
            aria-checked={isSelected}
            disabled={disabled}
            onClick={() => onSelect(choice)}
            className={`min-h-[64px] sm:min-h-[72px] px-4 py-3 rounded-2xl border-4 text-2xl sm:text-3xl font-mono font-black transition-all flex items-center justify-center shadow-chunky focus-ring ${
              isSelected
                ? 'bg-[#3A86FF] text-white border-[#1B2A49] -translate-y-1 shadow-lg ring-4 ring-amber-400'
                : 'bg-white hover:bg-amber-50 text-[#1B2A49] border-[#1B2A49] active:translate-y-1 active:shadow-chunky-active'
            }`}
          >
            <span>{formatDigital(choice)}</span>
          </button>
        );
      })}
    </div>
  );
};
