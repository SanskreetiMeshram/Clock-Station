import React from 'react';

export interface MascotProps {
  message?: string;
  showGhostHand?: boolean;
  className?: string;
}

export const Mascot: React.FC<MascotProps> = ({
  message,
  showGhostHand = false,
  className = '',
}) => {
  return (
    <div className={`relative flex items-end gap-3 select-none ${className}`}>
      {/* Friendly Conductor Character SVG */}
      <div className="relative w-20 sm:w-24 shrink-0 animate-bounceSubtle">
        <svg viewBox="0 0 100 120" className="w-full h-auto overflow-visible">
          {/* Uniform Body */}
          <rect x="25" y="65" width="50" height="50" rx="14" fill="#1B2A49" stroke="#0F172A" strokeWidth="3" />
          {/* Gold Buttons */}
          <circle cx="50" cy="78" r="3" fill="#FFD23F" />
          <circle cx="50" cy="90" r="3" fill="#FFD23F" />
          <circle cx="50" cy="102" r="3" fill="#FFD23F" />

          {/* Yellow Tie / Scarf */}
          <polygon points="46,65 54,65 52,78 48,78" fill="#FF9F1C" />

          {/* Head */}
          <circle cx="50" cy="42" r="24" fill="#FED7AA" stroke="#1B2A49" strokeWidth="3" />
          {/* Rosy Cheeks */}
          <circle cx="36" cy="48" r="4" fill="#FDA4AF" fillOpacity="0.6" />
          <circle cx="64" cy="48" r="4" fill="#FDA4AF" fillOpacity="0.6" />

          {/* Cheerful Eyes */}
          <circle cx="41" cy="40" r="3.5" fill="#1B2A49" />
          <circle cx="59" cy="40" r="3.5" fill="#1B2A49" />
          <circle cx="42" cy="38" r="1" fill="#FFFFFF" />
          <circle cx="60" cy="38" r="1" fill="#FFFFFF" />

          {/* Big Warm Smile */}
          <path d="M 42 49 Q 50 58 58 49" fill="none" stroke="#1B2A49" strokeWidth="3" strokeLinecap="round" />

          {/* Conductor Cap */}
          <path d="M 24 34 Q 50 22 76 34 L 76 26 Q 50 16 24 26 Z" fill="#1B2A49" stroke="#0F172A" strokeWidth="3" />
          {/* Cap Visor */}
          <path d="M 22 34 Q 50 40 78 34" stroke="#0F172A" strokeWidth="4" strokeLinecap="round" />
          {/* Gold Badge on Cap */}
          <circle cx="50" cy="24" r="5" fill="#FFD23F" stroke="#B45309" strokeWidth="1.5" />

          {/* Waving Hand */}
          <g transform="translate(75, 70)">
            <line x1="0" y1="10" x2="16" y2="-4" stroke="#1B2A49" strokeWidth="6" strokeLinecap="round" />
            <circle cx="18" cy="-6" r="6" fill="#FED7AA" stroke="#1B2A49" strokeWidth="2" />
          </g>
        </svg>
      </div>

      {/* Speech Bubble */}
      {message && (
        <div className="relative mb-4 bg-white text-[#1B2A49] font-bold text-sm sm:text-base px-4 py-2.5 rounded-2xl rounded-bl-none border-2 border-[#1B2A49] shadow-chunky-sm max-w-[280px] sm:max-w-[340px]">
          {message}
          {/* Bubble Tail */}
          <div className="absolute -bottom-2 left-2 w-0 h-0 border-t-8 border-t-white border-r-8 border-r-transparent border-l-8 border-l-transparent" />
        </div>
      )}

      {/* Ghost Finger Guide Animation for Level 1 */}
      {showGhostHand && (
        <div className="absolute -top-16 left-32 pointer-events-none animate-bounce z-20 flex items-center gap-2 bg-amber-300 text-slate-900 font-bold px-3 py-1 rounded-full text-xs shadow-md border border-amber-500">
          <span className="text-xl">👆</span>
          <span>Drag the hand round the clock!</span>
        </div>
      )}
    </div>
  );
};
