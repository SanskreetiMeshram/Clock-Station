import { useRef, useCallback, useEffect, useState } from 'react';

// Shared AudioContext across hooks
let sharedAudioCtx: AudioContext | null = null;

function getAudioContext(): AudioContext | null {
  if (typeof window === 'undefined') return null;
  if (!sharedAudioCtx) {
    const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (AudioContextClass) {
      sharedAudioCtx = new AudioContextClass();
    }
  }
  if (sharedAudioCtx && sharedAudioCtx.state === 'suspended') {
    sharedAudioCtx.resume().catch(() => {});
  }
  return sharedAudioCtx;
}

export function useSound(initialMuted: boolean = false) {
  const [isMuted, setIsMuted] = useState(initialMuted);
  const mutedRef = useRef(isMuted);

  useEffect(() => {
    mutedRef.current = isMuted;
  }, [isMuted]);

  const toggleMute = useCallback(() => {
    setIsMuted((prev) => !prev);
  }, []);

  const setMuted = useCallback((val: boolean) => {
    setIsMuted(val);
  }, []);

  // Tiny tick sound for clock hand snapping
  const playTick = useCallback(() => {
    if (mutedRef.current) return;
    try {
      const ctx = getAudioContext();
      if (!ctx) return;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(1400, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(800, ctx.currentTime + 0.015);

      gain.gain.setValueAtTime(0.12, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.015);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + 0.02);

      // Haptic feedback
      if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
        navigator.vibrate(5);
      }
    } catch {
      // AudioContext policy
    }
  }, []);

  // Train steam whistle
  const playWhistle = useCallback(() => {
    if (mutedRef.current) return;
    try {
      const ctx = getAudioContext();
      if (!ctx) return;
      const now = ctx.currentTime;

      // Two harmonic pitches for a realistic steam whistle chord
      const f1 = 587.33; // D5
      const f2 = 880.00; // A5

      [f1, f2].forEach((freq) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(freq, now);

        // Add small vibrato
        const vibrato = ctx.createOscillator();
        const vibratoGain = ctx.createGain();
        vibrato.frequency.value = 6; // 6Hz vibrato
        vibratoGain.gain.value = 8;
        vibrato.connect(osc.frequency);
        vibrato.start(now);
        vibrato.stop(now + 0.7);

        // Envelope
        gain.gain.setValueAtTime(0.01, now);
        gain.gain.linearRampToValueAtTime(0.18, now + 0.08);
        gain.gain.setValueAtTime(0.18, now + 0.45);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.7);

        // Soft lowpass filter to remove harshness
        const filter = ctx.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(2200, now);

        osc.connect(filter);
        filter.connect(gain);
        gain.connect(ctx.destination);

        osc.start(now);
        osc.stop(now + 0.75);
      });
    } catch {}
  }, []);

  // Chuff-chuff steam puff sound
  const playChuff = useCallback(() => {
    if (mutedRef.current) return;
    try {
      const ctx = getAudioContext();
      if (!ctx) return;
      const now = ctx.currentTime;
      const bufferSize = ctx.sampleRate * 0.12; // 120ms noise
      const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = Math.random() * 2 - 1;
      }

      const noise = ctx.createBufferSource();
      noise.buffer = buffer;

      const filter = ctx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(600, now);
      filter.Q.value = 3.0;

      const gain = ctx.createGain();
      gain.gain.setValueAtTime(0.25, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.12);

      noise.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);

      noise.start(now);
      noise.stop(now + 0.13);
    } catch {}
  }, []);

  // Gentle cartoon boing / wobble for "Not yet"
  const playBoing = useCallback(() => {
    if (mutedRef.current) return;
    try {
      const ctx = getAudioContext();
      if (!ctx) return;
      const now = ctx.currentTime;

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(260, now);
      osc.frequency.exponentialRampToValueAtTime(140, now + 0.15);
      osc.frequency.linearRampToValueAtTime(220, now + 0.28);
      osc.frequency.exponentialRampToValueAtTime(100, now + 0.45);

      gain.gain.setValueAtTime(0.2, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.45);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 0.46);
    } catch {}
  }, []);

  // Celebration brass fanfare on level completion
  const playFanfare = useCallback(() => {
    if (mutedRef.current) return;
    try {
      const ctx = getAudioContext();
      if (!ctx) return;
      const now = ctx.currentTime;
      // Notes: C5 (523), E5 (659), G5 (784), C6 (1046)
      const notes = [
        { freq: 523.25, start: 0, dur: 0.14 },
        { freq: 659.25, start: 0.12, dur: 0.14 },
        { freq: 783.99, start: 0.24, dur: 0.16 },
        { freq: 1046.5, start: 0.38, dur: 0.55 },
      ];

      notes.forEach(({ freq, start, dur }) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, now + start);

        gain.gain.setValueAtTime(0.001, now + start);
        gain.gain.linearRampToValueAtTime(0.22, now + start + 0.03);
        gain.gain.setValueAtTime(0.22, now + start + dur - 0.05);
        gain.gain.exponentialRampToValueAtTime(0.001, now + start + dur);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(now + start);
        osc.stop(now + start + dur + 0.01);
      });
    } catch {}
  }, []);

  return {
    isMuted,
    toggleMute,
    setMuted,
    playTick,
    playWhistle,
    playChuff,
    playBoing,
    playFanfare,
  };
}
