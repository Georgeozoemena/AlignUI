export interface DesignToken {
  name: string;
  type: 'color' | 'spacing' | 'typography' | 'border-radius';
  value: string;
  source: 'figma';
}

export interface DriftIssue {
  tokenName: string;
  expected: string;
  actual: string;
  file: string;
  line: number;
}
