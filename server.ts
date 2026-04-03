import path from 'path';
import { fileURLToPath } from 'url';
import express from 'express';
import { createApp } from './api/_app.js';

const isMain = process.argv[1] && 
  typeof import.meta !== 'undefined' && 
  import.meta.url && 
  (path.normalize(process.argv[1]) === path.normalize(fileURLToPath(import.meta.url)));

if (isMain) {
  const PORT = process.env.PORT || 3001;
  const isProd = process.env.NODE_ENV === 'production';
  
  console.log(`Starting local server in ${isProd ? 'production' : 'development'} mode...`);
  
  createApp().then(async app => {
    if (!isProd) {
      // Local development with Vite middleware
      const { createServer: createViteServer } = await import('vite');
      const vite = await createViteServer({
        server: { middlewareMode: true },
        appType: 'spa',
      });
      app.use(vite.middlewares);
      console.log('Vite development middleware enabled');
    } else {
      // Local production mode (serving dist/)
      const distPath = path.join(process.cwd(), 'dist');
      app.use(express.static(distPath));
      app.get('*', (req, res) => {
        res.sendFile(path.join(distPath, 'index.html'));
      });
      console.log('Production static serving enabled');
    }

    app.listen(Number(PORT), '0.0.0.0', () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  }).catch(err => {
    console.error('Error starting app:', err);
  });
}
