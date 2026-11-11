import react from '@vitejs/plugin-react'
import { loadEnv, type Plugin } from 'vite'
import { defineConfig } from 'vitest/config'
import { handleTtsHttpRequest } from './server/elevenLabsProxy.mjs'

function elevenLabsDevPlugin(): Plugin {
  return {
    name: 'elevenlabs-tts-dev-proxy',
    configureServer(server) {
      server.middlewares.use('/api/tts', (req, res) => {
        const env = loadEnv(server.config.mode, process.cwd(), '');
        void handleTtsHttpRequest(req, res, {
          apiKey: env.ELEVENLABS_API_KEY,
          voiceId: env.ELEVENLABS_VOICE_ID,
          modelId: env.ELEVENLABS_MODEL_ID,
        });
      });
    },
  };
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), elevenLabsDevPlugin()],
  test: {
    globals: true,
    environment: 'happy-dom',
    setupFiles: './src/test/setup.ts',
  },
})
