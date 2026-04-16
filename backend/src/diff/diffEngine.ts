import { DriftIssue } from '@alignui/shared';
import { ValidatedToken } from '../validators/tokenValidator';
import { ExtractedValue } from '../analyzer/codeAnalyzer';

export function detectDrift(
  tokens: ValidatedToken[],
  codeValues: ExtractedValue[]
): DriftIssue[] {
  const issues: DriftIssue[] = [];

  for (const token of tokens) {
    const matches = codeValues.filter((v) => v.type === token.type);

    for (const match of matches) {
      if (!valuesMatch(token.value, match.value)) {
        issues.push({
          tokenName: token.name,
          expected: token.value,
          actual: match.value,
          file: match.file,
          line: match.line,
        });
      }
    }
  }

  return issues;
}

// Normalize values before comparing (handles #FFF vs #ffffff, 16px vs 16, etc.)
function valuesMatch(expected: string, actual: string): boolean {
  return normalize(expected) === normalize(actual);
}

function normalize(value: string): string {
  return value
    .toLowerCase()
    .replace(/\s/g, '')
    .replace(/^#([0-9a-f])([0-9a-f])([0-9a-f])$/, '#$1$1$2$2$3$3') // expand shorthand hex
    .replace(/px$/, '');                                               // strip px unit
}
