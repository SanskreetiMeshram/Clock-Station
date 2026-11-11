import { handleTtsHttpRequest } from '../server/elevenLabsProxy.mjs';

export default async function handler(req, res) {
  await handleTtsHttpRequest(req, res);
}
