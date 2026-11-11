import { useCallback, useEffect, useRef, useState } from 'react';
import {
  formatTextForNaturalSpeech,
  isLikelyElevenLabsKeyId,
  selectMostNaturalBrowserVoice,
} from '../logic/speechUtils';
import {
  checkServerElevenLabsStatus,
  getVoiceSettings,
  synthesizeSpeechAudio,
  VOICE_SETTINGS_UPDATED_EVENT,
  type VoiceSettings,
} from '../services/elevenLabsTts';

export interface UseSpeechOptions {
  isMuted?: boolean;
}

export interface SpeakOptions {
  force?: boolean;
}

export function useSpeech(options: UseSpeechOptions = {}) {
  const { isMuted = false } = options;
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [voiceSettings, setVoiceSettings] = useState<VoiceSettings>(() => getVoiceSettings());
  const [serverConfigured, setServerConfigured] = useState(false);
  const [voiceProvider, setVoiceProvider] = useState<'elevenlabs' | 'browser-natural'>(() =>
    getVoiceSettings().apiKey.trim() ? 'elevenlabs' : 'browser-natural'
  );
  const [lastError, setLastError] = useState<string | null>(null);

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const abortRef = useRef<AbortController | null>(null);
  const mutedRef = useRef(isMuted);

  useEffect(() => {
    mutedRef.current = isMuted;
  }, [isMuted]);

  const cancelPlaybackImperative = useCallback(() => {
    if (abortRef.current) {
      abortRef.current.abort();
      abortRef.current = null;
    }
    if (audioRef.current) {
      try {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
      } catch {
        // Ignore cleanup errors
      }
      audioRef.current = null;
    }
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      try {
        window.speechSynthesis.cancel();
      } catch {
        // Ignore synthesis cancel errors
      }
    }
  }, []);

  const stop = useCallback(() => {
    cancelPlaybackImperative();
    setIsSpeaking(false);
  }, [cancelPlaybackImperative]);

  useEffect(() => {
    if (!isMuted) return;
    cancelPlaybackImperative();
    const resetTimer = setTimeout(() => setIsSpeaking(false), 0);
    return () => clearTimeout(resetTimer);
  }, [isMuted, cancelPlaybackImperative]);

  useEffect(() => {
    let active = true;
    const isTestEnv =
      typeof import.meta !== 'undefined' && import.meta.env?.MODE === 'test';

    if (!isTestEnv) {
      checkServerElevenLabsStatus().then((configured) => {
        if (!active) return;
        setServerConfigured(configured);
        if (configured || getVoiceSettings().apiKey.trim()) {
          setVoiceProvider('elevenlabs');
        }
      });
    }

    const handleSettingsUpdate = () => {
      const updated = getVoiceSettings();
      setVoiceSettings(updated);
      setLastError(null);
      if (updated.apiKey.trim()) {
        setVoiceProvider('elevenlabs');
      } else if (!isTestEnv) {
        checkServerElevenLabsStatus(true).then((configured) => {
          if (!active) return;
          setServerConfigured(configured);
          setVoiceProvider(configured ? 'elevenlabs' : 'browser-natural');
        });
      } else {
        setVoiceProvider('browser-natural');
      }
    };

    if (typeof window !== 'undefined') {
      window.addEventListener(VOICE_SETTINGS_UPDATED_EVENT, handleSettingsUpdate);
    }

    return () => {
      active = false;
      if (typeof window !== 'undefined') {
        window.removeEventListener(VOICE_SETTINGS_UPDATED_EVENT, handleSettingsUpdate);
      }
      cancelPlaybackImperative();
    };
  }, [cancelPlaybackImperative]);

  const speakBrowserNatural = useCallback((normalizedText: string) => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
      setIsSpeaking(false);
      return;
    }

    try {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(normalizedText);
      const voices = window.speechSynthesis.getVoices?.() || [];
      const naturalVoice = selectMostNaturalBrowserVoice(voices);
      if (naturalVoice) {
        utterance.voice = naturalVoice;
      }
      // Natural human cadence without squeaky pitch distortion
      utterance.rate = 0.96;
      utterance.pitch = 1.0;

      utterance.onstart = () => setIsSpeaking(true);
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => setIsSpeaking(false);

      window.speechSynthesis.speak(utterance);
    } catch {
      setIsSpeaking(false);
    }
  }, []);

  const speak = useCallback(
    async (rawText: string, speakOpts?: SpeakOptions) => {
      if (mutedRef.current && !speakOpts?.force) return;
      const normalizedText = formatTextForNaturalSpeech(rawText);
      if (!normalizedText) return;

      stop();
      setLastError(null);

      const controller = new AbortController();
      abortRef.current = controller;
      setIsSpeaking(true);

      const result = await synthesizeSpeechAudio({
        text: normalizedText,
        signal: controller.signal,
      });

      if (controller.signal.aborted) return;

      if (result.audioUrl && typeof Audio !== 'undefined') {
        setVoiceProvider('elevenlabs');
        try {
          const audio = new Audio(result.audioUrl);
          audioRef.current = audio;
          audio.onended = () => {
            if (audioRef.current === audio) {
              audioRef.current = null;
            }
            setIsSpeaking(false);
          };
          audio.onerror = () => {
            if (audioRef.current === audio) {
              audioRef.current = null;
            }
            speakBrowserNatural(normalizedText);
          };
          await audio.play();
          return;
        } catch {
          audioRef.current = null;
          setIsSpeaking(false);
          return;
        }
      }

      if (result.reason === 'aborted') {
        setIsSpeaking(false);
        return;
      }

      if (result.errorMessage) {
        setLastError(result.errorMessage);
      }

      setVoiceProvider('browser-natural');
      speakBrowserNatural(normalizedText);
    },
    [stop, speakBrowserNatural]
  );

  const envKey =
    typeof import.meta !== 'undefined' && import.meta.env?.VITE_ELEVENLABS_API_KEY
      ? String(import.meta.env.VITE_ELEVENLABS_API_KEY)
      : '';
  const hasUsableClientKey =
    Boolean(voiceSettings.apiKey.trim()) &&
    !isLikelyElevenLabsKeyId(voiceSettings.apiKey);
  const hasUsableEnvKey =
    Boolean(envKey.trim()) && !isLikelyElevenLabsKeyId(envKey);
  const isElevenLabsConfigured = Boolean(
    hasUsableClientKey || serverConfigured || hasUsableEnvKey
  );

  const isAudioSupported =
    typeof window !== 'undefined' &&
    (typeof Audio !== 'undefined' || 'speechSynthesis' in window);

  return {
    speak,
    stop,
    isSpeaking,
    voiceProvider,
    isElevenLabsConfigured,
    voiceSettings,
    lastError,
    isSupported: isAudioSupported,
  };
}
