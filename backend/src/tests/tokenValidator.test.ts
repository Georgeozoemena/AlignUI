import { describe, it, expect } from 'vitest';
import { TokensPayloadSchema } from '../validators/tokenValidator';

describe('TokensPayloadSchema', () => {
  it('accepts a valid token payload', () => {
    const result = TokensPayloadSchema.safeParse({
      tokens: [
        { name: 'Button/color', type: 'color', value: '#18a0fb', source: 'figma' },
      ],
    });
    expect(result.success).toBe(true);
  });

  it('rejects empty tokens array', () => {
    const result = TokensPayloadSchema.safeParse({ tokens: [] });
    expect(result.success).toBe(false);
  });

  it('rejects invalid token type', () => {
    const result = TokensPayloadSchema.safeParse({
      tokens: [{ name: 'x', type: 'shadow', value: '2px', source: 'figma' }],
    });
    expect(result.success).toBe(false);
  });

  it('rejects wrong source', () => {
    const result = TokensPayloadSchema.safeParse({
      tokens: [{ name: 'x', type: 'color', value: '#fff', source: 'sketch' }],
    });
    expect(result.success).toBe(false);
  });

  it('rejects missing name', () => {
    const result = TokensPayloadSchema.safeParse({
      tokens: [{ type: 'color', value: '#fff', source: 'figma' }],
    });
    expect(result.success).toBe(false);
  });
});
