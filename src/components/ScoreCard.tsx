import type { MilestoneConfig } from '@/lib/types';

interface ScoreCardProps {
  totalOpportunities: number;
  byMilestoneStage: Record<number, number>;
  totalCompleted: number;
  milestones: MilestoneConfig[];
}

function StatCard({ label, value }: { label: string; value: number }) {
  return (
    <div className="bg-slate-50 border border-slate-200 rounded-xl p-6 flex flex-col items-center justify-center gap-2">
      <span className="text-3xl font-bold text-emerald-600">{value}</span>
      <span className="text-sm text-slate-500 text-center">{label}</span>
    </div>
  );
}

export default function ScoreCard({
  totalOpportunities,
  byMilestoneStage,
  totalCompleted,
  milestones,
}: ScoreCardProps) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
      <StatCard label="Total Opportunities" value={totalOpportunities} />
      {milestones.map((m) => (
        <StatCard
          key={m.id}
          label={m.name}
          value={byMilestoneStage[m.id] ?? 0}
        />
      ))}
      <StatCard label="Completed" value={totalCompleted} />
    </div>
  );
}
