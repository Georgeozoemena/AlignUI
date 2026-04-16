import { useEffect, useState } from 'react';
import type { DriftIssue, DesignToken } from './types';
import { getTokens, getIssues } from './api';
import { StatCard } from './components/StatCard';
import { IssueTable } from './components/IssueTable';
import { FileBreakdown } from './components/FileBreakdown';
import { TokenHealth } from './components/TokenHealth';

export default function App() {
  const [tokens, setTokens] = useState<DesignToken[]>([]);
  const [issues, setIssues] = useState<DriftIssue[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState('');

  async function load() {
    setLoading(true);
    setError(null);
    try {
      const [t, i] = await Promise.all([getTokens(), getIssues()]);
      setTokens(t.tokens);
      setIssues(i.issues);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load data');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { load(); }, []);

  const filtered = issues.filter(
    (i) =>
      i.tokenName.toLowerCase().includes(filter.toLowerCase()) ||
      i.file.toLowerCase().includes(filter.toLowerCase())
  );

  const affectedFiles = new Set(issues.map((i) => i.file)).size;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-7 h-7 bg-blue-500 rounded-lg" />
          <span className="font-semibold text-gray-900">AlignUI</span>
          <span className="text-gray-400 text-sm">Design Drift Dashboard</span>
        </div>
        <button
          onClick={load}
          className="text-sm px-3 py-1.5 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors text-gray-600"
        >
          Refresh
        </button>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-8 flex flex-col gap-6">
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl px-4 py-3 text-sm">
            {error} — Is the backend running and API key set?
          </div>
        )}

        {loading ? (
          <div className="text-center py-20 text-gray-400">Loading...</div>
        ) : (
          <>
            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <StatCard label="Total Tokens" value={tokens.length} />
              <StatCard
                label="Drift Issues"
                value={issues.length}
                color={issues.length > 0 ? 'text-red-500' : 'text-green-600'}
              />
              <StatCard label="Affected Files" value={affectedFiles} />
              <StatCard
                label="Sync Score"
                value={
                  tokens.length === 0
                    ? '100%'
                    : `${Math.max(0, Math.round(((tokens.length - issues.length) / tokens.length) * 100))}%`
                }
                color="text-blue-600"
              />
            </div>

            {/* Health + File Breakdown */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <TokenHealth tokens={tokens} issueCount={issues.length} />
              <FileBreakdown issues={issues} />
            </div>

            {/* Issues Table */}
            <div className="flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <h2 className="font-semibold text-gray-800">All Drift Issues</h2>
                <input
                  type="text"
                  placeholder="Filter by token or file..."
                  value={filter}
                  onChange={(e) => setFilter(e.target.value)}
                  className="text-sm border border-gray-200 rounded-lg px-3 py-1.5 w-64 focus:outline-none focus:ring-2 focus:ring-blue-200"
                />
              </div>
              <IssueTable issues={filtered} />
            </div>
          </>
        )}
      </main>
    </div>
  );
}
