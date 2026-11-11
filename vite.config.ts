import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { handler as instagramHandler } from './netlify/functions/instagram.js';

export default defineConfig({
  plugins: [
    react(),
    {
      name: 'instagram-proxy-middleware',
      configureServer(server) {
        server.middlewares.use(async (req, res, next) => {
          if (req.url && (req.url.startsWith('/api/instagram') || req.url.startsWith('/.netlify/functions/instagram'))) {
            const urlObj = new URL(req.url, 'http://localhost:3000');
            const handle = urlObj.searchParams.get('handle') || '';
            const sessionId = urlObj.searchParams.get('sessionId') || (req.headers['x-ig-session-id'] as string) || '';

            const event = {
              httpMethod: req.method || 'GET',
              queryStringParameters: { handle, sessionId },
              headers: req.headers as Record<string, string>
            };

            try {
              const response = await instagramHandler(event);
              res.statusCode = response.statusCode;
              if (response.headers) {
                Object.entries(response.headers).forEach(([k, v]) => {
                  res.setHeader(k, v as string);
                });
              }
              res.end(response.body);
            } catch (err: any) {
              res.statusCode = 500;
              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify({ success: false, error: err.message }));
            }
            return;
          }
          next();
        });
      }
    }
  ],
  server: {
    port: 3000,
    open: false
  }
});
