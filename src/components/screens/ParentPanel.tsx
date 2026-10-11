import React, { useState } from 'react';
import { X, RotateCcw, AlertTriangle, CheckCircle, BarChart3 } from 'lucide-react';
import { LEVEL_CONFIGS } from '../../logic/levels';
import type { LevelProgress, MistakeRecord } from '../../types/game';
import { strings } from '../../strings/strings.en';

export interface ParentPanelProps {
  levelsProgress: Record<number, LevelProgress>;
  mistakeHistory: MistakeRecord[];
  onResetProgress: () => void;
  onClose: () => void;
}

export const ParentPanel: React.FC<ParentPanelProps> = ({
  levelsProgress,
  mistakeHistory,
  onResetProgress,
  onClose,
}) => {
  const [confirmReset, setConfirmReset] = useState(false);

  // Group mistakes by category
  const mistakeCounts: Record<string, number> = {};
  mistakeHistory.forEach((m) => {
    mistakeCounts[m.category] = (mistakeCounts[m.category] || 0) + 1;
  });

  const categoryLabels: Record<string, string> = {
    hands_swapped: 'Hands Swapped (Hour vs Minute confusion)',
    off_by_five: 'Off by 5 Minutes',
    mirror: 'Mirror Direction (Counter-clockwise reading)',
    hour_off: 'Wrong Hour Hand Position',
    minute_off: 'Wrong Minute Hand Position',
    elapsed_calculation_error: 'Elapsed Time Calculation Error',
    unknown: 'Other Mistakes',
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm select-none"
      role="dialog"
      aria-modal="true"
      aria-label="Parent and Teacher dashboard"
    >
      <div className="w-full max-w-2xl bg-white rounded-3xl border-4 border-[#1B2A49] shadow-2xl p-6 max-h-[90vh] flex flex-col justify-between overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between border-b-2 border-slate-200 pb-4 mb-4">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-amber-100 rounded-xl border-2 border-[#1B2A49] text-[#1B2A49]">
              <BarChart3 className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-2xl font-black text-[#1B2A49] font-display">
                {strings.parentPanel.title}
              </h2>
              <p className="text-xs text-slate-500 font-bold">
                Student Learning Diagnostics & Accuracy
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-2xl bg-slate-100 hover:bg-slate-200 border-2 border-[#1B2A49] text-slate-700"
            aria-label="Close parent dashboard"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Level Accuracy Table */}
        <div className="mb-6">
          <h3 className="text-lg font-black text-[#1B2A49] mb-2">
            Station Level Progress
          </h3>
          <div className="border-2 border-slate-200 rounded-2xl overflow-hidden text-sm">
            <div className="grid grid-cols-4 bg-slate-100 p-2.5 font-black text-slate-700 border-b border-slate-200">
              <span>Station</span>
              <span>Skill</span>
              <span>Status</span>
              <span className="text-right">Stars</span>
            </div>
            <div className="divide-y divide-slate-100 max-h-48 overflow-y-auto">
              {Object.values(LEVEL_CONFIGS).map((lvl) => {
                const prog = levelsProgress[lvl.id];
                const isCompleted = prog?.completed;
                const stars = prog?.stars || 0;

                return (
                  <div key={lvl.id} className="grid grid-cols-4 p-2.5 items-center font-bold">
                    <span className="text-[#1B2A49]">
                      {lvl.id}. {lvl.name}
                    </span>
                    <span className="text-slate-500 text-xs">{lvl.subtitle}</span>
                    <span>
                      {isCompleted ? (
                        <span className="inline-flex items-center gap-1 text-emerald-600 text-xs">
                          <CheckCircle className="w-3.5 h-3.5" /> Cleared
                        </span>
                      ) : prog?.unlocked ? (
                        <span className="text-sky-600 text-xs">Unlocked</span>
                      ) : (
                        <span className="text-slate-400 text-xs">Locked</span>
                      )}
                    </span>
                    <span className="text-right text-amber-500 font-black">
                      {isCompleted ? '⭐'.repeat(stars) : '—'}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Common Mistakes Breakdown */}
        <div className="mb-6">
          <h3 className="text-lg font-black text-[#1B2A49] mb-2">
            Diagnosed Learning Patterns
          </h3>
          {Object.keys(mistakeCounts).length === 0 ? (
            <div className="p-4 bg-emerald-50 rounded-2xl border-2 border-emerald-200 text-emerald-800 font-bold text-sm text-center">
              🎉 No mistakes logged yet! Great conceptual understanding.
            </div>
          ) : (
            <div className="space-y-2">
              {Object.entries(mistakeCounts).map(([cat, count]) => (
                <div
                  key={cat}
                  className="flex items-center justify-between p-3 bg-amber-50 rounded-2xl border border-amber-200 text-sm font-bold text-amber-900"
                >
                  <span>{categoryLabels[cat] || cat}</span>
                  <span className="bg-amber-200 text-amber-950 px-2.5 py-0.5 rounded-full text-xs font-black">
                    {count} {count === 1 ? 'time' : 'times'}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="pt-4 border-t-2 border-slate-200 flex items-center justify-between">
          {!confirmReset ? (
            <button
              type="button"
              onClick={() => setConfirmReset(true)}
              className="flex items-center gap-1.5 px-4 py-2.5 rounded-2xl bg-red-50 hover:bg-red-100 text-red-600 font-black text-sm border-2 border-red-300"
            >
              <RotateCcw className="w-4 h-4" />
              <span>{strings.buttons.resetProgress}</span>
            </button>
          ) : (
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-red-600 flex items-center gap-1">
                <AlertTriangle className="w-4 h-4" /> Reset everything?
              </span>
              <button
                type="button"
                onClick={() => {
                  onResetProgress();
                  setConfirmReset(false);
                }}
                className="px-3 py-1.5 rounded-xl bg-red-600 text-white font-bold text-xs"
              >
                Yes, Reset
              </button>
              <button
                type="button"
                onClick={() => setConfirmReset(false)}
                className="px-3 py-1.5 rounded-xl bg-slate-200 text-slate-700 font-bold text-xs"
              >
                Cancel
              </button>
            </div>
          )}

          <button
            type="button"
            onClick={onClose}
            className="px-6 py-2.5 rounded-2xl bg-[#3A86FF] hover:bg-[#2563EB] text-white font-black text-base border-2 border-[#1B2A49] shadow-chunky-sm"
          >
            {strings.buttons.close}
          </button>
        </div>
      </div>
    </div>
  );
};
