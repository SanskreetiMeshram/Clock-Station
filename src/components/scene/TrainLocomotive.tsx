import React from 'react';
import type { LocomotiveStyle } from '../../types/game';

export interface TrainLocomotiveProps {
  style?: LocomotiveStyle;
  isMoving?: boolean;
  speed?: 'normal' | 'fast';
  className?: string;
}

export const TrainLocomotive: React.FC<TrainLocomotiveProps> = ({
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

  const pistonAnimClass = isMoving
    ? speed === 'fast'
      ? 'anim-piston-fast'
      : 'anim-piston-crank'
    : '';

  // Render a mechanical spoked locomotive driving wheel
  const renderDrivingWheel = (
    cx: number,
    cy: number,
    r: number,
    rimColor: string,
    spokeCount: number = 8,
    hasCrank: boolean = true
  ) => {
    return (
      <g key={`wheel-${cx}-${cy}`}>
        {/* Outer Steel Tire */}
        <circle cx={cx} cy={cy} r={r} fill="#1E293B" stroke="#0F172A" strokeWidth="3" />
        <circle cx={cx} cy={cy} r={r - 3} fill={rimColor} stroke="#0F172A" strokeWidth="2" />

        {/* Rotating Spokes & Counterweight */}
        <g
          className={wheelAnimClass}
          style={{ transformOrigin: `${cx}px ${cy}px` }}
        >
          {/* Spoke lines */}
          {Array.from({ length: spokeCount / 2 }, (_, i) => {
            const deg = (i * 360) / spokeCount;
            const rad = (deg * Math.PI) / 180;
            return (
              <line
                key={i}
                x1={cx - (r - 4) * Math.cos(rad)}
                y1={cy - (r - 4) * Math.sin(rad)}
                x2={cx + (r - 4) * Math.cos(rad)}
                y2={cy + (r - 4) * Math.sin(rad)}
                stroke="#E2E8F0"
                strokeWidth="2.5"
                strokeLinecap="round"
              />
            );
          })}

          {/* Wedge Counterweight on Wheel Rim */}
          <path
            d={`M ${cx - r * 0.75} ${cy - r * 0.4} A ${r - 4} ${r - 4} 0 0 1 ${cx + r * 0.75} ${cy - r * 0.4} L ${cx} ${cy} Z`}
            fill="#334155"
            opacity="0.85"
          />

          {/* Central Hub */}
          <circle cx={cx} cy={cy} r={r * 0.36} fill="#F8FAFC" stroke="#0F172A" strokeWidth="2.5" />

          {/* Eccentric Pin for Drive Rod */}
          {hasCrank && (
            <circle cx={cx + r * 0.45} cy={cy} r="4" fill="#E11D48" stroke="#0F172A" strokeWidth="1.5" />
          )}
        </g>
      </g>
    );
  };

  // Render Headlight Beam
  const renderHeadlightBeam = (originX: number, originY: number) => (
    <g className="pointer-events-none select-none">
      <defs>
        <linearGradient id={`beam-grad-${originX}`} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#FEF08A" stopOpacity="0.75" />
          <stop offset="60%" stopColor="#FEF08A" stopOpacity="0.25" />
          <stop offset="100%" stopColor="#FEF08A" stopOpacity="0" />
        </linearGradient>
      </defs>
      {/* Radiant Conical Light Beam */}
      <polygon
        points={`${originX},${originY - 8} ${originX + 160},${originY - 45} ${originX + 160},${originY + 65} ${originX},${originY + 8}`}
        fill={`url(#beam-grad-${originX})`}
      />
    </g>
  );

  switch (style) {
    case 'mountain_green':
      return (
        <svg viewBox="0 0 350 180" className={`w-full h-auto overflow-visible ${className}`}>
          {/* Alpine Mountain Engine */}
          {renderHeadlightBeam(310, 100)}

          {/* Chassis */}
          <rect x="20" y="50" width="280" height="80" rx="16" fill="#22C55E" stroke="#1B2A49" strokeWidth="6" />
          <path d="M 240 50 L 305 90 L 305 130 L 240 130 Z" fill="#16A34A" stroke="#1B2A49" strokeWidth="6" />

          {/* Panoramic Windows */}
          <rect x="40" y="65" width="45" height="35" rx="8" fill="#E0F2FE" stroke="#1B2A49" strokeWidth="4" />
          <rect x="95" y="65" width="45" height="35" rx="8" fill="#E0F2FE" stroke="#1B2A49" strokeWidth="4" />
          <rect x="150" y="65" width="45" height="35" rx="8" fill="#E0F2FE" stroke="#1B2A49" strokeWidth="4" />
          <polygon points="210,65 275,90 265,100 210,100" fill="#E0F2FE" stroke="#1B2A49" strokeWidth="4" />

          {/* Mountain Decal Stripe */}
          <path d="M 20 110 L 295 110" stroke="#FFD23F" strokeWidth="8" strokeLinecap="round" />

          {/* Wheels */}
          {renderDrivingWheel(65, 145, 22, '#15803D', 8, false)}
          {renderDrivingWheel(130, 145, 22, '#15803D', 8, false)}
          {renderDrivingWheel(200, 145, 22, '#15803D', 8, false)}
          {renderDrivingWheel(265, 145, 18, '#15803D', 6, false)}

          {/* Headlamp */}
          <circle cx="305" cy="100" r="11" fill="#FFD23F" stroke="#1B2A49" strokeWidth="3" />
          <circle cx="305" cy="100" r="6" fill="#FFFFFF" />
        </svg>
      );

    case 'toy_yellow':
      return (
        <svg viewBox="0 0 350 180" className={`w-full h-auto overflow-visible ${className}`}>
          {renderHeadlightBeam(295, 75)}

          {/* Cute Toy Yellow Shunter */}
          {/* Cab */}
          <rect x="35" y="40" width="125" height="90" rx="18" fill="#FFD23F" stroke="#1B2A49" strokeWidth="6" />
          {/* Boiler */}
          <rect x="160" y="65" width="130" height="65" rx="14" fill="#F59E0B" stroke="#1B2A49" strokeWidth="6" />

          {/* Dome & Chimney */}
          <rect x="230" y="32" width="28" height="33" rx="6" fill="#FF5A5F" stroke="#1B2A49" strokeWidth="5" />
          <ellipse cx="244" cy="32" rx="20" ry="7" fill="#FF5A5F" stroke="#1B2A49" strokeWidth="4" />

          {/* Cab Window & Conductor Cat */}
          <circle cx="95" cy="75" r="26" fill="#BAE6FD" stroke="#1B2A49" strokeWidth="5" />
          <circle cx="95" cy="80" r="14" fill="#1B2A49" opacity="0.75" />

          {/* Cowcatcher */}
          <polygon points="288,118 322,142 288,142" fill="#FF5A5F" stroke="#1B2A49" strokeWidth="5" />

          {/* Wheels */}
          {renderDrivingWheel(85, 142, 24, '#FF5A5F', 6, true)}
          {renderDrivingWheel(160, 142, 24, '#FF5A5F', 6, true)}
          {renderDrivingWheel(235, 142, 24, '#FF5A5F', 6, true)}

          {/* Oscillating Drive Rod */}
          <g className={pistonAnimClass}>
            <rect x="85" y="138" width="150" height="8" rx="4" fill="#CBD5E1" stroke="#1B2A49" strokeWidth="3" />
          </g>

          {/* Headlamp */}
          <circle cx="295" cy="75" r="11" fill="#FEF08A" stroke="#1B2A49" strokeWidth="3" />
        </svg>
      );

    case 'diesel_blue':
      return (
        <svg viewBox="0 0 350 180" className={`w-full h-auto overflow-visible ${className}`}>
          {renderHeadlightBeam(310, 105)}

          {/* Streamlined Ocean Blue Diesel */}
          <rect x="30" y="45" width="240" height="85" rx="14" fill="#3A86FF" stroke="#1B2A49" strokeWidth="6" />
          <path d="M 270 55 C 315 65 325 100 315 130 L 270 130 Z" fill="#2563EB" stroke="#1B2A49" strokeWidth="6" />

          {/* Front Grille */}
          <rect x="250" y="90" width="35" height="25" rx="4" fill="#1B2A49" />
          <line x1="255" y1="96" x2="280" y2="96" stroke="#FFFFFF" strokeWidth="2" />
          <line x1="255" y1="102" x2="280" y2="102" stroke="#FFFFFF" strokeWidth="2" />

          {/* Cab windows */}
          <rect x="50" y="58" width="55" height="32" rx="6" fill="#E0F2FE" stroke="#1B2A49" strokeWidth="4" />
          <rect x="120" y="58" width="70" height="32" rx="6" fill="#E0F2FE" stroke="#1B2A49" strokeWidth="4" />
          <path d="M 205 58 L 260 58 L 285 85 L 205 85 Z" fill="#E0F2FE" stroke="#1B2A49" strokeWidth="4" />

          {/* Lightning Speed Stripe */}
          <polygon points="30,105 180,105 215,118 30,118" fill="#FFD23F" />

          {/* Bogie Wheels */}
          {renderDrivingWheel(75, 146, 20, '#64748B', 6, false)}
          {renderDrivingWheel(125, 146, 20, '#64748B', 6, false)}
          {renderDrivingWheel(215, 146, 20, '#64748B', 6, false)}
          {renderDrivingWheel(265, 146, 20, '#64748B', 6, false)}

          {/* Headlight */}
          <circle cx="310" cy="105" r="11" fill="#FEF08A" stroke="#1B2A49" strokeWidth="3" />
        </svg>
      );

    case 'bullet_purple':
      return (
        <svg viewBox="0 0 350 180" className={`w-full h-auto overflow-visible ${className}`}>
          {renderHeadlightBeam(325, 126)}

          {/* Aerodynamic Bullet Train */}
          <path
            d="M 20 60 L 190 60 C 240 60 290 90 325 125 L 325 132 L 20 132 Z"
            fill="#8338EC"
            stroke="#1B2A49"
            strokeWidth="6"
          />
          {/* White & Magenta Aerodynamic Strips */}
          <path d="M 20 95 C 150 95 240 102 315 125" stroke="#FFFFFF" strokeWidth="8" fill="none" />
          <path d="M 20 108 C 150 108 240 115 310 128" stroke="#F43F5E" strokeWidth="5" fill="none" />

          {/* Cockpit Visor Glass */}
          <path d="M 220 70 C 255 70 280 90 295 105 L 235 105 Z" fill="#38BDF8" stroke="#1B2A49" strokeWidth="4" />

          {/* Passenger Windows */}
          <rect x="40" y="70" width="35" height="20" rx="4" fill="#38BDF8" stroke="#1B2A49" strokeWidth="3" />
          <rect x="90" y="70" width="35" height="20" rx="4" fill="#38BDF8" stroke="#1B2A49" strokeWidth="3" />
          <rect x="140" y="70" width="35" height="20" rx="4" fill="#38BDF8" stroke="#1B2A49" strokeWidth="3" />

          {/* Wheels */}
          {renderDrivingWheel(80, 142, 18, '#6D28D9', 6, false)}
          {renderDrivingWheel(140, 142, 18, '#6D28D9', 6, false)}
          {renderDrivingWheel(240, 142, 18, '#6D28D9', 6, false)}

          {/* Headlamp */}
          <polygon points="318,122 330,126 318,130" fill="#FEF08A" stroke="#1B2A49" strokeWidth="2" />
        </svg>
      );

    case 'royal_grand':
      return (
        <svg viewBox="0 0 350 180" className={`w-full h-auto overflow-visible ${className}`}>
          {renderHeadlightBeam(300, 85)}

          {/* Royal Station Master Engine (Crimson & Gold with Crown) */}
          <rect x="35" y="30" width="110" height="100" rx="14" fill="#991B1B" stroke="#1B2A49" strokeWidth="6" />
          <rect x="145" y="55" width="150" height="75" rx="12" fill="#B91C1C" stroke="#1B2A49" strokeWidth="6" />

          {/* Brass Smokestack & Crown */}
          <rect x="235" y="25" width="28" height="35" fill="#F59E0B" stroke="#1B2A49" strokeWidth="4" />
          <path d="M 228 25 L 270 25 L 260 15 L 238 15 Z" fill="#FBBF24" stroke="#1B2A49" strokeWidth="3" />

          {/* Royal Crown Ornament on Cab */}
          <path d="M 80 18 L 92 30 L 105 18 L 118 30 L 130 18 L 125 32 L 85 32 Z" fill="#F59E0B" stroke="#1B2A49" strokeWidth="3" />

          {/* Gold Filigree Trim */}
          <rect x="52" y="45" width="80" height="40" rx="8" fill="#FEE2E2" stroke="#1B2A49" strokeWidth="4" />
          <line x1="145" y1="92" x2="295" y2="92" stroke="#F59E0B" strokeWidth="6" />

          {/* Grand Driving Wheels */}
          {renderDrivingWheel(85, 142, 26, '#B45309', 8, true)}
          {renderDrivingWheel(160, 142, 26, '#B45309', 8, true)}
          {renderDrivingWheel(235, 142, 26, '#B45309', 8, true)}

          {/* Mechanical Drive Rod */}
          <g className={pistonAnimClass}>
            <rect x="85" y="138" width="150" height="8" rx="4" fill="#FBBF24" stroke="#1B2A49" strokeWidth="3" />
          </g>

          {/* Golden Lantern Headlight */}
          <circle cx="300" cy="85" r="13" fill="#FDE047" stroke="#1B2A49" strokeWidth="3" />
          <circle cx="300" cy="85" r="7" fill="#FFFFFF" />
        </svg>
      );

    case 'steam_red':
    default:
      return (
        <svg viewBox="0 0 350 180" className={`w-full h-auto overflow-visible ${className}`}>
          {/* Headlamp beam extending right */}
          {renderHeadlightBeam(295, 85)}

          {/* Classic Red Steam Locomotive */}
          {/* Cab */}
          <rect x="35" y="35" width="110" height="95" rx="14" fill="#FF5A5F" stroke="#1B2A49" strokeWidth="6" />
          {/* Cab Window with Conductor Silhouette */}
          <rect x="52" y="50" width="45" height="38" rx="8" fill="#E0F2FE" stroke="#1B2A49" strokeWidth="4" />
          <circle cx="74" cy="66" r="10" fill="#1B2A49" opacity="0.7" />
          <path d="M 62 86 C 62 76 86 76 86 86 Z" fill="#1B2A49" opacity="0.7" />

          {/* Cylindrical Boiler with metallic shading */}
          <rect x="145" y="60" width="145" height="70" rx="12" fill="#334155" stroke="#1B2A49" strokeWidth="6" />
          {/* Brass Boiler Bands */}
          <line x1="185" y1="60" x2="185" y2="130" stroke="#FFD23F" strokeWidth="5" />
          <line x1="225" y1="60" x2="225" y2="130" stroke="#FFD23F" strokeWidth="5" />
          <line x1="265" y1="60" x2="265" y2="130" stroke="#FFD23F" strokeWidth="5" />

          {/* Smokestack Funnel */}
          <polygon points="230,60 220,25 260,25 250,60" fill="#1B2A49" stroke="#1B2A49" strokeWidth="4" />
          <ellipse cx="240" cy="25" rx="20" ry="6" fill="#FFD23F" stroke="#1B2A49" strokeWidth="3" />

          {/* Polished Steam Dome */}
          <ellipse cx="185" cy="58" rx="18" ry="14" fill="#FFD23F" stroke="#1B2A49" strokeWidth="4" />

          {/* Cowcatcher / Front Pilot */}
          <polygon points="290,110 328,138 285,138" fill="#FF5A5F" stroke="#1B2A49" strokeWidth="5" />
          <line x1="298" y1="120" x2="295" y2="138" stroke="#1B2A49" strokeWidth="3" />
          <line x1="312" y1="128" x2="310" y2="138" stroke="#1B2A49" strokeWidth="3" />

          {/* Yellow Livery Stripe */}
          <line x1="145" y1="95" x2="290" y2="95" stroke="#FFD23F" strokeWidth="6" />

          {/* 3 Large Spoked Driving Wheels with rotating animation */}
          {renderDrivingWheel(85, 142, 26, '#DC2626', 8, true)}
          {renderDrivingWheel(160, 142, 26, '#DC2626', 8, true)}
          {renderDrivingWheel(235, 142, 26, '#DC2626', 8, true)}

          {/* Oscillating Steel Piston Drive Rod */}
          <g className={pistonAnimClass}>
            <rect
              x="85"
              y="138"
              width="150"
              height="8"
              rx="4"
              fill="#E2E8F0"
              stroke="#1B2A49"
              strokeWidth="3.5"
            />
            {/* Piston Crosshead Cylinder */}
            <circle cx="85" cy="142" r="6" fill="#64748B" stroke="#1B2A49" strokeWidth="2" />
            <circle cx="160" cy="142" r="6" fill="#64748B" stroke="#1B2A49" strokeWidth="2" />
            <circle cx="235" cy="142" r="6" fill="#64748B" stroke="#1B2A49" strokeWidth="2" />
          </g>

          {/* Front Headlight */}
          <circle cx="295" cy="85" r="12" fill="#FFD23F" stroke="#1B2A49" strokeWidth="3" />
          <circle cx="295" cy="85" r="7" fill="#FFFFFF" />
        </svg>
      );
  }
};
