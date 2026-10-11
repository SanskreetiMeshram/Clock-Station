import React, { useRef, useId } from 'react';
import type { ClockTime, ClockMode } from '../../types/game';
import { hourAngle, minuteAngle, formatDigital } from '../../logic/clockMath';
import { useDraggableHand } from '../../hooks/useDraggableHand';

export interface AnalogClockProps {
  time: ClockTime;
  interactive?: boolean;
  mode?: ClockMode;
  snapStep?: 1 | 5 | 15;
  showDigitalBubble?: boolean;
  highlight?: 'hour' | 'minute' | 'both';
  showMultiplierHint?: boolean;
  showQuarterSlice?: boolean;
  showHalfSlice?: boolean;
  accentColor?: string;
  size?: number;
  isDropTargetHovered?: boolean;
  onChange?: (newTime: ClockTime) => void;
  onSnap?: () => void;
  className?: string;
}

const RAINBOW_COLORS = [
  '#E11D48', // 12 (Rose)
  '#FF5A5F', // 1 (Red)
  '#FF7A00', // 2 (Orange-Red)
  '#FF9F1C', // 3 (Orange)
  '#F59E0B', // 4 (Amber)
  '#84DCC6', // 5 (Mint)
  '#3DDC84', // 6 (Green)
  '#06B6D4', // 7 (Cyan)
  '#3A86FF', // 8 (Blue)
  '#6366F1', // 9 (Indigo)
  '#8338EC', // 10 (Purple)
  '#C026D3', // 11 (Fuchsia)
];

export const AnalogClock: React.FC<AnalogClockProps> = ({
  time,
  interactive = true,
  mode = 'full',
  snapStep = 1,
  showDigitalBubble = false,
  highlight,
  showMultiplierHint = false,
  showQuarterSlice = false,
  showHalfSlice = false,
  accentColor = '#FF9F1C',
  size,
  isDropTargetHovered = false,
  onChange,
  onSnap,
  className = '',
}) => {
  const svgRef = useRef<SVGSVGElement | null>(null);
  const filterId = useId();

  const getSvgCenter = () => {
    if (!svgRef.current) return { cx: 200, cy: 200 };
    const rect = svgRef.current.getBoundingClientRect();
    if (rect.width === 0 || rect.height === 0) {
      return { cx: 200, cy: 200 };
    }
    return {
      cx: rect.left + rect.width / 2,
      cy: rect.top + rect.height / 2,
    };
  };

  const hourDrag = useDraggableHand({
    handType: 'hour',
    time,
    mode,
    snapStep,
    getCenter: getSvgCenter,
    onChange,
    onSnap,
    disabled: !interactive,
  });

  const minuteDrag = useDraggableHand({
    handType: 'minute',
    time,
    mode,
    snapStep,
    getCenter: getSvgCenter,
    onChange,
    onSnap,
    disabled: !interactive,
  });

  const hDeg = hourAngle(time.h, time.m);
  const mDeg = minuteAngle(time.m);

  // Generate 60 minute ticks
  const ticks = Array.from({ length: 60 }, (_, i) => {
    const isFiveMin = i % 5 === 0;
    const angle = i * 6;
    const rad = (angle * Math.PI) / 180;
    const innerR = isFiveMin ? 152 : 160;
    const outerR = 172;
    const x1 = 200 + innerR * Math.sin(rad);
    const y1 = 200 - innerR * Math.cos(rad);
    const x2 = 200 + outerR * Math.sin(rad);
    const y2 = 200 - outerR * Math.cos(rad);
    const colorIndex = Math.floor(i / 5) % 12;
    const color = isFiveMin ? RAINBOW_COLORS[colorIndex] : '#CBD5E1';
    const strokeWidth = isFiveMin ? 4 : 2;

    return { i, x1, y1, x2, y2, color, strokeWidth, isFiveMin };
  });

  // Numerals 1..12
  const numerals = Array.from({ length: 12 }, (_, i) => {
    const num = i + 1;
    const angle = num * 30;
    const rad = (angle * Math.PI) / 180;
    const r = 132;
    const x = 200 + r * Math.sin(rad);
    const y = 200 - r * Math.cos(rad);
    const color = RAINBOW_COLORS[num % 12];
    return { num, x, y, color, angle };
  });

  return (
    <div
      data-droptarget="analog-clock-face"
      className={`relative inline-flex flex-col items-center select-none transition-transform duration-200 ${
        isDropTargetHovered ? 'scale-105' : ''
      } ${className}`}
    >
      {/* Floating digital readout bubble */}
      {showDigitalBubble && (
        <div
          className="mb-2 px-4 py-1.5 rounded-full bg-white/95 border-2 border-[#1B2A49] shadow-chunky-sm text-lg font-bold flex items-center gap-1 animate-bounceSubtle"
          aria-live="polite"
        >
          <span className="text-[#3A86FF]">{time.h}</span>
          <span className="text-[#1B2A49]">:</span>
          <span className="text-[#FF5A5F]">{time.m.toString().padStart(2, '0')}</span>
        </div>
      )}

      <svg
        ref={svgRef}
        viewBox="0 0 400 400"
        width={size || '100%'}
        height={size || '100%'}
        className="w-full max-w-[420px] aspect-square overflow-visible touch-none"
        role="region"
        aria-label={`Analogue clock showing ${formatDigital(time)}`}
      >
        <defs>
          {/* Bevel gradient for clock rim */}
          <radialGradient id={`rim-grad-${filterId}`} cx="50%" cy="50%" r="50%">
            <stop offset="78%" stopColor={accentColor} />
            <stop offset="90%" stopColor="#F59E0B" />
            <stop offset="96%" stopColor="#1B2A49" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#0B132B" />
          </radialGradient>

          {/* Clock face inner shadow gradient */}
          <radialGradient id={`face-grad-${filterId}`} cx="50%" cy="40%" r="55%">
            <stop offset="0%" stopColor="#FFFFFF" />
            <stop offset="85%" stopColor="#FFF8E7" />
            <stop offset="100%" stopColor="#FDE68A" stopOpacity="0.8" />
          </radialGradient>

          {/* Glow filter for active hand highlight */}
          <filter id={`glow-${filterId}`} x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="5" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>

          {/* Soft drop shadow */}
          <filter id={`shadow-${filterId}`} x="-10%" y="-10%" width="120%" height="120%">
            <feDropShadow dx="0" dy="8" stdDeviation="6" floodColor="#1B2A49" floodOpacity="0.25" />
          </filter>
        </defs>

        {/* Outer Shadow & Rim */}
        <circle
          cx="200"
          cy="200"
          r="194"
          fill={`url(#rim-grad-${filterId})`}
          stroke="#1B2A49"
          strokeWidth="8"
          filter={`url(#shadow-${filterId})`}
        />

        {/* Shiny Rim Highlight */}
        <circle
          cx="200"
          cy="200"
          r="184"
          fill="none"
          stroke="#FFFFFF"
          strokeWidth="3"
          strokeOpacity="0.45"
        />

        {/* Inner Clock Face */}
        <circle
          cx="200"
          cy="200"
          r="174"
          fill={`url(#face-grad-${filterId})`}
          stroke="#E2E8F0"
          strokeWidth="2"
        />

        {/* Drop Target Hover Pulse Ring */}
        {isDropTargetHovered && (
          <circle
            cx="200"
            cy="200"
            r="174"
            fill="none"
            stroke="#F59E0B"
            strokeWidth="8"
            strokeDasharray="14 10"
            className="animate-spin pointer-events-none"
          />
        )}

        {/* Curved Glass Dome Reflection Arc */}
        <path
          d="M 65 140 C 95 65 210 42 320 75 C 338 82 342 90 342 90 C 310 65 205 52 110 90 C 80 102 65 140 65 140 Z"
          fill="#FFFFFF"
          fillOpacity="0.35"
          className="pointer-events-none select-none"
        />

        {/* Slices for Half-Past & Quarter Hints */}
        {showHalfSlice && (
          <path
            d="M 200 200 L 200 26 A 174 174 0 0 1 200 374 Z"
            fill="#FFD23F"
            fillOpacity="0.35"
            stroke="#F59E0B"
            strokeWidth="2"
            strokeDasharray="6 4"
          />
        )}
        {showQuarterSlice && (
          <path
            d="M 200 200 L 200 26 A 174 174 0 0 1 374 200 Z"
            fill="#3DDC84"
            fillOpacity="0.35"
            stroke="#10B981"
            strokeWidth="2"
            strokeDasharray="6 4"
          />
        )}

        {/* Minute and 5-Minute Ticks */}
        {ticks.map((t) => (
          <line
            key={t.i}
            x1={t.x1}
            y1={t.y1}
            x2={t.x2}
            y2={t.y2}
            stroke={t.color}
            strokeWidth={t.strokeWidth}
            strokeLinecap="round"
          />
        ))}

        {/* Clock Numerals (1 to 12) */}
        {numerals.map((num) => (
          <g key={num.num}>
            <text
              x={num.x}
              y={num.y + 11}
              textAnchor="middle"
              fill="#1B2A49"
              fontSize="34"
              fontWeight="800"
              fontFamily="Fredoka, Baloo 2, sans-serif"
              className="select-none pointer-events-none"
            >
              {num.num}
            </text>

            {/* ×5 Minute Multiplier Hint Label for Learning */}
            {showMultiplierHint && (
              <text
                x={num.x}
                y={num.y + 26}
                textAnchor="middle"
                fill="#FF5A5F"
                fontSize="12"
                fontWeight="700"
                fontFamily="Fredoka, sans-serif"
                className="select-none pointer-events-none"
              >
                {num.num * 5}m
              </text>
            )}
          </g>
        ))}

        {/* ======================================================== */}
        {/* HOUR HAND (Short, Thick, Ocean Blue #3A86FF)             */}
        {/* ======================================================== */}
        <g transform={`rotate(${hDeg} 200 200)`}>
          {/* Highlight Glow if Hour hand is hinted or dragging */}
          {(highlight === 'hour' || highlight === 'both' || hourDrag.isDragging) && (
            <line
              x1="200"
              y1="220"
              x2="200"
              y2="95"
              stroke="#FDE047"
              strokeWidth="28"
              strokeLinecap="round"
              strokeOpacity="0.8"
              filter={`url(#glow-${filterId})`}
            />
          )}

          {/* Visible Hour Hand with Dark Contrast Outline */}
          <line
            x1="200"
            y1="220"
            x2="200"
            y2="105"
            stroke="#1B2A49"
            strokeWidth={hourDrag.isDragging ? 18 : 16}
            strokeLinecap="round"
          />
          <line
            x1="200"
            y1="218"
            x2="200"
            y2="106"
            stroke="#3A86FF"
            strokeWidth={hourDrag.isDragging ? 14 : 12}
            strokeLinecap="round"
          />
          {/* Inner Highlight on Hand */}
          <line
            x1="200"
            y1="210"
            x2="200"
            y2="114"
            stroke="#93C5FD"
            strokeWidth="4"
            strokeLinecap="round"
          />
          {/* Hour Hand Arrow Tip */}
          <polygon
            points="200,92 192,106 208,106"
            fill="#3A86FF"
            stroke="#1B2A49"
            strokeWidth="2"
          />

          {/* Wider Invisible Hit Target (at least 44px touch area) */}
          {interactive && (
            <line
              x1="200"
              y1="230"
              x2="200"
              y2="90"
              stroke="transparent"
              strokeWidth="48"
              strokeLinecap="round"
              className="cursor-grab active:cursor-grabbing focus-ring outline-none"
              role="slider"
              aria-label="Hour hand"
              aria-valuemin={1}
              aria-valuemax={12}
              aria-valuenow={time.h}
              aria-valuetext={`${time.h} o'clock`}
              tabIndex={0}
              {...hourDrag.listeners}
            />
          )}
        </g>

        {/* ======================================================== */}
        {/* MINUTE HAND (Long, Slimmer, Train Red #FF5A5F)           */}
        {/* ======================================================== */}
        <g transform={`rotate(${mDeg} 200 200)`}>
          {/* Highlight Glow if Minute hand is hinted or dragging */}
          {(highlight === 'minute' || highlight === 'both' || minuteDrag.isDragging) && (
            <line
              x1="200"
              y1="230"
              x2="200"
              y2="50"
              stroke="#FDE047"
              strokeWidth="22"
              strokeLinecap="round"
              strokeOpacity="0.8"
              filter={`url(#glow-${filterId})`}
            />
          )}

          {/* Visible Minute Hand with Dark Contrast Outline */}
          <line
            x1="200"
            y1="225"
            x2="200"
            y2="60"
            stroke="#1B2A49"
            strokeWidth={minuteDrag.isDragging ? 12 : 10}
            strokeLinecap="round"
          />
          <line
            x1="200"
            y1="223"
            x2="200"
            y2="62"
            stroke="#FF5A5F"
            strokeWidth={minuteDrag.isDragging ? 8 : 7}
            strokeLinecap="round"
          />
          {/* Inner Highlight on Hand */}
          <line
            x1="200"
            y1="215"
            x2="200"
            y2="70"
            stroke="#FECDD3"
            strokeWidth="2.5"
            strokeLinecap="round"
          />
          {/* Minute Hand Arrow Tip */}
          <polygon
            points="200,48 194,62 206,62"
            fill="#FF5A5F"
            stroke="#1B2A49"
            strokeWidth="2"
          />

          {/* Wider Invisible Hit Target (at least 44px touch area) */}
          {interactive && (
            <line
              x1="200"
              y1="235"
              x2="200"
              y2="46"
              stroke="transparent"
              strokeWidth="48"
              strokeLinecap="round"
              className="cursor-grab active:cursor-grabbing focus-ring outline-none"
              role="slider"
              aria-label="Minute hand"
              aria-valuemin={0}
              aria-valuemax={59}
              aria-valuenow={time.m}
              aria-valuetext={`${time.m} minutes`}
              tabIndex={0}
              {...minuteDrag.listeners}
            />
          )}
        </g>

        {/* Centre Brass / Metallic Cap */}
        <circle cx="200" cy="200" r="18" fill="#1B2A49" />
        <circle cx="200" cy="200" r="15" fill="#FFD23F" stroke="#B45309" strokeWidth="2" />
        <circle cx="196" cy="196" r="5" fill="#FFFFFF" fillOpacity="0.6" />
      </svg>
    </div>
  );
};
