import React from 'react';
import type { LocomotiveStyle } from '../../types/game';
import { TrainLocomotive } from './TrainLocomotive';
import { SmokePuff } from './SmokePuff';

export type TrainState = 'arriving' | 'waiting' | 'wobble' | 'departing';
export type SignalState = 'red' | 'amber' | 'green';

export interface TrainSceneProps {
  trainState: TrainState;
  signalState: SignalState;
  locomotiveStyle?: LocomotiveStyle;
  trainName?: string;
  className?: string;
}

export const TrainScene: React.FC<TrainSceneProps> = ({
  trainState,
  signalState,
  locomotiveStyle = 'steam_red',
  trainName,
  className = '',
}) => {
  // Translate train based on motion state
  const trainTransformClass = {
    arriving: 'translate-x-0 transition-transform duration-700 ease-out',
    waiting: 'translate-x-0 animate-bounceSubtle',
    wobble: 'translate-x-0 animate-wobble',
    departing: '-translate-x-[150%] transition-transform duration-1000 ease-in',
  }[trainState];

  return (
    <div className={`relative w-full overflow-hidden rounded-3xl border-4 border-[#1B2A49] shadow-chunky bg-gradient-to-b from-[#8EDBFF] via-[#BAE6FD] to-[#E0F2FE] ${className}`}>
      {/* SVG Scenery: Hills, Station Clock Tower, Tracks */}
      <svg
        viewBox="0 0 900 320"
        className="w-full h-auto block select-none"
        preserveAspectRatio="xMidYMid slice"
      >
        <defs>
          <linearGradient id="hill-grad-1" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#86EFAC" />
            <stop offset="100%" stopColor="#4ADE80" />
          </linearGradient>
          <linearGradient id="hill-grad-2" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#4ADE80" />
            <stop offset="100%" stopColor="#22C55E" />
          </linearGradient>
        </defs>

        {/* Fluffy drifting clouds */}
        <g fill="#FFFFFF" fillOpacity="0.85">
          <ellipse cx="120" cy="55" rx="45" ry="24" />
          <ellipse cx="150" cy="45" rx="35" ry="22" />
          <ellipse cx="90" cy="58" rx="30" ry="18" />

          <ellipse cx="620" cy="45" rx="55" ry="26" />
          <ellipse cx="660" cy="35" rx="40" ry="24" />
          <ellipse cx="580" cy="48" rx="35" ry="20" />
        </g>

        {/* Distant Hills */}
        <path d="M -50 200 Q 150 110 400 190 T 950 170 L 950 320 L -50 320 Z" fill="url(#hill-grad-1)" />
        <path d="M -50 230 Q 280 160 550 220 T 950 210 L 950 320 L -50 320 Z" fill="url(#hill-grad-2)" />

        {/* Station Clock Tower on the Hill */}
        <g transform="translate(680, 70)">
          {/* Tower Body */}
          <rect x="20" y="45" width="70" height="120" fill="#F87171" stroke="#1B2A49" strokeWidth="4" />
          {/* Pointy Roof */}
          <polygon points="10,45 55,-10 100,45" fill="#EF4444" stroke="#1B2A49" strokeWidth="4" />
          {/* Weather Vane Flag */}
          <line x1="55" y1="-10" x2="55" y2="-25" stroke="#1B2A49" strokeWidth="3" />
          <polygon points="55,-25 75,-20 55,-15" fill="#FFD23F" stroke="#1B2A49" strokeWidth="2" />
          {/* Tower Clock Dial */}
          <circle cx="55" cy="85" r="22" fill="#FFF8E7" stroke="#1B2A49" strokeWidth="4" />
          <line x1="55" y1="85" x2="55" y2="70" stroke="#1B2A49" strokeWidth="3" strokeLinecap="round" />
          <line x1="55" y1="85" x2="68" y2="85" stroke="#1B2A49" strokeWidth="3" strokeLinecap="round" />
          {/* Station Arch */}
          <path d="M 40 165 C 40 145 70 145 70 165 Z" fill="#1B2A49" />
        </g>

        {/* Station Platform Canopy Roof */}
        <g transform="translate(0, 110)">
          <rect x="20" y="40" width="450" height="16" rx="6" fill="#FF9F1C" stroke="#1B2A49" strokeWidth="4" />
          {/* Roof Pillars */}
          <rect x="60" y="56" width="10" height="80" fill="#CBD5E1" stroke="#1B2A49" strokeWidth="3" />
          <rect x="220" y="56" width="10" height="80" fill="#CBD5E1" stroke="#1B2A49" strokeWidth="3" />
          <rect x="380" y="56" width="10" height="80" fill="#CBD5E1" stroke="#1B2A49" strokeWidth="3" />
          {/* Station Sign Hanging from Canopy */}
          <rect x="110" y="62" width="180" height="34" rx="8" fill="#1B2A49" stroke="#FFD23F" strokeWidth="3" />
          <text x="200" y="85" textAnchor="middle" fill="#FFD23F" fontSize="16" fontWeight="bold" fontFamily="Fredoka, sans-serif">
            {trainName ? trainName.toUpperCase() : 'CLOCK STATION'}
          </text>
        </g>

        {/* Railway Ballast Bed & Wooden Sleepers */}
        <rect x="0" y="240" width="900" height="80" fill="#64748B" />
        {/* Sleepers */}
        {Array.from({ length: 28 }, (_, i) => (
          <rect
            key={i}
            x={i * 34 + 6}
            y="252"
            width="22"
            height="46"
            rx="4"
            fill="#8B5A2B"
            stroke="#1B2A49"
            strokeWidth="2"
          />
        ))}

        {/* Metal Steel Rails */}
        <rect x="0" y="260" width="900" height="6" fill="#CBD5E1" stroke="#1B2A49" strokeWidth="2" />
        <rect x="0" y="286" width="900" height="6" fill="#CBD5E1" stroke="#1B2A49" strokeWidth="2" />

        {/* Railway Platform Front Curb */}
        <rect x="0" y="210" width="900" height="32" fill="#E2E8F0" stroke="#1B2A49" strokeWidth="3" />
        {/* Yellow Safety Warning Line */}
        <line x1="0" y1="216" x2="900" y2="216" stroke="#FBBF24" strokeWidth="6" strokeDasharray="14 10" />

        {/* Station Signal Post */}
        <g transform="translate(60, 140)">
          <line x1="20" y1="0" x2="20" y2="100" stroke="#1B2A49" strokeWidth="6" />
          <rect x="8" y="0" width="24" height="60" rx="8" fill="#1B2A49" stroke="#94A3B8" strokeWidth="2" />
          {/* Red light */}
          <circle
            cx="20"
            cy="12"
            r="8"
            fill={signalState === 'red' ? '#EF4444' : '#450A0A'}
            stroke="#1B2A49"
            strokeWidth="2"
            className={signalState === 'red' ? 'animate-pulse' : ''}
          />
          {/* Amber light */}
          <circle
            cx="20"
            cy="30"
            r="8"
            fill={signalState === 'amber' ? '#F59E0B' : '#451A03'}
            stroke="#1B2A49"
            strokeWidth="2"
            className={signalState === 'amber' ? 'animate-pulse' : ''}
          />
          {/* Green light */}
          <circle
            cx="20"
            cy="48"
            r="8"
            fill={signalState === 'green' ? '#10B981' : '#064E3B'}
            stroke="#1B2A49"
            strokeWidth="2"
            className={signalState === 'green' ? 'animate-pulse' : ''}
          />
        </g>
      </svg>

      {/* The Train on the Track */}
      <div
        className={`absolute bottom-[10px] left-[180px] w-[340px] z-10 ${trainTransformClass}`}
      >
        <TrainLocomotive style={locomotiveStyle} />

        {/* Smoke Puffs when Departing or Arriving */}
        {(trainState === 'departing' || trainState === 'arriving') && (
          <div className="absolute -top-12 left-[200px]">
            <svg width="100" height="80" className="overflow-visible">
              <SmokePuff x={20} y={30} id={1} />
              <SmokePuff x={40} y={15} id={2} />
              <SmokePuff x={60} y={5} id={3} />
            </svg>
          </div>
        )}
      </div>
    </div>
  );
};
