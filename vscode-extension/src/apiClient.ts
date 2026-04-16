import { DriftIssue } from '@alignui/shared';

export interface AnalyzeResponse {
  issues: DriftIssue[];
  scanned: number;
}

export async function analyzeFile(
  backendUrl: string,
  code: string,
  filePath: string
): Promise<AnalyzeResponse> {
  const res = await fetch(`${backendUrl}/api/analyze`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ code, filePath }),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error((err as { error?: string }).error ?? `Backend error: ${res.status}`);
  }

  return res.json() as Promise<AnalyzeResponse>;
}
