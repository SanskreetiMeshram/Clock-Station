import React from 'react';

export interface SmokePuffProps {
  x: number;
  y: number;
  id: number;
  variant?: 'chimney' | 'whistle';
  delayMs?: number;
  scale?: number;
}

export const SmokePuff: React.FC<SmokePuffProps> = ({
  x,
  y,
  variant = 'chimney',
  delayMs = 0,
  scale = 1,
}) => {
  if (variant === 'whistle') {
    return (
      <g
        className="anim-whistle-steam pointer-events-none"
        style={{
          transformOrigin: `${x}px ${y}px`,
          animationDelay: `${delayMs}ms`,
        }}
      >
        <ellipse cx={x} cy={y - 12} rx="6" ry="14" fill="#FFFFFF" fillOpacity="0.9" />
        <ellipse cx={x} cy={y - 24} rx="9" ry="18" fill="#F8FAFC" fillOpacity="0.8" />
        <circle cx={x + 3} cy={y - 38} r="12" fill="#F1F5F9" fillOpacity="0.6" />
      </g>
    );
  }

  return (
    <g
      className="anim-steam-puff pointer-events-none select-none"
      style={{
        transformOrigin: `${x}px ${y}px`,
        animationDelay: `${delayMs}ms`,
        transform: `scale(${scale})`,
      }}
    >
      {/* Fluffy multi-lobed steam cluster */}
      <circle cx={x} cy={y} r="18" fill="#FFFFFF" fillOpacity="0.9" />
      <circle cx={x - 12} cy={y - 8} r="14" fill="#F8FAFC" fillOpacity="0.85" />
      <circle cx={x + 10} cy={y - 10} r="16" fill="#F1F5F9" fillOpacity="0.8" />
      <circle cx={x - 4} cy={y - 18} r="13" fill="#E2E8F0" fillOpacity="0.75" />
      <circle cx={x + 6} cy={y - 22} r="11" fill="#E2E8F0" fillOpacity="0.6" />
    </g>
  );
};
