import React, { useEffect } from 'react';
import type { ClockTime } from '../../types/game';
import { formatDigital } from '../../logic/clockMath';
import { useDraggableItem } from '../../hooks/useDraggableItem';

export interface AnswerChoicesProps {
  choices: ClockTime[];
  selectedChoice: ClockTime | null;
  onSelect: (choice: ClockTime) => void;
  onDropTicket?: (choice: ClockTime) => void;
  onDragStateChange?: (isDragging: boolean, activeTarget: string | null) => void;
  disabled?: boolean;
  className?: string;
}

interface TicketItemProps {
  choice: ClockTime;
  isSelected: boolean;
  disabled: boolean;
  onSelect: (choice: ClockTime) => void;
  onDropTicket?: (choice: ClockTime) => void;
  onDragStateChange?: (isDragging: boolean, activeTarget: string | null) => void;
}

const TicketItem: React.FC<TicketItemProps> = ({
  choice,
  isSelected,
  disabled,
  onSelect,
  onDropTicket,
  onDragStateChange,
}) => {
  const {
    isDragging,
    dragPosition,
    activeTargetId,
    dragProps,
  } = useDraggableItem<ClockTime>({
    data: choice,
    disabled,
    onClickFallback: onSelect,
    onDrop: (targetId, data) => {
      if (targetId === 'train-ticket-slot' && onDropTicket) {
        onDropTicket(data);
      } else {
        onSelect(data);
      }
    },
  });

  useEffect(() => {
    onDragStateChange?.(isDragging, activeTargetId);
  }, [isDragging, activeTargetId, onDragStateChange]);

  const timeString = formatDigital(choice);

  return (
    <>
      {/* Interactive Stationary Card */}
      <div
        {...dragProps}
        role="button"
        tabIndex={disabled ? -1 : 0}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            onSelect(choice);
          }
        }}
        aria-pressed={isSelected}
        aria-label={`Boarding ticket for ${timeString}. Drag to train or press to select.`}
        className={`relative min-h-[72px] sm:min-h-[82px] px-4 py-3 rounded-2xl border-4 transition-all flex flex-col items-center justify-center shadow-chunky focus-ring select-none cursor-grab active:cursor-grabbing ${
          isSelected
            ? 'bg-[#3A86FF] text-white border-[#1B2A49] -translate-y-1 shadow-lg ring-4 ring-amber-400'
            : 'bg-amber-50 hover:bg-white text-[#1B2A49] border-[#1B2A49] active:translate-y-1 active:shadow-chunky-active'
        } ${isDragging ? 'opacity-40 scale-95' : 'opacity-100'}`}
      >
        {/* Ticket Perforation Notches on Sides */}
        <div className="absolute -left-2 top-1/2 -translate-y-1/2 w-3.5 h-3.5 rounded-full bg-[#E0F2FE] border-r-2 border-[#1B2A49]" />
        <div className="absolute -right-2 top-1/2 -translate-y-1/2 w-3.5 h-3.5 rounded-full bg-[#E0F2FE] border-l-2 border-[#1B2A49]" />

        <div className="flex items-center gap-2">
          <span className="text-xl sm:text-2xl">🎫</span>
          <span className="text-2xl sm:text-3xl font-mono font-black tracking-wider">
            {timeString}
          </span>
        </div>

        <span
          className={`text-[11px] font-bold mt-0.5 tracking-wide uppercase ${
            isSelected ? 'text-amber-200' : 'text-[#64748B]'
          }`}
        >
          Drag to Train or Tap
        </span>
      </div>

      {/* Floating Drag Ghost tracking pointer */}
      {isDragging && (
        <div
          style={{
            position: 'fixed',
            left: dragPosition.x,
            top: dragPosition.y,
            width: 170,
            pointerEvents: 'none',
            zIndex: 9999,
            transform: 'rotate(5deg) scale(1.08)',
          }}
          className="px-4 py-3 rounded-2xl border-4 border-[#1B2A49] bg-amber-300 text-[#1B2A49] shadow-2xl flex flex-col items-center justify-center"
        >
          <div className="flex items-center gap-2">
            <span className="text-2xl">🎫</span>
            <span className="text-2xl font-mono font-black">{timeString}</span>
          </div>
          <span className="text-[10px] font-black uppercase text-amber-900 mt-0.5">
            Boarding Pass
          </span>
        </div>
      )}
    </>
  );
};

export const AnswerChoices: React.FC<AnswerChoicesProps> = ({
  choices,
  selectedChoice,
  onSelect,
  onDropTicket,
  onDragStateChange,
  disabled = false,
  className = '',
}) => {
  return (
    <div
      className={`grid grid-cols-2 gap-3 sm:gap-4 w-full max-w-md mx-auto ${className}`}
      role="group"
      aria-label="Train boarding time tickets"
    >
      {choices.map((choice, i) => {
        const isSelected =
          selectedChoice !== null &&
          selectedChoice.h % 12 === choice.h % 12 &&
          selectedChoice.m === choice.m;

        return (
          <TicketItem
            key={i}
            choice={choice}
            isSelected={isSelected}
            disabled={disabled}
            onSelect={onSelect}
            onDropTicket={onDropTicket}
            onDragStateChange={onDragStateChange}
          />
        );
      })}
    </div>
  );
};
