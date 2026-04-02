import serverless from 'serverless-http';
import { createApp } from '../../api/_app.js';

let handler: any;

export const handler: any = async (event: any, context: any) => {
  if (!handler) {
    const app = await createApp();
    handler = serverless(app);
  }
  return handler(event, context);
};
