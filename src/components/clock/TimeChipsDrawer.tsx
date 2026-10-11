import React, { useEffect } from 'react';
import { useDraggableItem } from '../../hooks/useDraggableItem';

export interface TimeChip {
  id: string;
  label: string;
  minutes: number;
  color: string;
  icon: string;
}

const TIME_CHIPS: TimeChip[] = [
  { id: 'plus-5', label: '+5 min', minutes: 5, color: '#3DDC84', icon: '⚡' },
  { id: 'plus-15', label: '+15 min', minutes: 15, color: '#3A86FF', icon: '🕒' },
  { id: 'plus-30', label: '+30 min', minutes: 30, color: '#FF9F1C', icon: '⏳' },
  { id: 'plus-60', label: '+1 hour', minutes: 60, color: '#8338EC', icon: '🚂' },
];

export interface TimeChipsDrawerProps {
  onApplyDeltaMinutes: (minutes: number) => void;
  onDragStateChange?: (isDragging: boolean, activeTarget: string | null) => void;
  disabled?: boolean;
  className?: string;
}

interface DraggableChipProps {
  chip: TimeChip;
  disabled: boolean;
  onApplyDeltaMinutes: (minutes: number) => void;
  onDragStateChange?: (isDragging: boolean, activeTarget: string | null) => void;
}

const DraggableChip: React.FC<DraggableChipProps> = ({
  chip,
  disabled,
  onApplyDeltaMinutes,
  onDragStateChange,
}) => {
  const { isDragging, dragPosition, activeTargetId, dragProps } =
    useDraggableItem<TimeChip>({
      data: chip,
      disabled,
      onClickFallback: () => onApplyDeltaMinutes(chip.minutes),
      onDrop: (targetId, data) => {
        if (targetId === 'analog-clock-face') {
          onApplyDeltaMinutes(data.minutes);
        } else {
          onApplyDeltaMinutes(data.minutes);
        }
      },
    });

  useEffect(() => {
    onDragStateChange?.(isDragging, activeTargetId);
  }, [isDragging, activeTargetId, onDragStateChange]);

  return (
    <>
      <div
        {...dragProps}
        role="button"
        tabIndex={disabled ? -1 : 0}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            onApplyDeltaMinutes(chip.minutes);
          }
        }}
        aria-label={`Time jump ${chip.label}. Drag to clock or tap.`}
        className={`px-3 py-1.5 rounded-full border-2 border-[#1B2A49] font-black text-xs sm:text-sm text-white flex items-center gap-1.5 shadow-chunky-sm transition-transform cursor-grab active:cursor-grabbing hover:-translate-y-0.5 select-none ${
          isDragging ? 'opacity-30 scale-90' : 'opacity-100'
        }`}
        style={{ backgroundColor: chip.color }}
      >
        <span>{chip.icon}</span>
        <span>{chip.label}</span>
      </div>

      {/* Floating Drag Ghost */}
      {isDragging && (
        <div
          style={{
            position: 'fixed',
            left: dragPosition.x,
            top: dragPosition.y,
            pointerEvents: 'none',
            zIndex: 9999,
            transform: 'scale(1.15) rotate(-6deg)',
            backgroundColor: chip.color,
          }}
          className="px-4 py-2 rounded-full border-3 border-[#1B2A49] font-black text-white shadow-2xl flex items-center gap-2"
        >
          <span className="text-xl">{chip.icon}</span>
          <span className="text-base">{chip.label}</span>
        </div>
      )}
    </>
  );
};

export const TimeChipsDrawer: React.FC<TimeChipsDrawerProps> = ({
  onApplyDeltaMinutes,
  onDragStateChange,
  disabled = false,
  className = '',
}) => {
  return (
    <div
      className={`flex flex-wrap items-center justify-center gap-2 p-2 rounded-2xl bg-white/80 border-2 border-[#1B2A49] shadow-sm ${className}`}
      role="group"
      aria-label="Quick time advance tokens"
    >
      <span className="text-xs font-bold text-[#64748B] uppercase tracking-wide mr-1">
        Quick Jump:
      </span>
      {TIME_CHIPS.map((chip) => (
        <DraggableChip
          key={chip.id}
          chip={chip}
          disabled={disabled}
          onApplyDeltaMinutes={onApplyDeltaMinutes}
          onDragStateChange={onDragStateChange}
        />
      ))}
    </div>
  );
};
