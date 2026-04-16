import { Request, Response } from 'express';
import { TokensPayloadSchema, ValidatedToken } from '../validators/tokenValidator';
import { TokenModel } from '../db/TokenModel';

export async function receiveTokens(req: Request, res: Response) {
  const result = TokensPayloadSchema.safeParse(req.body);

  if (!result.success) {
    res.status(400).json({
      error: 'Invalid token payload',
      details: result.error.flatten(),
    });
    return;
  }

  const tokens = result.data.tokens;

  // Upsert each token by name — keeps data fresh on every Figma export
  await Promise.all(
    tokens.map((token) =>
      TokenModel.findOneAndUpdate(
        { name: token.name },
        token,
        { upsert: true, new: true }
      )
    )
  );

  console.log(`[tokens] Upserted ${tokens.length} tokens`);
  res.json({ success: true, count: tokens.length });
}

export async function getTokens(_req: Request, res: Response) {
  const tokens = await TokenModel.find({}, { _id: 0, __v: 0, createdAt: 0, updatedAt: 0 });
  res.json({ tokens });
}

export async function getStoredTokens(): Promise<ValidatedToken[]> {
  return TokenModel.find({}, { _id: 0, __v: 0, createdAt: 0, updatedAt: 0 }).lean();
}
