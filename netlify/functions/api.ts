import serverless from 'serverless-http';
import { createApp } from '../../server';

import fs from 'fs';
import path from 'path';

let cachedHandler: any;

export const handler: any = async (event: any, context: any) => {
  // Diagnostic logs appearing in Netlify Function Logs
  console.log('--- Netlify Function Invocation ---');
  console.log('Path:', event.path);
  console.log('DATABASE_URL present:', !!process.env.DATABASE_URL);
  
  const prismaPath = path.join(process.cwd(), 'node_modules/.prisma/client');
  if (fs.existsSync(prismaPath)) {
    console.log('Prisma client dir exists:', prismaPath);
    try {
      const files = fs.readdirSync(prismaPath);
      console.log('Prisma dir files:', files.filter(f => f.includes('engine') || f.endsWith('.js')));
    } catch (e) {}
  } else {
    console.warn('CRITICAL: Prisma client dir NOT found at:', prismaPath);
  }

  // Set context to never time out if possible (Netlify limit is 10s default)
  context.callbackWaitsForEmptyEventLoop = false;

  try {
    if (!cachedHandler) {
      console.log('Initializing Express app for Netlify...');
      const app = await createApp();
      cachedHandler = serverless(app);
      console.log('Express app initialized.');
    }
    
    const response = await cachedHandler(event, context);
    return response;
  } catch (error) {
    console.error('Netlify function critical error:', error);
    return {
      statusCode: 502, // Explicitly return 502 with details if caught
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        error: 'Bad Gateway', 
        message: 'The server encountered an error while processing the request.',
        details: error instanceof Error ? error.message : String(error) 
      }),
    };
  }
};
