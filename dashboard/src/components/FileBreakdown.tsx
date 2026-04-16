import { DriftIssue } from '@alignui/shared';

interface FileBreakdownProps {
  issues: DriftIssue[];
}

export function FileBreakdown({ issues }: FileBreakdownProps) {
  const byFile = issues.reduce<Record<string, number>>((acc, issue) => {
    const key = issue.file.split('/').slice(-2).join('/');
    acc[key] = (acc[key] ?? 0) + 1;
    return acc;
  }, {});

  const sorted = Object.entries(byFile).sort((a, b) => b[1] - a[1]);
  const max = sorted[0]?.[1] ?? 1;

  if (sorted.length === 0) return null;

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5">
      <h2 className="text-sm font-semibold text-gray-700 mb-4">Issues by File</h2>
      <div className="flex flex-col gap-3">
        {sorted.map(([file, count]) => (
          <div key={file}>
            <div className="flex justify-between text-xs text-gray-600 mb-1">
              <span className="font-mono">{file}</span>
              <span className="font-semibold">{count}</span>
            </div>
            <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-orange-400 rounded-full transition-all"
                style={{ width: `${(count / max) * 100}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
