import React from 'react';
import type { LocomotiveStyle } from '../../types/game';
import { TrainLocomotive } from './TrainLocomotive';
import { TrainCoach } from './TrainCoach';
import { SmokePuff } from './SmokePuff';

export type TrainState = 'arriving' | 'waiting' | 'wobble' | 'departing';
export type SignalState = 'red' | 'amber' | 'green';

export interface TrainSceneProps {
  trainState: TrainState;
  signalState: SignalState;
  locomotiveStyle?: LocomotiveStyle;
  trainName?: string;
  isDragActive?: boolean;
  isHoveredDropTarget?: boolean;
  className?: string;
}

export const TrainScene: React.FC<TrainSceneProps> = ({
  trainState,
  signalState,
  locomotiveStyle = 'steam_red',
  trainName,
  isDragActive = false,
  isHoveredDropTarget = false,
  className = '',
}) => {
  const isMoving = trainState === 'departing' || trainState === 'arriving';
  const speed = trainState === 'departing' ? 'fast' : 'normal';

  // Smooth realistic travel physics
  const trainMotionStyle: React.CSSProperties = {
    transition:
      trainState === 'arriving'
        ? 'transform 1.1s cubic-bezier(0.1, 0.9, 0.2, 1)'
        : trainState === 'departing'
        ? 'transform 1.4s cubic-bezier(0.4, 0, 1, 1)'
        : 'transform 0.4s ease-out',
    transform:
      trainState === 'arriving'
        ? 'translateX(0px)'
        : trainState === 'departing'
        ? 'translateX(180%)'
        : 'translateX(0px)',
  };

  const trainMotionClass =
    trainState === 'waiting'
      ? 'anim-train-idle'
      : trainState === 'wobble'
      ? 'animate-wobble'
      : '';

  return (
    <div
      className={`relative w-full overflow-hidden rounded-3xl border-4 border-[#1B2A49] shadow-chunky bg-gradient-to-b from-[#7DD3FC] via-[#BAE6FD] to-[#E0F2FE] ${className}`}
    >
      {/* Background SVG Scenery: Hills, Station Architecture, Rails */}
      <svg
        viewBox="0 0 920 320"
        className="w-full h-auto block select-none pointer-events-none"
        preserveAspectRatio="xMidYMid slice"
      >
        <defs>
          <linearGradient id="sky-haze" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#38BDF8" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#BAE6FD" stopOpacity="0" />
          </linearGradient>
          <linearGradient id="hill-grad-1" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#86EFAC" />
            <stop offset="100%" stopColor="#22C55E" />
          </linearGradient>
          <linearGradient id="hill-grad-2" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#4ADE80" />
            <stop offset="100%" stopColor="#15803D" />
          </linearGradient>
          <radialGradient id="lamp-glow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#FEF08A" stopOpacity="0.85" />
            <stop offset="50%" stopColor="#FDE047" stopOpacity="0.3" />
            <stop offset="100%" stopColor="#FDE047" stopOpacity="0" />
          </radialGradient>
          <filter id="light-bloom" x="-30%" y="-30%" width="160%" height="160%">
            <feGaussianBlur stdDeviation="4" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {/* Ambient Sky Haze */}
        <rect x="0" y="0" width="920" height="200" fill="url(#sky-haze)" />

        {/* Fluffy drifting clouds */}
        <g fill="#FFFFFF" fillOpacity="0.88">
          <ellipse cx="110" cy="50" rx="48" ry="24" />
          <ellipse cx="145" cy="40" rx="36" ry="22" />
          <ellipse cx="80" cy="54" rx="32" ry="18" />

          <ellipse cx="500" cy="35" rx="55" ry="24" />
          <ellipse cx="540" cy="25" rx="40" ry="22" />
          <ellipse cx="460" cy="38" rx="35" ry="18" />

          <ellipse cx="780" cy="48" rx="50" ry="22" />
          <ellipse cx="815" cy="38" rx="38" ry="20" />
        </g>

        {/* Distant Mountains & Rolling Hills */}
        <path d="M -50 190 Q 160 100 420 180 T 960 160 L 960 320 L -50 320 Z" fill="url(#hill-grad-1)" opacity="0.85" />
        <path d="M -50 220 Q 260 150 560 210 T 960 200 L 960 320 L -50 320 Z" fill="url(#hill-grad-2)" />

        {/* Station Clock Tower on the Ridge */}
        <g transform="translate(710, 60)">
          {/* Tower Body */}
          <rect x="20" y="45" width="74" height="130" fill="#F87171" stroke="#1B2A49" strokeWidth="4" />
          <polygon points="10,45 57,-12 104,45" fill="#DC2626" stroke="#1B2A49" strokeWidth="4" />
          {/* Flagpole & Brass Finial */}
          <line x1="57" y1="-12" x2="57" y2="-28" stroke="#1B2A49" strokeWidth="3" />
          <polygon points="57,-28 78,-23 57,-17" fill="#FFD23F" stroke="#1B2A49" strokeWidth="2" />
          {/* Tower Clock Dial with Gold Rim */}
          <circle cx="57" cy="85" r="24" fill="#FFF8E7" stroke="#1B2A49" strokeWidth="4" />
          <circle cx="57" cy="85" r="22" fill="none" stroke="#F59E0B" strokeWidth="2" />
          <line x1="57" y1="85" x2="57" y2="70" stroke="#1B2A49" strokeWidth="3.5" strokeLinecap="round" />
          <line x1="57" y1="85" x2="70" y2="85" stroke="#1B2A49" strokeWidth="3.5" strokeLinecap="round" />
        </g>

        {/* Station Platform Canopy Roof */}
        <g transform="translate(0, 95)">
          {/* Ornate Iron Roof Truss */}
          <rect x="10" y="40" width="460" height="16" rx="6" fill="#EA580C" stroke="#1B2A49" strokeWidth="4" />
          <rect x="18" y="52" width="444" height="6" fill="#FFD23F" />
          {/* Roof Pillars with Decorative Cornices */}
          <rect x="45" y="56" width="12" height="95" fill="#94A3B8" stroke="#1B2A49" strokeWidth="3" />
          <rect x="220" y="56" width="12" height="95" fill="#94A3B8" stroke="#1B2A49" strokeWidth="3" />
          <rect x="395" y="56" width="12" height="95" fill="#94A3B8" stroke="#1B2A49" strokeWidth="3" />

          {/* Hanging Station Lamps */}
          <g transform="translate(130, 56)">
            <line x1="0" y1="0" x2="0" y2="24" stroke="#1B2A49" strokeWidth="2.5" />
            <path d="M -12 24 L 12 24 L 8 36 L -8 36 Z" fill="#1B2A49" />
            <circle cx="0" cy="38" r="6" fill="#FEF08A" />
            <circle cx="0" cy="38" r="32" fill="url(#lamp-glow)" />
          </g>
          <g transform="translate(310, 56)">
            <line x1="0" y1="0" x2="0" y2="24" stroke="#1B2A49" strokeWidth="2.5" />
            <path d="M -12 24 L 12 24 L 8 36 L -8 36 Z" fill="#1B2A49" />
            <circle cx="0" cy="38" r="6" fill="#FEF08A" />
            <circle cx="0" cy="38" r="32" fill="url(#lamp-glow)" />
          </g>

          {/* Station Sign Board */}
          <rect x="120" y="66" width="180" height="34" rx="8" fill="#1B2A49" stroke="#FFD23F" strokeWidth="3" />
          <text
            x="210"
            y="89"
            textAnchor="middle"
            fill="#FFD23F"
            fontSize="16"
            fontWeight="800"
            fontFamily="Fredoka, Baloo 2, sans-serif"
          >
            {trainName ? trainName.toUpperCase() : 'CLOCK STATION'}
          </text>
        </g>

        {/* Railway Ballast Bed & Wooden Sleepers */}
        <rect x="0" y="240" width="920" height="80" fill="#475569" />
        {/* Sleepers */}
        {Array.from({ length: 30 }, (_, i) => (
          <rect
            key={i}
            x={i * 32 + 4}
            y="252"
            width="22"
            height="46"
            rx="4"
            fill="#78350F"
            stroke="#1B2A49"
            strokeWidth="2"
          />
        ))}

        {/* Steel Rail Tracks */}
        <rect x="0" y="260" width="920" height="6" fill="#E2E8F0" stroke="#1B2A49" strokeWidth="2" />
        <rect x="0" y="286" width="920" height="6" fill="#E2E8F0" stroke="#1B2A49" strokeWidth="2" />

        {/* Railway Platform Front Curb with Textured Pavement */}
        <rect x="0" y="210" width="920" height="32" fill="#CBD5E1" stroke="#1B2A49" strokeWidth="3" />
        {/* Warning Hazard Line */}
        <line x1="0" y1="216" x2="920" y2="216" stroke="#F59E0B" strokeWidth="6" strokeDasharray="14 10" />

        {/* Station Signal Post */}
        <g transform="translate(48, 135)">
          <line x1="20" y1="0" x2="20" y2="105" stroke="#1B2A49" strokeWidth="7" />
          <rect x="8" y="0" width="24" height="64" rx="8" fill="#1B2A49" stroke="#94A3B8" strokeWidth="2.5" />
          {/* Red Light */}
          <circle
            cx="20"
            cy="12"
            r="8"
            fill={signalState === 'red' ? '#EF4444' : '#450A0A'}
            stroke="#1B2A49"
            strokeWidth="2"
            filter={signalState === 'red' ? 'url(#light-bloom)' : undefined}
          />
          {/* Amber Light */}
          <circle
            cx="20"
            cy="32"
            r="8"
            fill={signalState === 'amber' ? '#F59E0B' : '#451A03'}
            stroke="#1B2A49"
            strokeWidth="2"
            filter={signalState === 'amber' ? 'url(#light-bloom)' : undefined}
          />
          {/* Green Light */}
          <circle
            cx="20"
            cy="52"
            r="8"
            fill={signalState === 'green' ? '#10B981' : '#064E3B'}
            stroke="#1B2A49"
            strokeWidth="2"
            filter={signalState === 'green' ? 'url(#light-bloom)' : undefined}
          />
        </g>
      </svg>

      {/* The Train on the Track (Passenger Carriage + Locomotive) */}
      <div
        style={trainMotionStyle}
        className={`absolute bottom-[3%] left-[4%] w-[88%] max-w-[540px] z-10 flex items-end ${trainMotionClass}`}
      >
        {/* Coupled Coach / Tender */}
        <div className="w-[38%] shrink-0">
          <TrainCoach
            style={locomotiveStyle}
            isMoving={isMoving}
            speed={speed}
          />
        </div>

        {/* Main Locomotive Engine */}
        <div className="w-[62%] shrink-0 -ml-[2%] relative">
          <TrainLocomotive
            style={locomotiveStyle}
            isMoving={isMoving}
            speed={speed}
          />

          {/* Billowing Steam & Whistle Plumes */}
          {(trainState === 'departing' || trainState === 'arriving' || trainState === 'waiting') && (
            <div className="absolute -top-16 left-[50%] pointer-events-none">
              <svg width="240" height="120" className="overflow-visible">
                {/* Chimney Steam Puffs */}
                <SmokePuff x={30} y={40} id={1} delayMs={0} scale={1.1} />
                <SmokePuff x={45} y={25} id={2} delayMs={250} scale={1.3} />
                <SmokePuff x={60} y={15} id={3} delayMs={500} scale={1.5} />
                {trainState === 'departing' && (
                  <>
                    <SmokePuff x={80} y={10} id={4} delayMs={750} scale={1.8} />
                    <SmokePuff x={100} y={5} id={5} delayMs={1000} scale={2.1} />
                    {/* Whistle Steam Jet */}
                    <SmokePuff x={-15} y={35} id={6} variant="whistle" delayMs={0} />
                  </>
                )}
              </svg>
            </div>
          )}
        </div>

        {/* Interactive Drop Target: Ticket Slot on the Train */}
        <div
          data-droptarget="train-ticket-slot"
          className={`absolute -top-9 left-[12%] z-20 transition-all transform duration-200 ${
            isDragActive
              ? isHoveredDropTarget
                ? 'scale-110 -translate-y-2'
                : 'scale-100 opacity-95'
              : 'opacity-0 pointer-events-none'
          }`}
        >
          <div
            className={`px-4 py-2 rounded-2xl border-4 font-black text-sm sm:text-base flex items-center gap-2 shadow-chunky transition-colors ${
              isHoveredDropTarget
                ? 'bg-amber-400 text-[#1B2A49] border-[#1B2A49] ring-4 ring-white animate-pulse'
                : 'bg-white/95 text-[#1B2A49] border-[#1B2A49] border-dashed'
            }`}
          >
            <span className="text-xl">📥</span>
            <span>{isHoveredDropTarget ? 'RELEASE TO BOARD! 🚂' : 'DROP TICKET HERE!'}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
