import { describe, it, expect } from 'vitest';
import { detectDrift } from '../diff/diffEngine';

const tokens = [
  { name: 'Brand/primary', type: 'color' as const, value: '#18a0fb', source: 'figma' as const },
  { name: 'Spacing/md', type: 'spacing' as const, value: '16', source: 'figma' as const },
];

describe('diffEngine', () => {
  it('detects a color mismatch', () => {
    const codeValues = [
      { type: 'color' as const, value: '#ff0000', file: 'Button.tsx', line: 5 },
    ];
    const issues = detectDrift(tokens, codeValues);
    expect(issues.length).toBeGreaterThan(0);
    expect(issues[0].tokenName).toBe('Brand/primary');
    expect(issues[0].expected).toBe('#18a0fb');
    expect(issues[0].actual).toBe('#ff0000');
  });

  it('returns no issues when values match', () => {
    const codeValues = [
      { type: 'color' as const, value: '#18a0fb', file: 'Button.tsx', line: 5 },
    ];
    const issues = detectDrift(tokens, codeValues);
    const colorIssues = issues.filter((i) => i.tokenName === 'Brand/primary');
    expect(colorIssues).toHaveLength(0);
  });

  it('normalizes hex shorthand (#fff → #ffffff)', () => {
    const shortTokens = [
      { name: 'Color/white', type: 'color' as const, value: '#ffffff', source: 'figma' as const },
    ];
    const codeValues = [
      { type: 'color' as const, value: '#fff', file: 'App.tsx', line: 3 },
    ];
    const issues = detectDrift(shortTokens, codeValues);
    expect(issues).toHaveLength(0);
  });

  it('normalizes px units (16px → 16)', () => {
    const codeValues = [
      { type: 'spacing' as const, value: '16px', file: 'App.tsx', line: 8 },
    ];
    const issues = detectDrift(tokens, codeValues);
    const spacingIssues = issues.filter((i) => i.tokenName === 'Spacing/md');
    expect(spacingIssues).toHaveLength(0);
  });

  it('returns empty array when no tokens are stored', () => {
    const issues = detectDrift([], [
      { type: 'color' as const, value: '#fff', file: 'App.tsx', line: 1 },
    ]);
    expect(issues).toHaveLength(0);
  });
});
