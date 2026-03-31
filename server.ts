import path from 'path';
import { fileURLToPath } from 'url';
import { createApp } from './api/_app.js';

const isMain = process.argv[1] && 
  typeof import.meta !== 'undefined' && 
  import.meta.url && 
  (path.normalize(process.argv[1]) === path.normalize(fileURLToPath(import.meta.url)));

if (isMain) {
  const PORT = process.env.PORT || 3001;
  console.log('Starting local server...');
  createApp().then(app => {
    app.listen(Number(PORT), '0.0.0.0', () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  }).catch(err => {
    console.error('Error starting app:', err);
  });
}
