import serverless from 'serverless-http';
import { createApp } from '../../server';

let cachedHandler: any;

export const handler: any = async (event: any, context: any) => {
  try {
    if (!cachedHandler) {
      const app = await createApp();
      cachedHandler = serverless(app);
    }
    return await cachedHandler(event, context);
  } catch (error) {
    console.error('Netlify function error:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Internal Server Error', details: error instanceof Error ? error.message : String(error) }),
    };
  }
};
