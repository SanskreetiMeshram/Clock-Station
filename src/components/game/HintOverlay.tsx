import React from 'react';
import { Lightbulb, CheckCircle2, Volume2 } from 'lucide-react';
import type { MistakeDiagnostic } from '../../types/game';

export interface HintOverlayProps {
  diagnostic: MistakeDiagnostic | null;
  attemptNumber: number;
  revealed?: boolean;
  onDismiss: () => void;
  onSpeak?: () => void;
  className?: string;
}

export const HintOverlay: React.FC<HintOverlayProps> = ({
  diagnostic,
  attemptNumber,
  revealed = false,
  onDismiss,
  onSpeak,
  className = '',
}) => {
  if (!diagnostic) return null;

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-fade-in ${className}`}
      role="dialog"
      aria-modal="true"
      aria-label="Help hint"
    >
      <div className="w-full max-w-md bg-white rounded-3xl border-4 border-[#1B2A49] shadow-2xl p-6 flex flex-col items-center text-center animate-bounceSubtle">
        {/* Icon */}
        <div
          className={`w-16 h-16 rounded-3xl flex items-center justify-center mb-4 border-3 border-[#1B2A49] shadow-chunky-sm ${
            revealed ? 'bg-emerald-100 text-emerald-600' : 'bg-amber-100 text-amber-600'
          }`}
        >
          {revealed ? (
            <CheckCircle2 className="w-10 h-10" />
          ) : (
            <Lightbulb className="w-10 h-10" />
          )}
        </div>

        {/* Title */}
        <h3 className="text-xl sm:text-2xl font-black text-[#1B2A49] mb-2 font-display">
          {revealed ? 'Here is the Right Time! 🚂' : `Station Master Tip (Try ${attemptNumber}/3)`}
        </h3>

        {/* Message */}
        <p className="text-base sm:text-lg text-slate-700 font-bold mb-4 leading-relaxed">
          {diagnostic.message}
        </p>

        {onSpeak && (
          <button
            type="button"
            onClick={onSpeak}
            className="mb-5 inline-flex items-center gap-2 px-4 py-2 rounded-2xl bg-amber-100 hover:bg-amber-200 text-[#1B2A49] font-black text-sm border-2 border-[#1B2A49] shadow-chunky-sm active:translate-y-0.5 transition-colors"
            title="Hear station master tip aloud"
            aria-label="Read hint aloud"
          >
            <Volume2 className="w-4 h-4" />
            <span>Listen to Tip</span>
          </button>
        )}

        {/* Action Button */}
        <button
          type="button"
          onClick={onDismiss}
          className="w-full min-h-[56px] px-6 py-3 rounded-2xl bg-[#3DDC84] hover:bg-[#34c776] text-[#1B2A49] font-black text-xl border-3 border-[#1B2A49] shadow-chunky active:translate-y-1 active:shadow-chunky-active focus-ring"
        >
          {revealed ? 'Continue to Next Train 🚂' : 'I Got It! Let Me Try 💪'}
        </button>
      </div>
    </div>
  );
};
