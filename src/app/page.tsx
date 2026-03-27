import Link from 'next/link';
import { getTopWins } from '@/lib/aggregator';
import PrioritiesTable from '@/components/PrioritiesTable';

export const dynamic = 'force-dynamic';

export default function Home() {
  const allOpportunities = getTopWins(100);
  const valid = allOpportunities.filter((o) => o.parsedTimeSavings.valid);
  const unfiledCount = allOpportunities.length - valid.length;

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

      {/* Missing gaps banner */}
      {unfiledCount > 0 && (
        <div className="bg-amber-50 border border-amber-200 rounded-lg px-4 py-3">
          <p className="text-amber-800 text-sm">
            {unfiledCount} {unfiledCount === 1 ? 'priority is' : 'priorities are'} missing hours/week estimates.{' '}
            <Link href="/unfiled" className="font-medium underline hover:text-amber-900">
              View Missing Gaps
            </Link>{' '}
            to resolve them.
          </p>
        </div>
      )}

      {/* Priorities Table */}
      <div className="bg-slate-50 border border-slate-200 rounded-xl p-6">
        <h2 className="text-lg font-semibold text-slate-900 mb-4">
          All Priorities
        </h2>
        <PrioritiesTable opportunities={valid} />
      </div>
    </div>
  );
}
