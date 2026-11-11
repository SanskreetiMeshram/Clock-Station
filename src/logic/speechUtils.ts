export interface ElevenLabsVoicePreset {
  id: string;
  name: string;
  role: string;
  accent: string;
  settings: {
    stability: number;
    similarity_boost: number;
    style: number;
    use_speaker_boost: boolean;
  };
}

export const ELEVENLABS_VOICE_PRESETS: ElevenLabsVoicePreset[] = [
  {
    id: 'JBFqnCBsd6RMkjVDRZzb',
    name: 'George',
    role: 'Station Master (Warm British)',
    accent: 'British',
    settings: {
      stability: 0.42,
      similarity_boost: 0.8,
      style: 0.35,
      use_speaker_boost: true,
    },
  },
  {
    id: 'EXAVITQu4vr4xnSDxMaL',
    name: 'Sarah',
    role: 'Express Host (Friendly & Warm)',
    accent: 'American',
    settings: {
      stability: 0.45,
      similarity_boost: 0.78,
      style: 0.3,
      use_speaker_boost: true,
    },
  },
  {
    id: 'Xb7hH8MSUJpSbSDYk0k2',
    name: 'Alice',
    role: 'Conductor (Clear Educator)',
    accent: 'British',
    settings: {
      stability: 0.48,
      similarity_boost: 0.8,
      style: 0.25,
      use_speaker_boost: true,
    },
  },
  {
    id: '21m00Tcm4TlvDq8ikWAM',
    name: 'Rachel',
    role: 'Station Announcer (Calm)',
    accent: 'American',
    settings: {
      stability: 0.46,
      similarity_boost: 0.78,
      style: 0.25,
      use_speaker_boost: true,
    },
  },
];

export const DEFAULT_ELEVENLABS_VOICE_ID = 'JBFqnCBsd6RMkjVDRZzb';
export const DEFAULT_ELEVENLABS_MODEL_ID = 'eleven_multilingual_v2';

export function getPresetSettingsForVoice(voiceId: string) {
  return (
    ELEVENLABS_VOICE_PRESETS.find((v) => v.id === voiceId)?.settings || {
      stability: 0.45,
      similarity_boost: 0.78,
      style: 0.3,
      use_speaker_boost: true,
    }
  );
}

/**
 * Normalizes board prompts & railway abbreviations into smooth spoken English
 * so neural TTS reads times naturally instead of stiff symbols.
 */
export function formatTextForNaturalSpeech(rawText: string): string {
  if (!rawText) return '';

  // Normalize decorative Station Master prefix and dashes before stripping emojis
  let text = rawText
    .replace(/⭐\s*Station Master:/gi, 'Station Master Challenge.')
    .replace(/[\p{Extended_Pictographic}\uFE0F]/gu, ' ')
    .replace(/—/g, ', ');

  // Convert 24h times first when >= 13 or 00 (e.g. 20:37 -> "20 37", 00:05 -> "zero zero oh 5")
  text = text.replace(/\b(00|1[3-9]|2[0-3]):([0-5]\d)\b/g, (_m, hh: string, mm: string) => {
    const hSpoken = hh === '00' ? 'zero zero' : String(Number(hh));
    const minNum = Number(mm);
    if (minNum === 0) return `${hSpoken} hundred hours`;
    if (minNum < 10) return `${hSpoken} oh ${minNum}`;
    return `${hSpoken} ${minNum}`;
  });

  // Convert standard 12h clock times (e.g. 9:00 -> "9 o'clock", 8:05 -> "8 oh 5", 9:15 -> "9 15")
  text = text.replace(/\b([1-9]|1[0-2]):([0-5]\d)\b/g, (_m, h: string, mm: string) => {
    const minNum = Number(mm);
    if (minNum === 0) return `${h} o'clock`;
    if (minNum < 10) return `${h} oh ${minNum}`;
    return `${h} ${minNum}`;
  });

  // Expand shorthand time units for natural narration
  text = text
    .replace(/\b(\d+)\s*hr\b/gi, (_m, n: string) =>
      Number(n) === 1 ? '1 hour' : `${n} hours`
    )
    .replace(/\b(\d+)\s*min\b/gi, (_m, n: string) =>
      Number(n) === 1 ? '1 minute' : `${n} minutes`
    )
    .replace(/\b24h\b/gi, '24-hour');

  return text.replace(/\s+/g, ' ').trim();
}

/**
 * Picks the least robotic browser fallback voice if ElevenLabs is not configured.
 * Prioritizes Microsoft Natural/Online, Google, and Apple Siri/Enhanced English voices.
 */
export function selectMostNaturalBrowserVoice(
  voices: SpeechSynthesisVoice[]
): SpeechSynthesisVoice | null {
  if (!voices || voices.length === 0) return null;

  const englishVoices = voices.filter((v) => /^en([-_]|$)/i.test(v.lang));
  const pool = englishVoices.length > 0 ? englishVoices : voices;

  const preferredMatchers = [
    /online\s*\(natural\)|natural|neural/i,
    /aria|jenny|sonia|libby|ryan|guy/i,
    /google\s+(us|uk)\s+english/i,
    /samantha|daniel|karen|serena|kate/i,
  ];

  for (const regex of preferredMatchers) {
    const match = pool.find((v) => regex.test(v.name));
    if (match) return match;
  }

  // Avoid flat legacy robotic defaults when any alternative exists
  const nonLegacy = pool.find(
    (v) => !/\b(david|zira|mark|espeak|festival)\b/i.test(v.name)
  );
  return nonLegacy || pool[0];
}

/**
 * Detects 48-64 character hex strings that match an ElevenLabs Key ID rather than
 * an actual secret API key (which starts with "sk_").
 */
export function isLikelyElevenLabsKeyId(value: string): boolean {
  const trimmed = value.trim();
  return /^[0-9a-f]{48,64}$/i.test(trimmed) && !trimmed.startsWith('sk_');
}
