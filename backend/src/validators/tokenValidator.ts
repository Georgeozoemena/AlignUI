import { z } from 'zod';

export const DesignTokenSchema = z.object({
  name: z.string().min(1),
  type: z.enum(['color', 'spacing', 'typography', 'border-radius']),
  value: z.string().min(1),
  source: z.literal('figma'),
});

export const TokensPayloadSchema = z.object({
  tokens: z.array(DesignTokenSchema).min(1),
});

export type ValidatedToken = z.infer<typeof DesignTokenSchema>;
