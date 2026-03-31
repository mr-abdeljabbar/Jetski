import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import apiRouter from './api.js';

const __dirname = (typeof import.meta !== 'undefined' && import.meta.url) 
  ? path.dirname(fileURLToPath(import.meta.url)) 
  : '';

export async function createApp() {
  const app = express();

  app.use(cors());
  app.use(express.json());

  // API routes
  app.get('/api/ping', (req, res) => res.json({ status: 'ok' }));
  
  // On Netlify/Vercel, we handle the /api prefix carefully
  if (process.env.NETLIFY || process.env.VERCEL) {
    app.use('/api', apiRouter);
    app.use('/', apiRouter); // Fallback for some serverless configurations
  } else {
    app.use('/api', apiRouter);
  }

  // Vite middleware for development
  if (process.env.NODE_ENV !== 'production' && !process.env.NETLIFY && !process.env.VERCEL) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else if (!process.env.NETLIFY) {
    // Serve static files in production (except on Netlify which handles it via CDN)
    // Vercel also handles static files via its CDN, but for the Express app, 
    // it's safer to have the fallback if running as a single function.
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      const indexPath = path.join(distPath, 'index.html');
      res.sendFile(indexPath);
    });
  }

  return app;
}
