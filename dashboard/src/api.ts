import { DesignToken, DriftIssue } from '@alignui/shared';

const API_KEY = import.meta.env.VITE_API_KEY ?? '';

async function apiFetch<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`/api${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': API_KEY,
      ...options?.headers,
    },
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error((err as { error?: string }).error ?? `Error ${res.status}`);
  }
  return res.json();
}

export const getTokens = () =>
  apiFetch<{ tokens: DesignToken[] }>('/tokens');

export const getIssues = () =>
  apiFetch<{ issues: DriftIssue[] }>('/issues');
