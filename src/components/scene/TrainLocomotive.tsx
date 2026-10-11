import React from 'react';
import type { LocomotiveStyle } from '../../types/game';

export interface TrainLocomotiveProps {
  style?: LocomotiveStyle;
  className?: string;
}

export const TrainLocomotive: React.FC<TrainLocomotiveProps> = ({
  style = 'steam_red',
  className = '',
}) => {
  switch (style) {
    case 'mountain_green':
      return (
        <svg viewBox="0 0 340 180" className={`w-full h-auto overflow-visible ${className}`}>
          {/* Green Alpine Mountain Engine */}
          <rect x="20" y="50" width="280" height="80" rx="16" fill="#3DDC84" stroke="#1B2A49" strokeWidth="6" />
          <path d="M 240 50 L 300 90 L 300 130 L 240 130 Z" fill="#22C55E" stroke="#1B2A49" strokeWidth="6" />
          {/* Panoramic Windows */}
          <rect x="40" y="65" width="45" height="35" rx="8" fill="#E0F2FE" stroke="#1B2A49" strokeWidth="4" />
          <rect x="95" y="65" width="45" height="35" rx="8" fill="#E0F2FE" stroke="#1B2A49" strokeWidth="4" />
          <rect x="150" y="65" width="45" height="35" rx="8" fill="#E0F2FE" stroke="#1B2A49" strokeWidth="4" />
          <polygon points="210,65 270,90 260,100 210,100" fill="#E0F2FE" stroke="#1B2A49" strokeWidth="4" />
          {/* Mountain Decal Stripe */}
          <path d="M 20 110 L 290 110" stroke="#FFD23F" strokeWidth="8" strokeLinecap="round" />
          {/* Wheels */}
          <circle cx="65" cy="145" r="22" fill="#1B2A49" />
          <circle cx="65" cy="145" r="14" fill="#CBD5E1" stroke="#1B2A49" strokeWidth="3" />
          <circle cx="130" cy="145" r="22" fill="#1B2A49" />
          <circle cx="130" cy="145" r="14" fill="#CBD5E1" stroke="#1B2A49" strokeWidth="3" />
          <circle cx="210" cy="145" r="22" fill="#1B2A49" />
          <circle cx="210" cy="145" r="14" fill="#CBD5E1" stroke="#1B2A49" strokeWidth="3" />
          <circle cx="270" cy="145" r="16" fill="#1B2A49" />
          {/* Headlamp */}
          <circle cx="300" cy="100" r="10" fill="#FFD23F" stroke="#1B2A49" strokeWidth="3" />
        </svg>
      );

    case 'toy_yellow':
      return (
        <svg viewBox="0 0 340 180" className={`w-full h-auto overflow-visible ${className}`}>
          {/* Cute Toy Yellow Shunter */}
          <rect x="40" y="40" width="120" height="90" rx="18" fill="#FFD23F" stroke="#1B2A49" strokeWidth="6" />
          <rect x="160" y="65" width="130" height="65" rx="14" fill="#F59E0B" stroke="#1B2A49" strokeWidth="6" />
          {/* Dome & Chimney */}
          <rect x="230" y="35" width="26" height="30" rx="6" fill="#FF5A5F" stroke="#1B2A49" strokeWidth="5" />
          <ellipse cx="243" cy="35" rx="18" ry="6" fill="#FF5A5F" stroke="#1B2A49" strokeWidth="4" />
          {/* Rounded Cab Window */}
          <circle cx="95" cy="75" r="24" fill="#BAE6FD" stroke="#1B2A49" strokeWidth="5" />
          {/* Cowcatcher */}
          <polygon points="290,120 320,140 290,140" fill="#FF5A5F" stroke="#1B2A49" strokeWidth="5" />
          {/* Wheels */}
          <circle cx="85" cy="142" r="24" fill="#FF5A5F" stroke="#1B2A49" strokeWidth="5" />
          <circle cx="85" cy="142" r="10" fill="#FFD23F" />
          <circle cx="160" cy="142" r="24" fill="#FF5A5F" stroke="#1B2A49" strokeWidth="5" />
          <circle cx="160" cy="142" r="10" fill="#FFD23F" />
          <circle cx="235" cy="142" r="24" fill="#FF5A5F" stroke="#1B2A49" strokeWidth="5" />
          <circle cx="235" cy="142" r="10" fill="#FFD23F" />
        </svg>
      );

    case 'diesel_blue':
      return (
        <svg viewBox="0 0 340 180" className={`w-full h-auto overflow-visible ${className}`}>
          {/* Streamlined Ocean Blue Diesel */}
          <rect x="30" y="45" width="240" height="85" rx="14" fill="#3A86FF" stroke="#1B2A49" strokeWidth="6" />
          <path d="M 270 55 C 310 65 320 100 310 130 L 270 130 Z" fill="#2563EB" stroke="#1B2A49" strokeWidth="6" />
          {/* Grille */}
          <rect x="250" y="90" width="35" height="25" rx="4" fill="#1B2A49" />
          <line x1="255" y1="96" x2="280" y2="96" stroke="#FFFFFF" strokeWidth="2" />
          <line x1="255" y1="102" x2="280" y2="102" stroke="#FFFFFF" strokeWidth="2" />
          {/* Cab windows */}
          <rect x="50" y="58" width="55" height="32" rx="6" fill="#E0F2FE" stroke="#1B2A49" strokeWidth="4" />
          <rect x="120" y="58" width="70" height="32" rx="6" fill="#E0F2FE" stroke="#1B2A49" strokeWidth="4" />
          <path d="M 205 58 L 260 58 L 280 85 L 205 85 Z" fill="#E0F2FE" stroke="#1B2A49" strokeWidth="4" />
          {/* Lightning Speed Stripe */}
          <polygon points="30,105 180,105 210,118 30,118" fill="#FFD23F" />
          {/* Bogie Wheels */}
          <circle cx="75" cy="146" r="20" fill="#1B2A49" />
          <circle cx="75" cy="146" r="10" fill="#94A3B8" />
          <circle cx="125" cy="146" r="20" fill="#1B2A49" />
          <circle cx="125" cy="146" r="10" fill="#94A3B8" />
          <circle cx="215" cy="146" r="20" fill="#1B2A49" />
          <circle cx="215" cy="146" r="10" fill="#94A3B8" />
          <circle cx="265" cy="146" r="20" fill="#1B2A49" />
          <circle cx="265" cy="146" r="10" fill="#94A3B8" />
        </svg>
      );

    case 'bullet_purple':
      return (
        <svg viewBox="0 0 340 180" className={`w-full h-auto overflow-visible ${className}`}>
          {/* Sleek Aerodynamic Shinkansen Bullet Train */}
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
          {/* Low profile aerodynamic skirt wheels */}
          <circle cx="80" cy="142" r="16" fill="#1B2A49" />
          <circle cx="140" cy="142" r="16" fill="#1B2A49" />
          <circle cx="240" cy="142" r="16" fill="#1B2A49" />
          {/* Headlamp */}
          <polygon points="318,122 328,126 318,130" fill="#FEF08A" />
        </svg>
      );

    case 'royal_grand':
      return (
        <svg viewBox="0 0 340 180" className={`w-full h-auto overflow-visible ${className}`}>
          {/* Royal Station Master Engine (Crimson & Gold with Crown) */}
          <rect x="40" y="30" width="105" height="100" rx="14" fill="#991B1B" stroke="#1B2A49" strokeWidth="6" />
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
          <circle cx="85" cy="142" r="26" fill="#1B2A49" />
          <circle cx="85" cy="142" r="18" fill="#F59E0B" stroke="#1B2A49" strokeWidth="4" />
          <circle cx="160" cy="142" r="26" fill="#1B2A49" />
          <circle cx="160" cy="142" r="18" fill="#F59E0B" stroke="#1B2A49" strokeWidth="4" />
          <circle cx="235" cy="142" r="26" fill="#1B2A49" />
          <circle cx="235" cy="142" r="18" fill="#F59E0B" stroke="#1B2A49" strokeWidth="4" />
          {/* Golden Lantern */}
          <circle cx="300" cy="85" r="12" fill="#FDE047" stroke="#1B2A49" strokeWidth="3" />
        </svg>
      );

    case 'steam_red':
    default:
      return (
        <svg viewBox="0 0 340 180" className={`w-full h-auto overflow-visible ${className}`}>
          {/* Classic Red Steam Locomotive */}
          {/* Cab */}
          <rect x="40" y="35" width="105" height="95" rx="14" fill="#FF5A5F" stroke="#1B2A49" strokeWidth="6" />
          <rect x="55" y="50" width="40" height="36" rx="8" fill="#E0F2FE" stroke="#1B2A49" strokeWidth="4" />
          {/* Boiler */}
          <rect x="145" y="60" width="145" height="70" rx="12" fill="#334155" stroke="#1B2A49" strokeWidth="6" />
          {/* Smokestack Funnel */}
          <polygon points="230,60 220,25 260,25 250,60" fill="#1B2A49" stroke="#1B2A49" strokeWidth="4" />
          <ellipse cx="240" cy="25" rx="20" ry="6" fill="#FFD23F" stroke="#1B2A49" strokeWidth="3" />
          {/* Steam Dome */}
          <ellipse cx="185" cy="60" rx="18" ry="12" fill="#FFD23F" stroke="#1B2A49" strokeWidth="4" />
          {/* Cowcatcher */}
          <polygon points="290,110 325,138 285,138" fill="#FF5A5F" stroke="#1B2A49" strokeWidth="5" />
          {/* Yellow Livery Stripe */}
          <line x1="145" y1="95" x2="290" y2="95" stroke="#FFD23F" strokeWidth="6" />
          {/* Driving Wheels */}
          <circle cx="85" cy="142" r="26" fill="#1B2A49" />
          <circle cx="85" cy="142" r="16" fill="#FF5A5F" stroke="#1B2A49" strokeWidth="4" />
          <circle cx="160" cy="142" r="26" fill="#1B2A49" />
          <circle cx="160" cy="142" r="16" fill="#FF5A5F" stroke="#1B2A49" strokeWidth="4" />
          <circle cx="235" cy="142" r="26" fill="#1B2A49" />
          <circle cx="235" cy="142" r="16" fill="#FF5A5F" stroke="#1B2A49" strokeWidth="4" />
          {/* Connecting Rod */}
          <line x1="85" y1="142" x2="235" y2="142" stroke="#CBD5E1" strokeWidth="6" strokeLinecap="round" />
          {/* Front Headlight */}
          <circle cx="295" cy="85" r="10" fill="#FFD23F" stroke="#1B2A49" strokeWidth="3" />
        </svg>
      );
  }
};
