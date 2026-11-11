const DEFAULT_VOICE_ID = 'JBFqnCBsd6RMkjVDRZzb';
const DEFAULT_MODEL_ID = 'eleven_multilingual_v2';

const VOICE_SETTINGS_BY_ID = {
  JBFqnCBsd6RMkjVDRZzb: { stability: 0.42, similarity_boost: 0.8, style: 0.35, use_speaker_boost: true },
  EXAVITQu4vr4xnSDxMaL: { stability: 0.45, similarity_boost: 0.78, style: 0.3, use_speaker_boost: true },
  Xb7hH8MSUJpSbSDYk0k2: { stability: 0.48, similarity_boost: 0.8, style: 0.25, use_speaker_boost: true },
  '21m00Tcm4TlvDq8ikWAM': { stability: 0.46, similarity_boost: 0.78, style: 0.25, use_speaker_boost: true },
};

const DEFAULT_VOICE_SETTINGS = {
  stability: 0.45,
  similarity_boost: 0.78,
  style: 0.3,
  use_speaker_boost: true,
};

/**
 * Shared Node HTTP / Vercel handler logic for /api/tts.
 * Keeps ELEVENLABS_API_KEY server-side across Vercel and local Vite dev server.
 */
export async function handleTtsHttpRequest(req, res, envConfig = {}) {
  const apiKey = (
    envConfig.apiKey ||
    process.env.ELEVENLABS_API_KEY ||
    ''
  ).trim();
  const looksLikeKeyId =
    /^[0-9a-f]{48,64}$/i.test(apiKey) && !apiKey.startsWith('sk_');
  const defaultVoiceId =
    (envConfig.voiceId || process.env.ELEVENLABS_VOICE_ID || DEFAULT_VOICE_ID).trim();
  const defaultModelId =
    (envConfig.modelId || process.env.ELEVENLABS_MODEL_ID || DEFAULT_MODEL_ID).trim();

  if (req.method === 'GET') {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    res.end(
      JSON.stringify({
        configured: Boolean(apiKey) && !looksLikeKeyId,
        defaultVoiceId,
        defaultModelId,
      })
    );
    return;
  }

  if (req.method !== 'POST') {
    res.statusCode = 405;
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify({ error: 'METHOD_NOT_ALLOWED' }));
    return;
  }

  if (!apiKey) {
    res.statusCode = 501;
    res.setHeader('Content-Type', 'application/json');
    res.end(
      JSON.stringify({
        error: 'ELEVENLABS_NOT_CONFIGURED',
        message: 'Set ELEVENLABS_API_KEY in .env.local or Vercel Environment Variables.',
      })
    );
    return;
  }

  let body = req.body;
  if (!body || typeof body === 'string') {
    try {
      const raw =
        typeof body === 'string'
          ? body
          : await new Promise((resolve, reject) => {
              const chunks = [];
              req.on('data', (chunk) => chunks.push(chunk));
              req.on('end', () => resolve(Buffer.concat(chunks).toString('utf8')));
              req.on('error', reject);
            });
      body = raw ? JSON.parse(raw) : {};
    } catch {
      res.statusCode = 400;
      res.setHeader('Content-Type', 'application/json');
      res.end(JSON.stringify({ error: 'INVALID_JSON' }));
      return;
    }
  }

  const text = typeof body.text === 'string' ? body.text.trim() : '';
  if (!text) {
    res.statusCode = 400;
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify({ error: 'TEXT_REQUIRED' }));
    return;
  }

  const trimmedText = text.slice(0, 600);
  const voiceId =
    typeof body.voiceId === 'string' && /^[a-zA-Z0-9_-]{8,64}$/.test(body.voiceId)
      ? body.voiceId
      : defaultVoiceId;
  const modelId =
    typeof body.modelId === 'string' && body.modelId.trim()
      ? body.modelId.trim()
      : defaultModelId;
  const voiceSettings = VOICE_SETTINGS_BY_ID[voiceId] || DEFAULT_VOICE_SETTINGS;

  try {
    const upstream = await fetch(
      `https://api.elevenlabs.io/v1/text-to-speech/${encodeURIComponent(voiceId)}`,
      {
        method: 'POST',
        headers: {
          'xi-api-key': apiKey,
          'Content-Type': 'application/json',
          Accept: 'audio/mpeg',
        },
        body: JSON.stringify({
          text: trimmedText,
          model_id: modelId,
          voice_settings: voiceSettings,
        }),
      }
    );

    if (!upstream.ok) {
      const errText = await upstream.text().catch(() => '');
      res.statusCode = upstream.status;
      res.setHeader('Content-Type', 'application/json');
      res.end(
        JSON.stringify({
          error: 'ELEVENLABS_UPSTREAM_ERROR',
          status: upstream.status,
          details: errText.slice(0, 300),
        })
      );
      return;
    }

    const audioArrayBuffer = await upstream.arrayBuffer();
    res.statusCode = 200;
    res.setHeader('Content-Type', 'audio/mpeg');
    res.setHeader('Cache-Control', 'private, max-age=3600');
    res.end(Buffer.from(audioArrayBuffer));
  } catch (err) {
    res.statusCode = 502;
    res.setHeader('Content-Type', 'application/json');
    res.end(
      JSON.stringify({
        error: 'ELEVENLABS_NETWORK_ERROR',
        message: err instanceof Error ? err.message : 'Failed to reach ElevenLabs',
      })
    );
  }
}
