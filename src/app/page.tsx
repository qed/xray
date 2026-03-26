import { getTopWins } from '@/lib/aggregator';
import PrioritiesTable from '@/components/PrioritiesTable';

export default function Home() {
  const allOpportunities = getTopWins(100);

  return (
    <div className="space-y-10">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-slate-900 tracking-tight">
          AI Priorities
        </h1>
        <p className="text-slate-500 mt-1">
          Automation opportunities ranked by impact
        </p>
      </div>

      {/* Priorities Table */}
      <div className="bg-slate-50 border border-slate-200 rounded-xl p-6">
        <h2 className="text-lg font-semibold text-slate-900 mb-4">
          All Priorities
        </h2>
        <PrioritiesTable opportunities={allOpportunities} />
      </div>
    </div>
  );
}
