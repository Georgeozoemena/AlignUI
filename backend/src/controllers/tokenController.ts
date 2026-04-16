import { Request, Response } from 'express';
import { DesignToken } from '@alignui/shared';

// In-memory store for now
let tokenStore: DesignToken[] = [];

export function receiveTokens(req: Request, res: Response) {
  const tokens: DesignToken[] = req.body.tokens;

  if (!Array.isArray(tokens)) {
    res.status(400).json({ error: 'tokens must be an array' });
    return;
  }

  tokenStore = tokens;
  console.log(`Received ${tokens.length} tokens`);
  res.json({ success: true, count: tokens.length });
}

export function getTokens(_req: Request, res: Response) {
  res.json({ tokens: tokenStore });
}
