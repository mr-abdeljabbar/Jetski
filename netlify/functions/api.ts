import serverless from 'serverless-http';
import { createApp } from '../../api/_app.js';

let _handler: any;

export const handler: any = async (event: any, context: any) => {
  if (!_handler) {
    const app = await createApp();
    _handler = serverless(app, {
      binary: ['application/pdf']
    });
  }
  return _handler(event, context);
};
