import { Request, Response } from 'express';
import { TokensPayloadSchema, ValidatedToken } from '../validators/tokenValidator';

// In-memory store — will be replaced with MongoDB
let tokenStore: ValidatedToken[] = [];

export function getStoredTokens(): ValidatedToken[] {
  return tokenStore;
}

export function receiveTokens(req: Request, res: Response) {
  const result = TokensPayloadSchema.safeParse(req.body);

  if (!result.success) {
    res.status(400).json({
      error: 'Invalid token payload',
      details: result.error.flatten(),
    });
    return;
  }

  tokenStore = result.data.tokens;
  console.log(`[tokens] Stored ${tokenStore.length} tokens`);
  res.json({ success: true, count: tokenStore.length });
}

export function getTokens(_req: Request, res: Response) {
  res.json({ tokens: tokenStore });
}
