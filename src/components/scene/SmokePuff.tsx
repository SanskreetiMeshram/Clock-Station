import React from 'react';

export interface SmokePuffProps {
  x: number;
  y: number;
  id: number;
}

export const SmokePuff: React.FC<SmokePuffProps> = ({ x, y }) => {
  return (
    <g className="animate-steam pointer-events-none" style={{ transformOrigin: `${x}px ${y}px` }}>
      <circle cx={x} cy={y} r="14" fill="#FFFFFF" fillOpacity="0.85" />
      <circle cx={x - 8} cy={y - 6} r="10" fill="#F1F5F9" fillOpacity="0.75" />
      <circle cx={x + 6} cy={y - 8} r="12" fill="#E2E8F0" fillOpacity="0.7" />
    </g>
  );
};
