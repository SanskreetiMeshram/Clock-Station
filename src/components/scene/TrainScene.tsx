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

  // Apply dedicated CSS keyframe animations for each train state
  const trainMotionClass =
    trainState === 'arriving'
      ? 'anim-train-arrive'
      : trainState === 'departing'
      ? 'anim-train-depart'
      : trainState === 'wobble'
      ? 'anim-train-wobble'
      : 'anim-train-idle';

  return (
    <div
      data-droptarget="train-ticket-slot"
      className={`relative w-full h-full overflow-hidden rounded-3xl border-4 border-[#1B2A49] shadow-chunky bg-gradient-to-b from-[#7DD3FC] via-[#BAE6FD] to-[#E0F2FE] select-none ${className}`}
    >
      {/* Complete Panoramic SVG: Sky, Hills, Town Street, Station & Rails */}
      <svg
        viewBox="0 0 1500 215"
        preserveAspectRatio="xMidYMid meet"
        className="w-full h-full block"
      >
        <defs>
          <linearGradient id="sky-haze" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#38BDF8" stopOpacity="0.45" />
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
          <radialGradient id="street-lamp-glow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#FEF08A" stopOpacity="0.9" />
            <stop offset="35%" stopColor="#FDE047" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#FDE047" stopOpacity="0" />
          </radialGradient>
          <filter id="light-bloom-fx" x="-30%" y="-30%" width="160%" height="160%">
            <feGaussianBlur stdDeviation="3.5" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {/* Ambient Sky Gradient */}
        <rect x="0" y="0" width="1500" height="130" fill="url(#sky-haze)" />

        {/* Fluffy drifting clouds across the full panorama */}
        <g fill="#FFFFFF" fillOpacity="0.92">
          {/* Cloud Group 1 */}
          <ellipse cx="80" cy="30" rx="38" ry="18" />
          <ellipse cx="110" cy="24" rx="28" ry="16" />
          <ellipse cx="55" cy="33" rx="25" ry="13" />

          {/* Cloud Group 2 */}
          <ellipse cx="380" cy="25" rx="44" ry="20" />
          <ellipse cx="410" cy="18" rx="32" ry="16" />
          <ellipse cx="350" cy="28" rx="26" ry="14" />

          {/* Cloud Group 3 */}
          <ellipse cx="730" cy="28" rx="46" ry="21" />
          <ellipse cx="765" cy="20" rx="34" ry="17" />

          {/* Cloud Group 4 */}
          <ellipse cx="1090" cy="24" rx="42" ry="19" />
          <ellipse cx="1120" cy="18" rx="30" ry="15" />

          {/* Cloud Group 5 */}
          <ellipse cx="1380" cy="32" rx="40" ry="18" />
        </g>

        {/* Distant Hills across the full 1500px width */}
        <path
          d="M -50 125 Q 180 60 480 115 T 1000 100 T 1550 110 L 1550 215 L -50 215 Z"
          fill="url(#hill-grad-1)"
          opacity="0.8"
        />
        <path
          d="M -50 142 Q 250 85 620 135 T 1200 125 T 1550 138 L 1550 215 L -50 215 Z"
          fill="url(#hill-grad-2)"
        />

        {/* ======================================================== */}
        {/* TOWN STREETSCAPE: STATION, SHOPS, CROSSING & STREET ROAD */}
        {/* ======================================================== */}

        {/* 1. Station Clock Tower on Left Platform */}
        <g transform="translate(365, 32)">
          {/* Main Tower Body */}
          <rect x="15" y="40" width="65" height="98" fill="#F87171" stroke="#1B2A49" strokeWidth="3.5" />
          {/* Steeple Pyramid Roof */}
          <polygon points="8,40 47.5,-8 87,40" fill="#DC2626" stroke="#1B2A49" strokeWidth="3.5" />
          {/* Tower Flag */}
          <line x1="47.5" y1="-8" x2="47.5" y2="-22" stroke="#1B2A49" strokeWidth="2.5" />
          <polygon points="47.5,-22 65,-17 47.5,-12" fill="#FFD23F" stroke="#1B2A49" strokeWidth="1.5" />
          {/* Station Clock Dial */}
          <circle cx="47.5" cy="72" r="19" fill="#FFF8E7" stroke="#1B2A49" strokeWidth="3" />
          <circle cx="47.5" cy="72" r="17" fill="none" stroke="#F59E0B" strokeWidth="1.5" />
          <line x1="47.5" y1="72" x2="47.5" y2="60" stroke="#1B2A49" strokeWidth="2.5" strokeLinecap="round" />
          <line x1="47.5" y1="72" x2="59" y2="72" stroke="#1B2A49" strokeWidth="2.5" strokeLinecap="round" />
          {/* Arched Station Entrance */}
          <path d="M 33 138 L 33 112 A 14.5 14.5 0 0 1 62 112 L 62 138 Z" fill="#78350F" stroke="#1B2A49" strokeWidth="2.5" />
        </g>

        {/* 2. Station Platform Canopy Roof */}
        <g transform="translate(0, 48)">
          <rect x="10" y="38" width="350" height="13" rx="4" fill="#EA580C" stroke="#1B2A49" strokeWidth="3.5" />
          <rect x="14" y="47" width="342" height="4" fill="#FFD23F" />
          {/* Support Columns */}
          <rect x="35" y="51" width="9" height="79" fill="#94A3B8" stroke="#1B2A49" strokeWidth="2.5" />
          <rect x="155" y="51" width="9" height="79" fill="#94A3B8" stroke="#1B2A49" strokeWidth="2.5" />
          <rect x="290" y="51" width="9" height="79" fill="#94A3B8" stroke="#1B2A49" strokeWidth="2.5" />

          {/* Hanging Station Lamps */}
          <g transform="translate(95, 51)">
            <line x1="0" y1="0" x2="0" y2="18" stroke="#1B2A49" strokeWidth="2" />
            <path d="M -9 18 L 9 18 L 6 27 L -6 27 Z" fill="#1B2A49" />
            <circle cx="0" cy="29" r="4.5" fill="#FEF08A" />
            <circle cx="0" cy="29" r="24" fill="url(#street-lamp-glow)" />
          </g>
          <g transform="translate(225, 51)">
            <line x1="0" y1="0" x2="0" y2="18" stroke="#1B2A49" strokeWidth="2" />
            <path d="M -9 18 L 9 18 L 6 27 L -6 27 Z" fill="#1B2A49" />
            <circle cx="0" cy="29" r="4.5" fill="#FEF08A" />
            <circle cx="0" cy="29" r="24" fill="url(#street-lamp-glow)" />
          </g>

          {/* Station Sign Board */}
          <rect x="80" y="58" width="160" height="28" rx="6" fill="#1B2A49" stroke="#FFD23F" strokeWidth="2.5" />
          <text
            x="160"
            y="77"
            textAnchor="middle"
            fill="#FFD23F"
            fontSize="13"
            fontWeight="900"
            fontFamily="Fredoka, Baloo 2, sans-serif"
          >
            {trainName ? trainName.toUpperCase() : 'CLOCK STATION'}
          </text>

          {/* Station Luggage & Trolley */}
          <g transform="translate(315, 105)">
            <rect x="0" y="10" width="28" height="14" rx="2" fill="#78350F" stroke="#1B2A49" strokeWidth="1.5" />
            <rect x="5" y="0" width="20" height="10" rx="2" fill="#B45309" stroke="#1B2A49" strokeWidth="1.5" />
            <circle cx="6" cy="25" r="3.5" fill="#1B2A49" />
            <circle cx="24" cy="25" r="3.5" fill="#1B2A49" />
          </g>
        </g>

        {/* 3. Town Street Road Running Behind the Tracks */}
        <g transform="translate(450, 115)">
          {/* Asphalt Street Surface */}
          <rect x="0" y="0" width="1050" height="32" fill="#475569" stroke="#1B2A49" strokeWidth="2" />
          {/* Sidewalk Curb */}
          <rect x="0" y="-7" width="1050" height="7" fill="#CBD5E1" stroke="#1B2A49" strokeWidth="1.5" />
          {/* White Dashed Center Line */}
          <line x1="0" y1="16" x2="1050" y2="16" stroke="#FFFFFF" strokeWidth="2.5" strokeDasharray="20 16" />
        </g>

        {/* 4. Town Building 1: Yellow Townhouse with Flowerboxes */}
        <g transform="translate(475, 60)">
          <rect x="0" y="24" width="92" height="54" fill="#FDE047" stroke="#1B2A49" strokeWidth="3" />
          <polygon points="-5,24 46,-4 97,24" fill="#EA580C" stroke="#1B2A49" strokeWidth="3" />
          {/* Chimney */}
          <rect x="70" y="2" width="14" height="18" fill="#B91C1C" stroke="#1B2A49" strokeWidth="2" />
          {/* Windows */}
          <rect x="12" y="32" width="22" height="20" rx="3" fill="#E0F2FE" stroke="#1B2A49" strokeWidth="2" />
          <rect x="58" y="32" width="22" height="20" rx="3" fill="#E0F2FE" stroke="#1B2A49" strokeWidth="2" />
          {/* Red Flower Boxes */}
          <rect x="10" y="50" width="26" height="5" rx="1.5" fill="#EF4444" />
          <rect x="56" y="50" width="26" height="5" rx="1.5" fill="#EF4444" />
          {/* Front Door */}
          <rect x="36" y="54" width="20" height="24" rx="2" fill="#78350F" stroke="#1B2A49" strokeWidth="2" />
        </g>

        {/* 5. Victorian Ornate Street Lamp #1 */}
        <g transform="translate(595, 80)">
          <line x1="0" y1="0" x2="0" y2="40" stroke="#1B2A49" strokeWidth="3" />
          <path d="M -8 0 L 8 0 L 6 -12 L -6 -12 Z" fill="#1B2A49" />
          <circle cx="0" cy="-6" r="4.5" fill="#FEF08A" />
          <circle cx="0" cy="-6" r="26" fill="url(#street-lamp-glow)" />
        </g>

        {/* 6. Town Building 2: Red Brick Town Bakery & Café with Striped Awning */}
        <g transform="translate(625, 48)">
          <rect x="0" y="30" width="125" height="60" fill="#EF4444" stroke="#1B2A49" strokeWidth="3.5" />
          <rect x="0" y="20" width="125" height="12" fill="#B91C1C" stroke="#1B2A49" strokeWidth="2.5" />
          {/* Bakery Store Sign */}
          <text
            x="62.5"
            y="29"
            textAnchor="middle"
            fill="#FEF08A"
            fontSize="8.5"
            fontWeight="900"
            fontFamily="Fredoka, Baloo 2, sans-serif"
          >
            ★ THE CLOCK BAKERY ★
          </text>
          {/* Striped Store Awning */}
          <path d="M -6 45 L 131 45 L 125 57 L -12 57 Z" fill="#FBBF24" stroke="#1B2A49" strokeWidth="2" />
          <path d="M 12 45 L 30 45 L 26 57 L 8 57 Z" fill="#FFFFFF" />
          <path d="M 50 45 L 68 45 L 64 57 L 46 57 Z" fill="#FFFFFF" />
          <path d="M 88 45 L 106 45 L 102 57 L 84 57 Z" fill="#FFFFFF" />
          {/* Warm Shop Display Window */}
          <rect x="12" y="60" width="55" height="26" rx="3" fill="#BAE6FD" stroke="#1B2A49" strokeWidth="2" />
          {/* Bread on display */}
          <ellipse cx="26" cy="73" rx="8" ry="4" fill="#D97706" />
          <ellipse cx="44" cy="73" rx="7" ry="5" fill="#B45309" />
          {/* Bakery Entrance Door */}
          <rect x="78" y="58" width="30" height="32" rx="3" fill="#1E293B" stroke="#1B2A49" strokeWidth="2" />
        </g>

        {/* 7. Town Park & Street Tree */}
        <g transform="translate(775, 60)">
          <rect x="36" y="45" width="12" height="30" fill="#78350F" stroke="#1B2A49" strokeWidth="2" />
          <circle cx="42" cy="30" r="28" fill="#22C55E" stroke="#1B2A49" strokeWidth="3" />
          <circle cx="36" cy="22" r="20" fill="#4ADE80" />
          <circle cx="50" cy="26" r="16" fill="#86EFAC" />
        </g>

        {/* 8. Town Building 3: Sky Blue Municipal Library / Hall */}
        <g transform="translate(850, 52)">
          <rect x="0" y="28" width="115" height="58" fill="#38BDF8" stroke="#1B2A49" strokeWidth="3" />
          <polygon points="-6,28 57,-4 121,28" fill="#0284C7" stroke="#1B2A49" strokeWidth="3" />
          {/* Classical Columns */}
          <rect x="18" y="38" width="24" height="24" rx="3" fill="#FFFBEB" stroke="#1B2A49" strokeWidth="2" />
          <rect x="72" y="38" width="24" height="24" rx="3" fill="#FFFBEB" stroke="#1B2A49" strokeWidth="2" />
          <line x1="30" y1="38" x2="30" y2="62" stroke="#1B2A49" strokeWidth="1.5" />
          <line x1="84" y1="38" x2="84" y2="62" stroke="#1B2A49" strokeWidth="1.5" />
          {/* Front Entrance */}
          <rect x="47" y="58" width="20" height="28" rx="2" fill="#0369A1" stroke="#1B2A49" strokeWidth="2" />
        </g>

        {/* 9. Victorian Street Lamp #2 */}
        <g transform="translate(985, 80)">
          <line x1="0" y1="0" x2="0" y2="40" stroke="#1B2A49" strokeWidth="3" />
          <path d="M -8 0 L 8 0 L 6 -12 L -6 -12 Z" fill="#1B2A49" />
          <circle cx="0" cy="-6" r="4.5" fill="#FEF08A" />
          <circle cx="0" cy="-6" r="26" fill="url(#street-lamp-glow)" />
        </g>

        {/* 10. Railroad Level Crossing with Waiting Yellow Car */}
        <g transform="translate(1015, 95)">
          {/* Zebra Pedestrian Crosswalk Stripes on Street */}
          <g fill="#FFFFFF">
            <rect x="10" y="24" width="8" height="24" />
            <rect x="26" y="24" width="8" height="24" />
            <rect x="42" y="24" width="8" height="24" />
            <rect x="58" y="24" width="8" height="24" />
          </g>

          {/* Cute Yellow Town Car Waiting Patiently at the Crossing */}
          <g transform="translate(85, 20)">
            {/* Car Body */}
            <path d="M 0 16 Q 10 0 35 0 Q 60 0 70 16 L 75 24 L -5 24 Z" fill="#FBBF24" stroke="#1B2A49" strokeWidth="2" />
            {/* Car Windows */}
            <path d="M 12 14 Q 18 4 34 4 L 34 14 Z" fill="#E0F2FE" stroke="#1B2A49" strokeWidth="1.5" />
            <path d="M 38 14 L 38 4 Q 52 4 58 14 Z" fill="#E0F2FE" stroke="#1B2A49" strokeWidth="1.5" />
            {/* Round Headlight */}
            <circle cx="73" cy="18" r="3" fill="#FEF08A" stroke="#1B2A49" strokeWidth="1" />
            {/* Wheels */}
            <circle cx="14" cy="24" r="6" fill="#1E293B" stroke="#0F172A" strokeWidth="2" />
            <circle cx="56" cy="24" r="6" fill="#1E293B" stroke="#0F172A" strokeWidth="2" />
            <circle cx="14" cy="24" r="2.5" fill="#94A3B8" />
            <circle cx="56" cy="24" r="2.5" fill="#94A3B8" />
          </g>

          {/* Level Crossing Railroad Crossbuck Signal */}
          <g transform="translate(180, 0)">
            <line x1="0" y1="0" x2="0" y2="52" stroke="#1B2A49" strokeWidth="4" />
            {/* Crossbuck X */}
            <line x1="-14" y1="4" x2="14" y2="18" stroke="#FFFFFF" strokeWidth="5.5" strokeLinecap="round" />
            <line x1="-14" y1="18" x2="14" y2="4" stroke="#FFFFFF" strokeWidth="5.5" strokeLinecap="round" />
            <line x1="-14" y1="4" x2="14" y2="18" stroke="#DC2626" strokeWidth="3" strokeLinecap="round" />
            <line x1="-14" y1="18" x2="14" y2="4" stroke="#DC2626" strokeWidth="3" strokeLinecap="round" />
            {/* Blinking Red Crossing Signal */}
            <circle cx="-6" cy="26" r="4.5" fill="#EF4444" className="animate-ping" />
            <circle cx="-6" cy="26" r="4.5" fill="#EF4444" />
            <circle cx="6" cy="26" r="4.5" fill="#DC2626" />
          </g>
        </g>

        {/* 11. Town Building 4: Orange Country Villa & Trees */}
        <g transform="translate(1235, 58)">
          <rect x="0" y="24" width="95" height="56" fill="#FB923C" stroke="#1B2A49" strokeWidth="3" />
          <polygon points="-6,24 47,-4 101,24" fill="#C2410C" stroke="#1B2A49" strokeWidth="3" />
          <rect x="14" y="34" width="22" height="20" rx="3" fill="#FFFBEB" stroke="#1B2A49" strokeWidth="2" />
          <rect x="58" y="34" width="22" height="20" rx="3" fill="#FFFBEB" stroke="#1B2A49" strokeWidth="2" />
          {/* Picket Fence */}
          <rect x="100" y="58" width="80" height="22" fill="#E2E8F0" stroke="#1B2A49" strokeWidth="2" />
          {/* Country Tree */}
          <circle cx="160" cy="42" r="24" fill="#16A34A" stroke="#1B2A49" strokeWidth="3" />
          <circle cx="155" cy="34" r="16" fill="#4ADE80" />
        </g>

        {/* 12. Victorian Street Lamp #3 */}
        <g transform="translate(1420, 80)">
          <line x1="0" y1="0" x2="0" y2="40" stroke="#1B2A49" strokeWidth="3" />
          <path d="M -8 0 L 8 0 L 6 -12 L -6 -12 Z" fill="#1B2A49" />
          <circle cx="0" cy="-6" r="4.5" fill="#FEF08A" />
          <circle cx="0" cy="-6" r="26" fill="url(#street-lamp-glow)" />
        </g>

        {/* ======================================================== */}
        {/* PLATFORM CURB & SAFETY STRIPES                           */}
        {/* ======================================================== */}
        <rect x="0" y="146" width="460" height="16" fill="#CBD5E1" stroke="#1B2A49" strokeWidth="2.5" />
        <line x1="0" y1="151" x2="460" y2="151" stroke="#F59E0B" strokeWidth="5" strokeDasharray="14 9" />

        {/* ======================================================== */}
        {/* RAILWAY TRACKBED ACROSS ENTIRE 1500PX PANORAMA           */}
        {/* ======================================================== */}
        {/* Crushed Stone Ballast */}
        <rect x="0" y="160" width="1500" height="55" fill="#334155" />

        {/* Wooden Sleepers (Ties) spaced continuously across 1500px */}
        {Array.from({ length: 56 }, (_, i) => (
          <rect
            key={i}
            x={i * 27 + 3}
            y="166"
            width="17"
            height="40"
            rx="2.5"
            fill="#78350F"
            stroke="#1B2A49"
            strokeWidth="1.8"
          />
        ))}

        {/* Continuous Double Polished Steel Rails */}
        {/* Top Rail (Wheel Contact surface at y=170) */}
        <rect x="0" y="170" width="1500" height="5" fill="#F1F5F9" stroke="#1B2A49" strokeWidth="1.5" />
        {/* Bottom Rail at y=194 */}
        <rect x="0" y="194" width="1500" height="5" fill="#F1F5F9" stroke="#1B2A49" strokeWidth="1.5" />

        {/* ======================================================== */}
        {/* STATION SIGNAL POST ON LEFT                              */}
        {/* ======================================================== */}
        <g transform="translate(24, 88)">
          <line x1="16" y1="0" x2="16" y2="76" stroke="#1B2A49" strokeWidth="5" />
          <rect x="6" y="0" width="20" height="52" rx="6" fill="#1B2A49" stroke="#94A3B8" strokeWidth="2" />
          {/* Red Signal Light */}
          <circle
            cx="16"
            cy="10"
            r="6.5"
            fill={signalState === 'red' ? '#EF4444' : '#450A0A'}
            stroke="#1B2A49"
            strokeWidth="1.5"
            filter={signalState === 'red' ? 'url(#light-bloom-fx)' : undefined}
          />
          {/* Amber Signal Light */}
          <circle
            cx="16"
            cy="26"
            r="6.5"
            fill={signalState === 'amber' ? '#F59E0B' : '#451A03'}
            stroke="#1B2A49"
            strokeWidth="1.5"
            filter={signalState === 'amber' ? 'url(#light-bloom-fx)' : undefined}
          />
          {/* Green Signal Light */}
          <circle
            cx="16"
            cy="42"
            r="6.5"
            fill={signalState === 'green' ? '#10B981' : '#064E3B'}
            stroke="#1B2A49"
            strokeWidth="1.5"
            filter={signalState === 'green' ? 'url(#light-bloom-fx)' : undefined}
          />
        </g>

        {/* ======================================================== */}
        {/* THE COMPLETE RUNNING TRAIN (Coach + Locomotive + Steam)   */}
        {/* ======================================================== */}
        <g className={trainMotionClass}>
          {/* Coupled Passenger Coach */}
          <svg x="65" y="22" width="190" height="152" viewBox="0 0 200 180" className="overflow-visible">
            <TrainCoach
              style={locomotiveStyle}
              isMoving={isMoving}
              speed={speed}
            />
          </svg>

          {/* Main Locomotive Engine */}
          <svg x="240" y="22" width="320" height="152" viewBox="0 0 350 180" className="overflow-visible">
            <TrainLocomotive
              style={locomotiveStyle}
              isMoving={isMoving}
              speed={speed}
            />
          </svg>

          {/* Billowing Steam & Whistle Plumes directly in SVG */}
          {(trainState === 'departing' || trainState === 'arriving' || trainState === 'waiting') && (
            <g transform="translate(450, 10)" className="pointer-events-none">
              <SmokePuff x={25} y={35} id={1} delayMs={0} scale={1.1} />
              <SmokePuff x={40} y={20} id={2} delayMs={250} scale={1.3} />
              <SmokePuff x={55} y={10} id={3} delayMs={500} scale={1.5} />
              {trainState === 'departing' && (
                <>
                  <SmokePuff x={75} y={5} id={4} delayMs={750} scale={1.8} />
                  <SmokePuff x={95} y={0} id={5} delayMs={1000} scale={2.1} />
                  <SmokePuff x={-20} y={30} id={6} variant="whistle" delayMs={0} />
                </>
              )}
            </g>
          )}
        </g>
      </svg>

      {/* Interactive Drop Target Badge over the Train Platform */}
      <div
        className={`absolute top-2 left-1/2 -translate-x-1/2 z-20 pointer-events-none transition-all transform duration-200 ${
          isDragActive
            ? isHoveredDropTarget
              ? 'scale-110 -translate-y-1 opacity-100'
              : 'scale-100 opacity-95'
            : 'opacity-0'
        }`}
      >
        <div
          className={`px-5 py-2 rounded-2xl border-4 font-black text-sm sm:text-base flex items-center gap-2 shadow-2xl transition-colors ${
            isHoveredDropTarget
              ? 'bg-amber-400 text-[#1B2A49] border-[#1B2A49] ring-4 ring-white animate-pulse'
              : 'bg-white/95 text-[#1B2A49] border-[#1B2A49] border-dashed'
          }`}
        >
          <span className="text-xl">📥</span>
          <span>{isHoveredDropTarget ? 'RELEASE TICKET TO BOARD! 🚂' : 'DROP TICKET ON TRAIN!'}</span>
        </div>
      </div>
    </div>
  );
};
