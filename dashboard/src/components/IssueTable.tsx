import { DriftIssue } from '@alignui/shared';

interface IssueTableProps {
  issues: DriftIssue[];
}

const TYPE_COLORS: Record<string, string> = {
  color: 'bg-red-100 text-red-700',
  spacing: 'bg-yellow-100 text-yellow-700',
  typography: 'bg-blue-100 text-blue-700',
  'border-radius': 'bg-purple-100 text-purple-700',
};

export function IssueTable({ issues }: IssueTableProps) {
  if (issues.length === 0) {
    return (
      <div className="text-center py-12 text-gray-400">
        No drift issues found. Your code is in sync with Figma.
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-xl border border-gray-200">
      <table className="w-full text-sm">
        <thead className="bg-gray-50 text-gray-500 text-left">
          <tr>
            <th className="px-4 py-3 font-medium">Token</th>
            <th className="px-4 py-3 font-medium">Expected</th>
            <th className="px-4 py-3 font-medium">Actual</th>
            <th className="px-4 py-3 font-medium">File</th>
            <th className="px-4 py-3 font-medium">Line</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100 bg-white">
          {issues.map((issue, i) => (
            <tr key={i} className="hover:bg-gray-50 transition-colors">
              <td className="px-4 py-3 font-medium text-gray-800">{issue.tokenName}</td>
              <td className="px-4 py-3">
                <ValueBadge value={issue.expected} />
              </td>
              <td className="px-4 py-3">
                <ValueBadge value={issue.actual} mismatch />
              </td>
              <td className="px-4 py-3 text-gray-500 font-mono text-xs">
                {issue.file.split('/').slice(-2).join('/')}
              </td>
              <td className="px-4 py-3 text-gray-400">{issue.line}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function ValueBadge({ value, mismatch = false }: { value: string; mismatch?: boolean }) {
  const isColor = /^#[0-9a-fA-F]{3,6}$/.test(value);
  return (
    <span className={`inline-flex items-center gap-1.5 font-mono text-xs px-2 py-1 rounded ${mismatch ? 'bg-red-50 text-red-700' : 'bg-green-50 text-green-700'}`}>
      {isColor && (
        <span
          className="w-3 h-3 rounded-sm border border-gray-200 inline-block"
          style={{ background: value }}
        />
      )}
      {value}
    </span>
  );
}
