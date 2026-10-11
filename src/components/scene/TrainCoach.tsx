import React from 'react';
import type { LocomotiveStyle } from '../../types/game';

export interface TrainCoachProps {
  style?: LocomotiveStyle;
  isMoving?: boolean;
  speed?: 'normal' | 'fast';
  className?: string;
}

export const TrainCoach: React.FC<TrainCoachProps> = ({
  style = 'steam_red',
  isMoving = false,
  speed = 'normal',
  className = '',
}) => {
  const wheelAnimClass = isMoving
    ? speed === 'fast'
      ? 'anim-wheel-fast'
      : 'anim-wheel-spin'
    : '';

  // Theme colors per locomotive style
  const theme = {
    steam_red: {
      body: '#E11D48',
      stripe: '#FFD23F',
      roof: '#1B2A49',
      windowGlow: '#FEF08A',
    },
    mountain_green: {
      body: '#16A34A',
      stripe: '#FFD23F',
      roof: '#1B2A49',
      windowGlow: '#DCFCE7',
    },
    toy_yellow: {
      body: '#F59E0B',
      stripe: '#EF4444',
      roof: '#B45309',
      windowGlow: '#FEF9C3',
    },
    diesel_blue: {
      body: '#2563EB',
      stripe: '#F59E0B',
      roof: '#1E293B',
      windowGlow: '#DBEAFE',
    },
    bullet_purple: {
      body: '#7C3AED',
      stripe: '#F43F5E',
      roof: '#4C1D95',
      windowGlow: '#E0E7FF',
    },
    royal_grand: {
      body: '#991B1B',
      stripe: '#FBBF24',
      roof: '#450A0A',
      windowGlow: '#FEF3C7',
    },
    electric_teal: {
      body: '#0D9488',
      stripe: '#2DD4BF',
      roof: '#134E4A',
      windowGlow: '#CCFBF1',
    },
    cargo_orange: {
      body: '#EA580C',
      stripe: '#FBBF24',
      roof: '#7C2D12',
      windowGlow: '#FFEDD5',
    },
    metro_gold: {
      body: '#D97706',
      stripe: '#FCD34D',
      roof: '#78350F',
      windowGlow: '#FEF3C7',
    },
    star_silver: {
      body: '#64748B',
      stripe: '#38BDF8',
      roof: '#334155',
      windowGlow: '#E0F2FE',
    },
  }[style] || {
    body: '#E11D48',
    stripe: '#FFD23F',
    roof: '#1B2A49',
    windowGlow: '#FEF08A',
  };

  const renderSpokedWheel = (cx: number, cy: number, r: number) => {
    return (
      <g key={`${cx}-${cy}`}>
        {/* Outer Rim */}
        <circle cx={cx} cy={cy} r={r} fill="#1E293B" stroke="#0F172A" strokeWidth="3" />
        <circle cx={cx} cy={cy} r={r - 4} fill="#334155" />
        {/* Rotating Spokes & Hub */}
        <g
          className={wheelAnimClass}
          style={{ transformOrigin: `${cx}px ${cy}px` }}
        >
          {/* 6 Spokes */}
          {[0, 60, 120].map((deg) => (
            <line
              key={deg}
              x1={cx - (r - 5) * Math.cos((deg * Math.PI) / 180)}
              y1={cy - (r - 5) * Math.sin((deg * Math.PI) / 180)}
              x2={cx + (r - 5) * Math.cos((deg * Math.PI) / 180)}
              y2={cy + (r - 5) * Math.sin((deg * Math.PI) / 180)}
              stroke="#CBD5E1"
              strokeWidth="2.5"
            />
          ))}
          {/* Wheel Hub */}
          <circle cx={cx} cy={cy} r={r * 0.35} fill="#F1F5F9" stroke="#0F172A" strokeWidth="2" />
        </g>
      </g>
    );
  };

  return (
    <svg
      viewBox="0 0 200 180"
      className={`w-full h-auto overflow-visible select-none ${className}`}
    >
      <defs>
        {/* Subtle drop shadow under carriage */}
        <filter id="carriage-shadow" x="-10%" y="-10%" width="120%" height="130%">
          <feDropShadow dx="0" dy="4" stdDeviation="3" floodColor="#0F172A" floodOpacity="0.3" />
        </filter>
      </defs>

      {/* Coupler Hitch linking to locomotive */}
      <rect x="180" y="130" width="24" height="8" rx="2" fill="#334155" stroke="#0F172A" strokeWidth="2" />
      <circle cx="192" cy="134" r="4" fill="#64748B" />

      {/* Main Carriage Body */}
      <g filter="url(#carriage-shadow)">
        <rect
          x="10"
          y="42"
          width="175"
          height="88"
          rx="12"
          fill={theme.body}
          stroke="#1B2A49"
          strokeWidth="5"
        />

        {/* Curved Roof */}
        <path
          d="M 6 46 C 6 36 30 30 98 30 C 166 30 188 36 188 46 Z"
          fill={theme.roof}
          stroke="#1B2A49"
          strokeWidth="4"
        />
        {/* Roof Ventilator Ribs */}
        <ellipse cx="60" cy="30" rx="10" ry="3" fill="#64748B" />
        <ellipse cx="135" cy="30" rx="10" ry="3" fill="#64748B" />

        {/* Decorative Golden / Colored Stripe */}
        <line
          x1="10"
          y1="108"
          x2="185"
          y2="108"
          stroke={theme.stripe}
          strokeWidth="7"
          strokeLinecap="round"
        />

        {/* Passenger Windows */}
        {/* Window 1 */}
        <rect
          x="26"
          y="56"
          width="36"
          height="34"
          rx="6"
          fill={theme.windowGlow}
          stroke="#1B2A49"
          strokeWidth="3.5"
        />
        {/* Passenger 1 silhouette */}
        <circle cx="44" cy="74" r="8" fill="#1B2A49" opacity="0.65" />
        <path d="M 34 90 C 34 82 54 82 54 90 Z" fill="#1B2A49" opacity="0.65" />

        {/* Window 2 */}
        <rect
          x="78"
          y="56"
          width="36"
          height="34"
          rx="6"
          fill={theme.windowGlow}
          stroke="#1B2A49"
          strokeWidth="3.5"
        />
        {/* Passenger 2 silhouette (waving hand) */}
        <circle cx="96" cy="73" r="8" fill="#1B2A49" opacity="0.65" />
        <path d="M 86 90 C 86 82 106 82 106 90 Z" fill="#1B2A49" opacity="0.65" />
        <circle cx="107" cy="74" r="3" fill="#1B2A49" opacity="0.65" />

        {/* Window 3 */}
        <rect
          x="130"
          y="56"
          width="36"
          height="34"
          rx="6"
          fill={theme.windowGlow}
          stroke="#1B2A49"
          strokeWidth="3.5"
        />
        {/* Passenger 3 silhouette */}
        <circle cx="148" cy="74" r="8" fill="#1B2A49" opacity="0.65" />
        <path d="M 138 90 C 138 82 158 82 158 90 Z" fill="#1B2A49" opacity="0.65" />
      </g>

      {/* Undercarriage Frame */}
      <rect x="22" y="130" width="150" height="10" rx="3" fill="#1B2A49" />

      {/* Carriage Bogie Wheels (2 pairs) */}
      {renderSpokedWheel(45, 145, 18)}
      {renderSpokedWheel(80, 145, 18)}
      {renderSpokedWheel(120, 145, 18)}
      {renderSpokedWheel(155, 145, 18)}
    </svg>
  );
};
