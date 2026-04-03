import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import path from 'path';
import { fileURLToPath } from 'url';
import apiRouter from './_router.js';

const __dirname = (typeof import.meta !== 'undefined' && import.meta.url) 
  ? path.dirname(fileURLToPath(import.meta.url)) 
  : '';

export async function createApp() {
  const app = express();

  app.use(cors());
  app.use(cookieParser());
  app.use(express.json());

  // API routes
  app.get('/api/ping', (req, res) => res.json({ status: 'ok' }));
  
  // On Netlify, we handle the /api prefix carefully
  if (process.env.NETLIFY) {
    app.use('/api', apiRouter);
    app.use('/', apiRouter); // Fallback for some serverless configurations
  } else {
    app.use('/api', apiRouter);
  }

  // Vite middleware for development (local only, not on Netlify)
  if (process.env.NODE_ENV !== 'production' && !process.env.NETLIFY) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else if (!process.env.NETLIFY) {
    // Serve static files in production (except on Netlify which handles it via CDN)
    // Production fallback if running built app locally
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      const indexPath = path.join(distPath, 'index.html');
      res.sendFile(indexPath);
    });
  }

  return app;
}
