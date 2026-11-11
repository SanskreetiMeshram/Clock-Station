import type { IncomingMessage, ServerResponse } from 'node:http';

export interface TtsEnvConfig {
  apiKey?: string;
  voiceId?: string;
  modelId?: string;
}

export function handleTtsHttpRequest(
  req: IncomingMessage & { body?: unknown },
  res: ServerResponse,
  envConfig?: TtsEnvConfig
): Promise<void>;
