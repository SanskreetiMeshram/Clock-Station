import React from 'react';
import { RotateCcw, ArrowRight, Star } from 'lucide-react';
import { Confetti } from '../game/Confetti';
import { TrainLocomotive } from '../scene/TrainLocomotive';
import type { LocomotiveStyle } from '../../types/game';

export interface LevelCompleteScreenProps {
  levelId: number;
  levelName: string;
  starsEarned: number;
  locomotiveStyle: LocomotiveStyle;
  onNextLevel: () => void;
  onReplay: () => void;
  onBackToMap: () => void;
}

export const LevelCompleteScreen: React.FC<LevelCompleteScreenProps> = ({
  levelId,
  levelName,
  starsEarned,
  locomotiveStyle,
  onNextLevel,
  onReplay,
  onBackToMap,
}) => {
  return (
    <div className="min-h-screen flex flex-col justify-center items-center p-4 sm:p-6 bg-gradient-to-b from-[#8EDBFF] via-[#BAE6FD] to-[#E6F7FF] select-none text-center relative overflow-hidden">
      {/* Celebration Confetti */}
      <Confetti count={50} />

      <div className="w-full max-w-lg bg-white rounded-3xl border-4 border-[#1B2A49] shadow-2xl p-6 sm:p-8 flex flex-col items-center animate-bounceSubtle relative z-10">
        {/* Celebration Title */}
        <div className="bg-[#FFD23F] text-[#1B2A49] px-6 py-2 rounded-2xl border-3 border-[#1B2A49] shadow-chunky-sm font-black text-xl sm:text-2xl uppercase tracking-wider mb-2">
          Station {levelId} Cleared! 🎉
        </div>

        <h2 className="text-3xl sm:text-4xl font-black text-[#1B2A49] mb-4 font-display">
          {levelName}
        </h2>

        {/* Celebrating Locomotive */}
        <div className="w-48 sm:w-56 my-2">
          <TrainLocomotive style={locomotiveStyle} />
        </div>

        {/* Big 3-Star Display */}
        <div className="flex items-center justify-center gap-3 my-4">
          {[1, 2, 3].map((starIdx) => {
            const hasStar = starIdx <= starsEarned;
            return (
              <div
                key={starIdx}
                className={`p-2 rounded-2xl transition-all transform ${
                  hasStar
                    ? 'scale-110 animate-bounce text-amber-500'
                    : 'scale-90 opacity-40 text-slate-300'
                }`}
              >
                <Star
                  className={`w-14 h-14 ${
                    hasStar ? 'fill-[#F59E0B] text-[#B45309]' : 'fill-slate-200'
                  }`}
                />
              </div>
            );
          })}
        </div>

        <p className="text-lg sm:text-xl font-bold text-slate-700 mb-6">
          {starsEarned === 3
            ? 'Incredible timing! You are a Master Conductor! ⭐⭐⭐'
            : starsEarned === 2
            ? 'Great job keeping the trains on track! ⭐⭐'
            : 'Well done! Practice makes perfect! ⭐'}
        </p>

        {/* Navigation Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center gap-3 w-full">
          {levelId < 10 ? (
            <button
              type="button"
              onClick={onNextLevel}
              className="w-full sm:flex-1 min-h-[60px] px-6 py-3 rounded-2xl bg-[#3DDC84] hover:bg-[#34c776] text-[#1B2A49] text-2xl font-black border-3 border-[#1B2A49] shadow-chunky active:translate-y-1 active:shadow-chunky-active flex items-center justify-center gap-2 focus-ring"
            >
              <span>Next Station</span>
              <ArrowRight className="w-6 h-6" />
            </button>
          ) : (
            <button
              type="button"
              onClick={onBackToMap}
              className="w-full sm:flex-1 min-h-[60px] px-6 py-3 rounded-2xl bg-[#FFD23F] hover:bg-[#f5c82e] text-[#1B2A49] text-2xl font-black border-3 border-[#1B2A49] shadow-chunky active:translate-y-1 active:shadow-chunky-active flex items-center justify-center gap-2 focus-ring"
            >
              <span>Map Master</span>
            </button>
          )}

          <button
            type="button"
            onClick={onReplay}
            className="w-full sm:w-auto min-h-[60px] px-6 py-3 rounded-2xl bg-white hover:bg-slate-100 text-[#1B2A49] text-xl font-black border-3 border-[#1B2A49] shadow-chunky active:translate-y-1 active:shadow-chunky-active flex items-center justify-center gap-2 focus-ring"
          >
            <RotateCcw className="w-5 h-5" />
            <span>Replay</span>
          </button>
        </div>
      </div>
    </div>
  );
};
