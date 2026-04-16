import { Request, Response } from 'express';
import { z } from 'zod';
import { analyzeFile } from '../analyzer/codeAnalyzer';
import { detectDrift } from '../diff/diffEngine';
import { getStoredTokens } from './tokenController';

const AnalyzePayloadSchema = z.object({
  code: z.string().min(1),
  filePath: z.string().min(1),
});

export async function analyzeCode(req: Request, res: Response) {
  const result = AnalyzePayloadSchema.safeParse(req.body);

  if (!result.success) {
    res.status(400).json({ error: 'Invalid payload', details: result.error.flatten() });
    return;
  }

  const { code, filePath } = result.data;
  const tokens = await getStoredTokens();

  if (tokens.length === 0) {
    res.status(400).json({ error: 'No tokens stored. Export from Figma first.' });
    return;
  }

  const codeValues = analyzeFile(code, filePath);
  const issues = detectDrift(tokens, codeValues);

  console.log(`[analyze] ${issues.length} drift issues found in ${filePath}`);
  res.json({ issues, scanned: codeValues.length });
}
