import { describe, it, expect } from 'vitest';
import { analyzeFile } from '../analyzer/codeAnalyzer';

const SAMPLE_COMPONENT = `
import React from 'react';

export function Button() {
  return (
    <button
      className="bg-blue-500 px-4 rounded text-white font-bold"
      style={{ color: '#ff0000', padding: '8px', borderRadius: '4px' }}
    >
      Click me
    </button>
  );
}
`;

describe('codeAnalyzer', () => {
  it('extracts Tailwind color classes', () => {
    const values = analyzeFile(SAMPLE_COMPONENT, 'Button.tsx');
    const colors = values.filter((v) => v.type === 'color');
    expect(colors.some((v) => v.value === 'bg-blue-500')).toBe(true);
  });

  it('extracts Tailwind spacing classes', () => {
    const values = analyzeFile(SAMPLE_COMPONENT, 'Button.tsx');
    const spacing = values.filter((v) => v.type === 'spacing');
    expect(spacing.some((v) => v.value === 'px-4')).toBe(true);
  });

  it('extracts inline style color values', () => {
    const values = analyzeFile(SAMPLE_COMPONENT, 'Button.tsx');
    const colors = values.filter((v) => v.type === 'color');
    expect(colors.some((v) => v.value === '#ff0000')).toBe(true);
  });

  it('extracts inline style spacing values', () => {
    const values = analyzeFile(SAMPLE_COMPONENT, 'Button.tsx');
    const spacing = values.filter((v) => v.type === 'spacing');
    expect(spacing.some((v) => v.value === '8px')).toBe(true);
  });

  it('returns empty array for non-JSX code', () => {
    const values = analyzeFile('const x = 1;', 'util.ts');
    expect(values).toHaveLength(0);
  });

  it('handles parse errors gracefully', () => {
    const values = analyzeFile('this is not valid code }{{{', 'broken.tsx');
    expect(values).toHaveLength(0);
  });
});
