import {
  DEFAULT_ELEVENLABS_MODEL_ID,
  DEFAULT_ELEVENLABS_VOICE_ID,
  formatTextForNaturalSpeech,
  getPresetSettingsForVoice,
  isLikelyElevenLabsKeyId,
} from '../logic/speechUtils';

export type ElevenLabsModelId = 'eleven_multilingual_v2' | 'eleven_flash_v2_5';

export interface VoiceSettings {
  apiKey: string;
  voiceId: string;
  modelId: ElevenLabsModelId;
  autoRead: boolean;
}

export interface SpeechSynthesisResult {
  audioUrl: string | null;
  provider: 'elevenlabs' | 'browser-natural';
  reason?: 'not_configured' | 'invalid_api_key' | 'error' | 'aborted';
  errorMessage?: string;
}

export const VOICE_SETTINGS_STORAGE_KEY = 'clock_station_voice_settings_v1';
export const VOICE_SETTINGS_UPDATED_EVENT = 'clock-station-voice-updated';

const DEFAULT_SETTINGS: VoiceSettings = {
  apiKey: '',
  voiceId: DEFAULT_ELEVENLABS_VOICE_ID,
  modelId: DEFAULT_ELEVENLABS_MODEL_ID,
  autoRead: true,
};

const MAX_CACHE_ENTRIES = 60;
const audioBlobUrlCache = new Map<string, string>();
let cachedServerConfigured: boolean | null = null;

export function getVoiceSettings(): VoiceSettings {
  if (typeof window === 'undefined') return DEFAULT_SETTINGS;
  try {
    const raw = window.localStorage.getItem(VOICE_SETTINGS_STORAGE_KEY);
    if (!raw) return DEFAULT_SETTINGS;
    const parsed = JSON.parse(raw) as Partial<VoiceSettings>;
    return {
      apiKey: typeof parsed.apiKey === 'string' ? parsed.apiKey : '',
      voiceId:
        typeof parsed.voiceId === 'string' && parsed.voiceId.trim()
          ? parsed.voiceId
          : DEFAULT_ELEVENLABS_VOICE_ID,
      modelId:
        parsed.modelId === 'eleven_flash_v2_5'
          ? 'eleven_flash_v2_5'
          : 'eleven_multilingual_v2',
      autoRead: typeof parsed.autoRead === 'boolean' ? parsed.autoRead : true,
    };
  } catch {
    return DEFAULT_SETTINGS;
  }
}

export function saveVoiceSettings(update: Partial<VoiceSettings>): VoiceSettings {
  const next = { ...getVoiceSettings(), ...update };
  if (typeof window !== 'undefined') {
    try {
      window.localStorage.setItem(VOICE_SETTINGS_STORAGE_KEY, JSON.stringify(next));
      window.dispatchEvent(new CustomEvent(VOICE_SETTINGS_UPDATED_EVENT, { detail: next }));
    } catch {
      // Ignore storage quota errors
    }
  }
  return next;
}

export function clearAudioCache() {
  if (typeof URL !== 'undefined' && typeof URL.revokeObjectURL === 'function') {
    audioBlobUrlCache.forEach((url) => {
      try {
        URL.revokeObjectURL(url);
      } catch {
        // Ignore revoke errors
      }
    });
  }
  audioBlobUrlCache.clear();
  cachedServerConfigured = null;
}

function cacheAudioUrl(key: string, url: string) {
  if (audioBlobUrlCache.size >= MAX_CACHE_ENTRIES) {
    const oldestKey = audioBlobUrlCache.keys().next().value;
    if (oldestKey !== undefined) {
      const oldestUrl = audioBlobUrlCache.get(oldestKey);
      if (oldestUrl && typeof URL !== 'undefined' && typeof URL.revokeObjectURL === 'function') {
        URL.revokeObjectURL(oldestUrl);
      }
      audioBlobUrlCache.delete(oldestKey);
    }
  }
  audioBlobUrlCache.set(key, url);
}

export async function checkServerElevenLabsStatus(forceRefresh = false): Promise<boolean> {
  if (cachedServerConfigured !== null && !forceRefresh) {
    return cachedServerConfigured;
  }
  if (typeof window === 'undefined' || typeof fetch !== 'function') {
    cachedServerConfigured = false;
    return false;
  }
  try {
    const res = await fetch('/api/tts', { method: 'GET' });
    if (!res.ok) {
      cachedServerConfigured = false;
      return false;
    }
    const data = (await res.json()) as { configured?: boolean };
    cachedServerConfigured = Boolean(data?.configured);
    return cachedServerConfigured;
  } catch {
    cachedServerConfigured = false;
    return false;
  }
}

function getEffectiveClientApiKey(explicitKey?: string): string {
  const settings = getVoiceSettings();
  const envKey =
    typeof import.meta !== 'undefined' && import.meta.env?.VITE_ELEVENLABS_API_KEY
      ? String(import.meta.env.VITE_ELEVENLABS_API_KEY)
      : '';
  return (explicitKey?.trim() || settings.apiKey.trim() || envKey.trim());
}

export async function synthesizeSpeechAudio(params: {
  text: string;
  voiceId?: string;
  modelId?: ElevenLabsModelId;
  apiKey?: string;
  signal?: AbortSignal;
}): Promise<SpeechSynthesisResult> {
  const settings = getVoiceSettings();
  const voiceId = params.voiceId || settings.voiceId || DEFAULT_ELEVENLABS_VOICE_ID;
  const modelId = params.modelId || settings.modelId || DEFAULT_ELEVENLABS_MODEL_ID;
  const normalizedText = formatTextForNaturalSpeech(params.text);

  if (!normalizedText || typeof fetch !== 'function') {
    return { audioUrl: null, provider: 'browser-natural', reason: 'not_configured' };
  }

  const cacheKey = `${voiceId}:${modelId}:${normalizedText}`;
  const cachedUrl = audioBlobUrlCache.get(cacheKey);
  if (cachedUrl) {
    return { audioUrl: cachedUrl, provider: 'elevenlabs' };
  }

  const clientApiKey = getEffectiveClientApiKey(params.apiKey);
  if (clientApiKey && isLikelyElevenLabsKeyId(clientApiKey)) {
    return {
      audioUrl: null,
      provider: 'browser-natural',
      reason: 'invalid_api_key',
      errorMessage:
        'You entered an ElevenLabs Key ID (hex string). Please paste the secret API key starting with "sk_" shown when you created the key.',
    };
  }

  try {
    let response: Response;

    if (clientApiKey) {
      response = await fetch(
        `https://api.elevenlabs.io/v1/text-to-speech/${encodeURIComponent(voiceId)}`,
        {
          method: 'POST',
          headers: {
            'xi-api-key': clientApiKey,
            'Content-Type': 'application/json',
            Accept: 'audio/mpeg',
          },
          body: JSON.stringify({
            text: normalizedText,
            model_id: modelId,
            voice_settings: getPresetSettingsForVoice(voiceId),
          }),
          signal: params.signal,
        }
      );
    } else {
      if (cachedServerConfigured === false) {
        return { audioUrl: null, provider: 'browser-natural', reason: 'not_configured' };
      }

      response = await fetch('/api/tts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text: normalizedText,
          voiceId,
          modelId,
        }),
        signal: params.signal,
      });

      if (response.status === 501) {
        cachedServerConfigured = false;
        return { audioUrl: null, provider: 'browser-natural', reason: 'not_configured' };
      }
    }

    if (!response.ok) {
      const errorText = await response.text().catch(() => '');
      const isAuthIssue =
        response.status === 401 ||
        response.status === 403 ||
        /invalid_api_key|api_key_id_used_as_api_key|authentication_error/i.test(errorText);

      if (isAuthIssue) {
        const keyIdUsed = /api_key_id_used_as_api_key/i.test(errorText);
        return {
          audioUrl: null,
          provider: 'browser-natural',
          reason: 'invalid_api_key',
          errorMessage: keyIdUsed
            ? 'ElevenLabs rejected this value because it is an API Key ID, not the secret API key starting with "sk_".'
            : 'ElevenLabs API key was rejected. Check that your secret key starts with "sk_".',
        };
      }

      return {
        audioUrl: null,
        provider: 'browser-natural',
        reason: 'error',
        errorMessage: `ElevenLabs returned status ${response.status}.`,
      };
    }

    const contentType = response.headers.get('content-type') || '';
    if (!contentType.includes('audio') && !contentType.includes('octet-stream')) {
      return { audioUrl: null, provider: 'browser-natural', reason: 'error' };
    }

    const blob = await response.blob();
    const audioUrl = URL.createObjectURL(blob);
    cacheAudioUrl(cacheKey, audioUrl);
    if (!clientApiKey) {
      cachedServerConfigured = true;
    }

    return { audioUrl, provider: 'elevenlabs' };
  } catch (err) {
    if (err instanceof DOMException && err.name === 'AbortError') {
      return { audioUrl: null, provider: 'browser-natural', reason: 'aborted' };
    }
    return {
      audioUrl: null,
      provider: 'browser-natural',
      reason: 'error',
      errorMessage: err instanceof Error ? err.message : 'Network error calling ElevenLabs.',
    };
  }
}
