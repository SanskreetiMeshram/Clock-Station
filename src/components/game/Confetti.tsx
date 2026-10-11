import React, { useMemo } from 'react';

const COLORS = ['#FF5A5F', '#FFD23F', '#3DDC84', '#3A86FF', '#8338EC', '#FF9F1C'];

export interface ConfettiProps {
  count?: number;
  className?: string;
}

export const Confetti: React.FC<ConfettiProps> = ({ count = 35, className = '' }) => {
  const pieces = useMemo(() => {
    return Array.from({ length: count }, (_, i) => ({
      id: i,
      x: ((i * 19 + 7) % 94) + 3, // percentage
      y: -((i * 11 + 5) % 25) - 5, // start above
      color: COLORS[i % COLORS.length],
      size: (i % 6) + 10,
      rotation: (i * 47) % 360,
      delay: (i % 8) * 0.05,
      duration: 1.2 + (i % 5) * 0.25,
      shape: i % 3 === 0 ? 'circle' : 'rect',
    }));
  }, [count]);

  return (
    <div
      className={`fixed inset-0 pointer-events-none z-50 overflow-hidden ${className}`}
      aria-hidden="true"
    >
      <svg className="w-full h-full">
        {pieces.map((p) => {
          return (
            <g
              key={p.id}
              style={{
                transform: `translate(${p.x}vw, ${p.y}vh)`,
                animation: `confetti-fall ${p.duration}s ease-out ${p.delay}s forwards`,
              }}
            >
              {p.shape === 'circle' ? (
                <circle cx="0" cy="0" r={p.size / 2} fill={p.color} />
              ) : (
                <rect
                  x={-p.size / 2}
                  y={-p.size / 2}
                  width={p.size}
                  height={p.size * 0.7}
                  rx="2"
                  fill={p.color}
                  transform={`rotate(${p.rotation})`}
                />
              )}
            </g>
          );
        })}
      </svg>
      <style>{`
        @keyframes confetti-fall {
          0% {
            transform: translateY(0) rotate(0deg);
            opacity: 1;
          }
          100% {
            transform: translateY(110vh) rotate(720deg);
            opacity: 0;
          }
        }
      `}</style>
    </div>
  );
};
