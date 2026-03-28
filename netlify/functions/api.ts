import serverless from 'serverless-http';
import { createApp } from '../../server';

let cachedHandler: any;

export const handler: any = async (event: any, context: any) => {
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
