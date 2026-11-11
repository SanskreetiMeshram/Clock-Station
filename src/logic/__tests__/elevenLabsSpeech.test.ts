// @vitest-environment happy-dom
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import {
  DEFAULT_ELEVENLABS_MODEL_ID,
  DEFAULT_ELEVENLABS_VOICE_ID,
  ELEVENLABS_VOICE_PRESETS,
  formatTextForNaturalSpeech,
  isLikelyElevenLabsKeyId,
  selectMostNaturalBrowserVoice,
} from '../speechUtils';
import {
  clearAudioCache,
  getVoiceSettings,
  saveVoiceSettings,
  synthesizeSpeechAudio,
} from '../../services/elevenLabsTts';

describe('formatTextForNaturalSpeech', () => {
  it('strips emojis and expands clock times and shorthand durations into spoken English', () => {
    expect(formatTextForNaturalSpeech('🚂 Train leaves at 9:00!')).toBe(
      "Train leaves at 9 o'clock!"
    );
    expect(formatTextForNaturalSpeech('Depart at 8:05 for a 3 hr 15 min trip.')).toBe(
      'Depart at 8 oh 5 for a 3 hours 15 minutes trip.'
    );
    expect(formatTextForNaturalSpeech('Express arrives at 20:37 (24h).')).toBe(
      'Express arrives at 20 37 (24-hour).'
    );
    expect(formatTextForNaturalSpeech('⭐ Station Master: Arrive 1 hr 1 min early!')).toBe(
      'Station Master Challenge. Arrive 1 hour 1 minute early!'
    );
  });

  it('handles empty text safely', () => {
    expect(formatTextForNaturalSpeech('')).toBe('');
  });
});

describe('selectMostNaturalBrowserVoice', () => {
  const makeVoice = (name: string, lang = 'en-US') =>
    ({ name, lang } as unknown as SpeechSynthesisVoice);

  it('prioritizes neural/natural/Google voices ahead of legacy desktop voices', () => {
    const voices = [
      makeVoice('Microsoft David - English (United States)'),
      makeVoice('Microsoft Zira - English (United States)'),
      makeVoice('Microsoft Aria Online (Natural) - English (United States)'),
    ];

    const picked = selectMostNaturalBrowserVoice(voices);
    expect(picked?.name).toContain('Natural');
  });

  it('avoids David/Zira/Mark when another English voice exists', () => {
    const voices = [
      makeVoice('Microsoft David Desktop'),
      makeVoice('Alex Custom English'),
    ];

    const picked = selectMostNaturalBrowserVoice(voices);
    expect(picked?.name).toBe('Alex Custom English');
  });

  it('prefers English voices over non-English voices', () => {
    const voices = [
      makeVoice('Google Français', 'fr-FR'),
      makeVoice('Google UK English Female', 'en-GB'),
    ];

    const picked = selectMostNaturalBrowserVoice(voices);
    expect(picked?.lang).toBe('en-GB');
  });
});

describe('elevenLabsTts service & persistence', () => {
  beforeEach(() => {
    window.localStorage.clear();
    clearAudioCache();
  });

  afterEach(() => {
    clearAudioCache();
    vi.restoreAllMocks();
    vi.unstubAllGlobals();
  });

  it('persists voice settings in localStorage with defaults', () => {
    const initial = getVoiceSettings();
    expect(initial.voiceId).toBe(DEFAULT_ELEVENLABS_VOICE_ID);
    expect(initial.modelId).toBe(DEFAULT_ELEVENLABS_MODEL_ID);
    expect(initial.autoRead).toBe(true);
    expect(initial.apiKey).toBe('');

    const targetPreset = ELEVENLABS_VOICE_PRESETS[1];
    saveVoiceSettings({
      voiceId: targetPreset.id,
      modelId: 'eleven_flash_v2_5',
      autoRead: false,
      apiKey: 'sk_test_123',
    });

    const reloaded = getVoiceSettings();
    expect(reloaded.voiceId).toBe(targetPreset.id);
    expect(reloaded.modelId).toBe('eleven_flash_v2_5');
    expect(reloaded.autoRead).toBe(false);
    expect(reloaded.apiKey).toBe('sk_test_123');
  });

  it('calls ElevenLabs API directly with xi-api-key and caches repeated prompts', async () => {
    saveVoiceSettings({
      apiKey: 'sk_direct_test',
      voiceId: 'JBFqnCBsd6RMkjVDRZzb',
      modelId: 'eleven_multilingual_v2',
    });

    let objectUrlCounter = 0;
    const createObjectURL = vi
      .spyOn(URL, 'createObjectURL')
      .mockImplementation(() => `blob:elevenlabs-audio-${++objectUrlCounter}`);
    vi.spyOn(URL, 'revokeObjectURL').mockImplementation(() => {});

    const fetchMock = vi.fn().mockResolvedValue(
      new Response(new Blob(['fake-mp3'], { type: 'audio/mpeg' }), {
        status: 200,
        headers: { 'content-type': 'audio/mpeg' },
      })
    );
    vi.stubGlobal('fetch', fetchMock);

    const first = await synthesizeSpeechAudio({
      text: '🚂 All aboard at 9:00!',
    });

    expect(first.provider).toBe('elevenlabs');
    expect(first.audioUrl).toBe('blob:elevenlabs-audio-1');
    expect(fetchMock).toHaveBeenCalledTimes(1);

    const [url, init] = fetchMock.mock.calls[0];
    expect(url).toBe('https://api.elevenlabs.io/v1/text-to-speech/JBFqnCBsd6RMkjVDRZzb');
    const headers = init?.headers as Record<string, string> | undefined;
    expect(headers?.['xi-api-key']).toBe('sk_direct_test');
    const parsedBody = JSON.parse(String(init?.body));
    expect(parsedBody.model_id).toBe('eleven_multilingual_v2');
    expect(parsedBody.text).toBe("All aboard at 9 o'clock!");
    expect(parsedBody.voice_settings.use_speaker_boost).toBe(true);

    // Second call with equivalent spoken prompt should reuse cached blob URL
    const second = await synthesizeSpeechAudio({
      text: 'All aboard at 9:00!',
    });
    expect(second.provider).toBe('elevenlabs');
    expect(second.audioUrl).toBe('blob:elevenlabs-audio-1');
    expect(fetchMock).toHaveBeenCalledTimes(1);
    expect(createObjectURL).toHaveBeenCalledTimes(1);
  });

  it('uses /api/tts server proxy when no client API key is stored and falls back gracefully on 501', async () => {
    const fetchProxySuccess = vi.fn().mockResolvedValue(
      new Response(new Blob(['proxy-mp3'], { type: 'audio/mpeg' }), {
        status: 200,
        headers: { 'content-type': 'audio/mpeg' },
      })
    );
    vi.spyOn(URL, 'createObjectURL').mockReturnValue('blob:proxy-audio-1');
    vi.spyOn(URL, 'revokeObjectURL').mockImplementation(() => {});
    vi.stubGlobal('fetch', fetchProxySuccess);

    const okRes = await synthesizeSpeechAudio({ text: 'Depart at 8:05' });
    expect(okRes.provider).toBe('elevenlabs');
    expect(okRes.audioUrl).toBe('blob:proxy-audio-1');
    expect(fetchProxySuccess).toHaveBeenCalledWith(
      '/api/tts',
      expect.objectContaining({ method: 'POST' })
    );

    // Clear cache and test 501 unconfigured proxy response -> graceful fallback
    clearAudioCache();
    const fetchUnconfigured = vi.fn().mockResolvedValue(
      new Response(JSON.stringify({ error: 'ELEVENLABS_NOT_CONFIGURED' }), {
        status: 501,
        headers: { 'content-type': 'application/json' },
      })
    );
    vi.stubGlobal('fetch', fetchUnconfigured);

    const fallbackRes = await synthesizeSpeechAudio({ text: 'Depart at 8:15' });
    expect(fallbackRes.provider).toBe('browser-natural');
    expect(fallbackRes.audioUrl).toBeNull();
    expect(fallbackRes.reason).toBe('not_configured');
  });

  it('reports invalid_api_key cleanly when ElevenLabs returns 401 or 400 Key ID error', async () => {
    saveVoiceSettings({ apiKey: 'sk_bad_key' });
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue(new Response('Unauthorized', { status: 401 }))
    );

    const res = await synthesizeSpeechAudio({ text: 'Hello' });
    expect(res.provider).toBe('browser-natural');
    expect(res.audioUrl).toBeNull();
    expect(res.reason).toBe('invalid_api_key');
    expect(res.errorMessage).toContain('rejected');

    // HTTP 400 when Key ID was sent through proxy or client
    saveVoiceSettings({ apiKey: '' });
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue(
        new Response(
          JSON.stringify({
            error: 'ELEVENLABS_UPSTREAM_ERROR',
            status: 400,
            details: JSON.stringify({
              detail: {
                status: 'api_key_id_used_as_api_key',
              },
            }),
          }),
          { status: 400, headers: { 'content-type': 'application/json' } }
        )
      )
    );

    const keyIdProxyRes = await synthesizeSpeechAudio({ text: 'Train departs' });
    expect(keyIdProxyRes.provider).toBe('browser-natural');
    expect(keyIdProxyRes.reason).toBe('invalid_api_key');
    expect(keyIdProxyRes.errorMessage).toContain('sk_');
  });

  it('detects 64-hex Key IDs client-side before wasting a network call', async () => {
    const fakeKeyId = 'a'.repeat(64);
    expect(isLikelyElevenLabsKeyId(fakeKeyId)).toBe(true);
    expect(isLikelyElevenLabsKeyId('sk_live_abc123')).toBe(false);

    saveVoiceSettings({ apiKey: fakeKeyId });
    const fetchMock = vi.fn();
    vi.stubGlobal('fetch', fetchMock);

    const res = await synthesizeSpeechAudio({ text: 'Hello' });
    expect(res.reason).toBe('invalid_api_key');
    expect(res.errorMessage).toContain('Key ID');
    expect(fetchMock).not.toHaveBeenCalled();
  });
});
