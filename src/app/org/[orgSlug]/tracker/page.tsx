import { notFound } from 'next/navigation';
import { getOrgBySlug, getOpportunitiesByMilestone } from '@/lib/db';
import { MILESTONE_STAGES } from '@/lib/constants';
import KanbanBoard from '@/components/KanbanBoard';

export default async function TrackerPage({ params }: { params: Promise<{ orgSlug: string }> }) {
  const { orgSlug } = await params;
  const org = await getOrgBySlug(orgSlug);
  if (!org) notFound();

  const grouped = await getOpportunitiesByMilestone(org.id);
  const milestones = MILESTONE_STAGES.map((m) => ({ id: m.stage, name: m.name }));

  const columns = milestones.map((m) => ({
    milestone: m,
    opportunities: grouped[m.id] ?? [],
  }));

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Implementation Tracker</h1>
        <p className="text-slate-500 mt-1">All automation opportunities by milestone stage</p>
      </div>
      <KanbanBoard columns={columns} />
    </div>
  );
}
