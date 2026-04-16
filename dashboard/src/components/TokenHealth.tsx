import { DesignToken } from '@alignui/shared';

interface TokenHealthProps {
  tokens: DesignToken[];
  issueCount: number;
}

export function TokenHealth({ tokens, issueCount }: TokenHealthProps) {
  const byType = tokens.reduce<Record<string, number>>((acc, t) => {
    acc[t.type] = (acc[t.type] ?? 0) + 1;
    return acc;
  }, {});

  const healthScore = tokens.length === 0
    ? 100
    : Math.max(0, Math.round(((tokens.length - issueCount) / tokens.length) * 100));

  const scoreColor = healthScore >= 80
    ? 'text-green-600'
    : healthScore >= 50
    ? 'text-yellow-500'
    : 'text-red-500';

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5">
      <h2 className="text-sm font-semibold text-gray-700 mb-4">Token Health</h2>
      <div className={`text-5xl font-bold mb-1 ${scoreColor}`}>{healthScore}%</div>
      <p className="text-xs text-gray-400 mb-4">tokens in sync with code</p>
      <div className="flex flex-col gap-2">
        {Object.entries(byType).map(([type, count]) => (
          <div key={type} className="flex justify-between text-xs text-gray-600">
            <span className="capitalize">{type}</span>
            <span className="font-semibold">{count} tokens</span>
          </div>
        ))}
      </div>
    </div>
  );
}
