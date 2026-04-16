import { Request, Response, NextFunction } from 'express';

export function requireApiKey(req: Request, res: Response, next: NextFunction) {
  const apiKey = req.headers['x-api-key'];
  const expected = process.env.API_KEY;

  if (!expected) {
    console.error('[auth] API_KEY environment variable is not set');
    res.status(500).json({ error: 'Server misconfiguration' });
    return;
  }

  if (!apiKey || apiKey !== expected) {
    res.status(401).json({ error: 'Unauthorized: invalid or missing API key' });
    return;
  }

  next();
}
