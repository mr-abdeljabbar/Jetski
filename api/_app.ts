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

  // Vite middleware and static serving logic has been moved out of this function 
  // to be handled by the entry points (server.ts for dev/local, Netlify for production).
  
  return app;
}
