import React, { useState, useRef } from 'react';
import { Volume2, VolumeX, Type, Settings, Play, Map, HelpCircle } from 'lucide-react';
import { TrainLocomotive } from '../scene/TrainLocomotive';
import { Mascot } from '../scene/Mascot';
import { strings } from '../../strings/strings.en';

export interface HomeScreenProps {
  onPlay: () => void;
  onOpenMap: () => void;
  onOpenParentPanel: () => void;
  isMuted: boolean;
  onToggleMute: () => void;
  onToggleTextSize: () => void;
  totalStars: number;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({
  onPlay,
  onOpenMap,
  onOpenParentPanel,
  isMuted,
  onToggleMute,
  onToggleTextSize,
  totalStars,
}) => {
  const [pressProgress, setPressProgress] = useState(0);
  const [showHowToPlay, setShowHowToPlay] = useState(false);
  const holdTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const holdIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const startHold = () => {
    let elapsed = 0;
    holdIntervalRef.current = setInterval(() => {
      elapsed += 50;
      setPressProgress(Math.min(100, (elapsed / 2000) * 100));
    }, 50);

    holdTimerRef.current = setTimeout(() => {
      clearHold();
      onOpenParentPanel();
    }, 2000);
  };

  const clearHold = () => {
    if (holdTimerRef.current) clearTimeout(holdTimerRef.current);
    if (holdIntervalRef.current) clearInterval(holdIntervalRef.current);
    setPressProgress(0);
  };

  return (
    <div className="min-h-screen flex flex-col justify-between p-4 sm:p-6 bg-gradient-to-b from-[#8EDBFF] via-[#BAE6FD] to-[#E6F7FF] select-none">
      {/* Top Bar with Star Counter, Audio, Font, and Parent Lock */}
      <header className="w-full max-w-4xl mx-auto flex items-center justify-between">
        {/* Star Badge */}
        <div className="flex items-center gap-2 bg-white/90 px-4 py-2 rounded-2xl border-3 border-[#1B2A49] shadow-chunky-sm font-black text-amber-900 text-lg">
          <span>⭐</span>
          <span>{totalStars} Stars</span>
        </div>

        {/* Secondary Header Controls */}
        <div className="flex items-center gap-2">
          {/* How to Play Help */}
          <button
            type="button"
            onClick={() => setShowHowToPlay(true)}
            className="flex items-center justify-center w-12 h-12 rounded-2xl bg-white/90 hover:bg-amber-100 border-3 border-[#1B2A49] text-[#1B2A49] shadow-chunky-sm active:translate-y-0.5"
            title="How to play"
            aria-label="How to play instructions"
          >
            <HelpCircle className="w-6 h-6" />
          </button>

          {/* Text Size */}
          <button
            type="button"
            onClick={onToggleTextSize}
            className="flex items-center justify-center w-12 h-12 rounded-2xl bg-white/90 hover:bg-sky-100 border-3 border-[#1B2A49] text-[#1B2A49] shadow-chunky-sm active:translate-y-0.5"
            title="Toggle text size"
            aria-label="Toggle text size"
          >
            <Type className="w-6 h-6" />
          </button>

          {/* Sound Toggle */}
          <button
            type="button"
            onClick={onToggleMute}
            className={`flex items-center justify-center w-12 h-12 rounded-2xl border-3 border-[#1B2A49] shadow-chunky-sm active:translate-y-0.5 ${
              isMuted ? 'bg-red-100 text-red-600' : 'bg-emerald-100 text-emerald-700'
            }`}
            title={isMuted ? 'Unmute sound' : 'Mute sound'}
            aria-label={isMuted ? 'Unmute audio' : 'Mute audio'}
          >
            {isMuted ? <VolumeX className="w-6 h-6" /> : <Volume2 className="w-6 h-6" />}
          </button>

          {/* Parent/Teacher 2-Second Hold Gear Icon */}
          <div className="relative">
            <button
              type="button"
              onPointerDown={startHold}
              onPointerUp={clearHold}
              onPointerLeave={clearHold}
              className="flex items-center justify-center w-12 h-12 rounded-2xl bg-slate-100 hover:bg-slate-200 border-3 border-[#1B2A49] text-slate-700 shadow-chunky-sm active:translate-y-0.5 relative overflow-hidden"
              title="Parent / Teacher (Hold 2s)"
              aria-label="Hold for 2 seconds to open parent dashboard"
            >
              <Settings className="w-6 h-6" />
              {/* Radial or height progress indicator */}
              {pressProgress > 0 && (
                <div
                  className="absolute bottom-0 left-0 right-0 bg-amber-400 opacity-60 transition-all"
                  style={{ height: `${pressProgress}%` }}
                />
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Main Center Area: Title & Bouncing Train */}
      <main className="flex flex-col items-center justify-center text-center my-auto py-6">
        {/* Animated Main Title */}
        <div className="mb-4">
          <div className="inline-block bg-[#1B2A49] text-[#FFD23F] px-8 py-3 rounded-3xl border-4 border-[#FF9F1C] shadow-board transform -rotate-1 hover:rotate-0 transition-transform">
            <h1 className="text-4xl sm:text-6xl font-black tracking-wider uppercase font-display drop-shadow">
              {strings.appTitle}
            </h1>
          </div>
          <p className="mt-3 text-lg sm:text-2xl font-bold text-[#1B2A49]">
            {strings.appSubtitle}
          </p>
        </div>

        {/* Bouncing Locomotive Graphic */}
        <div className="w-72 sm:w-84 max-w-full my-4 animate-bounceSubtle">
          <TrainLocomotive style="steam_red" />
        </div>

        {/* Action Buttons: Play & Level Map */}
        <div className="flex flex-col sm:flex-row items-center gap-4 mt-4 w-full max-w-md px-4">
          <button
            type="button"
            onClick={onPlay}
            className="w-full sm:flex-1 min-h-[64px] px-8 py-4 rounded-3xl bg-[#3DDC84] hover:bg-[#34c776] text-[#1B2A49] text-3xl font-black border-4 border-[#1B2A49] shadow-chunky active:translate-y-1 active:shadow-chunky-active flex items-center justify-center gap-3 transition-transform focus-ring"
          >
            <Play className="w-8 h-8 fill-current" />
            <span>{strings.buttons.play}</span>
          </button>

          <button
            type="button"
            onClick={onOpenMap}
            className="w-full sm:flex-1 min-h-[64px] px-6 py-4 rounded-3xl bg-[#FFD23F] hover:bg-[#f5c82e] text-[#1B2A49] text-2xl font-black border-4 border-[#1B2A49] shadow-chunky active:translate-y-1 active:shadow-chunky-active flex items-center justify-center gap-2 transition-transform focus-ring"
          >
            <Map className="w-7 h-7" />
            <span>{strings.buttons.levels}</span>
          </button>
        </div>
      </main>

      {/* Bottom Mascot Welcome */}
      <footer className="w-full max-w-4xl mx-auto flex items-end justify-between">
        <Mascot message={strings.mascot.greeting} />

        <div className="hidden sm:block text-xs text-[#1B2A49] font-bold opacity-75">
          Classes 2–4 • Ages 7–10 • Accessible
        </div>
      </footer>

      {/* How to Play Dialog */}
      {showHowToPlay && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
        >
          <div className="w-full max-w-lg bg-white rounded-3xl border-4 border-[#1B2A49] shadow-2xl p-6">
            <h2 className="text-2xl font-black text-[#1B2A49] mb-4">
              How to Play Clock Station 🚂
            </h2>
            <ul className="space-y-3 text-left font-bold text-slate-700 text-base mb-6">
              <li className="flex items-start gap-2">
                <span className="text-2xl">👉</span>
                <span>Look at the train departure board to see what time the train leaves.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-2xl">🔵</span>
                <span>The <strong>short blue hand</strong> sets the hour!</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-2xl">🔴</span>
                <span>The <strong>long red hand</strong> sets the minutes (each number = 5 minutes).</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-2xl">🚂</span>
                <span>Press <strong>Go! 🚂</strong> to blow the whistle and send the train off!</span>
              </li>
            </ul>

            <button
              type="button"
              onClick={() => setShowHowToPlay(false)}
              className="w-full min-h-[52px] rounded-2xl bg-[#3A86FF] text-white text-xl font-black border-3 border-[#1B2A49] shadow-chunky"
            >
              Let's Play!
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
