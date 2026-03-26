import { getUnfiledRankedOpportunities } from '@/lib/aggregator';
import MissingGapsTable from '@/components/MissingGapsTable';

export default function UnfiledPage() {
  const unfiled = getUnfiledRankedOpportunities();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-slate-900 tracking-tight">
          Missing Gaps
        </h1>
        <p className="text-slate-500 mt-1">
          Priorities missing valid time estimates in hours/week
        </p>
      </div>

      {unfiled.length === 0 ? (
        <div className="bg-slate-50 border border-emerald-200 rounded-xl p-8 text-center">
          <p className="text-emerald-600 text-lg font-medium">
            All priorities have valid time estimates
          </p>
          <p className="text-slate-500 mt-2 text-sm">
            Every priority has a valid hours/week value.
          </p>
        </div>
      ) : (
        <div className="bg-slate-50 border border-slate-200 rounded-xl p-6">
          <p className="text-amber-700 text-sm mb-4">
            {unfiled.length} {unfiled.length === 1 ? 'priority needs' : 'priorities need'} a valid hours/week estimate.
            Update the markdown files and reload.
          </p>
          <MissingGapsTable opportunities={unfiled} />
        </div>
      )}
    </div>
  );
}
