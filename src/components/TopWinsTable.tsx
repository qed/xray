import type { RankedOpportunity } from '@/lib/types';

interface TopWinsTableProps {
  wins: RankedOpportunity[];
}

const impactColors: Record<string, string> = {
  Critical: 'bg-red-500/20 text-red-400 border-red-500/30',
  'Very High': 'bg-orange-500/20 text-orange-400 border-orange-500/30',
  High: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
  Medium: 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30',
  Low: 'bg-slate-500/20 text-slate-400 border-slate-500/30',
};

export default function TopWinsTable({ wins }: TopWinsTableProps) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm text-left">
        <thead>
          <tr className="border-b border-slate-800 text-slate-400 text-xs uppercase tracking-wider">
            <th className="px-4 py-3">Rank</th>
            <th className="px-4 py-3">Opportunity</th>
            <th className="px-4 py-3">Department</th>
            <th className="px-4 py-3">Impact</th>
            <th className="px-4 py-3">Complexity</th>
            <th className="px-4 py-3">Effort</th>
            <th className="px-4 py-3">Time Savings</th>
            <th className="px-4 py-3">Stage</th>
          </tr>
        </thead>
        <tbody>
          {wins.map((win, i) => (
            <tr
              key={`${win.departmentSlug}-${win.rank}`}
              className="border-b border-slate-800/50 hover:bg-slate-800/30 transition-colors"
            >
              <td className="px-4 py-3 text-slate-500 font-mono">{i + 1}</td>
              <td className="px-4 py-3 text-white font-medium">{win.name}</td>
              <td className="px-4 py-3 text-slate-300">{win.departmentName}</td>
              <td className="px-4 py-3">
                <span
                  className={`inline-block px-2 py-0.5 rounded border text-xs font-medium ${impactColors[win.impact] ?? impactColors.Low}`}
                >
                  {win.impact}
                </span>
              </td>
              <td className="px-4 py-3 text-slate-300">{win.complexity}</td>
              <td className="px-4 py-3 text-slate-300">{win.effort}</td>
              <td className="px-4 py-3 text-slate-300">{win.estimatedTimeSavings}</td>
              <td className="px-4 py-3 text-slate-400">{win.milestoneName}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
