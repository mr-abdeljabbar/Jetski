import { Request, Response, NextFunction } from 'express';

// Simple in-memory rate limiter (use Redis in production)
const requestCounts = new Map<string, { count: number; resetAt: number }>();

export const rateLimiter = (
  maxRequests: number,
  windowMs: number,
  message = 'Too many requests'
) => {
  return (req: Request, res: Response, next: NextFunction) => {
    // In serverless, IP detection can be tricky, but req.ip is standard.
    // Netlify also provides the client IP in x-forwarded-for.
    const key = req.headers['x-forwarded-for'] || req.socket.remoteAddress || 'unknown';
    const clientKey = Array.isArray(key) ? key[0] : key;
    
    const now = Date.now();
    const record = requestCounts.get(clientKey);

    if (!record || now > record.resetAt) {
      requestCounts.set(clientKey, { count: 1, resetAt: now + windowMs });
      return next();
    }

    if (record.count >= maxRequests) {
      return res.status(429).json({ error: message });
    }

    record.count++;
    next();
  };
};
