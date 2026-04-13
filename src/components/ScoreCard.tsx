interface ScoreCardProps {
  totalOpportunities: number;
  byStatus: Record<string, number>;
  totalCompleted: number;
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
  byStatus,
  totalCompleted,
}: ScoreCardProps) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
      <StatCard label="Total Opportunities" value={totalOpportunities} />
      <StatCard label="Not Started" value={byStatus['not_started'] ?? 0} />
      <StatCard label="In Progress" value={byStatus['in_progress'] ?? 0} />
      <StatCard label="Completed" value={totalCompleted} />
      <StatCard label="Proposed" value={byStatus['proposed'] ?? 0} />
    </div>
  );
}
