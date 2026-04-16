import { parse } from '@babel/parser';
import traverse from '@babel/traverse';
import * as t from '@babel/types';

export interface ExtractedValue {
  type: 'color' | 'spacing' | 'typography' | 'border-radius';
  value: string;
  file: string;
  line: number;
}

// Tailwind class patterns mapped to token types
const TAILWIND_PATTERNS: Record<string, ExtractedValue['type']> = {
  'text-': 'color',
  'bg-': 'color',
  'border-': 'color',
  'p-': 'spacing',
  'px-': 'spacing',
  'py-': 'spacing',
  'm-': 'spacing',
  'mx-': 'spacing',
  'my-': 'spacing',
  'gap-': 'spacing',
  'rounded': 'border-radius',
  'text-sm': 'typography',
  'text-base': 'typography',
  'text-lg': 'typography',
  'text-xl': 'typography',
  'font-': 'typography',
};

export function analyzeFile(code: string, filePath: string): ExtractedValue[] {
  const results: ExtractedValue[] = [];

  let ast;
  try {
    ast = parse(code, {
      sourceType: 'module',
      plugins: ['jsx', 'typescript'],
    });
  } catch {
    console.warn(`[analyzer] Failed to parse ${filePath}`);
    return results;
  }

  traverse(ast, {
    JSXAttribute(path) {
      // Extract className values for Tailwind analysis
      if (!t.isJSXIdentifier(path.node.name, { name: 'className' })) return;

      const value = path.node.value;
      const line = path.node.loc?.start.line ?? 0;

      if (t.isStringLiteral(value)) {
        extractTailwindClasses(value.value, filePath, line, results);
      }
    },

    // Extract inline style values
    ObjectProperty(path) {
      if (!t.isIdentifier(path.node.key)) return;

      const key = path.node.key.name;
      const val = path.node.value;
      const line = path.node.loc?.start.line ?? 0;

      if (!t.isStringLiteral(val) && !t.isNumericLiteral(val)) return;

      const rawValue = String(val.value);

      if (['color', 'backgroundColor', 'borderColor'].includes(key)) {
        results.push({ type: 'color', value: rawValue, file: filePath, line });
      } else if (['padding', 'margin', 'gap', 'width', 'height'].includes(key)) {
        results.push({ type: 'spacing', value: rawValue, file: filePath, line });
      } else if (['borderRadius'].includes(key)) {
        results.push({ type: 'border-radius', value: rawValue, file: filePath, line });
      } else if (['fontSize', 'fontWeight', 'fontFamily'].includes(key)) {
        results.push({ type: 'typography', value: rawValue, file: filePath, line });
      }
    },
  });

  return results;
}

function extractTailwindClasses(
  className: string,
  file: string,
  line: number,
  results: ExtractedValue[]
) {
  const classes = className.split(' ');
  for (const cls of classes) {
    for (const [prefix, type] of Object.entries(TAILWIND_PATTERNS)) {
      if (cls.startsWith(prefix) || cls === prefix.replace('-', '')) {
        results.push({ type, value: cls, file, line });
        break;
      }
    }
  }
}
