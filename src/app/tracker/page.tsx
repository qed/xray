import { getOpportunitiesByMilestone } from '@/lib/aggregator';
import { getMilestones } from '@/lib/parser';
import KanbanBoard from '@/components/KanbanBoard';

export default function TrackerPage() {
  const milestones = getMilestones();
  const grouped = getOpportunitiesByMilestone();

  const columns = milestones.map((m) => ({
    milestone: m,
    opportunities: grouped[m.id] ?? [],
  }));

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-slate-900 tracking-tight">
          Implementation Tracker
        </h1>
        <p className="text-slate-500 mt-1">
          All automation opportunities by milestone stage
        </p>
      </div>
      <KanbanBoard columns={columns} />
    </div>
  );
}
