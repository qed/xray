import { notFound } from 'next/navigation';
import { getOrgBySlug, getUnfiledRankedOpportunities, getTopWins } from '@/lib/db';
import GapCardList from '@/components/GapCardList';

export default async function UnfiledPage({ params }: { params: Promise<{ orgSlug: string }> }) {
  const { orgSlug } = await params;
  const org = await getOrgBySlug(orgSlug);
  if (!org) notFound();

  const unfiled = await getUnfiledRankedOpportunities(org.id);
  const all = await getTopWins(org.id, 1000);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Missing Gaps</h1>
        <p className="text-slate-500 mt-1">Fill in missing data to complete your priorities</p>
      </div>

      {unfiled.length === 0 ? (
        <div className="bg-slate-50 border border-emerald-200 rounded-xl p-8 text-center">
          <p className="text-emerald-600 text-lg font-medium">All priorities are complete</p>
          <p className="text-slate-500 mt-2 text-sm">Every priority has all 10 required fields filled in.</p>
        </div>
      ) : (
        <GapCardList priorities={unfiled} totalPriorities={all.length} />
      )}
    </div>
  );
}
