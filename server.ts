import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import apiRouter from './src/server/api';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export async function createApp() {
  const app = express();

  app.use(cors());
  app.use(express.json());

  // API routes
  app.get('/api/ping', (req, res) => res.json({ status: 'ok' }));
  
  // On Netlify, the /api prefix is already handled by the redirect,
  // so the function receives the path starting from /activities etc.
  if (process.env.NETLIFY) {
    app.use('/', apiRouter);
    app.use('/api', apiRouter); // Fallback
  } else {
    app.use('/api', apiRouter);
  }

  // Vite middleware for development
  if (process.env.NODE_ENV !== 'production' && !process.env.NETLIFY) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else if (!process.env.NETLIFY) {
    // Only serve static files if NOT on Netlify
    // Netlify handles static files via the "publish" directory and redirects
    const distPath = path.join(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  return app;
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const PORT = process.env.PORT || 3001;
  createApp().then(app => {
    app.listen(Number(PORT), '0.0.0.0', () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  });
}
