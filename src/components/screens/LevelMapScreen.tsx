import React from 'react';
import { ArrowLeft, Lock, Star } from 'lucide-react';
import { LEVEL_CONFIGS } from '../../logic/levels';
import type { LevelProgress } from '../../types/game';

export interface LevelMapScreenProps {
  levelsProgress: Record<number, LevelProgress>;
  onSelectLevel: (levelId: number) => void;
  onBackToHome: () => void;
}

export const LevelMapScreen: React.FC<LevelMapScreenProps> = ({
  levelsProgress,
  onSelectLevel,
  onBackToHome,
}) => {
  return (
    <div className="min-h-screen p-4 sm:p-6 bg-gradient-to-b from-[#8EDBFF] via-[#BAE6FD] to-[#E6F7FF] flex flex-col select-none">
      {/* Header with Back Button */}
      <header className="w-full max-w-4xl mx-auto flex items-center justify-between mb-6">
        <button
          type="button"
          onClick={onBackToHome}
          className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-white hover:bg-amber-100 border-3 border-[#1B2A49] shadow-chunky-sm font-black text-[#1B2A49] active:translate-y-0.5 focus-ring"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Station Home</span>
        </button>

        <div className="bg-[#1B2A49] text-[#FFD23F] px-6 py-2 rounded-2xl border-3 border-[#FF9F1C] shadow-board">
          <h1 className="text-xl sm:text-2xl font-black uppercase tracking-wider font-display">
            Railway Map
          </h1>
        </div>
      </header>

      {/* Main Track & 10 Station Stops */}
      <main className="w-full max-w-4xl mx-auto my-auto py-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
          {Object.values(LEVEL_CONFIGS).map((config) => {
            const progress = levelsProgress[config.id] || {
              levelId: config.id,
              unlocked: config.id === 1,
              completed: false,
              stars: 0,
            };
            const isUnlocked = progress.unlocked;
            const stars = progress.stars || 0;

            return (
              <button
                key={config.id}
                type="button"
                disabled={!isUnlocked}
                onClick={() => onSelectLevel(config.id)}
                className={`relative flex flex-col justify-between p-5 rounded-3xl border-4 transition-all text-left shadow-chunky focus-ring ${
                  isUnlocked
                    ? 'bg-white hover:bg-amber-50 border-[#1B2A49] cursor-pointer active:translate-y-1 active:shadow-chunky-active'
                    : 'bg-slate-200/80 border-slate-400 opacity-60 cursor-not-allowed'
                }`}
                style={{
                  borderTopColor: isUnlocked ? config.accentColor : undefined,
                  borderTopWidth: isUnlocked ? '8px' : undefined,
                }}
              >
                {/* Station Stop Number & Lock Status */}
                <div className="flex items-center justify-between mb-3">
                  <div
                    className="w-10 h-10 rounded-2xl border-2 border-[#1B2A49] flex items-center justify-center font-black text-lg text-white shadow-sm"
                    style={{ backgroundColor: isUnlocked ? config.accentColor : '#64748B' }}
                  >
                    {config.id}
                  </div>

                  {/* Lock or Stars */}
                  {!isUnlocked ? (
                    <div className="flex items-center gap-1 text-slate-500 font-bold text-xs bg-slate-300 px-2.5 py-1 rounded-full">
                      <Lock className="w-4 h-4" />
                      <span>Locked</span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-1">
                      {[1, 2, 3].map((starIdx) => (
                        <Star
                          key={starIdx}
                          className={`w-5 h-5 ${
                            starIdx <= stars
                              ? 'fill-[#F59E0B] text-[#B45309]'
                              : 'text-slate-300'
                          }`}
                        />
                      ))}
                    </div>
                  )}
                </div>

                {/* Station Name & Subtitle */}
                <div>
                  <h2 className="text-xl font-black text-[#1B2A49] mb-1 font-display">
                    {config.name}
                  </h2>
                  <p className="text-xs sm:text-sm font-bold text-slate-600">
                    {config.subtitle}
                  </p>
                </div>

                {/* Skill Badge */}
                <div className="mt-4 pt-3 border-t-2 border-slate-100 flex items-center justify-between text-xs font-bold text-slate-500">
                  <span>{config.questionCount} Trains</span>
                  <span className="capitalize">{config.mode} mode</span>
                </div>
              </button>
            );
          })}
        </div>
      </main>
    </div>
  );
};
